// electron/scripts/generate-icons.js
// node electron/scripts/generate-icons.js
// Writes placeholder SVG; see console for .ico/.icns conversion steps.
const fs   = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "../assets");
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6d28d9"/>
      <stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="url(#bg)"/>
  <rect x="180" y="180" width="270" height="270" rx="54" fill="white" opacity="0.95"/>
  <rect x="574" y="180" width="270" height="270" rx="54" fill="white" opacity="0.55"/>
  <rect x="180" y="574" width="270" height="270" rx="54" fill="white" opacity="0.55"/>
  <rect x="574" y="574" width="270" height="270" rx="54" fill="white" opacity="0.95"/>
</svg>`;

fs.writeFileSync(path.join(assetsDir, "icon.svg"),  svg);
fs.writeFileSync(path.join(assetsDir, "tray.svg"),  svg);

console.log("icon.svg + tray.svg written.");
console.log("Convert to .png/.ico/.icns:");
console.log("  npx electron-icon-maker --input=electron/assets/icon.png --output=electron/assets/");
