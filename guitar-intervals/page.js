// Renders every shape as a horizontal fretboard (nut side on the left, low E at the
// bottom) and plays root → interval when a shape is tapped.

import { OPEN_MIDI, SEMITONES, ALSO, SECTIONS, MAIN, ORBIT, EXTRAS } from './data.js';
import { playScale } from '../shared/audio.js';
import { NOTES } from '../shared/keys.js';

const SVG = 'http://www.w3.org/2000/svg';
const FRET_W = 56;      // px per fret
const STRING_GAP = 28;  // px between strings
const PAD_X = 12;
const PAD_TOP = 14;
const PAD_BOTTOM = 30;  // room for fret numbers
const R = 13;           // dot radius
const INLAYS = new Set([3, 5, 7, 9, 15, 17, 19, 21]);

const el = (tag, attrs = {}, text) => {
  const n = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};

const midiOf = ([s, f]) => OPEN_MIDI[s] + f;
const nameOf = (midi) => NOTES[((midi % 12) + 12) % 12][0];
const mod12 = (n) => ((n % 12) + 12) % 12;

/** Move a shape so its root is the chosen pitch class, keeping the same strings.
 *  The shape sits in the lowest position where every note is fretted (no open strings),
 *  and the diagram window (f0, nf) is recomputed around it. */
function transpose(shape, pc) {
  const [rs, rf] = shape.root;
  let delta = mod12(pc - OPEN_MIDI[rs]) - rf;
  const frets = () => [shape.root, ...shape.notes].map(([, f]) => f + delta);
  while (Math.min(...frets()) < 1) delta += 12;
  while (Math.min(...frets()) - 12 >= 1) delta -= 12;
  const root = [rs, rf + delta];
  const notes = shape.notes.map(([s, f]) => [s, f + delta]);
  const lo = Math.min(...frets()), hi = Math.max(...frets());
  const nf = Math.max(shape.nf, hi - lo + 1);
  const f0 = Math.max(1, lo - Math.floor((nf - (hi - lo + 1)) / 2));
  return { ...shape, root, notes, f0, nf };
}

/** The notes a tap plays, with the dots each one lights up. Ordinary shapes: root then
 *  the function note at its real pitch. Orbit boards: root → pitch, root → next pitch…
 *  from low to high; positions that share a pitch sound once, lighting up together. */
function playbackPlan(shape, rootDot, dots, orbit) {
  const root = { m: midiOf(shape.root), ds: [rootDot] };
  const byPitch = new Map();
  shape.notes.forEach((n, i) => {
    const m = midiOf(n);
    if (!byPitch.has(m)) byPitch.set(m, { m, ds: [] });
    byPitch.get(m).ds.push(dots[i]);
  });
  const tones = [...byPitch.values()].sort((a, b) => a.m - b.m);
  const plan = [];
  tones.forEach((tn, i) => {
    if (i === 0 || orbit) plan.push(root);
    plan.push(tn);
  });
  return plan.length ? plan : [root];
}

