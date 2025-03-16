import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminsidebar from "../styles/adminsidebar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlagCheckered,
  faUsers,
  faFolderOpen,
  faFile,
  faReceipt,
  faGear,
  faBars,
  faPhone,
  faMessage,
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar");
      const menuToggle = document.querySelector(".menu_toggle");
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
      <aside className={`sidebar ${isActive ? "active" : ""}`}>
        <h2>AtoZee Visas</h2>
        <p className="crm_label">CRM</p>
        <nav>
          <ul>
            <li className="active">
              <Link to="#" className="aside_link">
              📊 Report
              </Link>
            </li>
            <li>
              <Link to="#" className="aside_link">
                <span>
                  <FontAwesomeIcon className="aside_icon" icon={faUsers} />
                </span>
                Client
              </Link>
            </li>
            <li>
              <Link to="#" className="aside_link" target="_blank">
                <span>
                  <FontAwesomeIcon className="aside_icon" icon={faFolderOpen} />
                </span>
                Assign Task
              </Link>
            </li>
            <li>
              <Link to="#" className="aside_link">
                <span>
                  <FontAwesomeIcon className="aside_icon" icon={faFile} />
                </span>
                Task Management
              </Link>
            </li>
            <li>
              <Link to="#" className="aside_link">
                <span>
                  <FontAwesomeIcon className="aside_icon" icon={faReceipt} />
                </span>
                Invoice
              </Link>
            </li>
            <li>
              <Link to="#" className="aside_link">
                <span>
                  <FontAwesomeIcon className="aside_icon" icon={faGear} />
                </span>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <section className="admin-dashboard_container">
        <header className="admin-heading1">
          <button
            className="admin-menu_toggle"
            onClick={toggleSidebar}
            aria-expanded={isActive}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="admin-logo">
            <FontAwesomeIcon className="admin-logo_name" icon={faPhone} />
            <FontAwesomeIcon className="admin-logo_name" icon={faMessage} />
            <FontAwesomeIcon className="admin-logo_name" icon={faBell} />
            <FontAwesomeIcon className="admin-logo_name" icon={faUser} />
          </div>
        </header>
      </section>
    </section>
  );
};

export default AdminSidebar;
