import React from 'react';

/**
 * DesktopSideGraphics: Subtle, decorative cybersecurity visual elements
 * on the left and right margins for wide desktop screens.
 * 
 * Left: Multi-layered shield geometry, connected network nodes with subtle floating animation, fine digital circuit lines.
 * Right: Security lock geometry, concentric security rings, pulse nodes, pink accent points.
 * 
 * Responsive: Visible on wide desktop (lg/xl), reduced/hidden on smaller viewports.
 * Does not cause horizontal overflow or obstruct text.
 */
export function DesktopSideGraphics() {
  return (
    <div
      className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ============================================================ */}
      {/* LEFT MARGIN GRAPHIC                                          */}
      {/* ============================================================ */}
      <div className="absolute top-16 left-0 w-48 xl:w-64 h-[90vh] opacity-70">
        <svg
          viewBox="0 0 240 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#2563EB]"
        >
          <defs>
            <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
              <stop offset="70%" stopColor="#2563EB" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Abstract Shield Outline */}
          <path
            d="M20 90 L110 50 L160 110 L110 210 L20 180 Z"
            stroke="url(#leftFade)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />

          {/* Network Pathways & Nodes */}
          <path
            d="M10 260 L90 290 L150 240 L190 320"
            stroke="url(#leftFade)"
            strokeWidth="1"
            className="animate-pathway"
          />
          <path
            d="M90 290 L70 380 L130 420"
            stroke="url(#leftFade)"
            strokeWidth="0.8"
          />
          <path
            d="M150 240 L180 170"
            stroke="url(#leftFade)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />

          {/* Circular Nodes with Subtle Alive Pulse */}
          <circle cx="10" cy="260" r="3" fill="#2563EB" fillOpacity="0.3" />
          <circle cx="90" cy="290" r="4" fill="#2563EB" fillOpacity="0.35" className="animate-node-pulse" />
          <circle cx="150" cy="240" r="3.5" fill="#2563EB" fillOpacity="0.3" />
          <circle cx="190" cy="320" r="4" fill="#2563EB" fillOpacity="0.25" className="animate-node-pulse" />
          <circle cx="70" cy="380" r="2.5" fill="#2563EB" fillOpacity="0.3" />
          <circle cx="130" cy="420" r="3" fill="#2563EB" fillOpacity="0.35" />

          {/* Concentric Node Rings */}
          <circle
            cx="90"
            cy="290"
            r="10"
            stroke="#2563EB"
            strokeOpacity="0.2"
            strokeWidth="0.75"
          />

          {/* Subtle Pink Accent Node */}
          <circle cx="110" cy="50" r="2.5" fill="#EC4899" fillOpacity="0.5" className="animate-node-pulse" />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* RIGHT MARGIN GRAPHIC                                         */}
      {/* ============================================================ */}
      <div className="absolute top-16 right-0 w-48 xl:w-64 h-[90vh] opacity-70">
        <svg
          viewBox="0 0 240 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#2563EB]"
        >
          <defs>
            <linearGradient id="rightFade" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
              <stop offset="70%" stopColor="#2563EB" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Security Lock / Geometric Motif */}
          <rect
            x="110"
            y="130"
            width="70"
            height="60"
            rx="8"
            stroke="url(#rightFade)"
            strokeWidth="1.2"
          />
          <path
            d="M125 130 V110 C125 95 165 95 165 110 V130"
            stroke="url(#rightFade)"
            strokeWidth="1.2"
          />

          {/* Network Pathways & Nodes */}
          <path
            d="M220 280 L140 250 L80 310 L40 270"
            stroke="url(#rightFade)"
            strokeWidth="1"
            className="animate-pathway"
          />
          <path
            d="M140 250 L160 370 L100 430"
            stroke="url(#rightFade)"
            strokeWidth="0.8"
          />
          <path
            d="M80 310 L50 400"
            stroke="url(#rightFade)"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />

          {/* Circular Nodes with Subtle Pulse */}
          <circle cx="220" cy="280" r="3.5" fill="#2563EB" fillOpacity="0.3" />
          <circle cx="140" cy="250" r="4" fill="#2563EB" fillOpacity="0.35" className="animate-node-pulse" />
          <circle cx="80" cy="310" r="3" fill="#2563EB" fillOpacity="0.3" />
          <circle cx="40" cy="270" r="3" fill="#2563EB" fillOpacity="0.25" />
          <circle cx="160" cy="370" r="3" fill="#2563EB" fillOpacity="0.3" />
          <circle cx="100" cy="430" r="4" fill="#2563EB" fillOpacity="0.35" className="animate-node-pulse" />

          {/* Concentric Node Rings */}
          <circle
            cx="140"
            cy="250"
            r="11"
            stroke="#2563EB"
            strokeOpacity="0.2"
            strokeWidth="0.75"
          />

          {/* Subtle Pink Accent Points */}
          <circle cx="145" cy="160" r="2.5" fill="#EC4899" fillOpacity="0.5" className="animate-node-pulse" />
          <circle cx="100" cy="430" r="2" fill="#EC4899" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

export default DesktopSideGraphics;
