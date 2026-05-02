// src/components/ui/StatCard.jsx — Cubiny v6 Professional
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = {
  green:  { bg:'#F0FDF4', border:'#BBF7D0', text:'#16A34A', icon:'#22C55E' },
  blue:   { bg:'#EFF6FF', border:'#BFDBFE', text:'#1D4ED8', icon:'#3B82F6' },
  amber:  { bg:'#FFFBEB', border:'#FDE68A', text:'#92400E', icon:'#F59E0B' },
  red:    { bg:'#FFF1F2', border:'#FECDD3', text:'#9F1239', icon:'#F43F5E' },
  sky:    { bg:'#F0F9FF', border:'#BAE6FD', text:'#0369A1', icon:'#0EA5E9' },
  purple: { bg:'#FAF5FF', border:'#E9D5FF', text:'#7E22CE', icon:'#A855F7' },
};

export function StatCard({ icon:Icon, label, value, sub, trend, color='blue' }) {
  const c = COLORS[color] ?? COLORS.blue;
  const isUp = trend > 0;
  return (
    <div
      style={{
        background:'var(--bg-white)', border:`1px solid var(--border)`,
        borderRadius:'var(--r-xl)', padding:'20px 24px',
        boxShadow:'var(--shadow-sm)', cursor:'default',
        transition:'box-shadow 0.2s, transform 0.2s', position:'relative', overflow:'hidden',
      }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.transform='translateY(0)'; }}
    >
      {/* Subtle top accent */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, borderRadius:'var(--r-xl) var(--r-xl) 0 0', background:`linear-gradient(90deg,${c.icon},${c.icon}88)` }}/>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
        <p style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
        <span style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:'var(--r-md)', padding:'7px', display:'flex' }}>
          <Icon size={15} color={c.icon} strokeWidth={2}/>
        </span>
      </div>

      <p style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em', lineHeight:1, marginBottom:6 }}>{value}</p>

      {(sub || trend !== undefined) && (
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          {trend !== undefined && (
            <span style={{ display:'flex', alignItems:'center', gap:2, fontSize:11, fontWeight:700, color:isUp?'#16A34A':'#DC2626' }}>
              {isUp ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
              {Math.abs(trend)}%
            </span>
          )}
          {sub && <span style={{ fontSize:11, color:'var(--text-muted)' }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}
