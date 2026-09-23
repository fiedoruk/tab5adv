#!/usr/bin/env python3
"""Cheap host oracle for the exact Tab5Adv geometry and CLUT8 path."""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GRAPHICS = ROOT / "firmware/backends/platform/esp32/main/esp-graphics.cpp"
EVENTS = ROOT / "firmware/backends/platform/esp32/main/main.cpp"

PANEL_WIDTH = 720
PANEL_HEIGHT = 1280
VIEWPORT_X = 160
VIEWPORT_Y = 4
VIEWPORT_WIDTH = 960
VIEWPORT_HEIGHT = 712
GAME_WIDTH = 320
GAME_HEIGHT = 200


def game_point(raw_x: int, raw_y: int) -> tuple[int, int] | None:
    logical_x = PANEL_HEIGHT - 1 - raw_y
    logical_y = raw_x
    if not (
        VIEWPORT_X <= logical_x < VIEWPORT_X + VIEWPORT_WIDTH
        and VIEWPORT_Y <= logical_y < VIEWPORT_Y + VIEWPORT_HEIGHT
    ):
        return None
    return (
        (logical_x - VIEWPORT_X) * GAME_WIDTH // VIEWPORT_WIDTH,
        (logical_y - VIEWPORT_Y) * GAME_HEIGHT // VIEWPORT_HEIGHT,
    )


def raw_point(logical_x: int, logical_y: int) -> tuple[int, int]:
    return logical_y, PANEL_HEIGHT - 1 - logical_x


def rgb565(red: int, green: int, blue: int) -> int:
    return ((red >> 3) << 11) | ((green >> 2) << 5) | (blue >> 3)


def pitched_copy(source: bytes, pitch: int, width: int, height: int) -> bytes:
    return b"".join(source[row * pitch : row * pitch + width] for row in range(height))


def assert_source_contract() -> None:
    graphics = GRAPHICS.read_text(encoding="utf-8")
    events = EVENTS.read_text(encoding="utf-8")
    for anchor in (
        "_surf[_cur_fb].copyRectToSurface(buf, pitch, x, y, w, h);",
        "pal16[i]=((r>>3)<<11)|((g>>2)<<5)|(b>>3);",
    ):
        assert anchor in graphics, f"pixel contract drifted: {anchor}"
    assert 'gfx->sampleTouch();' in events
    assert 'gfx->nextTouch(input)' in events
    import subprocess
    (ROOT / 'build').mkdir(exist_ok=True)
    binary = ROOT / 'build/test_controls'
    subprocess.run(['c++', '-std=c++17', '-fsanitize=address,undefined', '-g',
                    str(ROOT / 'tools/test_controls.cpp'), '-o', str(binary)], check=True)
    subprocess.run([str(binary)], cwd=ROOT, check=True)


def main() -> None:
    assert_source_contract()

    logical_cases = {
        (VIEWPORT_X, VIEWPORT_Y): (0, 0),
        (VIEWPORT_X + VIEWPORT_WIDTH - 1, VIEWPORT_Y): (319, 0),
        (VIEWPORT_X, VIEWPORT_Y + VIEWPORT_HEIGHT - 1): (0, 199),
        (VIEWPORT_X + VIEWPORT_WIDTH - 1, VIEWPORT_Y + VIEWPORT_HEIGHT - 1): (319, 199),
        (640, 360): (160, 100),
    }
    for logical, expected in logical_cases.items():
        assert game_point(*raw_point(*logical)) == expected, (logical, expected)

    for logical in ((159, 4), (1120, 4), (160, 3), (160, 716)):
        assert game_point(*raw_point(*logical)) is None, logical

    assert raw_point(1279, 0) == (0, 0)
    assert raw_point(0, 719) == (719, 1279)

    assert rgb565(0, 0, 0) == 0x0000
    assert rgb565(255, 255, 255) == 0xFFFF
    assert rgb565(255, 0, 0) == 0xF800
    assert rgb565(0, 255, 0) == 0x07E0
    assert rgb565(0, 0, 255) == 0x001F

    padded = bytes((1, 2, 3, 90, 91, 4, 5, 6, 92, 93))
    assert pitched_copy(padded, pitch=5, width=3, height=2) == bytes((1, 2, 3, 4, 5, 6))

    # Shared C++ router above verifies release on leaving the scene.
    # This independent transform remains a compact geometric oracle.
    last_valid = game_point(*raw_point(640, 360))
    assert last_valid == (160, 100)
    assert game_point(*raw_point(159, 360)) is None

    print("H2 geometry: PASS (4 corners + center + 4 outside points)")
    print("H2 palette: PASS (RGB565 primaries)")
    print("H2 pitch: PASS (padded two-row fixture)")
    print("H2 contact cancellation: PASS (outside viewport -> release path)")


if __name__ == "__main__":
    main()
