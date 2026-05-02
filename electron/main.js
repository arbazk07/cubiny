// electron/main.js — Cubiny Desktop v4
// Main process: window management, tray, notifications, IPC
"use strict";

const {
  app, BrowserWindow, Tray, Menu, ipcMain,
  nativeImage, Notification, shell, dialog,
  screen, nativeTheme,
} = require("electron");
const path = require("path");
const fs   = require("fs");

const isDev  = process.env.NODE_ENV === "development";
const isMac  = process.platform === "darwin";
const isWin  = process.platform === "win32";

// ── State ─────────────────────────────────────────────────────────
let mainWindow = null;
let tray       = null;
let isQuitting = false;

// ── App single-instance lock ──────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); process.exit(0); }

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// ── Icon helper ───────────────────────────────────────────────────
function getIconPath(name = "icon") {
  const base = isDev
    ? path.join(__dirname, "assets")
    : path.join(process.resourcesPath, "assets");

  if (isWin)  return path.join(base, `${name}.ico`);
  if (isMac)  return path.join(base, `${name}.icns`);
  return path.join(base, `${name}.png`);
}

function getNativeIcon(name = "icon") {
  const p = getIconPath(name);
  if (fs.existsSync(p)) return nativeImage.createFromPath(p);
  // Fallback: programmatically built 32×32 purple square
  const img = nativeImage.createEmpty();
  return img;
}

// ── Create main window ────────────────────────────────────────────
function createMainWindow() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width:          Math.min(1400, sw),
    height:         Math.min(860, sh),
    minWidth:       900,
    minHeight:      600,
    center:         true,
    title:          "Cubiny",
    icon:           getNativeIcon(),
    frame:          false,          // custom title bar
    transparent:    false,
    backgroundColor:"#050510",
    vibrancy:       isMac ? "dark" : undefined,
    backgroundMaterial: isWin ? "acrylic" : undefined,
    titleBarStyle:  isMac ? "hiddenInset" : "hidden",
    trafficLightPosition: { x: 16, y: 16 },
    show:           false,
    webPreferences: {
      preload:             path.join(__dirname, "preload.js"),
      contextIsolation:    true,
      nodeIntegration:     false,
      sandbox:             false,
      webSecurity:         !isDev,
      devTools:            isDev,
    },
  });

  // ── Load app ────────────────────────────────────────────────────
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // ── Window events ───────────────────────────────────────────────
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
    if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });
  });

  mainWindow.on("close", (e) => {
    if (!isQuitting && tray) {
      e.preventDefault();
      mainWindow.hide();
      if (isWin) {
        showTrayNotification(
          "Cubiny is still running",
          "Click the tray icon to reopen.",
        );
      }
    }
  });

  mainWindow.on("closed", () => { mainWindow = null; });

  // ── External links → browser ─────────────────────────────────────
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// ── System Tray ───────────────────────────────────────────────────
function createTray() {
  const icon = getNativeIcon("tray");
  tray = new Tray(icon);
  tray.setToolTip("Cubiny — Premium Rides");

  buildTrayMenu();

  tray.on("click", () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : showMainWindow();
    }
  });

  // Windows: double-click opens app
  tray.on("double-click", showMainWindow);
}

function buildTrayMenu(driverOnline = false) {
  if (!tray) return;
  const menu = Menu.buildFromTemplate([
    {
      label: "Cubiny",
      enabled: false,
      icon: getNativeIcon("tray"),
    },
    { type: "separator" },
    {
      label:       "Open Cubiny",
      accelerator: "CmdOrCtrl+Shift+C",
      click:       showMainWindow,
    },
    {
      label:   driverOnline ? "Go Offline" : "Go Online (Driver)",
      click:   () => {
        showMainWindow();
        mainWindow?.webContents.send("tray:toggle-availability");
      },
    },
    { type: "separator" },
    {
      label: "Check for Updates",
      click: () => {
        dialog.showMessageBox(mainWindow, {
          type:    "info",
          title:   "Up to date",
          message: "Cubiny v4.0.0 is the latest version.",
          buttons: ["OK"],
        });
      },
    },
    {
      label: "Send Feedback",
      click: () => shell.openExternal("mailto:support@cubiny.pk"),
    },
    { type: "separator" },
    {
      label:       "Quit Cubiny",
      accelerator: isMac ? "Cmd+Q" : "Alt+F4",
      click:       quitApp,
    },
  ]);
  tray.setContextMenu(menu);
}

