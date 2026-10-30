import { useEffect, useImperativeHandle, useRef } from 'react';
import { prefersReducedMotion } from '../utils/motion';
import { sound } from '../utils/audio';

const COLORS = ['#c98a24', '#e2b155', '#f3d178', '#2f7d5f', '#fff8e7', '#a86e18', '#b4442f', '#6f9fb8'];
const GRAVITY = 0.42;
const DRAG = 0.992;
// Treasure fountain: waves (delay ms, count) of coins, diamonds and gems thrown up out of the chest
const TREASURE_WAVES = [
  [0, 26],
  [110, 20],
  [230, 20],
  [370, 18],
  [520, 16],
  [700, 14],
  [900, 12],
  [1150, 10]
];
// Coloured gems: face and edge colours (ruby, emerald, sapphire, amethyst)
const GEMS = [
  ['#e0383a', '#7d1610'],
  ['#2faa6c', '#12503a'],
  ['#3b7fd0', '#163d6e'],
  ['#9b59d0', '#4d2470']
];

/** A gold coin seen at an angle: it narrows as it spins, with a rim and a shine when facing us. */
function drawCoin(cx, p) {
  const face = Math.cos(p.flip);
  const w = Math.max(1.2, p.size * Math.abs(face));
  cx.save();
  cx.translate(p.x, p.y);
  cx.rotate(p.tilt);
  cx.globalAlpha = Math.max(p.a, 0);
  cx.beginPath();
  cx.ellipse(0, 0, w, p.size, 0, 0, Math.PI * 2);
  cx.fillStyle = face > 0 ? '#f2c14e' : '#d39a26';
  cx.fill();
  cx.lineWidth = 1.4;
  cx.strokeStyle = '#8a5a0c';
  cx.stroke();
  if (w > p.size * 0.45) {
    cx.beginPath();
    cx.ellipse(0, 0, w * 0.64, p.size * 0.64, 0, 0, Math.PI * 2);
    cx.lineWidth = 1.2;
    cx.strokeStyle = 'rgba(255, 238, 180, 0.95)';
    cx.stroke();
    cx.beginPath();
    cx.ellipse(-w * 0.32, -p.size * 0.36, w * 0.22, p.size * 0.16, -0.5, 0, Math.PI * 2);
    cx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    cx.fill();
  }
  cx.restore();
}

/** A brilliant-cut diamond from the side, narrowing as it spins, with facets and a glint. */
function drawDiamond(cx, p) {
  const face = Math.cos(p.flip);
  const s = p.size;
  cx.save();
  cx.translate(p.x, p.y);
  cx.rotate(p.tilt);
  cx.scale(Math.max(0.12, Math.abs(face)), 1);
  cx.globalAlpha = Math.max(p.a, 0);
  cx.lineJoin = 'round';
  cx.beginPath();
  cx.moveTo(-s, -s * 0.2);
  cx.lineTo(-s * 0.55, -s * 0.75);
  cx.lineTo(s * 0.55, -s * 0.75);
  cx.lineTo(s, -s * 0.2);
  cx.closePath();
  cx.fillStyle = '#f4fcff';
  cx.fill();
  cx.beginPath();
  cx.moveTo(-s, -s * 0.2);
  cx.lineTo(s, -s * 0.2);
  cx.lineTo(0, s * 1.05);
  cx.closePath();
  cx.fillStyle = face > 0 ? '#b6e3f8' : '#8fcdf0';
  cx.fill();
  // Facets
  cx.lineWidth = 1;
  cx.strokeStyle = 'rgba(79, 156, 204, 0.75)';
  cx.beginPath();
  cx.moveTo(-s * 0.55, -s * 0.75);
  cx.lineTo(-s * 0.28, -s * 0.2);
  cx.lineTo(0, s * 1.05);
  cx.lineTo(s * 0.28, -s * 0.2);
  cx.lineTo(s * 0.55, -s * 0.75);
  cx.moveTo(0, -s * 0.75);
  cx.lineTo(-s * 0.28, -s * 0.2);
  cx.moveTo(0, -s * 0.75);
  cx.lineTo(s * 0.28, -s * 0.2);
  cx.stroke();
  cx.lineWidth = 1.3;
  cx.strokeStyle = '#4f9ccc';
  cx.beginPath();
  cx.moveTo(-s, -s * 0.2);
  cx.lineTo(-s * 0.55, -s * 0.75);
  cx.lineTo(s * 0.55, -s * 0.75);
  cx.lineTo(s, -s * 0.2);
  cx.lineTo(0, s * 1.05);
  cx.closePath();
  cx.stroke();
  cx.restore();
  // A glint when it faces us
  if (face > 0.93) drawSparkle(cx, { x: p.x - s * 0.3, y: p.y - s * 0.6, size: s * 0.9, a: p.a, c: '#ffffff' });
}

