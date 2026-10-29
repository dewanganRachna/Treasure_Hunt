import React, { useRef, useEffect, useState } from 'react';
import { ROUTE_SEGMENTS } from '../game/worldData';

/**
 * RouteLayer renders the 10 legs of the adventure treasure trail.
 * - Completed segments: static, subtle golden trail with direction markers
 * - Future segments: faint dotted golden trail
 * - Active traveling segment: animated draw stroke + bright golden comet head
 */
export default function RouteLayer({
  completedCount = 0,
  activeTravelLeg = null, // index of currently animating segment, or null
  travelProgress = 0, // 0 to 1 during travel animation
  cometPos = null // { x, y } coordinates of comet head during travel
}) {
  const pathRefs = useRef([]);
  const [pathLengths, setPathLengths] = useState([]);

  useEffect(() => {
    // Measure lengths of all route segments
    const lengths = pathRefs.current.map((path) => {
      if (path && typeof path.getTotalLength === 'function') {
        return path.getTotalLength();
      }
      return 350; // fallback
    });
    setPathLengths(lengths);
  }, []);

  return (
    <g id="route-layer" className="route-layer-group">
      <defs>
        {/* Route Direction Arrow Marker */}
        <marker
          id="trailArrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 1 2 L 8 5 L 1 8 z" fill="#D4AF37" opacity="0.9" />
        </marker>

        {/* Comet Head Glow Filter */}
        <filter id="cometGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Render all 10 Route Segments */}
      {ROUTE_SEGMENTS.map((d, index) => {
        const isCompleted = index < completedCount;
        const isCurrentActive = activeTravelLeg === index;
        const totalLen = pathLengths[index] || 350;

        return (
          <g key={`route-segment-${index}`}>
            {/* 1. Underlying Faint Dotted Path Guide (Always visible for all future paths) */}
            <path
              ref={(el) => (pathRefs.current[index] = el)}
              d={d}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              strokeLinecap="round"
              opacity={isCompleted ? 0.35 : 0.45}
            />

            {/* 2. Static Completed Golden Trail */}
            {isCompleted && !isCurrentActive && (
              <g>
                {/* Golden Glow Under-trail */}
                <path
                  d={d}
                  fill="none"
                  stroke="#FDE68A"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                {/* Golden Solid Line with Arrowhead */}
                <path
                  d={d}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  markerMid="url(#trailArrow)"
                />
              </g>
            )}

            {/* 3. Active Animated Segment During Travel */}
            {isCurrentActive && (
              <g>
                {/* Glowing Golden Trail extending with progress */}
                <path
                  d={d}
                  fill="none"
                  stroke="#FDE68A"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={totalLen}
                  strokeDashoffset={totalLen * (1 - travelProgress)}
                  opacity="0.75"
                />
                <path
                  d={d}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={totalLen}
                  strokeDashoffset={totalLen * (1 - travelProgress)}
                />
              </g>
            )}
          </g>
        );
      })}

      {/* 4. Bright Golden "Comet" Head during Auto Travel */}
      {activeTravelLeg !== null && cometPos && (
        <g
          id="comet-head"
          transform={`translate(${cometPos.x}, ${cometPos.y})`}
          filter="url(#cometGlow)"
        >
          {/* Outer Radiance */}
          <circle cx="0" cy="0" r="14" fill="#FDE68A" opacity="0.65" />
          {/* Mid Glow */}
          <circle cx="0" cy="0" r="9" fill="#F59E0B" />
          {/* Hot White Core */}
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
          {/* Cross Sparkle */}
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
}
