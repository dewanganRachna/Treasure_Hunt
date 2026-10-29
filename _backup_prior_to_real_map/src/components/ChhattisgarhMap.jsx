import React from 'react';
import { MAP_CONFIG } from '../data/chhattisgarhMapData';
import TreasureChestIcon from './TreasureChestIcon';
import { sound } from '../utils/audio';

export default function ChhattisgarhMap({
  unlockedTreasures = [],
  currentTreasureId = 1,
  onSelectTreasure = () => {},
  isInteractive = true,
  lang = 'hi'
}) {
  const { viewBox, districts, routes, treasures } = MAP_CONFIG;

  const isT1Unlocked = unlockedTreasures.includes(1);
  const isT2Unlocked = unlockedTreasures.includes(2);

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



      {/* SVG Map of Chhattisgarh */}
      <svg
        viewBox={viewBox}
        className="cg-svg-canvas notranslate"
        translate="no"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Light Theme Vibrant Unified State Silhouette Gradient */}
          <linearGradient id="districtGradient" gradientUnits="userSpaceOnUse" x1="0" y1="50" x2="0" y2="720">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>

          <linearGradient id="activeDistrictGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.15" />
          </linearGradient>

          {/* Soft Glow Filters */}
          <filter id="neonGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#f59e0b" />
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
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#0284c7" />
          </marker>
        </defs>

        {/* Ambient Radar Sweep over map — subtle in light mode */}
        <g className="radar-group pointer-events-none" opacity="0.3">
          <circle cx="210" cy="350" r="280" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="5 5" />
          <circle cx="210" cy="350" r="180" fill="none" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="3 3" />
          <circle cx="210" cy="350" r="80" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="210" y1="50" x2="210" y2="650" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="3 3" />
          <line x1="30" y1="350" x2="390" y2="350" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="3 3" />

          {/* Rotating Radar Scanner Beam */}
          <line x1="210" y1="350" x2="210" y2="70" stroke="#0284c7" strokeWidth="1.5" opacity="0.35">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 210 350"
              to="360 210 350"
              dur="7.5s"
              repeatCount="indefinite"
            />
          </line>
        </g>

        {/* Chhattisgarh State Outline Only — Absolutely No District Lines */}
        <g id="chhattisgarh-districts" filter="drop-shadow(0 12px 24px rgba(2, 132, 199, 0.22))">
          {districts.map((d) => (
            <path
              key={d.id}
              d={d.path}
              fill="url(#districtGradient)"
              stroke="url(#districtGradient)"
              strokeWidth="1.2"
              strokeLinejoin="round"
              className="district-path"
            >
              <title>{d.name}</title>
            </path>
          ))}
        </g>

        {/* CONNECTING ROUTES */}
        {/* Route 1 -> 2: Digital Seva to AI Explorer */}
        {isT1Unlocked && (
          <g className="animated-route-group route-1-2">
            <path
              d={routes.route1to2}
              fill="none"
              stroke="#0284c7"
              strokeWidth="6"
              strokeOpacity="0.25"
            />
            <path
              d={routes.route1to2}
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.2"
              strokeDasharray="8 6"
              className="route-pulse-dash"
              markerEnd="url(#routeArrow)"
            />
            {/* Sequential data pulses */}
            <circle r="4" fill="#f59e0b">
              <animateMotion path={routes.route1to2} dur="2.4s" begin="0s" repeatCount="indefinite" />
            </circle>
            <circle r="3.5" fill="#0284c7">
              <animateMotion path={routes.route1to2} dur="2.4s" begin="0.8s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#10b981">
              <animateMotion path={routes.route1to2} dur="2.4s" begin="1.6s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Route 2 -> 3: AI Explorer to Smart Chhattisgarh */}
        {isT2Unlocked && (
          <g className="animated-route-group route-2-3">
            <path
              d={routes.route2to3}
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeOpacity="0.25"
            />
            <path
              d={routes.route2to3}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.2"
              strokeDasharray="8 6"
              className="route-pulse-dash-reverse"
              markerEnd="url(#routeArrow)"
            />
            {/* Sequential data pulses */}
            <circle r="4" fill="#0284c7">
              <animateMotion path={routes.route2to3} dur="2.8s" begin="0s" repeatCount="indefinite" />
            </circle>
            <circle r="3.5" fill="#f59e0b">
              <animateMotion path={routes.route2to3} dur="2.8s" begin="0.95s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#10b981">
              <animateMotion path={routes.route2to3} dur="2.8s" begin="1.9s" repeatCount="indefinite" />
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
              {/* Outer pulsing ring for current active marker */}
              {isCurrent && (
                <g className="marker-sonar pointer-events-none">
                  <circle cx="0" cy="0" r="34" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.8">
                    <animate attributeName="r" values="20;54" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="28" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="r" values="18;44" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                  </circle>

                  {/* Rotating Reticle Rings */}
                  <circle cx="0" cy="0" r="32" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="8 12" opacity="0.6">
                    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="12s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="42" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="16 28" opacity="0.4">
                    <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="18s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* Platform Base */}
              <ellipse
                cx="0"
                cy="18"
                rx="25"
                ry="9"
                fill={isUnlocked ? 'rgba(16, 185, 129, 0.2)' : isCurrent ? 'rgba(2, 132, 199, 0.2)' : 'rgba(148, 163, 184, 0.15)'}
                stroke={isUnlocked ? '#10b981' : isCurrent ? '#0284c7' : '#cbd5e1'}
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
                  fill={isUnlocked ? '#10b981' : isCurrent ? '#0284c7' : '#94a3b8'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fill="#ffffff"
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
                  fill="#ffffff"
                  stroke={isUnlocked ? '#10b981' : isCurrent ? '#0284c7' : '#e2e8f0'}
                  strokeWidth={isCurrent ? '1.8' : '1'}
                  filter="drop-shadow(0 2px 6px rgba(0,0,0,0.08))"
                />
                <text
                  x="0"
                  y="15"
                  textAnchor="middle"
                  fill={isUnlocked ? '#047857' : isCurrent ? '#0369a1' : '#64748b'}
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
                        fill="#ffffff"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        filter="drop-shadow(0 4px 14px rgba(245, 158, 11, 0.35))"
                      />
                      {/* Arrow pointer pointing left to chest */}
                      <polygon
                        points="12,-5 2,0 12,5"
                        fill="#f59e0b"
                      />
                      <text
                        x="102"
                        y="5"
                        textAnchor="middle"
                        fill="#1e293b"
                        fontSize="11.5"
                        fontWeight="800"
                        fontFamily="'Outfit', sans-serif"
                        className="tracking-wide notranslate"
                        translate="no"
                      >
                        ✨ {lang === 'en' ? treasure.popupText : (treasure.popupHindi || treasure.popupText)}
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
                        fill="#ffffff"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        filter="drop-shadow(0 4px 14px rgba(245, 158, 11, 0.35))"
                      />
                      {/* Arrow pointer down to chest */}
                      <polygon
                        points="-8,-2 0,6 8,-2"
                        fill="#f59e0b"
                      />
                      <text
                        x="0"
                        y="-13"
                        textAnchor="middle"
                        fill="#1e293b"
                        fontSize="11.5"
                        fontWeight="800"
                        fontFamily="'Outfit', sans-serif"
                        className="tracking-wide notranslate"
                        translate="no"
                      >
                        ✨ {lang === 'en' ? treasure.popupText : (treasure.popupHindi || treasure.popupText)}
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
                fill="rgba(0, 0, 0, 0.001)"
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
