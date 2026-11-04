// Shared synth for both tools: one AudioContext, one keyboard-like voice, and
// helpers that schedule notes relative to "now". MIDI note numbers in, seconds
// for durations; each helper returns timing in milliseconds so the page can
// animate in step with the sound.

let ctx = null;
let master = null;

export function ensureAudio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
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

export const midiToHz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

/** One note: triangle fundamental, two sine partials and a whisper of saw,
 *  through a lowpass that closes as the note decays. */
export function tone(midi, t, dur, vel = 1) {
  const c = ensureAudio();
  const f = midiToHz(midi);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.9 * vel, t + 0.012);
  env.gain.exponentialRampToValueAtTime(0.5 * vel, t + 0.22);
  env.gain.setValueAtTime(0.5 * vel, t + dur);
  env.gain.exponentialRampToValueAtTime(0.0008, t + dur + 0.4);

  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 0.6;
  lp.frequency.setValueAtTime(Math.min(9000, f * 8), t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(600, f * 2.2), t + dur + 0.3);
  lp.connect(env);
  env.connect(master);

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
    o.stop(t + dur + 0.45);
  }
}

/** Notes together. `strum` is the tiny offset between voices; `bass` adds the
 *  root an octave down. Returns ms until the chord has died away. */
export function playChord(midis, { dur = 1.3, strum = 0.012, bass = false } = {}) {
  const t = ensureAudio().currentTime + 0.03;
  if (bass) tone(midis[0] - 12, t, dur + 0.2, 0.7);
  midis.forEach((m, i) => tone(m, t + i * strum, dur, 0.8));
  return Math.round((dur + 0.4) * 1000);
}

/** Notes one after another. Returns the gap between notes and the total, in ms. */
export function playScale(midis, { step = 0.2, dur = 0.3, lastDur = 0.75 } = {}) {
  const t = ensureAudio().currentTime + 0.03;
  midis.forEach((m, i) => tone(m, t + i * step, i === midis.length - 1 ? lastDur : dur, 0.9));
  return { step: step * 1000, total: Math.round((midis.length * step + lastDur + 0.4) * 1000) };
}

/** Chords one after another, e.g. I–IV–V. */
export function playProgression(chords, { step = 0.62, dur = 0.5, lastDur = 0.9 } = {}) {
  const t = ensureAudio().currentTime + 0.03;
  chords.forEach((ch, ci) => {
    const d = ci === chords.length - 1 ? lastDur : dur;
    ch.forEach((m, i) => tone(m, t + ci * step + i * 0.012, d, 0.8));
  });
  return { step: step * 1000, total: Math.round((chords.length * step + lastDur) * 1000) };
}
