// src/pages/admin/AdminPanel.jsx — Cubiny v6 Professional
import { useState, useEffect } from 'react';
import { Activity, DollarSign, Users, Map, AlertTriangle, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { StatCard }       from '../../components/ui/StatCard';
import { StatusPill }     from '../../components/ui/StatusPill';
import { Avatar }         from '../../components/ui/Avatar';
import { Button }         from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { getPlatformStats, getActiveRides, getFlaggedDrivers, getRevenueByMethod, updateDriverStatus } from '../../services/mockService';

export function AdminPanel() {
  const [stats,   setStats]   = useState(null);
  const [rides,   setRides]   = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoad]    = useState(true);
  const [updating,setUpdating]= useState(null);

  useEffect(() => {
    Promise.all([getPlatformStats(), getActiveRides(), getFlaggedDrivers(), getRevenueByMethod()])
      .then(([s,r,f,rv]) => { setStats(s); setRides(r); setFlagged(f); setRevenue(rv); setLoad(false); });
  }, []);

  const handleSuspend = async (id) => {
    setUpdating(id);
    await updateDriverStatus(id, 'Suspended');
    setFlagged(p => p.map(d => d.id===id ? {...d, accountStatus:'Suspended'} : d));
    setUpdating(null);
  };

  if (loading) return <LoadingSpinner label="Loading Mission Control…"/>;

  return (
    <div className="page-scroll">
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>Mission Control</h1>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:3 }}>
            {new Date().toLocaleDateString('en-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:99, padding:'8px 16px' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', display:'inline-block' }}/>
          <span style={{ fontSize:12, color:'#16A34A', fontWeight:700 }}>Live · {stats.activeRides} Active</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:24 }}>
        <StatCard icon={DollarSign} label="Total Revenue"  value={`Rs.${(stats.totalRevenue/1000).toFixed(0)}K`}  color="green" trend={8}/>
        <StatCard icon={Activity}   label="Active Rides"   value={String(stats.activeRides)}                      color="blue"  trend={15}/>
        <StatCard icon={Users}      label="Drivers"        value={stats.registeredDrivers.toLocaleString()}        color="sky"/>
        <StatCard icon={Users}      label="Riders"         value={stats.registeredRiders.toLocaleString()}         color="amber" trend={22}/>
        <StatCard icon={DollarSign} label="Today Revenue"  value={`Rs.${(stats.todayRevenue/1000).toFixed(1)}K`}  color="green"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:16, marginBottom:16 }}>
        {/* Live rides table */}
        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
          <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>Live Rides</p>
            <StatusPill status="Active"/>
          </div>
          {rides.map((r, i) => (
            <div key={r.id} className="table-row" style={{ gridTemplateColumns:'auto 1fr auto auto', gap:12, fontSize:13 }}>
              <span style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)', background:'var(--bg-subtle)', borderRadius:6, padding:'2px 7px' }}>{r.id}</span>
              <div>
                <p style={{ fontWeight:600, color:'var(--text-primary)', fontSize:12 }}>{r.rider}</p>
                <p style={{ color:'var(--text-muted)', fontSize:11, marginTop:1 }}>{r.from} → {r.to}</p>
              </div>
              <span style={{ fontWeight:700, color:'var(--text-primary)', whiteSpace:'nowrap', fontSize:12 }}>Rs. {r.fare}</span>
              <StatusPill status={r.status}/>
            </div>
          ))}
        </div>

        {/* Revenue breakdown */}
        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'18px 20px', boxShadow:'var(--shadow-sm)' }}>
          <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', marginBottom:18 }}>Revenue by Payment</p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {revenue.map(({ method, pct, color }) => (
              <div key={method}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:'var(--text-secondary)' }}>{method}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{pct}%</span>
                </div>
                <div style={{ height:7, background:'var(--bg-subtle)', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:99, transition:'width 0.6s' }}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, padding:'14px 0', borderTop:'1px solid var(--border)' }}>
            <p style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Total (MTD)</p>
            <p style={{ fontSize:22, fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>Rs. {(stats.totalRevenue/1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>

      {/* Flagged drivers */}
      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
        <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <AlertTriangle size={16} color="#EF4444"/>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>Flagged Drivers</p>
          </div>
          <span style={{ background:'#FEF2F2', color:'#DC2626', borderRadius:99, padding:'3px 10px', fontSize:11, fontWeight:700 }}>{flagged.length} flagged</span>
        </div>
        {flagged.map(d => (
          <div key={d.id} className="table-row" style={{ gridTemplateColumns:'auto 1fr auto auto auto', gap:14 }}>
            <Avatar initials={d.name.slice(0,2)} size={34}/>
            <div>
              <p style={{ fontWeight:600, fontSize:13, color:'var(--text-primary)' }}>{d.name}</p>
              <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{d.issue} · {d.trips} trips</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:3 }}>
              <span style={{ fontSize:13, fontWeight:700, color:'#92400E' }}>★ {d.rating}</span>
            </div>
            <StatusPill status={d.accountStatus}/>
            {d.accountStatus !== 'Suspended' ? (
              <Button variant="danger" size="xs" onClick={() => handleSuspend(d.id)} loading={updating===d.id}>
                Suspend
              </Button>
            ) : (
              <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:500 }}>Suspended</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
