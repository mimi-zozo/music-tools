// Builds one card per interval: a button that plays the interval from C, then the
// song openers underneath, each played with its own rhythm.

import { INTERVALS } from './data.js';
import { ensureAudio, stopAll, tone } from '../shared/audio.js';
import { NOTES } from '../shared/keys.js';

let ROOT = 60; // C4 until the picker says otherwise
const mod12 = (n) => ((n % 12) + 12) % 12;
const nameOf = (midi) => NOTES[((midi % 12) + 12) % 12][0];

let timers = [];
let playingEl = null;

function reset() {
  timers.forEach(clearTimeout); timers = [];
  stopAll();
  if (playingEl) {
    playingEl.classList.remove('playing');
    playingEl.querySelectorAll('.d i.on').forEach((i) => i.classList.remove('on'));
    playingEl = null;
  }
}

/** Play a melody of [semitoneOffset, beats] from `start` at `bpm`; returns per-note timings in ms. */
function playMelody(start, bpm, notes) {
  const c = ensureAudio();
  const spb = 60 / bpm;
  const t0 = c.currentTime + 0.03;
  let at = 0;
  const times = [];
  for (const [off, beats] of notes) {
    const dur = beats * spb;
    tone(start + off, t0 + at, Math.max(0.08, dur * 0.85), 0.9);
    times.push({ at: at * 1000, len: dur * 1000 });
    at += dur;
  }
  return { times, total: Math.round((at + 0.5) * 1000) };
}

/** The interval itself: lower note, upper note, then both together. */
function playInterval(semis) {
  const c = ensureAudio();
  const t0 = c.currentTime + 0.03;
  tone(ROOT, t0, 0.55, 0.9);
  tone(ROOT + semis, t0 + 0.6, 0.55, 0.9);
  tone(ROOT, t0 + 1.25, 1.1, 0.75);
  tone(ROOT + semis, t0 + 1.25, 1.1, 0.75);
  return 2800;
}

/** Shift an example so it starts on the chosen root's pitch class, moving as little as possible. */
function startFor(ex) {
  let d = mod12(ROOT - ex.start);
  if (d > 6) d -= 12;
  return ex.start + d;
}

function card(iv) {
  const art = document.createElement('article');
  art.className = 'iv' + (iv.major ? ' major' : '');
  art.id = iv.id;

  const h = document.createElement('h2');
  h.innerHTML = `${iv.name}<small>${iv.semis} semitone${iv.semis === 1 ? '' : 's'}</small>`;
  art.appendChild(h);

  const hear = document.createElement('button');
  hear.type = 'button'; hear.className = 'hear'; hear.id = `hear-${iv.id}`;
  hear.innerHTML = `<span>▶ Hear the ${iv.name.toLowerCase()}</span><span class="n">${nameOf(ROOT)} → ${nameOf(ROOT + iv.semis)}</span>`;
  hear.addEventListener('click', () => {
    reset();
    playingEl = hear; hear.classList.add('playing');
    timers.push(setTimeout(reset, playInterval(iv.semis)));
  });
  art.appendChild(hear);

  const exs = document.createElement('div');
  exs.className = 'exs';
  iv.examples.slice(0, 3).forEach((ex, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ex'; b.id = `${iv.id}-ex${i}`;
    const bars = ex.notes.map(([off, beats]) => `<i style="height:${Math.round(8 + Math.min(18, (off + 4) * 1.2))}px;width:${Math.round(4 + beats * 4)}px"></i>`).join('');
    b.innerHTML = `<span class="pl">▶</span><span class="t">${ex.title}<span>${ex.by}</span></span><span class="d" aria-hidden="true">${bars}</span>`;
    b.addEventListener('click', () => {
      reset();
      playingEl = b; b.classList.add('playing');
      const { times, total } = playMelody(startFor(ex), ex.bpm, ex.notes);
      const is = b.querySelectorAll('.d i');
      times.forEach((t, k) => {
        timers.push(setTimeout(() => is[k].classList.add('on'), t.at));
        timers.push(setTimeout(() => is[k].classList.remove('on'), t.at + t.len));
      });
      timers.push(setTimeout(reset, total));
    });
    exs.appendChild(b);
  });
  if (!iv.examples.length) {
    const none = document.createElement('p');
    none.className = 'none';
    none.textContent = 'No public-domain tune opens with this one.';
    exs.appendChild(none);
  }
  art.appendChild(exs);

  if (iv.alsoIn && iv.alsoIn.length) {
    const box = document.createElement('div');
    box.className = 'also';
    const lab = document.createElement('div');
    lab.className = 'alsolab';
    lab.textContent = iv.examples.length ? 'Also opens with it' : 'Opens with it (not transcribed here)';
    box.appendChild(lab);
    const ul = document.createElement('ul');
    iv.alsoIn.slice(0, 3).forEach((song) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.replace(/\s*\([^)]*note[^)]*\)/i, ''))}`;
      a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = `<span>${song}</span><b aria-hidden="true">↗</b>`;
      a.title = `Search YouTube for ${song}`;
      li.appendChild(a);
      ul.appendChild(li);
    });
    box.appendChild(ul);
    art.appendChild(box);
  }
  return art;
}

const grid = document.getElementById('grid');
function build() { reset(); grid.replaceChildren(); INTERVALS.forEach((iv) => grid.appendChild(card(iv))); }

// ---- root picker ----
try { const saved = localStorage.getItem('ear-root'); if (saved !== null && !Number.isNaN(+saved)) ROOT = 60 + mod12(+saved); } catch (_) { /* no storage */ }
const picker = document.getElementById('picker');
const buttons = [];
NOTES.forEach((names, pc) => {
  const b = document.createElement('button');
  b.type = 'button'; b.id = `root-${pc}`;
  b.innerHTML = names.length > 1 ? `${names[0]}<small>${names[1]}</small>` : names[0];
  b.addEventListener('click', () => {
    ROOT = 60 + pc;
    try { localStorage.setItem('ear-root', pc); } catch (_) { /* ignore */ }
    buttons.forEach((x, i) => x.setAttribute('aria-pressed', i === pc));
    build();
  });
  picker.appendChild(b); buttons.push(b);
});
buttons.forEach((x, i) => x.setAttribute('aria-pressed', i === mod12(ROOT)));
build();
