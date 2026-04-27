// src/components/layout/AppShell.jsx  —  Cubiny v2
import { useState } from "react";
import { useAuth }  from "../../hooks/useAuth";
import { Sidebar }  from "./Sidebar";

import { RiderDashboard } from "../../pages/rider/RiderDashboard";
import { HistoryPage }    from "../../pages/rider/HistoryPage";
import { WalletPage }     from "../../pages/rider/WalletPage";
import { RatingsPage }    from "../../pages/rider/RatingsPage";
import { PromoPage }      from "../../pages/rider/PromoPage";
import { ComplaintsPage } from "../../pages/rider/ComplaintsPage";

import { DriverDashboard }   from "../../pages/driver/DriverDashboard";
import { EarningsPage }      from "../../pages/driver/EarningsPage";
import { VehiclesPage }      from "../../pages/driver/VehiclesPage";
import { DriverRatingsPage } from "../../pages/driver/DriverRatingsPage";

import { AdminPanel } from "../../pages/admin/AdminPanel";

// DCL-enforced page registry (mirrors MySQL GRANT/REVOKE)
const PAGES = {
  dashboard:  { rider:RiderDashboard,   driver:DriverDashboard,  admin:AdminPanel },
  history:    { rider:HistoryPage,       driver:HistoryPage                        },
  wallet:     { rider:WalletPage                                                   },
  ratings:    { rider:RatingsPage,       driver:DriverRatingsPage                 },
  promo:      { rider:PromoPage                                                    },
  complaints: { rider:ComplaintsPage                                               },
  earnings:   { driver:EarningsPage                                                },
  vehicles:   { driver:VehiclesPage                                                },
  rides:      { admin:AdminPanel                                                   },
  drivers:    { admin:AdminPanel                                                   },
  revenue:    { admin:AdminPanel                                                   },
  flagged:    { admin:AdminPanel                                                   },
};

function Unauthorized() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:14, color:"var(--t3)" }}>
      <div style={{ fontSize:44, filter:"grayscale(1)" }}>🔒</div>
      <p style={{ fontFamily:"var(--font-d)", fontSize:20, color:"var(--t2)" }}>Access Denied</p>
      <p style={{ fontSize:13 }}>Your role does not have permission to view this page.</p>
    </div>
  );
}

export function AppShell() {
  const { user }                  = useAuth();
  const [screen,    setScreen]    = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const role      = user?.role;
  const Page      = PAGES[screen]?.[role];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      <Sidebar activeScreen={screen} onNavigate={setScreen}
        collapsed={collapsed} onToggle={()=>setCollapsed(c=>!c)}/>
      <main style={{ flex:1, overflow:"hidden", position:"relative" }} className="mesh">
        {Page ? <Page/> : <Unauthorized/>}
      </main>
    </div>
  );
}
