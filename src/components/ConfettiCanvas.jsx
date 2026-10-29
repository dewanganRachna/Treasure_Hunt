import { useEffect, useImperativeHandle, useRef } from 'react';
import { prefersReducedMotion } from '../utils/motion';

const COLORS = ['#c98a24', '#e2b155', '#f3d178', '#2f7d5f', '#fff8e7', '#a86e18', '#b4442f', '#6f9fb8'];
const GRAVITY = 0.42;
const DRAG = 0.992;
// Coin fountain: waves of coins (delay ms, count) thrown up out of the chest
const COIN_WAVES = [
  [0, 16],
  [130, 12],
  [260, 12],
  [420, 10],
  [600, 10],
  [820, 8]
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

/**
 * Canvas confetti cannons (two from the bottom corners, two from below centre, then the
 * corners again) and a fountain of gold coins from the treasure chest. Sized to the stage (w × h).
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
      p.vy += GRAVITY;
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
      if (p.coin) {
        p.flip += p.vflip;
        drawCoin(cx, p);
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

  const throwCoins = (ox, oy, count) => {
    for (let i = 0; i < count; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
      const sp = 9 + Math.random() * 6; // peaks roughly 100–270px above the chest
      pieces.current.push({
        coin: true,
        x: ox + (Math.random() - 0.5) * 30,
        y: oy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: 0,
        vr: 0,
        size: 9 + Math.random() * 5,
        flip: Math.random() * Math.PI,
        vflip: 0.12 + Math.random() * 0.22,
        tilt: (Math.random() - 0.5) * 0.6,
        a: 1
      });
    }
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  const corners = () => {
    shoot(-14, h + 22, -Math.PI / 3.1, 130, 23);
    shoot(w + 14, h + 22, -Math.PI + Math.PI / 3.1, 130, 23);
  };
  const centre = () => {
    shoot(w * 0.234, h + 40, -Math.PI / 2.1, 90, 22);
    shoot(w * 0.766, h + 40, -Math.PI / 1.9, 90, 22);
  };

  useImperativeHandle(ref, () => ({
    celebrate() {
      if (prefersReducedMotion()) return;
      corners();
      timers.current.push(setTimeout(centre, 520), setTimeout(corners, 1250));
    },

    /** Gold coins bursting up out of the chest at (x, y) in stage pixels. */
    coins(x, y) {
      if (prefersReducedMotion()) return;
      for (const [delay, count] of COIN_WAVES) {
        timers.current.push(setTimeout(() => throwCoins(x, y, count), delay));
      }
    }
  }));

  return <canvas ref={canvasRef} className="confetti" width={w} height={h} aria-hidden="true" />;
}
