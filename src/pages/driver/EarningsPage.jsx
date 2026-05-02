// src/pages/driver/EarningsPage.jsx — Cubiny v6
import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Banknote } from 'lucide-react';
import { StatCard }       from '../../components/ui/StatCard';
import { Button }         from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth }        from '../../hooks/useAuth';
import { getWeeklyEarnings, requestPayout } from '../../services/mockService';

export function EarningsPage() {
  const { user }                  = useAuth();
  const [chart,   setChart]       = useState([]);
  const [loading, setLoad]        = useState(true);
  const [payout,  setPayout]      = useState(false);
  const [payDone, setPayDone]     = useState(false);

  useEffect(() => { getWeeklyEarnings().then(c => { setChart(c); setLoad(false); }); }, []);

  const total   = chart.reduce((a,e)=>a+e.amount,0);
  const maxEarn = Math.max(...chart.map(e=>e.amount), 1);
  const dailyAvg = chart.length ? Math.round(total/chart.length) : 0;

  const handlePayout = async () => {
    setPayout(true);
    await requestPayout();
    setPayout(false); setPayDone(true);
    setTimeout(()=>setPayDone(false), 4000);
  };

  if (loading) return <LoadingSpinner label="Loading earnings…"/>;

  return (
    <div className="page-scroll">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>Earnings</h1>
        <Button variant={payDone?'success':'primary'} size="sm" onClick={handlePayout} loading={payout} disabled={payDone}>
          <Banknote size={14}/> {payDone ? 'Payout Requested!' : 'Request Payout'}
        </Button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:24 }}>
        <StatCard icon={DollarSign} label="This Week"    value={`Rs.${total.toLocaleString()}`}       color="green" trend={12}/>
        <StatCard icon={TrendingUp} label="Daily Avg."   value={`Rs.${dailyAvg.toLocaleString()}`}    color="blue"/>
        <StatCard icon={DollarSign} label="Total (MTD)"  value={`Rs.${(user?.earnings??84500).toLocaleString()}`} color="amber" trend={8}/>
      </div>

      {/* Bar chart */}
      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'22px 24px', boxShadow:'var(--shadow-sm)' }}>
        <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', marginBottom:20 }}>Weekly Breakdown</p>
        <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:140 }}>
          {chart.map((e,i) => {
            const barH = Math.max(Math.round((e.amount/maxEarn)*120), 8);
            const isMax = e.amount === maxEarn;
            return (
              <div key={e.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, height:'100%', justifyContent:'flex-end' }}>
                <span style={{ fontSize:10, fontWeight:700, color:isMax?'#16A34A':'var(--text-muted)', marginBottom:2 }}>Rs.{(e.amount/1000).toFixed(1)}K</span>
                <div style={{
                  width:'100%', background:isMax?'#22C55E':'#DBEAFE',
                  borderRadius:'6px 6px 0 0',
                  height:barH,
                  transition:'height 0.4s',
                }}/>
                <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:500 }}>{e.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
