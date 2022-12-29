import { useState, useEffect } from "react";
import { SideBar } from "../../components/sidebar";
import { TokenForm } from "../../components/token-form";
import { message } from "@tauri-apps/api/dialog";
import "./index.scss";
import { saveOptions } from "../../utils/saveOptions";
import { loadOptions } from "../../utils/loadOptions";

type ConfigObject = {
  redmineToken: string;
  sheetsToken: string;
  sheetId: string;
  sheetName: string;
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
  const [sheetsToken, setSheetsToken] = useState("SheetsToken");
  const [redmineToken, setRedmineToken] = useState("RedmineToken");
  const [sheetId, setSheetId] = useState("SheetId");
  const [sheetName, setSheetName] = useState("SheetName");

  useEffect(() => {
    loadOptions().then((options) => {
      setRedmineToken(options.redmineToken);
      setSheetsToken(options.sheetsToken);
      setSheetId(options.sheetId);
      setSheetName(options.sheetName);
    });
  }, []);

  return (
    <>
      <SideBar />
      <section className="form-container">
        <h1>Tokens</h1>
        <TokenForm
          placeholder={redmineToken}
          title="Redmine"
          handler={(token) => setRedmineToken(token)}
        />
        <TokenForm
          placeholder={sheetsToken}
          title="Sheets"
          handler={(token) => setSheetsToken(token)}
        />
        <h1>Sheet config</h1>
        <TokenForm
          placeholder={sheetId}
          title="SheetId"
          handler={(id) => setSheetId(id)}
        />
        <TokenForm
          title="SheetName"
          placeholder={sheetName}
          handler={(name) => setSheetName(name)}
        />
        <section className="btn-container">
          <button
            className="btn-save"
            onClick={() =>
              saveHandler({
                redmineToken,
                sheetsToken,
                sheetId,
                sheetName,
              })
            }
          >
            Save changes
          </button>
        </section>
      </section>
    </>
  );
};