function showMainWindow() {
  if (!mainWindow) return;
  mainWindow.show();
  mainWindow.focus();
  if (mainWindow.isMinimized()) mainWindow.restore();
}

// ── Notifications ─────────────────────────────────────────────────
function showTrayNotification(title, body, urgency = "normal") {
  if (!Notification.isSupported()) return;
  const n = new Notification({
    title,
    body,
    icon:    getNativeIcon(),
    urgency,   // linux: low | normal | critical
    timeoutType: "default",
    silent:  urgency === "low",
  });
  n.on("click", showMainWindow);
  n.show();
}

// ── App quit ──────────────────────────────────────────────────────
function quitApp() {
  isQuitting = true;
  if (tray) { tray.destroy(); tray = null; }
  app.quit();
}

// ── IPC Handlers ──────────────────────────────────────────────────

// Window controls (custom title bar buttons)
ipcMain.on("window:minimize",    () => mainWindow?.minimize());
ipcMain.on("window:maximize",    () => mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize());
ipcMain.on("window:close",       () => mainWindow?.close());
ipcMain.on("window:hide",        () => mainWindow?.hide());
ipcMain.on("window:always-top",  (_, on) => mainWindow?.setAlwaysOnTop(on));

// Fullscreen toggle
ipcMain.on("window:fullscreen",  () => {
  if (!mainWindow) return;
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

// Query window state
ipcMain.handle("window:is-maximized",  () => mainWindow?.isMaximized()  ?? false);
ipcMain.handle("window:is-fullscreen", () => mainWindow?.isFullScreen() ?? false);

// ── Ride request native notification ─────────────────────────────
// Called from renderer when an incoming ride arrives (WebSocket event)
ipcMain.on("notify:incoming-ride", (_, { rider, fare, from, to }) => {
  showTrayNotification(
    `🚗 New Ride Request — Rs. ${fare}`,
    `${rider}: ${from} → ${to}`,
    "critical",
  );
  // Flash taskbar/dock
  if (mainWindow && !mainWindow.isFocused()) {
    mainWindow.flashFrame(true);
    setTimeout(() => mainWindow?.flashFrame(false), 3000);
  }
});

// ── Ride completed notification ───────────────────────────────────
ipcMain.on("notify:ride-completed", (_, { fare }) => {
  showTrayNotification("✅ Trip Completed", `Rs. ${fare} added to your wallet.`, "normal");
});

// ── Generic notification ──────────────────────────────────────────
ipcMain.on("notify:send", (_, { title, body, urgency = "normal" }) => {
  showTrayNotification(title, body, urgency);
});

// ── Driver online status (updates tray menu) ──────────────────────
ipcMain.on("driver:status-change", (_, { isOnline }) => {
  buildTrayMenu(isOnline);
  tray?.setToolTip(
    isOnline ? "Cubiny — 🟢 Online & Accepting Rides" : "Cubiny — ⚫ Offline",
  );
});

// ── Open external URL ─────────────────────────────────────────────
ipcMain.on("shell:open-url", (_, url) => shell.openExternal(url));

// ── Show native open-file dialog ──────────────────────────────────
ipcMain.handle("dialog:open-file", async (_, opts = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title:       opts.title ?? "Select File",
    filters:     opts.filters ?? [],
    properties:  opts.properties ?? ["openFile"],
  });
  return result;
});

// ── App version ───────────────────────────────────────────────────
ipcMain.handle("app:version",  () => app.getVersion());
ipcMain.handle("app:platform", () => process.platform);
ipcMain.handle("app:is-dev",   () => isDev);

// ── App lifecycle ─────────────────────────────────────────────────
app.whenReady().then(() => {
  // macOS dark mode
  nativeTheme.themeSource = "dark";

  createMainWindow();
  createTray();

  // macOS: re-create window on dock click
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    else showMainWindow();
  });

  // App menu (macOS)
  if (isMac) {
    app.setAboutPanelOptions({
      applicationName:    "Cubiny",
      applicationVersion: app.getVersion(),
      version:            "4.0.0",
      copyright:          "© 2026 Cubiny Technologies",
      website:            "https://cubiny.pk",
    });
  }
});

app.on("before-quit", () => { isQuitting = true; });

app.on("window-all-closed", () => {
  if (!isMac) quitApp();
});
