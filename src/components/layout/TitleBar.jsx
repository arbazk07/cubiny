// src/components/layout/TitleBar.jsx — Cubiny Desktop v4
// Custom frameless window title bar with traffic-light controls.
// Only rendered when running inside Electron.
import { useState, useEffect } from "react";
import { Minus, Square, X, Maximize2, Minimize2 } from "lucide-react";
import { electronWindow, IS_ELECTRON } from "../../hooks/useElectron";

export function TitleBar() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!IS_ELECTRON) return;
    const t = setInterval(() => {
      electronWindow.isMaximized().then(setMaximized);
    }, 400);
    return () => clearInterval(t);
  }, []);

  if (!IS_ELECTRON) return null;

  const isMac = navigator.platform.toLowerCase().includes("mac");

  return (
    <div
      // webkit-app-region: drag allows the bar to drag the window
      style={{
        height:         38,
        minHeight:      38,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        background:     "rgba(4,4,14,0.98)",
        borderBottom:   "1px solid rgba(255,255,255,0.05)",
        WebkitAppRegion:"drag",      // entire bar is draggable
        flexShrink:     0,
        position:       "relative",
        zIndex:         9999,
        userSelect:     "none",
        paddingLeft:    isMac ? 78 : 12,  // leave room for macOS traffic lights
        paddingRight:   isMac ? 12 : 0,
      }}
    >
      {/* App name */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Cube logo mark */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="2"  y="2"  width="9" height="9" rx="2" fill="#8b5cf6" opacity="0.9"/>
          <rect x="13" y="2"  width="9" height="9" rx="2" fill="#22d3ee" opacity="0.55"/>
          <rect x="2"  y="13" width="9" height="9" rx="2" fill="#22d3ee" opacity="0.55"/>
          <rect x="13" y="13" width="9" height="9" rx="2" fill="#8b5cf6" opacity="0.9"/>
        </svg>
        <span style={{
          fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)",
          fontFamily: "var(--font-d)", letterSpacing: "0.03em",
        }}>
          Cubiny
        </span>
      </div>

      {/* Windows-style controls (hidden on macOS — native traffic lights handle it) */}
      {!isMac && (
        <div
          style={{
            display:         "flex",
            alignItems:      "center",
            WebkitAppRegion: "no-drag",  // buttons must NOT be draggable
          }}
        >
          {/* Minimize */}
          <TitleButton
            onClick={electronWindow.minimize}
            hoverColor="rgba(255,255,255,0.1)"
            label="Minimize"
          >
            <Minus size={12}/>
          </TitleButton>

          {/* Maximize / Restore */}
          <TitleButton
            onClick={electronWindow.maximize}
            hoverColor="rgba(255,255,255,0.1)"
            label={maximized ? "Restore" : "Maximize"}
          >
            {maximized ? <Minimize2 size={11}/> : <Maximize2 size={11}/>}
          </TitleButton>

          {/* Close */}
          <TitleButton
            onClick={electronWindow.close}
            hoverColor="#e11d48"
            label="Close"
            closeBtn
          >
            <X size={12}/>
          </TitleButton>
        </div>
      )}
    </div>
  );
}

function TitleButton({ onClick, hoverColor, label, closeBtn, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:           46,
        height:          38,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        background:      hov ? hoverColor : "transparent",
        border:          "none",
        cursor:          "pointer",
        color:           hov && closeBtn ? "#fff" : "rgba(255,255,255,0.5)",
        transition:      "background 0.15s, color 0.15s",
        WebkitAppRegion: "no-drag",
      }}
    >
      {children}
    </button>
  );
}
