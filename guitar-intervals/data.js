// Two-point intervallic function shapes, transcribed from the "Ultimate Fretboard
// Visualization" section 12 list. Strings are indexed 0–5 from low E to high e;
// frets are absolute. `f0` is the lowest fret the diagram shows and `nf` how many
// it shows. Every root sits at the 7th fret except where the appendix says otherwise.

export const OPEN_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4

/** Semitones above the root for each intervallic function. */
export const SEMITONES = {
  '3': 4, '5': 7, '7': 11, '♭3': 3, '♭5': 6, '♭7': 10,
  '2': 2, '4': 5, '6': 9, '♭2': 1, '♯2': 3, '♯4': 6, '♯5': 8, '♭6': 8, '♭♭7': 9, 'R': 12,
};

/** The "(and 9)" style aliases shown next to a function. */
export const ALSO = { '2': 'and 9', '4': 'and 11', '6': 'and 13', '♭2': 'and ♭9', '♯2': 'and ♯9', '♯4': 'and ♯11', '♭6': 'and ♭13' };

/** Section layout. Most sections list functions one after another, each with its shapes in a row;
 *  the orbit section puts its functions side by side, one column per function. */
export const SECTIONS = [
  { id: 'basic', title: 'Basic chord tones', groups: [{ fns: ['3', '5', '7', '♭3', '♭5', '♭7'] }] },
  { id: 'additional', title: 'Additional chord tones',
    groups: [
      { title: 'Completing the blueprint', fns: ['2', '4', '6'] },
      { title: 'Completing the chromatic scale', fns: ['♭2', '♯2', '♯4', '♯5', '♭6', 'R'] },
    ] },
  { id: 'orbit', title: 'Orbiting the root', sideBySide: true,
    groups: [{ rows: [['3', '5', '7'], ['♭3', '♭5', '♭7'], ['2', '4', '6'], ['♭2', '♯2', '♯4'], ['♯5', '♭6']] }] },
  { id: 'extras', title: 'Additional / optional extras', groups: [{ fns: ['♭♭7', '4', '♯4', '♭5', '5'] }] },
];

