// The slide rule itself: builds the rows on the shared sheet, drives the slide
// through the --pos CSS variable, handles dragging, and plays rows on tap.

import { NOTES, KEYS, mod } from '../shared/keys.js';
import { playChord, playScale, playProgression } from '../shared/audio.js';
import {
  SHEET_COLUMNS, STRIP_CELLS, RULER_CELLS, HARM_X, MINOR_X,
  MAJOR_MODES, HARMONIC_MODES, LEFT_EXTRAS, RIGHT_EXTRAS, CHORDS, PROGRESSION,
} from './data.js';

const root = document.documentElement;
const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
const rows = [];

/* ---------- building rows ---------- */

/** A row is a label plus a track: a window `span` cells wide onto a sliding
 *  strip of chromatic note cells, with fixed interval markers on top. */
function makeRow(spec, kind, shift, deg) {
  spec = { ...spec, kind: spec.kind || kind, shift };
  const row = el('div', 'row');
  row.setAttribute('role', 'button');
  row.tabIndex = 0;
  row.setAttribute('aria-label', `${spec.num ? spec.num + ' ' : ''}${spec.name} ${spec.kind === 'chord' ? 'chord' : 'scale'}, press to play`);
  row.style.setProperty('--deg', deg || 0);
  row.style.setProperty('--shift', shift);
  row._spec = spec;

  const head = el('div', 'rowhead');
  head.innerHTML =
    (spec.num ? `<span class="num">${spec.num}</span>` : '') +
    `<span class="name">${spec.name}</span>` +
    (spec.sub ? `<span class="sub">${spec.sub}</span>` : '') +
    (spec.kind === 'chord' ? `<span class="sym" data-sym="${spec.sym}"></span>` : '') +
    '<span class="play"></span>';

  const track = el('div', 'track');
  const span = Math.max(...spec.iv) + 1;
  track.style.width = `calc(${span} * var(--cell))`;

  const strip = el('div', 'strip');
  for (let i = 0; i < STRIP_CELLS; i++) {
    const n = NOTES[i % 12];
    const c = el('div', 'cell ' + (n.length > 1 ? 'acc' : 'nat'));
    c.innerHTML = `<b>${n[0]}</b>` + (n[1] ? `<i>${n[1]}</i>` : '');
    strip.appendChild(c);
  }

  const marks = el('div', 'marks');
  spec.iv.forEach((iv, i) => {
    const m = el('div', 'mk');
    m.style.setProperty('--i', iv);
    m.innerHTML = `<span class="lab">${spec.lab[i]}</span>`;
    marks.appendChild(m);
  });

  track.append(strip, marks);
  row.append(head, track);
  attachDrag(track, () => strip.firstChild.getBoundingClientRect().width, () => playRow(row));
  head.addEventListener('click', () => playRow(row));
  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playRow(row); }
  });
  rows.push(row);
  return row;
}

/** Place a row on a panel grid. The strip shift is reduced mod 12 (the strip
 *  repeats every octave) while `col` keeps the row's true sheet column. */
function place(parent, spec, kind, shift, col, gridRow) {
  const r = makeRow(spec, kind, mod(shift, 12), col);
  r.style.gridRow = gridRow;
  r.style.setProperty('--span', Math.max(...spec.iv) + 1);
  parent.appendChild(r);
}

const scales = document.getElementById('scales');
MAJOR_MODES.forEach((m, i) => place(scales, m, 'scale', m.deg, m.deg, i + 1));
LEFT_EXTRAS.forEach((m, i) => place(scales, m, m.kind || 'scale', m.shift, m.deg, i + 9));
HARMONIC_MODES.forEach((m, i) => place(scales, m, 'scale', 9 + m.deg, HARM_X + m.deg, i + 1));
RIGHT_EXTRAS.forEach((m, i) => place(scales, m, 'scale', m.shift, HARM_X + m.deg, i + 9));
for (const col of [1, HARM_X + 1]) {
  const d = el('div', 'divider');
  d.style.gridColumn = `${col} / span 24`;
  d.style.gridRow = 8;
  scales.appendChild(d);
}

const chordBlock = document.getElementById('chords');
CHORDS.forEach((c) => place(chordBlock, c, 'chord', 0, (c.col === 2 ? MINOR_X : 0) + (c.deg || 0), c.row));

