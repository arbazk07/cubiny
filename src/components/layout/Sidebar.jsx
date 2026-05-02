// src/components/layout/Sidebar.jsx — Cubiny Desktop v4
// Adds Settings nav item + desktop badge
import { useAuth } from "../../hooks/useAuth";
import { Avatar }  from "../ui/Avatar";
import { IS_ELECTRON } from "../../hooks/useElectron";
import {
  Map, Clock, Wallet, Star, Gift, FileText,
  Radio, TrendingUp, Truck, Activity, Users,
  DollarSign, AlertTriangle, LogOut,
  ChevronLeft, ChevronRight, Settings, Monitor,
} from "lucide-react";

const NAV = {
  rider:  [
    { id:"dashboard",  icon:Map,           label:"Book Ride"        },
    { id:"history",    icon:Clock,         label:"My Rides"         },
    { id:"wallet",     icon:Wallet,        label:"Wallet"           },
    { id:"ratings",    icon:Star,          label:"Ratings"          },
    { id:"promo",      icon:Gift,          label:"Promos"           },
    { id:"complaints", icon:FileText,      label:"Support"          },
  ],
  driver: [
    { id:"dashboard",  icon:Radio,         label:"Go Live"          },
    { id:"earnings",   icon:TrendingUp,    label:"Earnings"         },
    { id:"vehicles",   icon:Truck,         label:"Vehicles"         },
    { id:"ratings",    icon:Star,          label:"Ratings"          },
    { id:"history",    icon:Clock,         label:"Trip Log"         },
  ],
  admin:  [
    { id:"dashboard",  icon:Activity,      label:"Mission Control"  },
    { id:"rides",      icon:Map,           label:"Live Rides"       },
    { id:"drivers",    icon:Users,         label:"Drivers"          },
    { id:"revenue",    icon:DollarSign,    label:"Revenue"          },
    { id:"flagged",    icon:AlertTriangle, label:"Flagged"          },
  ],
};

// Shared bottom items for all roles
const BOTTOM_NAV = [
  { id:"settings", icon: Settings, label:"Settings" },
];

function CubeLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2"  y="2"  width="9" height="9" rx="2.5" fill="white" opacity="0.9"/>
      <rect x="13" y="2"  width="9" height="9" rx="2.5" fill="white" opacity="0.55"/>
      <rect x="2"  y="13" width="9" height="9" rx="2.5" fill="white" opacity="0.55"/>
      <rect x="13" y="13" width="9" height="9" rx="2.5" fill="white" opacity="0.9"/>
      <defs>
        <linearGradient id="sbg2" x1="0" y1="0" x2="24" y2="24">
          <stop stopColor="#6d28d9"/><stop offset="1" stopColor="#0891b2"/>
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="7" fill="url(#sbg2)" style={{mixBlendMode:"multiply"}}/>
    </svg>
  );
}

