extern crate google_sheets4 as sheets4;
use serde::{Deserialize, Serialize};
use sheets4::api::ValueRange;
use sheets4::Error;
use sheets4::{hyper, hyper_rustls, oauth2, Sheets};

use crate::sheets;

#[derive(Debug, Serialize, Deserialize)]
pub struct SheetPayload {
    key_type: String,
    project_id: String,
    private_key_id: String,
    private_key: String,
    client_email: String,
    client_id: String,
    auth_uri: String,
    token_uri: String,
    auth_provider_x509_cert_url: String,
    client_x509_cert_url: String,
    sheet_id: String,
    sheet_range: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SheetData {
    date: String,
    issue: String,
    name: String,
    comment: String,
    project: String,
    start: String,
    end: String,
    duration: String,
}

#[derive(Debug)]
pub enum SheetResponse {
    Success(Vec<SheetData>),
    Error(Error),
}

fn format_to_object(data: ValueRange) -> Vec<SheetData> {
    let mut result: Vec<SheetData> = Vec::new();
    for row in data.values.unwrap() {
        let date = row[0].clone();
        let issue = row[1].clone();
        let name = row[2].clone();
        let comment = row[3].clone();
        let project = row[4].clone();
        let start = row[5].clone();
        let end = row[6].clone();
        let duration = row[7].clone();
        result.push(SheetData {
            date,
            issue,
            name,
            comment,
            project,
            start,
            end,
            duration,
        });
    }
    result
}

pub async fn test_sheet(payload: SheetPayload) -> SheetResponse {
    let secret: oauth2::ServiceAccountKey = oauth2::ServiceAccountKey {
        key_type: Some(payload.key_type),
        project_id: Some(payload.project_id),
        private_key_id: Some(payload.private_key_id),
        private_key: payload.private_key,
        client_email: payload.client_email,
        client_id: Some(payload.client_id),
        auth_uri: Some(payload.auth_uri),
        token_uri: payload.token_uri,
        auth_provider_x509_cert_url: Some(payload.auth_provider_x509_cert_url),
        client_x509_cert_url: Some(payload.client_x509_cert_url),
    };

    let auth = oauth2::ServiceAccountAuthenticator::builder(secret)
        .build()
        .await
        .unwrap();
    let hub = Sheets::new(
        hyper::Client::builder().build(
            hyper_rustls::HttpsConnectorBuilder::new()
                .with_native_roots()
                .https_or_http()
                .enable_http1()
                .enable_http2()
                .build(),
        ),
        auth,
    );

    let result = hub
        .spreadsheets()
        .values_get(&payload.sheet_id, &payload.sheet_range)
        .doit()
        .await;

    match result {
        Err(e) => match e {
            Error::HttpError(_)
            | Error::Io(_)
            | Error::MissingAPIKey
            | Error::MissingToken(_)
            | Error::Cancelled
            | Error::UploadSizeLimitExceeded(_, _)
            | Error::Failure(_)
            | Error::BadRequest(_)
            | Error::FieldClash(_)
            | Error::JsonDecodeError(_, _) => sheets::SheetResponse::Error(e),
        },
        Ok((_, res)) => sheets::SheetResponse::Success(format_to_object(res)),
    }
}
