import React, { type Dispatch } from "react";
import { AppAction, AppState } from "./domain";

type AppContextProps = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};

const AppContext = React.createContext<AppContextProps | undefined>(undefined);

const useAppContext: () => AppContextProps = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export { useAppContext, AppContext };
