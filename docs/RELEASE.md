# 0.3.0-rc2 — clearer mouse controls and in-game help

This candidate contains nine free-game profiles and four profiles for owned
GOG packages. Each has a first-scene device check; the exact scope and limits
are in [Compatibility](COMPATIBILITY.md). It is not a full-game completion claim.

## Changes since rc1

- L CLICK and R CLICK show which mouse button they emulate, with matching icons.
- POINTER has explicit ON/OFF text as well as colour feedback.
- ? opens paused control help during a game; English/Polski switches language.
  Close returns to the game. Help opens on release, with drag cancellation.
- User instructions and the control diagram use the same labels.

The 13-game set and all45 support assets are unchanged, including launcher icons.
No game data needs re-importing for this firmware update. The application flash
does not format the microSD. Keep existing saves and preferences.

## Payload identity

| Artifact | Identity |
| :--- | :--- |
| Firmware source | `d5b5d28c74dd2d96c7ef3b848be0a51192a91a54` |
| Application | 8,229,248 bytes; SHA-256 `a9b69d6853ab30c90da458db4958ef0eedd9fd6640972d88ca84b06ac3099de1` |
| Merged Web Tools image | 8,294,784 bytes; SHA-256 `3da4406762d856ab110d439f6f6530aebfa7705076aa3ac2844866866d8452d4` |
| Corresponding-source archive | 399,696,844 bytes; SHA-256 `22ddb0b7893aaa7a09102465fb3051c1f232e64586a1b9bc38e7f5c8973bc1ca` |

The versioned directory `site/releases/v0.3.0-rc2/` holds the firmware manifest,
merged image, 45 support assets (43 runtime files and 2 data manifests), source
patch, BUILD.json, SOURCE.md and SHA256SUMS. Dráscula music is supplied from its
separate user-downloaded archive, not bundled in the support payload.

## Source download requirement

The complete matching source is supplied as a separate asset of
[GitHub Release v0.3.0-rc2](https://github.com/fiedoruk/tab5adv/releases/tag/v0.3.0-rc2):
[download tab5adv-source.tar.gz](https://github.com/fiedoruk/tab5adv/releases/download/v0.3.0-rc2/tab5adv-source.tar.gz).
Its size and SHA-256 are listed above and in BUILD.json. Preserve SOURCE.md,
the patch, licences and checksums with the binary. For a full checksum
check, place the downloaded archive at `source/tab5adv-source.tar.gz` within
the release directory, then run `shasum -a 256 -c SHA256SUMS` there.

The archive omits the external runtime file `kyra.dat`; SOURCE.md documents
its pinned origin separately. It does not bundle game archives, saves or
private device backups. Upstream code and assets retain their own notices.
See [licences and provenance](../NOTICES.md) and the
[GNU guidance on source and binary distribution](https://www.gnu.org/licenses/gpl-faq.en.html#SourceAndBinaryOnDifferentSites).

## RC2 checks

Host checks use the shared input router with AddressSanitizer/UndefinedBehaviorSanitizer.
Native RGB565 HUD layouts cover all three rail palettes and pointer ON/OFF states.
On the actual Tab5, USB-driven touches checked the English and Polish help, close
and resume, repeated opening, pointer mode and the existing game menu. These are
scoped interface checks, not a new full gameplay acceptance of all13 titles.

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
