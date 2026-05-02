# Electron App Icons

Place your final icons here before running `npm run dist`:

| File       | Size     | Platform |
|------------|----------|----------|
| icon.ico   | 256x256  | Windows  |
| icon.icns  | 1024x1024| macOS    |
| icon.png   | 512x512  | Linux    |
| tray.svg   | 16x16    | All (tray)|

## Quick generation from a 1024x1024 PNG:
```bash
npx electron-icon-maker --input=electron/assets/icon.png --output=electron/assets/
```