export const MAIN = [
  { fn: "3", cap: "Ascending shape 1", f0: 7, nf: 5, root: [2, 7], notes: [[2, 11]] },
  { fn: "3", cap: "Ascending shape 2", f0: 5, nf: 5, root: [2, 7], notes: [[3, 6]] },
  { fn: "3", cap: "Descending shape 1", f0: 3, nf: 5, root: [2, 7], notes: [[1, 4]] },
  { fn: "3", cap: "Descending shape 2", f0: 6, nf: 5, root: [2, 7], notes: [[0, 9]] },
  { fn: "5", cap: "Ascending shape 1", f0: 6, nf: 5, root: [1, 7], notes: [[2, 9]] },
  { fn: "5", cap: "Ascending shape 2", f0: 4, nf: 5, root: [1, 7], notes: [[3, 4]] },
  { fn: "5", cap: "Descending shape 1", f0: 6, nf: 5, root: [1, 7], notes: [[0, 7]] },
  { fn: "7", cap: "Ascending shape 1", f0: 6, nf: 5, root: [1, 7], notes: [[3, 8]] },
  { fn: "7", cap: "Descending shape 1", f0: 5, nf: 5, root: [1, 7], notes: [[1, 6]] },
  { fn: "7", cap: "Descending shape 2", f0: 7, nf: 5, root: [1, 7], notes: [[0, 11]] },
  { fn: "♭3", cap: "Ascending shape 1", f0: 7, nf: 5, root: [2, 7], notes: [[2, 10]] },
  { fn: "♭3", cap: "Ascending shape 2", f0: 5, nf: 5, root: [2, 7], notes: [[3, 5]] },
  { fn: "♭3", cap: "Descending shape 1", f0: 3, nf: 5, root: [2, 7], notes: [[1, 3]] },
  { fn: "♭3", cap: "Descending shape 2", f0: 6, nf: 5, root: [2, 7], notes: [[0, 8]] },
  { fn: "♭5", cap: "Ascending shape 1", f0: 6, nf: 5, root: [2, 7], notes: [[3, 8]] },
  { fn: "♭5", cap: "Descending shape 1", f0: 4, nf: 5, root: [2, 7], notes: [[1, 6]] },
  { fn: "♭7", cap: "Ascending shape 1", f0: 6, nf: 5, root: [1, 7], notes: [[3, 7]] },
  { fn: "♭7", cap: "Descending shape 1", f0: 5, nf: 5, root: [1, 7], notes: [[1, 5]] },
  { fn: "♭7", cap: "Descending shape 2", f0: 7, nf: 5, root: [1, 7], notes: [[0, 10]] },
  { fn: "2", cap: "Ascending shape 1", f0: 6, nf: 5, root: [2, 7], notes: [[2, 9]] },
  { fn: "2", cap: "Ascending shape 2", f0: 4, nf: 5, root: [2, 7], notes: [[3, 4]] },
  { fn: "2", cap: "Descending shape 1", f0: 5, nf: 5, root: [2, 7], notes: [[0, 7]] },
  { fn: "4", cap: "Ascending shape 1", f0: 6, nf: 5, root: [2, 7], notes: [[3, 7]] },
  { fn: "4", cap: "Descending shape 1", f0: 4, nf: 5, root: [2, 7], notes: [[1, 5]] },
  { fn: "4", cap: "Descending shape 2", f0: 6, nf: 5, root: [2, 7], notes: [[0, 10]] },
  { fn: "6", cap: "Ascending shape 1", f0: 7, nf: 5, root: [1, 7], notes: [[2, 11]] },
  { fn: "6", cap: "Ascending shape 2", f0: 5, nf: 5, root: [1, 7], notes: [[3, 6]] },
  { fn: "6", cap: "Descending shape 1", f0: 4, nf: 5, root: [1, 7], notes: [[1, 4]] },
  { fn: "6", cap: "Descending shape 2", f0: 6, nf: 5, root: [1, 7], notes: [[0, 9]] },
  { fn: "♭2", cap: "Ascending shape 1", f0: 6, nf: 5, root: [2, 7], notes: [[2, 8]] },
  { fn: "♭2", cap: "Ascending shape 2", f0: 3, nf: 5, root: [2, 7], notes: [[3, 3]] },
  { fn: "♭2", cap: "Descending shape 1", f0: 5, nf: 5, root: [2, 7], notes: [[0, 6]] },
  { fn: "♯2", cap: "Ascending shape 1", f0: 6, nf: 5, root: [2, 7], notes: [[2, 10]] },
  { fn: "♯2", cap: "Ascending shape 2", f0: 4, nf: 5, root: [1, 7], notes: [[2, 5]] },
  { fn: "♯2", cap: "Descending shape 1", f0: 3, nf: 5, root: [2, 7], notes: [[1, 3]] },
  { fn: "♯2", cap: "Descending shape 2", f0: 6, nf: 5, root: [2, 7], notes: [[0, 8]] },
  { fn: "♯4", cap: "Ascending shape 1", f0: 6, nf: 5, root: [2, 7], notes: [[3, 8]] },
  { fn: "♯4", cap: "Descending shape 1", f0: 5, nf: 5, root: [2, 7], notes: [[1, 6]] },
  { fn: "♯5", cap: "Ascending shape 1", f0: 7, nf: 5, root: [1, 7], notes: [[2, 10]] },
  { fn: "♯5", cap: "Ascending shape 2", f0: 4, nf: 5, root: [1, 7], notes: [[3, 5]] },
  { fn: "♯5", cap: "Descending shape 1", f0: 3, nf: 5, root: [1, 7], notes: [[1, 3]] },
  { fn: "♯5", cap: "Descending shape 2", f0: 6, nf: 5, root: [1, 7], notes: [[0, 8]] },
  { fn: "♭6", cap: "Ascending shape 1", f0: 7, nf: 5, root: [1, 7], notes: [[2, 10]] },
  { fn: "♭6", cap: "Ascending shape 2", f0: 4, nf: 5, root: [1, 7], notes: [[3, 5]] },
  { fn: "♭6", cap: "Descending shape 1", f0: 3, nf: 5, root: [1, 7], notes: [[1, 3]] },
  { fn: "♭6", cap: "Descending shape 2", f0: 6, nf: 5, root: [1, 7], notes: [[0, 8]] },
  { fn: "R", cap: "Shape 1", f0: 6, nf: 5, root: [0, 7], notes: [[2, 9]] },
  { fn: "R", cap: "Shape 2", f0: 4, nf: 5, root: [0, 7], notes: [[3, 4]] }
];

