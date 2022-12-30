import { useState, useEffect } from "react";
import { SideBar } from "../../components/sidebar";
import { InputForm } from "../../components/input-form";
import { message, open } from "@tauri-apps/api/dialog";
import {
  saveOptions,
  loadOptions,
  saveCredentials,
  OauthCredentials,
} from "../../utils/fileSystemOperations";
import { invoke } from "@tauri-apps/api/tauri";
import "./index.scss";

type ConfigObject = {
  redmineToken: string;
  sheetRange: string;
  sheetId: string;
  sheetName: string;
  loadCell: string;
} & Partial<OauthCredentials>;

const loadCredentialsHandler = async () => {
  const path = await open({
    multiple: false,
    filters: [
      {
        name: "*",
        extensions: ["json"],
      },
    ],
  });

  if (path) {
    const res = await invoke("open_file", { path });
    await saveCredentials(res as OauthCredentials);
    await message("Credentials saved!", {
      title: "Config Manager",
      type: "info",
    });
  }
};

const saveHandler = async (payload: ConfigObject) => {
  try {
    saveOptions(payload);
    await message("Config Saved!", { title: "Config Manager", type: "info" });
  } catch (err) {
    await message("Error saving config!", {
      title: "Config Manager",
      type: "error",
    });
  }
};

export const Config = () => {
  const [config, setConfig] = useState<ConfigObject>({} as ConfigObject);

  useEffect(() => {
    loadOptions().then((options) => {
      setConfig((old) => ({ ...old, ...options }));
    });
  }, []);

  return (
    <>
      <SideBar />
      <article className="container">
        <section className="form-container">
          <div>
            <InputForm
              placeholder={config.redmineToken}
              title="Redmine token"
              handler={(token) =>
                setConfig((old) => ({ ...old, redmineToken: token }))
              }
            />
            <InputForm
              placeholder={config.sheetRange}
              title="Sheet range"
              handler={(range) =>
                setConfig((old) => ({ ...old, sheetRange: range }))
              }
            />
            <InputForm
              placeholder={config.sheetId}
              title="Spread sheet id"
              handler={(id) => setConfig((old) => ({ ...old, sheetId: id }))}
            />
          </div>
          <div>
            <InputForm
              title="Sheet name"
              placeholder={config.sheetName}
              handler={(name) =>
                setConfig((old) => ({ ...old, sheetName: name }))
              }
            />
            <InputForm
              title="Load cell"
              placeholder={config.loadCell}
              handler={(cell) =>
                setConfig((old) => ({ ...old, loadCell: cell }))
              }
            />
          </div>
        </section>
        <section className="btn-container">
          <button className="btn-credentials" onClick={loadCredentialsHandler}>
            Load credentials
          </button>
          <button
            className="btn-save"
            onClick={() =>
              saveHandler({
                redmineToken: config.redmineToken,
                sheetRange: config.sheetRange,
                sheetId: config.sheetId,
                sheetName: config.sheetName,
                loadCell: config.loadCell,
              })
            }
          >
            Save changes
          </button>
        </section>
      </article>
    </>
  );
};
