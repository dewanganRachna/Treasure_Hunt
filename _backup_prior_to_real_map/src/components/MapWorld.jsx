import React from 'react';
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  MAP_OUTLINE,
  CLIFF_FACETS,
  BASE_SHADOW,
  RIVERS,
  TREES,
  CONTOURS,
  CHECKPOINTS
} from '../game/worldData';
import RouteLayer from './RouteLayer';
import Checkpoint from './Checkpoint';
import CompassRose from './CompassRose';

/**
 * Stationary 3D World container.
 * Rendered once, never moves independently of camera.
 * 3D isometric perspective tilt applied statically.
 */
export default function MapWorld({
  currentLevel = 0,
  completed = [],
  failedLevel = null,
  activeTravelLeg = null,
  travelProgress = 0,
  cometPos = null,
  onCheckpointClick = () => {}
}) {
  return (
    <div className="map-world-perspective-container">
      <div
        className="map-world-surface"
        style={{
          width: `${WORLD_WIDTH}px`,
          height: `${WORLD_HEIGHT}px`
        }}
      >
        <svg
          viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          className="map-world-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Terrain Linear & Radial Gradients */}
            <linearGradient id="terrainGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3E8E4F" />
              <stop offset="35%" stopColor="#2F7A43" />
              <stop offset="70%" stopColor="#266436" />
              <stop offset="100%" stopColor="#1E522C" />
            </linearGradient>

            <radialGradient id="highlandHighlight" cx="62%" cy="38%" r="55%">
              <stop offset="0%" stopColor="#5BA865" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3E8E4F" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E522C" stopOpacity="0" />
            </radialGradient>

            {/* Active Checkpoint Ground Glow */}
            <radialGradient id="activeGroundGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>

            {/* Golden Pin Gradient */}
            <linearGradient id="goldPinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="30%" stopColor="#F5C443" />
              <stop offset="70%" stopColor="#D99B1A" />
              <stop offset="100%" stopColor="#A16E0A" />
            </linearGradient>

            {/* River Cyan Glow Filter */}
            <filter id="riverGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Map Drop Shadow Filter */}
            <filter id="mapShadowFilter" x="-20%" y="-20%" width="150%" height="150%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="16" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.08   0 0 0 0 0.18   0 0 0 0 0.1   0 0 0 0.28 0" />
            </filter>
          </defs>

          {/* 1. Underlying Soft Drop Shadow of the Raised Map */}
          <path
            d={BASE_SHADOW}
            fill="#102517"
            filter="url(#mapShadowFilter)"
            opacity="0.65"
          />

          {/* 2. Extruded 3D Cliff Sides (Faceted Sedimentary Rock Strata) */}
          <g id="cliff-sides">
            {CLIFF_FACETS.map((facet, idx) => (
              <g key={`cliff-facet-${idx}`}>
                {/* Base Facet Polygon */}
                <path
                  d={facet.d}
                  fill={facet.color}
                  stroke={facet.border}
                  strokeWidth="1.2"
                />
                {/* Rock Stratum Horizontal Band */}
                <path
                  d={facet.d}
                  fill={facet.shade}
                  opacity="0.35"
                  clipPath="polygon(0 40%, 100% 40%, 100% 65%, 0 65%)"
                />
              </g>
            ))}
          </g>

          {/* 3. Top Green Terrain Face */}
          <g id="terrain-top">
            {/* Base Green Landmass */}
            <path
              d={MAP_OUTLINE}
              fill="url(#terrainGrad)"
            />

            {/* Topographic Highland Radial Lighting */}
            <path
              d={MAP_OUTLINE}
              fill="url(#highlandHighlight)"
            />

            {/* Topographic Elevation Contour Lines */}
            <g id="topographic-contours" opacity="0.35">
              {CONTOURS.map((cPath, idx) => (
                <path
                  key={`contour-${idx}`}
                  d={cPath}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* Perimeter Golden Double Border */}
            <path
              d={MAP_OUTLINE}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <path
              d={MAP_OUTLINE}
              fill="none"
              stroke="#FDE68A"
              strokeWidth="1.2"
              strokeLinejoin="round"
              opacity="0.8"
            />
          </g>

          {/* 4. Realistic River Ribbon Systems (Cyan-Blue Waters) */}
          <g id="rivers">
            {RIVERS.map((river, idx) => (
              <g key={`river-${idx}`}>
                {/* Wide Glowing Underlayer */}
                <path
                  d={river.d}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth={river.width + 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#riverGlow)"
                  opacity="0.6"
                />
                {/* Sharp Cyan River Core */}
                <path
                  d={river.d}
                  fill="none"
                  stroke="#BAE6FD"
                  strokeWidth={river.width * 0.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </g>

          {/* 5. Natural Low-Poly Tree Clusters */}
          <g id="trees">
            {TREES.map((tree, idx) => (
              <g
                key={`tree-${idx}`}
                transform={`translate(${tree.x}, ${tree.y}) scale(${tree.scale})`}
              >
                {/* Tree Cluster Ground Shadow */}
                <ellipse cx="0" cy="8" rx={14 * (tree.count * 0.25)} ry="6" fill="#0E2D1A" opacity="0.35" />

                {/* Tree 1 */}
                <circle cx="-6" cy="2" r="7" fill="#1D522B" />
                <circle cx="-6" cy="0" r="6" fill="#2E7D32" />
                <circle cx="-6" cy="-2" r="4.5" fill="#4CAF50" />

                {/* Tree 2 */}
                <circle cx="6" cy="3" r="8" fill="#1B4D27" />
                <circle cx="6" cy="0" r="7" fill="#28732E" />
                <circle cx="6" cy="-2" r="5" fill="#5BA865" />

                {/* Tree 3 (Center High) */}
                {tree.count >= 3 && (
                  <>
                    <circle cx="0" cy="-6" r="9" fill="#14452F" />
                    <circle cx="0" cy="-8" r="8" fill="#2F7A43" />
                    <circle cx="0" cy="-10" r="6" fill="#66BB6A" />
                  </>
                )}

                {/* Extra canopy if large cluster */}
                {tree.count >= 5 && (
                  <circle cx="12" cy="-4" r="6" fill="#388E3C" />
                )}
              </g>
            ))}
          </g>

          {/* 6. Route Layer (Completed trails, future trails, comet travel) */}
          <RouteLayer
            completedCount={completed.filter(Boolean).length}
            activeTravelLeg={activeTravelLeg}
            travelProgress={travelProgress}
            cometPos={cometPos}
          />

          {/* 7. Exactly 10 UNNUMBERED Checkpoints */}
          <g id="checkpoints">
            {CHECKPOINTS.map((cp, idx) => {
              let state = 'locked';
              if (failedLevel === idx) {
                state = 'failed';
              } else if (completed[idx]) {
                state = 'completed';
              } else if (idx === currentLevel) {
                state = 'active';
              }

              return (
                <Checkpoint
                  key={`cp-${cp.id}`}
                  id={cp.id}
                  x={cp.x}
                  y={cp.y}
                  state={state}
                  onClick={() => onCheckpointClick(idx)}
                />
              );
            })}
          </g>

          {/* 8. Ornate Compass Rose at bottom-right */}
          <g transform="translate(2100, 1160)">
            <CompassRose />
          </g>
        </svg>
      </div>
    </div>
  );
}
