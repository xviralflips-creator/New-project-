/**
 * Minimal in-memory ZIP encoder (STORE method, no compression) — zero deps.
 * Sufficient for exporting a generated project of a few small text files.
 *
 * Reference: https://en.wikipedia.org/wiki/ZIP_(file_format)
 */

const TE = new TextEncoder();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c ^= bytes[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

interface Entry {
  name: string;
  data: Uint8Array;
  crc: number;
  offset: number;
}

export function makeZip(files: { path: string; content: string }[]): Uint8Array {
  const localChunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  const entries: Entry[] = [];
  let offset = 0;

  for (const f of files) {
    const name = TE.encode(f.path);
    const data = TE.encode(f.content);
    const crc = crc32(data);

    // local file header
    const lh = new Uint8Array(30 + name.length);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);    // version
    dv.setUint16(6, 0, true);     // flags
    dv.setUint16(8, 0, true);     // method = store
    dv.setUint16(10, 0, true);    // time
    dv.setUint16(12, 0, true);    // date
    dv.setUint32(14, crc, true);
    dv.setUint32(18, data.length, true);
    dv.setUint32(22, data.length, true);
    dv.setUint16(26, name.length, true);
    dv.setUint16(28, 0, true);
    lh.set(name, 30);
    localChunks.push(lh, data);
    entries.push({ name: f.path, data, crc, offset });
    offset += lh.length + data.length;
  }

  let centralSize = 0;
  for (const e of entries) {
    const name = TE.encode(e.name);
    const cd = new Uint8Array(46 + name.length);
    const dv = new DataView(cd.buffer);
    dv.setUint32(0, 0x02014b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 20, true);
    dv.setUint16(8, 0, true);
    dv.setUint16(10, 0, true);
    dv.setUint16(12, 0, true);
    dv.setUint16(14, 0, true);
    dv.setUint32(16, e.crc, true);
    dv.setUint32(20, e.data.length, true);
    dv.setUint32(24, e.data.length, true);
    dv.setUint16(28, name.length, true);
    dv.setUint16(30, 0, true);
    dv.setUint16(32, 0, true);
    dv.setUint16(34, 0, true);
    dv.setUint16(36, 0, true);
    dv.setUint32(38, 0, true);
    dv.setUint32(42, e.offset, true);
    cd.set(name, 46);
    central.push(cd);
    centralSize += cd.length;
  }

  const eocd = new Uint8Array(22);
  const dv = new DataView(eocd.buffer);
  dv.setUint32(0, 0x06054b50, true);
  dv.setUint16(4, 0, true);
  dv.setUint16(6, 0, true);
  dv.setUint16(8, entries.length, true);
  dv.setUint16(10, entries.length, true);
  dv.setUint32(12, centralSize, true);
  dv.setUint32(16, offset, true);
  dv.setUint16(20, 0, true);

  const total =
    localChunks.reduce((n, c) => n + c.length, 0) + centralSize + eocd.length;
  const out = new Uint8Array(total);
  let p = 0;
  for (const c of localChunks) {
    out.set(c, p);
    p += c.length;
  }
  for (const c of central) {
    out.set(c, p);
    p += c.length;
  }
  out.set(eocd, p);
  return out;
}
