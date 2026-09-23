#!/usr/bin/env python3
"""Verify GOG macOS packages and install Tab5 Free Adventures over USB."""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import time
import zipfile

import serial


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PORT = "/dev/cu.usbmodem1101"
CONFIG = b"""[scummvm]\nextrapath=/sdcard/scummvm/\niconspath=/sdcard/scummvm/\nsavepath=/sdcard/scummvm/saves/\nthemepath=/sdcard/scummvm/\ngui_theme=tab5adv\nlastselectedgame=sky\n\n[sky]\ndescription=Beneath a Steel Sky (CD)\nengineid=sky\ngameid=sky\nlanguage=en\nplatform=dos\npath=/sdcard/games/bass/\n\n[queen]\ndescription=Flight of the Amazon Queen (CD)\nengineid=queen\ngameid=queen\nlanguage=en\nplatform=dos\npath=/sdcard/games/queen/\n"""
INSTALLING_MARKER = "games/.tab5adv-installing"
READY_MARKER = "games/.tab5adv-ready"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_manifest(name: str) -> dict:
    return json.loads((ROOT / "manifests" / name).read_text(encoding="utf-8"))


def verify_and_extract(package: Path, manifest: dict, destination: Path) -> dict[str, Path]:
    if not package.is_file():
        raise RuntimeError(f"Nie znaleziono paczki: {package}")
    if package.is_symlink():
        raise RuntimeError(f"Paczka nie może być dowiązaniem symbolicznym: {package}")
    package_hash = sha256_file(package)
    if package_hash != manifest["source_package"]["sha256"]:
        raise RuntimeError(f"Nieznana wersja {package.name}: SHA-256 {package_hash}")
    signature = subprocess.run(
        ["pkgutil", "--check-signature", str(package)],
        check=True,
        text=True,
        capture_output=True,
    ).stdout
    if not any(f"Developer ID Installer: {name} (9WS36Q8886)" in signature
               for name in ("GOG Sp. z o.o.", "GOG Poland sp. z o.o.")):
        raise RuntimeError(f"Paczka nie ma oczekiwanego podpisu GOG: {package}")
    subprocess.run(["pkgutil", "--expand-full", str(package), str(destination)], check=True)
    selected: dict[str, Path] = {}
    for spec in manifest["files"]:
        candidates = [path for path in destination.rglob(spec["name"]) if path.is_file()]
        for candidate in candidates:
            if candidate.stat().st_size == spec["size"] and sha256_file(candidate) == spec["sha256"]:
                selected[spec["name"]] = candidate
                break
        if spec["name"] not in selected:
            raise RuntimeError(f"Brak zweryfikowanego {spec['name']} w {package.name}")
    return selected


