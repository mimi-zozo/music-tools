# Music theory tools

Five small interactive pages, live at <https://mimi-zozo.github.io/music-tools/>. They are for hearing music theory rather than just reading it. Everything runs in the browser with the Web Audio API; there is no build step and no backend.

**Scotty West's slide rule** (`music-slide-rule/`)
A digital version of the paper musical slide rule. Drag the key ruler and every mode, scale and chord re-spells itself under fixed interval windows. Tap a scale to hear it climb, tap a chord to hear it ring. Covers the seven major modes, the seven harmonic-minor modes, pentatonics, melodic minor, whole-tone and diminished scales, and 23 chord types.

**Piano chord scales** (`piano-chords/`)
Pick a major key and see its seven diatonic chords on a keyboard, the scale with its whole/half-step pattern, the relative minor with its chords, and what each scale degree is called and does.

**Guitar interval shapes** (`guitar-intervals/`)
The two-point intervallic function shapes (3, 5, 7, their flats, the blueprint and chromatic completions, octaves), drawn as horizontal fretboards with the nut on the left: the 48 main shapes, each function orbiting one root, and the optional extras. Pick a root note and every shape transposes to it, with the fret window, numbers and markers recomputed (shapes that would fall below the nut move up an octave). Tap a shape to hear the root and then the interval sounded above it.

**Intervals by ear** (`interval-familiarization/`)
The twelve ascending intervals inside an octave, each playable from C, with the opening notes (and rhythm) of tunes that begin with that interval. Public-domain and traditional tunes only; short original practice phrases fill the gaps, with the well-known recordings named in text. Add your own openers in `data.js` as semitone offsets and beat lengths.

**18-minute practice** (`practice-routine/`)
Frank Dawson's scale-practice method, as passed on by Dave Benziger: memorise one pattern away from the guitar, play it slow, clear, legato and loud for exactly 18 minutes, take a 5-minute break, then run every pattern learned so far for 1–5 minutes each, daily for 21 days. The page lays out the method, the 7-day schedule and the eight playing approaches, with a timer that rotates through the approaches and rolls into the break.

## Layout

```
index.html                  landing page
shared/
  audio.js                  the synth both tools use
  keys.js                   the twelve keys and chromatic note names
music-slide-rule/
  index.html                markup and styles
  data.js                   the rows printed on the slide rule
  sheet.js                  sheet layout, sliding, dragging, playback
piano-chords/
  index.html                markup and styles
  data.js                   chord qualities and degree names
  keyboard.js               SVG keyboard renderer
  page.js                   rendering and playback
guitar-intervals/
  index.html                markup and styles
  data.js                   every shape as string/fret pairs, plus the section layout
  page.js                   horizontal fretboard renderer and playback
interval-familiarization/
  index.html                markup and styles
  data.js                   the intervals and their song openers
  page.js                   cards and rhythmic playback
practice-routine/
  index.html                markup and styles
  timer.js                  the 18-minute session timer
```

## Running locally

The pages use ES modules, so they need to be served over HTTP rather than opened from the file system:

```
python3 -m http.server 8000
```

then open <http://localhost:8000/>.

## Credits

The slide rule is modelled on Scotty West's paper design from [Absolutely Understand Guitar](https://www.absolutelyunderstandguitar.com).
