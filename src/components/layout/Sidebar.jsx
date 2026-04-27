// src/components/layout/Sidebar.jsx
import { useAuth } from "../../hooks/useAuth";
import { Avatar }  from "../ui/Avatar";
import {
  Car, Map, Clock, Wallet, Star, Gift, FileText,
  Radio, TrendingUp, Truck, Activity, Users,
  DollarSign, AlertTriangle, LogOut, Menu,
} from "lucide-react";

const NAV = {
  rider: [
    { id: "dashboard",  icon: Map,           label: "Book Ride"        },
    { id: "history",    icon: Clock,         label: "My Rides"         },
    { id: "wallet",     icon: Wallet,        label: "Wallet"           },
    { id: "ratings",    icon: Star,          label: "Ratings"          },
    { id: "promo",      icon: Gift,          label: "Promos"           },
    { id: "complaints", icon: FileText,      label: "Support"          },
  ],
  driver: [
    { id: "dashboard",  icon: Radio,         label: "Go Live"          },
    { id: "earnings",   icon: TrendingUp,    label: "Earnings"         },
    { id: "vehicles",   icon: Truck,         label: "Vehicles"         },
    { id: "ratings",    icon: Star,          label: "Ratings"          },
    { id: "history",    icon: Clock,         label: "Trip Log"         },
  ],
  admin: [
    { id: "dashboard",  icon: Activity,      label: "Mission Control"  },
    { id: "rides",      icon: Map,           label: "Live Rides"       },
    { id: "drivers",    icon: Users,         label: "Drivers"          },
    { id: "revenue",    icon: DollarSign,    label: "Revenue"          },
    { id: "flagged",    icon: AlertTriangle, label: "Flagged"          },
  ],
};

export function Sidebar({ activeScreen, onNavigate, collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const role     = user?.role;
  const navItems = NAV[role] ?? [];

  return (
    <aside
      style={{
        width:         collapsed ? 64 : 220,
        minWidth:      collapsed ? 64 : 220,
        height:        "100vh",
        background:    "rgba(6,6,15,0.97)",
        borderRight:   "1px solid var(--clr-bor)",
        display:       "flex",
        flexDirection: "column",
        transition:    "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        overflow:      "hidden",
        flexShrink:    0,
      }}
    >
      {/* ── Brand ── */}
      <div style={{
        padding:      collapsed ? "20px 14px" : "20px",
        display:      "flex",
        alignItems:   "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--clr-bor)",
      }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              background:   "linear-gradient(135deg, var(--clr-violet), var(--clr-cyan))",
              borderRadius: 10, padding: 7, display: "flex",
            }}>
              <Car size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, background: "linear-gradient(135deg,var(--clr-violet-2),var(--clr-cyan-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              IzenRides
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            marginLeft:   collapsed ? "auto" : 0,
            background:   "var(--clr-sur)",
            border:       "1px solid var(--clr-bor)",
            borderRadius: 8, padding: 6,
            color:        "var(--clr-txt-2)",
            display:      "flex",
          }}
        >
          <Menu size={14} />
        </button>
      </div>

      {/* ── User badge ── */}
      <div style={{
        padding:      collapsed ? "12px 0" : "14px 20px",
        borderBottom: "1px solid var(--clr-bor)",
      }}>
        {collapsed ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Avatar initials={user?.avatar} size={32} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials={user?.avatar} size={38} />
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name}
              </div>
              <span className="pill pill-violet" style={{ fontSize: 10 }}>{role}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Nav items ── */}
      <nav style={{ flex: 1, paddingTop: 12, paddingBottom: 12, overflowY: "auto" }}>
        {navItems.map((item) => {
          const active = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width:          "100%",
                display:        "flex",
                alignItems:     "center",
                gap:            12,
                padding:        collapsed ? "10px 0" : "10px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                background:     active ? "rgba(124,58,237,0.12)" : "transparent",
                borderLeft:     active ? "2px solid var(--clr-violet-2)" : "2px solid transparent",
                border:         "none",
                color:          active ? "var(--clr-violet-3)" : "var(--clr-txt-2)",
                fontSize:       13,
                fontWeight:     active ? 600 : 400,
                cursor:         "pointer",
                transition:     "all 0.15s",
              }}
            >
              <item.icon size={16} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div style={{ padding: collapsed ? "12px 0" : "12px 20px", borderTop: "1px solid var(--clr-bor)" }}>
        <button
          onClick={logout}
          style={{
            width:          "100%",
            display:        "flex",
            alignItems:     "center",
            gap:            10,
            justifyContent: collapsed ? "center" : "flex-start",
            background:     "none",
            border:         "none",
            color:          "var(--clr-txt-3)",
            fontSize:       13,
            padding:        "8px 0",
            cursor:         "pointer",
          }}
        >
          <LogOut size={14} />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
