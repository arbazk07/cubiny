// src/pages/rider/RiderDashboard.jsx — Cubiny v6
//
// ── Design: Full-screen map background, floating white side panel
// ── All v5 bug fixes retained:
//    • useRef timeout tracking (no stale completions)
//    • Realistic lifecycle: 3s→6s→11s→19s
//    • Input validation before requestRide()
//    • Dynamic driver data from mockData
//    • clearAllTimeouts on unmount
// ── New: Professional ride stepper progress bar

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Navigation2, Car, Zap, Bike, Phone, MessageSquare,
  CheckCircle, Star, X, Clock, ChevronRight,
} from 'lucide-react';
import { LiveMap }       from '../../components/map/LiveMap';
import { Button }        from '../../components/ui/Button';
import { Modal }         from '../../components/ui/Modal';
import { Avatar }        from '../../components/ui/Avatar';
import { LoadingSpinner }from '../../components/ui/LoadingSpinner';
import { getAllFares }    from '../../services/fareService';
import { requestRide }   from '../../services/mockService';
import { electronNotify }from '../../hooks/useElectron';
import { useAuth }       from '../../hooks/useAuth';
import { MOCK_USERS, MOCK_INCOMING_RIDE } from '../../data/mockData';

const DRIVER    = MOCK_USERS.driver;
const RIDE_INFO = MOCK_INCOMING_RIDE;

const TYPES = [
  { id:'Economy', icon:Car,  label:'Economy', sub:'Affordable, everyday' },
  { id:'Premium', icon:Zap,  label:'Premium', sub:'Comfort sedan'        },
  { id:'Bike',    icon:Bike, label:'Bike',    sub:'Beat traffic'         },
];

// ── Stepper steps for ride lifecycle ──────────────────────────────────────
const STEPS = [
  { key:'searching',   label:'Searching',  short:'Search'  },
  { key:'found',       label:'Accepted',   short:'Accepted' },
  { key:'en_route',    label:'En Route',   short:'En Route' },
  { key:'in_progress', label:'In Progress',short:'Riding'  },
  { key:'completed',   label:'Arrived',    short:'Arrived' },
];
const STEP_INDEX = Object.fromEntries(STEPS.map((s,i)=>[s.key,i]));

