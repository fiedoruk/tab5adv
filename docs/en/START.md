# Your first adventure on Tab5

You need M5Stack Tab5, a FAT32 microSD card, a USB-C data cable, and desktop
Chrome or Edge. Read the guide on a phone if convenient; install from a computer.

For a small download without an account, start with **Sołtys in Polish** or
**Lure of the Temptress in English** from the
[official ScummVM catalog](https://www.scummvm.org/games/). Keep the ZIP unchanged.

1. Open the project installer and connect Tab5 with its card inserted.
2. For the first installation, install firmware. Select
   **USB JTAG/serial debug unit** in the port picker, then **Connect**.
3. Choose a downloaded package beside each game you want. Select
   **Verify selected games**, then **Connect Tab5 and add games**.
4. Wait for completion and the launcher. Tap a cover, then **▶**.
   Keep the cable and card connected during copying.

Firmware replaces the previous Tab5 program. Keep its backup or reinstall
instructions before the first change. The microSD card is not formatted.
Install firmware0.3 before adding new titles to an older build. Existing
games, saves and profiles remain on microSD.

## Exact supported packages

| Game | Data language | Package |
|---|---|---|
| Sołtys | Polish | `soltys-pl-v1.0.zip` |
| Sfinx | Polish | `sfinx-pl-v1.1.zip` |
| Lure of the Temptress | English VGA | `lure-1.1.zip` |
| Teenagent | English full freeware | `teenagent.zip` from DOS Games Archive |
| Beneath a Steel Sky | English | `beneath_a_steel_sky_enUS_1_0_33348.pkg` |
| Flight of the Amazon Queen | English | `flight_of_the_amazon_queen_enUS_gog_3_35048.pkg` |
| Dragon History | PL | `dh-pl-2012.zip` |
| Dráscula | EN | `drascula-1.0.zip` + `drascula-audio-mp3-2.0.zip` |
| Nippon Safes, Inc. | EN | `nippon-1.0.zip` |


**From your GOG packages — paid games**

| Game | Data language | Exact package |
|---|---|---|
| [Sam & Max Hit the Road](https://www.gog.com/en/game/sam_max_hit_the_road) | EN text on device | `sam___max_hit_the_road_enUS_gog_3_34450.pkg` |
| [Indiana Jones and the Fate of Atlantis](https://www.gog.com/en/game/indiana_jones_and_the_fate_of_atlantis) | EN | `indiana_jones__and_the_fate_of_atlantis__enUS_gog_3_34450.pkg` |
| [The Dig](https://www.gog.com/en/game/the_dig) | EN | `the_dig__enUS_gog_2_34450.pkg` |
| [The Curse of Monkey Island](https://www.gog.com/en/game/the_curse_of_monkey_island) | EN | `the_curse_of_monkey_island__enUS_1_0l_20672.pkg` |

[ScummVM ZIP downloads](https://www.scummvm.org/games/) ·
[Teenagent download](https://www.dosgamesarchive.com/file/teenagent/teenagent).
Choose the full `teenagent.zip`, not the `tagent-box.zip` demo.

For BASS and Amazon Queen, add the free games to your GOG library. Four paid games require your own GOG packages. Under
**Download offline backup game installers**, choose **macOS** and **English**.
Select the listed `.pkg` even on Windows. The Dig and Curse are large; USB transfer may take tens of minutes.
Do not run the macOS installer: our page only reads game data from it.
Never enter your GOG password on the Tab5 Free Adventures website. Hashes identify editions, not account ownership. Game files remain local, and saves and profiles are retained.

In Curse of Monkey Island, use **KEYS → t → ✓** for Talk. Holding the scene displays the verb coin; selecting by gesture remains unmeasured.

## Controls

- **Tap the scene / LEFT:** left mouse click, usually walking or examining.
- **MOVE:** point without clicking. Yellow means enabled; tap again for direct clicks.
- **RIGHT:** right click at the last pointer position; its meaning depends on the game.
- **MENU:** Save, Load, Resume, or Return to Launcher.
- **SKIP:** Escape. Only scenes that support skipping will advance.
- **KEYS:** on-screen keyboard; a two-finger touch also opens it in menus.

First save: MENU → Save → empty slot → Save. The default name is fine.
Wait for the game to return before removing power. In BASS and Teenagent,
point near the top edge for inventory. Amazon Queen has its action panel below.

## Troubleshooting

No port: use a data-capable cable, connect directly, and close other serial tools.
Wrong package: obtain the exact file above; renaming a different version will not help.
Interrupted copy: reconnect and select the same package. Only our marked incomplete
installation can resume. Existing complete games are checked; saves are retained.
Missing card: power off, insert FAT32 microSD, then restart; the firmware does not format it.

See the [compatibility table](../COMPATIBILITY.md) for the actual test scope.
A working first room is not a full-game certification.


## Skins and sound

In the launcher, choose **Settings → GUI → Theme**: Tab5 Light, Tab5 Dark,
or Tab5 Black. **Settings → Tab5 → Sidebars** independently selects Dark blue,
Light, Black, or Follow menu skin.

In a game, the large **− / +** buttons at the lower left adjust device volume
in10% steps. **MUTE / UNMUTE** at the lower right toggles audio. Raising volume
while muted does not unmute it. Per-game music/effects/speech settings remain
available in the native Volume menu and may additionally mute an individual game.

[Dragon History — official download / pobranie od autora](https://www.ucw.cz/draci-historie/index-en.html).

## First action in Sołtys

Walk close to an object first by tapping the ground beside it. Then use
MOVE → object → RIGHT. The Polish distance warning means the hero is too far
away. Wait for speech/animation to finish (or try SKIP) before the next command
or a save. This is the game's interaction rule, not a missing touch control.

In Lure, SKIP during gameplay can open the original quit confirmation. Another
SKIP cancels it. Use the sidebar MENU → Save for saving.

## Dráscula: selecting an action

Use MOVE. Point at WALK in the top bar, press LEFT, then point at a destination
and press LEFT again. Use the same sequence for LOOK/TAKE/TALK. Separating
pointing from clicking matters here: jumping directly from the top bar to the
scene can select the wrong action in the original interface.

## Nippon Safes: first start

1. Choose the **JAPANESE / ENGLISH** book.
2. Choose the closed **Nippon Safes** book (new game), then press **RIGHT**.
3. For the tested Dino route, choose **NE, RI, HO, WA, I, KI** — tiles
   **6,4,7,2,5,8**, counting from the bottom-left tile toward the top-right.
4. Tap the text to advance the opening conversation. The smoke covers Dino
   and the museum; the other two characters have not been tested separately.

The generic MENU → Save is not supported here. Use **KEYS → s → green ✓**,
then the normal save chooser. In-game load: **KEYS → l → ✓**. The character
code is documented by the pinned open ScummVM engine (gui_ns.cpp).

Nippon after restart: start the game, choose EN and the open **SAVED GAME**
book, then your slot. Do not use the launcher Load shortcut for this engine.
