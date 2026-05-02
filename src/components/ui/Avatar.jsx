// src/components/ui/Avatar.jsx — Cubiny v5
export function Avatar({ initials = "?", size = 38, glow = false, status }) {
  const statusColors = { online:"#10b981", offline:"#64748b", busy:"#f59e0b" };
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background:"linear-gradient(135deg,#7c3aed,#3b82f6)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"var(--font-d)", fontWeight:800,
        fontSize:size * 0.36, color:"#fff",
        boxShadow: glow ? "0 0 20px rgba(59,130,246,0.55)" : "0 2px 8px rgba(0,0,0,0.3)",
        transition:"box-shadow 0.3s",
        letterSpacing:"-0.02em",
        userSelect:"none",
      }}>
        {initials.slice(0,2).toUpperCase()}
      </div>
      {status && (
        <div style={{
          position:"absolute", bottom:0, right:0,
          width:size * 0.28, height:size * 0.28, borderRadius:"50%",
          background: statusColors[status] ?? "#64748b",
          border:`2px solid var(--bg2)`,
          boxShadow:`0 0 8px ${statusColors[status] ?? "#64748b"}`,
        }}/>
      )}
    </div>
  );
}
