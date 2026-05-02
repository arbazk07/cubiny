<div align="center">

<br/>

<img src="https://img.shields.io/badge/version-7.0.0-22C55E?style=for-the-badge&labelColor=111827" alt="Version"/>
<img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-2563EB?style=for-the-badge&labelColor=111827" alt="Platform"/>
<img src="https://img.shields.io/badge/stack-Electron%20%2B%20React%20%2B%20Node.js-F59E0B?style=for-the-badge&labelColor=111827" alt="Stack"/>
<img src="https://img.shields.io/badge/license-MIT-6B7280?style=for-the-badge&labelColor=111827" alt="License"/>

<br/><br/>

# 🟩 Cubiny — Premium Ride-Hailing Platform

**A production-grade, cross-platform desktop ride-hailing application.**  
Built with Electron + React + Node.js + MySQL. Inspired by Uber, Careem, and Yango.

[Features](#-features) · [Screenshots](#-ui-overview) · [Quick Start](#-quick-start) · [Database Setup](#-database-setup) · [Architecture](#-architecture) · [Bug Fixes](#-bug-fixes-log) · [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Features](#-features)
4. [UI Overview](#-ui-overview)
5. [Prerequisites](#-prerequisites)
6. [Quick Start (Mock Mode)](#-quick-start)
7. [Full Stack Setup](#-full-stack-setup)
8. [Database Setup](#-database-setup)
9. [Environment Variables](#-environment-variables)
10. [Project Structure](#-project-structure)
11. [Available Scripts](#-available-scripts)
12. [Building Installers](#-building-installers)
13. [Bug Fixes Log](#-bug-fixes-log)
14. [Design System](#-design-system)
15. [Contributing](#-contributing)
16. [License](#-license)

---

## 🧭 Project Overview

Cubiny is a **full-featured ride-hailing desktop application** that replicates the core product experience of modern mobility platforms. It is built as an Electron-wrapped React SPA, with a Node.js/Express REST API backend and a MySQL (Aiven) database.

The codebase handles the complete lifecycle of a ride:

```
Rider books → Driver accepts → En Route → In Progress → Completed → Rated
```

Three distinct user roles are supported with separate dashboards:

| Role   | Capabilities |
|--------|-------------|
| **Rider**  | Book rides, track driver live, manage wallet, view history, apply promos |
| **Driver** | Go online, accept/decline requests, track earnings, manage vehicle |
| **Admin**  | Mission control dashboard, live rides map, driver management, revenue analytics |

---

## 🛠 Tech Stack

### Frontend (Desktop App)
| Technology | Version | Purpose |
|------------|---------|---------|
| **Electron** | ^30.0.1 | Cross-platform desktop wrapper |
| **React** | ^18.2.0 | UI framework |
| **Vite** | ^5.1.6 | Build tool & dev server |
| **Tailwind CSS** | ^3.4.1 | Utility-first styling |
| **react-leaflet** | ^4.2.1 | Interactive map (OpenStreetMap, no API key) |
| **Leaflet** | ^1.9.4 | Map engine |
| **lucide-react** | ^0.363.0 | Icon library |
| **axios** | ^1.6.8 | HTTP client |
| **clsx** | ^2.1.0 | Conditional className utility |

### Backend (API Server)
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ≥18.x | Runtime |
| **Express.js** | ^4.x | REST API framework |
| **MySQL2** | ^3.x | Database driver |
| **JWT** | — | Authentication tokens |
| **bcrypt** | — | Password hashing |

### Database
| Technology | Purpose |
|------------|---------|
| **MySQL 8.x** | Primary database (local or Aiven Cloud) |

### Dev Toolchain
| Tool | Purpose |
|------|---------|
| **electron-builder** | Package to `.exe`, `.dmg`, `.AppImage` |
| **concurrently** | Run Vite + Electron in parallel |
| **wait-on** | Wait for Vite to be ready before launching Electron |
| **cross-env** | Cross-platform `NODE_ENV` setting |
| **PostCSS + Autoprefixer** | CSS processing |

---

## ✨ Features

### Rider Dashboard
- 🗺️ **Full-screen interactive map** (CartoDB Positron light tiles, no API key needed)
- 📍 **420px Command Panel** — docked booking interface with weight and authority
- 🚗 **Yango-style vehicle cards** — large tappable Economy / Premium / Bike with live fare estimates
- ⚡ **Surge pricing engine** — time-of-day multipliers with visual indicators
- 🔄 **Simulated ride lifecycle** — `Requested → Found → En Route → In Progress → Completed`
- 🚗 **Expanded driver card** — name, plate number, rating, Call + Chat buttons when En Route
- ⭐ **Post-ride rating modal** — 5-star rating with comment, graceful completion
- 💳 **Wallet page** — balance card, transaction history, top-up modal (JazzCash / EasyPaisa)
- 🎁 **Promo codes** — apply discount codes, view active/used promotions
- 📋 **Support tickets** — submit complaints by category, track ticket status

### Driver Dashboard
- 📡 **Go Online / Offline toggle** — real availability status with Electron tray sync
- 🔔 **Incoming ride modal** — 30-second countdown, Accept / Decline
- 📊 **Earnings bar chart** — pixel-accurate weekly breakdown with peak-day highlight
- 🚙 **Vehicle management** — register vehicles, track verification status
- ⭐ **Rating overview** — distribution chart, individual rider reviews

### Admin Panel
- 📡 **Mission Control** — live active-rides table with real-time status pills
- 💰 **Revenue analytics** — payment method breakdown (Cash / Wallet / Card)
- 👮 **Driver moderation** — flagged driver table with one-click Suspend action
- 📈 **Platform statistics** — total revenue, active rides, rider/driver counts

### Authentication
- 🔐 **Role-based login** — Rider / Driver / Admin tabs
- ✅ **Strict validation** — email regex + 6-char minimum enforced on both client and mock-server
- 💾 **Session persistence** — `localStorage` restore on cold start (no re-login on reload)
- 🔄 **Auto-logout on 401** — expired tokens auto-clear and redirect

### Landing Page
- 🎯 **Functional hero** — live booking widget (pickup/dropoff/type) in the hero section
- 🧾 **Pricing section** — Economy / Premium / Bike cards with per-km rates
- 📣 **Trust signals** — stats, feature cards, testimonials, CTA footer

---

## 🖼 UI Overview

### Landing Page
- Split hero: marketing copy left, **live booking estimate widget** right
- Dark stats strip: riders, drivers, total rides, Rs.0 hidden fees
- Feature cards, ride-type pricing grid, CTA footer

### Login Page
- Separate from landing — "Back to home" navigation
- Role selector tabs (Rider / Driver / Admin)
- Clean white card with field-level error display

### Rider Dashboard
- **Map**: Full-screen CartoDB light tiles with GPS route polyline and driver markers
- **Command Panel** (420px): Booking → Searching spinner → Driver card → Completed state
- **Ride Stepper**: 5-step progress bar with animated fill connectors

### Driver Dashboard
- Stats grid (earnings, rating, trips), weekly bar chart, profile card
- Incoming ride request modal with countdown timer

### Admin Panel
- Live rides table, revenue donut bars, flagged drivers table

---

## 🔧 Prerequisites

Before you start, make sure you have the following installed:

| Requirement | Minimum Version | Check |
|-------------|----------------|-------|
| **Node.js** | 18.x LTS | `node --version` |
| **npm** | 9.x | `npm --version` |
| **Git** | any | `git --version` |
| **MySQL** | 8.x (optional — mock mode works without it) | `mysql --version` |

> **Windows users**: You may need [Windows Build Tools](https://www.npmjs.com/package/windows-build-tools) for native Electron modules.  
> Run: `npm install -g windows-build-tools` (as Administrator)

---

## 🚀 Quick Start

### Option A — Mock Mode (No Backend Needed)

This is the fastest way to run Cubiny. Everything works with fake data — no MySQL or Node.js backend required.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/cubiny.git
cd cubiny/cubiny-desktop

# 2. Install dependencies
npm install

# 3. Confirm mock mode is enabled (default)
# In .env:
#   VITE_USE_MOCK=true

# 4a. Run as a web app (browser)
npm run vite
# → Open http://localhost:3000

# 4b. Run as full Electron desktop app
npm run dev
```

#### Mock Login Credentials

| Role   | Email (any valid format) | Password (any 6+ chars) |
|--------|--------------------------|-------------------------|
| Rider  | `aisha@cubiny.pk`       | `cubiny123`             |
| Driver | `hassan@cubiny.pk`      | `cubiny123`             |
| Admin  | `admin@cubiny.pk`       | `cubiny123`             |

> In mock mode, **any** correctly-formatted email and any password of 6+ characters will authenticate successfully for the selected role.

---

## 🔌 Full Stack Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/cubiny.git
cd cubiny
```

The repository has two main directories:

```
cubiny/
├── cubiny-desktop/     ← Electron + React frontend
└── cubiny-backend/     ← Node.js + Express API (separate repo or folder)
```

### Step 2 — Install Frontend Dependencies

```bash
cd cubiny-desktop
npm install
```

> This installs all dependencies including `react-leaflet`, `leaflet`, `electron`, `tailwindcss`, and `electron-builder`.

### Step 3 — Install Backend Dependencies

```bash
cd ../cubiny-backend
npm install
```

### Step 4 — Configure Environment Variables

See [Environment Variables](#-environment-variables) section below.

### Step 5 — Set Up the Database

See [Database Setup](#-database-setup) section below.

### Step 6 — Start the Backend

```bash
cd cubiny-backend
npm run dev
# → API running at http://localhost:4000
```

### Step 7 — Start the Frontend

```bash
cd cubiny-desktop

# Web only (browser)
npm run vite

# Full Electron desktop app
npm run dev
```

---

## 🗄 Database Setup

### Option A — Local MySQL

1. **Install MySQL 8.x** from [mysql.com](https://dev.mysql.com/downloads/)

2. **Log in to MySQL**:
   ```bash
   mysql -u root -p
   ```

3. **Create the database**:
   ```sql
   CREATE DATABASE cubiny_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'cubiny_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON cubiny_db.* TO 'cubiny_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Run the schema**:
   ```bash
   mysql -u cubiny_user -p cubiny_db < sql/schema.sql
   ```

5. **Seed demo data**:
   ```bash
   node sql/seed.js
   ```

### Option B — Aiven MySQL (Cloud)

1. Create a free MySQL service at [aiven.io](https://aiven.io)
2. Download the **CA Certificate** from your Aiven dashboard
3. Add to your backend `.env`:
   ```env
   DB_HOST=your-service.aivencloud.com
   DB_PORT=12345
   DB_USER=avnadmin
   DB_PASSWORD=your_aiven_password
   DB_NAME=cubiny_db
   DB_SSL_CA=./certs/ca.pem
   ```

### Database Schema

The MySQL schema manages five core tables:

```sql
-- Users (riders, drivers, admins)
CREATE TABLE USERS (
  user_id        INT PRIMARY KEY AUTO_INCREMENT,
  name           VARCHAR(100)        NOT NULL,
  email          VARCHAR(150) UNIQUE NOT NULL,
  password_hash  VARCHAR(255)        NOT NULL,
  role           ENUM('rider','driver','admin') NOT NULL,
  wallet_balance DECIMAL(10,2)       DEFAULT 0.00,
  rating         DECIMAL(3,2)        DEFAULT 5.00,
  account_status ENUM('Active','Suspended','Pending') DEFAULT 'Active',
  created_at     TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- Drivers (extends USERS)
CREATE TABLE DRIVERS (
  driver_id           INT PRIMARY KEY AUTO_INCREMENT,
  user_id             INT UNIQUE NOT NULL REFERENCES USERS(user_id),
  license_no          VARCHAR(50),
  cnic                VARCHAR(20),
  availability_status ENUM('Online','Offline') DEFAULT 'Offline',
  verified            BOOLEAN DEFAULT FALSE,
  total_trips         INT     DEFAULT 0
);

-- Vehicles
CREATE TABLE VEHICLES (
  vehicle_id          INT PRIMARY KEY AUTO_INCREMENT,
  driver_id           INT NOT NULL REFERENCES DRIVERS(driver_id),
  make                VARCHAR(50),
  model               VARCHAR(50),
  year                YEAR,
  color               VARCHAR(30),
  plate               VARCHAR(20) UNIQUE NOT NULL,
  type                ENUM('Economy','Premium','Bike') DEFAULT 'Economy',
  verification_status ENUM('Pending','Verified','Rejected') DEFAULT 'Pending'
);

-- Ride Requests
CREATE TABLE RIDE_REQUESTS (
  ride_id          INT PRIMARY KEY AUTO_INCREMENT,
  rider_id         INT NOT NULL REFERENCES USERS(user_id),
  driver_id        INT REFERENCES DRIVERS(driver_id),
  pickup_location  VARCHAR(255) NOT NULL,
  dropoff_location VARCHAR(255) NOT NULL,
  status           ENUM('Requested','Accepted','En Route','In Progress','Completed','Cancelled') DEFAULT 'Requested',
  vehicle_type     ENUM('Economy','Premium','Bike'),
  fare             DECIMAL(10,2),
  distance_km      DECIMAL(6,2),
  surge_applied    BOOLEAN DEFAULT FALSE,
  surge_multiplier DECIMAL(3,2) DEFAULT 1.00,
  requested_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at     TIMESTAMP NULL
);

-- Payments
CREATE TABLE PAYMENTS (
  payment_id     INT PRIMARY KEY AUTO_INCREMENT,
  ride_id        INT NOT NULL REFERENCES RIDE_REQUESTS(ride_id),
  amount         DECIMAL(10,2) NOT NULL,
  method         ENUM('Cash','Wallet','Card') DEFAULT 'Wallet',
  status         ENUM('Pending','Completed','Refunded') DEFAULT 'Pending',
  paid_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Seeding Demo Users

After running the schema, seed demo accounts:

```bash
node sql/seed.js
```

This creates:
| Name          | Email                  | Role   | Password     |
|---------------|------------------------|--------|--------------|
| Aisha Malik   | aisha@cubiny.pk        | rider  | cubiny123    |
| Hassan Raza   | hassan@cubiny.pk       | driver | cubiny123    |
| Sana Admin    | admin@cubiny.pk        | admin  | cubiny123    |

---

## ⚙️ Environment Variables

### Frontend (`cubiny-desktop/.env`)

```env
# API base URL for the Node.js backend
VITE_API_URL=http://localhost:4000/api

# Set to "true" to use mock data (no backend required)
# Set to "false" to connect to the real API
VITE_USE_MOCK=true
```

> Copy `.env.example` to `.env` and update values as needed.

### Backend (`cubiny-backend/.env`)

```env
# Server
PORT=4000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=cubiny_user
DB_PASSWORD=your_password
DB_NAME=cubiny_db

# For Aiven (SSL) — omit for local MySQL
# DB_SSL_CA=./certs/ca.pem

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_change_this_too
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12
```

---

## 📁 Project Structure

```
cubiny-desktop/
│
├── electron/                    # Electron main process
│   ├── main.js                  # App entry, BrowserWindow, IPC handlers
│   ├── preload.js               # Context bridge (exposes safe APIs to renderer)
│   ├── scripts/                 # Electron utility scripts
│   └── assets/                  # App icons (icon.ico, icon.icns, icon.png)
│
├── public/                      # Static assets (served by Vite)
│
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Root router + Error Boundary
│   │
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state, session restore
│   │
│   ├── hooks/
│   │   ├── useAuth.js           # Auth hook with null-context guard
│   │   └── useElectron.js       # IPC bridge (tray, notifications, window controls)
│   │
│   ├── services/
│   │   ├── api.js               # Axios instance (JWT attach, 401 interceptor)
│   │   ├── mockService.js       # All API calls (mock + real API dual-mode)
│   │   ├── fareService.js       # Fare calculation engine (surge pricing)
│   │   └── ratingService.js     # Rating submission
│   │
│   ├── data/
│   │   └── mockData.js          # Mock users, rides, earnings, wallet, promos
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx     # Main authenticated layout (sidebar + main)
│   │   │   ├── Sidebar.jsx      # 256px nav rail with profile card
│   │   │   └── TitleBar.jsx     # Custom Electron title bar (Win/Mac)
│   │   │
│   │   ├── map/
│   │   │   ├── LiveMap.jsx      # react-leaflet map (CartoDB Positron tiles)
│   │   │   └── index.js
│   │   │
│   │   └── ui/
│   │       ├── Button.jsx       # 7 variants (primary/cobalt/secondary/ghost/danger/success/dark)
│   │       ├── Input.jsx        # Field with label, icon, error, helper
│   │       ├── Avatar.jsx       # Initials avatar with online status dot
│   │       ├── StatCard.jsx     # KPI card with trend indicator
│   │       ├── Modal.jsx        # Accessible modal (Escape key, click-outside)
│   │       ├── StatusPill.jsx   # Color-coded status badges
│   │       ├── LoadingSpinner.jsx
│   │       └── index.js
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── AuthPage.jsx     # Landing page + Login page (separate views)
│   │   │   └── LoginForm.jsx    # Validated login/signup form
│   │   │
│   │   ├── rider/
│   │   │   ├── RiderDashboard.jsx   # Full-screen map + 420px command panel
│   │   │   ├── HistoryPage.jsx      # Ride history with filter tabs
│   │   │   ├── WalletPage.jsx       # Balance, transactions, top-up modal
│   │   │   ├── RatingsPage.jsx      # Rating distribution + review list
│   │   │   ├── PromoPage.jsx        # Promo code input + active codes grid
│   │   │   └── ComplaintsPage.jsx   # Support ticket form + ticket list
│   │   │
│   │   ├── driver/
│   │   │   ├── DriverDashboard.jsx  # Go live, earnings chart, ride requests
│   │   │   ├── EarningsPage.jsx     # Weekly earnings breakdown
│   │   │   ├── VehiclesPage.jsx     # Vehicle registration + list
│   │   │   └── DriverRatingsPage.jsx
│   │   │
│   │   ├── admin/
│   │   │   └── AdminPanel.jsx       # Live rides, revenue, flagged drivers
│   │   │
│   │   └── desktop/
│   │       └── DesktopSettings.jsx  # Profile + notification settings
│   │
│   └── styles/
│       ├── tokens.css           # CSS custom properties (full design system)
│       └── globals.css          # Global reset, utility classes, animations
│
├── index.html                   # Vite HTML template
├── vite.config.js               # Vite config (React plugin, port 3000, aliases)
├── tailwind.config.js           # Tailwind theme extension
├── postcss.config.js            # PostCSS (Tailwind + Autoprefixer)
├── package.json                 # Scripts, dependencies, electron-builder config
└── .env                         # Environment variables (not committed)
```

---

## 📜 Available Scripts

Run all scripts from inside the `cubiny-desktop/` directory.

| Script | Command | Description |
|--------|---------|-------------|
| **Dev (full app)** | `npm run dev` | Starts Vite + Electron concurrently |
| **Dev (web only)** | `npm run vite` | Starts Vite dev server at `localhost:3000` |
| **Build** | `npm run build` | Compiles React app to `dist/` |
| **Preview** | `npm run preview` | Preview the production build in browser |
| **Package (all)** | `npm run dist` | Build + package for current OS |
| **Package (Windows)** | `npm run dist:win` | Build `.exe` NSIS installer |
| **Package (macOS)** | `npm run dist:mac` | Build `.dmg` installer |
| **Package (Linux)** | `npm run dist:linux` | Build `.AppImage` + `.deb` |

---

## 📦 Building Installers

### Prerequisites for Building

Make sure you have completed `npm install` before running any `dist` command.

### Windows (`.exe` installer)

```bash
npm run dist:win
```

Output: `release/Cubiny Setup x.x.x.exe`

The installer includes:
- One-click install or custom directory selection
- Desktop shortcut
- Start Menu shortcut
- Uninstaller

### macOS (`.dmg`)

```bash
npm run dist:mac
```

Output: `release/Cubiny-x.x.x.dmg`

Supports both **Intel (x64)** and **Apple Silicon (arm64)** in the same build.

> **Note**: For distribution outside your own machine, you'll need an Apple Developer certificate for code signing. For internal use, right-click the app → Open to bypass Gatekeeper.

### Linux (`.AppImage` and `.deb`)

```bash
npm run dist:linux
```

Output:
- `release/Cubiny-x.x.x.AppImage` (portable, run anywhere)
- `release/Cubiny_x.x.x_amd64.deb` (Debian/Ubuntu installer)

To run the AppImage:
```bash
chmod +x Cubiny-x.x.x.AppImage
./Cubiny-x.x.x.AppImage
```

---

## 🐛 Bug Fixes Log

All bugs from Iterations 1–6 were identified and resolved. This section documents every fix for audit purposes.

### Critical Fixes (Iteration 5)

| # | File | Bug Description | Fix Applied |
|---|------|----------------|-------------|
| 1 | `LoginForm.jsx` | **Auth bypass** — clicking Sign In with empty fields skipped validation and called `login()` | Added `validate()` function with email regex + 6-char password minimum. Returns early before any API call |
| 2 | `AuthContext.jsx` | **Session not restored** — `useState(null)` reset user on every app reload | Changed to `useState(restoreUser)` — parses and validates `cubiny_user` from `localStorage` on cold start |
| 3 | `MockMap.jsx` | **Broken map** — fake SVG placeholder with zero interactivity | Replaced entirely with `LiveMap.jsx` using `react-leaflet` + CartoDB Positron tiles. No API key required |
| 4 | `AuthPage.jsx` | **Broken layout** — `display:flex` columns collapsed on narrow Electron windows | Rebuilt with CSS Grid `gridTemplateColumns: minmax(380px,1fr) minmax(380px,480px)` |
| 5 | `RiderDashboard.jsx` | **Instant ride completion** — untracked `setTimeout` IDs created stale closures that fired into the next booking | All IDs stored in `useRef`. `clearAllTimeouts()` called before each new booking AND on component unmount. Realistic durations: `3s → 6s → 11s → 19s` |
| 6 | `mockService.js` | **Mock auth bypass** — `login()` in mock mode resolved regardless of inputs | Added server-side mock validation: throws `Error` if email is empty or password < 6 chars |
| 7 | `mockData.js` | **Runtime crash on WalletPage** — `MOCK_WALLET_TRANSACTIONS` was imported but never exported | Added complete `MOCK_WALLET_TRANSACTIONS` array with `credit`, `debit`, `refund` transaction shapes |
| 8 | `fareService.js` | **`Rs. NaN` rendered** — passing `undefined` for `distanceKm` broke fare calculation | Added `Math.max(0, Number(x) \|\| 0)` guard on all numeric inputs |
| 9 | `api.js` | **Ghost sessions after 401** — expired tokens caused silent failures with no redirect | Added response interceptor: clears `localStorage` and reloads on HTTP 401. All error messages normalized |
| 10 | `App.jsx` | **No error boundary** — any render crash white-screened the entire Electron window | Added class-based `ErrorBoundary` wrapping `<Router>` with "Try Again" button and error message display |
| 11 | `useAuth.js` | **Cryptic null context error** — hook used outside `AuthProvider` gave unhelpful message | Added explicit guard: throws descriptive error if `AuthContext` is `null` |
| 12 | `RiderDashboard.jsx` | **Hardcoded driver data** — name, plate, and rating scattered as string literals | Centralized to `MOCK_USERS.driver` and `MOCK_INCOMING_RIDE` — single source of truth |

### Additional Fixes (Iteration 6–7)

| # | File | Bug | Fix |
|---|------|-----|-----|
| 13 | `EarningsPage.jsx` | Bar chart bars used `height: \`${pct}%\`` on a container with no fixed height — bars never rendered | Replaced with computed pixel heights: `height: Math.max(Math.round(ratio * 120), 8)` |
| 14 | `DriverDashboard.jsx` | Same bar chart percentage-height issue | Same pixel-height fix applied |
| 15 | `mockData.js` | Revenue breakdown colors used old dark-theme CSS vars (`--blu2`, `--v3`, `--amb`) that no longer existed | Replaced with direct hex values: `#2563EB`, `#8B5CF6`, `#F59E0B` |
| 16 | Multiple `*.jsx` | `sed` regex during palette migration consumed closing `"` of `"var(--grn2)"` → `"var(--grn2)` (9 broken string literals causing parse errors) | Surgical per-line fix restoring all closing quotes in `AdminPanel`, `EarningsPage`, `VehiclesPage`, `ComplaintsPage`, `WalletPage` |
| 17 | `postcss.config.js` | Module type mismatch — `postcss.config.js` used CommonJS syntax in an ES Module package | Added `"type": "module"` to `package.json` to resolve CJS/ESM conflict |

---

## 🎨 Design System

Cubiny v7 uses a "Command Center" design language inspired by Yango and Uber.

### Color Philosophy

> Green and Cobalt are used **exclusively on actionable elements** — buttons, selected states, and active indicators. Backgrounds are always white or ultra-light gray. Nothing else gets color.

| Token | Value | Usage |
|-------|-------|-------|
| `--green` | `#22C55E` | Primary CTA buttons, active states, success |
| `--green-dk` | `#16A34A` | Green text, hover states |
| `--green-lt` | `#DCFCE7` | Green backgrounds |
| `--cobalt` | `#2563EB` | Secondary actions, map route, ride progress |
| `--bg` | `#F9FAFB` | App background |
| `--bg-white` | `#FFFFFF` | Cards, panels, inputs |
| `--txt-1` | `#111827` | Headlines, primary text |
| `--txt-3` | `#6B7280` | Secondary text, labels |

### Typography

**Inter** is the sole typeface — used at weights 400, 500, 600, 700, 800, 900.

| Element | Size | Weight |
|---------|------|--------|
| Page heading | 22px | 800 |
| Section heading | 18px | 700 |
| Body | 14px | 400–500 |
| Label / Caption | 11–12px | 600–700 |
| Price display | 18–38px | 900 |

### Shadow System

All shadows are multi-layered for a premium, physical depth feel:

```css
--sh-panel: 0 8px 32px rgba(17,24,39,0.12),
            0 2px 8px  rgba(17,24,39,0.06),
            0 0 0 1px  rgba(17,24,39,0.04);
```

### Component Variants

**Button**: `primary` · `cobalt` · `secondary` · `ghost` · `danger` · `success` · `dark`  
**StatusPill**: `Completed` · `In Progress` · `En Route` · `Requested` · `Cancelled` · `Online` · `Offline` · `Verified` · `Flagged`

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add X'`
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Open** a Pull Request against `main`

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
refactor: Code change that neither fixes a bug nor adds a feature
style:    Formatting, missing semicolons, etc.
docs:     Documentation only changes
chore:    Build process, dependency updates
```

### Running in Mock Mode During Development

Set `VITE_USE_MOCK=true` in `.env`. All API calls resolve from `src/data/mockData.js` — no backend needed. This is the default for development.

### Switching to Real API

```env
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:4000/api
```

Make sure the backend is running and the database is seeded before switching.

---

## 📄 License

```
MIT License

Copyright (c) 2026 Cubiny Technologies

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

**Built with ❤️ in Pakistan**

[⬆ Back to top](#-cubiny--premium-ride-hailing-platform)

</div>
