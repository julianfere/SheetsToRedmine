import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";
import "./index.scss";

export const Layout = () => {
  return (
    <main className="parent">
      <Sidebar />
      <section className="content">
        <Outlet />
      </section>
    </main>
  );
};
