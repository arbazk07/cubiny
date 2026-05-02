// src/components/layout/Sidebar.jsx — Cubiny v6 Professional
// Slim vertical nav-rail — clean white, green active states
import { useAuth } from '../../hooks/useAuth';
import { Avatar }  from '../ui/Avatar';
import {
  Map, Clock, Wallet, Star, Gift, FileText,
  Radio, TrendingUp, Truck, Activity, Users,
  DollarSign, AlertTriangle, LogOut, Settings,
  ChevronRight, ChevronLeft,
} from 'lucide-react';

const NAV = {
  rider:  [
    { id:'dashboard',  icon:Map,           label:'Book Ride'        },
    { id:'history',    icon:Clock,         label:'My Rides'         },
    { id:'wallet',     icon:Wallet,        label:'Wallet'           },
    { id:'ratings',    icon:Star,          label:'Ratings'          },
    { id:'promo',      icon:Gift,          label:'Promotions'       },
    { id:'complaints', icon:FileText,      label:'Support'          },
  ],
  driver: [
    { id:'dashboard',  icon:Radio,         label:'Go Live'          },
    { id:'earnings',   icon:TrendingUp,    label:'Earnings'         },
    { id:'vehicles',   icon:Truck,         label:'My Vehicle'       },
    { id:'ratings',    icon:Star,          label:'My Ratings'       },
    { id:'history',    icon:Clock,         label:'Trip Log'         },
  ],
  admin:  [
    { id:'dashboard',  icon:Activity,      label:'Mission Control'  },
    { id:'rides',      icon:Map,           label:'Live Rides'       },
    { id:'drivers',    icon:Users,         label:'Drivers'          },
    { id:'revenue',    icon:DollarSign,    label:'Revenue'          },
    { id:'flagged',    icon:AlertTriangle, label:'Flagged'          },
  ],
};

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

export function Sidebar({ activeScreen, onNavigate, collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const role = user?.role;
  const nav  = NAV[role] ?? [];

  const Item = ({ item }) => {
    const active = activeScreen === item.id;
    return (
      <button onClick={() => onNavigate(item.id)} title={collapsed ? item.label : undefined}
        style={{
          width:'100%', display:'flex', alignItems:'center',
          gap:10, padding: collapsed ? '10px 0' : '10px 16px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: active ? '#F0FDF4' : 'transparent',
          border:'none', cursor:'pointer',
          borderRight: `2px solid ${active ? '#22C55E' : 'transparent'}`,
          color: active ? '#16A34A' : 'var(--text-muted)',
          fontSize:13, fontWeight: active ? 600 : 400,
          transition:'all 0.15s', fontFamily:'var(--font)',
          textAlign:'left',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background='var(--bg-subtle)'; e.currentTarget.style.color='var(--text-primary)'; }}}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-muted)'; }}}
      >
        <item.icon size={16} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink:0 }}/>
        {!collapsed && <span style={{ flex:1 }}>{item.label}</span>}
        {!collapsed && active && <span style={{ width:6, height:6, borderRadius:'50%', background:'#22C55E', flexShrink:0 }}/>}
      </button>
    );
  };

  return (
    <aside style={{
      width: collapsed ? 56 : 220,
      minWidth: collapsed ? 56 : 220,
      height:'100%',
      background:'var(--bg-white)',
      borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column',
      transition:'width 0.25s var(--ease)',
      overflow:'hidden', flexShrink:0, position:'relative', zIndex:10,
    }}>
      {/* Brand */}
      <div style={{
        height:56, display:'flex', alignItems:'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '0' : '0 14px 0 16px',
        borderBottom:'1px solid var(--border)', flexShrink:0,
      }}>
        {!collapsed && (
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Logo size={20}/>
            <span style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>Cubiny</span>
          </div>
        )}
        {collapsed && <Logo size={20}/>}
        {!collapsed && (
          <button onClick={onToggle} style={{ background:'none', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'4px', color:'var(--text-muted)', cursor:'pointer', display:'flex' }}>
            <ChevronLeft size={13}/>
          </button>
        )}
      </div>

      {/* User chip */}
      <div style={{
        padding: collapsed ? '12px 0' : '14px 16px',
        borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:10,
        justifyContent: collapsed ? 'center' : 'flex-start', flexShrink:0,
      }}>
        <Avatar initials={user?.avatar ?? '?'} size={collapsed?30:34}
          status={role==='driver' ? 'online' : undefined}/>
        {!collapsed && (
          <div style={{ overflow:'hidden', flex:1 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:1, textTransform:'capitalize' }}>{role}</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, overflowY:'auto', padding:'8px 0', position:'relative' }}>
        {!collapsed && (
          <p style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', padding:'8px 16px 4px' }}>
            Main
          </p>
        )}
        {nav.map(item => <Item key={item.id} item={item}/>)}
        <div style={{ height:1, background:'var(--border)', margin:'8px 16px' }}/>
        <Item item={{ id:'settings', icon:Settings, label:'Settings' }}/>
      </nav>

      {/* Expand + Logout */}
      <div style={{ borderTop:'1px solid var(--border)', padding: collapsed ? '8px 0' : '8px 0' }}>
        {collapsed && (
          <button onClick={onToggle} style={{ width:'100%', display:'flex', justifyContent:'center', padding:'10px 0', background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}>
            <ChevronRight size={14}/>
          </button>
        )}
        <button onClick={logout}
          style={{
            width:'100%', display:'flex', alignItems:'center', gap:10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '10px 16px',
            background:'none', border:'none', color:'var(--text-muted)',
            fontSize:13, cursor:'pointer', fontFamily:'var(--font)',
            transition:'color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color='var(--red)'; e.currentTarget.style.background='var(--red-lt)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='transparent'; }}
        >
          <LogOut size={15} strokeWidth={1.8} style={{ flexShrink:0 }}/>
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
