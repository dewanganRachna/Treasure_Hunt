import { useImperativeHandle, useLayoutEffect, useRef } from 'react';
import overlaySvg from '../assets/map-overlay.svg?raw';
import { CAMERA, STAGE, WAYPOINTS, WORLD, toPx } from '../data/explorerConfig';

const TERRAIN_SRC = `${import.meta.env.BASE_URL}map/cg-map-terrain.jpg`;
const TRAIL_LAYERS = ['gA', 'gB', 'gC'];
const LEG_COUNT = WAYPOINTS.length - 1;

// Keep a value inside [min, max]; centre it when the range is inverted
const clamp = (v, min, max) => (min > max ? (min + max) / 2 : Math.min(Math.max(v, min), max));

const easeInOutCubic = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

/**
 * The terrain image plus the SVG overlay (route, waypoints, treasure), moved by a CSS camera.
 * The overlay is static markup, so it is mutated directly through the imperative handle.
 */
export default function ExplorerMap({ ref }) {
  const worldRef = useRef(null);
  const overlayRef = useRef(null);

  const $ = (sel) => overlayRef.current?.querySelector(sel) ?? null;

  const setPin = (x, y) => $('#pin')?.setAttribute('transform', `translate(${x} ${y})`);

  const camera = (x, y, zoom) => {
    if (!worldRef.current) return;
    const tx = clamp((CAMERA.mapLeft + CAMERA.mapRight) / 2 - toPx(x) * zoom, CAMERA.mapRight - WORLD.w * zoom, CAMERA.mapLeft);
    const ty = clamp(CAMERA.yAnchor - toPx(y) * zoom, STAGE.h - WORLD.h * zoom, STAGE.headerH);
    worldRef.current.style.transform = `translate(${tx}px,${ty}px) scale(${zoom})`;
  };

  useLayoutEffect(() => {
    for (let k = 0; k < LEG_COUNT; k++) {
      const len = $(`#l${k}`)?.getTotalLength() ?? 0;
      for (const id of TRAIL_LAYERS) {
        const p = $(`#${id}${k}`);
        if (p) {
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
        }
      }
    }
    setPin(WAYPOINTS[0].x, WAYPOINTS[0].y);

    // Place the overview camera instantly, then enable the flight transition
    const world = worldRef.current;
    world.style.transition = 'none';
    camera(CAMERA.overview.x, CAMERA.overview.y, CAMERA.fitZoom);
    const raf = requestAnimationFrame(() => {
      world.style.transition = CAMERA.transition;
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useImperativeHandle(ref, () => ({
    flyTo(i) {
      camera(WAYPOINTS[i].x, WAYPOINTS[i].y, CAMERA.playZoom);
    },

    /** Leave the overview: drop the enlarged strokes and the cartouche. */
    beginJourney() {
      $('svg')?.classList.remove('ov');
      const cart = $('#cart');
      if (cart) cart.style.opacity = 0;
    },

    setNode(i, state) {
      const node = $(`#n${i}`);
      if (!node) return;
      node.classList.remove('cur', 'done');
      node.classList.add(state);
      const label = node.querySelector('.nn');
      if (label) label.textContent = state === 'done' ? '✓' : '';
    },

    /** Move the traveller along leg k while its gold trail fills in. */
    travel(k, duration) {
      const leg = $(`#l${k}`);
      if (!leg) return Promise.resolve();
      const trails = TRAIL_LAYERS.map((id) => $(`#${id}${k}`)).filter(Boolean);
      const len = leg.getTotalLength();
      const t0 = performance.now();
      return new Promise((resolve) => {
        const step = (now) => {
          if (!leg.isConnected) return resolve();
          const u = Math.min(1, (now - t0) / duration);
          const e = easeInOutCubic(u);
          const pt = leg.getPointAtLength(e * len);
          setPin(pt.x, pt.y);
          trails.forEach((s) => {
            s.style.strokeDashoffset = len * (1 - e);
          });
          if (u < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    },

    burst(i) {
      const pin = $('#pin');
      if (!pin) return;
      const { x, y } = WAYPOINTS[i];
      let html = '';
      for (let n = 0; n < 14; n++) {
        const a = (n / 14) * Math.PI * 2;
        const r = 38 + Math.random() * 26;
        html += `<circle class="bs" cx="${x}" cy="${y}" r="${2.6 + Math.random() * 2.6}" fill="${n % 2 ? '#c98a24' : '#fff8e7'}" style="--dx:${Math.cos(a) * r}px;--dy:${Math.sin(a) * r}px"/>`;
      }
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.innerHTML = html;
      pin.parentNode.appendChild(g);
      setTimeout(() => g.remove(), 1000);
    },

    shakeTreasure(on) {
      $('#trg')?.classList.toggle('shake', on);
    },

    /** Fade the X and the traveller, and raise the chest. */
    revealTreasure() {
      $('#trg')?.classList.add('rev');
      const pin = $('#pin');
      if (pin) {
        pin.style.transition = 'opacity .6s';
        pin.style.opacity = 0;
      }
    },

    openTreasure() {
      $('#trg')?.classList.add('open');
    }
  }));

  return (
    <div className="world" ref={worldRef}>
      <img src={TERRAIN_SRC} alt="Illustrated map of Chhattisgarh" draggable={false} />
      <div className="overlay" ref={overlayRef} dangerouslySetInnerHTML={{ __html: overlaySvg }} />
    </div>
  );
}

export { TERRAIN_SRC };
