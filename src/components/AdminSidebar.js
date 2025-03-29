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
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("executiveName");

    navigate("/login");

    setTimeout(() => {
      window.location.reload(); // ✅ Prevent going back after logout
    }, 100);
  };

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
              <Link to="/admin" className="admin-aside-link">
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
              <Link to="/leadassign" className="admin-aside-link">
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

        {/* ✅ Logout Button */}
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
