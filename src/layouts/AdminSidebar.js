import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminsidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faFolderOpen,
  faFile,
  faReceipt,
  faGear,
  faBars,
  faChartBar,
  faSignOutAlt,
  faExclamationTriangle,
  faFileAlt,
  faBug,
  faShieldAlt,
  faLifeRing,
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsActive(!isActive);
    localStorage.setItem("adminSidebarActive", !isActive);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <section>
      <div className="admin-menu-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      <aside className={`admin-sidebar ${isActive ? "active" : ""}`}>
        <div className="admin-header-wrapper">
          <h2>Vertex<span className="highlight">Guard</span></h2>
        </div>

        <nav>
          <p className="sidebar-section">General</p>
          <ul>
            <li className="active">
              <Link to="/admin" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faChartBar} />
                Overview
              </Link>
            </li>
            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faExclamationTriangle} />
                Issues
              </Link>
            </li>
            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faFileAlt} />
                Files
              </Link>
            </li>
          </ul>

          <p className="sidebar-section">Reports</p>
          <ul>
            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faBug} />
                Threat Details
              </Link>
            </li>
            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faShieldAlt} />
                Threats
              </Link>
            </li>
          </ul>

          <p className="sidebar-section">Settings</p>
          <ul>
            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faLifeRing} />
                Help & Supports
              </Link>
            </li>
            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faGear} />
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        <div className="logout_container">
          <button className="logout_btn" onClick={handleLogout}>
            <FontAwesomeIcon className="logout_icon" icon={faSignOutAlt} />
            Logout
          </button>
        </div>
      </aside>
    </section>
  );
};

export default AdminSidebar;
