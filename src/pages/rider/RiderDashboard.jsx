// src/pages/rider/RiderDashboard.jsx — Cubiny v7 "Command Center"
// Weight: 420px docked panel, full-screen map backdrop
// All v5 bug fixes retained (useRef timeouts, validation, lifecycle)
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Navigation2, Car, Zap, Bike,
  Phone, MessageSquare, CheckCircle, Star,
  ChevronRight, Clock, Shield, User,
} from 'lucide-react';
import { LiveMap }        from '../../components/map/LiveMap';
import { Button }         from '../../components/ui/Button';
import { Avatar }         from '../../components/ui/Avatar';
import { Modal }          from '../../components/ui/Modal';
import { getAllFares }     from '../../services/fareService';
import { requestRide }    from '../../services/mockService';
import { electronNotify } from '../../hooks/useElectron';
import { useAuth }        from '../../hooks/useAuth';
import { MOCK_USERS, MOCK_INCOMING_RIDE } from '../../data/mockData';

const DRIVER    = MOCK_USERS.driver;
const RIDE_INFO = MOCK_INCOMING_RIDE;

/* ─── Vehicle type definitions ─────────────────────────────────────────── */
const TYPES = [
  {
    id:'Economy', Icon:Car,
    label:'Economy',
    tagline:'Affordable everyday rides',
    emoji:'🚗',
    color:'#2563EB', bg:'#EFF6FF', border:'#BFDBFE',
  },
  {
    id:'Premium', Icon:Zap,
    label:'Premium',
    tagline:'Comfort sedan · Extra legroom',
    emoji:'🚙',
    color:'#7C3AED', bg:'#F5F3FF', border:'#DDD6FE',
  },
  {
    id:'Bike', Icon:Bike,
    label:'Bike',
    tagline:'Beat traffic · Fastest option',
    emoji:'🏍️',
    color:'#059669', bg:'#ECFDF5', border:'#A7F3D0',
  },
];

/* ─── Ride lifecycle steps ──────────────────────────────────────────────── */
const STEPS = [
  { key:'searching',   label:'Finding Driver' },
  { key:'found',       label:'Confirmed'      },
  { key:'en_route',    label:'En Route'       },
  { key:'in_progress', label:'In Progress'    },
  { key:'completed',   label:'Arrived'        },
];
const STEP_IDX = Object.fromEntries(STEPS.map((s,i)=>[s.key,i]));

