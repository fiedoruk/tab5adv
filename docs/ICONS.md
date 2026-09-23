# Launcher icon provenance (v0.3.0-rc1)

`site/releases/v0.3.0-rc1/support/gui-icons.dat` is a ZIP resource read by the
ScummVM launcher. The existing 98 entries, their uncompressed bytes, CRCs,
compressed sizes, local-header offsets and all bytes before the old central
directory were retained. Five original PNG files were appended; no raster was
resized, recoloured or recompressed before insertion. The ZIP compressor stores
the exact original PNG bytes as the new entries' decoded payloads.

The five additions came **only** from the official
[`scummvm/scummvm-icons` repository](https://github.com/scummvm/scummvm-icons/tree/2879f027bc2d4092cbc2967e01cb24a9691b5c32),
pinned at commit `2879f027bc2d4092cbc2967e01cb24a9691b5c32`.
Each download was checked against that commit's Git blob SHA as well as the
SHA-256 below. All decode as 512×512 RGBA PNGs. Their source paths are under
`icons/` at that commit; the same paths are used inside `gui-icons.dat`.

| ZIP/source path | SHA-256 of decoded PNG | Git blob SHA |
|---|---|---|
| [`icons/scumm-atlantis.png`](https://github.com/scummvm/scummvm-icons/blob/2879f027bc2d4092cbc2967e01cb24a9691b5c32/icons/scumm-atlantis.png) | `4d532c5f17a2e778223ea47a1e9d05f55e2e634a8f12091043047998c15276ea` | `b0a81633b93fc44f07a644e9c65a4760e61734dd` |
| [`icons/scumm-comi.png`](https://github.com/scummvm/scummvm-icons/blob/2879f027bc2d4092cbc2967e01cb24a9691b5c32/icons/scumm-comi.png) | `6d6fb27bd2cbe0bcddf1091ec6f3eef69317a43c961cf4980f236b64cddd4177` | `e3def7571f6276d27ea4962495961962d2d5e5f0` |
| [`icons/scumm-dig.png`](https://github.com/scummvm/scummvm-icons/blob/2879f027bc2d4092cbc2967e01cb24a9691b5c32/icons/scumm-dig.png) | `248c263a9a83585f8784084b47bc53ff4555ba8ac1a39c449766e7f59e4ff76f` | `f52b386ac902cd912bf762a4a78eb089df476ee0` |
| [`icons/scumm-samnmax.png`](https://github.com/scummvm/scummvm-icons/blob/2879f027bc2d4092cbc2967e01cb24a9691b5c32/icons/scumm-samnmax.png) | `ab561fbbe1ef9df73b300c5586276cd690a22eab18dd10ed92c2f386d5baefee` | `cfe650fb664c3270bb6aeddef8981cbdf6bd5ca3` |
| [`icons/teenagent-teenagent.png`](https://github.com/scummvm/scummvm-icons/blob/2879f027bc2d4092cbc2967e01cb24a9691b5c32/icons/teenagent-teenagent.png) | `ec352205a10c4bf6a918c855c52970273d8befd154cc851839b07682c07d42c2` | `63a8f61d674c9a47e90e76b8af0ecfc940e3ed12` |

The pinned upstream repository declares **GPL-2.0** for these icons. Its
licence text is included as `support/COPYING.ICONS.txt` in the release.
The archive is now a **curated resource**, rather than an unmodified upstream
ZIP. Before the additions it was 3,300,128 bytes, SHA-256
`62defbfaf65b4c8bbec8220fc8f1fbf0e88be611befa04e9e9cb60622b52f2da`;
with 103 entries it is 4,870,001 bytes, SHA-256
`70928cb8b9b4e6b67433586e4c873aeb66f0ffe68c13be3e36d7fcbc77fc36f0`.
The v0.2 archive remains historical and unchanged.

Launcher lookup first tries `icons/<engine>-<gameid>.png`, then a generic
`icons/<engine>.png` fallback. The 13 public game profiles now all resolve by
their exact runtime engine/gameid paths, including SCUMM targets `samnmax`,
`atlantis`, `dig`, `comi` and `teenagent`/`teenagent`. The updated archive was transferred by the browser installer and its SHA-256
was read back from the microSD. All 13 graphics were then checked across the
real Tab5 launcher pages on 23 September 2026. The current Home capture in
`docs/media/home.png` shows the first six tiles with the updated archive.
