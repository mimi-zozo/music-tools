// The twelve ascending intervals inside an octave, each with song openings that begin
// with that interval. Every playable example is a public-domain or traditional tune,
// written as semitone offsets from its first note with durations in beats; `start` is
// the MIDI note the example begins on and `bpm` its tempo. Well-known recordings that
// are still in copyright are only named in `alsoIn`, rock first. `major` marks the
// intervals that occur above the root in the major scale. Reference list: EarMaster's
// interval song chart.

export const INTERVALS = [
  { id: 'm2', name: 'Minor 2nd', semis: 1, short: 'm2',
    alsoIn: ["A Hard Day's Night (The Beatles)", "Jaws theme", "The Pink Panther", "Isn't She Lovely", "White Christmas"],
    examples: [
      { title: 'The Entertainer', by: 'Scott Joplin, 1902', start: 62, bpm: 92, notes: [[0, .5], [1, .5], [2, .5], [10, 1], [2, .5]] },
      { title: 'Für Elise', by: 'Beethoven, 1810', start: 76, bpm: 126, notes: [[0, .5], [-1, .5], [0, .5], [-1, .5], [0, .5]] },
      { title: 'New World Symphony, 4th movement', by: 'Dvořák, 1893', start: 52, bpm: 112, notes: [[0, 1], [1, 1], [2, 1], [3, 2], [3, 1]] },
    ] },
  { id: 'M2', major: true, name: 'Major 2nd', semis: 2, short: 'M2',
    alsoIn: ["Linus and Lucy", "Rudolph the Red-Nosed Reindeer", "Do-Re-Mi (The Sound of Music)", "Strangers in the Night"],
    examples: [
      { title: 'Happy Birthday', by: 'Hill sisters, 1893', start: 67, bpm: 100, notes: [[0, .75], [0, .25], [2, 1], [0, 1], [5, 1]] },
      { title: 'Frère Jacques', by: 'French traditional', start: 60, bpm: 120, notes: [[0, 1], [2, 1], [4, 1], [0, 1], [0, 1]] },
      { title: 'Silent Night', by: 'Franz Gruber, 1818', start: 67, bpm: 96, notes: [[0, 1.5], [2, .5], [0, 1], [-3, 3], [0, 1.5]] },
    ] },
  { id: 'm3', name: 'Minor 3rd', semis: 3, short: 'm3',
    alsoIn: ["Seven Nation Army (The White Stripes)", "Smoke on the Water (Deep Purple)", "Iron Man (Black Sabbath)", "Whole Lotta Love (Led Zeppelin)", "Happiness Is a Warm Gun (The Beatles)", "Bad (Michael Jackson)"],
    examples: [
      { title: 'Greensleeves', by: 'English traditional', start: 69, bpm: 100, notes: [[0, 1], [3, 2], [5, 1], [7, 1.5], [8, .5]] },
      { title: "Brahms's Lullaby", by: 'Johannes Brahms, 1868', start: 67, bpm: 92, notes: [[0, .5], [0, .5], [3, 2], [0, .5], [0, .5]] },
      { title: 'Gymnopédie No. 1', by: 'Erik Satie, 1888', start: 78, bpm: 76, notes: [[0, 1], [3, 1], [1, 1], [0, 1], [-5, 1]] },
    ] },
  { id: 'M3', major: true, name: 'Major 3rd', semis: 4, short: 'M3',
    alsoIn: ["Sweet Child O' Mine, bass intro (Guns N' Roses)", "Can't Buy Me Love (The Beatles)", "Ob-la-di Ob-la-da (The Beatles)", "Blister in the Sun (Violent Femmes)"],
    examples: [
      { title: 'When the Saints Go Marching In', by: 'American traditional', start: 60, bpm: 116, notes: [[0, 1], [4, 1], [5, 1], [7, 3], [0, 1]] },
      { title: 'The Four Seasons: Spring', by: 'Antonio Vivaldi, 1725', start: 64, bpm: 104, notes: [[0, 1], [4, .5], [4, .5], [4, .5], [2, .25], [0, .25], [7, 1.5]] },
      { title: 'The Blue Danube', by: 'Johann Strauss II, 1866', start: 62, bpm: 150, notes: [[0, 1], [4, 1], [4, 1], [7, 1.5], [7, 1.5]] },
    ] },
  { id: 'P4', major: true, name: 'Perfect 4th', semis: 5, short: 'P4',
    alsoIn: ["Black or White (Michael Jackson)", "Harry Potter theme", "Super Mario", "Love Me Tender", "The Godfather theme"],
    examples: [
      { title: 'Here Comes the Bride', by: 'Richard Wagner, 1850', start: 67, bpm: 88, notes: [[0, 1], [5, 1.5], [5, .5], [5, 2], [0, 1]] },
      { title: 'Amazing Grace', by: 'traditional, 1835 tune', start: 62, bpm: 84, notes: [[0, 1], [5, 2], [9, .5], [5, .5], [9, 2]] },
      { title: 'Auld Lang Syne', by: 'Scottish traditional', start: 62, bpm: 96, notes: [[0, 1], [5, 1.5], [4, .5], [5, 1], [9, 1]] },
    ] },
  { id: 'TT', name: 'Tritone', semis: 6, short: 'TT',
    alsoIn: ["Juicebox (The Strokes)", "Maria (West Side Story)", "The Simpsons theme", "Cool (West Side Story)"],
    examples: [
      { title: 'Danse Macabre', by: 'Camille Saint-Saëns, 1874', start: 69, bpm: 120, notes: [[0, 1], [6, 1], [0, 1], [6, 1], [0, 2]] },
    ] },
  { id: 'P5', major: true, name: 'Perfect 5th', semis: 7, short: 'P5',
    alsoIn: ["One (Metallica)", "Blackbird (The Beatles)", "Star Wars main theme", "Can't Help Falling in Love", "X-Files theme"],
    examples: [
      { title: 'Twinkle, Twinkle, Little Star', by: 'French traditional', start: 60, bpm: 110, notes: [[0, 1], [0, 1], [7, 1], [7, 1], [9, 1]] },
      { title: 'Also sprach Zarathustra', by: 'Richard Strauss, 1896', start: 60, bpm: 80, notes: [[0, 2], [7, 2], [12, 2.5], [15, .5], [16, 2]] },
      { title: 'Cello Suite No. 1, Prelude', by: 'J. S. Bach, c. 1720', start: 43, bpm: 96, notes: [[0, .5], [7, .5], [16, .5], [14, .5], [16, .5], [7, .5], [16, .5], [7, .5]] },
    ] },
  { id: 'm6', name: 'Minor 6th', semis: 8, short: 'm6',
    alsoIn: ["In My Life (The Beatles)", "She's a Woman (The Beatles)", "We Are Young (Fun)", "Slow Dancing in a Burning Room (John Mayer)", "Nothing Compares 2 U"],
    examples: [
      { title: 'Tristan und Isolde, Prelude', by: 'Richard Wagner, 1865', start: 57, bpm: 60, notes: [[0, 1.5], [8, 2.5], [7, 1], [6, 1], [5, 1.5]] },
      { title: 'Requiem: Lacrimosa', by: 'W. A. Mozart, 1791', start: 69, bpm: 66, notes: [[0, 1], [8, 2], [7, 1], [5, 2]] },
      { title: 'Go Down Moses', by: 'American spiritual', start: 64, bpm: 84, notes: [[0, 1], [8, 1.5], [7, .5], [5, 2]] },
    ] },
  { id: 'M6', major: true, name: 'Major 6th', semis: 9, short: 'M6',
    alsoIn: ["My Way", "Take the A Train", "NBC chimes", "Princess Leia's Theme", "Hush, Little Baby"],
    examples: [
      { title: 'My Bonnie Lies Over the Ocean', by: 'Scottish traditional', start: 60, bpm: 120, notes: [[0, 1], [9, 1], [7, 1], [5, 1], [9, 1]] },
      { title: 'Nocturne Op. 9 No. 2', by: 'Frédéric Chopin, 1832', start: 70, bpm: 96, notes: [[0, 1], [9, 2], [8, .5], [9, .5], [8, 1.5]] },
      { title: 'Jingle Bells (verse)', by: 'James Pierpont, 1857', start: 62, bpm: 120, notes: [[0, 1], [9, 1], [7, 1], [5, 1], [0, 2]] },
      { title: "For He's a Jolly Good Fellow", by: 'traditional', start: 60, bpm: 132, notes: [[0, 1], [9, 1], [9, 1], [7, 1], [9, 1], [11, 1]] },
    ] },
  { id: 'm7', name: 'Minor 7th', semis: 10, short: 'm7',
    alsoIn: ["Josie (Steely Dan)", "The Winner Takes It All (ABBA)", "Somewhere (West Side Story)", "Star Trek (original series)", "Chameleon (Herbie Hancock)"],
    examples: [] },
  { id: 'M7', major: true, name: 'Major 7th', semis: 11, short: 'M7',
    alsoIn: ["Take On Me (A-ha)", "Popular (Nada Surf)", "Superman theme", "Don't Know Why (Norah Jones)", "Somewhere Over the Rainbow (1st to 3rd note)"],
    examples: [] },
  { id: 'P8', major: true, name: 'Octave', semis: 12, short: 'P8',
    alsoIn: ["Sweet Child O' Mine (Guns N' Roses)", "A Forest (The Cure)", "Somewhere Over the Rainbow", "Singin' in the Rain", "Let It Snow", "Blue Bossa"],
    examples: [
      { title: 'Take Me Out to the Ball Game', by: 'Albert Von Tilzer, 1908', start: 60, bpm: 126, notes: [[0, 1], [12, 1], [9, 1], [7, 1], [4, 1], [7, 2]] },
    ] },
];
