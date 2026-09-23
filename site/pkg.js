const decoder = new TextDecoder();

export { GAME_PROFILES } from "./catalog.js";
import { extractZip } from "./zip.js";

function hex(bytes) {
  return [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

export async function sha256(blob) {
  return hex(await crypto.subtle.digest("SHA-256", await blob.arrayBuffer()));
}

export async function verifyPackage(file, profile) {
  if (!file || !(file instanceof Blob)) throw new Error("missing-file");
  const digest = await sha256(file);
  if (digest !== profile.packageSha256) {
    throw new Error(`unknown-package:${digest}`);
  }
  return { name: file.name || profile.packageName, size: file.size, sha256: digest };
}

function u64(view, offset) {
  const value = view.getBigUint64(offset, false);
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("xar-too-large");
  return Number(value);
}

async function decompress(blob, format) {
  if (!("DecompressionStream" in globalThis)) throw new Error("decompression-unsupported");
  const stream = blob.stream().pipeThrough(new DecompressionStream(format));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function directChild(element, tagName) {
  return [...element.children].find((child) => child.tagName === tagName) || null;
}

async function xarScripts(file) {
  const header = await file.slice(0, 28).arrayBuffer();
  const view = new DataView(header);
  if (view.byteLength < 28 || decoder.decode(new Uint8Array(header, 0, 4)) !== "xar!") {
    throw new Error("not-xar");
  }
  const headerSize = view.getUint16(4, false);
  const compressedTocSize = u64(view, 8);
  const heapStart = headerSize + compressedTocSize;
  if (headerSize < 28 || !Number.isSafeInteger(heapStart) || heapStart > file.size) throw new Error("broken-xar");

  const tocCompressed = file.slice(headerSize, heapStart);
  const toc = decoder.decode(await decompress(tocCompressed, "deflate"));
  const documentNode = new DOMParser().parseFromString(toc, "application/xml");
  if (documentNode.querySelector("parsererror")) throw new Error("broken-xar-toc");
  const scripts = [...documentNode.getElementsByTagName("file")].find((entry) => {
    const name = directChild(entry, "name");
    return name?.textContent === "Scripts";
  });
  const data = scripts && directChild(scripts, "data");
  if (!data) throw new Error("missing-scripts");
  const offset = Number(directChild(data, "offset")?.textContent);
  const length = Number(directChild(data, "length")?.textContent);
  const payloadStart = heapStart + offset;
  const payloadEnd = payloadStart + length;
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 1 ||
      !Number.isSafeInteger(payloadStart) || !Number.isSafeInteger(payloadEnd) || payloadEnd > file.size) {
    throw new Error("broken-scripts-range");
  }
  return file.slice(payloadStart, payloadEnd);
}

function octal(bytes, start, length) {
  const text = decoder.decode(bytes.subarray(start, start + length));
  if (!/^[0-7]+$/.test(text)) throw new Error("broken-cpio-field");
  return Number.parseInt(text, 8);
}

function parseOdc(cpio) {
  const entries = [];
  let offset = 0;
  while (offset + 76 <= cpio.byteLength) {
    const header = cpio.subarray(offset, offset + 76);
    if (decoder.decode(header.subarray(0, 6)) !== "070707") throw new Error("broken-cpio");
    const nameSize = octal(header, 59, 6);
    const fileSize = octal(header, 65, 11);
    const nameStart = offset + 76;
    const dataStart = nameStart + nameSize;
    const next = dataStart + fileSize;
    if (nameSize < 1 || next > cpio.byteLength || cpio[nameStart + nameSize - 1] !== 0) throw new Error("broken-cpio-range");
    const name = decoder.decode(cpio.subarray(nameStart, nameStart + nameSize - 1));
    if (name === "TRAILER!!!") return entries;
    entries.push({ name, size: fileSize, bytes: cpio.subarray(dataStart, next) });
    offset = next;
  }
  throw new Error("missing-cpio-trailer");
}

export async function extractGame(file, profile, progress = () => {}) {
  if (profile.packageFormat === "zip") { progress("zip"); return extractZip(file, profile, sha256); }
  progress("xar");
  const scripts = await xarScripts(file);
  progress("gzip");
  const cpio = await decompress(scripts, "gzip");
  progress("files");
  const entries = parseOdc(cpio);
  const selected = [];
  for (const wanted of profile.files) {
    const candidates = entries.filter((entry) => entry.name.endsWith(`/${wanted.name}`) && entry.size === wanted.size);
    let match = null;
    for (const candidate of candidates) {
      const blob = new Blob([candidate.bytes]);
      if (await sha256(blob) === wanted.sha256) {
        match = { ...wanted, blob };
        break;
      }
    }
    if (!match) throw new Error(`missing-game-file:${wanted.name}`);
    selected.push(match);
  }
  progress("ready");
  return selected;
}

export function makeReceipt(profile, packageReceipt) {
  return new Blob([`${JSON.stringify({
    schema: 1,
    game: profile.id,
    title: profile.title,
    engine: profile.engine,
    edition: profile.edition,
    source: {
      kind: profile.packageFormat === "zip" ? "freeware-archive" : "gog-offline-installer-macos",
      url: profile.sourceUrl,
      filename: packageReceipt.name,
      size: packageReceipt.size,
      sha256: packageReceipt.sha256,
      account_verified: false,
    },
    files: profile.files.map(({ name, size, sha256: digest }) => ({ name, size, sha256: digest })),
    verifier: "tab5adv-web/0.2.0-rc1",
    local_processing: true,
  }, null, 2)}\n`], { type: "application/json" });
}