/** A cut gem in its colour, with a highlight. */
function drawGem(cx, p) {
  const face = Math.cos(p.flip);
  const s = p.size;
  cx.save();
  cx.translate(p.x, p.y);
  cx.rotate(p.tilt);
  cx.scale(Math.max(0.15, Math.abs(face)), 1);
  cx.globalAlpha = Math.max(p.a, 0);
  cx.beginPath();
  cx.moveTo(-s * 0.6, -s);
  cx.lineTo(s * 0.6, -s);
  cx.lineTo(s, -s * 0.4);
  cx.lineTo(s, s * 0.4);
  cx.lineTo(s * 0.6, s);
  cx.lineTo(-s * 0.6, s);
  cx.lineTo(-s, s * 0.4);
  cx.lineTo(-s, -s * 0.4);
  cx.closePath();
  cx.fillStyle = p.gem[0];
  cx.fill();
  cx.lineWidth = 1.2;
  cx.strokeStyle = p.gem[1];
  cx.stroke();
  cx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  cx.strokeRect(-s * 0.5, -s * 0.5, s, s);
  cx.beginPath();
  cx.moveTo(-s * 0.7, -s * 0.75);
  cx.lineTo(-s * 0.2, -s * 0.75);
  cx.lineTo(-s * 0.7, -s * 0.2);
  cx.closePath();
  cx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  cx.fill();
  cx.restore();
}

/** A four-pointed twinkle. */
function drawSparkle(cx, p) {
  const s = p.size;
  const k = s * 0.22;
  cx.save();
  cx.translate(p.x, p.y);
  cx.globalAlpha = Math.max(p.a, 0);
  cx.beginPath();
  cx.moveTo(0, -s);
  cx.lineTo(k, -k);
  cx.lineTo(s, 0);
  cx.lineTo(k, k);
  cx.lineTo(0, s);
  cx.lineTo(-k, k);
  cx.lineTo(-s, 0);
  cx.lineTo(-k, -k);
  cx.closePath();
  cx.fillStyle = p.c;
  cx.fill();
  cx.restore();
}

/**
 * Canvas confetti cannons (two from the bottom corners, two from below centre, then the
 * corners again), a fountain of coins, diamonds and gems from the treasure chest, and small
 * bursts for right answers. Sized to the stage (w × h).
 */
