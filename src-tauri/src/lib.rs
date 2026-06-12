mod window;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if let Some(main) = app.get_webview_window("main") {
                window::apply_glass(&main);
            }
            Ok(())
        })
        // No commands yet — the M0 shell is presentation only. File intake
        // and conversion commands arrive in later milestones.
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running FoxCNV");
}
