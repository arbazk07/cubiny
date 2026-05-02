// src/components/ui/Modal.jsx — Cubiny v5
import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, subtitle, children, width = 440 }) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:9999,
        background:"rgba(5,8,20,0.75)",
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="animate-bounce-in"
        style={{
          background:    "rgba(14,20,38,0.96)",
          backdropFilter:"blur(32px)",
          border:        "1px solid var(--b2)",
          borderRadius:  "var(--r4)",
          padding:       "28px",
          width:         `min(${width}px, calc(100vw - 40px))`,
          boxShadow:     "var(--sh-pop)",
          position:      "relative",
        }}
      >
        {/* Top accent stripe */}
        <div style={{
          position:"absolute", top:0, left:24, right:24, height:2,
          background:"linear-gradient(90deg,var(--blu),var(--v2),transparent)",
          borderRadius:"0 0 4px 4px",
        }}/>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <h3 style={{ fontFamily:"var(--font-d)", fontSize:18, letterSpacing:"-0.02em", marginBottom:subtitle ? 4 : 0 }}>
              {title}
            </h3>
            {subtitle && <p style={{ fontSize:13, color:"var(--t3)" }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{
            background:"var(--s2)", border:"1px solid var(--b1)",
            borderRadius:10, padding:7, color:"var(--t3)", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.15s", flexShrink:0,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--s3)"; e.currentTarget.style.color = "var(--t1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--s2)"; e.currentTarget.style.color = "var(--t3)"; }}
          >
            <X size={14}/>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
