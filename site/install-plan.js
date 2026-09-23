// Per-game publication makes adding games safe alongside an existing library.
export function inventory(lines) {
  const result = new Map();
  for (const line of lines) {
    const m = /^T5A1 ITEM ([FD]) (\d+) ([a-zA-Z0-9_.\/-]+)$/.exec(line);
    if (m) result.set(m[3], { type: m[1], size: Number(m[2]) });
  }
  return result;
}
export function gameInstallPlan(observed, profile) {
  const root = `games/${profile.installRoot || profile.id}/`;
  const receipt = root + (profile.receiptName || "game.json");
  const marker = root + (profile.markerName || ".tab5adv-installing");
  const paths = profile.files.map(f => root + f.name);
  if (observed.has(receipt)) {
    if (profile.files.every(f => observed.get(root + f.name)?.size === f.size)) return { mode: "installed", marker, receipt, root };
    throw new Error(`installed-game-incomplete:${profile.id}`);
  }
  const recovery = observed.has(marker);
  if (!recovery && paths.some(p => observed.has(p))) throw new Error(`existing-files:${profile.id}`);
  return { mode: recovery ? "recovery" : "new", marker, receipt, root };
}

// Drascula's official distribution is two ZIPs. Reuse the same transfer path;
// complete music before publishing a new base game's receipt.
export function completeSelection(selected, observed) {
  const result = new Set(selected);
  if (result.has("drascula_music") && !result.has("drascula")) {
    if (!observed.has("games/drascula/game.json")) throw new Error("music-requires-game");
    result.add("drascula");
  }
  if (result.has("drascula") && !result.has("drascula_music")) {
    if (!observed.has("games/drascula/music.json")) throw new Error("drascula-music-required");
    result.add("drascula_music");
  }
  return result.has("drascula_music")
    ? ["drascula_music", ...[...result].filter(id => id !== "drascula_music")]
    : [...result];
}
