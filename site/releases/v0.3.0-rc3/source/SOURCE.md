# Corresponding project source — 0.3.0-rc3 prerelease

Matching source archive URL for this prerelease:
https://github.com/fiedoruk/tab5adv/releases/download/v0.3.0-rc3/tab5adv-source.tar.gz

The CRT option is experimental and OFF by default. Its measured additional
graphics-stage mean time was about 22.74 ms in Sołtys, 25.43 ms in BASS and
47.44 ms in COMI, above the 8 ms target. This is not a CRT performance PASS.
The firmware and source are paired by the exact hashes below; full game
playthrough and hardware performance claims are limited to recorded tests.

Source commit: `65aea9de2b15b48ee255afcd44dfe4bfb8585b73`. Base:
https://github.com/espressif/esp32-scummvm/tree/52b4c6f5da2f030157026bc1c2ceb5aa9acf145e

`tab5adv-source.tar.gz` contains the project source and pinned managed component
sources used by the board, codec and libraries, except one external runtime
data file described below. No local Git history, game archives, saves, camera
images or private device backups are included.
Standard external prerequisites are ESP-IDF5.5.5 and the matching RISC-V compiler;
see `docs/BUILD.md` in the wrapper project. This is source correspondence, not a
claim of bit-for-bit reproducibility across timestamps or toolchain packages.

`tab5adv.patch` reconstructs the project tree from the base using `git apply`.
The base Git tree itself tracks `dists/engine-data/kyra.dat`; remove that
external runtime data file when reproducing this prerelease source archive.
Managed components are additionally included in the source archive; they can
also be fetched using the pinned dependency lock by ESP-IDF's component manager.
The upstream create_prince translation submodule is not part of this build.

External runtime data omitted from this archive and support package:
`dists/engine-data/kyra.dat` (2,016,466 bytes, SHA-256 `4a12e335227bce7f7f8d9def2f0ef4d856fc06da87879532091b8f4ffa09d1af`). Exact pinned upstream
base retrieval path:
https://raw.githubusercontent.com/espressif/esp32-scummvm/52b4c6f5da2f030157026bc1c2ceb5aa9acf145e/dists/engine-data/kyra.dat
Verify the size and SHA before local use. This pointer documents source
provenance; it does not clear redistribution of content extracted from games.
Kyrandia is not in the tested game set for this prerelease.

Application: 8263232 bytes, SHA-256 `b4ffce9464eb6fae17d0edaf9ce20d0fbebb68f53ede3c5f4006a3424b3326d0`.
Merged image: 8328768 bytes, SHA-256 `bf465a2e8c676d319ced9efd742f1d10b4759d4ee321b04583cb32c4d5ffe9b0`.
Bootloader0x2000, partition table0x8000 and app0x10000 come from the same build.
`BUILD.json` records all source/binary hashes and SDK/BSP pins.

The wrapper repository supplies installer, manifests, theme inputs, generators
and licences. Original third-party notices remain with their components.
Purchased game data is supplied locally by the user and never hosted here.
Compatibility and test limits are documented separately; packaging is not a
substitute for device gameplay checks.
