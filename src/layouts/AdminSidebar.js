import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminsidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faGauge,
  faClipboardList,
  faUserTie,
  faCircleQuestion,
  faSliders,
  faChartPie,
  faUserGear,
  faUserPlus,
  faCalendarCheck
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize sidebar state from localStorage
    const stored = localStorage.getItem("adminSidebarExpanded");
    const initialExpanded = stored === "false" ? false : true;
    setIsExpanded(initialExpanded);
    document.body.classList.toggle("sidebar-mobile-active", !initialExpanded);

    const handleSidebarToggle = () => {
      const updated = localStorage.getItem("adminSidebarExpanded") === "true";
      setIsExpanded(updated);
      document.body.classList.toggle("sidebar-mobile-active", !updated);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold && isExpanded) {
        toggleSidebar();
      }
      if (touchEndX - touchStartX > swipeThreshold && !isExpanded) {
        toggleSidebar();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isExpanded]);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem("adminSidebarExpanded", newState.toString());
    window.dispatchEvent(new Event("sidebarToggle"));
    document.body.classList.toggle("sidebar-mobile-active", !newState);
  };

  return (
    <section>
      <button
        className="admin-menu_toggle"
        onClick={toggleSidebar}
        aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <FontAwesomeIcon icon={faGauge} />
      </button>
      <aside className={`admin-sidebar ${isExpanded ? "expanded active" : "collapsed"}`}>
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
                <span className="sidebar-label">Assign Task</span>
              </Link>
            </li>
            <li>
              <Link to="/leadassign" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faClipboardList} />
                <span className="sidebar-label">Task Management</span>
              </Link>
            </li>
            <li>
              <Link to="/executiveform" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faUserPlus} />
                <span className="sidebar-label">Create Executive</span>
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
          <Link to="/admin/eod-report" className="admin-aside-link">
            <FontAwesomeIcon className="admin-aside-icon" icon={faClipboardList} />
            <span className="sidebar-label">EOD Report</span>
          </Link>
        </li>
          </ul>
          <ul>
            <li>
              <Link to="/admin/executive-details" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faUserTie} />
                <span className="sidebar-label">Executive Details</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/admin/executive-attendance" className="admin-aside-link">
                <FontAwesomeIcon className="admin-aside-icon" icon={faCalendarCheck} />
                <span className="sidebar-label">Attendance</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
            <Link to="/admin/help-support" className="admin-aside-link">
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
          </ul>
        </nav>
      </aside>
    </section>
  );
};

export default AdminSidebar;