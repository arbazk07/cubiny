// src/components/ui/Avatar.jsx  —  Cubiny v2
export function Avatar({ initials, size = 36, glow = false, status }) {
  return (
    <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(135deg,var(--v),var(--c2))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.34, fontWeight: 700, color: "#fff",
        fontFamily: "var(--font-d)",
        border: "1.5px solid rgba(255,255,255,0.1)",
        animation: glow ? "glowV 2.5s ease infinite" : "none",
      }}>
        {initials}
      </div>
      {status && (
        <div style={{
          position: "absolute", bottom: 1, right: 1,
          width: size * 0.28, height: size * 0.28, borderRadius: "50%",
          background: status === "online" ? "var(--grn)" : status === "busy" ? "var(--amb)" : "var(--t3)",
          border: "2px solid var(--bg2)",
          boxShadow: status === "online" ? "0 0 8px var(--grn)" : "none",
        }} />
      )}
    </div>
  );
}
