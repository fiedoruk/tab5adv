# 0.3.0-rc1 — thirteen-game preview

This candidate contains nine free-game profiles and four profiles for owned
GOG packages. Each has a first-scene device check; the exact scope and limits
are in [Compatibility](COMPATIBILITY.md). It is not a full-game completion claim.

## Payload identity

| Artifact | Identity |
| :--- | :--- |
| Firmware source | `622c0ef33f5b645eecef285de22ed35187beb78b` |
| Application | 8,226,224 bytes; SHA-256 `f7f8899860f81d7c55a5bc2e79b6fb9b0bd498ad0b1183c8ee340c6d76794fd2` |
| Merged Web Tools image | 8,291,760 bytes; SHA-256 `3f1072166e3e09767c2d715b39cea0686e5c50c751720e51133078dbd68f93de` |
| Corresponding-source archive | 399,713,910 bytes; SHA-256 `fbf97a375e1fda2947a584d54fc2a3d8ed3259fddd73af2eb713f4a9ffe46ac5` |

The versioned directory `site/releases/v0.3.0-rc1/` holds the firmware manifest,
merged image, 45 support assets (43 runtime files and 2 data manifests), source
patch, BUILD.json, SOURCE.md and SHA256SUMS. Dráscula music is supplied from its
separate user-downloaded archive, not bundled in the support payload.

## Source download requirement

The complete matching source is supplied as a separate asset of
[GitHub Release v0.3.0-rc1](https://github.com/fiedoruk/tab5adv/releases/tag/v0.3.0-rc1):
[download tab5adv-source.tar.gz](https://github.com/fiedoruk/tab5adv/releases/download/v0.3.0-rc1/tab5adv-source.tar.gz).
Its size and SHA-256 are listed above and in BUILD.json. Preserve SOURCE.md,
the patch, licences and checksums with the binary. For a full checksum
check, place the downloaded archive at `source/tab5adv-source.tar.gz` within
the release directory, then run `shasum -a 256 -c SHA256SUMS` there.

The archive omits the external runtime file `kyra.dat`; SOURCE.md documents
its pinned origin separately. It does not bundle game archives, saves or
private device backups. Upstream code and assets retain their own notices.
See [licences and provenance](../NOTICES.md) and the
[GNU guidance on source and binary distribution](https://www.gnu.org/licenses/gpl-faq.en.html#SourceAndBinaryOnDifferentSites).

## Browser installation checked

On 23 September 2026, an embedded Chromium browser on macOS performed the
actual ESP Web Tools 0.3 flash and fresh Lure data transfer over Web Serial.
Application readback matched the release SHA; Lure and the updated icon archive
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
