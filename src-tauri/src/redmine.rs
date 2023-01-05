use reqwest;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize)]
pub struct InputTimeEntry {
    date: String,
    issue: String,
    name: String,
    comment: String,
    project: String,
    duration: String,
    loaded: bool,
}
#[derive(Debug, Serialize, Deserialize)]
struct RedmineTimeEntry {
    issue_id: String,
    hours: String,
    comments: String,
    spent_on: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RedminePayload {
    pub api_key: String,
    pub loadCell: String,
    pub time_entries: Vec<InputTimeEntry>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RedmineSuccessResponse {
    loaded: bool,
    entry_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RedmineErrorResponse {
    status: u16,
    error: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum RedmineResponse {
    Success(RedmineSuccessResponse),
    Error(RedmineErrorResponse),
}

pub async fn export_to_redmine(payload: RedminePayload) -> Vec<RedmineResponse> {
    let client = reqwest::Client::new();

    let mut responses: Vec<RedmineResponse> = Vec::new();

    for entry in payload.time_entries {
        let body = [
            ("issue_id", entry.issue.to_owned()),
            ("spent_time", entry.duration.to_owned()),
            ("comments", entry.comment.to_owned()),
            ("spent_on", entry.date.to_owned()),
        ];

        let response = client
            .post("http://localhost:3000/time_entries.json")
            .header("X-Redmine-API-Key", payload.api_key.to_owned())
            .form(&body)
            .send()
            .await
            .expect("Failed to send request");
        let status = response.status();
        let body = response.text().await.expect("Failed to read response body");
        let json: Value = serde_json::from_str(&body).expect("Failed to parse response body");
        if status.is_success() {
            let entry_id = json["time_entry"]["id"].to_string();
            responses.push(RedmineResponse::Success(RedmineSuccessResponse {
                loaded: true,
                entry_id,
            }));
        } else {
            let error = json["errors"].to_string();
            responses.push(RedmineResponse::Error(RedmineErrorResponse {
                status: status.as_u16(),
                error,
            }));
        }
    }

    responses
}
