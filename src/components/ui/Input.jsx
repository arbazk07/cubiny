// src/components/ui/Input.jsx — Cubiny v6 Professional
export function Input({ label, hint, icon: Icon, iconRight: IconRight,
  onIconRightClick, error, helper, className = '', style = {}, ...props }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, width:'100%' }}>
      {(label || hint) && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          {label && <label style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', letterSpacing:'-0.01em' }}>{label}</label>}
          {hint && (
            <button type="button" style={{ fontSize:12, color:'var(--cobalt)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font)', fontWeight:500 }}>
              {hint}
            </button>
          )}
        </div>
      )}
      <div style={{ position:'relative' }}>
        {Icon && (
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: error ? '#DC2626' : 'var(--text-muted)', display:'flex', pointerEvents:'none' }}>
            <Icon size={16} strokeWidth={1.8}/>
          </span>
        )}
        <input
          className={className}
          style={{
            width:'100%', height:44,
            padding: Icon ? '0 14px 0 42px' : IconRight ? '0 42px 0 14px' : '0 14px',
            fontSize:14, color:'var(--text-primary)',
            background: error ? '#FFF8F8' : 'var(--bg-white)',
            border: `1.5px solid ${error ? '#EF4444' : 'var(--border)'}`,
            borderRadius:'var(--r-lg)', fontFamily:'var(--font)',
            transition:'border-color 0.15s, box-shadow 0.15s',
            boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.10)' : 'var(--shadow-xs)',
            ...style,
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? '#EF4444' : 'var(--cobalt)';
            e.target.style.boxShadow   = error ? '0 0 0 3px rgba(239,68,68,0.12)' : '0 0 0 3px rgba(37,99,235,0.12)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? '#EF4444' : 'var(--border)';
            e.target.style.boxShadow   = error ? '0 0 0 3px rgba(239,68,68,0.10)' : 'var(--shadow-xs)';
          }}
          {...props}
        />
        {IconRight && (
          <button type="button" onClick={onIconRightClick} style={{
            position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none', color:'var(--text-muted)', display:'flex', cursor:'pointer', padding:4,
          }}>
            <IconRight size={16} strokeWidth={1.8}/>
          </button>
        )}
      </div>
      {error  && <p style={{ fontSize:12, color:'#DC2626',             marginTop:2 }}>{error}</p>}
      {helper && <p style={{ fontSize:12, color:'var(--text-muted)',   marginTop:2 }}>{helper}</p>}
    </div>
  );
}
