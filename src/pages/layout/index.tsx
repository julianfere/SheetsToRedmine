import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar";
import "./index.scss";

export const Template = () => {
  return (
    <main className="parent">
      <SideBar />
      <section className="content">
        <Outlet />
      </section>
    </main>
  );
};
