import { useImperativeHandle, useLayoutEffect, useRef } from 'react';
import overlaySvg from '../assets/map-overlay.svg?raw';
import { CAMERA, TIMING, WAYPOINTS, WORLD, toPx } from '../data/explorerConfig';

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
export default function ExplorerMap({ ref, layout }) {
  const worldRef = useRef(null);
  const overlayRef = useRef(null);
  // What the camera is looking at: the whole state (null) or a stop index
  const target = useRef(null);
  // Last camera transform applied to the world: stage px offset and zoom
  const view = useRef({ tx: 0, ty: 0, zoom: 1 });
  const layoutRef = useRef(layout);

  const $ = (sel) => overlayRef.current?.querySelector(sel) ?? null;

  const setPin = (x, y) => $('#pin')?.setAttribute('transform', `translate(${x} ${y})`);

  /** Point the camera at the current target for the current layout. */
  const aim = () => {
    const world = worldRef.current;
    if (!world) return;
    const L = layoutRef.current;
    const stop = target.current;
    const overview = stop === null;
    const { x, y } = overview ? L.overview : WAYPOINTS[stop];
    const zoom = overview ? L.fitZoom : CAMERA.playZoom;
    const anchorY = overview ? L.overviewAnchor : L.yAnchor;
    const bottom = overview ? L.overviewBottom : L.mapBottom;
    const tx = clamp((L.mapLeft + L.mapRight) / 2 - toPx(x) * zoom, L.mapRight - WORLD.w * zoom, L.mapLeft);
    const ty = clamp(anchorY - toPx(y) * zoom, bottom - WORLD.h * zoom, L.headerH);
    view.current = { tx, ty, zoom };
    world.style.transform = `translate(${tx}px,${ty}px) scale(${zoom})`;
  };

  /** Re-aim without the flight animation (first paint, or the screen was rotated/resized). */
  const aimInstantly = () => {
    const world = worldRef.current;
    world.style.transition = 'none';
    aim();
    return requestAnimationFrame(() => {
      world.style.transition = CAMERA.transition;
    });
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
  }, []);

  useLayoutEffect(() => {
    layoutRef.current = layout;
    const raf = aimInstantly();
    return () => cancelAnimationFrame(raf);
  }, [layout]);

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
        // No transitionend if the transform doesn't change, or on a hidden page
        const fallback = setTimeout(done, CAMERA.flightMs + 400);
        world.addEventListener('transitionend', onEnd);
        aim();
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

    /** Game over at stop i: mark it red and fade the traveller that stands on it. */
    failAt(i) {
      this.setNode(i, 'fail');
      const label = $(`#n${i} .nn`);
      if (label) label.textContent = '✗';
      const pin = $('#pin');
      if (pin) {
        pin.style.transition = 'opacity .5s';
        pin.style.opacity = 0.25;
      }
    },

    /** Move the traveller along leg k while its gold trail fills in. */
    travel(k, duration) {
      const leg = $(`#l${k}`);
      if (!leg) return Promise.resolve();
      const trails = TRAIL_LAYERS.map((id) => $(`#${id}${k}`)).filter(Boolean);
      const len = leg.getTotalLength();
      const t0 = performance.now();
      return new Promise((resolve) => {
        let finished = false;
        const draw = (e) => {
          const pt = leg.getPointAtLength(e * len);
          setPin(pt.x, pt.y);
          trails.forEach((s) => {
            s.style.strokeDashoffset = len * (1 - e);
          });
        };
        const finish = () => {
          if (finished) return;
          finished = true;
          clearTimeout(fallback);
          if (leg.isConnected) draw(1);
          resolve();
        };
        // Browsers pause animation frames for hidden pages; don't let the journey stall on that
        const fallback = setTimeout(finish, duration + 500);
        const step = (now) => {
          if (finished) return;
          if (!leg.isConnected) return finish();
          const u = duration > 0 ? Math.min(1, (now - t0) / duration) : 1;
          draw(easeInOutCubic(u));
          if (u < 1) requestAnimationFrame(step);
          else finish();
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
    },

    /** Where the chest's mouth is, in stage pixels (for the coin fountain). */
    treasurePoint() {
      const chest = $('#ch');
      const stage = worldRef.current?.parentElement;
      if (!chest || !stage) return null;
      const c = chest.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      const k = s.width / layoutRef.current.w;
      // The chest group is centred on its lid line; the light rays make the box symmetric around it
      return { x: (c.left + c.width / 2 - s.left) / k, y: (c.top + c.height / 2 - s.top) / k };
    }
  }));

  return (
    <div className="world" ref={worldRef}>
      <img src={TERRAIN_SRC} alt="Illustrated map of Chhattisgarh" draggable={false} />
      <div className="overlay" ref={overlayRef} dangerouslySetInnerHTML={{ __html: overlaySvg }} />
    </div>
  );
}
