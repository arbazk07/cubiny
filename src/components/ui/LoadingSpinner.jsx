// src/components/ui/LoadingSpinner.jsx — Cubiny v6
export function LoadingSpinner({ label='Loading…', size=32, color='var(--cobalt)' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'32px 0' }}>
      <div style={{
        width:size, height:size, borderRadius:'50%',
        border:`3px solid var(--border)`,
        borderTopColor:color,
        animation:'spin-s 0.7s linear infinite',
      }}/>
      {label && <p style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>{label}</p>}
    </div>
  );
}
