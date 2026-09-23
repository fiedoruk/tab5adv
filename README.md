<p align="center"><img src="docs/media/overview.svg" width="100%" alt="Tab5 Free Adventures — classic adventures on ESP32-P4. 13 first-scene pilots: 9 free games and 4 from your own GOG packages."></p>

<p align="center"><strong><a href="https://esp32ai.me/tab5adv/">Project page &amp; installer</a> · <a href="docs/en/START.md">Start here</a> · <a href="README.pl.md">Po polsku</a> · <a href="docs/COMPATIBILITY.md">What has been tested</a></strong></p>

# Classic adventures. One small board.

Turn a **M5Stack Tab5** into a touch-controlled ScummVM adventure player.
Choose a story, put its files on microSD over USB, and play offline — with
large side controls, saves, three menu skins and a local player profile.

**0.3.0-rc1 is a preview.** Thirteen titles reached their first playable scenes
on a real Tab5, with selected actions and save/load checks. Full-game completion,
extended finger play and audible quality are not yet confirmed.
The [compatibility table](docs/COMPATIBILITY.md) records the scope per title.

![The Curse of Monkey Island running on the real Tab5 display, with touch and audio controls](site/assets/screens/comi.png)

*Actual LCD capture. Original game artwork; no mock gameplay or FPS claim.*

| The collection | On the device | On your computer |
| :--- | :--- | :--- |
| **9 free + 4 owned GOG titles** | Offline play from microSD | Browser installer in desktop Chrome / Edge |
| **3 games in Polish** | LEFT / RIGHT / MOVE / MENU / SKIP / KEYS | Exact archive and game-file verification |
| **Dráscula music addon** | Local saves, playtime and simple points | Game files go straight to Tab5 over USB |

## Choose a story

Start with the free collection. The four commercial games use **your own
purchased GOG packages**. No game archives are bundled or hosted by the project.

| Free collection | Language | Own GOG package | Language |
| :--- | :---: | :--- | :---: |
| Beneath a Steel Sky | EN | Sam & Max Hit the Road | EN |
| Flight of the Amazon Queen | EN | Indiana Jones and the Fate of Atlantis | EN |
| Sołtys | PL | The Dig | EN |
| Sfinx | PL | The Curse of Monkey Island | EN |
| Lure of the Temptress | EN | | |
| Teenagent | EN | | |
| Dragon History | PL | | |
| Dráscula + music | EN | | |
| Nippon Safes, Inc. | EN selected | | |

<details>
<summary><strong>How much adventure is in the collection?</strong></summary>

Approximately **57 hours of original-game story estimates**, based on available
player/reviewer figures for 12 of the 13 titles. Nippon has no usable estimate
and is excluded. These are not measured Tab5 playthrough times; port performance
can differ. [Per-game estimates and sources](site/game-info.js).

</details>

## From download to first scene

1. Prepare **Tab5 + FAT32 microSD + a USB-C data cable**. A computer is needed
   for installation; the device plays independently afterwards.
2. Follow the [beginner guide](docs/en/START.md) and install the firmware.
3. Download one of the **exact listed archives**, select it in the installer,
   verify it, and copy it over USB. Start small with Sołtys PL or Lure EN.
4. Tap a game tile, then **▶**. Use **MENU → Return to Launcher** for another game.

For GOG, choose **offline backup installers → macOS → English**, even on Windows.
The page reads the `.pkg`; you do not run it. Large games can take tens of minutes
to transfer. Hashes identify supported editions, not account ownership. Sign in
only at GOG — we never ask for its password.

## Your screen. Your pace.

| T5 FREE home | Local player profile |
| :---: | :---: |
| <img src="docs/media/home.png" width="520" alt="Actual T5 FREE grid home with game tiles and Profile button"> | <img src="docs/media/profile.png" width="520" alt="Actual local Tab5 profile with playtime, 13-game library and points"> |
| Light, Dark and Black menu skins. Independent sidebar colours. | Per-game time, sessions and exploration points stay on microSD. |

**Tap** clicks. **MOVE** points without clicking, then **LEFT / RIGHT** act there.
**KEYS** opens the keyboard. Volume **− / +** and **MUTE / UNMUTE** remain on the
side rails; raising volume while muted keeps it muted.

The profile counts active play, excludes menus/pauses and has an idle cutoff.
Points reward trying titles; they do not claim story progress or completion.
Open **Profile**, then **Do gier / Back to games** to return.

<details>
<summary><strong>Three control tips before you play</strong></summary>

- **Curse:** use **KEYS → t → ✓** for Talk. Its verb coin appears on hold;
  selecting actions with that gesture still needs physical-finger confirmation.
- **Nippon:** save with **KEYS → s → ✓**, load with **KEYS → l → ✓**.
  After restart use the original **SAVED GAME** book, not the launcher Load shortcut.
- **Dráscula:** enable MOVE, point at a verb, press LEFT, then point at the
  destination/object and press LEFT again.

See the [control guide](docs/en/START.md#controls) for the rest.

</details>

## What is doing the work?

| Hardware | This firmware |
| :--- | :--- |
| ESP32-P4 dual-core RISC-V | Runs at **360 MHz** |
| **32 MB PSRAM · 16 MB flash** | Game engines, framebuffer and local UI |
| **5-inch touch display · 1280 × 720 landscape** | Proportional scene and touch controls |
| microSD | Game data, saves, themes and profile |

The measured unit has an **ESP32-P4 chip revision 1.3 and ST7123 panel**.
That is a chip revision, not a promise about every Tab5 board variant.
Wi-Fi and a project account are not needed during play.

## Inside this repository

- **`site/`** — bilingual installer, catalog, real LCD screenshots, versioned
  firmware/support payload and source metadata.
- **`manifests/`** — exact hashes and file lists for 13 games plus music; no game data.
- **`theme/`** — three skins, layouts, logo and their upstream base.
- **`tools/`** — catalog/theme generators, host checks and an advanced USB helper.
- **`docs/`** — beginner guides, build instructions, compatibility and release notes.

Matching firmware source is a **separate release asset**, rather than hundreds
of megabytes in Git history. Its hash and revision are recorded in
[BUILD.json](site/releases/v0.3.0-rc1/source/BUILD.json). [Download the matching source archive](https://github.com/fiedoruk/tab5adv/releases/download/v0.3.0-rc1/tab5adv-source.tar.gz)
from the [0.3 RC release](https://github.com/fiedoruk/tab5adv/releases/tag/v0.3.0-rc1).

Game archives, saves, private camera recordings, device backups and development
notes are excluded. Firmware has no gameplay telemetry. The portal uses Plausible
for page/installer events; game contents and local profile data are not sent with them.

## Build, report, contribute

[Build guide](docs/BUILD.md) · [Compatibility and limits](docs/COMPATIBILITY.md) ·
[Release notes](docs/RELEASE.md) · [Licences and attribution](NOTICES.md)

For a problem report, include firmware version, game/edition, scene, action and
result. Do not attach game archives, account details or private saves.
Kyrandia 2, Mandy, DreamWeb, Frasse and Cubert are outside this 13-title release.
ScummVM engine support alone does not establish Tab5 compatibility.

Built on [Espressif's ESP32 ScummVM port](https://github.com/espressif/esp32-scummvm)
and [ScummVM](https://www.scummvm.org/). GPL-3.0-or-later project code; upstream
components and game artwork retain their notices. Independent community project,
not officially endorsed by M5Stack, GOG or ScummVM.
