// src/components/layout/Sidebar.jsx — Cubiny v5
// Premium redesign: glow active state, gradient brand, vivid Electric Blue accents
import { useAuth } from "../../hooks/useAuth";
import { Avatar }  from "../ui/Avatar";
import { IS_ELECTRON } from "../../hooks/useElectron";
import {
  Map, Clock, Wallet, Star, Gift, FileText,
  Radio, TrendingUp, Truck, Activity, Users,
  DollarSign, AlertTriangle, LogOut,
  ChevronLeft, ChevronRight, Settings,
} from "lucide-react";

const NAV = {
  rider:  [
    { id:"dashboard",  icon:Map,           label:"Book Ride"       },
    { id:"history",    icon:Clock,         label:"My Rides"        },
    { id:"wallet",     icon:Wallet,        label:"Wallet"          },
    { id:"ratings",    icon:Star,          label:"Ratings"         },
    { id:"promo",      icon:Gift,          label:"Promos"          },
    { id:"complaints", icon:FileText,      label:"Support"         },
  ],
  driver: [
    { id:"dashboard",  icon:Radio,         label:"Go Live"         },
    { id:"earnings",   icon:TrendingUp,    label:"Earnings"        },
    { id:"vehicles",   icon:Truck,         label:"Vehicles"        },
    { id:"ratings",    icon:Star,          label:"Ratings"         },
    { id:"history",    icon:Clock,         label:"Trip Log"        },
  ],
  admin:  [
    { id:"dashboard",  icon:Activity,      label:"Mission Control" },
    { id:"rides",      icon:Map,           label:"Live Rides"      },
    { id:"drivers",    icon:Users,         label:"Drivers"         },
    { id:"revenue",    icon:DollarSign,    label:"Revenue"         },
    { id:"flagged",    icon:AlertTriangle, label:"Flagged"         },
  ],
};

const BOTTOM_NAV = [{ id:"settings", icon:Settings, label:"Settings" }];

function CubeLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2"  y="2"  width="9" height="9" rx="2.5" fill="white" opacity="0.95"/>
      <rect x="13" y="2"  width="9" height="9" rx="2.5" fill="white" opacity="0.50"/>
      <rect x="2"  y="13" width="9" height="9" rx="2.5" fill="white" opacity="0.50"/>
      <rect x="13" y="13" width="9" height="9" rx="2.5" fill="white" opacity="0.95"/>
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
      <button onClick={() => onNavigate(item.id)} style={{
        width:"100%", display:"flex", alignItems:"center",
        gap:10, padding: collapsed ? "11px 0" : "10px 16px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: active
          ? "linear-gradient(90deg, rgba(59,130,246,0.14), rgba(124,62,237,0.06))"
          : "transparent",
        borderLeft: `2px solid ${active ? "var(--blu2)" : "transparent"}`,
        border:"none", cursor:"pointer", transition:"all 0.18s",
        fontFamily:"var(--font-b)", borderRadius: collapsed ? 0 : "0 12px 12px 0",
        color: active ? "var(--blu3)" : "var(--t3)",
        fontSize:13, fontWeight: active ? 600 : 400,
        marginRight: collapsed ? 0 : 8,
      }}>
        <item.icon
          size={15}
          strokeWidth={active ? 2.3 : 1.8}
          color={active ? "var(--blu2)" : undefined}
        />
        {!collapsed && <span style={{ flex:1 }}>{item.label}</span>}
        {!collapsed && active && (
          <div style={{
            width:5, height:5, borderRadius:"50%",
            background:"var(--blu2)", boxShadow:"0 0 10px var(--blu2)",
          }}/>
        )}
      </button>
    );
  };

  return (
    <aside style={{
      width:         collapsed ? 64 : 220,
      minWidth:      collapsed ? 64 : 220,
      height:        "100%",
      background:    "rgba(8,12,26,0.98)",
      borderRight:   "1px solid var(--b1)",
      display:       "flex",
      flexDirection: "column",
      transition:    "width 0.28s cubic-bezier(0.4,0,0.2,1)",
      overflow:      "hidden",
      flexShrink:    0,
      position:      "relative",
    }}>
      {/* Top accent */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:2,
        background:"linear-gradient(90deg,var(--blu),var(--v2),transparent)",
        opacity:0.7,
      }}/>

      {/* Brand */}
      <div style={{
        padding:        collapsed ? "16px 0" : "16px 16px",
        display:        "flex", alignItems:"center",
        justifyContent: collapsed ? "center" : "space-between",
        borderBottom:   "1px solid var(--b1)", minHeight:60,
      }}>
        {!collapsed && (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              background:"linear-gradient(135deg,var(--blu),var(--v2))",
              borderRadius:10, padding:7, display:"flex",
              boxShadow:"0 4px 16px rgba(59,130,246,0.4)",
            }}>
              <CubeLogo size={20}/>
            </div>
            <div>
              <div style={{
                fontFamily:"var(--font-d)", fontWeight:800, fontSize:16,
                background:"linear-gradient(135deg,var(--blu2),var(--v3))",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                letterSpacing:"-0.025em",
              }}>Cubiny</div>
              <div style={{ fontSize:9, color:"var(--t4)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                {IS_ELECTRON ? "Desktop" : "Web"} · Premium
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{
            background:"linear-gradient(135deg,var(--blu),var(--v2))",
            borderRadius:9, padding:6, display:"flex",
          }}>
            <CubeLogo size={16}/>
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggle} style={{
            background:"var(--s2)", border:"1px solid var(--b2)",
            borderRadius:8, padding:5, color:"var(--t3)",
            display:"flex", cursor:"pointer",
          }}>
            <ChevronLeft size={13}/>
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={onToggle} style={{
          margin:"8px auto 0",
          background:"var(--s2)", border:"1px solid var(--b2)",
          borderRadius:8, padding:"5px 6px", color:"var(--t3)",
          display:"flex", cursor:"pointer",
        }}>
          <ChevronRight size={13}/>
        </button>
      )}

      {/* User chip */}
      <div style={{
        padding:      collapsed ? "12px 0" : "12px 16px",
        borderBottom: "1px solid var(--b1)",
        display:"flex", justifyContent: collapsed ? "center" : "flex-start",
        alignItems:"center", gap:10,
      }}>
        <Avatar initials={user?.avatar ?? "?"} size={collapsed ? 30 : 36}
          status={role === "driver" ? "online" : undefined}/>
        {!collapsed && (
          <div style={{ overflow:"hidden", flex:1 }}>
            <div style={{
              fontSize:13, fontWeight:600, whiteSpace:"nowrap",
              overflow:"hidden", textOverflow:"ellipsis", color:"var(--t1)",
            }}>{user?.name}</div>
            <div style={{
              fontSize:9, color:"var(--t4)", marginTop:1,
              textTransform:"uppercase", letterSpacing:"0.07em",
            }}>
              <span style={{ color:"var(--blu3)" }}>{role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav style={{ flex:1, padding:"8px 0", overflowY:"auto" }}>
        {!collapsed && (
          <div style={{
            padding:"8px 16px 4px",
            fontSize:9, color:"var(--t4)",
            textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:700,
          }}>Navigation</div>
        )}
        {navItems.map(item => <NavBtn key={item.id} item={item}/>)}
      </nav>

      {/* Bottom nav */}
      <div style={{ borderTop:"1px solid var(--b1)", paddingTop:4, paddingBottom:4 }}>
        {BOTTOM_NAV.map(item => <NavBtn key={item.id} item={item}/>)}
      </div>

      {/* Logout */}
      <div style={{ padding: collapsed ? "10px 0" : "10px 16px", borderTop:"1px solid var(--b1)" }}>
        <button onClick={logout} style={{
          width:"100%", display:"flex", alignItems:"center",
          gap:8, justifyContent: collapsed ? "center" : "flex-start",
          background:"none", border:"none", color:"var(--t4)",
          fontSize:13, padding:"8px 0", cursor:"pointer",
          fontFamily:"var(--font-b)", transition:"color 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--t4)"}
        >
          <LogOut size={14}/>
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
