import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminsidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faFile,
  faReceipt,
  faGear,
  faBars,
  faChartBar,
  faUsers,
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
          <h2>Atozee<span className="highlight">Visas</span></h2>
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
            <a href="/assign-task" target="_blank" rel="noopener noreferrer" className="admin-aside-link">
              <FontAwesomeIcon className="admin-aside-icon" icon={faFolderOpen} />
              Assign Task
            </a>
          </li>
           <li>
            <Link to="/leadassign" className="admin-aside-link">
              <FontAwesomeIcon className="admin-aside-icon" icon={faFile} />
              Task Management
            </Link>
          </li>
          </ul>

          <p className="sidebar-section">Reports</p>
          <ul>
            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faUsers} />
                Executive Details
              </Link>
            </li>
            <li>
            <Link to="#" className="admin-aside-link">
              <FontAwesomeIcon className="admin-aside-icon" icon={faReceipt} />
              Invoice
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
      </aside>
    </section>
  );
};

export default AdminSidebar;
