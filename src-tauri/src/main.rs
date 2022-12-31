#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod sheets;
use serde_json::Value;

#[tauri::command]
async fn import_data(payload: sheets::SheetPayload) -> Vec<sheets::SheetData> {
    let data = sheets::import_data_from_sheet(payload).await;
    match data {
        sheets::SheetResponse::Success(data) => data,
        sheets::SheetResponse::Error(_err) => Vec::new(),
    }
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
        .invoke_handler(tauri::generate_handler![import_data, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
