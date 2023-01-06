import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./pages/layout";
import { Home } from "./pages/home";
import "./style.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Config } from "./pages/config";
import { AppProvider } from "./context/AppProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/config",
        element: <Config />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
