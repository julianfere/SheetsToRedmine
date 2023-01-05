extern crate google_sheets4 as sheets4;
use crate::sheets;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sheets4::api::ValueRange;
use sheets4::hyper::client::HttpConnector;
use sheets4::hyper_rustls::HttpsConnector;
use sheets4::Error;
use sheets4::{hyper, hyper_rustls, oauth2, Sheets};

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
    loaded: bool,
}

#[derive(Debug)]
pub enum SheetResponse {
    Success(Vec<SheetData>),
    Error(Error),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthPayload {
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
#[async_trait]
trait Authenticate {
    async fn authenticate(&self) -> Sheets<HttpsConnector<HttpConnector>>;
}

#[async_trait]
impl Authenticate for AuthPayload {
    async fn authenticate(&self) -> Sheets<HttpsConnector<HttpConnector>> {
        let secret: oauth2::ServiceAccountKey = oauth2::ServiceAccountKey {
            key_type: Some(self.key_type.clone()),
            project_id: Some(self.project_id.clone()),
            private_key_id: Some(self.private_key_id.clone()),
            private_key: self.private_key.clone(),
            client_email: self.client_email.clone(),
            client_id: Some(self.client_id.clone()),
            auth_uri: Some(self.auth_uri.clone()),
            token_uri: self.token_uri.clone(),
            auth_provider_x509_cert_url: Some(self.auth_provider_x509_cert_url.clone()),
            client_x509_cert_url: Some(self.client_x509_cert_url.clone()),
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

        hub
    }
}

trait SheetParser {
    fn parse_entries(&self) -> Vec<SheetData>;
}

impl SheetParser for ValueRange {
    fn parse_entries(&self) -> Vec<SheetData> {
        let mut result: Vec<SheetData> = Vec::new();
        let default_string = &"".to_string();
        let binding = self.values.as_ref().unwrap();
        let filtered_data = binding.iter().filter(|x| x[0].len() > 0);
        for row in filtered_data {
            let date = row.get(0).unwrap_or(default_string).to_string();
            let issue = row.get(1).unwrap_or(default_string).to_string();
            let name = row.get(2).unwrap_or(default_string).to_string();
            let comment = row.get(3).unwrap_or(default_string).to_string();
            let project = row.get(4).unwrap_or(default_string).to_string();
            let start = row.get(5).unwrap_or(default_string).to_string();
            let end = row.get(6).unwrap_or(default_string).to_string();
            let duration = row.get(7).unwrap_or(default_string).to_string();
            let loaded = row.get(8).unwrap_or(default_string) != "";
            result.push(SheetData {
                date,
                issue,
                name,
                comment,
                project,
                start,
                end,
                duration,
                loaded,
            });
        }
        result
    }
}

pub async fn import_data_from_sheet(auth_payload: AuthPayload) -> SheetResponse {
    let result = auth_payload
        .authenticate()
        .await
        .spreadsheets()
        .values_get(&auth_payload.sheet_id, &auth_payload.sheet_range)
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
        Ok((_, res)) => sheets::SheetResponse::Success(res.parse_entries()),
    }
}
