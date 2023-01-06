import { Dispatch, useEffect, useState } from "react";
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
import { AppAction, ConfigObject } from "../../context/domain";
import { useAppContext } from "../../context/appContext";

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

const saveHandler = async (
  payload: ConfigObject,
  dispatch: Dispatch<AppAction>
) => {
  try {
    saveOptions(payload);
    dispatch({ _tag: "SET_CONFIG", config: payload });
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
  const { dispatch } = useAppContext();

  useEffect(() => {
    loadOptions().then((options) => {
      setConfig((old) => ({ ...old, ...options }));
      dispatch({ _tag: "SET_CONFIG", config: options });
    });
  }, []);

  return (
    <>
      <article className="container">
        <details>
          <summary>Sheet & Redmine config</summary>
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
              <InputForm
                placeholder={config.sheetId}
                title="Redmine url"
                handler={(url) =>
                  setConfig((old) => ({ ...old, redmineUrl: url }))
                }
              />
            </div>
            <div>
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
            <button
              className="btn-credentials"
              onClick={loadCredentialsHandler}
            >
              Load credentials
            </button>
          </section>
        </details>
        <details>
          <summary>Work load config</summary>
          <section className="form-container">
            <InputForm
              title="Work load"
              placeholder={config.hoursPerDay}
              handler={(cell) =>
                setConfig((old) => ({ ...old, hoursPerDay: cell }))
              }
            />
            <InputForm
              title="Work days"
              placeholder={config.workDays}
              handler={(cell) =>
                setConfig((old) => ({ ...old, workDays: cell }))
              }
            />
          </section>
        </details>
        <section className="btn-container">
          <button
            className="btn-save"
            onClick={() => saveHandler(config, dispatch)}
          >
            Save changes
          </button>
        </section>
      </article>
    </>
  );
};
export type { ConfigObject };
