import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/adminsidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faFolderOpen,
  faFile,
  faReceipt,
  faGear,
  faBars,
  faChartBar
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("adminSidebarActive");
    if (savedState === "true") {
      setIsActive(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsActive(!isActive);
    localStorage.setItem("adminSidebarActive", !isActive);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".admin-sidebar");
      const menuToggle = document.querySelector(".admin-menu-toggle");
      if (
        sidebar &&
        menuToggle &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section>
      <div className="admin-menu-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      <aside className={`admin-sidebar ${isActive ? "active" : ""}`}>
        <div className="admin-header-wrapper">
          <h2>AtoZee Visas</h2>
          <p className="admin-crm-label">CRM</p>
        </div>
        <nav>
          <ul>
            <li className="active">
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faChartBar} />
                Report
              </Link>
            </li>
            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faUsers} />
                Client
              </Link>
            </li>
            <li>
              <a href="/admin/assign-task" target="_blank" rel="noopener noreferrer" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faFolderOpen} />
                Assign Task
              </a>
            </li>

            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faFile} />
                Task Management
              </Link>
            </li>
            <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faReceipt} />
                Invoice
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
