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

/** Metadata for a loaded file (mirrors the Rust `FileInfo`). */
export interface FileInfo {
  path: string;
  name: string;
  ext: string;
  size: number;
}

// --- Window controls (custom titlebar) -------------------------------------

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

// --- File intake -----------------------------------------------------------

/** Pull any file the app was launched with (context-menu / CLI). Once only. */
export async function takeInitialFile(): Promise<string | null> {
  if (!isTauri()) return null;
  const { invoke } = await import("@tauri-apps/api/core");
  return (await invoke<string | null>("take_initial_file")) ?? null;
}

/** Inspect a file path on disk. Returns null in browser preview. */
export async function probeFile(path: string): Promise<FileInfo | null> {
  if (!isTauri()) return null;
  const { invoke } = await import("@tauri-apps/api/core");
  try {
    return await invoke<FileInfo>("probe_file", { path });
  } catch {
    return null;
  }
}

/** Fires when a running instance is asked to open another file (2nd launch). */
export async function onOpenFile(cb: (path: string) => void): Promise<() => void> {
  if (!isTauri()) return () => {};
  const { listen } = await import("@tauri-apps/api/event");
  return listen<string>("open-file", (e) => cb(e.payload));
}

interface DragDropHandlers {
  onHover?: () => void;
  onCancel?: () => void;
  onDrop?: (paths: string[]) => void;
}

/** Native OS file drag-and-drop (real paths). No-op in browser preview. */
export async function onDragDrop(handlers: DragDropHandlers): Promise<() => void> {
  if (!isTauri()) return () => {};
  const { getCurrentWebview } = await import("@tauri-apps/api/webview");
  return getCurrentWebview().onDragDropEvent((e) => {
    switch (e.payload.type) {
      case "enter":
      case "over":
        handlers.onHover?.();
        break;
      case "leave":
        handlers.onCancel?.();
        break;
      case "drop":
        handlers.onDrop?.(e.payload.paths);
        break;
    }
  });
}

// --- Formatting helpers ----------------------------------------------------

export function fileName(path: string): string {
  return path.split(/[\\/]/).pop() || path;
}

export function formatBytes(n: number): string {
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return `${(n / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}
