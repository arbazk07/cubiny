// src/components/layout/Sidebar.jsx  —  Cubiny v2
import { useAuth } from "../../hooks/useAuth";
import { Avatar }  from "../ui/Avatar";
import {
  Map, Clock, Wallet, Star, Gift, FileText,
  Radio, TrendingUp, Truck, Activity, Users,
  DollarSign, AlertTriangle, LogOut, ChevronLeft, ChevronRight,
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

// Cube logo mark
function CubeLogo({ size=24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="7" fill="url(#sbg)"/>
      <rect x="5" y="5" width="5.5" height="5.5" rx="1.5" fill="white" opacity="0.9"/>
      <rect x="13.5" y="5" width="5.5" height="5.5" rx="1.5" fill="white" opacity="0.55"/>
      <rect x="5" y="13.5" width="5.5" height="5.5" rx="1.5" fill="white" opacity="0.55"/>
      <rect x="13.5" y="13.5" width="5.5" height="5.5" rx="1.5" fill="white" opacity="0.9"/>
      <defs>
        <linearGradient id="sbg" x1="0" y1="0" x2="24" y2="24">
          <stop stopColor="#6d28d9"/><stop offset="1" stopColor="#0891b2"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Sidebar({ activeScreen, onNavigate, collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const role     = user?.role;
  const navItems = NAV[role] ?? [];

  return (
    <aside style={{
      width:         collapsed ? 68 : 228,
      minWidth:      collapsed ? 68 : 228,
      height:        "100vh",
      background:    "rgba(5,5,16,0.98)",
      borderRight:   "1px solid var(--b1)",
      display:       "flex",
      flexDirection: "column",
      transition:    "width 0.28s cubic-bezier(0.4,0,0.2,1)",
      overflow:      "hidden",
      flexShrink:    0,
      position:      "relative",
    }}>
      {/* Subtle violet edge glow */}
      <div style={{ position:"absolute", top:0, left:0, width:"100%", height:3, background:"linear-gradient(90deg,var(--v),var(--c2),transparent)", opacity:0.5 }}/>

      {/* ── Brand ── */}
      <div style={{
        padding:        collapsed ? "22px 0" : "20px 18px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: collapsed ? "center" : "space-between",
        borderBottom:   "1px solid var(--b1)",
        minHeight:      72,
      }}>
        {!collapsed && (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <CubeLogo size={28}/>
            <div>
              <div style={{ fontFamily:"var(--font-d)", fontWeight:800, fontSize:17, background:"linear-gradient(135deg,var(--v3),var(--c3))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.02em" }}>
                Cubiny
              </div>
              <div style={{ fontSize:10, color:"var(--t4)", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:-1 }}>
                Premium Rides
              </div>
            </div>
          </div>
        )}
        {collapsed && <CubeLogo size={28}/>}
        {!collapsed && (
          <button onClick={onToggle} style={{
            background:"var(--s2)", border:"1px solid var(--b2)", borderRadius:8,
            padding:5, color:"var(--t3)", display:"flex", cursor:"pointer",
            transition:"all 0.15s",
          }}>
            <ChevronLeft size={14}/>
          </button>
        )}
      </div>

      {/* Collapsed expand button */}
      {collapsed && (
        <button onClick={onToggle} style={{
          margin:"8px auto 0", background:"var(--s2)", border:"1px solid var(--b2)",
          borderRadius:8, padding:"5px 6px", color:"var(--t3)", display:"flex", cursor:"pointer",
        }}>
          <ChevronRight size={13}/>
        </button>
      )}

      {/* ── User badge ── */}
      <div style={{
        padding:      collapsed ? "14px 0" : "14px 18px",
        borderBottom: "1px solid var(--b1)",
        display:      "flex",
        justifyContent: collapsed ? "center" : "flex-start",
        alignItems:   "center",
        gap:          10,
      }}>
        <Avatar initials={user?.avatar} size={collapsed ? 34 : 40}
          status={role === "driver" ? "online" : undefined}/>
        {!collapsed && (
          <div style={{ overflow:"hidden", flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", color:"var(--t1)" }}>
              {user?.name}
            </div>
            <div style={{ fontSize:10, color:"var(--t3)", marginTop:2, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              {role}
            </div>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
        {!collapsed && (
          <div style={{ padding:"8px 18px 4px", fontSize:10, color:"var(--t4)", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600 }}>
            Navigation
          </div>
        )}
        {navItems.map((item) => {
          const active = activeScreen === item.id;
          return (
            <button key={item.id} onClick={()=>onNavigate(item.id)} style={{
              width:"100%", display:"flex", alignItems:"center",
              gap:10, padding: collapsed ? "11px 0" : "10px 18px",
              justifyContent: collapsed ? "center" : "flex-start",
              background: active ? "rgba(109,40,217,0.13)" : "transparent",
              borderLeft: active ? "2px solid var(--v2)" : "2px solid transparent",
              border: "none",
              color: active ? "var(--v3)" : "var(--t3)",
              fontSize:13, fontWeight: active ? 600 : 400,
              cursor:"pointer", transition:"all 0.15s", fontFamily:"var(--font-b)",
              borderRadius: collapsed ? 0 : "0 12px 12px 0",
              marginRight: collapsed ? 0 : 10,
            }}>
              <item.icon size={15} strokeWidth={active ? 2.2 : 1.8}/>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && (
                <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:"var(--v3)", boxShadow:"0 0 8px var(--v2)" }}/>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div style={{ padding: collapsed ? "12px 0" : "12px 18px", borderTop:"1px solid var(--b1)" }}>
        <button onClick={logout} style={{
          width:"100%", display:"flex", alignItems:"center",
          gap:8, justifyContent: collapsed ? "center" : "flex-start",
          background:"none", border:"none", color:"var(--t4)",
          fontSize:13, padding:"8px 0", cursor:"pointer", fontFamily:"var(--font-b)",
          transition:"color 0.15s",
        }}
        onMouseEnter={e=>e.currentTarget.style.color="var(--red)"}
        onMouseLeave={e=>e.currentTarget.style.color="var(--t4)"}
        >
          <LogOut size={14}/>
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
