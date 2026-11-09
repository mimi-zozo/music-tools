// The chord-scale page: key picker, the seven diatonic chords, the scale, the
// relative minor and the degree table, all re-rendered when the key changes.

import { FIFTHS, keyById, MAJOR_STEPS } from '../shared/keys.js';
import { playChord, playScale, ensureAudio, stopAll, tone } from '../shared/audio.js';
import { keyboard } from './keyboard.js';
import { STEPS, MAJ_RN, MAJ_Q, MIN_RN, MIN_Q, DEGREES, qualitySuffix } from './data.js';

let cur = null;
const $ = (id) => document.getElementById(id);

/* ---------- pitch helpers (semitones from the keyboard's leftmost C) ---------- */

/** Pitch of scale degree `i` (0-based; 7 is the octave). */
const degree = (k, i) => k.t + MAJOR_STEPS[((i % 7) + 7) % 7] + 12 * Math.floor(i / 7);
/** Triad built on degree `i`: every other note of the scale. */
const triad = (k, i) => [degree(k, i), degree(k, i + 2), degree(k, i + 4)];
/** The scale up to and including the octave. */
const scaleP = (k) => MAJOR_STEPS.map((o) => k.t + o).concat(k.t + 12);
/** MIDI number of the keyboard's leftmost C. Every key's root lands in the C4–B4 octave,
 *  so neighbouring keys sound neighbouring. */
const base = () => 60;

const soundChord = (p) => playChord(p.map((x) => base() + x), { dur: 2.2, strum: 0.035, bass: true });
const soundScale = (p) => playScale(p.map((x) => base() + x), { step: 0.3, dur: 0.14, lastDur: 0.5, release: 0.08 });
/** One key on the big keyboard: cuts off whatever is still ringing first. */
const soundKey = (p) => { stopAll(); tone(base() + p, ensureAudio().currentTime + 0.02, 0.3, 0.9, 0.1); };

/* ---------- rendering ---------- */

function render(k) {
  cur = k;
  const n = k.notes;
  $('title').textContent = `${n[0]} major`;
  document.querySelectorAll('#picker button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.id === k.id));

  $('chords').innerHTML = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const pitches = triad(k, i);
    const labels = [n[i % 7], n[(i + 2) % 7], n[(i + 4) % 7]];
    const rn = i === 7 ? 'VIII' : MAJ_RN[i];
    const cn = i === 7 ? `${n[0]} major, octave up` : `${n[i]} ${MAJ_Q[i]}`;
    return `<article class="card" data-i="${i}"><header><span><span class="rn">${rn}</span><span class="cn">${cn}</span></span><span class="notes">${labels.join(' ')}</span></header>${keyboard(pitches, labels, pitches[0], 20, true, 3)}<button type="button" class="play" id="play-${i}">▶ Play</button></article>`;
  }).join('');

  const sl = n.concat(n[0]);
  $('scalesub').textContent = `${sl.join(' ')}. Key signature: ${k.sig}.`;
  $('scale').innerHTML = keyboard(scaleP(k), sl, k.t, 46, true);
  $('steps').innerHTML = STEPS.map((s, i) => `<span class="${s === 1 ? 'h' : ''}">${n[i]}→${n[(i + 1) % 7]} ${s === 1 ? 'H' : 'W'}</span>`).join('');

  const mn = [5, 6, 0, 1, 2, 3, 4].map((i) => n[i]);
  $('minor').innerHTML = `
    <h2>Relative minor: ${n[5]} minor</h2>
    <p>Same notes as ${n[0]} major, starting on degree 6. If phrases resolve to ${n[5]}, you are hearing ${n[5]} minor; if they settle on ${n[0]}, it is ${n[0]} major.</p>
    <div class="mrow">${mn.map((x) => `<span>${x}</span>`).join('')}<span>${mn[0]}</span></div>
    <div class="mrow">${mn.map((x, i) => `<button type="button" class="chip" data-mi="${i}"><b>${MIN_RN[i]}</b>${x}${qualitySuffix(MIN_Q[i])}</button>`).join('')}</div>
    <p style="font-size:.88rem;color:var(--muted)">Tap a chord to hear it.</p>`;

  $('degrees').innerHTML = DEGREES.map((d, i) =>
    `<tr class="${i === 5 ? 'rel' : ''}"><td class="deg">${i + 1}</td><td class="note">${n[i]}</td><td>${d[0]}</td><td class="mono">${MAJ_RN[i]} · ${n[i]}${qualitySuffix(MAJ_Q[i])}</td><td>${d[1]}</td></tr>`).join('');
}

/* ---------- wiring ---------- */

$('picker').innerHTML = FIFTHS.map((k) =>
  `<button type="button" id="key-${k.id}" data-id="${k.id}" aria-pressed="false">${k.name}<span class="rm">${k.minor}m</span><small>${k.sig}</small></button>`).join('');
$('picker').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b) location.hash = b.dataset.id;
});

function fromHash() {
  render(keyById(location.hash.slice(1)) || keyById('c'));
}
window.addEventListener('hashchange', fromHash);

$('chords').addEventListener('click', (e) => {
  const c = e.target.closest('.card');
  if (!c) return;
  soundChord(triad(cur, +c.dataset.i));
  c.classList.add('hit');
  setTimeout(() => c.classList.remove('hit'), 350);
});
$('play-scale').addEventListener('click', () => soundScale(scaleP(cur)));
$('scale').addEventListener('click', (e) => {
  const key = e.target.closest('[data-p]');
  if (key) soundKey(+key.dataset.p); else soundScale(scaleP(cur));
});
$('minor').addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  soundChord(triad(cur, +b.dataset.mi + 5).map((x) => x - 12));
});

fromHash();
