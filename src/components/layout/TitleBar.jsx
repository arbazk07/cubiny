// src/components/layout/TitleBar.jsx — Cubiny v6 Professional (light)
import { useState, useEffect } from 'react';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';
import { electronWindow, IS_ELECTRON } from '../../hooks/useElectron';

function Logo({ size=18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2"  y="2"  width="9" height="9" rx="2" fill="#22C55E"/>
      <rect x="13" y="2"  width="9" height="9" rx="2" fill="#22C55E" opacity="0.4"/>
      <rect x="2"  y="13" width="9" height="9" rx="2" fill="#22C55E" opacity="0.4"/>
      <rect x="13" y="13" width="9" height="9" rx="2" fill="#22C55E"/>
    </svg>
  );
}

function WinBtn({ onClick, hov, label, isClose, children }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} aria-label={label}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width:46, height:36, display:'flex', alignItems:'center', justifyContent:'center',
        background: h ? (isClose ? '#EF4444' : 'rgba(15,23,42,0.06)') : 'transparent',
        border:'none', cursor:'pointer',
        color: h && isClose ? '#fff' : 'rgba(15,23,42,0.5)',
        transition:'all 0.12s',
        WebkitAppRegion:'no-drag',
      }}>
      {children}
    </button>
  );
}

export function TitleBar() {
  const [max, setMax] = useState(false);
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac');

  useEffect(() => {
    if (!IS_ELECTRON) return;
    const t = setInterval(() => electronWindow.isMaximized().then(setMax), 500);
    return () => clearInterval(t);
  }, []);

  if (!IS_ELECTRON) return null;

  return (
    <div style={{
      height:36, minHeight:36, display:'flex', alignItems:'center',
      justifyContent:'space-between',
      background:'var(--bg-white)',
      borderBottom:'1px solid var(--border)',
      WebkitAppRegion:'drag',
      flexShrink:0, position:'relative', zIndex:9999,
      paddingLeft: isMac ? 78 : 14,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <Logo size={16}/>
        <span style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.01em' }}>Cubiny</span>
        <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Premium Rides</span>
      </div>
      {!isMac && (
        <div style={{ display:'flex', WebkitAppRegion:'no-drag' }}>
          <WinBtn onClick={electronWindow.minimize} label="Minimize"><Minus size={12}/></WinBtn>
          <WinBtn onClick={electronWindow.maximize} label={max?'Restore':'Maximize'}>
            {max ? <Minimize2 size={11}/> : <Maximize2 size={11}/>}
          </WinBtn>
          <WinBtn onClick={electronWindow.close} label="Close" isClose><X size={12}/></WinBtn>
        </div>
      )}
    </div>
  );
}
