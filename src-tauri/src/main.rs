#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod redmine;
mod sheets;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize)]
struct ExportPayload {
    redmine_url: String,
    api_key: String,
    load_cell: String,
    time_entries: Vec<redmine::InputTimeEntry>,
}

#[tauri::command]
async fn import_data(payload: sheets::AuthPayload) -> Vec<sheets::SheetData> {
    let data = sheets::import_data_from_sheet(payload).await;
    match data {
        sheets::SheetResponse::Success(data) => data,
        sheets::SheetResponse::Error(_err) => Vec::new(),
    }
}

#[tauri::command]
async fn export_to_redmine(payload: ExportPayload) -> Vec<redmine::RedmineResponse> {
    let redmine_payload = redmine::RedminePayload {
        redmine_url: payload.redmine_url,
        api_key: payload.api_key,
        load_cell: payload.load_cell,
        time_entries: payload.time_entries,
    };
    let response = redmine::export_to_redmine(redmine_payload).await;
    return response;
}

#[tauri::command]
fn open_file(path: String) -> Value {
    let file = std::fs::File::open(path).unwrap();
    let reader = std::io::BufReader::new(file);
    let data: Value = serde_json::from_reader(reader).unwrap();
    return data;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            import_data,
            open_file,
            export_to_redmine
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