export default function ConfettiCanvas({ ref, w, h }) {
  const canvasRef = useRef(null);
  const pieces = useRef([]);
  const raf = useRef(0);
  const timers = useRef([]);

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    timers.current.forEach(clearTimeout);
  }, []);

  const tick = () => {
    const cx = canvasRef.current?.getContext('2d');
    if (!cx) return;
    cx.clearRect(0, 0, w, h);
    const P = pieces.current;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.vy += GRAVITY * (p.g ?? 1);
      if (p.fade) p.a -= p.fade;
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      if (p.y > h - 20) p.a -= 0.02;
      if (p.y > h + 100 || p.a <= 0) {
        P.splice(i, 1);
        continue;
      }
      if (p.kind) {
        p.flip += p.vflip;
        if (p.kind === 'coin') drawCoin(cx, p);
        else if (p.kind === 'diamond') drawDiamond(cx, p);
        else if (p.kind === 'gem') drawGem(cx, p);
        else {
          p.size *= 0.97;
          drawSparkle(cx, p);
        }
        continue;
      }
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.r);
      cx.globalAlpha = Math.max(p.a, 0);
      cx.fillStyle = p.c;
      cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * p.f)) + 1);
      cx.restore();
    }
    raf.current = P.length ? requestAnimationFrame(tick) : 0;
    if (!raf.current) cx.clearRect(0, 0, w, h);
  };

  const shoot = (ox, oy, angle, count, power) => {
    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * 0.85;
      const sp = power * (0.55 + Math.random() * 0.75);
      pieces.current.push({
        x: ox,
        y: oy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        w: 5 + Math.random() * 7,
        h: 9 + Math.random() * 9,
        r: Math.random() * 6.3,
        vr: (Math.random() - 0.5) * 0.45,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        a: 1,
        f: 0.6 + Math.random() * 0.5
      });
    }
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  /** n twinkles drifting out of (ox, oy) at up to speed sp. */
  const sparkles = (ox, oy, n, sp) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = sp * (0.3 + Math.random() * 0.7);
      pieces.current.push({
        kind: 'spark',
        x: ox,
        y: oy,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        g: 0.05,
        fade: 0.018,
        size: 6 + Math.random() * 7,
        flip: 0,
        vflip: 0,
        c: Math.random() < 0.5 ? '#ffffff' : '#ffe08a',
        a: 1
      });
    }
  };

  /** count pieces of treasure thrown up from (ox, oy) at about speed power (px per frame). */
  const throwTreasure = (ox, oy, count, power) => {
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      const kind = roll < 0.6 ? 'coin' : roll < 0.82 ? 'diamond' : 'gem';
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const sp = power * (0.62 + Math.random() * 0.45);
      pieces.current.push({
        kind,
        gem: GEMS[(Math.random() * GEMS.length) | 0],
        x: ox + (Math.random() - 0.5) * 60,
        y: oy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        size: kind === 'coin' ? 10 + Math.random() * 6 : kind === 'diamond' ? 11 + Math.random() * 6 : 7 + Math.random() * 4,
        flip: Math.random() * Math.PI,
        vflip: 0.1 + Math.random() * 0.2,
        tilt: (Math.random() - 0.5) * 0.7,
        a: 1
      });
      // Glitter goes up with them
      if (i % 3 === 0) sparkles(ox + (Math.random() - 0.5) * 80, oy - Math.random() * 40, 1, 3);
    }
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  const corners = () => {
    sound.pop();
    shoot(-14, h + 22, -Math.PI / 3.1, 130, 23);
    shoot(w + 14, h + 22, -Math.PI + Math.PI / 3.1, 130, 23);
  };
  const centre = () => {
    sound.pop();
    shoot(w * 0.234, h + 40, -Math.PI / 2.1, 90, 22);
    shoot(w * 0.766, h + 40, -Math.PI / 1.9, 90, 22);
  };

  useImperativeHandle(ref, () => ({
    celebrate() {
      if (prefersReducedMotion()) return;
      corners();
      timers.current.push(setTimeout(centre, 520), setTimeout(corners, 1250));
    },

    /**
     * Coins, diamonds and gems bursting up out of the chest at (x, y) in stage pixels: the whole
     * fountain, or a handful when the open chest is tapped (small).
     */
    treasure(x, y, small = false) {
      if (prefersReducedMotion()) return;
      // Fast enough to reach about the top of the stage from the chest's mouth
      const power = Math.min(21, Math.max(12, Math.sqrt(2 * GRAVITY * y * 0.85)));
      const waves = small ? TREASURE_WAVES.slice(0, 2).map(([d, n]) => [d, Math.round(n / 2)]) : TREASURE_WAVES;
      for (const [delay, count] of waves) {
        timers.current.push(setTimeout(() => throwTreasure(x, y, count, power), delay));
      }
    },

    /** A small burst of confetti and twinkles from the middle of element el (a right answer). */
    burstAt(el) {
      const canvas = canvasRef.current;
      if (!canvas || !el || prefersReducedMotion()) return;
      const c = canvas.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const k = w / c.width;
      const x = (r.left + r.width / 2 - c.left) * k;
      const y = (r.top + r.height / 2 - c.top) * k;
      for (let i = 0; i < 34; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 3 + Math.random() * 6;
        pieces.current.push({
          x: x + Math.cos(a) * r.width * k * 0.3,
          y,
          vx: Math.cos(a) * sp * 1.4,
          vy: Math.sin(a) * sp - 2.5,
          w: 4 + Math.random() * 5,
          h: 7 + Math.random() * 7,
          r: Math.random() * 6.3,
          vr: (Math.random() - 0.5) * 0.45,
          g: 0.45,
          fade: 0.016,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          a: 1,
          f: 0.6 + Math.random() * 0.5
        });
      }
      sparkles(x, y, 12, 5);
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    }
  }));

  return <canvas ref={canvasRef} className="confetti" width={w} height={h} aria-hidden="true" />;
}
