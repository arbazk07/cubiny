# IzenRides — Iteration 1: Modular React Architecture

Premium ride-hailing frontend built with Vite + React + Tailwind CSS.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:3000
```

## Login Credentials (Demo)
Click any tab and press **Sign In** — no real credentials needed.

| Tab    | Access                                     |
|--------|--------------------------------------------|
| Rider  | Book rides, wallet, ratings, promos        |
| Driver | Go Live toggle, earnings chart, vehicles   |
| Admin  | Mission Control, live rides, flagged panel |

## Project Structure

```
src/
├── components/
│   ├── ui/          → Button, Input, Modal, StatCard, Avatar, StatusPill
│   ├── layout/      → Sidebar, AppShell (DCL enforcement)
│   └── map/         → MockMap SVG (replace with Leaflet in Iteration 4)
├── pages/
│   ├── Auth/        → AuthPage, LoginForm
│   ├── rider/       → RiderDashboard, HistoryPage, WalletPage, RatingsPage, PromoPage, ComplaintsPage
│   ├── driver/      → DriverDashboard, EarningsPage, VehiclesPage, DriverRatingsPage
│   └── admin/       → AdminPanel
├── context/         → AuthContext (role-based state)
├── hooks/           → useAuth
├── styles/          → globals.css, tokens.css
└── data/            → mockData.js (replaced by /services in Iteration 2)
```

## PDF Module Coverage

| PDF Module                     | Implementation                                     |
|--------------------------------|----------------------------------------------------|
| §1 User Management (DCL)       | AuthContext roles + AppShell PAGE_REGISTRY         |
| §2 Ride Management             | RiderDashboard state machine (6 states)            |
| §3 Driver & Vehicle Management | DriverDashboard + VehiclesPage                     |
| §4 Fare & Payment (Surge)      | calcFare() + getSurgeMultiplier() in RiderDashboard|
| §5 Ratings Trigger (<3.5)      | checkRatingTrigger() in DriverDashboard            |
| §6 Admin Reports               | AdminPanel with live stats + flagged list          |

## Iteration Roadmap

- ✅ **Iteration 1** — Modular file structure (current)
- ⬜ **Iteration 2** — API & Service layer (axios + mockService)
- ⬜ **Iteration 3** — Full DB logic (surge pricing, triggers, DCL)
- ⬜ **Iteration 4** — Electron desktop packaging
