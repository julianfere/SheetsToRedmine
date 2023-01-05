import { invoke } from "@tauri-apps/api";
import { Dispatch, useEffect } from "react";
import { Table } from "../../components/table";
import { message } from "@tauri-apps/api/dialog";
import {
  loadCredentials,
  loadOptions,
  OauthCredentials,
} from "../../utils/fileSystemOperations";
import { ConfigObject } from "../config";
import "./index.scss";
import { useAppContext } from "../../context/appContext";
import { SheetPayload, SheetResponse } from "./types";
import { AppAction } from "../../context/domain";
import { Stats } from "../../components/stats";

const parsePayload = (
  config: ConfigObject,
  credentials: OauthCredentials
): SheetPayload => {
  return {
    ...credentials,
    key_type: credentials.type ?? "",
    sheet_id: config.sheetId,
    sheet_range: config.sheetRange,
  } as SheetPayload;
};

const handleClick = async (dispatch: Dispatch<AppAction>) => {
  const credentials = await loadCredentials();
  const options = await loadOptions();

  const res: SheetResponse[] = await invoke("import_data", {
    payload: parsePayload(options, credentials),
  });
  dispatch({ _tag: "SET_TABLE_DATA", tableData: res });
  dispatch({ _tag: "SET_UPDATE_TO_TRUE" });
};

const handleExportClick = async (tableData: any) => {
  await invoke("export_to_redmine", {
    payload: { api_key: "123", load_cell: "321", time_entries: tableData },
  });
};

const Home = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    loadOptions().then((options) => {
      dispatch({ _tag: "SET_CONFIG", config: options });
    });
  }, []);

  return (
    <>
      <main className="main">
        <div className="btn-container">
          <button
            className={state.update ? "btn-update" : "btn-credentials"}
            onClick={() => handleClick(dispatch)}
          >
            {state.update ? "Update data" : "Import data"}
          </button>
          <button
            className="btn-save"
            onClick={() => handleExportClick(state.tableData)}
          >
            Export data
          </button>
        </div>
        <Table data={state.tableData} />
        <Stats />
      </main>
    </>
  );
};

export { Home };
