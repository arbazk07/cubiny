// src/pages/driver/DriverDashboard.jsx — Cubiny v6 Professional
import { useState, useEffect, useRef } from 'react';
import { Shield, DollarSign, TrendingUp, Car, Star, CheckCircle, XCircle, Radio } from 'lucide-react';
import { useAuth }         from '../../hooks/useAuth';
import { Avatar }          from '../../components/ui/Avatar';
import { StatCard }        from '../../components/ui/StatCard';
import { Button }          from '../../components/ui/Button';
import { StatusPill }      from '../../components/ui/StatusPill';
import { Modal }           from '../../components/ui/Modal';
import { MOCK_EARNINGS_CHART, MOCK_INCOMING_RIDE } from '../../data/mockData';
import { setDriverAvailability, acceptRide as svcAccept, declineRide as svcDecline } from '../../services/mockService';
import { electronNotify, electronDriver, IS_ELECTRON } from '../../hooks/useElectron';

export function DriverDashboard() {
  const { user }                 = useAuth();
  const [isOnline, setIsOnline]  = useState(false);
  const [showReq,  setShowReq]   = useState(false);
  const [activeRide,setActive]   = useState(null);
  const [countdown,setCd]        = useState(30);
  const [toggling, setToggling]  = useState(false);
  const trayCleanup = useRef(null);

  const maxEarning = Math.max(...MOCK_EARNINGS_CHART.map(e => e.amount));

  useEffect(() => { if (IS_ELECTRON) electronDriver.setStatus(isOnline); }, [isOnline]);
  useEffect(() => {
    if (!IS_ELECTRON) return;
    const c = electronDriver.onTrayToggle(handleToggle);
    trayCleanup.current = c;
    return () => { if(trayCleanup.current) trayCleanup.current(); };
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline) { setShowReq(false); return; }
    const t = setTimeout(() => {
      setShowReq(true);
      electronNotify.incomingRide?.({ rider:MOCK_INCOMING_RIDE.rider, fare:MOCK_INCOMING_RIDE.fare, from:MOCK_INCOMING_RIDE.from });
    }, 4000);
    return () => clearTimeout(t);
  }, [isOnline]);

  useEffect(() => {
    if (!showReq) { setCd(30); return; }
    if (countdown <= 0) { setShowReq(false); return; }
    const t = setInterval(() => setCd(p => p-1), 1000);
    return () => clearInterval(t);
  }, [showReq, countdown]);

  const handleToggle = async () => {
    setToggling(true);
    const next = !isOnline;
    await setDriverAvailability(next ? 'Online' : 'Offline');
    setIsOnline(next);
    if (!next) setShowReq(false);
    setToggling(false);
  };

  const handleAccept = async () => {
    await svcAccept(MOCK_INCOMING_RIDE.id);
    setActive(MOCK_INCOMING_RIDE); setShowReq(false);
  };
  const handleDecline = async () => {
    await svcDecline(MOCK_INCOMING_RIDE.id); setShowReq(false);
  };
  const handleComplete = () => setActive(null);

  return (
    <div className="page-scroll">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>
            Driver Dashboard
          </h1>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:3 }}>
            {new Date().toLocaleDateString('en-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <StatusPill status={isOnline?'Online':'Offline'}/>
          <Button
            variant={isOnline ? 'danger' : 'primary'} size="md"
            onClick={handleToggle} loading={toggling}
          >
            <Radio size={14}/> {isOnline ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </div>

      {/* Online banner */}
      {isOnline && !activeRide && (
        <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'var(--r-xl)', padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:'#22C55E', boxShadow:'0 0 0 4px rgba(34,197,94,0.2)', animation:'pulse-ring 2s ease-out infinite', flexShrink:0 }}/>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:'#16A34A' }}>You're Online — Waiting for Ride Requests</p>
            <p style={{ fontSize:12, color:'#15803D' }}>A ride request will appear in ~4 seconds (demo)</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:24 }}>
        <StatCard icon={DollarSign} label="Total Earnings" value={`Rs.${(user?.earnings??84500)/1000|0}K`} color="green" trend={12} sub="this month"/>
        <StatCard icon={TrendingUp} label="This Week"      value={`Rs.${(user?.weeklyEarnings??6200)/1000|0}K`} color="blue"  trend={8}/>
        <StatCard icon={Star}       label="Rating"         value={String(user?.rating??4.9)}                    color="amber"/>
        <StatCard icon={Car}        label="Total Trips"    value={(user?.totalTrips??312).toLocaleString()}     color="sky"   trend={3} sub="trips"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16 }}>
        {/* Earnings chart */}
        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'20px 24px', boxShadow:'var(--shadow-sm)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Weekly Earnings</p>
              <p style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em', marginTop:2 }}>
                Rs. {MOCK_EARNINGS_CHART.reduce((a,e)=>a+e.amount,0).toLocaleString()}
              </p>
            </div>
            <span style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:99, padding:'5px 12px', fontSize:12, fontWeight:700, color:'#16A34A' }}>+12% vs last week</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:110 }}>
            {MOCK_EARNINGS_CHART.map((e,i) => {
              const pct = (e.amount/maxEarning)*100;
              const isMax = e.amount === maxEarning;
              return (
                <div key={e.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ width:'100%', background: isMax?'#22C55E':'var(--bg-subtle)', borderRadius:'6px 6px 0 0', height:Math.max(Math.round(pct*1.1),4), transition:'height 0.4s', position:'relative', overflow:'visible' }}>
                    {isMax && <span style={{ position:'absolute', bottom:'calc(100%+4px)', left:'50%', transform:'translateX(-50%)', fontSize:9, fontWeight:700, color:'#16A34A', background:'#DCFCE7', borderRadius:4, padding:'1px 4px', whiteSpace:'nowrap' }}>Peak</span>}
                  </div>
                  <span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:500 }}>{e.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status + vehicle */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'20px', boxShadow:'var(--shadow-sm)', flex:1 }}>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:16 }}>Profile</p>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <Avatar initials={user?.avatar??'?'} size={44} status={isOnline?'online':'offline'}/>
              <div>
                <p style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>{user?.name}</p>
                <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{user?.email}</p>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { label:'Vehicle',   value:`${user?.vehicle?.make??'Toyota'} ${user?.vehicle?.model??'Corolla'}` },
                { label:'Plate',     value:user?.vehicle?.plate??'LEJ-3421' },
                { label:'License',   value:user?.licenseNo??'LHR-2021-4892' },
                { label:'Status',    value:user?.verified?'Verified':'Pending', green:user?.verified },
              ].map(({ label, value, green }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500 }}>{label}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:green?'#16A34A':'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active ride */}
      {activeRide && (
        <div style={{ marginTop:16, background:'#EFF6FF', border:'1.5px solid #BFDBFE', borderRadius:'var(--r-xl)', padding:'20px', boxShadow:'var(--shadow-sm)' }} className="anim-fade-up">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <p style={{ fontWeight:800, fontSize:16, color:'#1D4ED8', letterSpacing:'-0.02em' }}>Active Ride</p>
            <StatusPill status="In Progress"/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, fontSize:13, marginBottom:16 }}>
            <div><p style={{ color:'var(--text-muted)', fontSize:11, marginBottom:2 }}>FROM</p><p style={{ fontWeight:600, color:'var(--text-primary)' }}>{activeRide.from}</p></div>
            <div><p style={{ color:'var(--text-muted)', fontSize:11, marginBottom:2 }}>TO</p><p style={{ fontWeight:600, color:'var(--text-primary)' }}>{activeRide.to}</p></div>
            <div><p style={{ color:'var(--text-muted)', fontSize:11, marginBottom:2 }}>RIDER</p><p style={{ fontWeight:600, color:'var(--text-primary)' }}>{activeRide.rider}</p></div>
            <div><p style={{ color:'var(--text-muted)', fontSize:11, marginBottom:2 }}>FARE</p><p style={{ fontWeight:800, color:'#1D4ED8', fontSize:16 }}>Rs. {activeRide.fare}</p></div>
          </div>
          <Button variant="primary" onClick={handleComplete} fullWidth>Mark as Completed</Button>
        </div>
      )}

      {/* Incoming ride modal */}
      <Modal open={showReq} onClose={()=>setShowReq(false)} title="Incoming Ride Request!" subtitle="Respond before the timer runs out">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}>
            <div style={{ background: countdown<=10?'#FEE2E2':'var(--green-lt)', borderRadius:'50%', width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center', border:`3px solid ${countdown<=10?'#EF4444':'#22C55E'}` }}>
              <span style={{ fontSize:22, fontWeight:900, color:countdown<=10?'#DC2626':'#16A34A' }}>{countdown}</span>
            </div>
          </div>
          <div style={{ background:'var(--bg-subtle)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:16 }}>
            {[
              { label:'Rider',     value:MOCK_INCOMING_RIDE.rider },
              { label:'From',      value:MOCK_INCOMING_RIDE.from  },
              { label:'To',        value:MOCK_INCOMING_RIDE.to    },
              { label:'Distance',  value:`${MOCK_INCOMING_RIDE.distanceKm} km` },
              { label:'Your Earn', value:`Rs. ${MOCK_INCOMING_RIDE.fare}`, highlight:true },
            ].map(({ label, value, highlight }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500 }}>{label}</span>
                <span style={{ fontSize:13, fontWeight: highlight?800:600, color:highlight?'#16A34A':'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Button variant="danger"   fullWidth onClick={handleDecline}><XCircle    size={14}/> Decline</Button>
            <Button variant="primary"  fullWidth onClick={handleAccept}><CheckCircle size={14}/> Accept</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
