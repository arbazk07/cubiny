// src/components/ui/Avatar.jsx
export function Avatar({ initials, size = 36, glow = false }) {
  return (
    <div
      style={{
        width:          size,
        height:         size,
        borderRadius:   "50%",
        flexShrink:     0,
        background:     "linear-gradient(135deg, var(--clr-violet), var(--clr-cyan))",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       size * 0.35,
        fontWeight:     700,
        color:          "#fff",
        fontFamily:     "var(--font-display)",
        animation:      glow ? "glowViolet 2s ease infinite" : "none",
        boxShadow:      glow ? "0 0 20px rgba(124,58,237,0.5)" : "none",
      }}
    >
      {initials}
    </div>
  );
}
