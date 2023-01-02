import { SheetResponse } from "../pages/layout/types";

type AppState = {
  update: boolean;
  tableData: SheetResponse[];
  config: ConfigObject;
};

type SetUpdateToTrueAction = {
  _tag: "SET_UPDATE_TO_TRUE";
};

type SetTableDataAction = {
  _tag: "SET_TABLE_DATA";
  tableData: SheetResponse[];
};

type SetConfigAction = {
  _tag: "SET_CONFIG";
  config: ConfigObject;
};

type AppAction = SetUpdateToTrueAction | SetTableDataAction | SetConfigAction;

const getInitialState = (): AppState => ({
  update: false,
  tableData: Array(10).fill({
    date: "",
    issue: "",
    name: "",
    comment: "",
    project: "",
    start: "",
    end: "",
    duration: "",
    loaded: "",
  }),
  config: {} as ConfigObject,
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  const { _tag } = action;
  switch (_tag) {
    case "SET_UPDATE_TO_TRUE":
      return {
        ...state,
        update: true,
      };
    case "SET_TABLE_DATA":
      return {
        ...state,
        tableData: action.tableData,
      };
    case "SET_CONFIG":
      return {
        ...state,
        config: action.config,
      };

    default:
      return state;
  }
};

type ConfigObject = {
  redmineToken: string;
  sheetRange: string;
  sheetId: string;
  sheetName: string;
  loadCell: string;
  hoursPerDay: string;
  workDays: string;
};

export {
  type AppState,
  type AppAction,
  type ConfigObject,
  getInitialState,
  appReducer,
};
