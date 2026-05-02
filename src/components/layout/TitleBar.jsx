// src/components/layout/TitleBar.jsx — Cubiny v5
// Updated brand colors to Electric Blue / Violet palette
import { useState, useEffect } from "react";
import { Minus, X, Maximize2, Minimize2 } from "lucide-react";
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
    <div style={{
      height:38, minHeight:38, display:"flex", alignItems:"center",
      justifyContent:"space-between",
      background:"rgba(6,9,22,0.99)",
      borderBottom:"1px solid var(--b1)",
      WebkitAppRegion:"drag",
      flexShrink:0, position:"relative", zIndex:9999,
      userSelect:"none",
      paddingLeft: isMac ? 78 : 12,
      paddingRight: isMac ? 12 : 0,
    }}>
      {/* Top glow line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:1,
        background:"linear-gradient(90deg,var(--blu),var(--v2),transparent)",
        opacity:0.5,
      }}/>

      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="2"  y="2"  width="9" height="9" rx="2" fill="#60a5fa" opacity="0.95"/>
          <rect x="13" y="2"  width="9" height="9" rx="2" fill="#a78bfa" opacity="0.55"/>
          <rect x="2"  y="13" width="9" height="9" rx="2" fill="#a78bfa" opacity="0.55"/>
          <rect x="13" y="13" width="9" height="9" rx="2" fill="#60a5fa" opacity="0.95"/>
        </svg>
        <span style={{
          fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)",
          fontFamily:"var(--font-d)", letterSpacing:"0.04em",
        }}>Cubiny</span>
      </div>

      {!isMac && (
        <div style={{ display:"flex", alignItems:"center", WebkitAppRegion:"no-drag" }}>
          <TitleButton onClick={electronWindow.minimize} hoverColor="rgba(255,255,255,0.09)" label="Minimize">
            <Minus size={12}/>
          </TitleButton>
          <TitleButton onClick={electronWindow.maximize} hoverColor="rgba(255,255,255,0.09)" label={maximized ? "Restore" : "Maximize"}>
            {maximized ? <Minimize2 size={11}/> : <Maximize2 size={11}/>}
          </TitleButton>
          <TitleButton onClick={electronWindow.close} hoverColor="#e11d48" label="Close" closeBtn>
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
    <button onClick={onClick} aria-label={label}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width:46, height:38, display:"flex", alignItems:"center", justifyContent:"center",
        background: hov ? hoverColor : "transparent",
        border:"none", cursor:"pointer",
        color: (hov && closeBtn) ? "#fff" : "rgba(255,255,255,0.45)",
        transition:"background 0.15s, color 0.15s",
        WebkitAppRegion:"no-drag",
      }}>
      {children}
    </button>
  );
}
