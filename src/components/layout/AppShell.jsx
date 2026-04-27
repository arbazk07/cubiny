// src/components/layout/AppShell.jsx
// ─────────────────────────────────────────────────────────────────
// Root layout for all authenticated views.
// Owns sidebar collapse state + screen routing.
// PAGE_REGISTRY enforces DCL: only mapped roles can reach a screen.
// ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useAuth }  from "../../hooks/useAuth";
import { Sidebar }  from "./Sidebar";

// ── Rider pages ──────────────────────────────────────────────────
import { RiderDashboard } from "../../pages/rider/RiderDashboard";
import { HistoryPage }    from "../../pages/rider/HistoryPage";
import { WalletPage }     from "../../pages/rider/WalletPage";
import { RatingsPage }    from "../../pages/rider/RatingsPage";
import { PromoPage }      from "../../pages/rider/PromoPage";
import { ComplaintsPage } from "../../pages/rider/ComplaintsPage";

// ── Driver pages ─────────────────────────────────────────────────
import { DriverDashboard }  from "../../pages/driver/DriverDashboard";
import { EarningsPage }     from "../../pages/driver/EarningsPage";
import { VehiclesPage }     from "../../pages/driver/VehiclesPage";
import { DriverRatingsPage} from "../../pages/driver/DriverRatingsPage";

// ── Admin pages ──────────────────────────────────────────────────
import { AdminPanel } from "../../pages/admin/AdminPanel";

// ── DCL-enforced registry ────────────────────────────────────────
// Keys = screen id. Values = { role: Component }.
// A role NOT listed for a screen gets <NotAuthorized />.
const PAGE_REGISTRY = {
  dashboard:  { rider: RiderDashboard,  driver: DriverDashboard,  admin: AdminPanel      },
  history:    { rider: HistoryPage,     driver: HistoryPage                              },
  wallet:     { rider: WalletPage                                                        },
  ratings:    { rider: RatingsPage,     driver: DriverRatingsPage                       },
  promo:      { rider: PromoPage                                                         },
  complaints: { rider: ComplaintsPage                                                    },
  earnings:   { driver: EarningsPage                                                     },
  vehicles:   { driver: VehiclesPage                                                     },
  rides:      { admin: AdminPanel                                                        },
  drivers:    { admin: AdminPanel                                                        },
  revenue:    { admin: AdminPanel                                                        },
  flagged:    { admin: AdminPanel                                                        },
};

function NotAuthorized() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "var(--clr-txt-3)" }}>
      <span style={{ fontSize: 40 }}>🔒</span>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--clr-txt)" }}>Not authorized</p>
      <p style={{ fontSize: 13 }}>You don't have permission to view this page.</p>
    </div>
  );
}

export function AppShell() {
  const { user }                    = useAuth();
  const [screen,    setScreen]      = useState("dashboard");
  const [collapsed, setCollapsed]   = useState(false);

  const role          = user?.role;
  const pageMap       = PAGE_REGISTRY[screen];
  const PageComponent = pageMap?.[role];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        activeScreen={screen}
        onNavigate={setScreen}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <main style={{ flex: 1, overflow: "hidden", position: "relative" }} className="mesh-bg">
        {PageComponent ? <PageComponent /> : <NotAuthorized />}
      </main>
    </div>
  );
}
