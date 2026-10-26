import React from 'react';
import { MAP_CONFIG } from '../data/chhattisgarhMapData';
import TreasureChestIcon from './TreasureChestIcon';
import { sound } from '../utils/audio';

export default function ChhattisgarhMap({
  unlockedTreasures = [],
  currentTreasureId = 1,
  onSelectTreasure = () => {},
  isInteractive = true
}) {
  const { viewBox, districts, routes, treasures } = MAP_CONFIG;

  const isT1Unlocked = unlockedTreasures.includes(1);
  const isT2Unlocked = unlockedTreasures.includes(2);
  const isT3Unlocked = unlockedTreasures.includes(3);

  const getMarkerState = (id) => {
    if (unlockedTreasures.includes(id)) return 'unlocked';
    if (id === currentTreasureId) return 'active';
    return 'locked';
  };

  const handleMarkerClick = (treasure) => {
    if (!isInteractive) return;

    if (treasure.id === currentTreasureId) {
      sound.playClick();
      onSelectTreasure(treasure);
    } else if (unlockedTreasures.includes(treasure.id)) {
      sound.playTreasureHover();
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="map-container-inner">
      {/* Background Cybernetic Grid & Radar Rings */}
      <div className="map-grid-bg map-grid-absolute" />

      {/* Top Left GIS Telemetry */}
      <div className="map-telemetry-top-left">
        <div className="telemetry-live-row">
          <span className="telemetry-ping-dot" />
          <span>CHiPS GIS NAV: STATE MAP ACTIVE</span>
        </div>
        <div className="telemetry-sub-row">
          GEO COORD: 21°14′N 81°38′E • RAIPUR HQ
        </div>
      </div>

      {/* Bottom Right Sector Note */}
      <div className="map-telemetry-bottom-right">
        <div>SECTOR: CENTRAL INDIA • CHHATTISGARH</div>
        <div className="telemetry-cyan-tag">RAJYOTSAV DIGITAL EXPLORATION SYSTEM</div>
      </div>

      {/* SVG Map of Chhattisgarh */}
      <svg
        viewBox={viewBox}
        className="cg-svg-canvas"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Cyberpunk Map Gradients */}
          <linearGradient id="districtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a1d3f" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#081836" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#040c1d" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="activeDistrictGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
          </linearGradient>

          {/* Neon Glow Filters */}
          <filter id="neonGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#38ef7d" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>

          {/* Animated Directional Arrow Marker */}
          <marker
            id="routeArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#00f2fe" />
          </marker>
        </defs>

        {/* Ambient Radar Sweep over map */}
        <g className="radar-group pointer-events-none" opacity="0.22">
          <circle cx="210" cy="350" r="280" fill="none" stroke="#00f2fe" strokeWidth="0.8" strokeDasharray="5 5" />
          <circle cx="210" cy="350" r="180" fill="none" stroke="#00f2fe" strokeWidth="0.6" strokeDasharray="3 3" />
          <circle cx="210" cy="350" r="80" fill="none" stroke="#00f2fe" strokeWidth="0.8" />
          <line x1="210" y1="50" x2="210" y2="650" stroke="#00f2fe" strokeWidth="0.4" strokeDasharray="3 3" />
          <line x1="30" y1="350" x2="390" y2="350" stroke="#00f2fe" strokeWidth="0.4" strokeDasharray="3 3" />
        </g>

        {/* Chhattisgarh Districts Layer */}
        <g id="chhattisgarh-districts">
          {districts.map((d) => (
            <path
              key={d.id}
              d={d.path}
              fill="url(#districtGradient)"
              stroke="#00f2fe"
              strokeWidth="1.1"
              strokeOpacity="0.45"
              className="district-path"
            >
              <title>{d.name} District</title>
            </path>
          ))}
        </g>

        {/* Outer State Silhouette Glow Border */}
        <g id="state-border-glow" className="pointer-events-none" filter="url(#neonGlowCyan)">
          {districts.map((d) => (
            <path
              key={`glow-${d.id}`}
              d={d.path}
              fill="none"
              stroke="#00f2fe"
              strokeWidth="0.8"
              strokeOpacity="0.65"
            />
          ))}
        </g>

        {/* CONNECTING ROUTES */}
        {/* Route 1 -> 2: Digital Seva to AI Explorer */}
        {isT1Unlocked && (
          <g className="animated-route-group route-1-2">
            <path
              d={routes.route1to2}
              fill="none"
              stroke="#00f2fe"
              strokeWidth="6"
              strokeOpacity="0.3"
              filter="url(#routeGlow)"
            />
            <path
              d={routes.route1to2}
              fill="none"
              stroke="#00f2fe"
              strokeWidth="3.2"
              strokeDasharray="8 6"
              className="route-pulse-dash"
              markerEnd="url(#routeArrow)"
            />
            <circle r="4.5" fill="#ffd700" filter="url(#neonGlowCyan)">
              <animateMotion
                path={routes.route1to2}
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* Route 2 -> 3: AI Explorer to Smart Chhattisgarh */}
        {isT2Unlocked && (
          <g className="animated-route-group route-2-3">
            <path
              d={routes.route2to3}
              fill="none"
              stroke="#38ef7d"
              strokeWidth="6"
              strokeOpacity="0.3"
              filter="url(#routeGlow)"
            />
            <path
              d={routes.route2to3}
              fill="none"
              stroke="#38ef7d"
              strokeWidth="3.2"
              strokeDasharray="8 6"
              className="route-pulse-dash-reverse"
              markerEnd="url(#routeArrow)"
            />
            <circle r="4.5" fill="#00f2fe" filter="url(#neonGlowCyan)">
              <animateMotion
                path={routes.route2to3}
                dur="2.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* TREASURE MARKERS ON THE MAP */}
        {treasures.map((treasure) => {
          const state = getMarkerState(treasure.id);
          const isCurrent = treasure.id === currentTreasureId;
          const isUnlocked = unlockedTreasures.includes(treasure.id);
          const isClickable = isInteractive && isCurrent;

          return (
            <g
              key={treasure.id}
              transform={`translate(${treasure.x}, ${treasure.y})`}
              className={`treasure-marker-group ${state} ${isClickable ? 'clickable-marker' : ''}`}
              onClick={() => handleMarkerClick(treasure)}
            >
              {/* Outer pulsing radar ring for current active marker */}
              {isCurrent && (
                <g className="marker-sonar pointer-events-none">
                  <circle cx="0" cy="0" r="34" fill="none" stroke="#00f2fe" strokeWidth="2" opacity="0.8">
                    <animate attributeName="r" values="20;58" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="28" fill="none" stroke="#ffd700" strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="r" values="18;46" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* Holographic Platform Base */}
              <ellipse
                cx="0"
                cy="18"
                rx="25"
                ry="9"
                fill={isUnlocked ? 'rgba(16, 185, 129, 0.3)' : isCurrent ? 'rgba(0, 242, 254, 0.35)' : 'rgba(100, 116, 139, 0.2)'}
                stroke={isUnlocked ? '#10b981' : isCurrent ? '#00f2fe' : '#475569'}
                strokeWidth="1.5"
              />

              {/* Embedded Chest Icon Container */}
              <g transform="translate(-26, -30)">
                <foreignObject width="52" height="52" className="overflow-visible pointer-events-none">
                  <TreasureChestIcon state={state} size={52} />
                </foreignObject>
              </g>

              {/* Number Badge (1, 2, 3) */}
              <g transform="translate(-24, -26)" className="pointer-events-none">
                <circle
                  cx="0"
                  cy="0"
                  r="10"
                  fill={isUnlocked ? '#10b981' : isCurrent ? '#00f2fe' : '#334155'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fill={isCurrent ? '#050b1a' : '#ffffff'}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="'Rajdhani', sans-serif"
                >
                  {treasure.id}
                </text>
              </g>

              {/* Treasure Name Label Pill */}
              <g transform="translate(0, 32)" className="pointer-events-none">
                <rect
                  x="-65"
                  y="0"
                  width="130"
                  height="22"
                  rx="11"
                  fill="rgba(5, 15, 36, 0.94)"
                  stroke={isUnlocked ? '#10b981' : isCurrent ? '#00f2fe' : 'rgba(148, 163, 184, 0.3)'}
                  strokeWidth={isCurrent ? '1.8' : '1'}
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
                />
                <text
                  x="0"
                  y="15"
                  textAnchor="middle"
                  fill={isUnlocked ? '#34d399' : isCurrent ? '#ffffff' : '#94a3b8'}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="'Outfit', sans-serif"
                >
                  {treasure.id}. {treasure.name}
                </text>
              </g>

              {/* HIGHLIGHTED POPUP CALLOUT (for current active treasure) */}
              {isCurrent && (
                <g
                  transform={treasure.id === 1 ? 'translate(36, -8)' : 'translate(0, -48)'}
                  className="active-popup-balloon pointer-events-none"
                >
                  {treasure.id === 1 ? (
                    <>
                      {/* Speech bubble box placed to the right */}
                      <rect
                        x="12"
                        y="-16"
                        width="180"
                        height="32"
                        rx="8"
                        fill="rgba(7, 24, 58, 0.96)"
                        stroke="#ffd700"
                        strokeWidth="2"
                        filter="drop-shadow(0 0 14px rgba(255, 215, 0, 0.6))"
                      />
                      {/* Arrow pointer pointing left to chest */}
                      <polygon
                        points="12,-5 2,0 12,5"
                        fill="#ffd700"
                      />
                      <text
                        x="102"
                        y="5"
                        textAnchor="middle"
                        fill="#fffbeb"
                        fontSize="11.5"
                        fontWeight="800"
                        fontFamily="'Outfit', sans-serif"
                        className="tracking-wide"
                      >
                        ✨ {treasure.popupText}
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Speech bubble box placed above */}
                      <rect
                        x="-105"
                        y="-34"
                        width="210"
                        height="32"
                        rx="8"
                        fill="rgba(7, 24, 58, 0.96)"
                        stroke="#ffd700"
                        strokeWidth="2"
                        filter="drop-shadow(0 0 14px rgba(255, 215, 0, 0.6))"
                      />
                      {/* Arrow pointer down to chest */}
                      <polygon
                        points="-8,-2 0,6 8,-2"
                        fill="#ffd700"
                      />
                      <text
                        x="0"
                        y="-13"
                        textAnchor="middle"
                        fill="#fffbeb"
                        fontSize="11.5"
                        fontWeight="800"
                        fontFamily="'Outfit', sans-serif"
                        className="tracking-wide"
                      >
                        ✨ {treasure.popupText}
                      </text>
                    </>
                  )}
                </g>
              )}

              {/* Master Touch Hitbox covering entire marker + speech bubble */}
              <rect
                x="-80"
                y={isCurrent ? -85 : -40}
                width="160"
                height={isCurrent ? 145 : 95}
                fill="rgba(0, 242, 254, 0.001)"
                pointerEvents="all"
                className="cursor-pointer"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
