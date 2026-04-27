// src/components/ui/Modal.jsx  —  Cubiny v2
import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, subtitle, children, maxWidth = 460 }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0, zIndex:999,
        display:"flex", alignItems:"center", justifyContent:"center", padding:20,
        background:"rgba(2,2,16,0.80)",
        backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
      }}
    >
      <div className="glass animate-bounce-in w-full" style={{ maxWidth, padding:0, overflow:"hidden" }}>
        {/* Header bar */}
        <div style={{
          padding:"24px 28px 20px",
          borderBottom:"1px solid var(--b1)",
          display:"flex", alignItems:"flex-start", justifyContent:"space-between",
          background:"linear-gradient(135deg,rgba(109,40,217,0.06),rgba(8,145,178,0.04))",
        }}>
          <div>
            <h3 style={{ fontFamily:"var(--font-d)", fontSize:18, marginBottom: subtitle ? 3 : 0 }}>{title}</h3>
            {subtitle && <p style={{ fontSize:13, color:"var(--t2)" }}>{subtitle}</p>}
          </div>
          <button onClick={onClose}
            style={{ background:"var(--s2)", border:"1px solid var(--b2)", borderRadius:8, padding:6, color:"var(--t2)", display:"flex", cursor:"pointer", marginLeft:12 }}>
            <X size={15} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding:"24px 28px 28px" }}>{children}</div>
      </div>
    </div>
  );
}
