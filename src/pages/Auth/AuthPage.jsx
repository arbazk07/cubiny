// src/pages/Auth/AuthPage.jsx — Cubiny v7
// Landing: functional booking-preview hero, Yango-style cards
// Login: separate clean centered card with role tabs
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { Button }    from '../../components/ui/Button';
import {
  MapPin, Navigation2, ArrowRight, Shield, Zap, Star,
  Clock, CheckCircle, Users, TrendingUp, Phone,
} from 'lucide-react';

/* ─── Logo ── */
function CubinyLogo({ size=28 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{
        width:size, height:size, borderRadius:Math.round(size*0.28),
        background:'linear-gradient(135deg,#22C55E,#16A34A)',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        boxShadow:'0 2px 8px rgba(34,197,94,0.35)',
      }}>
        <svg width={size*0.6} height={size*0.6} viewBox="0 0 24 24" fill="none">
          <rect x="2"  y="2"  width="9" height="9" rx="2" fill="white"/>
          <rect x="13" y="2"  width="9" height="9" rx="2" fill="white" opacity="0.5"/>
          <rect x="2"  y="13" width="9" height="9" rx="2" fill="white" opacity="0.5"/>
          <rect x="13" y="13" width="9" height="9" rx="2" fill="white"/>
        </svg>
      </div>
    </div>
  );
}

