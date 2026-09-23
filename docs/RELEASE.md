# 0.3.0-rc3 — automatic rotation and calmer controls

RC3 adds two landscape orientations, a rotation lock, quieter side controls and
project branding in the local player profile. It remains a **preview**. The
13-game collection is unchanged: nine free-game profiles and four for owned GOG
packages. [Compatibility](COMPATIBILITY.md) distinguishes first-scene trials
from full playthroughs.

## Changes since RC2

- Automatic 0°/180° landscape rotation using Tab5's BMI270. A pose must stay
  stable for about one second. Flat/diagonal positions retain the previous pose;
  rotation waits while the screen is touched.
- **QUICK** pauses the game for volume, mute, rotation lock, Help and optional
  CRT. The lock and locked pose are retained after restart. Mouse buttons,
  pointer, MENU, SKIP and KEYS stay directly available on the side rails.
- Black rails are the default for new settings. Existing colour choices are
  preserved; text and highlights are quieter.
- Profile has a larger T5 FREE logo, readable project link and offline QR.
  Library, playtime and points remain local to the microSD.
- An optional zfast-derived RGB565 CRT effect is **experimental and OFF by
  default**. It uses a brightness-dependent beam/mask adaptation, not the exact
  GPU shader. Unsupported modes remain unfiltered.

**CRT performance limit:** three samples of the same filter path added about
22.74 ms (Sołtys), 25.43 ms (BASS) and 47.44 ms (Curse) to the graphics stage per
frame. This missed the 8 ms target and can reduce responsiveness. These are
opening-scene/menu intervals from the preceding CRT candidate, not game-wide
FPS figures. Leave CRT OFF for normal play. RC3 does not claim this target passed.

All 45 support assets and the game set are unchanged. No game data needs
re-importing. Firmware flashing does not format microSD; retain games, saves
and preferences. The website is maintained separately from this repository.

## Payload identity

| Artifact | Identity |
| :--- | :--- |
| Firmware source | `65aea9de2b15b48ee255afcd44dfe4bfb8585b73` |
| Application | 8,263,232 bytes; SHA-256 `b4ffce9464eb6fae17d0edaf9ce20d0fbebb68f53ede3c5f4006a3424b3326d0` |
| Merged Web Tools image | 8,328,768 bytes; SHA-256 `bf465a2e8c676d319ced9efd742f1d10b4759d4ee321b04583cb32c4d5ffe9b0` |
| Corresponding-source archive | 399,743,103 bytes; SHA-256 `3362dbd30957389493662e53881aa3b982cccffc80ec658c050b0bd7a48cc2ff` |

The versioned directory `site/releases/v0.3.0-rc3/` includes the firmware
manifest, merged image, 45 support assets, source patch, BUILD.json, SOURCE.md
and SHA256SUMS. Dráscula music comes from the user's separate downloaded archive.

## Matching source download

[Download tab5adv-source.tar.gz](https://github.com/fiedoruk/tab5adv/releases/download/v0.3.0-rc3/tab5adv-source.tar.gz)
from [GitHub Release v0.3.0-rc3](https://github.com/fiedoruk/tab5adv/releases/tag/v0.3.0-rc3).
Preserve SOURCE.md, the patch, licences and checksums with the binary. For a full
checksum check, put the archive at `source/tab5adv-source.tar.gz` within the
release directory and run `shasum -a 256 -c SHA256SUMS` there.

The archive omits external runtime `kyra.dat`; SOURCE.md records its pinned
origin. It contains no game packages, saves, private device backups or local Git
history. Upstream notices are retained; [licences and provenance](../NOTICES.md)
include the CRT adaptation.

## RC3 checks

- Shared C++11 input/orientation/CRT tests under AddressSanitizer and
  UndefinedBehaviorSanitizer: corner mapping, held contact, one-second debounce,
  stale/flat/diagonal readings, lock, and the rotated HUD.
- Actual Tab5 flash verification and full application readback match the
  application hash above. The build used two compiler jobs; the Mac reported
  no thermal warning.
- Actual BMI270 initialisation and fresh samples. Both presentation paths and
  inverse raw touch were exercised through USB diagnostics; a physical LCD
  framebuffer comparison matched all 921,600 pixels after a 180° reversal.
- Rotation lock blocked opposite injected sensor samples, held contact blocked
  auto rotation, and releasing contact allowed the stable opposite pose.
- Locked 180° survived restart despite the sensor reporting the normal pose.
  The camera confirmed the actual upside-down display; switching back to AUTO
  selected the normal pose. The owner then physically turned Tab5 from USB-left
  to USB-right: fresh BMI270 X changed from about +946 mg to −965 mg, AUTO
  selected 180°, and the camera confirmed the controls stayed upright.
  This is scoped UI/control validation, not a new full-game acceptance of all 13 titles.

## Earlier browser installation check (rc1)

On 23 September 2026, an embedded Chromium browser on macOS performed the
actual ESP Web Tools 0.3.0-rc1 flash and fresh Lure data transfer over Web Serial.
The rc1 application readback matched that release SHA; Lure and the updated icon archive
matched their file hashes. Thirty saves and two profile copies stayed unchanged.
This used a previously authorised port and an existing FAT32 card with an empty
Lure destination, rather than a newly formatted card.

## Still unmeasured for this candidate

- Manual finger play and audible quality across the 13-title collection.
- A completely blank-card setup and first-time port permission in standalone
  Chrome/Edge. The measured browser path above used the preserved test card.
- Full playthroughs and compatibility with other board/panel variants.
- Reliable gesture selection from Curse's verb coin. The tested Talk workaround
  is **KEYS → t → ✓**; other actions still need manual assessment.

Use the preview label while these limits remain. Do not promote it to a stable
release solely because the firmware builds or the installer page renders.

## Recovery

Application flash and microSD are separate. Keep the card intact when restoring
a known matching firmware image; games, saves and preferences reside on it.
Do not use a private device backup as a generic public recovery image. The public
installer's manifest uses the matched merged image for this version.
