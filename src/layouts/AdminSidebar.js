import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminsidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faGauge,
  faTasks,
  faClipboardList,
  faUserTie,
  faFileInvoiceDollar,
  faCircleQuestion,
  faSliders,
  faChartPie,
  faUserGear
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("adminSidebarExpanded");
    if (stored === "false") {
      setIsExpanded(false);
    }

    const handleSidebarToggle = () => {
      const updated = localStorage.getItem("adminSidebarExpanded") === "true";
      setIsExpanded(updated);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);


  return (
    <section>
      <aside className={`admin-sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
        <div className="admin-header-wrapper">
          <h2>
            <span className="highlight">Atozee Visas</span>
          </h2>
        </div>

        <nav>
          <p className="sidebar-section sidebar-label">General</p>
          <ul>
            <li className="active">
              <Link to="/admin" className="admin-aside-link">
              <FontAwesomeIcon className="admin-aside-icon" icon={faChartPie} />
               <span className="sidebar-label">Overview</span>

              </Link>
            </li>
            <li>
            <Link to="/admin/assign-task" className="admin-aside-link">
              <FontAwesomeIcon className="admin-aside-icon" icon={faFolderOpen} />
              Assign Task
            </Link>
            </li>
            <li>
              <Link to="/leadassign" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faClipboardList} />
                <span className="sidebar-label">Task Management</span>
              </Link>
            </li>
            <li>
              <Link to="/monitoring" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faUserGear} />
                <span className="sidebar-label">Monitoring</span>
              </Link>
            </li>

          </ul>

          <p className="sidebar-section sidebar-label">Reports</p>
          <ul>
            <li>
              <Link to="/admin/executive-details" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faUserTie} />
                <span className="sidebar-label">Executive Details</span>
              </Link>
            </li>
            {/* <li>
              <Link to="#" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faFileInvoiceDollar} />
                <span className="sidebar-label">Invoice</span>
              </Link>
            </li> */}
          </ul>
          <ul>
          <li>
              <Link to="help-support" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faCircleQuestion} />
                <span className="sidebar-label">Help & Supports</span>
              </Link>
            </li>
            <li>
            <Link to="/admin/settings" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faSliders} />
                <span className="sidebar-label">Settings</span>
              </Link>
            </li>
            {/* <li>
            <Link to="/admin/cast" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faSliders} />
                <span className="sidebar-label">Cast</span>
              </Link>
            </li> */}
          </ul>
        </nav>
      </aside>
    </section>
  );
};

export default AdminSidebar;
