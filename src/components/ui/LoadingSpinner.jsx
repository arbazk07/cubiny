// src/components/ui/LoadingSpinner.jsx  —  Cubiny v2
export function LoadingSpinner({ size = 40, label = "Loading…" }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, height:"100%", color:"var(--t3)" }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        border: "2px solid var(--b2)",
        borderTop: "2px solid var(--v3)",
        animation: "spin 0.75s linear infinite",
      }} />
      <span style={{ fontSize:13, fontFamily:"var(--font-b)" }}>{label}</span>
    </div>
  );
}
