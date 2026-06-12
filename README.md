# FoxCNV

A fast, **local**, **private** file converter for Windows.

Everything runs on your machine. **No telemetry, no data collection, and no
network calls in normal use.** Conversions use the most permissively-licensed
engine available for each format: images and documents (and many audio/video
codecs like AV1, VP9, Opus, FLAC) are handled by pure-Rust libraries; for the
few formats with no pure-Rust encoder (e.g. MP3, H.264/MP4), a bundled,
offline, **LGPL-only** FFmpeg is invoked locally as a separate process with
fixed, sanitized arguments.

> **Status:** early development. **M0** (glassmorphism app shell) and **M1**
> (file intake — drag-and-drop, single-instance, and the right-click *"Convert
> with FoxCNV"* menu, plus the 1-click installer config) are in place. The
> conversions themselves follow in later milestones.

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

The installer is configured for a **1-click, per-user install** (`currentUser`
mode — no admin/UAC prompt) and embeds the WebView2 offline runtime so first run
never needs internet. It registers the classic right-click **"Convert with
FoxCNV"** menu under `HKCU` (no admin), and cleanly removes it on uninstall.

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

- No telemetry, no auto-updater, no network calls in normal use.
- Strict Content-Security-Policy; the frontend has **no** filesystem, shell, or
  network capabilities — all I/O happens in Rust.
- File paths from the right-click menu / CLI are validated and canonicalized.
- The bundled FFmpeg (added later) is an **LGPL-only** build, pinned,
  checksum-verified, kept user-replaceable, and invoked without a shell
  (arguments passed as a list) to prevent injection. Its license texts live in
  [`THIRD-PARTY-LICENSES/`](./THIRD-PARTY-LICENSES).

## License

Proprietary — **All Rights Reserved**. Download and personal use only; no
redistribution and no modification. See [`LICENSE`](./LICENSE). Third-party
component licenses are in [`THIRD-PARTY-LICENSES/`](./THIRD-PARTY-LICENSES).
