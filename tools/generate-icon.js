/* Génère icon.png (512x512) sans dépendance externe : un escargot 🐌 stylisé
   sur fond abricot, dessiné pixel par pixel puis encodé en PNG via zlib. */
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

const S = 512;
const buf = Buffer.alloc(S * S * 4);

function set(x, y, r, g, b, a) {
  if (x < 0 || y < 0 || x >= S || y >= S) return;
  const i = (y * S + x) * 4;
  const na = a / 255;
  buf[i] = buf[i] * (1 - na) + r * na;
  buf[i + 1] = buf[i + 1] * (1 - na) + g * na;
  buf[i + 2] = buf[i + 2] * (1 - na) + b * na;
  buf[i + 3] = 255;
}
function disc(cx, cy, rad, r, g, b, a) {
  for (let y = cy - rad; y <= cy + rad; y++)
    for (let x = cx - rad; x <= cx + rad; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= rad) { const edge = Math.min(1, (rad - d)); set(x, y, r, g, b, a * (edge < 1 ? edge : 1)); }
    }
}
function ring(cx, cy, rad, w, r, g, b) {
  for (let y = cy - rad - w; y <= cy + rad + w; y++)
    for (let x = cx - rad - w; x <= cx + rad + w; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (Math.abs(d - rad) <= w) set(x, y, r, g, b, 255);
    }
}
function ellipse(cx, cy, rx, ry, r, g, b) {
  for (let y = cy - ry; y <= cy + ry; y++)
    for (let x = cx - rx; x <= cx + rx; x++) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) set(x, y, r, g, b, 255);
    }
}

// Fond abricot dégradé
for (let y = 0; y < S; y++)
  for (let x = 0; x < S; x++) {
    const t = y / S;
    const r = Math.round(255 - 8 * t), g = Math.round(214 - 20 * t), b = Math.round(163 - 20 * t);
    const i = (y * S + x) * 4;
    buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
  }

// Coque (escargot) : disque corail + spirale
const cx = 300, cy = 260, R = 150;
disc(cx, cy, R, 255, 111, 94, 255);
disc(cx, cy, R - 8, 255, 140, 120, 255);
// spirale en anneaux dégradés
ring(cx, cy, 120, 9, 255, 197, 66);
ring(cx, cy, 92, 8, 255, 111, 94);
ring(cx, cy, 64, 8, 255, 197, 66);
ring(cx, cy, 38, 7, 255, 111, 94);
disc(cx, cy, 16, 255, 197, 66, 255);

// Corps de l'escargot (turquoise)
ellipse(200, 380, 150, 60, 47, 191, 179);   // pied
ellipse(150, 320, 46, 70, 47, 191, 179);    // tête/cou
disc(150, 300, 46, 47, 191, 179, 255);
// antennes
for (let k = 0; k < 40; k++) { set(128 + Math.round(k * 0.2), 260 - k, 30, 156, 146, 255); set(129 + Math.round(k * 0.2), 260 - k, 30, 156, 146, 255); }
for (let k = 0; k < 40; k++) { set(168 + Math.round(k * 0.4), 260 - k, 30, 156, 146, 255); set(169 + Math.round(k * 0.4), 260 - k, 30, 156, 146, 255); }
disc(133, 218, 9, 30, 156, 146, 255);
disc(184, 220, 9, 30, 156, 146, 255);
// oeil
disc(150, 300, 14, 255, 255, 255, 255);
disc(154, 302, 7, 40, 40, 40, 255);

// --- Encodage PNG ---
function crc32(b) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < b.length; n++) {
    c = (crc ^ b[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(S, 0); ihdr.writeUInt32BE(S, 4); ihdr[8] = 8; ihdr[9] = 6; // RGBA
// filtrage : 1 octet de filtre (0) par ligne
const raw = Buffer.alloc(S * (S * 4 + 1));
for (let y = 0; y < S; y++) {
  raw[y * (S * 4 + 1)] = 0;
  buf.copy(raw, y * (S * 4 + 1) + 1, y * S * 4, (y + 1) * S * 4);
}
const idat = zlib.deflateSync(raw, { level: 9 });
const png = Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
fs.writeFileSync(path.join(__dirname, "..", "icon.png"), png);
console.log("icon.png écrit :", png.length, "octets");