/* ─── Progress stepper ──────────────────────────────────────────────────── */
function RideStepper({ state }) {
  const cur = STEP_IDX[state] ?? 0;
  return (
    <div style={{ padding:'18px 24px 14px' }}>
      <div style={{ display:'flex', alignItems:'center' }}>
        {STEPS.map((s, i) => {
          const done   = i < cur;
          const active = i === cur;
          const last   = i === STEPS.length - 1;
          return (
            <div key={s.key} style={{ display:'flex', alignItems:'center', flex: last ? 0 : 1 }}>
              {/* Circle node */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, zIndex:1 }}>
                <div style={{
                  width:32, height:32, borderRadius:'50%', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background: done ? '#22C55E' : active ? '#2563EB' : 'var(--bg-subtle)',
                  border:`2px solid ${done ? '#22C55E' : active ? '#2563EB' : 'var(--border-md)'}`,
                  boxShadow: active ? '0 0 0 5px rgba(37,99,235,0.12)' : 'none',
                  transition:'all 0.4s var(--ease)',
                }}>
                  {done
                    ? <CheckCircle size={14} color="white" strokeWidth={2.5}/>
                    : active
                      ? <span style={{ width:8, height:8, borderRadius:'50%', background:'white', display:'block' }}/>
                      : <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--border-md)', display:'block' }}/>
                  }
                </div>
                <span style={{
                  fontSize:9, fontWeight: active ? 700 : 500,
                  color: active ? '#2563EB' : done ? '#16A34A' : 'var(--txt-4)',
                  whiteSpace:'nowrap', letterSpacing:'0.01em',
                }}>
                  {s.label}
                </span>
              </div>
              {/* Connector */}
              {!last && (
                <div style={{ flex:1, height:2, background:'var(--border)', margin:'0 3px', position:'relative', top:-10, overflow:'hidden', borderRadius:2 }}>
                  <div style={{
                    height:'100%', borderRadius:2, background:'#22C55E',
                    width: done ? '100%' : active ? '50%' : '0%',
                    transition:'width 0.7s var(--ease)',
                  }}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Vehicle card (Yango-style large tappable cards) ───────────────────── */
function VehicleCard({ type, fare, selected, onSelect }) {
  const { id, Icon, label, tagline, emoji, color, bg, border } = type;
  const sel = selected === id;
  return (
    <button
      onClick={() => onSelect(id)}
      style={{
        width:'100%', display:'flex', alignItems:'center', gap:14,
        padding:'14px 16px', borderRadius:'var(--r-lg)',
        background:  sel ? bg : 'var(--bg-white)',
        border:      `2px solid ${sel ? border : 'var(--border)'}`,
        cursor:'pointer', fontFamily:'var(--font)',
        transition:'all 0.18s var(--ease)',
        boxShadow:   sel ? `0 0 0 1px ${border}` : 'none',
        transform:   sel ? 'scale(1.01)' : 'scale(1)',
        textAlign:'left',
      }}
    >
      {/* Emoji + icon block */}
      <div style={{
        width:52, height:52, borderRadius:'var(--r-md)', flexShrink:0,
        background: sel ? bg : 'var(--bg-subtle)',
        border:`1.5px solid ${sel ? border : 'var(--border)'}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:22, transition:'all 0.18s',
      }}>
        {emoji}
      </div>

      {/* Labels */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
          <p style={{ fontSize:15, fontWeight:700, color: sel ? color : 'var(--txt-1)', letterSpacing:'-0.02em' }}>
            {label}
          </p>
          {fare?.surgeApplied && (
            <span style={{ fontSize:10, fontWeight:700, color:'#92400E', background:'#FEF3C7', borderRadius:99, padding:'2px 7px' }}>
              ⚡ Surge
            </span>
          )}
        </div>
        <p style={{ fontSize:12, color:'var(--txt-3)' }}>{tagline}</p>
        <p style={{ fontSize:11, color:'var(--txt-4)', marginTop:2 }}>
          ETA {fare?.eta ?? '~12 min'}
        </p>
      </div>

      {/* Price */}
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <p style={{
          fontSize:18, fontWeight:800, letterSpacing:'-0.03em',
          color: sel ? color : 'var(--txt-1)',
        }}>
          Rs.{fare?.finalFare ?? '—'}
        </p>
        {fare?.surgeApplied && (
          <p style={{ fontSize:10, color:'var(--txt-4)', textDecoration:'line-through' }}>
            Rs.{fare?.baseFare}
          </p>
        )}
      </div>

      {/* Selection indicator */}
      {sel && (
        <div style={{
          width:20, height:20, borderRadius:'50%', flexShrink:0,
          background:color, display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 2px 6px ${color}66`,
        }}>
          <CheckCircle size={12} color="white" strokeWidth={2.5}/>
        </div>
      )}
    </button>
  );
}

/* ─── Location input row ────────────────────────────────────────────────── */
function LocationInputs({ pickup, dropoff, onPickup, onDropoff, pickErr, dropErr }) {
  return (
    <div style={{ background:'var(--bg-white)', border:'1.5px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden', boxShadow:'var(--sh-sm)' }}>
      {/* Pickup */}
      <div style={{ display:'flex', alignItems:'center', padding:'0 16px', borderBottom:'1px solid var(--border)' }}>
        <span style={{ width:10, height:10, borderRadius:'50%', background:'#22C55E', flexShrink:0, boxShadow:'0 0 0 3px rgba(34,197,94,0.2)' }}/>
        <input
          value={pickup} onChange={e=>{onPickup(e.target.value);}}
          placeholder="Pickup location"
          style={{
            flex:1, height:50, padding:'0 12px',
            fontSize:14, fontWeight:500, color:'var(--txt-1)',
            border:'none', background:'transparent',
            fontFamily:'var(--font)',
          }}
        />
        {pickErr && <span style={{ fontSize:11, color:'var(--red)', flexShrink:0 }}>Required</span>}
      </div>
      {/* Divider dots */}
      <div style={{ paddingLeft:19, display:'flex', flexDirection:'column', gap:2, position:'relative', height:12, background:'var(--bg-subtle)' }}>
        {[0,1,2].map(i=><span key={i} style={{ width:2, height:2, borderRadius:'50%', background:'var(--border-md)', position:'absolute', left:19, top: i*4+2 }}/>)}
      </div>
      {/* Drop-off */}
      <div style={{ display:'flex', alignItems:'center', padding:'0 16px' }}>
        <MapPin size={10} color="#2563EB" strokeWidth={2.5} style={{ flexShrink:0 }}/>
        <input
          value={dropoff} onChange={e=>{onDropoff(e.target.value);}}
          placeholder="Drop-off destination"
          style={{
            flex:1, height:50, padding:'0 12px',
            fontSize:14, fontWeight:500, color:'var(--txt-1)',
            border:'none', background:'transparent',
            fontFamily:'var(--font)',
          }}
        />
        {dropErr && <span style={{ fontSize:11, color:'var(--red)', flexShrink:0 }}>Required</span>}
      </div>
    </div>
  );
}

/* ─── Driver detail card (En Route / In Progress expanded state) ─────────── */
function DriverCard({ driver, state, fareAmt, rideId }) {
  const stateLabel = { found:'Driver confirmed', en_route:'On the way to you', in_progress:'You\'re on the move' }[state] ?? '';
  const stateColor = { found:'#22C55E', en_route:'#2563EB', in_progress:'#7C3AED' }[state] ?? '#22C55E';

  return (
    <div style={{ padding:'0 20px 20px' }}>
      {/* Status badge */}
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background: `${stateColor}12`, border:`1px solid ${stateColor}30`,
        borderRadius:'var(--r-sm)', padding:'8px 12px', marginBottom:16,
      }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:stateColor, animation:'pulse-dot 1.5s ease infinite', flexShrink:0 }}/>
        <span style={{ fontSize:13, fontWeight:600, color:stateColor }}>{stateLabel}</span>
        {rideId && (
          <span style={{ marginLeft:'auto', fontSize:10, color:'var(--txt-4)', fontFamily:'monospace', background:'var(--bg-subtle)', borderRadius:5, padding:'2px 6px' }}>{rideId}</span>
        )}
      </div>

      {/* Driver info — large prominent layout */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16, padding:'14px 16px', background:'var(--bg-subtle)', borderRadius:'var(--r-lg)', border:'1px solid var(--border)' }}>
        <Avatar initials={driver.avatar} size={54} status="online"/>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:17, fontWeight:800, color:'var(--txt-1)', letterSpacing:'-0.025em' }}>{driver.name}</p>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:3 }}>
            <Star size={12} color="#F59E0B" fill="#F59E0B"/>
            <span style={{ fontSize:13, fontWeight:700, color:'#92400E' }}>{driver.rating}</span>
            <span style={{ fontSize:12, color:'var(--txt-3)' }}>· {driver.totalTrips} trips</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:4 }}>
            <Shield size={11} color="#22C55E" strokeWidth={2}/>
            <span style={{ fontSize:11, color:'var(--txt-3)' }}>Background verified</span>
          </div>
        </div>
      </div>

      {/* Vehicle plate — large, unmissable */}
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <div style={{ flex:1, background:'var(--bg-white)', border:'1.5px solid var(--border)', borderRadius:'var(--r-md)', padding:'12px 14px' }}>
          <p style={{ fontSize:10, fontWeight:700, color:'var(--txt-4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>Vehicle</p>
          <p style={{ fontSize:14, fontWeight:700, color:'var(--txt-1)' }}>{driver.vehicle.make} {driver.vehicle.model}</p>
          <p style={{ fontSize:11, color:'var(--txt-3)', marginTop:2 }}>{driver.vehicle.color ?? 'White'}</p>
        </div>
        <div style={{ flex:1, background:'var(--bg-white)', border:'2px solid var(--txt-1)', borderRadius:'var(--r-md)', padding:'12px 14px', textAlign:'center' }}>
          <p style={{ fontSize:10, fontWeight:700, color:'var(--txt-4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>Plate</p>
          <p style={{ fontSize:18, fontWeight:900, color:'var(--txt-1)', letterSpacing:'0.06em', fontFamily:'monospace' }}>{driver.vehicle.plate}</p>
        </div>
      </div>

      {/* Fare row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'var(--green-dim)', border:'1px solid var(--green-mid)', borderRadius:'var(--r-md)', marginBottom:14 }}>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--green-dk)' }}>Estimated Fare</span>
        <span style={{ fontSize:20, fontWeight:900, color:'var(--green-dk)', letterSpacing:'-0.03em' }}>Rs. {fareAmt}</span>
      </div>

      {/* Contact buttons — big, easy to tap */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <button style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          padding:'13px', borderRadius:'var(--r-md)',
          background:'var(--bg-white)', border:'1.5px solid var(--border)',
          fontSize:14, fontWeight:600, color:'var(--txt-2)',
          cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.15s',
        }}
          onMouseEnter={e=>{e.currentTarget.style.background='var(--cobalt-dim)';e.currentTarget.style.borderColor='var(--cobalt-lt)';e.currentTarget.style.color='var(--cobalt)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-white)';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--txt-2)';}}
        >
          <Phone size={16} strokeWidth={2}/> Call
        </button>
        <button style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          padding:'13px', borderRadius:'var(--r-md)',
          background:'var(--bg-white)', border:'1.5px solid var(--border)',
          fontSize:14, fontWeight:600, color:'var(--txt-2)',
          cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.15s',
        }}
          onMouseEnter={e=>{e.currentTarget.style.background='var(--green-dim)';e.currentTarget.style.borderColor='var(--green-mid)';e.currentTarget.style.color='var(--green-dk)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-white)';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--txt-2)';}}
        >
          <MessageSquare size={16} strokeWidth={2}/> Chat
        </button>
      </div>
    </div>
  );
}

/* ─── Rating modal ──────────────────────────────────────────────────────── */
function RatingModal({ open, onClose, driver, fare }) {
  const [score,   setScore]   = useState(0);
  const [hover,   setHover]   = useState(0);
  const [note,    setNote]    = useState('');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const submit = async () => {
    if (!score) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r, 700));
    setLoading(false); setDone(true);
    setTimeout(onClose, 1600);
  };

  return (
    <Modal open={open} onClose={onClose} title="Rate your driver" subtitle={`How was your ride with ${driver.name}?`}>
      {done ? (
        <div style={{ textAlign:'center', padding:'24px 0' }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--green-lt)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <CheckCircle size={30} color="#22C55E" strokeWidth={2}/>
          </div>
          <p style={{ fontSize:18, fontWeight:700, letterSpacing:'-0.02em' }}>Thanks for rating!</p>
          <p style={{ fontSize:13, color:'var(--txt-3)', marginTop:4 }}>Your feedback keeps Cubiny premium.</p>
        </div>
      ) : (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0 18px', borderBottom:'1px solid var(--border)', marginBottom:18 }}>
            <Avatar initials={driver.avatar} size={48}/>
            <div>
              <p style={{ fontWeight:700, fontSize:15 }}>{driver.name}</p>
              <p style={{ fontSize:12, color:'var(--txt-3)', marginTop:2 }}>{driver.vehicle.make} {driver.vehicle.model} · {driver.vehicle.plate}</p>
            </div>
            <div style={{ marginLeft:'auto', textAlign:'right' }}>
              <p style={{ fontSize:11, color:'var(--txt-4)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Fare paid</p>
              <p style={{ fontSize:20, fontWeight:900, color:'var(--txt-1)', letterSpacing:'-0.03em' }}>Rs.{fare}</p>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:6 }}>
            {[1,2,3,4,5].map(s=>(
              <button key={s} type="button"
                onClick={()=>setScore(s)}
                onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
                style={{ background:'none', border:'none', cursor:'pointer', transition:'transform 0.12s', transform:(hover||score)>=s?'scale(1.25)':'scale(1)', padding:3 }}>
                <Star size={38} color="#F59E0B" fill={(hover||score)>=s?'#F59E0B':'transparent'} strokeWidth={1.5}/>
              </button>
            ))}
          </div>
          {score>0 && <p style={{ textAlign:'center', fontSize:13, fontWeight:600, color:'#92400E', marginBottom:14 }}>
            {['','Poor','Below avg','Good','Very good','Excellent! 🎉'][score]}
          </p>}

          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a comment (optional)"
            style={{ width:'100%', height:72, resize:'none', padding:'10px 14px', background:'var(--bg-subtle)', border:'1.5px solid var(--border)', borderRadius:'var(--r-md)', fontSize:13, fontFamily:'var(--font)', color:'var(--txt-1)', marginBottom:16, outline:'none' }}
            onFocus={e=>{e.target.style.borderColor='var(--cobalt)';e.target.style.background='white';}}
            onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.background='var(--bg-subtle)';}}
          />
          <div style={{ display:'flex', gap:10 }}>
            <Button variant="secondary" fullWidth onClick={onClose}>Skip</Button>
            <Button variant="primary"   fullWidth onClick={submit} loading={loading} disabled={!score}>Submit Rating</Button>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ─── MAIN DASHBOARD ────────────────────────────────────────────────────── */
export function RiderDashboard() {
  const { user }   = useAuth();
  const [state,    setState]    = useState('idle');
  const [pickup,   setPickup]   = useState('');
  const [dropoff,  setDropoff]  = useState('');
  const [pickErr,  setPickErr]  = useState(false);
  const [dropErr,  setDropErr]  = useState(false);
  const [selType,  setSelType]  = useState('Economy');
  const [fares,    setFares]    = useState([]);
  const [submitting, setSub]    = useState(false);
  const [rideId,   setRideId]   = useState(null);
  const [showRate, setShowRate] = useState(false);

  /* Bug fix: tracked timeout refs */
  const tRef = useRef([]);
  const clearAll = useCallback(()=>{ tRef.current.forEach(clearTimeout); tRef.current=[]; },[]);
  useEffect(()=>()=>clearAll(),[clearAll]);

  useEffect(()=>{ setFares(getAllFares(RIDE_INFO.distanceKm, 18)); },[]);

  const activeFare = fares.find(f=>f.id===selType);

  /* Bug fix: validation before API call */
  const handleRequest = async () => {
    let err = false;
    if (!pickup.trim())  { setPickErr(true);  err=true; }
    if (!dropoff.trim()) { setDropErr(true);  err=true; }
    if (err) return;
    clearAll();
    setSub(true);
    const res = await requestRide({ pickup_location:pickup, dropoff_location:dropoff, vehicle_type:selType });
    setRideId(res?.id ?? `RD-${8800+Math.floor(Math.random()*100)}`);
    setSub(false);
    setState('searching');
    /* Bug fix: realistic lifecycle with tracked IDs */
    tRef.current = [
      setTimeout(()=>setState('found'),        3000),
      setTimeout(()=>setState('en_route'),     6000),
      setTimeout(()=>setState('in_progress'), 11000),
      setTimeout(()=>{ setState('completed'); setShowRate(true); electronNotify.rideCompleted?.({fare:activeFare?.finalFare??0}); }, 19000),
    ];
  };

  const resetRide = () => {
    clearAll();
    setState('idle'); setPickup(''); setDropoff('');
    setPickErr(false); setDropErr(false); setRideId(null);
  };

  const isIdle      = state==='idle';
  const isCompleted = state==='completed';
  const showRoute   = ['en_route','in_progress','completed'].includes(state);
  const showDrivers = ['found','en_route','in_progress','completed'].includes(state);
  const isActive    = ['found','en_route','in_progress'].includes(state);

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden', display:'flex' }}>

      {/* ── MAP — full-screen backdrop ── */}
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        <LiveMap showRoute={showRoute} showRider showDriver={showDrivers}/>
      </div>

      {/* ── COMMAND PANEL — 420px docked right ── */}
      <div style={{
        position:'absolute', top:0, right:0, bottom:0,
        width:420, zIndex:10,
        display:'flex', flexDirection:'column',
        background:'var(--bg-white)',
        boxShadow:'-8px 0 40px rgba(17,24,39,0.14), -2px 0 8px rgba(17,24,39,0.06)',
        borderLeft:'1px solid var(--border)',
        overflowY:'auto',
      }}>

        {/* ── Panel header ── */}
        <div style={{
          padding:'20px 24px 16px',
          borderBottom:'1px solid var(--border)',
          background:'var(--bg-white)',
          position:'sticky', top:0, zIndex:5,
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <h2 style={{ fontSize:20, fontWeight:800, color:'var(--txt-1)', letterSpacing:'-0.03em', lineHeight:1.2 }}>
                {isIdle ? 'Where to?' : isCompleted ? "You've arrived!" : 'Your Ride'}
              </h2>
              <p style={{ fontSize:13, color:'var(--txt-3)', marginTop:3 }}>
                {isIdle ? 'Book a ride in seconds' : `Ride ${rideId ?? '...'}`}
              </p>
            </div>
            {/* Wallet chip */}
            <div style={{ background:'var(--green-dim)', border:'1px solid var(--green-mid)', borderRadius:'var(--r-full)', padding:'6px 12px', display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'var(--green-dk)' }}>Rs.{(user?.wallet??4750).toLocaleString()}</span>
            </div>
          </div>

          {/* Stepper — shown only during active ride */}
          {!isIdle && !isCompleted && state !== 'searching' && (
            <div style={{ marginTop:14, marginLeft:-24, marginRight:-24, borderTop:'1px solid var(--border)' }}>
              <RideStepper state={state}/>
            </div>
          )}
        </div>

        {/* ── IDLE: Booking flow ── */}
        {isIdle && (
          <div style={{ padding:'20px 20px', display:'flex', flexDirection:'column', gap:16 }}>

            {/* Location inputs */}
            <LocationInputs
              pickup={pickup}   dropoff={dropoff}
              onPickup={v=>{setPickup(v);if(pickErr)setPickErr(false);}}
              onDropoff={v=>{setDropoff(v);if(dropErr)setDropErr(false);}}
              pickErr={pickErr} dropErr={dropErr}
            />

            {/* Vehicle selection — big Yango-style cards */}
            {fares.length > 0 && (
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:'var(--txt-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>
                  Choose a ride type
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {TYPES.map(t => (
                    <VehicleCard
                      key={t.id} type={t}
                      fare={fares.find(f=>f.id===t.id)}
                      selected={selType}
                      onSelect={setSelType}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Fare summary strip */}
            {activeFare && (
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                background:'var(--bg-subtle)', border:'1px solid var(--border)',
                borderRadius:'var(--r-md)', padding:'12px 16px',
              }}>
                <div>
                  <p style={{ fontSize:11, color:'var(--txt-4)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>Total estimate</p>
                  <p style={{ fontSize:22, fontWeight:900, color:'var(--txt-1)', letterSpacing:'-0.03em' }}>
                    Rs. {activeFare.finalFare}
                  </p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:12, color:'var(--txt-3)' }}>{RIDE_INFO.distanceKm} km</p>
                  <p style={{ fontSize:12, color:'var(--txt-3)' }}>{activeFare.eta}</p>
                  {activeFare.surgeApplied && (
                    <span style={{ fontSize:10, fontWeight:700, color:'#92400E', background:'#FEF3C7', borderRadius:99, padding:'2px 8px', display:'inline-block', marginTop:3 }}>
                      ⚡ ×{activeFare.multiplier} Surge
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Confirm CTA — large, unmissable */}
            <Button
              variant="primary" fullWidth size="xl"
              onClick={handleRequest} loading={submitting}
              style={{ marginTop:4, fontSize:16, fontWeight:800, letterSpacing:'-0.01em' }}
            >
              <Navigation2 size={18}/> Confirm Ride
            </Button>

            {/* Trust strip */}
            <div style={{ display:'flex', justifyContent:'center', gap:20, padding:'4px 0' }}>
              {[
                { icon:Shield, text:'Verified drivers' },
                { icon:Clock,  text:'60s avg. pickup'  },
                { icon:Star,   text:'4.8★ rated'       },
              ].map(({ icon:Icon, text }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <Icon size={11} color="var(--txt-4)" strokeWidth={2}/>
                  <span style={{ fontSize:11, color:'var(--txt-4)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SEARCHING ── */}
        {state === 'searching' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', gap:20 }} className="anim-fade-in">
            <div style={{ position:'relative' }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--cobalt-dim)', border:'2px solid var(--cobalt-lt)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid var(--cobalt-lt)', borderTopColor:'var(--cobalt)', animation:'spin-s 0.8s linear infinite' }}/>
              </div>
              <div style={{ position:'absolute', inset:-8, borderRadius:'50%', border:'2px solid var(--cobalt-lt)', animation:'pulse-ring 1.4s ease-out infinite' }}/>
            </div>
            <div style={{ textAlign:'center' }}>
              <p style={{ fontSize:18, fontWeight:800, color:'var(--txt-1)', letterSpacing:'-0.02em', marginBottom:6 }}>Finding your driver</p>
              <p style={{ fontSize:13, color:'var(--txt-3)' }}>Connecting with verified drivers nearby…</p>
            </div>
          </div>
        )}

        {/* ── ACTIVE: Driver detail card ── */}
        {isActive && (
          <div className="anim-fade-in">
            <DriverCard
              driver={DRIVER}
              state={state}
              fareAmt={activeFare?.finalFare}
              rideId={rideId}
            />
          </div>
        )}

        {/* ── COMPLETED ── */}
        {isCompleted && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', textAlign:'center', gap:0 }} className="anim-scale-in">
            <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--green-lt)', border:'2px solid var(--green-mid)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
              <CheckCircle size={36} color="#22C55E" strokeWidth={2}/>
            </div>
            <h3 style={{ fontSize:24, fontWeight:900, color:'var(--txt-1)', letterSpacing:'-0.03em', marginBottom:6 }}>You've arrived!</h3>
            <p style={{ fontSize:14, color:'var(--txt-3)', marginBottom:4 }}>Rs. {activeFare?.finalFare} charged to your wallet</p>
            <p style={{ fontSize:11, color:'var(--txt-4)', fontFamily:'monospace', marginBottom:28 }}>{rideId}</p>

            {/* Rating prompt */}
            <div style={{ width:'100%', background:'var(--bg-subtle)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'16px', marginBottom:16 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'var(--txt-1)', marginBottom:10 }}>How was your ride with {DRIVER.name}?</p>
              <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
                {[1,2,3,4,5].map(s=>(
                  <button key={s} onClick={()=>setShowRate(true)} style={{ background:'none', border:'none', cursor:'pointer', padding:2 }}>
                    <Star size={30} color="#F59E0B" fill="transparent" strokeWidth={1.5}/>
                  </button>
                ))}
              </div>
            </div>

            <Button variant="primary" fullWidth size="lg" onClick={resetRide}>
              Book Another Ride
            </Button>
          </div>
        )}
      </div>

      {/* ── Status map badge (top-center) ── */}
      {!isIdle && state !== 'searching' && !isCompleted && (
        <div style={{
          position:'absolute', top:16, left:'calc(50% - 210px)', transform:'translateX(-50%)',
          background:'white', borderRadius:99, padding:'9px 18px',
          display:'flex', alignItems:'center', gap:8,
          boxShadow:'var(--sh-lg)', border:'1px solid var(--border)',
          zIndex:5, whiteSpace:'nowrap',
        }} className="anim-fade-in">
          <span style={{
            width:8, height:8, borderRadius:'50%', flexShrink:0,
            background: state==='found'?'#22C55E':state==='en_route'?'#2563EB':'#7C3AED',
            boxShadow:`0 0 0 3px ${state==='found'?'rgba(34,197,94,0.2)':state==='en_route'?'rgba(37,99,235,0.2)':'rgba(124,58,237,0.2)'}`,
            animation:'pulse-dot 1.5s ease infinite',
          }}/>
          <span style={{ fontSize:13, fontWeight:600, color:'var(--txt-1)' }}>
            {state==='found'?'Driver accepted your ride':state==='en_route'?`${DRIVER.name} is on the way`:'Ride in progress'}
          </span>
        </div>
      )}

      {/* ── Rating modal ── */}
      <RatingModal open={showRate} onClose={()=>setShowRate(false)} driver={DRIVER} fare={activeFare?.finalFare}/>
    </div>
  );
}