export function Sidebar({ activeScreen, onNavigate, collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const role     = user?.role;
  const navItems = NAV[role] ?? [];

  const NavBtn = ({ item }) => {
    const active = activeScreen === item.id;
    return (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{
        width:"100%", display:"flex", alignItems:"center",
        gap:10, padding: collapsed ? "11px 0" : "10px 18px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: active ? "rgba(109,40,217,0.14)" : "transparent",
        borderLeft: active ? "2px solid var(--v2)" : "2px solid transparent",
        border:"none", color: active ? "var(--v3)" : "var(--t3)",
        fontSize:13, fontWeight: active ? 600 : 400,
        cursor:"pointer", transition:"all 0.15s", fontFamily:"var(--font-b)",
      }}>
        <item.icon size={15} strokeWidth={active ? 2.2 : 1.8}/>
        {!collapsed && <span style={{flex:1}}>{item.label}</span>}
        {!collapsed && active && (
          <div style={{ width:5,height:5,borderRadius:"50%",background:"var(--v3)",boxShadow:"0 0 8px var(--v2)" }}/>
        )}
      </button>
    );
  };

  return (
    <aside style={{
      width:         collapsed ? 68 : 228,
      minWidth:      collapsed ? 68 : 228,
      height:        "100%",
      background:    "rgba(5,5,16,0.98)",
      borderRight:   "1px solid var(--b1)",
      display:       "flex",
      flexDirection: "column",
      transition:    "width 0.28s cubic-bezier(0.4,0,0.2,1)",
      overflow:      "hidden",
      flexShrink:    0,
      position:      "relative",
    }}>
      {/* Top accent line */}
      <div style={{ position:"absolute",top:0,left:0,width:"100%",height:2,background:"linear-gradient(90deg,var(--v),var(--c2),transparent)",opacity:0.5 }}/>

      {/* Brand */}
      <div style={{
        padding:        collapsed ? "18px 0" : "18px 18px",
        display:        "flex", alignItems:"center",
        justifyContent: collapsed ? "center" : "space-between",
        borderBottom:   "1px solid var(--b1)", minHeight:64,
      }}>
        {!collapsed && (
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ background:"linear-gradient(135deg,var(--v),var(--c2))",borderRadius:10,padding:7,display:"flex" }}>
              <CubeLogo size={22}/>
            </div>
            <div>
              <div style={{ fontFamily:"var(--font-d)",fontWeight:800,fontSize:16,background:"linear-gradient(135deg,var(--v3),var(--c3))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.02em" }}>
                Cubiny
              </div>
              <div style={{ fontSize:9,color:"var(--t4)",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:-1 }}>
                {IS_ELECTRON ? "Desktop" : "Web"} · Premium Rides
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ background:"linear-gradient(135deg,var(--v),var(--c2))",borderRadius:8,padding:5,display:"flex" }}>
            <CubeLogo size={18}/>
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggle} style={{ background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:8,padding:5,color:"var(--t3)",display:"flex",cursor:"pointer" }}>
            <ChevronLeft size={13}/>
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={onToggle} style={{ margin:"8px auto 0",background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:8,padding:"5px 6px",color:"var(--t3)",display:"flex",cursor:"pointer" }}>
          <ChevronRight size={13}/>
        </button>
      )}

      {/* User */}
      <div style={{
        padding:      collapsed ? "12px 0" : "14px 18px",
        borderBottom: "1px solid var(--b1)",
        display:"flex", justifyContent: collapsed ? "center" : "flex-start",
        alignItems:"center", gap:10,
      }}>
        <Avatar initials={user?.avatar} size={collapsed ? 32 : 38}
          status={role==="driver" ? "online" : undefined}/>
        {!collapsed && (
          <div style={{ overflow:"hidden",flex:1 }}>
            <div style={{ fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:"var(--t1)" }}>
              {user?.name}
            </div>
            <div style={{ fontSize:9,color:"var(--t4)",marginTop:2,textTransform:"uppercase",letterSpacing:"0.06em" }}>
              {role}
            </div>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav style={{ flex:1,padding:"10px 0",overflowY:"auto" }}>
        {!collapsed && (
          <div style={{ padding:"8px 18px 4px",fontSize:9,color:"var(--t4)",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600 }}>
            Navigation
          </div>
        )}
        {navItems.map(item => <NavBtn key={item.id} item={item}/>)}
      </nav>

      {/* Bottom nav (Settings) */}
      <div style={{ borderTop:"1px solid var(--b1)",paddingTop:4,paddingBottom:4 }}>
        {BOTTOM_NAV.map(item => <NavBtn key={item.id} item={item}/>)}
      </div>

      {/* Logout */}
      <div style={{ padding: collapsed ? "10px 0" : "10px 18px", borderTop:"1px solid var(--b1)" }}>
        <button onClick={logout} style={{
          width:"100%", display:"flex", alignItems:"center",
          gap:8, justifyContent: collapsed ? "center" : "flex-start",
          background:"none", border:"none", color:"var(--t4)",
          fontSize:13, padding:"8px 0", cursor:"pointer", fontFamily:"var(--font-b)",
          transition:"color 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--t4)"}
        >
          <LogOut size={14}/>{!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
