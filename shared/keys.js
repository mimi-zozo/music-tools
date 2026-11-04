// The twelve major keys and the chromatic note names, shared by both tools.

/** Chromatic note names from C. Accidentals carry both spellings, sharp first. */
export const NOTES = [
  ['C'], ['C♯', 'D♭'], ['D'], ['D♯', 'E♭'], ['E'], ['F'],
  ['F♯', 'G♭'], ['G'], ['G♯', 'A♭'], ['A'], ['A♯', 'B♭'], ['B'],
];

/** Semitone offsets of the major scale degrees. */
export const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];

/** Keys indexed by the pitch class of their tonic (C = 0 … B = 11).
 *  `notes` is the correctly spelled major scale; `flat` says whether the key
 *  signature uses flats, which decides how accidentals are spelled. */
export const KEYS = [
  { id: 'c',  t: 0,  name: 'C',  minor: 'A',  sig: 'none', flat: false, notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { id: 'db', t: 1,  name: 'D♭', minor: 'B♭', sig: '5♭',   flat: true,  notes: ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C'] },
  { id: 'd',  t: 2,  name: 'D',  minor: 'B',  sig: '2♯',   flat: false, notes: ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯'] },
  { id: 'eb', t: 3,  name: 'E♭', minor: 'C',  sig: '3♭',   flat: true,  notes: ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'] },
  { id: 'e',  t: 4,  name: 'E',  minor: 'C♯', sig: '4♯',   flat: false, notes: ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯'] },
  { id: 'f',  t: 5,  name: 'F',  minor: 'D',  sig: '1♭',   flat: true,  notes: ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'] },
  { id: 'fs', t: 6,  name: 'F♯', minor: 'D♯', sig: '6♯',   flat: false, notes: ['F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯'] },
  { id: 'g',  t: 7,  name: 'G',  minor: 'E',  sig: '1♯',   flat: false, notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F♯'] },
  { id: 'ab', t: 8,  name: 'A♭', minor: 'F',  sig: '4♭',   flat: true,  notes: ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G'] },
  { id: 'a',  t: 9,  name: 'A',  minor: 'F♯', sig: '3♯',   flat: false, notes: ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'] },
  { id: 'bb', t: 10, name: 'B♭', minor: 'G',  sig: '2♭',   flat: true,  notes: ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'] },
  { id: 'b',  t: 11, name: 'B',  minor: 'G♯', sig: '5♯',   flat: false, notes: ['B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯'] },
];

/** The same keys in circle-of-fifths order, for pickers. */
export const FIFTHS = ['c', 'g', 'd', 'a', 'e', 'b', 'fs', 'db', 'ab', 'eb', 'bb', 'f'].map(keyById);

export function keyById(id) {
  return KEYS.find((k) => k.id === id);
}

export const mod = (n, m) => ((n % m) + m) % m;