function drawBoard(shape) {
  const { f0, nf } = shape;
  const w = PAD_X * 2 + nf * FRET_W;
  const h = PAD_TOP + 5 * STRING_GAP + PAD_BOTTOM;
  const svg = el('svg', { viewBox: `0 0 ${w} ${h}`, width: w, height: h, role: 'img',
    'aria-label': `${shape.fn === 'R' ? 'Octave' : shape.fn} shape, frets ${f0}–${f0 + nf - 1}` });

  const x = (fret) => PAD_X + (fret - f0 + 0.5) * FRET_W;   // centre of a fret
  const y = (s) => PAD_TOP + (5 - s) * STRING_GAP;            // low E at the bottom
  const left = PAD_X, right = PAD_X + nf * FRET_W, top = y(5), bottom = y(0);

  svg.appendChild(el('rect', { x: left, y: top, width: right - left, height: bottom - top, fill: 'var(--board)', rx: 2 }));

  // inlays sit between the D and G strings; 12 gets two, either side of them
  for (let f = f0; f < f0 + nf; f++) {
    if (INLAYS.has(f)) svg.appendChild(el('circle', { cx: x(f), cy: (y(2) + y(3)) / 2, r: 6, fill: 'var(--inlay)' }));
    if (f === 12) {
      svg.appendChild(el('circle', { cx: x(f), cy: (y(1) + y(2)) / 2, r: 6, fill: 'var(--inlay)' }));
      svg.appendChild(el('circle', { cx: x(f), cy: (y(3) + y(4)) / 2, r: 6, fill: 'var(--inlay)' }));
    }
  }
  // fret wires; a nut when the window starts at the open strings
  for (let i = 0; i <= nf; i++) {
    const fx = left + i * FRET_W;
    const nut = f0 === 0 && i === 1;
    svg.appendChild(el('line', { x1: fx, y1: top, x2: fx, y2: bottom, stroke: nut ? 'var(--string)' : 'var(--fret)', 'stroke-width': nut ? 6 : 2.5 }));
  }
  // strings, thicker toward the low E
  for (let s = 0; s < 6; s++) {
    svg.appendChild(el('line', { x1: left, y1: y(s), x2: right, y2: y(s), stroke: 'var(--string)', 'stroke-width': (2.4 - s * 0.28).toFixed(2) }));
  }
  // fret numbers under the marker frets (and the first fret shown, so the window is never unlabelled)
  for (let f = f0; f < f0 + nf; f++) {
    if (INLAYS.has(f) || f === 12 || (f === f0 && f > 0)) {
      svg.appendChild(el('text', { x: x(f), y: bottom + 17, 'text-anchor': 'middle', 'font-family': 'IBM Plex Mono, monospace', 'font-size': 13, fill: 'var(--muted)' }, f));
    }
  }

  const dot = (pos, label, isRoot) => {
    const g = el('g', { class: 'dot' });
    g.appendChild(el('circle', { cx: x(pos[1]), cy: y(pos[0]), r: R, fill: isRoot ? 'var(--root)' : 'var(--tone)' }));
    const small = label.length > 2;
    g.appendChild(el('text', { x: x(pos[1]), y: y(pos[0]) + (small ? 4.5 : 5), 'text-anchor': 'middle',
      'font-family': 'Bricolage Grotesque, sans-serif', 'font-weight': 700, 'font-size': small ? 11 : 14,
      fill: isRoot ? 'var(--root-ink)' : 'var(--tone-ink)' }, label));
    return g;
  };
  const dots = [];
  for (const n of shape.notes) {
    const d = dot(n, shape.fn === 'R' ? 'R' : shape.fn, false);
    svg.appendChild(d); dots.push(d);
  }
  const rootDot = dot(shape.root, 'R', true);
  svg.appendChild(rootDot);
  return { svg, rootDot, dots };
}

function shapeCard(source, orbit = false) {
  const shape = transpose(source, rootPc);
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'shape' + (orbit ? ' orbit' : '');
  const { svg, rootDot, dots } = drawBoard(shape);
  card.appendChild(svg);

  const plan = playbackPlan(shape, rootDot, dots, orbit);
  const midis = plan.map((x) => x.m);
  const cap = document.createElement('div');
  cap.className = 'cap';
  const label = document.createElement('span');
  label.textContent = shape.cap || `Root on ${['E', 'A', 'D', 'G', 'B', 'e'][shape.root[0]]}`;
  const notes = document.createElement('b');
  notes.textContent = [...new Set(midis.map(nameOf))].join(' → ');
  cap.append(label, notes);
  card.appendChild(cap);
  card.setAttribute('aria-label', `${label.textContent}: play ${notes.textContent}`);

  let timers = [];
  card.addEventListener('click', () => {
    timers.forEach(clearTimeout); timers = [];
    document.querySelectorAll('.shape.playing').forEach((c) => c.classList.remove('playing'));
    document.querySelectorAll('.dot.hit').forEach((d) => d.classList.remove('hit'));
    const { step, total } = playScale(midis, { step: 0.5, dur: 0.45, lastDur: 0.9 });
    card.classList.add('playing');
    const flash = (d) => { d.classList.remove('hit'); void d.getBBox(); d.classList.add('hit'); };
    // each dot lights up as its note sounds
    plan.forEach(({ ds }, i) => timers.push(setTimeout(() => ds.forEach(flash), step * i)));
    timers.push(setTimeout(() => { card.classList.remove('playing'); [rootDot, ...dots].forEach((d) => d.classList.remove('hit')); }, total));
  });
  return card;
}

