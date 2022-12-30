import { appConfigDir, BaseDirectory } from "@tauri-apps/api/path";
import {
  writeTextFile,
  writeBinaryFile,
  exists,
  createDir,
  readTextFile,
  readBinaryFile,
} from "@tauri-apps/api/fs";

export type OauthCredentials = {
  key_type?: string;
  project_id?: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
  client_id?: string;
  auth_uri?: string;
  token_uri: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
};

export async function saveOptions(options: any) {
  const configDir = await appConfigDir();

  if (!(await exists(configDir))) {
    await createDir(configDir);
  }

  await writeTextFile("options.json", JSON.stringify(options), {
    dir: BaseDirectory.AppConfig,
  });
}

export async function saveCredentials(data: OauthCredentials) {
  await writeBinaryFile(
    {
      path: "credentials",
      contents: new TextEncoder().encode(JSON.stringify(data, null, 2)),
    },
    { dir: BaseDirectory.AppConfig }
  );
}

export async function loadOptions() {
  const configDir = await appConfigDir();

  if (!(await exists(configDir))) {
    await createDir(configDir);
  }

  const options = await readTextFile("options.json", {
    dir: BaseDirectory.AppConfig,
  });

  return JSON.parse(options);
}

export async function loadCredentials() {
  const configDir = await appConfigDir();

  if (!(await exists(configDir))) {
    await createDir(configDir);
  }

  const credentials = await readBinaryFile("credentials", {
    dir: BaseDirectory.AppConfig,
  });

  return JSON.parse(Buffer.from(credentials).toString("utf-8"));
}
