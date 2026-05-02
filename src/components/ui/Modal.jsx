// src/components/ui/Modal.jsx — Cubiny v6 Professional
import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, subtitle, children, width=440 }) {
  useEffect(() => {
    if (!open) return;
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'rgba(15,23,42,0.4)', backdropFilter:'blur(8px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        animation:'fade-in 0.2s ease',
      }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        className="anim-slide-up"
        style={{
          background:'var(--bg-white)',
          border:'1px solid var(--border)',
          borderRadius:'var(--r-2xl)',
          padding:28,
          width:`min(${width}px, calc(100vw - 32px))`,
          boxShadow:'var(--shadow-xl)',
          maxHeight:'85vh', overflowY:'auto',
        }}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <h3 style={{ fontSize:17, fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>{title}</h3>
            {subtitle && <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{
            background:'var(--bg-subtle)', border:'1px solid var(--border)', borderRadius:'var(--r-md)',
            padding:'6px', color:'var(--text-muted)', cursor:'pointer', display:'flex', marginLeft:12,
            transition:'all 0.15s', flexShrink:0,
          }}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--border)';e.currentTarget.style.color='var(--text-primary)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-subtle)';e.currentTarget.style.color='var(--text-muted)';}}
          >
            <X size={15}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
