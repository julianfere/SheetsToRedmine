import { useState } from "react";
import "./index.scss";

type HamburgerMenuProps = {
  openHandler: () => void;
};
type OpenSidebarProps = {
  closeHandler: () => void;
};

const OpenSidebar = ({ closeHandler }: OpenSidebarProps) => {
  return (
    <section className="sidebar sidebar-open">
      <div className="close-button" onClick={closeHandler}>
        X
      </div>
      <nav>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
        </ul>
      </nav>
    </section>
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