export const ORBIT = [
  { fn: "3", cap: "", f0: 4, nf: 8, root: [2, 7], notes: [[0, 9], [1, 4], [2, 11], [3, 6]] },
  { fn: "5", cap: "", f0: 3, nf: 8, root: [1, 7], notes: [[0, 7], [2, 9], [3, 4]] },
  { fn: "7", cap: "", f0: 5, nf: 8, root: [1, 7], notes: [[0, 11], [1, 6], [3, 8]] },
  { fn: "♭3", cap: "", f0: 3, nf: 8, root: [2, 7], notes: [[0, 8], [1, 3], [2, 10], [3, 5]] },
  { fn: "♭5", cap: "", f0: 4, nf: 8, root: [2, 7], notes: [[1, 6], [3, 8]] },
  { fn: "♭7", cap: "", f0: 4, nf: 8, root: [1, 7], notes: [[0, 10], [1, 5], [3, 7]] },
  { fn: "2", cap: "", f0: 3, nf: 8, root: [2, 7], notes: [[0, 7], [2, 9], [3, 4]] },
  { fn: "4", cap: "", f0: 4, nf: 8, root: [2, 7], notes: [[0, 10], [1, 5], [3, 7]] },
  { fn: "6", cap: "", f0: 4, nf: 8, root: [1, 7], notes: [[0, 9], [1, 4], [2, 11], [3, 6]] },
  { fn: "♭2", cap: "", f0: 2, nf: 8, root: [2, 7], notes: [[0, 6], [2, 8], [3, 3]] },
  { fn: "♯2", cap: "", f0: 3, nf: 8, root: [2, 7], notes: [[0, 8], [1, 3], [2, 10], [3, 5]] },
  { fn: "♯4", cap: "", f0: 4, nf: 8, root: [2, 7], notes: [[1, 6], [3, 8]] },
  { fn: "♯5", cap: "", f0: 3, nf: 8, root: [1, 7], notes: [[0, 8], [1, 3], [2, 10], [3, 5]] },
  { fn: "♭6", cap: "", f0: 3, nf: 8, root: [1, 7], notes: [[0, 8], [1, 3], [2, 10], [3, 5]] }
];

export const EXTRAS = [
  { fn: "♭♭7", cap: "Ascending shape 1", f0: 7, nf: 5, root: [1, 7], notes: [[2, 11]] },
  { fn: "♭♭7", cap: "Ascending shape 2", f0: 5, nf: 5, root: [1, 7], notes: [[3, 6]] },
  { fn: "♭♭7", cap: "Descending shape 1", f0: 4, nf: 5, root: [1, 7], notes: [[1, 4]] },
  { fn: "♭♭7", cap: "Descending shape 2", f0: 6, nf: 5, root: [1, 7], notes: [[0, 9]] },
  { fn: "4", cap: "Additional ascending", f0: 7, nf: 6, root: [1, 7], notes: [[1, 12]] },
  { fn: "4", cap: "Additional ascending", f0: 2, nf: 6, root: [1, 7], notes: [[3, 2]] },
  { fn: "♯4", cap: "Additional ascending", f0: 3, nf: 6, root: [1, 7], notes: [[3, 3]] },
  { fn: "♯4", cap: "Additional ascending", f0: 3, nf: 6, root: [3, 3], notes: [[1, 7]] },
  { fn: "♭5", cap: "Additional ascending", f0: 6, nf: 6, root: [1, 10], notes: [[3, 6]] },
  { fn: "♭5", cap: "Ascending / descending", f0: 6, nf: 6, root: [3, 6], notes: [[1, 10]] },
  { fn: "5", cap: "Ascending / descending", f0: 2, nf: 6, root: [1, 7], notes: [[1, 2]] }
];
