import React from "react";
import { FaBars } from "react-icons/fa";
import AdminNavbar from "../../layouts/AdminNavbar";

const Header = () => {
  const toggleSidebar = () => {
    const isExpanded = document.body.classList.contains("sidebar-expanded");
    document.body.classList.toggle("sidebar-expanded", !isExpanded);
    document.body.classList.toggle("sidebar-collapsed", isExpanded);

    localStorage.setItem("adminSidebarExpanded", (!isExpanded).toString());
    window.dispatchEvent(new Event("sidebarToggle"));
  };

  return (
    <>
      <AdminNavbar />
      <header className="header">
        <div className="header-left">
          <FaBars className="sidebar-toggle-btn" onClick={toggleSidebar} />
          <h1>Dashboard</h1>
        </div>

        <div className="header-right">
          {/* You can add other controls or leave this area empty */}
        </div>
      </header>
    </>
  );
};

export default Header;
