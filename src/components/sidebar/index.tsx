import { NavLink } from "react-router-dom";
import "./index.scss";

export const SideBar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul className="styled-nav">
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
              to="/config"
            >
              Config
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
