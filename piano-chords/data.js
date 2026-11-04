// Theory tables for the chord-scale page. The keys themselves come from
// ../shared/keys.js.

/** Whole (2) and half (1) steps between successive degrees of the major scale. */
export const STEPS = [2, 2, 1, 2, 2, 2, 1];

/** Roman numerals and qualities of the diatonic triads, major key … */
export const MAJ_RN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
export const MAJ_Q = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'];

/** … and natural minor key. */
export const MIN_RN = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
export const MIN_Q = ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'];

/** Scale degree names and what each one does. */
export const DEGREES = [
  ['Tonic', 'Home. Phrases resolve here.'],
  ['Supertonic', 'Leans toward 5; common in ii–V–I.'],
  ['Mediant', 'Decides major vs minor colour.'],
  ['Subdominant', 'Moves away from home.'],
  ['Dominant', 'Strongest pull back to 1.'],
  ['Submediant', 'Root of the relative minor.'],
  ['Leading tone', 'Half step below 1, pulls up to it.'],
];

/** Short suffix for a triad quality, as used in chord symbols. */
export const qualitySuffix = (q) => (q === 'minor' ? 'm' : q === 'diminished' ? 'dim' : '');
