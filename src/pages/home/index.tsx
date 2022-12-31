import { invoke } from "@tauri-apps/api";
import { Dispatch, SetStateAction, useState } from "react";
import { SideBar } from "../../components/sidebar";
import { Table } from "../../components/table";
import { message } from "@tauri-apps/api/dialog";
import {
  loadCredentials,
  loadOptions,
  OauthCredentials,
} from "../../utils/fileSystemOperations";
import { ConfigObject } from "../config";
import "./index.scss";

const initialData = () =>
  Array(10).fill({
    date: "",
    issue: "",
    name: "",
    comment: "",
    project: "",
    start: "",
    end: "",
    duration: "",
    loaded: "",
  });

type SheetPayload = {
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

const handleClick = async (
  dispatch: Dispatch<SetStateAction<SheetResponse[]>>
) => {
  const credentials = await loadCredentials();
  const options = await loadOptions();

  const res: SheetResponse[] = await invoke("import_data", {
    payload: parsePayload(options, credentials),
  });
  dispatch((prev) => [...res]);
  console.log(res);
};

const handleExportClick = async () => {
  await message("Not implemented yet", {
    title: "Not implemented yet",
    type: "error",
  });
};

function Home() {
  const [tableData, setTableData] = useState<SheetResponse[]>(initialData);
  return (
    <>
      <SideBar />
      <main className="main">
        <div className="btn-container">
          <button
            className="btn-credentials"
            onClick={() => handleClick(setTableData)}
          >
            Import data
          </button>
          <button className="btn-save" onClick={handleExportClick}>
            Export data
          </button>
        </div>
        <Table data={tableData} />
        <section className="info-container"></section>
      </main>
    </>
  );
}

export default Home;