function fnBlock(fn, shapes, orbit) {
  const block = document.createElement('div');
  block.className = 'fn';
  const h = document.createElement('h4');
  h.textContent = fn === 'R' ? 'Octave shapes' : fn;
  if (ALSO[fn]) { const s = document.createElement('small'); s.textContent = `(${ALSO[fn]})`; h.appendChild(s); }
  block.appendChild(h);
  const row = document.createElement('div');
  row.className = orbit ? 'col' : 'row';
  shapes.forEach((sh) => row.appendChild(shapeCard(sh, orbit)));
  block.appendChild(row);
  return block;
}

const POOL = { basic: MAIN, additional: MAIN, orbit: ORBIT, extras: EXTRAS };
const BLURB = {
  basic: 'The six shapes every chord is built from: 3, 5, 7 and their flattened forms.',
  additional: 'The remaining functions, first the ones that complete the blueprint, then the chromatic leftovers and the octave.',
  orbit: 'All of each function’s shapes on one neck, pictured around a single root, to see the broader connections between larger areas of the neck.',
  extras: 'Optional shapes that depend on your hand stretch. Not needed for the two-point system, but useful additions.',
};

const main = document.getElementById('main');

function build() {
  main.replaceChildren();
  for (const sec of SECTIONS) {
    const part = document.createElement('section');
    part.className = 'part'; part.id = sec.id;
    const h2 = document.createElement('h2'); h2.textContent = sec.title; part.appendChild(h2);
    const p = document.createElement('p'); p.textContent = BLURB[sec.id]; part.appendChild(p);
    for (const g of sec.groups) {
      if (g.title) { const h3 = document.createElement('h3'); h3.className = 'group'; h3.textContent = g.title; part.appendChild(h3); }
      if (sec.sideBySide) {
        for (const fns of g.rows) {
          const row = document.createElement('div');
          row.className = 'fnrow';
          for (const fn of fns) {
            const shapes = POOL[sec.id].filter((s) => s.fn === fn);
            if (shapes.length) row.appendChild(fnBlock(fn, shapes, true));
          }
          part.appendChild(row);
        }
      } else {
        for (const fn of g.fns) {
          const shapes = POOL[sec.id].filter((s) => s.fn === fn);
          if (shapes.length) part.appendChild(fnBlock(fn, shapes, false));
        }
      }
    }
    main.appendChild(part);
  }
}

// ---- root picker ----
let rootPc = 4; // E, the root most of the printed shapes use
try { const saved = localStorage.getItem('intervals-root'); if (saved !== null && !Number.isNaN(+saved)) rootPc = mod12(+saved); } catch (_) { /* no storage */ }

const picker = document.getElementById('picker');
const buttons = [];
NOTES.forEach((names, pc) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.id = `root-${pc}`;
  b.innerHTML = names.length > 1 ? `${names[0]}<small>${names[1]}</small>` : names[0];
  b.addEventListener('click', () => {
    rootPc = pc;
    try { localStorage.setItem('intervals-root', pc); } catch (_) { /* ignore */ }
    buttons.forEach((x, i) => x.setAttribute('aria-pressed', i === pc));
    build();
  });
  picker.appendChild(b);
  buttons.push(b);
});
buttons.forEach((x, i) => x.setAttribute('aria-pressed', i === rootPc));
build();
