// src/components/ui/LoadingSpinner.jsx — Cubiny v5
export function LoadingSpinner({ label = "Loading…", size = 36 }) {
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", gap:16, padding:"32px 0",
    }}>
      {/* Layered rings */}
      <div style={{ position:"relative", width:size, height:size }}>
        <div style={{
          width:size, height:size, borderRadius:"50%",
          border:`3px solid var(--s3)`,
          borderTopColor:"var(--blu2)",
          animation:"spin-s 0.8s linear infinite",
        }}/>
        <div style={{
          position:"absolute", inset:6,
          borderRadius:"50%",
          border:`2px solid var(--s2)`,
          borderTopColor:"var(--v3)",
          animation:"spin-s 1.2s linear infinite reverse",
        }}/>
      </div>
      {label && (
        <p style={{ fontSize:13, color:"var(--t3)", textAlign:"center", fontWeight:500 }}>
          {label}
        </p>
      )}
    </div>
  );
}
