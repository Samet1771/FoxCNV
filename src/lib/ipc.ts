/**
 * Thin bridge to the Tauri backend.
 *
 * Everything here degrades gracefully when the app is opened in a plain
 * browser (e.g. `npm run dev` without Tauri), so the UI can be previewed
 * without a running Rust backend. All Tauri APIs are dynamically imported
 * so the browser bundle never touches them unless we are actually in Tauri.
 */

/** True when running inside the Tauri webview (vs. a plain browser). */
export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

interface AppWindow {
  minimize(): Promise<void>;
  toggleMaximize(): Promise<void>;
  close(): Promise<void>;
  isMaximized(): Promise<boolean>;
}

let cachedWindow: AppWindow | null = null;

async function currentWindow(): Promise<AppWindow | null> {
  if (!isTauri()) return null;
  if (!cachedWindow) {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    cachedWindow = getCurrentWindow() as unknown as AppWindow;
  }
  return cachedWindow;
}

/** Custom-titlebar window controls. No-ops in browser preview. */
export const windowControls = {
  async minimize(): Promise<void> {
    await (await currentWindow())?.minimize();
  },
  /** Toggles maximize/restore and returns the resulting maximized state. */
  async toggleMaximize(): Promise<boolean> {
    const win = await currentWindow();
    if (!win) return false;
    await win.toggleMaximize();
    return win.isMaximized();
  },
  async close(): Promise<void> {
    await (await currentWindow())?.close();
  },
};
