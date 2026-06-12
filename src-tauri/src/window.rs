//! Native window backdrop (glassmorphism).
//!
//! On Windows we ask the OS to draw a translucent blur behind the window:
//! Mica on Windows 11 (best look), falling back to Acrylic on Windows 10.
//! When neither is available (e.g. transparency disabled, Remote Desktop),
//! the window stays transparent and the CSS layer provides the fallback look.

use tauri::WebviewWindow;

#[cfg(target_os = "windows")]
pub fn apply_glass(window: &WebviewWindow) {
    use window_vibrancy::{apply_acrylic, apply_mica};

    // Mica is Windows 11 only; try it first, fall back to Acrylic on Win10.
    if apply_mica(window, Some(true)).is_err() {
        // Subtle dark tint so glass panels stay readable over the blur.
        let _ = apply_acrylic(window, Some((18, 18, 22, 125)));
    }
}

#[cfg(not(target_os = "windows"))]
pub fn apply_glass(_window: &WebviewWindow) {
    // FoxCNV targets Windows; on other platforms the CSS fallback handles it.
}
