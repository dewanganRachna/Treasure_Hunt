import React from 'react';
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  MAP_OUTLINE,
  BOTTOM_OUTLINE,
  CLIFF_FACETS,
  BASE_SHADOW,
  RIVERS,
  LANDMARKS,
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

            {/* Clip path for terrain boundary */}
            <clipPath id="mapOutlineClip">
              <path d={MAP_OUTLINE} />
            </clipPath>

            {/* 3 Tree Variants Symbols */}
            {/* 1. Round Deciduous Tree */}
            <g id="tree-round">
              <ellipse cx="0" cy="5" rx="9" ry="3.5" fill="#0D2516" opacity="0.35" />
              <rect x="-1.5" y="0" width="3" height="5" rx="1" fill="#4A3525" />
              <circle cx="0" cy="-3" r="8" fill="#1B4D27" />
              <circle cx="-2" cy="-6" r="7" fill="#2E7D32" />
              <circle cx="1" cy="-8" r="5" fill="#4CAF50" />
              <circle cx="2" cy="-9" r="2.5" fill="#81C784" opacity="0.75" />
            </g>

            {/* 2. Conifer / Fir Pine Tree */}
            <g id="tree-conifer">
              <ellipse cx="0" cy="5" rx="8" ry="3.2" fill="#0D2516" opacity="0.32" />
              <rect x="-1" y="1" width="2" height="4.5" rx="0.5" fill="#3E2B1E" />
              <polygon points="0,-2 -8.5,5 8.5,5" fill="#14452F" />
              <polygon points="0,-2 0,5 8.5,5" fill="#1E5C3E" />
              <polygon points="0,-7.5 -6.5,-1 6.5,-1" fill="#206B45" />
              <polygon points="0,-7.5 0,-1 6.5,-1" fill="#2E8B5B" />
              <polygon points="0,-13 -4.5,-6.5 4.5,-6.5" fill="#34A853" />
              <polygon points="0,-13 0,-6.5 4.5,-6.5" fill="#66BB6A" />
            </g>

            {/* 3. Bush / Low Canopy Shrub */}
            <g id="tree-bush">
              <ellipse cx="0" cy="3.5" rx="8" ry="3" fill="#0D2516" opacity="0.28" />
              <circle cx="-4.5" cy="0" r="5" fill="#1E522C" />
              <circle cx="4.5" cy="1" r="4.5" fill="#266436" />
              <circle cx="0" cy="-2.5" r="6" fill="#3E8E4F" />
              <circle cx="-1" cy="-4" r="3" fill="#66BB6A" opacity="0.8" />
            </g>
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
            {/* Solid continuous base foundation */}
            <path
              d={BOTTOM_OUTLINE}
              fill="#182A1E"
              stroke="#122017"
              strokeWidth="1.2"
            />
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
            <g id="topographic-contours" clipPath="url(#mapOutlineClip)" opacity="0.4">
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
          <g id="rivers" clipPath="url(#mapOutlineClip)">
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

          {/* 5. Cultural Landmarks (Chitrakote Falls, Sirpur, Bhoramdeo, Mainpat, Bailadila) */}
          <g id="cultural-landmarks">
            {LANDMARKS && LANDMARKS.map((lm) => {
              if (lm.type === 'waterfall') {
                return (
                  <g key={`lm-${lm.id}`} transform={`translate(${lm.x}, ${lm.y})`} className="map-landmark">
                    {/* Shadow */}
                    <ellipse cx="0" cy="10" rx="16" ry="6" fill="#082012" opacity="0.4" />
                    {/* Rock Ledge */}
                    <path d="M -15,2 Q 0,-2 15,2 L 13,8 Q 0,4 -13,8 Z" fill="#3D362A" stroke="#5A4E3D" strokeWidth="0.8" />
                    {/* Falling Foaming Water Curtain */}
                    <path d="M -11,4 L -9,12 M -6,3 L -5,13 M -2,3 L -1,13 M 2,3 L 3,13 M 6,3 L 7,12 M 10,4 L 11,11" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
                    {/* Spray / Mist Glow */}
                    <ellipse cx="0" cy="12" rx="14" ry="4.5" fill="#E0F2FE" opacity="0.65" filter="url(#riverGlow)" />
                    {/* Spire Pin Accent */}
                    <circle cx="0" cy="-5" r="2.5" fill="#38BDF8" />
                  </g>
                );
              }
              if (lm.type === 'temple') {
                return (
                  <g key={`lm-${lm.id}`} transform={`translate(${lm.x}, ${lm.y})`} className="map-landmark">
                    {/* Ground Shadow */}
                    <ellipse cx="0" cy="8" rx="14" ry="5" fill="#082012" opacity="0.4" />
                    {/* Stone Plinth */}
                    <polygon points="-12,7 12,7 10,4 -10,4" fill="#6B4226" />
                    {/* Mandapa (Entry Hall) */}
                    <rect x="-10" y="0" width="8" height="5" fill="#8C4F2B" stroke="#B86B3E" strokeWidth="0.6" />
                    {/* Tiered Shikhara Spire Tower */}
                    <polygon points="2,4 10,4 8,0 3,0" fill="#9C5931" />
                    <polygon points="3,0 8,0 7,-5 4,-5" fill="#B36A3C" />
                    <polygon points="4,-5 7,-5 6,-9 4.5,-9" fill="#C87B4A" />
                    <polygon points="4.5,-9 6,-9 5.2,-13" fill="#D98D5A" />
                    {/* Golden Kalasha Finial */}
                    <circle cx="5.2" cy="-14.5" r="1.8" fill="#F3D98B" stroke="#D4AF37" strokeWidth="0.6" />
                  </g>
                );
              }
              // Hill / Highlands (Mainpat, Bailadila)
              return (
                <g key={`lm-${lm.id}`} transform={`translate(${lm.x}, ${lm.y})`} className="map-landmark">
                  {/* Base Hill Shadow */}
                  <ellipse cx="0" cy="6" rx="18" ry="6" fill="#082012" opacity="0.35" />
                  {/* Back Mountain Ridge */}
                  <polygon points="-16,4 -4,-9 8,4" fill="#235A33" stroke="#2F7A43" strokeWidth="0.8" />
                  <polygon points="-4,-9 0,-9 8,4 3,4" fill="#1B4728" />
                  {/* Front Fore-Ridge */}
                  <polygon points="-8,5 4,-6 16,5" fill="#35854B" stroke="#48A863" strokeWidth="0.8" />
                  <polygon points="4,-6 8,-6 16,5 11,5" fill="#2B6B3D" />
                  {/* Golden Stupa / Summit Peak Crest */}
                  <circle cx="-4" cy="-10.5" r="1.5" fill="#FDE68A" />
                </g>
              );
            })}
          </g>

          {/* 6. Natural Low-Poly Tree Clusters */}
          <g id="trees">
            {TREES.map((tree, idx) => (
              <g
                key={`tree-${idx}`}
                transform={`translate(${tree.x}, ${tree.y}) scale(${tree.scale})`}
              >
                <use href={`#tree-${tree.variant || 'round'}`} />
              </g>
            ))}
          </g>

          {/* 7. Route Layer (Completed trails, future trails, comet travel) */}
          <RouteLayer
            completedCount={completed.filter(Boolean).length}
            activeTravelLeg={activeTravelLeg}
            travelProgress={travelProgress}
            cometPos={cometPos}
          />

          {/* 8. Exactly 10 UNNUMBERED Checkpoints */}
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

          {/* 9. Ornate Compass Rose at bottom-right of North-Up map */}
          <g transform="translate(1520, 1260) scale(1.15)">
            <CompassRose />
          </g>
        </svg>
      </div>
    </div>
  );
}
