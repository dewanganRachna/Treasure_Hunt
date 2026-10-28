import { useEffect, useImperativeHandle, useRef } from 'react';
import { STAGE } from '../data/explorerConfig';

const COLORS = ['#c98a24', '#e2b155', '#f3d178', '#2f7d5f', '#fff8e7', '#a86e18', '#b4442f', '#6f9fb8'];
const GRAVITY = 0.42;
const DRAG = 0.992;

/**
 * Canvas confetti cannons: two from the bottom corners, two from below centre,
 * then the corners again.
 */
export default function ConfettiCanvas({ ref }) {
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
    cx.clearRect(0, 0, STAGE.w, STAGE.h);
    const P = pieces.current;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.vy += GRAVITY;
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      if (p.y > 700) p.a -= 0.02;
      if (p.y > 820 || p.a <= 0) {
        P.splice(i, 1);
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
    if (!raf.current) cx.clearRect(0, 0, STAGE.w, STAGE.h);
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

  const corners = () => {
    shoot(-14, 742, -Math.PI / 3.1, 130, 23);
    shoot(STAGE.w + 14, 742, -Math.PI + Math.PI / 3.1, 130, 23);
  };
  const centre = () => {
    shoot(300, 760, -Math.PI / 2.1, 90, 22);
    shoot(980, 760, -Math.PI / 1.9, 90, 22);
  };

  useImperativeHandle(ref, () => ({
    celebrate() {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      corners();
      timers.current.push(setTimeout(centre, 520), setTimeout(corners, 1250));
    }
  }));

  return <canvas ref={canvasRef} className="confetti" width={STAGE.w} height={STAGE.h} aria-hidden="true" />;
}
