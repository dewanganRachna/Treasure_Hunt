/**
 * Web Audio synth for UI sounds. No audio files, works offline.
 */
let ctx = null;
let out = null;
let noiseBuf = null;
let muted = false;

// Major pentatonic from C5, for chimes and sparkles that always sound in tune with each other
const PENTA = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760, 2093, 2349, 2637];

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    // Everything goes through a limiter, so a dozen sounds at once (the treasure) don't clip
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -10;
    limiter.knee.value = 8;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.2;
    limiter.connect(ctx.destination);
    out = limiter;
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Half a second of white noise, shared by every noise sound. */
function getNoise(c) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate / 2, c.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

/** A note: freq Hz, `at` s from now, `dur` s long. `to` glides the pitch to that frequency. */
function tone(freq, at, dur = 0.14, type = 'sine', vol = 0.14, to = 0) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  osc.connect(gain);
  gain.connect(out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/**
 * Filtered noise: whooshes, pops, drums. The filter's frequency moves from `freq` to `to`
 * (when given) over the sound; `rise` is how long the volume takes to swell in.
 */
function noise(at, dur, vol, { type = 'bandpass', freq = 1000, to = 0, q = 1, rise = 0.01 } = {}) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + at;
  const src = c.createBufferSource();
  src.buffer = getNoise(c);
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(freq, t0);
  if (to) filter.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + rise);
  gain.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(out);
  src.start(t0, Math.random() * 0.4);
  src.stop(t0 + dur + 0.02);
}

/** A struck bell: a fundamental plus two inharmonic partials that die away faster. */
function bell(freq, at, vol = 0.1, dur = 1.1) {
  tone(freq, at, dur, 'sine', vol);
  tone(freq * 2.76, at, dur * 0.45, 'sine', vol * 0.35);
  tone(freq * 5.4, at, dur * 0.2, 'sine', vol * 0.18);
}

const pick = (list) => list[(Math.random() * list.length) | 0];

