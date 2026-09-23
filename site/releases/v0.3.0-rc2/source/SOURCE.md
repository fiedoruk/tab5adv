# Corresponding project source —0.3.0-rc2

Download the exact matching archive: https://github.com/fiedoruk/tab5adv/releases/download/v0.3.0-rc2/tab5adv-source.tar.gz

Size: 399,696,844 bytes. SHA-256:
`22ddb0b7893aaa7a09102465fb3051c1f232e64586a1b9bc38e7f5c8973bc1ca`.

Source commit: `d5b5d28c74dd2d96c7ef3b848be0a51192a91a54`. Base:
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

Application: 8229248 bytes, SHA-256 `a9b69d6853ab30c90da458db4958ef0eedd9fd6640972d88ca84b06ac3099de1`.
Merged image: 8294784 bytes, SHA-256 `3da4406762d856ab110d439f6f6530aebfa7705076aa3ac2844866866d8452d4`.
Bootloader0x2000, partition table0x8000 and app0x10000 come from the same build.
`BUILD.json` records all source/binary hashes and SDK/BSP pins.

The wrapper repository supplies installer, manifests, theme inputs, generators
and licences. Original third-party notices remain with their components.
Purchased game data is supplied locally by the user and never hosted here.
Compatibility and test limits are documented separately; packaging is not a
substitute for device gameplay checks.
