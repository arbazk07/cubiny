// src/components/layout/Sidebar.jsx — Cubiny v7
// Professional nav-rail: 256px expanded, clean icon+label items,
// real User Profile card at the bottom with wallet balance
import { useAuth } from '../../hooks/useAuth';
import { Avatar }  from '../ui/Avatar';
import {
  Map, Clock, Wallet, Star, Gift, FileText,
  Radio, TrendingUp, Truck, Activity, Users,
  DollarSign, AlertTriangle, LogOut, Settings,
  ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';

const NAV = {
  rider:  [
    { id:'dashboard',  icon:Map,           label:'Book a Ride'  },
    { id:'history',    icon:Clock,         label:'My Rides'     },
    { id:'wallet',     icon:Wallet,        label:'Wallet'       },
    { id:'ratings',    icon:Star,          label:'Ratings'      },
    { id:'promo',      icon:Gift,          label:'Promos'       },
    { id:'complaints', icon:FileText,      label:'Support'      },
  ],
  driver: [
    { id:'dashboard',  icon:Radio,         label:'Go Live'      },
    { id:'earnings',   icon:TrendingUp,    label:'Earnings'     },
    { id:'vehicles',   icon:Truck,         label:'My Vehicle'   },
    { id:'ratings',    icon:Star,          label:'Ratings'      },
    { id:'history',    icon:Clock,         label:'Trip Log'     },
  ],
  admin:  [
    { id:'dashboard',  icon:Activity,      label:'Dashboard'    },
    { id:'rides',      icon:Map,           label:'Live Rides'   },
    { id:'drivers',    icon:Users,         label:'Drivers'      },
    { id:'revenue',    icon:DollarSign,    label:'Revenue'      },
    { id:'flagged',    icon:AlertTriangle, label:'Flagged'      },
  ],
};

function CubinyLogo({ compact }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{
        width:34, height:34, borderRadius:10, flexShrink:0,
        background:'linear-gradient(135deg,#22C55E,#16A34A)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 2px 8px rgba(34,197,94,0.35)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2"  y="2"  width="9" height="9" rx="2" fill="white"/>
          <rect x="13" y="2"  width="9" height="9" rx="2" fill="white" opacity="0.5"/>
          <rect x="2"  y="13" width="9" height="9" rx="2" fill="white" opacity="0.5"/>
          <rect x="13" y="13" width="9" height="9" rx="2" fill="white"/>
        </svg>
      </div>
      {!compact && (
        <div>
          <p style={{ fontSize:17, fontWeight:800, color:'var(--txt-1)', letterSpacing:'-0.03em', lineHeight:1.1 }}>Cubiny</p>
          <p style={{ fontSize:10, color:'var(--txt-4)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Premium Rides</p>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ activeScreen, onNavigate, collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const role = user?.role ?? 'rider';
  const nav  = NAV[role] ?? [];
  const W    = collapsed ? 64 : 256;

  const NavItem = ({ item }) => {
    const active = activeScreen === item.id;
    return (
      <button
        onClick={() => onNavigate(item.id)}
        title={collapsed ? item.label : undefined}
        style={{
          width:'100%', display:'flex', alignItems:'center',
          gap:12, padding: collapsed ? '11px 0' : '11px 16px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          border:'none', cursor:'pointer', fontFamily:'var(--font)',
          borderRadius: 'var(--r-md)',
          margin:'1px 0',
          background: active ? 'var(--green-dim)' : 'transparent',
          color:       active ? 'var(--green-dk)' : 'var(--txt-3)',
          fontSize:14, fontWeight: active ? 600 : 400,
          transition:'all 0.15s var(--ease)',
          position:'relative',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = 'var(--bg-subtle)';
            e.currentTarget.style.color      = 'var(--txt-1)';
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color      = 'var(--txt-3)';
          }
        }}
      >
        {/* Active indicator strip */}
        {active && !collapsed && (
          <span style={{
            position:'absolute', left:0, top:'20%', bottom:'20%',
            width:3, borderRadius:'0 3px 3px 0',
            background:'var(--green)', display:'block',
          }}/>
        )}

        <span style={{
          width:36, height:36, borderRadius:'var(--r-sm)',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          background: active ? 'var(--green-lt)' : 'transparent',
          transition:'background 0.15s',
        }}>
          <item.icon size={18} strokeWidth={active ? 2.2 : 1.7}
            color={active ? 'var(--green-dk)' : 'var(--txt-3)'}/>
        </span>

        {!collapsed && (
          <span style={{ flex:1, textAlign:'left', letterSpacing:'-0.01em' }}>{item.label}</span>
        )}
      </button>
    );
  };

  return (
    <aside style={{
      width:W, minWidth:W, height:'100%',
      background:'var(--bg-white)',
      borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column',
      transition:'width 0.22s var(--ease)',
      overflow:'hidden', flexShrink:0,
      boxShadow:'1px 0 0 var(--border)',
    }}>

      {/* ── Brand header ── */}
      <div style={{
        height:64, display:'flex', alignItems:'center',
        padding: collapsed ? '0 14px' : '0 18px',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom:'1px solid var(--border)', flexShrink:0,
      }}>
        <CubinyLogo compact={collapsed}/>
        {!collapsed && (
          <button onClick={onToggle} style={{
            background:'var(--bg-subtle)', border:'1px solid var(--border)',
            borderRadius:'var(--r-sm)', padding:'6px', color:'var(--txt-3)',
            cursor:'pointer', display:'flex', transition:'all 0.15s', flexShrink:0,
          }}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--bg-muted)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-subtle)';}}
          >
            <ChevronLeft size={14}/>
          </button>
        )}
      </div>

      {/* ── Collapse toggle when slim ── */}
      {collapsed && (
        <button onClick={onToggle} style={{
          margin:'10px auto 0', background:'var(--bg-subtle)', border:'1px solid var(--border)',
          borderRadius:'var(--r-sm)', padding:'6px 8px', color:'var(--txt-3)',
          display:'flex', cursor:'pointer',
        }}>
          <ChevronRight size={14}/>
        </button>
      )}

      {/* ── Nav section label ── */}
      {!collapsed && (
        <p style={{
          fontSize:10, fontWeight:700, color:'var(--txt-4)',
          textTransform:'uppercase', letterSpacing:'0.1em',
          padding:'18px 18px 6px',
        }}>Navigation</p>
      )}

      {/* ── Main nav ── */}
      <nav style={{ flex:1, overflowY:'auto', padding: collapsed ? '8px 8px' : '4px 10px' }}>
        {nav.map(item => <NavItem key={item.id} item={item}/>)}

        {/* Divider */}
        <div style={{ height:1, background:'var(--border)', margin:collapsed?'10px 8px':'10px 6px' }}/>

        {/* Settings */}
        <NavItem item={{ id:'settings', icon:Settings, label:'Settings' }}/>
      </nav>

      {/* ── User profile card at bottom ── */}
      <div style={{
        borderTop:'1px solid var(--border)',
        padding: collapsed ? '12px 8px' : '14px 12px',
        flexShrink:0,
        background:'var(--bg)',
      }}>
        {!collapsed ? (
          <div style={{ background:'var(--bg-white)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'12px 14px', boxShadow:'var(--sh-sm)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <Avatar initials={user?.avatar ?? '?'} size={38}
                status={role==='driver' ? 'online' : undefined}/>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--txt-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</p>
                <p style={{ fontSize:11, color:'var(--txt-3)', textTransform:'capitalize', marginTop:1 }}>{role}</p>
              </div>
            </div>
            {/* Wallet balance row */}
            {(role === 'rider' || role === 'driver') && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--green-dim)', borderRadius:'var(--r-sm)', padding:'8px 10px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Wallet size={13} color="var(--green-dk)" strokeWidth={2}/>
                  <span style={{ fontSize:11, color:'var(--green-dk)', fontWeight:600 }}>Wallet</span>
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:'var(--green-dk)', letterSpacing:'-0.02em' }}>
                  Rs.{(user?.wallet ?? 4750).toLocaleString()}
                </span>
              </div>
            )}
            <button onClick={logout} style={{
              width:'100%', marginTop:8, display:'flex', alignItems:'center', justifyContent:'center',
              gap:6, padding:'8px', borderRadius:'var(--r-sm)', border:'1px solid var(--border)',
              background:'transparent', color:'var(--txt-3)', fontSize:12, fontWeight:500,
              cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.15s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='var(--red-lt)';e.currentTarget.style.color='var(--red)';e.currentTarget.style.borderColor='var(--red-mid)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--txt-3)';e.currentTarget.style.borderColor='var(--border)';}}
            >
              <LogOut size={13} strokeWidth={1.8}/>
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <Avatar initials={user?.avatar ?? '?'} size={32}
              status={role==='driver' ? 'online' : undefined}/>
            <button onClick={logout} style={{ background:'none', border:'none', color:'var(--txt-4)', cursor:'pointer', display:'flex' }}>
              <LogOut size={14} strokeWidth={1.8}/>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
