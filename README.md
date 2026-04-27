# Cubiny — Iteration 2: API & Service Layer

Premium ride-hailing platform. Rebranded from IzenRides to **Cubiny**.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Demo Login
Click any tab (Rider / Driver / Admin) → Sign In with any credentials.

## What's New in Iteration 2

### Rebranding
- App name: **Cubiny** throughout
- New cube-grid logo (4-square motif)
- Refined dark palette: deeper bg (#050510), cleaner type ramp
- Split-panel auth page with feature highlights

### Service Layer (`/src/services/`)
| File | Purpose |
|---|---|
| `api.js` | Axios instance with JWT interceptor, 401 handler, dev logging |
| `mockService.js` | Async wrappers for all data — mirrors real API signatures |
| `fareService.js` | Surge pricing formula from PDF §4 |
| `ratingService.js` | Driver flag trigger logic from PDF §5 |
| `index.js` | Barrel export |

### UI/UX Upgrades
- **Auth**: Two-column layout — branding panel + login form
- **StatCards**: Corner glow, trend indicators (↑/↓%)
- **Sidebar**: Cube logo, hover red on logout, active dot indicator
- **DriverDashboard**: Circular countdown timer, session stats strip
- **AdminPanel**: Suspend button per flagged driver (calls mockService)
- **WalletPage**: Coloured debit/credit transaction rows
- **RatingsPage**: Star distribution bar chart
- **PromoPage**: Copy-to-clipboard button on codes
- **LoadingSpinner**: Consistent async loading state across all pages

### Iteration 3 Swap Guide
Every `mockService` function has a comment showing the real `api.js` call:
```js
// Before (Iteration 2):
export async function login(role) { ... MOCK_USERS[role] ... }

// After (Iteration 3):
export async function login(email, password) {
  return api.post('/auth/login', { email, password });
}
```

## PDF Module Coverage
| PDF Module | Implementation |
|---|---|
| §1 User Management (DCL) | AuthContext + AppShell PAGE_REGISTRY |
| §2 Ride Management | RiderDashboard 6-state machine → mockService.requestRide() |
| §3 Driver & Vehicle | DriverDashboard → setDriverAvailability(); VehiclesPage → registerVehicle() |
| §4 Fare & Payment (Surge) | fareService.calcFare() + getSurgeMultiplier() |
| §5 Ratings Trigger (<3.5★) | ratingService.checkDriverRatingTrigger() |
| §6 Admin Reports | AdminPanel → getPlatformStats(), getFlaggedDrivers(), updateDriverStatus() |

## Iteration Roadmap
- ✅ Iteration 1 — Modular file structure
- ✅ **Iteration 2 — Service layer + Cubiny rebrand (current)**
- ⬜ Iteration 3 — Real MySQL/Node.js backend connection
- ⬜ Iteration 4 — Electron desktop packaging
