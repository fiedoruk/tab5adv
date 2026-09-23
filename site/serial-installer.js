import { chooseTab5Port } from "./usb-port.js";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class Tab5Serial {
  constructor(log = () => {}) {
    this.log = log;
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.pending = new Uint8Array();
  }

  async open() {
    if (!("serial" in navigator)) throw new Error("web-serial-unsupported");
    this.port=await chooseTab5Port(this.log);
    await this.port.open({ baudRate: 115200, bufferSize: 65536 });
    this.reader = this.port.readable.getReader();
    this.writer = this.port.writable.getWriter();
    await this.port.setSignals({ dataTerminalReady: false, requestToSend: true });
    await delay(180);
    await this.port.setSignals({ dataTerminalReady: false, requestToSend: false });
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      const line = await this.protocolLine(deadline - Date.now());
      if (line.startsWith("T5A1 WAIT ")) await this.line("T5A1");
      if (line === "T5A1 READY") {
        this.log("Tab5: READY");
        return;
      }
    }
    throw new Error("tab5-timeout");
  }

  async close() {
    try { await this.reader?.cancel(); } catch (_) { /* port may already be gone */ }
    try { this.reader?.releaseLock(); } catch (_) { /* no lock */ }
    try { this.writer?.releaseLock(); } catch (_) { /* no lock */ }
    try { await this.port?.close(); } catch (_) { /* device may be restarting */ }
  }

  async line(text) {
    await this.writer.write(encoder.encode(`${text}\n`));
  }

  async raw(bytes) {
    await this.writer.write(bytes);
  }

  async readLine(timeoutMs = 15000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const newline = this.pending.indexOf(10);
      if (newline >= 0) {
        const value = decoder.decode(this.pending.subarray(0, newline)).replace(/\r$/, "");
        this.pending = this.pending.slice(newline + 1);
        return value;
      }
      const remaining = deadline - Date.now();
      let timer;
      let result;
      try {
        result = await Promise.race([
          this.reader.read(),
          new Promise(resolve => { timer=setTimeout(() => resolve({ timeout:true }), Math.max(1,remaining)); }),
        ]);
      } finally { clearTimeout(timer); }
      if (result.timeout) break;
      if (result.done) throw new Error("serial-closed");
      if (result.value?.length) {
        const combined = new Uint8Array(this.pending.length + result.value.length);
        combined.set(this.pending);
        combined.set(result.value, this.pending.length);
        this.pending = combined;
      }
    }
    throw new Error("serial-timeout");
  }

  async protocolLine(timeoutMs = 15000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const line = await this.readLine(deadline - Date.now());
      if (line.startsWith("T5A1 ")) return line;
    }
    throw new Error("protocol-timeout");
  }

  async info(minimum = 2) {
    await this.line("INFO");
    const reply = /^T5A1 INFO ([234567])$/.exec(await this.protocolLine());
    if (!reply || Number(reply[1]) < minimum) throw new Error("firmware-update-required");
    return Number(reply[1]);
  }

  async hash(remote) {
    await this.line(`HASH ${remote}`);
    const response = await this.protocolLine(120000);
    const match = /^T5A1 HASH ([^ ]+) ([a-f0-9]{64})$/.exec(response);
    if (!match || match[1] !== remote) throw new Error(`hash-failed:${remote}`);
    return match[2];
  }

  async list() {
    await this.line("LIST");
    const items = [];
    for (;;) {
      const line = await this.protocolLine(30000);
      if (line === "T5A1 LIST-DONE") return items;
      if (line.startsWith("T5A1 ITEM ")) items.push(line);
      else if (line.startsWith("T5A1 ERROR ")) throw new Error(line);
    }
  }

  async put(blob, remote, digest, onBytes = () => {}, replace = true) {
    await this.line(`PUT ${remote} ${blob.size} ${digest} ${replace ? 1 : 0}`);
    const start = await this.protocolLine();
    if (start.startsWith("T5A1 ERROR ")) throw new Error(start);
    if (!start.startsWith("T5A1 GO ")) throw new Error(`unexpected:${start}`);
    let sent = 0;
    while (sent < blob.size) {
      const request = await this.protocolLine();
      const match = /^T5A1 CHUNK (\d+) (\d+)$/.exec(request);
      if (!match || Number(match[2]) !== sent) throw new Error(`bad-chunk:${request}`);
      const wanted = Number(match[1]);
      const bytes = new Uint8Array(await blob.slice(sent, sent + wanted).arrayBuffer());
      if (bytes.length !== wanted) throw new Error("source-ended");
      await this.raw(bytes);
      const ack = await this.protocolLine();
      const ackMatch = /^T5A1 ACK (\d+)$/.exec(ack);
      if (!ackMatch || Number(ackMatch[1]) !== sent + wanted) throw new Error(`bad-ack:${ack}`);
      sent = Number(ackMatch[1]);
      onBytes(sent);
    }
    const stored = await this.protocolLine(30000);
    if (stored !== `T5A1 STORED ${remote} ${blob.size} ${digest}`) throw new Error(`not-stored:${stored}`);
    this.log(`OK ${remote}`);
  }

  async restart() {
    await this.line("DONE");
    const line = await this.protocolLine(10000);
    if (line !== "T5A1 RESTART") throw new Error(`bad-restart:${line}`);
  }
}
