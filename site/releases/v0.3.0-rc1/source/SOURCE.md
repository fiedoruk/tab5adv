# Corresponding project source —0.3.0-rc1

## Download the matching source

[GitHub Release v0.3.0-rc1](https://github.com/fiedoruk/tab5adv/releases/tag/v0.3.0-rc1) · [Download tab5adv-source.tar.gz](https://github.com/fiedoruk/tab5adv/releases/download/v0.3.0-rc1/tab5adv-source.tar.gz)

Exact archive: **399,713,910 bytes**, SHA-256 `fbf97a375e1fda2947a584d54fc2a3d8ed3259fddd73af2eb713f4a9ffe46ac5`.
The archive is unchanged from the file identified by BUILD.json and the release
SHA256SUMS. Keep it with this version's binary and notices.


Source commit: `622c0ef33f5b645eecef285de22ed35187beb78b`. Base:
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
external runtime data file when reproducing this release source archive.
Managed components are additionally included in the source archive; they can
also be fetched using the pinned dependency lock by ESP-IDF's component manager.
The upstream create_prince translation submodule is not part of this build.

External runtime data omitted from this archive and from public support:
`dists/engine-data/kyra.dat` (2,016,466 bytes, SHA-256 `4a12e335227bce7f7f8d9def2f0ef4d856fc06da87879532091b8f4ffa09d1af`). Exact pinned upstream
base retrieval path:
https://raw.githubusercontent.com/espressif/esp32-scummvm/52b4c6f5da2f030157026bc1c2ceb5aa9acf145e/dists/engine-data/kyra.dat
Verify the size and SHA before local use. This pointer documents source
provenance; it does not clear redistribution of content extracted from games.
Kyrandia is not in the tested public game set for this release.

Application: 8226224 bytes, SHA-256 `f7f8899860f81d7c55a5bc2e79b6fb9b0bd498ad0b1183c8ee340c6d76794fd2`.
Merged image: 8291760 bytes, SHA-256 `3f1072166e3e09767c2d715b39cea0686e5c50c751720e51133078dbd68f93de`.
Bootloader0x2000, partition table0x8000 and app0x10000 come from the same build.
`BUILD.json` records all source/binary hashes and SDK/BSP pins.

The wrapper repository supplies installer, manifests, theme inputs, generators
and licences. Original third-party notices remain with their components.
Purchased game data is supplied locally by the user and never hosted here.
Compatibility and test limits are documented separately; packaging is not a
substitute for device gameplay checks.

The upstream macOS `dsa_pub.pem` is a public verification key. It and all files
in `dists/snap/` are unmodified upstream packaging material, not private project
credentials. Their bytes were checked against the pinned base and official
ScummVM commit `be8894515085e26aa3392d76ef66a968ba104dca`.
