// src/components/layout/AppShell.jsx — Cubiny v6
import { useState } from 'react';
import { useAuth }  from '../../hooks/useAuth';
import { TitleBar } from './TitleBar';
import { Sidebar }  from './Sidebar';

import { RiderDashboard }    from '../../pages/rider/RiderDashboard';
import { HistoryPage }       from '../../pages/rider/HistoryPage';
import { WalletPage }        from '../../pages/rider/WalletPage';
import { RatingsPage }       from '../../pages/rider/RatingsPage';
import { PromoPage }         from '../../pages/rider/PromoPage';
import { ComplaintsPage }    from '../../pages/rider/ComplaintsPage';
import { DriverDashboard }   from '../../pages/driver/DriverDashboard';
import { EarningsPage }      from '../../pages/driver/EarningsPage';
import { VehiclesPage }      from '../../pages/driver/VehiclesPage';
import { DriverRatingsPage } from '../../pages/driver/DriverRatingsPage';
import { AdminPanel }        from '../../pages/admin/AdminPanel';
import { DesktopSettings }   from '../../pages/desktop/DesktopSettings';

const PAGES = {
  dashboard:  { rider:RiderDashboard, driver:DriverDashboard, admin:AdminPanel },
  history:    { rider:HistoryPage,    driver:HistoryPage },
  wallet:     { rider:WalletPage },
  ratings:    { rider:RatingsPage,   driver:DriverRatingsPage },
  promo:      { rider:PromoPage },
  complaints: { rider:ComplaintsPage },
  earnings:   { driver:EarningsPage },
  vehicles:   { driver:VehiclesPage },
  rides:      { admin:AdminPanel },
  drivers:    { admin:AdminPanel },
  revenue:    { admin:AdminPanel },
  flagged:    { admin:AdminPanel },
  settings:   { rider:DesktopSettings, driver:DesktopSettings, admin:DesktopSettings },
};

function Unauthorized() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12 }}>
      <span style={{ fontSize:40 }}>🔒</span>
      <p style={{ fontSize:18, fontWeight:700, color:'var(--text-primary)' }}>Access Denied</p>
      <p style={{ fontSize:13, color:'var(--text-muted)' }}>Your role doesn't have access to this page.</p>
    </div>
  );
}

export function AppShell() {
  const { user } = useAuth();
  const [screen, setScreen]   = useState('dashboard');
  const [collapsed, setCollapse] = useState(false);
  const Page = PAGES[screen]?.[user?.role];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg)' }}>
      <TitleBar/>
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar
          activeScreen={screen} onNavigate={setScreen}
          collapsed={collapsed} onToggle={() => setCollapse(c => !c)}
        />
        <main style={{ flex:1, overflow:'hidden', position:'relative', background:'var(--bg)' }}>
          {Page ? <Page/> : <Unauthorized/>}
        </main>
      </div>
    </div>
  );
}
