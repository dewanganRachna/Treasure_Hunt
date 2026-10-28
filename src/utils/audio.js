/**
 * Web Audio synth for UI sounds. No audio files, works offline.
 */
let ctx = null;
let muted = false;

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, at, dur = 0.14, type = 'sine', vol = 0.14) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sound = {
  setMuted(value) {
    muted = value;
  },
  tap() {
    tone(520, 0, 0.07, 'triangle', 0.08);
  },
  correct() {
    [660, 880, 1175].forEach((f, i) => tone(f, i * 0.08, 0.2, 'sine', 0.12));
  },
  wrong() {
    tone(200, 0, 0.16, 'sawtooth', 0.07);
    tone(150, 0.09, 0.2, 'sawtooth', 0.06);
  },
  win() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.11, 0.4, 'triangle', 0.13));
  }
};
