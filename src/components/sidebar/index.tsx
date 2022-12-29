import { useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";

type HamburgerMenuProps = {
  openHandler: () => void;
};
type OpenSidebarProps = {
  closeHandler: () => void;
};

const OpenSidebar = ({ closeHandler }: OpenSidebarProps) => {
  return (
    <aside className="sidebar sidebar-open">
      <div className="close-button" onClick={closeHandler}>
        X
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/config">Config</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

const HamburgerMenu = ({ openHandler }: HamburgerMenuProps) => {
  return (
    <div className="hamburger-menu" onClick={openHandler}>
      <div className="top-line"></div>
      <div className="middle-line"></div>
      <div className="bottom-line"></div>
    </div>
  );
};

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return isOpen ? (
    <OpenSidebar closeHandler={() => setIsOpen(false)} />
  ) : (
    <HamburgerMenu openHandler={() => setIsOpen((old) => !old)} />
  );
};
