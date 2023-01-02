import React from "react";

import { getInitialState, appReducer } from "./domain";
import { AppContext } from "./appContext";

type AppProviderProps = {
  children: JSX.Element | JSX.Element[];
};

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = React.useReducer(appReducer, getInitialState());
  const value = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppProvider };
