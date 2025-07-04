import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminsidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PieChart,
  FolderOpen,
  ClipboardList,
  UserPlus,
  Users,
  CalendarCheck,
  Settings,
  HelpCircle,
  UserCog,
  FileText,
  Gauge,
} from "lucide-react";

const HrSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem("adminSidebarExpanded");
    return stored === "true";
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Update body classes whenever isExpanded changes
    document.body.classList.toggle("sidebar-expanded", isExpanded);
    document.body.classList.toggle("sidebar-collapsed", !isExpanded);
    document.body.classList.toggle("sidebar-mobile-active", !isExpanded);

    const handleSidebarToggle = () => {
      const updated = localStorage.getItem("adminSidebarExpanded") === "true";
      setIsExpanded(updated);
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
    window.dispatchEvent(new Event("sidebarToggle"));  };

  return (
    <section>
      <button
        className="admin-menu_toggle"
        onClick={toggleSidebar}
        aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <Gauge className="admin-aside-icon" />
      </button>
      <aside
        className={`admin-sidebar ${
          isExpanded ? "expanded active" : "collapsed"
        }`}
      >
        <div className="admin-header-wrapper">
          <h2>
            <span className="highlight">Atozee Visas</span>
          </h2>
        </div>

        <nav>
          <p className="sidebar-section sidebar-label">General</p>
          <ul>
            <li className="active">
              <Link to="/hr" className="admin-aside-link">
                <PieChart className="admin-aside-icon" />
                <span className="sidebar-label">Overview</span>
              </Link>
            </li>
            <li>
              <Link to="/hr/assign-task" className="admin-aside-link">
                <FolderOpen className="admin-aside-icon" />
                <span className="sidebar-label">Assign Task</span>
              </Link>
            </li>
            <li>
              <Link to="/hr/leadassign" className="admin-aside-link">
                <ClipboardList className="admin-aside-icon" />
                <span className="sidebar-label">Lead Assign</span>
              </Link>
            </li>
            <li>
              <Link to="/hr/executiveform" className="admin-aside-link">
                <UserPlus className="admin-aside-icon" />
                <span className="sidebar-label">Create Executive</span>
              </Link>
            </li>
            <li>
              <Link to="/hr/monitoring" className="admin-aside-link">
                <UserCog className="admin-aside-icon" />
                <span className="sidebar-label">Monitoring</span>
              </Link>
            </li>
          </ul>

          <p className="sidebar-section sidebar-label">Reports</p>
          <ul>
            <li>
              <Link to="/hr/eod-report" className="admin-aside-link">
                <FileText className="admin-aside-icon" />
                <span className="sidebar-label">EOD Report</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/hr/executive-details" className="admin-aside-link">
                <Users className="admin-aside-icon" />
                <span className="sidebar-label">Executive Details</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/hr/leave-management" className="admin-aside-link">
                <Users className="admin-aside-icon" />
                <span className="sidebar-label">Leave Management</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/hr/executive-attendance" className="admin-aside-link">
                <CalendarCheck className="admin-aside-icon" />
                <span className="sidebar-label">Attendance</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/hr/help-support" className="admin-aside-link">
                <HelpCircle className="admin-aside-icon" />
                <span className="sidebar-label">Help & Supports</span>
              </Link>
            </li>
            <li>
              <Link to="/hr/settings" className="admin-aside-link">
                <Settings className="admin-aside-icon" />
                <span className="sidebar-label">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </section>
  );
};

export default HrSidebar;
