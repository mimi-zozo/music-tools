// Draws a piano keyboard as inline SVG with some keys highlighted.
//
//   pitches     semitone numbers to highlight, counted from the leftmost C
//   labels      text for each highlighted key, in the same order
//   root        the pitch drawn in the root colour
//   wk          width of a white key in SVG units (sets the overall size)
//   showLabels  write the labels onto the keys
//   octaves     how many octaves to draw (default 2)

import { MAJOR_STEPS } from '../shared/keys.js';

const BLACK_AFTER = [0, 2, 5, 7, 9];  // white-key offsets that have a black key to their right

export function keyboard(pitches, labels, root, wk, showLabels, octaves = 2) {
  const whites = 7 * octaves;
  const W = whites * wk;
  const H = Math.round(wk * 4.2);
  const bw = wk * 0.6;
  const bh = H * 0.62;
  const idx = (p) => pitches.indexOf(p);
  const fill = (p) => (p === root ? 'var(--root)' : idx(p) >= 0 ? 'var(--tone)' : null);
  const ink = (p) => (p === root ? 'var(--root-ink)' : 'var(--tone-ink)');
  const text = (x, y, size, p) =>
    `<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="${size}" font-weight="500" fill="${ink(p)}">${labels[idx(p)]}</text>`;

  let s = `<svg viewBox="0 0 ${W + 2} ${H + 2}" role="img" aria-label="Keyboard: ${labels.join(' ')}">`;
  for (let w = 0; w < whites; w++) {
    const p = Math.floor(w / 7) * 12 + MAJOR_STEPS[w % 7];
    s += `<rect x="${w * wk + 1}" y="1" width="${wk}" height="${H}" rx="3" fill="${fill(p) || 'var(--key-w)'}" stroke="var(--key-edge)" stroke-width="0.8"/>`;
    if (showLabels && idx(p) >= 0) s += text(w * wk + 1 + wk / 2, H - 12, wk > 30 ? 14 : 11, p);
  }
  for (let w = 0; w < whites; w++) {
    const ws = MAJOR_STEPS[w % 7];
    if (!BLACK_AFTER.includes(ws)) continue;
    const p = Math.floor(w / 7) * 12 + ws + 1;
    s += `<rect x="${(w + 1) * wk + 1 - bw / 2}" y="1" width="${bw}" height="${bh}" rx="2" fill="${fill(p) || 'var(--key-b)'}" stroke="var(--key-b)" stroke-width="0.8"/>`;
    if (showLabels && idx(p) >= 0 && wk > 30) s += text((w + 1) * wk + 1, bh - 10, 12, p);
  }
  return s + '</svg>';
}
