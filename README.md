# Cubiny Desktop — Iteration 5 🚀

> **Premium Ride-Hailing Platform** — Electron + React + Node.js/MySQL

---

## 🐛 Bug Fixes (Iteration 5)

### Critical Bugs Fixed

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `LoginForm.jsx` | **Broken Auth** — clicking Sign In bypassed validation entirely | Added `validate()` function with regex email check + 6-char password minimum. `handleSubmit` returns early on any validation error, **never** calling `login()` |
| 2 | `AuthContext.jsx` | **Session not restored** — `useState(null)` reset user on every reload | Changed to `useState(restoreUser)` which parses + validates `cubiny_user` from localStorage on cold start |
| 3 | `MockMap.jsx` | **Broken Map** — fake SVG with no real tiles, no interactivity | Replaced entirely with `LiveMap.jsx` using `react-leaflet` + OpenStreetMap/CartoDB dark tiles. Real draggable map, clickable driver markers, GPS polyline route. No API key required. |
| 4 | `AuthPage.jsx` | **Broken Landing Layout** — flex columns collapsed on narrow Electron windows | Rebuilt with CSS Grid `gridTemplateColumns: "minmax(380px,1fr) minmax(380px,480px)"` — guaranteed minimum column width |
| 5 | `RiderDashboard.jsx` | **Instant Ride Completion** — all `setTimeout` IDs untracked, stale closures caused instant jumps | Tracked all IDs in `useRef`, added `clearAllTimeouts()` called before each new booking AND on unmount. Realistic durations: 3s→6s→11s→19s |
| 6 | `mockService.js` | **Mock auth bypass** — `login()` in mock mode accepted any call without credentials | Added server-side mock validation: throws if `email` or `password` empty or password < 6 chars |
| 7 | `mockData.js` | **Crash on WalletPage** — `MOCK_WALLET_TRANSACTIONS` imported but never exported | Added complete `MOCK_WALLET_TRANSACTIONS` array with proper transaction shapes |
| 8 | `fareService.js` | **NaN fares** — passing `undefined` for distanceKm rendered `Rs. NaN` | Added `Math.max(0, Number(x) || 0)` guard on all numeric inputs |
| 9 | `api.js` | **Ghost sessions after 401** — expired tokens silently failed | Added response interceptor: clears localStorage and reloads on 401, normalizes all API error messages |
| 10 | `App.jsx` | **No error boundary** — any render crash white-screened the entire app | Added class-based `ErrorBoundary` wrapping `<Router>` with a "Try Again" button |
| 11 | `useAuth.js` | **Silent null context** — using hook outside provider caused cryptic errors | Added guard: throws descriptive error if `AuthContext` is null |
| 12 | `RiderDashboard.jsx` | **Hardcoded driver data** — name, plate, rating scattered as string literals | Now reads from `MOCK_USERS.driver` and `MOCK_INCOMING_RIDE` — single source of truth |

---

## 🎨 UI/UX Rebranding (Iteration 5)

### Color Palette
- **Primary**: Electric Blue `#3b82f6` / `#60a5fa` — buttons, active states, map route
- **Premium**: Vivid Purple `#7c3aed` / `#8b5cf6` — brand, modals, gradients
- **Active Rides**: Emerald Green `#10b981` / `#34d399` — completed states, online status
- **Background**: Deep Navy `#0a0f1e` → `#0f1629` (replaced muddy `#050510`)

### Typography
- **Display**: Syne (headers, brand name)
- **Body**: Plus Jakarta Sans (replaced DM Sans — more premium feel)
- **Mono**: JetBrains Mono (ride IDs, codes)

### Glassmorphism
- All cards use `backdrop-filter: blur(28px) saturate(180%)`
- Login card has layered glass panel with top gradient accent stripe
- Status floating pill on map uses liquid glass blur

### Animations
- Buttons: `translateY(-2px)` lift + dynamic glow shadow on hover
- Ride state transitions: `animate-fade-up` and `animate-bounce-in`
- Driver online toggle: CSS animated `glowG` pulse
- StatCards: `translateY(-2px)` hover lift

---

## 🔧 Setup & Running

```bash
# 1. Install deps (includes react-leaflet)
npm install

# 2. Copy env
cp .env.example .env
# Set VITE_USE_MOCK=true for local demo

# 3. Run (web only, no Electron)
npm run vite

# 4. Run as full desktop app
npm run dev

# 5. Build installer
npm run dist
```

### Environment Variables
```
VITE_API_URL=http://localhost:4000/api   # Your Node.js backend
VITE_USE_MOCK=true                        # true = no backend needed
```

### Mock Mode Demo Credentials
- **Rider**: any email + any password (6+ chars)
- **Driver**: any email + any password (6+ chars)
- **Admin**: any email + any password (6+ chars)

---

## 📁 Project Structure

```
src/
├── App.jsx                    ← Error Boundary + Router
├── main.jsx
├── context/AuthContext.jsx    ← Session restore fix
├── hooks/
│   ├── useAuth.js             ← Guard against null context
│   └── useElectron.js
├── services/
│   ├── api.js                 ← 401 interceptor, error normalization
│   ├── mockService.js         ← Mock-level credential validation
│   ├── fareService.js         ← NaN guard
│   └── ratingService.js
├── data/mockData.js           ← Added MOCK_WALLET_TRANSACTIONS
├── components/
│   ├── map/LiveMap.jsx        ← Real react-leaflet map (replaces MockMap)
│   ├── layout/
│   │   ├── AppShell.jsx
│   │   ├── Sidebar.jsx        ← Electric Blue active states
│   │   └── TitleBar.jsx
│   └── ui/
│       ├── Button.jsx         ← Glow shadows, lift animation
│       ├── Input.jsx          ← Field-level error display
│       ├── StatCard.jsx       ← Hover lift effect
│       ├── Modal.jsx          ← Escape key close, gradient accent
│       ├── StatusPill.jsx
│       ├── Avatar.jsx
│       └── LoadingSpinner.jsx ← Layered dual-ring animation
├── pages/
│   ├── Auth/
│   │   ├── AuthPage.jsx       ← CSS Grid layout fix
│   │   └── LoginForm.jsx      ← Strict form validation
│   ├── rider/RiderDashboard.jsx ← Lifecycle fix, useRef timeouts
│   └── ...
└── styles/
    ├── tokens.css             ← New Electric Blue + Navy palette
    └── globals.css            ← Premium glassmorphism, animations
```

---

## 🗄️ Database Schema Reference

| Table | Key Fields |
|-------|-----------|
| `USERS` | `user_id`, `name`, `email`, `role`, `wallet_balance`, `rating` |
| `DRIVERS` | `driver_id`, `user_id`, `license_no`, `availability_status`, `verified` |
| `VEHICLES` | `vehicle_id`, `driver_id`, `make`, `model`, `plate`, `type` |
| `RIDE_REQUESTS` | `ride_id`, `rider_id`, `driver_id`, `pickup_location`, `dropoff_location`, `status`, `fare` |
| `PAYMENTS` | `payment_id`, `ride_id`, `amount`, `method`, `status` |

---

© 2026 Cubiny Technologies
