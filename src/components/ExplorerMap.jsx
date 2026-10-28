import { useImperativeHandle, useLayoutEffect, useRef } from 'react';
import overlaySvg from '../assets/map-overlay.svg?raw';
import { CAMERA, STAGE, TIMING, WAYPOINTS, WORLD, toPx } from '../data/explorerConfig';

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
export default function ExplorerMap({ ref, stage }) {
  const worldRef = useRef(null);
  const overlayRef = useRef(null);
  // Current camera target: a waypoint index, or null for the overview
  const target = useRef(null);
  // Last camera transform applied to the world: stage px offset and zoom
  const view = useRef({ tx: 0, ty: 0, zoom: 1 });
  const stageRef = useRef(stage);

  const $ = (sel) => overlayRef.current?.querySelector(sel) ?? null;

  const setPin = (x, y) => $('#pin')?.setAttribute('transform', `translate(${x} ${y})`);

  const camera = () => {
    if (!worldRef.current) return;
    const { w, h } = stageRef.current;
    const areaW = w - CAMERA.mapLeft;
    const areaH = h - STAGE.headerH;
    let x, y, zoom;
    if (target.current === null) {
      const b = CAMERA.overviewBounds;
      zoom = Math.min(areaW / ((b.x1 - b.x0) * WORLD.unitToPx), areaH / ((b.y1 - b.y0) * WORLD.unitToPx));
      x = (b.x0 + b.x1) / 2;
      y = (b.y0 + b.y1) / 2;
    } else {
      ({ x, y } = WAYPOINTS[target.current]);
      zoom = CAMERA.playZoom;
    }
    const tx = clamp(CAMERA.mapLeft + areaW / 2 - toPx(x) * zoom, w - WORLD.w * zoom, CAMERA.mapLeft);
    const ty = clamp(STAGE.headerH + areaH / 2 - toPx(y) * zoom, h - WORLD.h * zoom, STAGE.headerH);
    view.current = { tx, ty, zoom };
    worldRef.current.style.transform = `translate(${tx}px,${ty}px) scale(${zoom})`;
  };

  // Re-aim instantly when the stage changes shape
  useLayoutEffect(() => {
    stageRef.current = stage;
    const world = worldRef.current;
    world.style.transition = 'none';
    camera();
    const raf = requestAnimationFrame(() => {
      world.style.transition = CAMERA.transition;
    });
    return () => cancelAnimationFrame(raf);
  }, [stage]);

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
  }, []);

  useImperativeHandle(ref, () => ({
    /** Fly the camera to waypoint i; resolves once the flight has finished. */
    flyTo(i) {
      target.current = i;
      const world = worldRef.current;
      if (!world) return Promise.resolve();
      return new Promise((resolve) => {
        const done = () => {
          clearTimeout(fallback);
          world.removeEventListener('transitionend', onEnd);
          resolve();
        };
        const onEnd = (e) => {
          if (e.target === world && e.propertyName === 'transform') done();
        };
        // No transitionend if the transform doesn't change or motion is reduced
        const fallback = setTimeout(done, CAMERA.flightMs + 400);
        world.addEventListener('transitionend', onEnd);
        camera();
      });
    },

    /** Leave the overview: drop the enlarged strokes and the cartouche. */
    beginJourney() {
      $('svg')?.classList.remove('ov');
      const cart = $('#cart');
      if (cart) cart.style.opacity = 0;
    },

    /** Where waypoint i sits on the stage under the current camera, and its pulse ring's on-screen diameter. */
    screenPoint(i) {
      const { tx, ty, zoom } = view.current;
      // Treasure node's pulse is larger than a regular waypoint's
      const r = parseFloat($(`#n${i} .pulse`)?.getAttribute('r')) || 7.4;
      return {
        x: tx + toPx(WAYPOINTS[i].x) * zoom,
        y: ty + toPx(WAYPOINTS[i].y) * zoom,
        diameter: 2 * r * WORLD.unitToPx * zoom
      };
    },

    setNode(i, state) {
      const node = $(`#n${i}`);
      if (!node) return;
      node.classList.remove('cur', 'done');
      node.classList.add(state);
      // Let the arrival ring finish before the steady pulse takes over
      const pulse = node.querySelector('.pulse');
      if (pulse) pulse.style.animationDelay = state === 'cur' ? `${TIMING.arrival}ms` : '';
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

