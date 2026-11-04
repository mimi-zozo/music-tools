// Everything printed on the slide rule: the rows of each panel and where they
// sit on the shared chromatic sheet. No DOM, no audio.
//
// Each row has:
//   iv    semitone intervals from the row's root (0 = root, 12 = octave)
//   lab   the interval label under each window ("1", "♭3", "♯4" …)
//   shift semitones from the key root to the row's root (9 = relative minor)
//   deg   sheet column the row's window starts at; equal to shift mod 12, so
//         the same note always falls in the same column down the page

export const SHEET_COLUMNS = 48;  // width of the shared chromatic sheet
export const STRIP_CELLS = 72;    // note cells per sliding strip (6 octaves)
export const RULER_CELLS = 60;    // key cells on the ruler (5 octaves)

/** Where the right-hand blocks start. 21 ≡ 9 (the relative minor) and
 *  24 ≡ 0 (the root), the nearest such columns that clear the left block. */
export const HARM_X = 21;
export const MINOR_X = 24;

/** Modes of the major scale, staggered by their degree. */
export const MAJOR_MODES = [
  { num: 'I',    name: 'Ionian',     sub: 'major scale',                   deg: 0,  iv: [0, 2, 4, 5, 7, 9, 11, 12], lab: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  { num: 'ii',   name: 'Dorian',     sub: 'minor',                         deg: 2,  iv: [0, 2, 3, 5, 7, 9, 10, 12], lab: ['1', '2', '♭3', '4', '5', '6', '♭7', '8'] },
  { num: 'iii',  name: 'Phrygian',   sub: 'minor',                         deg: 4,  iv: [0, 1, 3, 5, 7, 8, 10, 12], lab: ['1', '♭2', '♭3', '4', '5', '♭6', '♭7', '8'] },
  { num: 'IV',   name: 'Lydian',     sub: 'major',                         deg: 5,  iv: [0, 2, 4, 6, 7, 9, 11, 12], lab: ['1', '2', '3', '♯4', '5', '6', '7', '8'] },
  { num: 'V',    name: 'Mixolydian', sub: 'major',                         deg: 7,  iv: [0, 2, 4, 5, 7, 9, 10, 12], lab: ['1', '2', '3', '4', '5', '6', '♭7', '8'] },
  { num: 'vi',   name: 'Aeolian',    sub: 'natural minor · relative minor', deg: 9,  iv: [0, 2, 3, 5, 7, 8, 10, 12], lab: ['1', '2', '♭3', '4', '5', '♭6', '♭7', '8'] },
  { num: 'vii°', name: 'Locrian',    sub: 'half diminished',               deg: 11, iv: [0, 1, 3, 5, 6, 8, 10, 12], lab: ['1', '♭2', '♭3', '4', '♭5', '♭6', '♭7', '8'] },
];

/** Modes of the harmonic minor scale, built on the relative minor. */
export const HARMONIC_MODES = [
  { num: 'i',    name: 'Harmonic minor', sub: 'Aeolian ♮7 · Mohammedan',  deg: 0,  iv: [0, 2, 3, 5, 7, 8, 11, 12], lab: ['1', '2', '♭3', '4', '5', '♭6', '7', '8'] },
  { num: 'ii°',  name: 'Locrian ♮6',     sub: 'half diminished',          deg: 2,  iv: [0, 1, 3, 5, 6, 9, 10, 12], lab: ['1', '♭2', '♭3', '4', '♭5', '6', '♭7', '8'] },
  { num: 'III+', name: 'Ionian ♯5',      sub: 'augmented',                deg: 3,  iv: [0, 2, 4, 5, 8, 9, 11, 12], lab: ['1', '2', '3', '4', '♯5', '6', '7', '8'] },
  { num: 'iv',   name: 'Dorian ♯4',      sub: 'Romanian · Misheberakh',   deg: 5,  iv: [0, 2, 3, 6, 7, 9, 10, 12], lab: ['1', '2', '♭3', '♯4', '5', '6', '♭7', '8'] },
  { num: 'V',    name: 'Phrygian major', sub: 'Spanish gypsy',            deg: 7,  iv: [0, 1, 4, 5, 7, 8, 10, 12], lab: ['1', '♭2', '3', '4', '5', '♭6', '♭7', '8'] },
  { num: 'VI',   name: 'Lydian ♯2',      sub: 'major',                    deg: 8,  iv: [0, 3, 4, 6, 7, 9, 11, 12], lab: ['1', '♯2', '3', '♯4', '5', '6', '7', '8'] },
  { num: 'vii°', name: 'Ultralocrian',   sub: 'diminished',               deg: 11, iv: [0, 1, 3, 4, 6, 8, 9, 12],  lab: ['1', '♭2', '♭3', '♭4', '♭5', '♭6', '♭♭7', '8'] },
];

/** Under the major modes. The progression row plays I, IV and V as triads. */
export const LEFT_EXTRAS = [
  { name: 'Common progression', sub: 'I · IV · V',     kind: 'prog', shift: 0, deg: 0, iv: [0, 5, 7],            lab: ['I', 'IV', 'V'] },
  { name: 'Major pentatonic',                           shift: 0, deg: 0, iv: [0, 2, 4, 7, 9, 12],    lab: ['1', '2', '3', '5', '6', '8'] },
  { name: 'Minor pentatonic',   sub: 'relative minor', shift: 9, deg: 9, iv: [0, 3, 5, 7, 10, 12],   lab: ['1', '♭3', '4', '5', '♭7', '8'] },
];

/** Under the harmonic minor modes. `deg` is relative to HARM_X. */
export const RIGHT_EXTRAS = [
  { name: 'Melodic minor', sub: 'jazz minor',               shift: 9, deg: 0, iv: [0, 2, 3, 5, 7, 9, 11, 12],    lab: ['1', '2', '♭3', '4', '5', '6', '7', '8'] },
  { name: 'Whole tone',    sub: 'augmented · symmetrical',  shift: 0, deg: 3, iv: [0, 2, 4, 6, 8, 10, 12],       lab: ['1', '2', '3', '♯4', '♯5', '♯6', '8'] },
  { name: 'Diminished',    sub: 'whole–half · symmetrical', shift: 2, deg: 5, iv: [0, 2, 3, 5, 6, 8, 9, 11, 12], lab: ['1', '2', '♭3', '4', '♭5', '♭6', '♭♭7', '7', '8'] },
];

/** Chords and arpeggios, all on the key root. `col` 1 is the major family on
 *  the left, `col` 2 the minor family on the right; `deg` 12 places the
 *  altered chords an octave further along the same sheet, as on the paper. */
export const CHORDS = [
  { name: 'Major triad',           sym: '',     iv: [0, 4, 7],                  lab: ['1', '3', '5'],                          col: 1, row: 1 },
  { name: 'Seven chord', sub: 'dominant 7', sym: '7', iv: [0, 4, 7, 10],        lab: ['1', '3', '5', '♭7'],                    col: 1, row: 2 },
  { name: 'Major seven',           sym: 'maj7', iv: [0, 4, 7, 11],              lab: ['1', '3', '5', '7'],                     col: 1, row: 3 },
  { name: 'Six chord',             sym: '6',    iv: [0, 4, 7, 9],               lab: ['1', '3', '5', '6'],                     col: 1, row: 4 },
  { name: 'Suspended 4',           sym: 'sus4', iv: [0, 5, 7],                  lab: ['1', '4', '5'],                          col: 1, row: 5 },
  { name: 'Nine chord',            sym: '9',    iv: [0, 4, 7, 10, 14],          lab: ['1', '3', '5', '♭7', '9'],               col: 1, row: 6 },
  { name: 'Add nine',              sym: 'add9', iv: [0, 4, 7, 14],              lab: ['1', '3', '5', '9'],                     col: 1, row: 7 },
  { name: 'Eleven chord',          sym: '11',   iv: [0, 7, 10, 14, 17],         lab: ['1', '5', '♭7', '9', '11'],              col: 1, row: 8 },
  { name: 'Thirteen chord',        sym: '13',   iv: [0, 4, 7, 10, 14, 17, 21],  lab: ['1', '3', '5', '♭7', '9', '11', '13'],   col: 1, row: 9 },
  { name: 'Augmented triad',       sym: '+',    iv: [0, 4, 8],                  lab: ['1', '3', '♯5'],                         col: 1, row: 1, deg: 12 },
  { name: 'Seven sharp five',      sym: '7♯5',  iv: [0, 4, 8, 10],              lab: ['1', '3', '♯5', '♭7'],                   col: 1, row: 5, deg: 12 },
  { name: 'Minor triad',           sym: 'm',    iv: [0, 3, 7],                  lab: ['1', '♭3', '5'],                         col: 2, row: 1 },
  { name: 'Minor seven',           sym: 'm7',   iv: [0, 3, 7, 10],              lab: ['1', '♭3', '5', '♭7'],                   col: 2, row: 2 },
  { name: 'Minor major seven',     sym: 'mMaj7', iv: [0, 3, 7, 11],             lab: ['1', '♭3', '5', '7'],                    col: 2, row: 3 },
  { name: 'Minor six',             sym: 'm6',   iv: [0, 3, 7, 9],               lab: ['1', '♭3', '5', '6'],                    col: 2, row: 4 },
  { name: 'Minor nine',            sym: 'm9',   iv: [0, 3, 7, 10, 14],          lab: ['1', '♭3', '5', '♭7', '9'],              col: 2, row: 6 },
  { name: 'Major six add nine',    sym: '6/9',  iv: [0, 4, 7, 9, 14],           lab: ['1', '3', '5', '6', '9'],                col: 2, row: 7 },
  { name: 'Seven sharp nine',      sym: '7♯9',  iv: [0, 4, 7, 10, 15],          lab: ['1', '3', '5', '♭7', '♯9'],              col: 2, row: 8 },
  { name: 'Seven flat nine',       sym: '7♭9',  iv: [0, 4, 7, 10, 13],          lab: ['1', '3', '5', '♭7', '♭9'],              col: 2, row: 9 },
  { name: 'Diminished triad',      sym: '°',    iv: [0, 3, 6],                  lab: ['1', '♭3', '♭5'],                        col: 2, row: 1, deg: 12 },
  { name: 'Diminished seventh',    sym: '°7',   iv: [0, 3, 6, 9],               lab: ['1', '♭3', '♭5', '♭♭7'],                 col: 2, row: 2, deg: 12 },
  { name: 'Minor seven flat five', sub: 'half dim', sym: 'm7♭5', iv: [0, 3, 6, 10], lab: ['1', '♭3', '♭5', '♭7'],              col: 2, row: 4, deg: 12 },
  { name: 'Seven flat five',       sym: '7♭5',  iv: [0, 4, 6, 10],              lab: ['1', '3', '♭5', '♭7'],                   col: 2, row: 5, deg: 12 },
];

/** Triads played by the "common progression" row, as intervals from the root. */
export const PROGRESSION = [[0, 4, 7], [5, 9, 12], [7, 11, 14]];
