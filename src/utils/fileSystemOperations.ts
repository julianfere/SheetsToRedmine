import { appConfigDir, BaseDirectory } from "@tauri-apps/api/path";
import {
  writeTextFile,
  exists,
  createDir,
  readTextFile,
} from "@tauri-apps/api/fs";

export type OauthCredentials = {
  type?: string;
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

export async function optionFileExists() {
  const configDir = await appConfigDir();

  return await exists("options.json", { dir: BaseDirectory.AppConfig });
}

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
  await writeTextFile(
    {
      path: "credentials",
      contents: JSON.stringify(data, null, 2),
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

  const credentials = await readTextFile("credentials", {
    dir: BaseDirectory.AppConfig,
  });

  return JSON.parse(credentials);
}
