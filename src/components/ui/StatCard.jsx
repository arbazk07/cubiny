// src/components/ui/StatCard.jsx — Cubiny v5
const COLORS = {
  violet: { text:"var(--v3)",   bg:"rgba(124,62,237,0.10)", border:"rgba(124,62,237,0.22)", glow:"rgba(124,62,237,0.07)" },
  blue:   { text:"var(--blu2)", bg:"rgba(59,130,246,0.10)",  border:"rgba(59,130,246,0.22)",  glow:"rgba(59,130,246,0.06)"  },
  cyan:   { text:"var(--c3)",   bg:"rgba(8,145,178,0.09)",   border:"rgba(8,145,178,0.20)",   glow:"rgba(8,145,178,0.06)"   },
  green:  { text:"var(--grn2)", bg:"rgba(16,185,129,0.09)",  border:"rgba(16,185,129,0.22)",  glow:"rgba(16,185,129,0.06)"  },
  amber:  { text:"#fcd34d",     bg:"rgba(245,158,11,0.09)",  border:"rgba(245,158,11,0.20)",  glow:"rgba(245,158,11,0.06)"  },
  red:    { text:"#fb7185",     bg:"rgba(244,63,94,0.09)",   border:"rgba(244,63,94,0.20)",   glow:"rgba(244,63,94,0.06)"   },
};

export function StatCard({ icon: Icon, label, value, sub, trend, color = "blue" }) {
  const clr = COLORS[color] ?? COLORS.blue;
  return (
    <div className="animate-fade-up" style={{
      background:    `linear-gradient(135deg, ${clr.glow}, var(--s1))`,
      border:        `1px solid ${clr.border}`,
      borderRadius:  "var(--r3)",
      padding:       "22px 24px",
      display:       "flex",
      flexDirection: "column",
      gap:           12,
      boxShadow:     "var(--sh-card)",
      position:      "relative",
      overflow:      "hidden",
      transition:    "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform  = "translateY(-2px)";
        e.currentTarget.style.boxShadow  = `0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px ${clr.border}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--sh-card)";
      }}
    >
      {/* Corner accent */}
      <div style={{
        position:"absolute", top:-24, right:-24, width:100, height:100,
        borderRadius:"50%", background:`radial-gradient(circle, ${clr.bg}, transparent)`,
        pointerEvents:"none",
      }}/>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{
          fontSize:10, color:"var(--t3)", textTransform:"uppercase",
          letterSpacing:"0.12em", fontWeight:700,
        }}>{label}</span>
        <div style={{
          background:clr.bg, borderRadius:12, padding:"8px",
          border:`1px solid ${clr.border}`,
        }}>
          <Icon size={15} color={clr.text}/>
        </div>
      </div>

      <div style={{
        fontSize:28, fontWeight:800, fontFamily:"var(--font-d)",
        color:clr.text, letterSpacing:"-0.03em", lineHeight:1,
      }}>
        {value}
      </div>

      {(sub || trend !== undefined) && (
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {trend !== undefined && (
            <span style={{
              fontSize:11, fontWeight:700, fontFamily:"var(--font-m)",
              color: trend > 0 ? "var(--grn2)" : "#fb7185",
            }}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
          {sub && <span style={{ fontSize:11, color:"var(--t3)" }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}
