# Compatibility / Zgodność

Current rc2 changes the controls and adds EN/PL help. The game evidence below
retains its original build provenance; rc2 is not a new full13-game retest.
See [release notes](RELEASE.md) for the scoped interface checks.

**0.3.0-rc1 — 13 first-scene device pilots (9 free + 4 from owned GOG packages).**
Firmware source: `622c0ef33f5b645eecef285de22ed35187beb78b`; application SHA-256
`f7f8899860f81d7c55a5bc2e79b6fb9b0bd498ad0b1183c8ee340c6d76794fd2`.
The nine free-game results were collected on the v0.2 image
`f3d68adfca933125359cd3c5f7aec3736a3ccdfc` and its development builds.
The four GOG additions were checked during 0.3 development. A complete manual
regression of all 13 on the current 0.3 image is still pending. The table does
not imply full playthroughs.
One M5Stack Tab5: ESP32-P4 revision 1.3, ST7123 panel, 32 MB PSRAM,
32 GB FAT32 microSD. P4 chip revision is not the board revision.

| Game / Gra | Pinned edition | Device result |
|---|---|---|
| Beneath a Steel Sky | GOG macOS EN 1.0/33348 | Catwalk, walking, save/load after USB reset. A follow-up check restored slot 1 and handled MOVE/RIGHT rung interaction. |
| Flight of the Amazon Queen | GOG macOS EN gog-3/35048 | Hotel room, actions, save/load after USB reset. A follow-up check restored slot 10, position and inventory; right-click bat action passed. |
| Sołtys | ScummVM PL 1.0 ZIP | Farmyard, walking, bone pickup. Slot 10 restored the bone after reset; a follow-up input check passed. Movement is slow. |
| Sfinx | ScummVM PL 1.1 ZIP | Full 320×240 scene, backpack reaction, save/load after reset. A follow-up check also loaded slot 10 with black sidebars. No puzzle-progress claim. |
| Lure of the Temptress | ScummVM EN VGA 1.1 ZIP | Cell, walking to the right wall, save/load restoring that position. A follow-up build and black-sidebar check passed. |
| Teenagent | DOS Games Archive full freeware EN ZIP | Guard post, walking, slot 10 and matching position after reset. A follow-up check also walked back toward the guard. |
| Dragon History | Official PL 2012 ZIP | Forest, walking, Polish object comment and matching state after reset. FAT handle limit raised to 32 after a reproduced font-opening failure. |
| Dráscula | ScummVM EN 1.0 + MP3 music 2.0 ZIPs | Tavern, walking via MOVE/LEFT, slot 10 and matching position after reset on the nine-game baseline. Follow the verb-bar guide. |
| Nippon Safes, Inc. | ScummVM DOS multilingual 1.0 ZIP; EN selected | Dino code, dialogue, museum, walking and matching state after reset. Save through virtual S; load through the original Saved Game book. Other characters untested. |
| Sam & Max Hit the Road | GOG macOS enUS gog-3/34450 | First-scene action, save/reset/load and Return pilot passed. English on-screen text confirmed in the device pilot; the package metadata alone was not used to infer language. |
| Indiana Jones and the Fate of Atlantis | GOG macOS enUS gog-3/34450 | First scene, dialogue/action, save/reset/load and Return pilot passed. |
| The Dig | GOG macOS enUS gog-2/34450 | Ship scene, action, GMM save, USB reset/load and Return passed. The first tested gameplay location was the ship. |
| The Curse of Monkey Island | GOG macOS enUS 1.0l/20672 | Cannon-deck dialogue/choice, save/reset/load and Return passed. Talk via KEYS → t → ✓. Verb coin appears on hold; selection by gesture NOT MEASURED. |

The first four additions were initially tested on `8dab41e0`; after the shared
input correction, follow-up checks covered BASS, Queen, Sołtys, Sfinx,
Lure and Teenagent. Dráscula and Nippon passed on the nine-game baseline; Dragon History
passed the FAT correction and its saved forest state was verified after reset.

Kyrandia 2 is **release FAIL/PENDING** after an unrepeatable teardown panic despite
separate fresh/load Return PASS tests. Mandy remains excluded after its memory
issue. Neither appears in the 13-game installer collection.

## What this result means / Granice wyniku

The checks used USB-generated touch input routed through the device input
handler, with direct LCD captures and visual observation of the panel. They
cover a first scene, an action, save/load after a USB reset and launcher return.
They do not establish a full playthrough, extended physical-finger use, audible
quality or a cold power cycle. These unmeasured properties remain release limits.

Audio stayed muted during these tests. A mixer callback overrun was logged in
Dragon History; do not claim zero underruns or verified audible quality. The
stock virtual keyboard and save-list rows are smaller than the side controls.
Nippon uses S/L and its original book menu; generic Save is unsupported there.
Dráscula works reliably with MOVE → point → LEFT because its verb bar uses the
previous pointer state. These differences are covered in both beginner guides.

## Interface and installer limits

The home screen is a customised native ScummVM grid. The local player profile
is opened with **Profile**; it is not a separate operating system. The icon pack now includes matching graphics for all 13 release titles; see
[icon provenance](ICONS.md).
There is no measured FPS target. Do not infer smooth video or complete control
coverage from a screenshot.

## Installer and preferences

- Eight real ZIPs (seven games plus music) passed archive and extracted-file SHA
  checks; the two exact GOG packages were verified in the earlier importer stage.
- Fresh Sołtys transfer through the browser passed; all five old save hashes survived.
- Three-game addition, music import and theme update preserved existing save hashes
  (5, 12 and 15 saves respectively at those checkpoints).
- Browser music-only selection correctly included the installed Dráscula base for
  hash validation. Dependency and fresh-pair ordering also passed host checks.
- Current 0.3 firmware flashing and a fresh Lure game-data transfer passed through
  ESP Web Tools and the real Web Serial installer in an embedded Chromium browser
  on macOS, using a previously authorised port. The application was read back and
  matched its release SHA; five Lure files and the updated icon archive also
  matched their hashes. All 32 pre-existing save/profile files remained unchanged.
  The card was retained, with only the Lure directory moved aside before the test;
  this is not a blank-card or first-time standalone Chrome/Edge permission test.
- Light/Dark/Black menu variants exist; Dark and Black were selected on the device.
  Independent Light and Black sidebars, volume ± and mute persistence were checked.
  Final readback: Black menu, Black sidebars, volume 70, muted.

Hashes identify exact data releases, not GOG account ownership. Original game
archives, executables and saves are not part of the public project package.
