// Minimal ZIP reader for exact, SHA-256-pinned freeware archives.
// Only stored/deflate entries listed in our manifest are extracted to memory.
const decoder = new TextDecoder();
export async function extractZip(file, profile, hash) {
  if (await hash(file) !== profile.packageSha256) throw new Error("unknown-package");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const range = (offset, length) => {
    if (!Number.isSafeInteger(offset) || offset < 0 || length < 0 || offset + length > bytes.length) throw new Error("broken-zip-range");
  };
  let end = -1;
  for (let at = bytes.length - 22; at >= Math.max(0, bytes.length - 65557); --at) {
    if (view.getUint32(at, true) === 0x06054b50 && at + 22 + view.getUint16(at + 20, true) === bytes.length) { end = at; break; }
  }
  if (end < 0 || view.getUint16(end + 4, true) || view.getUint16(end + 6, true)) throw new Error("unsupported-zip");
  const count = view.getUint16(end + 10, true), size = view.getUint32(end + 12, true);
  let at = view.getUint32(end + 16, true); range(at, size);
  if (count === 65535 || at + size !== end) throw new Error("unsupported-zip-directory");
  const entries = new Map();
  for (let n = 0; n < count; ++n) {
    range(at, 46); if (view.getUint32(at, true) !== 0x02014b50) throw new Error("broken-zip-directory");
    const flags = view.getUint16(at + 8, true), method = view.getUint16(at + 10, true);
    const compressed = view.getUint32(at + 20, true), uncompressed = view.getUint32(at + 24, true);
    const nameLength = view.getUint16(at + 28, true), extraLength = view.getUint16(at + 30, true), commentLength = view.getUint16(at + 32, true);
    range(at + 46, nameLength + extraLength + commentLength);
    const name = decoder.decode(bytes.subarray(at + 46, at + 46 + nameLength));
    const unixMode = view.getUint32(at + 38, true) >>> 16;
    if (entries.has(name)) throw new Error("duplicate-zip-entry");
    entries.set(name, { flags, method, compressed, uncompressed, unixMode, offset: view.getUint32(at + 42, true) });
    at += 46 + nameLength + extraLength + commentLength;
  }
  if (at !== end) throw new Error("broken-zip-directory-size");
  const selected = [];
  for (const wanted of profile.files) {
    const e = entries.get(wanted.archive_path);
    if (!e || e.uncompressed !== wanted.size || e.flags & 1 || (e.unixMode & 0xf000) === 0xa000 || ![0, 8].includes(e.method)) throw new Error(`unsupported-game-entry:${wanted.name}`);
    range(e.offset, 30); if (view.getUint32(e.offset, true) !== 0x04034b50) throw new Error("broken-zip-local-header");
    const start = e.offset + 30 + view.getUint16(e.offset + 26, true) + view.getUint16(e.offset + 28, true);
    range(start, e.compressed);
    const packed = new Blob([bytes.subarray(start, start + e.compressed)]);
    const blob = e.method === 0 ? packed : await new Response(packed.stream().pipeThrough(new DecompressionStream("deflate-raw"))).blob();
    if (blob.size !== wanted.size || await hash(blob) !== wanted.sha256) throw new Error(`game-file-integrity:${wanted.name}`);
    selected.push({ ...wanted, blob });
  }
  return selected;
}
