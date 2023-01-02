import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar";

export const Template = () => {
  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
};
