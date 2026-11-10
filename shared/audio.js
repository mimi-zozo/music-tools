// Shared synth for both tools: one AudioContext, one keyboard-like voice, and
// helpers that schedule notes relative to "now". MIDI note numbers in, seconds
// for durations; each helper returns timing in milliseconds so the page can
// animate in step with the sound.

let ctx = null;
let master = null;
const live = new Set();   // every voice still sounding: { env, oscs, stopAt }

/** Fade out everything that is still playing, so a new tap never overlaps the last one. */
export function stopAll(fade = 0.06) {
  if (!ctx) return;
  const now = ctx.currentTime;
  for (const v of live) {
    v.env.gain.cancelScheduledValues(now);
    v.env.gain.setValueAtTime(v.env.gain.value, now);
    v.env.gain.linearRampToValueAtTime(0.0001, now + fade);
    v.oscs.forEach((o) => { try { o.stop(now + fade + 0.01); } catch (_) { /* already stopped */ } });
  }
  live.clear();
}

export function ensureAudio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC({ latencyHint: 'interactive' });
    master = ctx.createGain();
    master.gain.value = 0.22;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 4;
    master.connect(comp);
    comp.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Warm up as early as the browser allows. The context is built at load (it sits
// suspended until a user gesture) and resumed on the first pointer-down or key,
// which fires before the click that plays the first note, so that note is on time.
try { ensureAudio(); } catch (_) { /* created on first tap instead */ }
const warm = () => { try { ensureAudio(); } catch (_) { /* ignore */ } };
['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, warm, { passive: true }));

export const midiToHz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

/** One note: triangle fundamental, two sine partials and a whisper of saw,
 *  through a lowpass that closes as the note decays. `release` is the tail after
 *  `dur`; keep it short for staccato. */
export function tone(midi, t, dur, vel = 1, release = 0.4) {
  const c = ensureAudio();
  const f = midiToHz(midi);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.9 * vel, t + 0.012);
  env.gain.exponentialRampToValueAtTime(0.5 * vel, t + 0.22);
  env.gain.setValueAtTime(0.5 * vel, t + dur);
  env.gain.exponentialRampToValueAtTime(0.0008, t + dur + release);

  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 0.6;
  lp.frequency.setValueAtTime(Math.min(9000, f * 8), t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(600, f * 2.2), t + dur + Math.min(0.3, release));
  lp.connect(env);
  env.connect(master);

  const voice = { env, oscs: [] };
  live.add(voice);
  const partials = [[1, 'triangle', 1], [2, 'sine', 0.3], [3, 'sine', 0.12], [1, 'sawtooth', 0.06]];
  for (const [mult, type, amp] of partials) {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = f * mult;
    if (type === 'sawtooth') o.detune.value = 4;
    const g = c.createGain();
    g.gain.value = amp;
    o.connect(g);
    g.connect(lp);
    o.start(t);
    o.stop(t + dur + release + 0.05);
    voice.oscs.push(o);
  }
  voice.oscs[0].onended = () => live.delete(voice);
}

/** Notes together. `strum` is the tiny offset between voices; `bass` adds the
 *  root an octave down. Returns ms until the chord has died away. */
export function playChord(midis, { dur = 1.3, strum = 0.012, bass = false } = {}) {
  stopAll();
  const t = ensureAudio().currentTime + 0.03;
  if (bass) tone(midis[0] - 12, t, dur + 0.2, 0.35);
  midis.forEach((m, i) => tone(m, t + i * strum, dur, 0.8));
  return Math.round((dur + 0.4) * 1000);
}

/** Notes one after another. `release` shortens each note's tail (staccato when small).
 *  Returns the gap between notes and the total, in ms. */
export function playScale(midis, { step = 0.2, dur = 0.3, lastDur = 0.75, release = 0.4 } = {}) {
  stopAll();
  const t = ensureAudio().currentTime + 0.03;
  midis.forEach((m, i) => tone(m, t + i * step, i === midis.length - 1 ? lastDur : dur, 0.9, release));
  return { step: step * 1000, total: Math.round((midis.length * step + lastDur + release) * 1000) };
}

/** Chords one after another, e.g. I–IV–V. */
export function playProgression(chords, { step = 0.62, dur = 0.5, lastDur = 0.9 } = {}) {
  stopAll();
  const t = ensureAudio().currentTime + 0.03;
  chords.forEach((ch, ci) => {
    const d = ci === chords.length - 1 ? lastDur : dur;
    ch.forEach((m, i) => tone(m, t + ci * step + i * 0.012, d, 0.8));
  });
  return { step: step * 1000, total: Math.round((chords.length * step + lastDur) * 1000) };
}
