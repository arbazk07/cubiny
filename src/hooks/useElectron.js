// src/hooks/useElectron.js
// Safe wrapper around window.cubiny* APIs exposed by preload.js.
// Falls back gracefully when running in a browser (non-Electron).

const IS_ELECTRON = typeof window !== "undefined" && window.isElectron === true;

// ── Window controls ───────────────────────────────────────────────
export const electronWindow = {
  minimize:     () => IS_ELECTRON && window.cubinyWindow.minimize(),
  maximize:     () => IS_ELECTRON && window.cubinyWindow.maximize(),
  close:        () => IS_ELECTRON && window.cubinyWindow.close(),
  fullscreen:   () => IS_ELECTRON && window.cubinyWindow.fullscreen(),
  alwaysOnTop:  (on) => IS_ELECTRON && window.cubinyWindow.alwaysOnTop(on),
  isMaximized:  () => IS_ELECTRON ? window.cubinyWindow.isMaximized()  : Promise.resolve(false),
  isFullscreen: () => IS_ELECTRON ? window.cubinyWindow.isFullscreen() : Promise.resolve(false),
};

// ── Notifications ─────────────────────────────────────────────────
export const electronNotify = {
  incomingRide:  (p) => IS_ELECTRON && window.cubinyNotify.incomingRide(p),
  rideCompleted: (p) => IS_ELECTRON && window.cubinyNotify.rideCompleted(p),
  send:          (p) => IS_ELECTRON && window.cubinyNotify.send(p),
};

// ── Driver tray integration ───────────────────────────────────────
export const electronDriver = {
  setStatus:   (on) => IS_ELECTRON && window.cubinyDriver.setStatus(on),
  onTrayToggle:(cb) => IS_ELECTRON ? window.cubinyDriver.onTrayToggle(cb) : () => {},
};

// ── Shell ─────────────────────────────────────────────────────────
export const electronShell = {
  openURL:  (url)  => IS_ELECTRON ? window.cubinyShell.openURL(url)  : window.open(url, "_blank"),
  openFile: (opts) => IS_ELECTRON ? window.cubinyShell.openFile(opts): Promise.resolve({ canceled: true }),
};

// ── App info ──────────────────────────────────────────────────────
export const electronApp = {
  version:  () => IS_ELECTRON ? window.cubinyApp.version()  : Promise.resolve("web"),
  platform: () => IS_ELECTRON ? window.cubinyApp.platform() : Promise.resolve("browser"),
  isDev:    () => IS_ELECTRON ? window.cubinyApp.isDev()    : Promise.resolve(false),
};

export { IS_ELECTRON };

// ── React hook ────────────────────────────────────────────────────
import { useState, useEffect } from "react";

export function useElectron() {
  const [version,  setVersion]  = useState("web");
  const [platform, setPlatform] = useState("browser");
  const [isMaximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!IS_ELECTRON) return;
    electronApp.version().then(setVersion);
    electronApp.platform().then(setPlatform);
    electronWindow.isMaximized().then(setMaximized);

    // Poll maximized state every 500 ms (no ipc event for this)
    const t = setInterval(() => {
      electronWindow.isMaximized().then(setMaximized);
    }, 500);
    return () => clearInterval(t);
  }, []);

  return { IS_ELECTRON, version, platform, isMaximized };
}