/* ---------- the key ruler ---------- */

const rstrip = document.querySelector('.rstrip');
for (let k = 0; k < RULER_CELLS; k++) {
  const key = KEYS[k % 12];
  const c = el('div', 'rcell');
  c.dataset.k = k;
  c.innerHTML = `<span class="maj">${key.name}</span><span class="tk"></span><span class="min">${key.minor}m</span>`;
  rstrip.appendChild(c);
}

/* ---------- position state ---------- */
// `pos` is the sheet's slide in semitones; `pos mod 12` is the key's pitch
// class. It is kept within [12, 36) at rest so every strip has cells on both
// sides, and silently re-centred by an octave after each slide.

let pos = 24;
let key = 0;
let settleTimer = null;
const timers = [];

function clearFlashes() {
  while (timers.length) clearTimeout(timers.pop());
  document.querySelectorAll('.mk.hit').forEach((m) => m.classList.remove('hit'));
  document.querySelectorAll('.row.playing').forEach((r) => r.classList.remove('playing'));
}
function clearOn() {
  document.querySelectorAll('.cell.on').forEach((c) => c.classList.remove('on'));
}
/** Light the cells that sit under the markers at the current rest position. */
function markOn() {
  clearOn();
  const base = Math.round(pos);
  for (const r of rows) {
    const cells = r.querySelector('.strip').children;
    const b = base + r._spec.shift;
    for (const iv of r._spec.iv) cells[b + iv]?.classList.add('on');
  }
}
const SHARP_ORDER = ['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯', 'B♯'];
const FLAT_ORDER = ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭', 'F♭'];
/** The accidentals in a key signature, in the order they are written on the stave. */
function accidentals(k) {
  const n = parseInt(k.sig, 10);
  if (!n) return 'no sharps or flats';
  return (k.flat ? FLAT_ORDER : SHARP_ORDER).slice(0, n).join(' ');
}
function updateReadout() {
  const k = KEYS[key];
  document.querySelectorAll('.kmaj').forEach((e) => (e.textContent = `${k.name} major`));
  document.querySelectorAll('.kmin').forEach((e) => (e.textContent = `${k.minor} minor`));
  document.getElementById('ksig').textContent = k.sig;
  document.getElementById('kacc').textContent = accidentals(k);
  root.classList.toggle('flats', k.flat);
  document.getElementById('majRoot').textContent = k.name;
  document.getElementById('chRoot').textContent = k.name;
  document.getElementById('hmRoot').textContent = k.minor;
  document.getElementById('ctKey').textContent = `${k.name} major`;
  const minorNotes = [5, 6, 0, 1, 2, 3, 4].map((i) => k.notes[i]);   // natural minor: same notes from degree 6
  document.getElementById('majNotes').textContent = k.notes.join('  ');
  // every note is letter + accidental slot (blank for naturals), so all cells are the same width
  const cells = (notes) => notes.map((n) => `<span class="n">${n[0]}<i>${n.length > 1 ? n.slice(1) : '&nbsp;'}</i></span>`).join('');
  document.getElementById('majNotesBar').innerHTML = cells(k.notes);
  document.getElementById('minNotesBar').innerHTML = cells(minorNotes);
  document.querySelectorAll('.sym').forEach((s) => (s.textContent = k.name + s.dataset.sym));
}
function setPos(p) {
  pos = p;
  root.style.setProperty('--pos', p);
}
/** Animate to a sheet position. */
function jumpTo(target) {
  clearFlashes();
  root.classList.remove('noanim');
  root.classList.add('sliding');
  setPos(target);
  key = mod(Math.round(target), 12);
  updateReadout();
  clearTimeout(settleTimer);
  settleTimer = setTimeout(settle, 650);
}
/** After the slide: re-centre by whole octaves (invisible) and light the cells. */
function settle() {
  root.classList.remove('sliding');
  let p = pos;
  while (p >= 36) p -= 12;
  while (p < 12) p += 12;
  if (p !== pos) {
    root.classList.add('noanim');
    setPos(p);
    void rstrip.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('noanim')));
  }
  markOn();
}
const step = (d) => jumpTo(Math.round(pos) + d);