/* ─── Inline booking preview (functional-looking hero widget) ── */
function BookingHeroWidget({ onBook }) {
  const [pickup,  setPickup]  = useState('');
  const [dropoff, setDropoff] = useState('');
  const [type,    setType]    = useState('Economy');

  const QUICK = ['Economy','Premium','Bike'];
  const PRICES = { Economy:'Rs. 150–280', Premium:'Rs. 280–500', Bike:'Rs. 80–150' };

  return (
    <div style={{
      background:'white', borderRadius:20, padding:'24px',
      boxShadow:'0 20px 60px rgba(17,24,39,0.14), 0 4px 16px rgba(17,24,39,0.08)',
      border:'1px solid var(--border)', maxWidth:420, width:'100%',
    }}>
      <p style={{ fontSize:13, fontWeight:700, color:'var(--txt-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Quick Estimate</p>

      {/* Inputs */}
      <div style={{ background:'var(--bg-subtle)', border:'1.5px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', padding:'0 14px', borderBottom:'1px solid var(--border)', background:'white' }}>
          <span style={{ width:9,height:9,borderRadius:'50%',background:'#22C55E',flexShrink:0 }}/>
          <input placeholder="Pickup location" value={pickup} onChange={e=>setPickup(e.target.value)}
            style={{ flex:1,height:46,padding:'0 12px',fontSize:14,fontWeight:500,border:'none',background:'transparent',fontFamily:'var(--font)',color:'var(--txt-1)',outline:'none' }}/>
        </div>
        <div style={{ display:'flex', alignItems:'center', padding:'0 14px', background:'white' }}>
          <MapPin size={10} color="#2563EB" strokeWidth={2.5}/>
          <input placeholder="Drop-off destination" value={dropoff} onChange={e=>setDropoff(e.target.value)}
            style={{ flex:1,height:46,padding:'0 12px',fontSize:14,fontWeight:500,border:'none',background:'transparent',fontFamily:'var(--font)',color:'var(--txt-1)',outline:'none' }}/>
        </div>
      </div>

      {/* Type selector */}
      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {QUICK.map(t=>(
          <button key={t} onClick={()=>setType(t)} style={{
            flex:1, padding:'9px 0', borderRadius:'var(--r-md)',
            background: type===t ? '#22C55E' : 'var(--bg-subtle)',
            border:`1.5px solid ${type===t ? '#22C55E' : 'var(--border)'}`,
            color: type===t ? 'white' : 'var(--txt-2)',
            fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'var(--font)',
            transition:'all 0.15s', boxShadow: type===t ? '0 2px 8px rgba(34,197,94,0.3)' : 'none',
          }}>{t}</button>
        ))}
      </div>

      {/* Price strip */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, padding:'10px 14px', background:'var(--green-dim)', borderRadius:'var(--r-md)', border:'1px solid var(--green-mid)' }}>
        <span style={{ fontSize:13, color:'var(--green-dk)', fontWeight:600 }}>Estimated fare</span>
        <span style={{ fontSize:16, fontWeight:800, color:'var(--green-dk)' }}>{PRICES[type]}</span>
      </div>

      <Button variant="primary" fullWidth size="lg" onClick={onBook}>
        <Navigation2 size={16}/> Book Now — It's Free
      </Button>
    </div>
  );
}

/* ─── Feature card (Yango-style) ── */
function FeatureCard({ icon:Icon, iconColor, iconBg, title, desc }) {
  return (
    <div style={{
      background:'white', border:'1px solid var(--border)',
      borderRadius:'var(--r-xl)', padding:'24px',
      boxShadow:'var(--sh-sm)', transition:'all 0.2s',
    }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow='var(--sh-lg)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow='var(--sh-sm)'; e.currentTarget.style.transform='translateY(0)'; }}
    >
      <div style={{ width:48,height:48,borderRadius:'var(--r-md)',background:iconBg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16 }}>
        <Icon size={22} color={iconColor} strokeWidth={2}/>
      </div>
      <h3 style={{ fontSize:15,fontWeight:700,color:'var(--txt-1)',letterSpacing:'-0.02em',marginBottom:6 }}>{title}</h3>
      <p style={{ fontSize:13,color:'var(--txt-3)',lineHeight:1.6 }}>{desc}</p>
    </div>
  );
}

/* ─── LANDING PAGE ── */
function LandingPage({ onLogin }) {
  return (
    <div style={{ minHeight:'100vh', background:'#FFFFFF', overflowY:'auto', fontFamily:'var(--font)' }}>

      {/* NAV */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(255,255,255,0.95)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid var(--border)',
        padding:'0 48px', height:62,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <CubinyLogo size={32}/>
          <span style={{ fontSize:19, fontWeight:800, color:'var(--txt-1)', letterSpacing:'-0.03em' }}>Cubiny</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <a href="#features" style={{ fontSize:13,fontWeight:500,color:'var(--txt-3)',textDecoration:'none',padding:'7px 14px',borderRadius:'var(--r-md)',transition:'all 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-subtle)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >Features</a>
          <a href="#pricing" style={{ fontSize:13,fontWeight:500,color:'var(--txt-3)',textDecoration:'none',padding:'7px 14px',borderRadius:'var(--r-md)',transition:'all 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-subtle)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >Pricing</a>
          <button onClick={onLogin} style={{ fontSize:13,fontWeight:600,color:'var(--txt-2)',background:'none',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'8px 18px',cursor:'pointer',fontFamily:'var(--font)',transition:'all 0.15s',marginLeft:6 }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-subtle)'}
            onMouseLeave={e=>e.currentTarget.style.background='none'}
          >Sign In</button>
          <Button variant="primary" size="sm" onClick={onLogin}>Get Started</Button>
        </div>
      </nav>

      {/* HERO — split layout: copy left, booking widget right */}
      <section style={{
        padding:'64px 48px 72px',
        background:'linear-gradient(165deg, #F9FAFB 0%, #FFFFFF 60%)',
        display:'grid', gridTemplateColumns:'1fr minmax(380px,440px)', gap:48, alignItems:'center',
        maxWidth:1200, margin:'0 auto',
        minHeight:'calc(100vh - 62px)',
      }}>
        <div>
          {/* Trust badge */}
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'var(--green-lt)',border:'1px solid var(--green-mid)',borderRadius:99,padding:'6px 16px',marginBottom:24,fontSize:12,fontWeight:700,color:'var(--green-dk)' }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:'var(--green)',display:'inline-block' }}/>
            8,900+ active riders · Islamabad & Rawalpindi
          </div>

          <h1 style={{
            fontSize:'clamp(38px,5vw,58px)', fontWeight:900,
            color:'var(--txt-1)', letterSpacing:'-0.04em',
            lineHeight:1.05, marginBottom:20,
          }}>
            Your city, your ride.
            <br/>
            <span style={{ color:'var(--green)' }}>On demand.</span>
          </h1>

          <p style={{ fontSize:18,color:'var(--txt-3)',lineHeight:1.7,maxWidth:440,marginBottom:36 }}>
            Cubiny connects you with professional drivers in under 60 seconds.
            Real-time tracking, transparent fares, no surprises.
          </p>

          {/* Stats row */}
          <div style={{ display:'flex', gap:32, marginBottom:36 }}>
            {[
              { val:'< 60s', label:'Avg. pickup' },
              { val:'1,240', label:'Drivers'      },
              { val:'4.8★',  label:'App rating'   },
            ].map(({ val, label }) => (
              <div key={label}>
                <p style={{ fontSize:22,fontWeight:900,color:'var(--txt-1)',letterSpacing:'-0.03em',lineHeight:1 }}>{val}</p>
                <p style={{ fontSize:12,color:'var(--txt-4)',marginTop:3,fontWeight:500 }}>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <Button variant="primary" size="xl" onClick={onLogin}>
              Book a Ride <ArrowRight size={16}/>
            </Button>
            <Button variant="secondary" size="xl" onClick={onLogin}>
              Drive with Cubiny
            </Button>
          </div>

          {/* Verified strip */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:28 }}>
            <div style={{ display:'flex' }}>
              {['AM','BR','SK','UH','FK'].map((init,i)=>(
                <div key={init} style={{ width:28,height:28,borderRadius:'50%',background:['#DCFCE7','#DBEAFE','#FEF3C7','#F3E8FF','#FEE2E2'][i],border:'2px solid white',marginLeft:i?-8:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'var(--txt-3)' }}>{init[0]}</div>
              ))}
            </div>
            <span style={{ fontSize:13,color:'var(--txt-3)',fontWeight:500 }}>Join thousands of happy riders</span>
          </div>
        </div>

        {/* Booking widget */}
        <div className="anim-fade-up">
          <BookingHeroWidget onBook={onLogin}/>
        </div>
      </section>

      {/* STATS DARK STRIP */}
      <section style={{ background:'#111827', padding:'36px 48px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,maxWidth:900,margin:'0 auto',textAlign:'center' }}>
          {[
            { val:'8,900+', label:'Riders' },
            { val:'1,240',  label:'Verified Drivers' },
            { val:'94K+',   label:'Total Rides' },
            { val:'Rs.0',   label:'Hidden Fees' },
          ].map(({ val, label }) => (
            <div key={label}>
              <p style={{ fontSize:28,fontWeight:900,color:'white',letterSpacing:'-0.03em',marginBottom:4 }}>{val}</p>
              <p style={{ fontSize:12,color:'rgba(255,255,255,0.45)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:'72px 48px', background:'var(--bg)' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ fontSize:12,fontWeight:700,color:'var(--green)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10 }}>WHY CUBINY</p>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,38px)',fontWeight:900,color:'var(--txt-1)',letterSpacing:'-0.035em',marginBottom:12 }}>Built for people who value their time</h2>
            <p style={{ fontSize:15,color:'var(--txt-3)',maxWidth:460,margin:'0 auto',lineHeight:1.7 }}>Every detail is designed around getting you there safely, quickly, and affordably.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
            {[
              { icon:Zap,    iconColor:'#22C55E', iconBg:'#F0FDF4', title:'60-Second Matching',      desc:'Our algorithm connects you with the nearest available driver instantly.' },
              { icon:Shield, iconColor:'#2563EB', iconBg:'#EFF6FF', title:'Verified Every Ride',      desc:'CNIC checks, background verification, and live ratings on every driver.' },
              { icon:MapPin, iconColor:'#F59E0B', iconBg:'#FFFBEB', title:'Real-Time GPS Tracking',   desc:'Watch your driver approach. Share your trip with family in one tap.' },
              { icon:Star,   iconColor:'#7C3AED', iconBg:'#F5F3FF', title:'Transparent Pricing',      desc:'See the exact price before you confirm. No hidden charges. Ever.' },
            ].map(f => <FeatureCard key={f.title} {...f}/>)}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding:'72px 48px', background:'white' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <p style={{ fontSize:12,fontWeight:700,color:'var(--cobalt)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10 }}>RIDE TYPES</p>
            <h2 style={{ fontSize:'clamp(24px,3vw,36px)',fontWeight:900,color:'var(--txt-1)',letterSpacing:'-0.03em' }}>Pick your ride</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[
              { emoji:'🚗', label:'Economy', price:'Rs. 100+', perKm:'Rs. 45/km', desc:'Reliable daily rides at the best prices', color:'#2563EB', bg:'#EFF6FF', border:'#BFDBFE' },
              { emoji:'🚙', label:'Premium', price:'Rs. 200+', perKm:'Rs. 75/km', desc:'Comfort sedans for when it matters',      color:'#7C3AED', bg:'#F5F3FF', border:'#DDD6FE', badge:'Popular' },
              { emoji:'🏍️', label:'Bike',    price:'Rs. 60+',  perKm:'Rs. 25/km', desc:'The fastest way to beat traffic',         color:'#059669', bg:'#ECFDF5', border:'#A7F3D0' },
            ].map(({ emoji, label, price, perKm, desc, color, bg, border, badge }) => (
              <div key={label} style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:'var(--r-2xl)', padding:'28px 24px', textAlign:'center', position:'relative', cursor:'default', transition:'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--sh-lg)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
              >
                {badge && (
                  <span style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:color, color:'white', fontSize:10, fontWeight:700, padding:'3px 12px', borderRadius:99, whiteSpace:'nowrap', letterSpacing:'0.04em' }}>{badge}</span>
                )}
                <div style={{ fontSize:40, marginBottom:16 }}>{emoji}</div>
                <h3 style={{ fontSize:20,fontWeight:800,color:'var(--txt-1)',letterSpacing:'-0.025em',marginBottom:6 }}>{label}</h3>
                <p style={{ fontSize:14,fontWeight:900,color,marginBottom:4 }}>{price}</p>
                <p style={{ fontSize:12,color:'var(--txt-3)',marginBottom:10 }}>{perKm}</p>
                <p style={{ fontSize:13,color:'var(--txt-3)',lineHeight:1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{ background:'var(--txt-1)', padding:'64px 48px', textAlign:'center' }}>
        <div style={{ maxWidth:520, margin:'0 auto' }}>
          <CubinyLogo size={40}/>
          <h2 style={{ fontSize:'clamp(24px,4vw,40px)',fontWeight:900,color:'white',letterSpacing:'-0.035em',margin:'20px 0 14px' }}>
            Ready to ride smarter?
          </h2>
          <p style={{ fontSize:15,color:'rgba(255,255,255,0.55)',marginBottom:32,lineHeight:1.6 }}>
            Join 8,900+ riders who trust Cubiny every day. Sign up takes 30 seconds.
          </p>
          <Button variant="primary" size="xl" onClick={onLogin}>
            Start Riding — It's Free <ArrowRight size={16}/>
          </Button>
          <p style={{ fontSize:11,color:'rgba(255,255,255,0.2)',marginTop:36 }}>
            © 2026 Cubiny Technologies · Islamabad · Privacy Policy · Terms
          </p>
        </div>
      </section>
    </div>
  );
}

/* ─── LOGIN CARD PAGE ── */
function LoginPage({ onBack }) {
  const [tab, setTab] = useState('rider');
  const TABS = ['rider','driver','admin'];
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 16px', position:'relative' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'40%', background:'linear-gradient(180deg,rgba(34,197,94,0.04),transparent)', pointerEvents:'none' }}/>
      <div style={{ width:'100%', maxWidth:420 }} className="anim-scale-in">
        {/* Back */}
        <button onClick={onBack} style={{ background:'none',border:'none',color:'var(--txt-3)',cursor:'pointer',fontSize:13,display:'flex',alignItems:'center',gap:6,marginBottom:28,fontFamily:'var(--font)',fontWeight:500,padding:0,transition:'color 0.15s' }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--txt-1)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--txt-3)'}
        >← Back to home</button>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'inline-flex',justifyContent:'center',marginBottom:16 }}>
            <div style={{ background:'white',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',padding:14,boxShadow:'var(--sh-md)' }}>
              <CubinyLogo size={36}/>
            </div>
          </div>
          <h1 style={{ fontSize:26,fontWeight:900,color:'var(--txt-1)',letterSpacing:'-0.03em',marginBottom:6 }}>Welcome back</h1>
          <p style={{ fontSize:14,color:'var(--txt-3)' }}>Pakistan's most trusted ride-hailing platform</p>
        </div>

        {/* Role tabs */}
        <div style={{ display:'flex',background:'var(--bg-subtle)',borderRadius:'var(--r-lg)',padding:4,marginBottom:20,border:'1px solid var(--border)' }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              flex:1, padding:'10px 0', borderRadius:'var(--r-md)',
              border:'none', cursor:'pointer', fontFamily:'var(--font)',
              background: tab===t ? 'white' : 'transparent',
              color:       tab===t ? 'var(--txt-1)' : 'var(--txt-3)',
              fontWeight:  tab===t ? 700 : 400,
              fontSize:13,
              boxShadow:   tab===t ? 'var(--sh-sm)' : 'none',
              transition:'all 0.15s',
            }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>

        {/* Login card */}
        <div style={{ background:'white',border:'1px solid var(--border)',borderRadius:'var(--r-2xl)',padding:'28px',boxShadow:'var(--sh-xl)' }}>
          <LoginForm role={tab} key={tab}/>
        </div>

        <p style={{ textAlign:'center',fontSize:11,color:'var(--txt-4)',marginTop:20 }}>
          © 2026 Cubiny Technologies · All rights reserved
        </p>
      </div>
    </div>
  );
}

/* ─── ROOT ── */
export function AuthPage() {
  const [view, setView] = useState('landing');
  if (view === 'login') return <LoginPage onBack={()=>setView('landing')}/>;
  return <LandingPage onLogin={()=>setView('login')}/>;
}