export const sound = {
  setMuted(value) {
    muted = value;
  },
  tap() {
    tone(520, 0, 0.07, 'triangle', 0.08);
  },
  /** Back buttons: the tap, falling */
  back() {
    tone(560, 0, 0.06, 'triangle', 0.07);
    tone(420, 0.05, 0.08, 'triangle', 0.07);
  },
  /** Language switch: a quick blip up */
  toggle() {
    tone(620, 0, 0.09, 'triangle', 0.08, 980);
  },
  /** Sound switched back on */
  soundOn() {
    [784, 1047, 1319].forEach((f, i) => tone(f, i * 0.06, 0.16, 'sine', 0.08));
  },
  /** Soft tick for on-screen keyboard keys */
  key() {
    tone(880, 0, 0.035, 'triangle', 0.04);
  },
  /** A choice made (Start, a topic): two bright notes */
  select() {
    tone(784, 0, 0.12, 'triangle', 0.1);
    tone(1175, 0.07, 0.2, 'triangle', 0.1);
  },
  /** The journey begins: a short horn call */
  start() {
    [392, 523, 659, 784].forEach((f, i) => tone(f, 0.12 + i * 0.1, i === 3 ? 0.5 : 0.16, 'sawtooth', 0.05));
    [392, 523, 659, 784].forEach((f, i) => tone(f, 0.12 + i * 0.1, i === 3 ? 0.5 : 0.16, 'triangle', 0.08));
  },
  /** The camera flies across the map */
  whoosh() {
    noise(0, 1.1, 0.07, { freq: 350, to: 1800, q: 1.4, rise: 0.45 });
    noise(0.55, 0.9, 0.05, { freq: 1800, to: 500, q: 1.4, rise: 0.05 });
  },
  /** The traveller walks the next leg: sparkles rising as the gold trail is drawn (`ms` long) */
  trail(ms) {
    const steps = Math.max(4, Math.round(ms / 230));
    for (let i = 0; i < steps; i++) {
      const f = PENTA[Math.min(PENTA.length - 1, 2 + Math.round((i / steps) * 8))];
      tone(f, (i * ms) / steps / 1000, 0.18, 'sine', 0.035);
    }
  },
  /** Landed on a stop */
  arrive() {
    tone(110, 0, 0.18, 'sine', 0.14, 60);
    bell(1319, 0.05, 0.07, 0.9);
  },
  /** A question card slides in */
  card() {
    noise(0, 0.22, 0.05, { type: 'highpass', freq: 2500, to: 5000, rise: 0.08 });
    tone(660, 0.12, 0.09, 'sine', 0.06, 990);
  },
  /** Right answer; `step` (0–9) raises the pitch as the journey goes on */
  correct(step = 0) {
    const k = Math.pow(2, Math.min(step, 9) / 24);
    [660, 880, 1175].forEach((f, i) => tone(f * k, i * 0.08, 0.2, 'sine', 0.12));
    for (let i = 0; i < 5; i++) tone(pick(PENTA.slice(7)) * k, 0.24 + i * 0.05, 0.14, 'sine', 0.03);
  },
  /** Several right first time in a row */
  streak() {
    [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.3 + i * 0.06, 0.22, 'triangle', 0.06));
  },
  wrong() {
    tone(200, 0, 0.16, 'sawtooth', 0.07);
    tone(150, 0.09, 0.2, 'sawtooth', 0.06);
  },
  /** The one allowed mistake is used: the heart breaks */
  lifeLost() {
    tone(620, 0.22, 0.45, 'triangle', 0.08, 180);
    noise(0.22, 0.2, 0.05, { freq: 900, q: 2 });
  },
  /** One minute left, then 30 seconds */
  warn() {
    bell(988, 0, 0.08, 0.6);
    bell(988, 0.22, 0.08, 0.8);
  },
  /** Each of the last seconds; `urgent` for the final few */
  tick(urgent) {
    if (urgent) {
      tone(1100, 0, 0.09, 'square', 0.035);
    } else {
      tone(1500, 0, 0.03, 'sine', 0.08);
      noise(0, 0.03, 0.05, { type: 'highpass', freq: 3000 });
    }
  },
  /** The clock reached 0:00: an alarm bell, then the game-over notes */
  timeUp() {
    for (let i = 0; i < 6; i++) tone(i % 2 ? 1046 : 880, i * 0.09, 0.09, 'square', 0.045);
    [392, 330, 262, 196].forEach((f, i) => tone(f, 0.65 + i * 0.16, 0.34, 'triangle', 0.11));
  },
  /** A snare roll that swells for `ms` while the chest rattles */
  drumroll(ms) {
    const hits = Math.round(ms / 45);
    for (let i = 0; i < hits; i++) {
      noise(i * 0.045, 0.06, 0.02 + (0.07 * i) / hits, { type: 'highpass', freq: 1800 });
    }
  },
  /** The chest lands */
  thud() {
    tone(95, 0, 0.32, 'sine', 0.22, 45);
    noise(0, 0.18, 0.08, { type: 'lowpass', freq: 600 });
  },
  /** The lid creaks open, then a burst of light */
  creak() {
    tone(140, 0, 0.32, 'sawtooth', 0.04, 260);
    tone(147, 0.02, 0.3, 'sawtooth', 0.03, 240);
    noise(0.05, 0.6, 0.08, { freq: 600, to: 6000, q: 0.8, rise: 0.4 });
  },
  /** Glittering shimmer as the treasure shows */
  shimmer() {
    for (let i = 0; i < 22; i++) tone(pick(PENTA.slice(5)) * 2, i * 0.045 + Math.random() * 0.02, 0.35, 'sine', 0.025);
  },
  win() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.11, 0.4, 'triangle', 0.13));
    // and a held chord under the last notes
    [523, 659, 784].forEach((f) => tone(f, 0.55, 1.2, 'sine', 0.06));
  },
  /** Chinking coins as they spill out of the chest; `n` coins */
  coins(n = 14) {
    for (let i = 0; i < n; i++) {
      const at = i * 0.065 + Math.random() * 0.03;
      tone(2100 + Math.random() * 1500, at, 0.09, 'triangle', 0.05);
      tone(3300 + Math.random() * 900, at + 0.012, 0.06, 'sine', 0.03);
    }
  },
  /** Glassy pings of gems and diamonds */
  gems(n = 8) {
    for (let i = 0; i < n; i++) bell(pick(PENTA.slice(8)) * 1.5, 0.1 + i * 0.11 + Math.random() * 0.04, 0.035, 0.5);
  },
  /** A confetti cannon */
  pop() {
    noise(0, 0.14, 0.14, { freq: 1200, to: 300, q: 0.9 });
    tone(180, 0, 0.12, 'sine', 0.1, 70);
  },
  /** A star lighting up on the win panel; i = 0, 1, 2 */
  star(i) {
    bell([1047, 1319, 1568][i] ?? 1568, 0, 0.07, 0.7);
  },
  /** The certificate's QR code arrived */
  ready() {
    bell(784, 0, 0.07, 0.6);
    bell(1175, 0.14, 0.07, 0.9);
  },
  gameOver() {
    [392, 330, 262, 196].forEach((f, i) => tone(f, i * 0.16, 0.34, 'triangle', 0.11));
  }
};
