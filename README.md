# FoxCNV

A fast, **local**, **private** file converter for Windows.

Everything runs on your machine. **No network calls, no telemetry, no data
collection.** Images and documents are converted with pure-Rust libraries; audio
and video use a bundled, offline FFmpeg invoked locally with fixed, sanitized
arguments.

> **Status:** early development. Milestone **M0** (app shell) is in place — a
> frameless glassmorphism window with a custom titlebar. File intake and the
> conversions follow in later milestones.

## Tech

- **[Tauri v2](https://v2.tauri.app/)** — Rust backend + WebView2. Runs as a
  standalone native window (not a browser).
- **Svelte 5 + Vite + TypeScript** — minimal, reactive UI.
- **`window-vibrancy`** — native Mica (Win11) / Acrylic (Win10) backdrop.
- Accent color **`#e07436`**; UI style: minimalist, fluid glassmorphism.

## Requirements (Windows 10/11)

- [Node.js](https://nodejs.org/) 18+ and npm
- [Rust](https://www.rust-lang.org/tools/install) (stable) with the MSVC toolchain
- [WebView2 runtime](https://developer.microsoft.com/microsoft-edge/webview2/)
  (preinstalled on Windows 11; auto-installed by the installer on Windows 10)
- Microsoft C++ Build Tools (Visual Studio Build Tools)

## Develop

```bash
npm install
npm run tauri dev      # launches the app with hot reload
```

You can also preview just the UI in a browser (window controls are disabled):

```bash
npm run dev
```

## Build

```bash
npm run tauri build    # produces an NSIS installer under src-tauri/target/release/bundle
```

## App icon

The icon set in `src-tauri/icons/` is generated from `app-icon.svg`. To
regenerate after editing the SVG:

```bash
npm i -D sharp
node -e "import('sharp').then(s=>s.default('app-icon.svg',{density:300}).resize(1024,1024).png().toFile('app-icon.png'))"
npm run tauri icon app-icon.png
npm un sharp
```

## Privacy & security

- Zero networking, zero telemetry, no auto-updater.
- Strict Content-Security-Policy; the frontend has **no** filesystem, shell, or
  network capabilities — all I/O happens in Rust.
- The bundled FFmpeg (added later) is pinned, checksum-verified, and invoked
  without a shell (arguments passed as a list) to prevent injection.

## License

Proprietary — **All Rights Reserved**. Download and personal use only; no
redistribution and no modification. See [`LICENSE`](./LICENSE).
