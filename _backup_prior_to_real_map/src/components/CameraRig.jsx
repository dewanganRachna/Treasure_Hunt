import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CAMERA_PRESETS,
  CHECKPOINTS,
  ROUTE_SEGMENTS,
  getCameraTransform
} from '../game/worldData';
import MapWorld from './MapWorld';

/**
 * CameraRig - Smooth pan/zoom camera rig for stationary 3D map world.
 * Manages ONE requestAnimationFrame timeline for travel and camera transitions.
 */
export default function CameraRig({
  status, // 'welcome' | 'intro' | 'question' | 'feedback' | 'traveling' | 'gameOver' | 'victory'
  currentLevel = 0,
  completed = [],
  failedLevel = null,
  onTravelComplete = () => {},
  onCheckpointClick = () => {}
}) {
  // Camera state: { cx, cy, zoom, screenTargetX, screenTargetY }
  const [camera, setCamera] = useState(CAMERA_PRESETS.OVERVIEW);
  
  // Travel animation state
  const [activeTravelLeg, setActiveTravelLeg] = useState(null);
  const [travelProgress, setTravelProgress] = useState(0);
  const [cometPos, setCometPos] = useState(null);

  const animFrameRef = useRef(null);
  const travelDoneRef = useRef(false);
  const cameraRef = useRef(camera);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  // Detect prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth camera interpolation function
  const animateCameraTransition = useCallback((fromCam, toCam, duration = 1000) => {
    if (prefersReducedMotion) {
      setCamera(toCam);
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const rawT = Math.min(1, elapsed / duration);
      // Cubic ease-in-out
      const t = rawT < 0.5
        ? 4 * rawT * rawT * rawT
        : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      setCamera({
        cx: fromCam.cx + (toCam.cx - fromCam.cx) * t,
        cy: fromCam.cy + (toCam.cy - fromCam.cy) * t,
        zoom: fromCam.zoom + (toCam.zoom - fromCam.zoom) * t,
        screenTargetX: fromCam.screenTargetX + (toCam.screenTargetX - fromCam.screenTargetX) * t,
        screenTargetY: fromCam.screenTargetY + (toCam.screenTargetY - fromCam.screenTargetY) * t
      });

      if (rawT < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setCamera(toCam);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [prefersReducedMotion]);

  // React to game status changes
  useEffect(() => {
    if (status === 'intro') {
      // Start in OVERVIEW, then smoothly zoom to FOCUS(0) after 1.5s delay
      setCamera(CAMERA_PRESETS.OVERVIEW);
      setActiveTravelLeg(null);
      setCometPos(null);
      setTravelProgress(0);

      const timer = setTimeout(() => {
        animateCameraTransition(CAMERA_PRESETS.OVERVIEW, CAMERA_PRESETS.FOCUS(0), 1200);
      }, 1500);

      return () => {
        clearTimeout(timer);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }

    if (status === 'question' || status === 'feedback') {
      // Keep focused on currentLevel checkpoint at left-center
      setActiveTravelLeg(null);
      setCometPos(null);
      setTravelProgress(0);
      setCamera(CAMERA_PRESETS.FOCUS(currentLevel));
    }

    if (status === 'gameOver') {
      // Zoom out smoothly to full OVERVIEW with red X on failed checkpoint
      setActiveTravelLeg(null);
      setCometPos(null);
      animateCameraTransition(cameraRef.current, CAMERA_PRESETS.OVERVIEW, 1000);
    }

    if (status === 'victory') {
      // Zoom out smoothly to full OVERVIEW showing all 10 checkpoints green
      setActiveTravelLeg(null);
      setCometPos(null);
      animateCameraTransition(cameraRef.current, CAMERA_PRESETS.OVERVIEW, 1200);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [status, currentLevel, animateCameraTransition]);

  // Handle AUTO TRAVEL along the route segment
  useEffect(() => {
    if (status !== 'traveling') return;

    // Segment to travel: from currentLevel to (currentLevel + 1)
    const legIndex = currentLevel; // 0..8 (or 9 for final victory loop)
    const pathD = ROUTE_SEGMENTS[legIndex];
    if (!pathD) {
      onTravelComplete();
      return;
    }

    // Create temporary SVG path in memory to measure length & points
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', pathD);
    const totalLength = pathEl.getTotalLength ? pathEl.getTotalLength() : 350;

    setActiveTravelLeg(legIndex);
    travelDoneRef.current = false;

    const duration = prefersReducedMotion ? 600 : 2000; // ~2.0s duration
    const startTime = performance.now();

    const startCamera = CAMERA_PRESETS.FOCUS(currentLevel);
    const nextLevelIndex = (currentLevel + 1) % CHECKPOINTS.length;
    const endCamera = CAMERA_PRESETS.FOCUS(nextLevelIndex);

    const step = (now) => {
      const elapsed = now - startTime;
      const rawT = Math.min(1, elapsed / duration);

      // Smooth ease-in-out cubic easing
      const t = rawT < 0.5
        ? 4 * rawT * rawT * rawT
        : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      // Current point on active route path
      const pt = pathEl.getPointAtLength(t * totalLength);
      setCometPos({ x: pt.x, y: pt.y });
      setTravelProgress(t);

      // Camera smoothly follows the comet point
      // Pull zoom back slightly around midpoint so both start and end are in view
      const zoomDip = prefersReducedMotion ? 0 : 4 * t * (1 - t) * 0.35;
      const currentZoom = (startCamera.zoom + (endCamera.zoom - startCamera.zoom) * t) - zoomDip;

      setCamera({
        cx: pt.x,
        cy: pt.y,
        zoom: currentZoom,
        screenTargetX: 520, // Keep active location framed left-center
        screenTargetY: 550
      });

      if (rawT < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        // Travel complete!
        if (!travelDoneRef.current) {
          travelDoneRef.current = true;
          setTravelProgress(1);
          setCamera(endCamera);
          setTimeout(() => {
            onTravelComplete();
          }, 150);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [status, currentLevel, onTravelComplete, prefersReducedMotion]);

  const transformStyle = getCameraTransform(camera);

  return (
    <div className="camera-rig-viewport">
      {/* Moving Camera Layer applying single CSS transform */}
      <div
        className="camera-layer-transform"
        style={{
          transform: transformStyle,
          willChange: 'transform'
        }}
      >
        <MapWorld
          currentLevel={currentLevel}
          completed={completed}
          failedLevel={failedLevel}
          activeTravelLeg={activeTravelLeg}
          travelProgress={travelProgress}
          cometPos={cometPos}
          onCheckpointClick={onCheckpointClick}
        />
      </div>
    </div>
  );
}
