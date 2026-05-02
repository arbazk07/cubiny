# Cubiny Desktop — Iteration 4

Electron-wrapped React app with native OS features.

---

## Quick Start — Development Mode

```bash
npm install
npm run dev
```

This runs Vite (port 3000) and Electron concurrently.
The app opens a native desktop window automatically.

---

## Build Distributable Installers

### Step 1 — Generate icons (one-time)
```bash
# Make a 1024x1024 PNG, then:
npx electron-icon-maker --input=electron/assets/icon.png --output=electron/assets/
```

### Step 2 — Build for your platform
```bash
npm run dist:win    # → release/Cubiny Setup.exe  (NSIS installer)
npm run dist:mac    # → release/Cubiny.dmg        (macOS disk image)
npm run dist:linux  # → release/Cubiny.AppImage   (Linux AppImage)

# All platforms at once:
npm run dist
```

Output goes to `release/` folder.

---

## Environment

`.env` ships with `VITE_USE_MOCK=true` so it works out of the box.

```bash
# .env
VITE_API_URL=http://localhost:4000/api
VITE_USE_MOCK=true          # false = real MySQL backend
```

---

## Electron Architecture

```
electron/
├── main.js       ← Main process
│   ├── BrowserWindow     Custom frameless window
│   ├── Tray              System tray with context menu
│   ├── Notification      Native OS notifications
│   ├── ipcMain handlers  All renderer ↔ main communication
│   └── app lifecycle     Single-instance, dock, quit
│
├── preload.js    ← Secure IPC bridge (contextIsolation: true)
│   ├── cubinyWindow      Window controls (minimize/max/close)
│   ├── cubinyNotify      Native notifications from renderer
│   ├── cubinyDriver      Tray ↔ Driver online status sync
│   ├── cubinyShell       Open URLs, file dialogs
│   └── cubinyApp         Version, platform, isDev
│
└── assets/
    ├── icon.svg/.ico/.icns/.png   App icons
    └── tray.svg                   System tray icon
```

---

## Desktop Features

### Custom Title Bar
- Frameless window (`frame: false`)
- Windows: custom minimize / maximize / close buttons
- macOS: native traffic lights with `hiddenInset` title bar style
- Draggable via `webkit-app-region: drag`

### System Tray
- Persists when window is closed (minimize-to-tray)
- Context menu: Open, Go Online/Offline, Feedback, Quit
- Tray tooltip updates with driver online status
- Double-click tray icon to restore

### Native Notifications (OS-level)
| Event | Trigger | Urgency |
|-------|---------|---------|
| Incoming ride | Driver goes online + ride arrives | Critical |
| Ride accepted | Driver accepts | Normal |
| Trip completed | Ride state → completed | Normal |
| Test notification | Settings page button | Normal |

### Tray ↔ Driver Sync
- Going Online/Offline in the app updates tray menu label
- Clicking "Go Online" in the tray opens app + toggles driver status via IPC

### Window Controls (IPC)
| IPC Channel | Effect |
|-------------|--------|
| `window:minimize` | Minimize to taskbar |
| `window:maximize` | Toggle maximize |
| `window:close` | Hide to tray (not quit) |
| `window:fullscreen` | Toggle fullscreen |
| `window:always-top` | Pin above all windows |

### Desktop Settings Page
- Always-on-top toggle
- Notification preference toggles
- Appearance (Dark / System / Light)
- Performance (Hardware acceleration, Background updates)
- Privacy (Analytics, Crash reports)
- Test notification button
- App version, platform, backend URL display

---

## Iteration Roadmap

- ✅ Iteration 1 — Modular file structure
- ✅ Iteration 2 — Service layer + Cubiny rebrand
- ✅ Iteration 3 — Real MySQL/Aiven backend
- ✅ **Iteration 4 — Electron desktop packaging (current)**
