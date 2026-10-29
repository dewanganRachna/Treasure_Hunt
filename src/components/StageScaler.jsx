import React, { useState, useEffect } from 'react';
import { STAGE_WIDTH, STAGE_HEIGHT } from '../game/worldData';

/**
 * Fixed 16:9 Stage Scaler (1920x1080)
 * Scales with CSS transform to fit any display without scrollbars or layout shifts.
 * Supports ?kiosk=1 to hide cursor, disable context menu and pinch-zoom.
 */
export default function StageScaler({ children }) {
  const [scale, setScale] = useState(() => {
    if (typeof window === 'undefined') return 1;
    return Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT);
  });

  const [isKiosk] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('kiosk') === '1';
  });

  useEffect(() => {
    if (isKiosk) {
      document.body.style.cursor = 'none';
      document.body.style.userSelect = 'none';
      document.body.style.touchAction = 'none';

      const preventMenu = (e) => e.preventDefault();
      window.addEventListener('contextmenu', preventMenu);

      const preventZoom = (e) => {
        if (e.ctrlKey || e.touches?.length > 1) {
          e.preventDefault();
        }
      };
      window.addEventListener('wheel', preventZoom, { passive: false });
      window.addEventListener('touchmove', preventZoom, { passive: false });

      return () => {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.body.style.touchAction = '';
        window.removeEventListener('contextmenu', preventMenu);
        window.removeEventListener('wheel', preventZoom);
        window.removeEventListener('touchmove', preventZoom);
      };
    }
  }, [isKiosk]);

  useEffect(() => {
    const handleResize = () => {
      const windowW = window.innerWidth;
      const windowH = window.innerHeight;
      const scaleX = windowW / STAGE_WIDTH;
      const scaleY = windowH / STAGE_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <div className={`stage-viewport ${isKiosk ? 'kiosk-mode' : ''}`}>
      <div
        className="stage-canvas"
        style={{
          width: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT}px`,
          transform: `translate(-50%, -50%) scale(${scale})`
        }}
      >
        {children}
      </div>
    </div>
  );
}
