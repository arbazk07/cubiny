// src/components/map/MockMap.jsx
// ─────────────────────────────────────────────────────────────────
// SVG mock map simulating a real city grid.
// Iteration 4: replace with Leaflet or MapLibre GL JS.
// ─────────────────────────────────────────────────────────────────
import { Plus, Minus } from "lucide-react";

export function MockMap({ showRoute = false, showRider = false, showDriver = false }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: "inherit" }}>
      <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="mapGrad" cx="30%" cy="30%">
            <stop offset="0%"   stopColor="#1a1a3e" />
            <stop offset="100%" stopColor="#06060f" />
          </radialGradient>
          <linearGradient id="routeGrad" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="var(--clr-violet)" />
            <stop offset="1" stopColor="var(--clr-cyan)" />
          </linearGradient>
        </defs>

        {/* Base plate */}
        <rect width="600" height="400" fill="url(#mapGrad)" />

        {/* Grid lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 55 + 10} x2="600" y2={i * 55 + 10}
            stroke="rgba(124,58,237,0.07)" strokeWidth="1" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 60 + 5} y1="0" x2={i * 60 + 5} y2="400"
            stroke="rgba(6,182,212,0.05)" strokeWidth="1" />
        ))}

        {/* City blocks */}
        {[
          [60, 80, 100, 60], [180, 60, 140, 80], [340, 90, 80, 50],
          [60, 200, 120, 70], [220, 190, 90, 90], [350, 180, 160, 100],
          [80, 310, 200, 60], [320, 320, 200, 55],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="6"
            fill={`rgba(${i % 2 === 0 ? "124,58,237" : "6,182,212"},0.06)`}
            stroke={`rgba(${i % 2 === 0 ? "124,58,237" : "6,182,212"},0.12)`}
            strokeWidth="1"
          />
        ))}

        {/* Roads */}
        <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <line x1="160" y1="0"  x2="160" y2="400" stroke="rgba(255,255,255,0.04)" strokeWidth="8"  />
        <line x1="320" y1="0"  x2="320" y2="400" stroke="rgba(255,255,255,0.04)" strokeWidth="8"  />

        {/* Route path */}
        {showRoute && (
          <path
            d="M 130 340 Q 160 280 200 240 Q 250 200 280 160 Q 320 120 380 100"
            fill="none" stroke="url(#routeGrad)"
            strokeWidth="3" strokeDasharray="8 4" strokeLinecap="round"
          />
        )}

        {/* Rider pin */}
        {showRider && (
          <g>
            <circle cx="130" cy="340" r="18" fill="rgba(6,182,212,0.15)" />
            <circle cx="130" cy="340" r="10" fill="var(--clr-cyan)" />
            <circle cx="130" cy="340" r="10" fill="transparent" stroke="var(--clr-cyan-3)" strokeWidth="2">
              <animate attributeName="r"       from="10" to="22" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1"  to="0"  dur="1.5s" repeatCount="indefinite" />
            </circle>
            <text x="130" y="326" textAnchor="middle" fontSize="9"
              fill="var(--clr-cyan-3)" fontFamily="DM Sans, sans-serif">You</text>
          </g>
        )}

        {/* Driver pin */}
        {showDriver && (
          <g>
            <circle cx="380" cy="100" r="18" fill="rgba(124,58,237,0.2)" />
            <circle cx="380" cy="100" r="10" fill="var(--clr-violet-2)" />
            <text x="380" y="88" textAnchor="middle" fontSize="9"
              fill="var(--clr-violet-3)" fontFamily="DM Sans, sans-serif">Driver</text>
          </g>
        )}

        {/* Radius rings */}
        <circle cx="300" cy="200" r="60"  fill="rgba(6,182,212,0.03)" stroke="rgba(6,182,212,0.1)"  strokeWidth="1" />
        <circle cx="300" cy="200" r="100" fill="rgba(6,182,212,0.01)" stroke="rgba(6,182,212,0.05)" strokeWidth="1" />
      </svg>

      {/* Zoom controls */}
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {[Plus, Minus].map((Icon, i) => (
          <button key={i}
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(13,13,31,0.85)", border: "1px solid var(--clr-bor-2)",
              borderRadius: 8, color: "var(--clr-txt)",
            }}
          >
            <Icon size={13} />
          </button>
        ))}
      </div>
    </div>
  );
}
