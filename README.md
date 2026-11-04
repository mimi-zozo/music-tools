# Music theory tools

Two small interactive pages, live at <https://mimi-zozo.github.io/music-tools/>. They are for hearing music theory rather than just reading it. Everything runs in the browser with the Web Audio API; there is no build step and no backend.

**Scotty West's slide rule** (`music-slide-rule/`)
A digital version of the paper musical slide rule. Drag the key ruler and every mode, scale and chord re-spells itself under fixed interval windows. Tap a scale to hear it climb, tap a chord to hear it ring. Covers the seven major modes, the seven harmonic-minor modes, pentatonics, melodic minor, whole-tone and diminished scales, and 23 chord types.

**Piano chord scales** (`piano-chords/`)
Pick a major key and see its seven diatonic chords on a keyboard, the scale with its whole/half-step pattern, the relative minor with its chords, and what each scale degree is called and does.

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
```

## Running locally

The pages use ES modules, so they need to be served over HTTP rather than opened from the file system:

```
python3 -m http.server 8000
```

then open <http://localhost:8000/>.

## Credits

The slide rule is modelled on Scotty West's paper design from [Absolutely Understand Guitar](https://www.absolutelyunderstandguitar.com).
