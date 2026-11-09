// The 18-minute session timer: 18:00 of practice (optionally split into eight 2:15 approaches),
// then a 5:00 break, then a prompt to run every learned pattern. Beeps at each change.

const PRACTICE = 18 * 60;
const BREAK = 5 * 60;
const SEG = 135; // 18 min / 8 approaches

const approaches = [
  'I · Every fret position, straight (8ths)',
  'II · Every fret position, triplets',
  'III · Repeat I with hammer-ons up, pull-offs down',
  'IV · Repeat II with hammer-ons up, pull-offs down',
  'V · Repeat I with right-hand muting',
  'VI · Repeat II with right-hand muting',
  'VII · Repeat III with right-hand muting',
  'VIII · Repeat IV with right-hand muting',
];

const $ = (id) => document.getElementById(id);
const clock = $('clock'), pn = $('pn'), pt = $('pt'), bar = $('bar'), segs = $('segs');
const startBtn = $('startBtn'), resetBtn = $('resetBtn'), useAppr = $('useApproaches');

for (let i = 0; i < 8; i++) segs.appendChild(document.createElement('b'));

let phase = 'ready';
let startAt = 0;
let raf = null;
let ctx = null;

const fmt = (s) => {
  s = Math.max(0, Math.ceil(s));
  const m = Math.floor(s / 60), r = s % 60;
  return `${m < 10 ? '0' : ''}${m}:${r < 10 ? '0' : ''}${r}`;
};

function beep(n) {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    for (let k = 0; k < n; k++) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880;
      o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + k * 0.35;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.3, t + 0.02);
      g.gain.linearRampToValueAtTime(0, t + 0.25);
      o.start(t); o.stop(t + 0.3);
    }
  } catch (e) { /* no audio available */ }
}

function setSegs(done) {
  [...segs.children].forEach((b, j) => b.classList.toggle('done', j < done));
}

function render() {
  const now = Date.now() / 1000;

  if (phase === 'ready') {
    clock.textContent = '18:00';
    pn.textContent = 'Ready';
    pt.textContent = '18 minutes on today’s pattern, then a 5-minute break';
    bar.style.width = '0%';
    setSegs(0);
    return;
  }

  const el = now - startAt;

  if (phase === 'practice') {
    const left = PRACTICE - el;
    if (left <= 0) {
      beep(3);
      phase = 'break';
      startAt = now;
      setSegs(8);
      return render();
    }
    clock.textContent = fmt(left);
    bar.style.width = `${(el / PRACTICE) * 100}%`;
    const seg = Math.min(7, Math.floor(el / SEG));
    setSegs(seg);
    if (useAppr.checked) {
      pn.textContent = `Approach ${seg + 1} of 8 · ${fmt(SEG - (el - seg * SEG))} left`;
      pt.textContent = approaches[seg];
    } else {
      pn.textContent = 'Practising';
      pt.textContent = 'Slow, clear, legato, loud';
    }
  } else if (phase === 'break') {
    const left = BREAK - el;
    if (left <= 0) {
      beep(2);
      phase = 'after';
      pn.textContent = 'Break done';
      pt.textContent = 'Now run every learned pattern, newest first, 1–5 min each';
      clock.textContent = '00:00';
      bar.style.width = '100%';
      return;
    }
    pn.textContent = 'Break';
    pt.textContent = 'Guitar down. Get up and away from it.';
    clock.textContent = fmt(left);
    bar.style.width = `${(el / BREAK) * 100}%`;
  } else {
    return;
  }

  raf = requestAnimationFrame(render);
}

startBtn.addEventListener('click', () => {
  if (phase !== 'ready') return;
  try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* ignore */ }
  phase = 'practice';
  startAt = Date.now() / 1000;
  startBtn.hidden = true;
  render();
});

resetBtn.addEventListener('click', () => {
  if (raf) cancelAnimationFrame(raf);
  phase = 'ready';
  startBtn.hidden = false;
  render();
});

render();