/** Drag any strip or the ruler to slide the sheet; a tap with no movement
 *  falls through to `onTap`. `unitFn` gives the pixel width of one cell. */
function attachDrag(elm, unitFn, onTap) {
  let sx = 0, sp = 0, active = false, moved = false, id = null, unit = 1;
  elm.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    id = e.pointerId; sx = e.clientX; sp = pos; active = true; moved = false; unit = unitFn() || 1;
  });
  elm.addEventListener('pointermove', (e) => {
    if (!active || e.pointerId !== id) return;
    const dx = e.clientX - sx;
    if (!moved) {
      if (Math.abs(dx) < 6) return;
      moved = true;
      try { elm.setPointerCapture(id); } catch (_) { /* unsupported */ }
      clearTimeout(settleTimer);
      clearFlashes();
      clearOn();
      root.classList.add('noanim', 'dragging');
      root.classList.remove('sliding');
    }
    let p = sp - dx / unit;
    while (p >= 38) { p -= 12; sp -= 12; }
    while (p < 10) { p += 12; sp += 12; }
    setPos(p);
    const k = mod(Math.round(p), 12);
    if (k !== key) { key = k; updateReadout(); }
  });
  const end = (e) => {
    if (!active || (id !== null && e.pointerId !== id)) return;
    active = false;
    if (moved) { root.classList.remove('dragging'); jumpTo(Math.round(pos)); }
    else if (onTap) onTap(e);
  };
  elm.addEventListener('pointerup', end);
  elm.addEventListener('pointercancel', end);
  elm.addEventListener('lostpointercapture', () => {
    if (active && moved) { active = false; root.classList.remove('dragging'); jumpTo(Math.round(pos)); }
  });
}

document.querySelectorAll('.ruler').forEach((r) => {
  const rs = r.querySelector('.rstrip');
  attachDrag(r, () => rs.firstChild.getBoundingClientRect().width, (e) => {
    const c = e.target.closest('.rcell');
    if (c) jumpTo(+c.dataset.k);
  });
});
document.querySelectorAll('.arrow').forEach((b) => b.addEventListener('click', () => step(+b.dataset.step)));
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input,textarea')) return;
  if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
});

/* ---------- playing ---------- */

function flash(mark, delayMs, lengthMs) {
  if (!mark) return;
  timers.push(setTimeout(() => {
    mark.classList.add('hit');
    timers.push(setTimeout(() => mark.classList.remove('hit'), lengthMs));
  }, delayMs));
}

/** Chords sound together, scales climb, the progression row plays I–IV–V. */
function playRow(row) {
  const s = row._spec;
  clearFlashes();
  const pc = mod(key + s.shift, 12);
  const rootMidi = pc >= 7 ? 48 + pc : 60 + pc;   // roots span G3 … F♯4: G–B sit in octave 3, C–F♯ in octave 4
  const midis = s.iv.map((iv) => rootMidi + iv);
  const marks = row.querySelectorAll('.mk');
  row.classList.add('playing');
  let total;
  if (s.kind === 'chord') {
    total = playChord(midis) + 300;
    marks.forEach((m) => flash(m, 0, 1350));
  } else if (s.kind === 'prog') {
    const t = playProgression(PROGRESSION.map((ch) => ch.map((iv) => rootMidi + iv)));
    PROGRESSION.forEach((_, ci) => flash(marks[ci], ci * t.step, ci === PROGRESSION.length - 1 ? 900 : 540));
    total = t.total + 300;
  } else {
    const t = playScale(midis);
    midis.forEach((_, i) => flash(marks[i], i * t.step, i === midis.length - 1 ? 700 : 220));
    total = t.total + 300;
  }
  timers.push(setTimeout(() => row.classList.remove('playing'), total));
}

/* ---------- sizing ---------- */
// Columns are sized from the sheet's real width so the boxes never overflow it.

const sheetEl = document.querySelector('.sheet');
function fit() {
  const w = sheetEl.clientWidth - 34;
  const c = Math.max(24, Math.min(44, Math.floor(w / SHEET_COLUMNS)));
  root.style.setProperty('--cell', `${c}px`);
}
fit();
if (window.ResizeObserver) new ResizeObserver(fit).observe(sheetEl);
else window.addEventListener('resize', fit);

updateReadout();
markOn();
