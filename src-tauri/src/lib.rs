mod args;
mod window;

use std::sync::Mutex;
use tauri::{Emitter, Manager};

/// Holds a file path captured at startup (from a context-menu launch) until the
/// frontend has mounted and asks for it via [`take_initial_file`]. This avoids a
/// race where we'd emit `open-file` before any listener exists.
#[derive(Default)]
struct PendingFile(Mutex<Option<String>>);

/// Metadata shown for a loaded file. Conversion itself arrives in later milestones.
#[derive(serde::Serialize)]
struct FileInfo {
    path: String,
    name: String,
    ext: String,
    size: u64,
}

/// Frontend pulls any file the app was launched with (once, on mount).
#[tauri::command]
fn take_initial_file(state: tauri::State<'_, PendingFile>) -> Option<String> {
    state.0.lock().ok()?.take()
}

/// Inspect a file path: name, lowercase extension, and size in bytes.
#[tauri::command]
fn probe_file(path: String) -> Result<FileInfo, String> {
    let p = std::path::PathBuf::from(&path);
    let meta = std::fs::metadata(&p).map_err(|e| e.to_string())?;
    if !meta.is_file() {
        return Err("Not a file".into());
    }
    Ok(FileInfo {
        name: p
            .file_name()
            .map(|s| s.to_string_lossy().into_owned())
            .unwrap_or_default(),
        ext: p
            .extension()
            .map(|s| s.to_string_lossy().to_lowercase())
            .unwrap_or_default(),
        size: meta.len(),
        path,
    })
}

/// Focus an existing window and load a file into it (used when a second launch
/// is folded into the running instance).
fn focus_and_open(app: &tauri::AppHandle, argv: &[String]) {
    if let Some(win) = app.get_webview_window("main") {
        if win.is_minimized().unwrap_or(false) {
            let _ = win.unminimize();
        }
        let _ = win.set_focus();
    }
    if let Some(path) = args::first_file(argv) {
        let _ = app.emit("open-file", path);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Single-instance MUST be registered before any other plugin. On a
        // second launch (e.g. right-clicking another file) this fires instead
        // of starting a new process.
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            focus_and_open(app, &argv);
        }))
        .manage(PendingFile::default())
        .setup(|app| {
            if let Some(main) = app.get_webview_window("main") {
                window::apply_glass(&main);
            }
            // First launch: stash any file argument for the frontend to claim.
            let argv: Vec<String> = std::env::args().collect();
            if let Some(path) = args::first_file(&argv) {
                if let Ok(mut pending) = app.state::<PendingFile>().0.lock() {
                    *pending = Some(path);
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![take_initial_file, probe_file])
        .run(tauri::generate_context!())
        .expect("error while running FoxCNV");
}
