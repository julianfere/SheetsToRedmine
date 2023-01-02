export type SheetPayload = {
  key_type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  sheet_id: string;
  sheet_range: string;
};

export type SheetResponse = {
  date: string;
  issue: string;
  name: string;
  comment: string;
  project: string;
  start: string;
  end: string;
  duration: string;
  loaded: boolean;
};
