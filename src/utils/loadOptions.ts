import { appConfigDir, BaseDirectory } from "@tauri-apps/api/path";
import { readTextFile, exists, createDir } from "@tauri-apps/api/fs";

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