function RideStepBar({ state }) {
  const cur = STEP_INDEX[state] ?? 0;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, margin:'16px 0 4px', position:'relative' }}>
      {STEPS.map((s, i) => {
        const done   = i < cur;
        const active = i === cur;
        const last   = i === STEPS.length-1;
        return (
          <div key={s.key} style={{ display:'flex', alignItems:'center', flex: last ? 0 : 1, position:'relative' }}>
            {/* Circle */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, zIndex:1 }}>
              <div style={{
                width:28, height:28, borderRadius:'50%', flexShrink:0,
                background: done ? '#22C55E' : active ? '#2563EB' : 'var(--bg-subtle)',
                border: `2px solid ${done ? '#22C55E' : active ? '#2563EB' : 'var(--border)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow: active ? '0 0 0 4px rgba(37,99,235,0.12)' : 'none',
                transition:'all 0.35s',
              }}>
                {done
                  ? <CheckCircle size={14} color="white" strokeWidth={2.5}/>
                  : <span style={{ width:8, height:8, borderRadius:'50%', background: active?'white':'var(--border)' }}/>
                }
              </div>
              <span style={{ fontSize:9.5, fontWeight: active?700:500, color: active?'#2563EB': done?'#16A34A':'var(--text-muted)', whiteSpace:'nowrap', letterSpacing:'0.02em' }}>
                {s.short}
              </span>
            </div>
            {/* Connector line */}
            {!last && (
              <div style={{ flex:1, height:2, background:'var(--border)', margin:'0 2px', position:'relative', top:-10, overflow:'hidden' }}>
                <div style={{
                  height:'100%',
                  width: done ? '100%' : active ? '50%' : '0%',
                  background:'#22C55E',
                  transition:'width 0.6s var(--ease)',
                  borderRadius:2,
                }}/>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Rating Modal ──────────────────────────────────────────────────────────
function RatingModal({ open, onClose, driver, fare }) {
  const [score, setScore]   = useState(0);
  const [hover, setHover]   = useState(0);
  const [note,  setNote]    = useState('');
  const [loading, setLoading]= useState(false);
  const [done, setDone]     = useState(false);

  const submit = async () => {
    if (!score) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false); setDone(true);
    setTimeout(onClose, 1400);
  };

  return (
    <Modal open={open} onClose={onClose} title="Rate your driver" subtitle={`How was your trip with ${driver.name}?`}>
      {done ? (
        <div style={{ textAlign:'center', padding:'24px 0' }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--green-lt)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <CheckCircle size={32} color="var(--green)"/>
          </div>
          <p style={{ fontSize:17, fontWeight:700, marginBottom:4 }}>Thanks for your feedback!</p>
          <p style={{ fontSize:13, color:'var(--text-muted)' }}>Ratings help keep Cubiny quality high.</p>
        </div>
      ) : (
        <>
          {/* Driver summary */}
          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0 18px', borderBottom:'1px solid var(--border)', marginBottom:20 }}>
            <Avatar initials={driver.avatar} size={50}/>
            <div>
              <p style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)' }}>{driver.name}</p>
              <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{driver.vehicle.make} {driver.vehicle.model} · {driver.vehicle.plate}</p>
              <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:4 }}>
                <Star size={11} color="#F59E0B" fill="#F59E0B"/>
                <span style={{ fontSize:11, color:'#92400E', fontWeight:600 }}>{driver.rating} overall</span>
              </div>
            </div>
            <div style={{ marginLeft:'auto', textAlign:'right' }}>
              <p style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Fare paid</p>
              <p style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Rs. {fare}</p>
            </div>
          </div>

          {/* Stars */}
          <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', marginBottom:12, textAlign:'center' }}>Tap to rate</p>
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:8 }}>
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" onClick={()=>setScore(s)}
                onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
                style={{ background:'none', border:'none', cursor:'pointer', transition:'transform 0.12s', transform:(hover||score)>=s?'scale(1.25)':'scale(1)', padding:2 }}>
                <Star size={36} color="#F59E0B" fill={(hover||score)>=s?'#F59E0B':'transparent'} strokeWidth={1.8}/>
              </button>
            ))}
          </div>
          {score > 0 && (
            <p style={{ textAlign:'center', fontSize:13, fontWeight:600, color:'#92400E', marginBottom:16 }}>
              {['','Poor','Below average','Good','Very good','Excellent! 🎉'][score]}
            </p>
          )}

          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Any comments? (optional)"
            style={{
              width:'100%', height:72, resize:'none', padding:'10px 12px',
              background:'var(--bg-subtle)', border:'1.5px solid var(--border)',
              borderRadius:'var(--r-lg)', fontSize:13, color:'var(--text-primary)',
              fontFamily:'var(--font)', marginBottom:16, outline:'none',
            }}/>

          <div style={{ display:'flex', gap:10 }}>
            <Button variant="secondary" fullWidth onClick={onClose}>Skip</Button>
            <Button variant="primary"   fullWidth onClick={submit} loading={loading} disabled={!score}>Submit</Button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ── Location Input ────────────────────────────────────────────────────────
function LocInput({ icon:Icon, color, placeholder, value, onChange, error }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', zIndex:1, pointerEvents:'none' }}>
        <Icon size={14} color={color} strokeWidth={2.2}/>
      </div>
      <input placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}
        style={{
          width:'100%', height:44, paddingLeft:36, paddingRight:14,
          fontSize:13, color:'var(--text-primary)',
          background: error ? '#FFF8F8' : 'var(--bg-subtle)',
          border:`1.5px solid ${error?'#EF4444':'var(--border)'}`,
          borderRadius:'var(--r-lg)', fontFamily:'var(--font)',
          outline:'none', transition:'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={e=>{ e.target.style.borderColor='#2563EB'; e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'; e.target.style.background='white'; }}
        onBlur={e=>{  e.target.style.borderColor=error?'#EF4444':'var(--border)'; e.target.style.boxShadow='none'; e.target.style.background=error?'#FFF8F8':'var(--bg-subtle)'; }}
      />
      {error && <p style={{ fontSize:11, color:'#DC2626', marginTop:3 }}>{error}</p>}
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────
export function RiderDashboard() {
  const { user } = useAuth();
  const [state,     setState]    = useState('idle');
  const [pickup,    setPickup]   = useState('');
  const [dropoff,   setDropoff]  = useState('');
  const [pickErr,   setPickErr]  = useState('');
  const [dropErr,   setDropErr]  = useState('');
  const [selType,   setSelType]  = useState('Economy');
  const [fares,     setFares]    = useState([]);
  const [submitting,setSub]      = useState(false);
  const [rideId,    setRideId]   = useState(null);
  const [showRate,  setShowRate] = useState(false);

  // Bug fix: tracked timeouts
  const tRef = useRef([]);
  const clearAll = useCallback(() => { tRef.current.forEach(clearTimeout); tRef.current = []; }, []);
  useEffect(() => () => clearAll(), [clearAll]);

  useEffect(() => { setFares(getAllFares(RIDE_INFO.distanceKm, 18)); }, []);

  const activeFare = fares.find(f => f.id === selType);

  const handleRequest = async () => {
    let hasErr = false;
    if (!pickup.trim())  { setPickErr('Pickup location required');  hasErr = true; }
    if (!dropoff.trim()) { setDropErr('Drop-off location required'); hasErr = true; }
    if (hasErr) return;

    clearAll();
    setSub(true);
    const res = await requestRide({ pickup_location:pickup, dropoff_location:dropoff, vehicle_type:selType });
    setRideId(res?.id ?? `RD-${8800+Math.floor(Math.random()*100)}`);
    setSub(false);
    setState('searching');

    // Realistic lifecycle — bug fix: all IDs tracked
    tRef.current = [
      setTimeout(() => setState('found'),        3000),
      setTimeout(() => setState('en_route'),     6000),
      setTimeout(() => setState('in_progress'), 11000),
      setTimeout(() => {
        setState('completed');
        setShowRate(true);
        electronNotify.rideCompleted?.({ fare: activeFare?.finalFare ?? 0 });
      }, 19000),
    ];
  };

  const resetRide = () => {
    clearAll();
    setState('idle'); setPickup(''); setDropoff('');
    setPickErr(''); setDropErr(''); setRideId(null);
  };

  const isIdle      = state === 'idle';
  const isCompleted = state === 'completed';
  const showRoute   = ['en_route','in_progress','completed'].includes(state);
  const showDrivers = ['found','en_route','in_progress','completed'].includes(state);

  const STATUS_LABEL = {
    idle:'',
    searching:'Finding your driver…',
    found:'Driver confirmed!',
    en_route:'Driver is on the way',
    in_progress:'Enjoy your ride',
    completed:"You've arrived safely!",
  };
  const STATUS_COLOR = {
    searching:'#F59E0B', found:'#22C55E', en_route:'#2563EB', in_progress:'#2563EB', completed:'#22C55E',
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden' }}>

      {/* ── FULL-SCREEN MAP ── */}
      <div style={{ position:'absolute', inset:0 }}>
        <LiveMap showRoute={showRoute} showRider showDriver={showDrivers}/>
      </div>

      {/* ── TOP STATUS BADGE ── */}
      {!isIdle && (
        <div style={{
          position:'absolute', top:16, left:'50%', transform:'translateX(-50%)',
          background:'white', border:'1px solid var(--border)',
          borderRadius:99, padding:'8px 20px',
          display:'flex', alignItems:'center', gap:9,
          boxShadow:'var(--shadow-lg)', zIndex:10, whiteSpace:'nowrap',
        }} className="anim-fade-up">
          <span style={{ width:8, height:8, borderRadius:'50%', background:STATUS_COLOR[state]??'#94A3B8',
            boxShadow:`0 0 0 3px ${STATUS_COLOR[state]??'#94A3B8'}22` }}/>
          <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{STATUS_LABEL[state]}</span>
          {rideId && <span style={{ fontSize:10, color:'var(--text-muted)', background:'var(--bg-subtle)', borderRadius:6, padding:'2px 8px', fontFamily:'monospace' }}>{rideId}</span>}
        </div>
      )}

      {/* ── FLOATING SIDE PANEL ── */}
      <div style={{
        position:'absolute', top:0, right:0, bottom:0,
        width:340, display:'flex', flexDirection:'column',
        padding:16, gap:12, zIndex:10, pointerEvents:'none',
      }}>

        {/* User greeting card */}
        <div style={{
          background:'var(--overlay-sm)', backdropFilter:'blur(20px) saturate(180%)',
          border:'1px solid rgba(255,255,255,0.9)',
          borderRadius:'var(--r-xl)', padding:'14px 16px',
          display:'flex', alignItems:'center', gap:12,
          boxShadow:'var(--shadow-lg)', pointerEvents:'auto',
        }}>
          <Avatar initials={user?.avatar ?? '?'} size={36} status="online"/>
          <div style={{ flex:1, overflow:'hidden' }}>
            <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              Hello, {user?.name?.split(' ')[0] ?? 'Rider'} 👋
            </p>
            <p style={{ fontSize:11, color:'var(--text-muted)' }}>Where are you heading today?</p>
          </div>
          <div style={{ background:'var(--green-lt)', borderRadius:'var(--r-md)', padding:'4px 10px' }}>
            <span style={{ fontSize:11, fontWeight:700, color:'var(--green-dk)' }}>Rs. {user?.wallet?.toLocaleString()??'4,750'}</span>
          </div>
        </div>

        {/* ── IDLE: Booking form ── */}
        {isIdle && (
          <div style={{
            background:'var(--overlay-sm)', backdropFilter:'blur(20px) saturate(180%)',
            border:'1px solid rgba(255,255,255,0.9)',
            borderRadius:'var(--r-xl)', padding:'18px',
            boxShadow:'var(--shadow-xl)', pointerEvents:'auto',
            display:'flex', flexDirection:'column', gap:12,
          }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.02em', marginBottom:2 }}>Book a Ride</h3>

            {/* Location inputs */}
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {/* Connector dots */}
              <div style={{ position:'relative' }}>
                <LocInput icon={MapPin} color="#22C55E" placeholder="Pickup location" value={pickup}
                  onChange={v=>{setPickup(v); if(pickErr)setPickErr('');}} error={pickErr}/>
              </div>
              <div style={{ display:'flex', justifyContent:'center' }}>
                <div style={{ width:1, height:10, background:'var(--border)' }}/>
              </div>
              <LocInput icon={MapPin} color="#2563EB" placeholder="Drop-off destination" value={dropoff}
                onChange={v=>{setDropoff(v); if(dropErr)setDropErr('');}} error={dropErr}/>
            </div>

            {/* Vehicle type */}
            {fares.length > 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Select type</p>
                {TYPES.map(t => {
                  const f   = fares.find(x => x.id === t.id);
                  const sel = selType === t.id;
                  return (
                    <button key={t.id} onClick={()=>setSelType(t.id)} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'11px 14px', borderRadius:'var(--r-lg)',
                      background: sel ? '#EFF6FF' : 'var(--bg-subtle)',
                      border:`1.5px solid ${sel?'#2563EB':'var(--border)'}`,
                      cursor:'pointer', transition:'all 0.15s', fontFamily:'var(--font)',
                    }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:'var(--r-md)', background: sel?'#DBEAFE':'white', border:`1px solid ${sel?'#BFDBFE':'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <t.icon size={15} color={sel?'#2563EB':'#64748B'} strokeWidth={1.8}/>
                        </div>
                        <div style={{ textAlign:'left' }}>
                          <p style={{ fontSize:13, fontWeight: sel?700:500, color: sel?'#1D4ED8':'var(--text-primary)', marginBottom:1 }}>{t.label}</p>
                          <p style={{ fontSize:11, color:'var(--text-muted)' }}>{t.sub} · {f?.eta}</p>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <p style={{ fontSize:15, fontWeight:800, color: sel?'#1D4ED8':'var(--text-primary)', letterSpacing:'-0.02em' }}>Rs.{f?.finalFare}</p>
                        {f?.surgeApplied && <span style={{ fontSize:10, color:'#92400E', background:'#FEF3C7', borderRadius:4, padding:'1px 5px', display:'block', marginTop:2 }}>⚡×{f.multiplier}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fare summary row */}
            {activeFare && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--green-lt)', border:'1px solid var(--green-mid)', borderRadius:'var(--r-lg)', padding:'12px 14px' }}>
                <div>
                  <p style={{ fontSize:10, fontWeight:700, color:'var(--green-dk)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Total Fare</p>
                  <p style={{ fontSize:22, fontWeight:900, color:'var(--green-dk)', letterSpacing:'-0.03em' }}>Rs. {activeFare.finalFare}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:11, color:'var(--green-dk)' }}>{RIDE_INFO.distanceKm} km</p>
                  <p style={{ fontSize:11, color:'var(--green-dk)' }}>~{activeFare.eta}</p>
                </div>
              </div>
            )}

            <Button variant="primary" fullWidth size="lg" onClick={handleRequest} loading={submitting}>
              <Navigation2 size={15}/> Confirm Ride
            </Button>
          </div>
        )}

        {/* ── SEARCHING ── */}
        {state === 'searching' && (
          <div style={{
            background:'var(--overlay-sm)', backdropFilter:'blur(20px) saturate(180%)',
            border:'1px solid rgba(255,255,255,0.9)',
            borderRadius:'var(--r-xl)', padding:'24px 18px',
            boxShadow:'var(--shadow-xl)', pointerEvents:'auto',
            textAlign:'center',
          }} className="anim-fade-up">
            <LoadingSpinner label="Finding a driver near you…" color="var(--green)"/>
          </div>
        )}

        {/* ── ACTIVE RIDE CARD ── */}
        {!isIdle && state !== 'searching' && !isCompleted && (
          <div style={{
            background:'var(--overlay-sm)', backdropFilter:'blur(20px) saturate(180%)',
            border:'1px solid rgba(255,255,255,0.9)',
            borderRadius:'var(--r-xl)', padding:'18px',
            boxShadow:'var(--shadow-xl)', pointerEvents:'auto',
            display:'flex', flexDirection:'column', gap:14,
          }} className="anim-fade-up">

            {/* Stepper */}
            <RideStepBar state={state}/>
            <div style={{ height:1, background:'var(--border)' }}/>

            {/* Driver info */}
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Avatar initials={DRIVER.avatar} size={46} status="online"/>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>{DRIVER.name}</p>
                <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{DRIVER.vehicle.make} {DRIVER.vehicle.model} · <span style={{ fontFamily:'monospace', letterSpacing:'0.04em' }}>{DRIVER.vehicle.plate}</span></p>
                <div style={{ display:'flex', alignItems:'center', gap:3, marginTop:3 }}>
                  <Star size={10} color="#F59E0B" fill="#F59E0B"/>
                  <span style={{ fontSize:11, fontWeight:600, color:'#92400E' }}>{DRIVER.rating}</span>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>· {DRIVER.totalTrips} trips</span>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Fare</p>
                <p style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Rs.{activeFare?.finalFare}</p>
              </div>
            </div>

            <div style={{ display:'flex', gap:8 }}>
              <Button variant="secondary" size="sm" style={{ flex:1 }}><Phone size={13}/> Call</Button>
              <Button variant="secondary" size="sm" style={{ flex:1 }}><MessageSquare size={13}/> Chat</Button>
            </div>
          </div>
        )}

        {/* ── COMPLETED ── */}
        {isCompleted && (
          <div style={{
            background:'var(--overlay-sm)', backdropFilter:'blur(20px) saturate(180%)',
            border:'1px solid rgba(255,255,255,0.9)',
            borderRadius:'var(--r-xl)', padding:'24px 18px',
            boxShadow:'var(--shadow-xl)', pointerEvents:'auto',
            textAlign:'center',
          }} className="anim-fade-up">
            <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--green-lt)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <CheckCircle size={30} color="var(--green)" strokeWidth={2}/>
            </div>
            <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', marginBottom:4, letterSpacing:'-0.02em' }}>You've arrived! 🎉</h3>
            <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:6 }}>Rs. {activeFare?.finalFare} charged to your wallet</p>
            <p style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'monospace', marginBottom:20 }}>{rideId}</p>
            <Button variant="primary" fullWidth onClick={resetRide}>Book Another Ride</Button>
          </div>
        )}

      </div>
    </div>
  );
}
