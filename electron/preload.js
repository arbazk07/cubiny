// electron/preload.js — Cubiny Desktop v4
// Bridges main ↔ renderer via contextBridge.
// Only exposes a typed, safe API — never raw ipcRenderer.
"use strict";

const { contextBridge, ipcRenderer } = require("electron");

// ── Window controls ────────────────────────────────────────────────
contextBridge.exposeInMainWorld("cubinyWindow", {
  minimize:     ()      => ipcRenderer.send("window:minimize"),
  maximize:     ()      => ipcRenderer.send("window:maximize"),
  close:        ()      => ipcRenderer.send("window:close"),
  hide:         ()      => ipcRenderer.send("window:hide"),
  fullscreen:   ()      => ipcRenderer.send("window:fullscreen"),
  alwaysOnTop:  (on)    => ipcRenderer.send("window:always-top", on),
  isMaximized:  ()      => ipcRenderer.invoke("window:is-maximized"),
  isFullscreen: ()      => ipcRenderer.invoke("window:is-fullscreen"),
});

// ── Notifications ──────────────────────────────────────────────────
contextBridge.exposeInMainWorld("cubinyNotify", {
  incomingRide:    (payload) => ipcRenderer.send("notify:incoming-ride",   payload),
  rideCompleted:   (payload) => ipcRenderer.send("notify:ride-completed",  payload),
  send:            (payload) => ipcRenderer.send("notify:send",            payload),
});

// ── Driver status ──────────────────────────────────────────────────
contextBridge.exposeInMainWorld("cubinyDriver", {
  setStatus: (isOnline) => ipcRenderer.send("driver:status-change", { isOnline }),
  // Receive tray "Go Online/Offline" clicks
  onTrayToggle: (cb) => {
    ipcRenderer.on("tray:toggle-availability", () => cb());
    return () => ipcRenderer.removeAllListeners("tray:toggle-availability");
  },
});

// ── Shell ──────────────────────────────────────────────────────────
contextBridge.exposeInMainWorld("cubinyShell", {
  openURL:    (url)  => ipcRenderer.send("shell:open-url", url),
  openFile:   (opts) => ipcRenderer.invoke("dialog:open-file", opts),
});

// ── App info ───────────────────────────────────────────────────────
contextBridge.exposeInMainWorld("cubinyApp", {
  version:    ()  => ipcRenderer.invoke("app:version"),
  platform:   ()  => ipcRenderer.invoke("app:platform"),
  isDev:      ()  => ipcRenderer.invoke("app:is-dev"),
});

// ── Detect Electron (lets React know it's running in desktop mode) ─
contextBridge.exposeInMainWorld("isElectron", true);
