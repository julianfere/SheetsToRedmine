import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/home";
import "./style.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Config } from "./pages/config";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/config",
    element: <Config />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