class Tab5Link:
    def __init__(self, port: str):
        self.serial = serial.Serial(port, 115200, timeout=0.2, write_timeout=5)

    def close(self) -> None:
        self.serial.close()

    def _send_line(self, line: str) -> None:
        self.serial.write((line + "\n").encode("ascii"))
        self.serial.flush()

    def _next_protocol_line(self, timeout: float = 15.0) -> str:
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            raw = self.serial.readline()
            if not raw:
                continue
            text = raw.decode("utf-8", "replace").strip()
            if text.startswith("T5A1 "):
                return text
        raise RuntimeError("Tab5 nie odpowiedział w wymaganym czasie")

    def connect(self) -> None:
        self.serial.dtr = False
        self.serial.rts = True
        time.sleep(0.15)
        self.serial.rts = False
        while True:
            line = self._next_protocol_line(15)
            if line.startswith("T5A1 WAIT "):
                self._send_line("T5A1")
            elif line == "T5A1 READY":
                return

    def info(self, minimum: int = 2) -> None:
        self._send_line("INFO")
        if self._next_protocol_line() not in [f"T5A1 INFO {v}" for v in range(minimum, 8)]:
            raise RuntimeError("Najpierw wgraj aktualny firmware obsługujący wybrane gry.")

    def hash(self, remote: str) -> str:
        self._send_line("HASH " + remote)
        line = self._next_protocol_line(120)
        prefix = "T5A1 HASH " + remote + " "
        if not line.startswith(prefix): raise RuntimeError(line)
        return line[len(prefix):]

    def list(self) -> list[str]:
        self._send_line("LIST")
        items: list[str] = []
        while True:
            line = self._next_protocol_line(30)
            if line == "T5A1 LIST-DONE":
                return items
            if line.startswith("T5A1 ITEM "):
                items.append(line)
            elif line.startswith("T5A1 ERROR "):
                raise RuntimeError(line)

    def put_stream(self, source, size: int, digest: str, remote: str, replace: bool = True) -> None:
        self._send_line(f"PUT {remote} {size} {digest} {1 if replace else 0}")
        line = self._next_protocol_line(15)
        if line.startswith("T5A1 ERROR "):
            raise RuntimeError(line)
        if not line.startswith("T5A1 GO "):
            raise RuntimeError(f"Nieoczekiwana odpowiedź: {line}")
        sent = 0
        last_report = -1
        while sent < size:
            line = self._next_protocol_line(15)
            if not line.startswith("T5A1 CHUNK "):
                raise RuntimeError(f"Nieoczekiwana odpowiedź: {line}")
            _, _, wanted_text, offset_text = line.split()
            wanted = int(wanted_text)
            offset = int(offset_text)
            if offset != sent:
                raise RuntimeError(f"Niezgodny offset Tab5: {offset} != {sent}")
            payload = source.read(wanted)
            if len(payload) != wanted:
                raise RuntimeError("Źródło skończyło się przedwcześnie")
            self.serial.write(payload)
            self.serial.flush()
            ack = self._next_protocol_line(15)
            sent = int(ack.rsplit(" ", 1)[1]) if ack.startswith("T5A1 ACK ") else -1
            if sent < 0:
                raise RuntimeError(f"Brak ACK: {ack}")
            percent = int(sent * 100 / size) if size else 100
            if percent // 10 != last_report // 10:
                print(f"  {remote}: {percent}%")
                last_report = percent
        stored = self._next_protocol_line(30)
        if not stored.startswith("T5A1 STORED "):
            raise RuntimeError(f"Plik nie został opublikowany: {stored}")

    def put_file(self, local: Path, remote: str, replace: bool = True) -> None:
        size = local.stat().st_size
        digest = sha256_file(local)
        print(f"Wysyłam {remote} ({size} B, {digest[:12]}…)")
        with local.open("rb") as source:
            self.put_stream(source, size, digest, remote, replace=replace)

    def put_bytes(self, payload: bytes, remote: str, replace: bool = True) -> None:
        digest = hashlib.sha256(payload).hexdigest()
        print(f"Wysyłam {remote} ({len(payload)} B, {digest[:12]}…)")
        self.put_stream(io.BytesIO(payload), len(payload), digest, remote, replace=replace)

    def restart(self) -> None:
        self._send_line("DONE")
        line = self._next_protocol_line(10)
        if line != "T5A1 RESTART":
            raise RuntimeError(f"Nieoczekiwana odpowiedź końcowa: {line}")


def install(args: argparse.Namespace) -> None:
    bass_manifest = load_manifest("bass-gog-macos-33348.json")
    queen_manifest = load_manifest("queen-gog-macos-35048.json")
    support = Path(args.support).resolve()
    if not support.is_dir():
        raise RuntimeError(f"Brak katalogu wsparcia ScummVM: {support}")
    with tempfile.TemporaryDirectory(prefix="tab5adv-") as temp_name:
        temp = Path(temp_name)
        print("Sprawdzam podpisy i rozpakowuję paczki GOG lokalnie…")
        bass_files = verify_and_extract(Path(args.bass_pkg), bass_manifest, temp / "bass")
        queen_files = verify_and_extract(Path(args.queen_pkg), queen_manifest, temp / "queen")
        print("Paczki GOG i pliki gry: PASS")

        link = Tab5Link(args.port)
        try:
            print("Łączę z instalatorem Tab5…")
            link.connect()
            before = link.list()
            print(f"Karta dostępna; wpisów przed instalacją: {len(before)}")
            observed = {line.split(" ", 5)[-1] for line in before}
            support_targets = {f"scummvm/{path.name}" for path in support.iterdir() if path.is_file()}
            game_targets = {
                *(f"games/bass/{name}" for name in bass_files),
                *(f"games/queen/{name}" for name in queen_files),
                "games/bass/game.json",
                "games/queen/game.json",
                "scummvm/scummvm.ini",
            }
            managed_targets = support_targets | game_targets
            if READY_MARKER in observed:
                raise RuntimeError("Instalacja jest już kompletna; nie nadpisuję jej automatycznie")
            recovery = INSTALLING_MARKER in observed
            collisions = sorted(managed_targets & observed)
            if collisions and not recovery:
                raise RuntimeError(f"Kolizja z istniejącymi plikami; karta bez zmian: {collisions[:3]}")
            if not recovery:
                link.put_bytes(b"tab5adv 0.1.0-rc1 installing\n", INSTALLING_MARKER, replace=False)
            else:
                print("Wznawiam przerwany, oznaczony import Tab5Adv")
            for local in sorted(support.iterdir()):
                if local.is_file():
                    link.put_file(local, f"scummvm/{local.name}", replace=recovery)
            for name, local in sorted(bass_files.items()):
                link.put_file(local, f"games/bass/{name}", replace=recovery)
            for name, local in sorted(queen_files.items()):
                link.put_file(local, f"games/queen/{name}", replace=recovery)
            link.put_file(ROOT / "manifests" / "bass-gog-macos-33348.json", "games/bass/game.json", replace=recovery)
            link.put_file(ROOT / "manifests" / "queen-gog-macos-35048.json", "games/queen/game.json", replace=recovery)
            # Publish the launcher configuration only after every game file is complete.
            link.put_bytes(CONFIG, "scummvm/scummvm.ini", replace=recovery)
            link.put_bytes(b"tab5adv 0.1.0-rc1 ready\n", READY_MARKER, replace=False)
            after = link.list()
            required = {"scummvm/scummvm.ini", "games/bass/sky.dsk", "games/queen/queen.1"}
            observed = {line.split(" ", 5)[-1] for line in after}
            missing = required - observed
            if missing:
                raise RuntimeError(f"Brak po instalacji: {sorted(missing)}")
            print(f"Weryfikacja karty: PASS ({len(after)} wpisów)")
            link.restart()
        finally:
            link.close()


def card_inventory(lines: list[str]) -> dict[str, int]:
    return {parts[4]: int(parts[3]) for line in lines
            if len(parts := line.split(" ", 4)) == 5 and parts[2] == "F"}


def protected_inventory(items: dict[str, int], hash_file) -> dict[str, dict[str, int | str]]:
    names = sorted(name for name in items if name.startswith("scummvm/saves/")
                   or name in ("scummvm/profile-0.dat", "scummvm/profile-1.dat"))
    return {name: {"bytes": items[name], "sha256": hash_file(name)} for name in names}


def require_protected_unchanged(before: dict, after: dict, stage: str) -> None:
    if before != after:
        raise RuntimeError("Zapisy lub profil zmieniły się " + stage)


def extract_profile(package: Path, manifest: dict, destination: Path) -> dict[str, Path]:
    if package.is_symlink() or not package.is_file(): raise RuntimeError("Nieprawidłowy plik źródłowy")
    if sha256_file(package) != manifest["source_package"]["sha256"]: raise RuntimeError("Nieznany SHA paczki: " + package.name)
    if manifest["source_package"].get("format") != "zip":
        return verify_and_extract(package, manifest, destination)
    destination.mkdir()
    selected = {}
    with zipfile.ZipFile(package) as archive:
        for spec in manifest["files"]:
            data = archive.read(spec["archive_path"])
            if len(data) != spec["size"] or hashlib.sha256(data).hexdigest() != spec["sha256"]:
                raise RuntimeError("Zły plik w archiwum: " + spec["name"])
            target = destination / spec["name"]
            target.write_bytes(data); selected[spec["name"]] = target
    return selected


