# Licences and provenance / Licencje i pochodzenie

The project code and Tab5 modifications are distributed under GPL-3.0-or-later;
see LICENSE. Individual upstream files and separately bundled resources retain
their notices. This file does not relicense games or third-party assets.

| Component | Source and licence | Treatment |
|---|---|---|
| ESP32 ScummVM port | [Espressif](https://github.com/espressif/esp32-scummvm), base commit52b4c6f5da2f030157026bc1c2ceb5aa9acf145e; ScummVM COPYING/COPYRIGHT | Matching source is a versioned Release asset; aggregate patch and build instructions are included; see docs/RELEASE.md |
| ScummVM engine support, fonts, keyboard | Matching pinned source `dists/`; upstream notices | Unmodified resources; included licences stay with the support pack |
| Tab5 skins | Derivative of pinned `scummremastered.zip`, GPL-3.0-or-later | Theme generator, base archive, layout and logo source are included; three named variants |
| Launcher game icons | [scummvm-icons](https://github.com/scummvm/scummvm-icons), GPLv2 LICENSE | `gui-icons.dat` is a curated ZIP: earlier entries are retained byte-for-byte and five original PNGs were appended without image edits. See [icon provenance](docs/ICONS.md); COPYING.ICONS.txt accompanies it. |
| libmad MP3 decoder | [sezero/libmad@486f902c](https://github.com/sezero/libmad/tree/486f902c6c686eafced3450851849527e29bc7f6), GPL-2.0-or-later | Complete pinned C source in tab5_mad; portable ESP-IDF configuration documented |
| Optional CRT beam/mask adaptation | [zfast_crt_standard by Greg Hogan (SoltanGris42), 2017](https://github.com/libretro/glsl-shaders/blob/8aab13063da6ad3ae928e886c41e13fa363f4d89/crt/shaders/zfast_crt.glsl), GPL-2.0-or-later | Integer RGB565 adaptation under GPL-3.0-or-later; attribution is retained in `tab5-crt.h`. Uses PPA resampling and is not an exact GLSL shader port. Experimental, OFF by default. |
| ESP Web Tools10.4.0 | [esp-web-tools](https://github.com/esphome/esp-web-tools), Apache-2.0 | Vendored upstream modules and LICENSE retained; project wrapper handles selection of a previously authorised USB port |

Firmware manifests and SHA256SUMS identify the exact binaries and support
resources. SOURCE.md beside each candidate identifies its matching source.
A source-only checkout without a candidate is not a firmware release.

## Game files

No original game data, game installer, executable or save is distributed here.
Users obtain the exact linked freeware/GOG editions themselves. The installer
only selects the necessary data and original licence notices from those files.
It does not run the original executables. It has no game-upload endpoint.

Sołtys, Sfinx and Lure archives permit free distribution under their included
conditions; we still use the official download rather than a project mirror.
Teenagent's README contains a restriction on bundling/sale without permission:
its data must not be bundled with this project. Keep the original notices intact,
including historical wording in the Sfinx PL archive. GOG account verification
is neither implemented nor inferred from matching hashes.

Screenshots show the project interface or short gameplay views to document
compatibility. Game artwork belongs to its respective rights holders; a
screenshot is not a separately licensed replacement for the game's data.

Dráscula uses the official English game ZIP and separate MP3 music ZIP. Both
original notices are retained; the music notice is named music-license.txt to
avoid replacing the base readme. Music tracks are copied to the game directory
without re-encoding, and are not redistributed by this website.
