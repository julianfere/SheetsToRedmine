import { appConfigDir, BaseDirectory } from "@tauri-apps/api/path";
import { writeTextFile, exists, createDir } from "@tauri-apps/api/fs";

export async function saveOptions(options: any) {
  const configDir = await appConfigDir();

  if (!(await exists(configDir))) {
    await createDir(configDir);
  }

  await writeTextFile("options.json", JSON.stringify(options), {
    dir: BaseDirectory.AppConfig,
  });
}
