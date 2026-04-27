// src/pages/driver/EarningsPage.jsx  —  Cubiny v2
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Car, Award, Wallet, CheckCircle } from "lucide-react";
import { StatCard }        from "../../components/ui/StatCard";
import { Button }          from "../../components/ui/Button";
import { LoadingSpinner }  from "../../components/ui/LoadingSpinner";
import { useAuth }         from "../../hooks/useAuth";
import { getWeeklyEarnings, requestPayout } from "../../services/mockService";

export function EarningsPage() {
  const { user }                    = useAuth();
  const [chart,    setChart]        = useState([]);
  const [loading,  setLoad]         = useState(true);
  const [paying,   setPaying]       = useState(false);
  const [paid,     setPaid]         = useState(false);

  useEffect(()=>{ getWeeklyEarnings(user?.id).then(d=>{ setChart(d); setLoad(false); }); },[user]);

  const handlePayout = async () => {
    setPaying(true);
    await requestPayout(user?.id);
    setPaying(false); setPaid(true);
    setTimeout(()=>setPaid(false), 3000);
  };

  if (loading) return <LoadingSpinner label="Loading earnings…"/>;

  const max     = Math.max(...chart.map(e=>e.amount));
  const total   = chart.reduce((s,e)=>s+e.amount,0);
  const average = Math.round(total/chart.length);
  const best    = chart.reduce((b,e)=>e.amount>b.amount?e:b, chart[0]);

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh", display:"flex", flexDirection:"column", gap:22 }}>
      <div>
        <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:"-0.02em" }}>Earnings</h2>
        <p style={{ fontSize:12, color:"var(--t3)", marginTop:3 }}>Apr 14 – Apr 20, 2026</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
        <StatCard icon={DollarSign} label="This Week"  value={`Rs. ${user?.weeklyEarnings?.toLocaleString()}`} color="green" trend={12}/>
        <StatCard icon={TrendingUp} label="All Time"   value={`Rs. ${user?.earnings?.toLocaleString()}`}       color="violet"/>
        <StatCard icon={Car}        label="Trips"      value={String(user?.totalTrips)}                        color="cyan"/>
        <StatCard icon={Award}      label="Commission" value="15%" sub="Platform fee"                          color="amber"/>
      </div>

      {/* Chart */}
      <div className="glass-sm" style={{ padding:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
          <div>
            <h3 style={{ fontFamily:"var(--font-d)", fontSize:16, marginBottom:4 }}>Weekly Breakdown</h3>
            <div style={{ display:"flex", gap:16, fontSize:12, color:"var(--t3)" }}>
              <span>Avg: <strong style={{ color:"var(--t2)" }}>Rs. {average.toLocaleString()}/day</strong></span>
              <span>Best: <strong style={{ color:"var(--v3)" }}>{best?.day}</strong></span>
            </div>
          </div>
          <span style={{ fontSize:20, fontWeight:800, fontFamily:"var(--font-d)", color:"var(--grn)" }}>Rs. {total.toLocaleString()}</span>
        </div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
          {chart.map((e,i)=>(
            <div key={e.day} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <div style={{ fontSize:9, color:"var(--t4)", fontFamily:"var(--font-m)" }}>{e.amount}</div>
              <div style={{
                width:"100%", borderRadius:"5px 5px 0 0",
                height:`${(e.amount/max)*92}px`,
                background: i===4
                  ? "linear-gradient(180deg,var(--v2),var(--v))"
                  : `rgba(109,40,217,${0.12+(i*0.04)})`,
                boxShadow: i===4 ? "var(--sh-v)" : "none",
                transition:"height 1s cubic-bezier(0.4,0,0.2,1)",
                transitionDelay:`${i*0.07}s`,
              }}/>
              <div style={{ fontSize:10, color: i===4?"var(--v3)":"var(--t4)", fontWeight: i===4?700:400 }}>{e.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout section */}
      <div className="glass-sm" style={{ padding:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <h3 style={{ fontFamily:"var(--font-d)", fontSize:16, marginBottom:3 }}>Ready to Withdraw</h3>
            <p style={{ fontSize:12, color:"var(--t3)" }}>Payouts process within 2–3 business days</p>
          </div>
          <div style={{ fontSize:22, fontWeight:800, fontFamily:"var(--font-d)", color:"var(--grn)" }}>
            Rs. {user?.weeklyEarnings?.toLocaleString()}
          </div>
        </div>
        {paid ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:"var(--r2)" }}>
            <CheckCircle size={18} color="var(--grn)"/>
            <span style={{ fontSize:13, color:"#4ade80", fontWeight:600 }}>Payout request submitted successfully!</span>
          </div>
        ):(
          <Button variant="cyan" fullWidth loading={paying} onClick={handlePayout}>
            <Wallet size={15}/> Request Payout
          </Button>
        )}
      </div>
    </div>
  );
}