def add_games(args):
    support = Path(args.support)
    support_manifest = json.loads((support.parent / "support-files.json").read_text())
    selected = {}
    with tempfile.TemporaryDirectory(prefix="tab5adv-add-") as temporary:
        for game, package in args.game:
            paths = list((ROOT / "manifests").glob(game + "-*.json"))
            if len(paths) != 1 or game in selected: raise RuntimeError("Nieznana lub powtórzona gra: " + game)
            manifest = json.loads(paths[0].read_text())
            files = extract_profile(Path(package), manifest, Path(temporary) / game)
            selected[game] = (manifest, files)
        link = Tab5Link(args.port)
        try:
            link.connect(); link.info(max(m.get("minimum_firmware",2) for m,_ in selected.values()))
            observed = card_inventory(link.list())
            protected_before = protected_inventory(observed, link.hash)
            plans = {}
            selected = dict(sorted(selected.items(), key=lambda item: item[1][0].get("kind") != "addon"))
            for game, (m, files) in selected.items():
                if m.get("kind") == "addon" and m["requires"] not in selected:
                    base = load_manifest("drascula-freeware-en.json")
                    if "games/drascula/game.json" not in observed: raise RuntimeError("Najpierw zainstaluj Drásculę")
                    for f in base["files"]:
                        if observed.get("games/drascula/"+f["name"]) != f["size"] or link.hash("games/drascula/"+f["name"]) != f["sha256"]: raise RuntimeError("Niekompletna Dráscula")
                root = f"games/{m.get('install_root', game)}/"
                if root + m.get("receipt_name", "game.json") in observed:
                    if not all(observed.get(root + f["name"]) == f["size"] for f in m["files"]):
                        raise RuntimeError("Niekompletna istniejąca gra: " + game)
                    for f in m["files"]:
                        if link.hash(root + f["name"]) != f["sha256"]: raise RuntimeError("Uszkodzony istniejący plik: " + f["name"])
                    plans[game] = "installed"
                elif root + m.get("marker_name", ".tab5adv-installing") in observed: plans[game] = "recovery"
                elif any(root + f["name"] in observed for f in m["files"]): raise RuntimeError("Kolizja obcych danych: " + game)
                else: plans[game] = "new"
            for spec in support_manifest["files"]:
                name = spec["path"]
                if name.endswith(".json"): continue
                if Path(name).name != name or name.endswith(".ini") or name == "boot-target.txt": raise RuntimeError("Nieprawidłowy support manifest")
                local = support / name
                if local.stat().st_size != spec["size"] or sha256_file(local) != spec["sha256"]: raise RuntimeError("Zły support SHA: " + name)
                remote = "scummvm/" + name
                if observed.get(remote) == spec["size"] and link.hash(remote) == spec["sha256"]: continue
                link.put_file(local, remote, replace=remote in observed)
            for game, (m, files) in selected.items():
                if plans[game] == "installed":
                    print("Już zainstalowana i zweryfikowana:", game); continue
                root = f"games/{m.get('install_root', game)}/"
                if plans[game] == "new": link.put_bytes(b"tab5adv 0.2 installing\n", root + m.get("marker_name", ".tab5adv-installing"), replace=False)
                for name, local in files.items(): link.put_file(local, root + name, replace=plans[game] == "recovery")
                receipt = (json.dumps(m,ensure_ascii=False,indent=2) + "\n").encode()
                link.put_bytes(receipt, root + m.get("receipt_name", "game.json"), replace=False)
            if "scummvm/scummvm.ini" not in observed:
                # Only defaults for a fresh card; firmware registers complete games.
                config = CONFIG.split(b"\n[sky]", 1)[0] + b"\n"
                link.put_bytes(config, "scummvm/scummvm.ini", replace=False)
            link.put_bytes(b"launcher\n", "scummvm/boot-target.txt", replace=True)
            protected_after = protected_inventory(card_inventory(link.list()), link.hash)
            require_protected_unchanged(protected_before, protected_after, "podczas importu")
            print("SAVE/PROFILE HASH PRESERVATION PASS", len(protected_before))
            print("INSTALL PLANS", plans)
            link.restart()
        finally: link.close()
        time.sleep(1)
        verify_link = Tab5Link(args.port)
        try:
            verify_link.connect()
            verify_link.info(max(m.get("minimum_firmware", 2) for m, _ in selected.values()))
            protected_reboot = protected_inventory(card_inventory(verify_link.list()), verify_link.hash)
            require_protected_unchanged(protected_before, protected_reboot, "po restarcie")
            print("SAVE/PROFILE POST-RESET READBACK PASS", len(protected_before))
            verify_link.restart()
        finally: verify_link.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", default=DEFAULT_PORT)
    sub = parser.add_subparsers(dest="command", required=True)
    list_parser = sub.add_parser("list", help="Pokaż inwentarz karty")
    target_parser = sub.add_parser("target", help="Ustaw następny start testowy")
    target_parser.add_argument("value", choices=("launcher", "sky", "queen", "soltys", "sfinx", "lure", "teenagent", "draci", "drascula", "nippon", "dreamweb", "mandy", "frasse", "cubert", "samnmax", "atlantis", "kyra2", "dig", "comi"))
    install_parser = sub.add_parser("install", help="Zweryfikuj GOG i zainstaluj obie gry")
    install_parser.add_argument("--bass-pkg", required=True)
    install_parser.add_argument("--queen-pkg", required=True)
    install_parser.add_argument("--support", required=True)
    add_parser = sub.add_parser("add", help="Dodaj wybrane gry, zachowując istniejącą bibliotekę i zapisy")
    add_parser.add_argument("--game", nargs=2, action="append", required=True, metavar=("ID", "ARCHIVE"))
    add_parser.add_argument("--support", default=str(ROOT / "site/releases/v0.3.0-rc2/support"))
    args = parser.parse_args()
    if args.command in ("list", "target"):
        link = Tab5Link(args.port)
        try:
            link.connect()
            if args.command == "list":
                for item in link.list():
                    print(item)
            else:
                link.put_bytes((args.value + "\n").encode("ascii"), "scummvm/boot-target.txt")
            link.restart()
        finally:
            link.close()
    elif args.command == "add":
        add_games(args)
    else:
        install(args)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (RuntimeError, subprocess.CalledProcessError, serial.SerialException) as error:
        print(f"BŁĄD: {error}", file=sys.stderr)
        raise SystemExit(1)
