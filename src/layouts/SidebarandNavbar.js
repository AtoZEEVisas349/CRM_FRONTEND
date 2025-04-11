import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import ExecutiveActivity from "../features/executive/ExecutiveActivity";
import { recordStopWork } from "../services/executiveService";
import { useApi } from "../context/ApiContext"; // ✅ Using your ApiContext
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUsers,
  faUserPlus,
  faFile,
  faReceipt,
  faGear,
  faList,
  faCircleXmark,
  faClock,
  faBars,
  faCircleQuestion,
  faBell,
  faCircleUser,
  faRobot,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const SidebarandNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showUserPopover, setShowUserPopover] = useState(false);
  const { user, logout } = useAuth(); // ✅ Only use what's provided
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  const { executiveInfo, executiveLoading, fetchExecutiveData } = useApi(); // ✅ Access context
  const navigate = useNavigate();
  const popoverRef = useRef(null);
  const userIconRef = useRef(null);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };
  const handleLogout = async () => {
    const executiveId = localStorage.getItem("executiveId");
  
    try {
      // Stop work if executiveId exists
      if (executiveId) {
        await recordStopWork({ executiveId });
      }
  
      // Call the logout function from context (not authService directly!)
      await logout();
  
      // ✅ Do not manually clear localStorage or setUser here, it's already handled inside context
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  
  
  const handleUserIconClick = () => {
    setShowUserPopover((prev) => !prev);
    fetchExecutiveData(); // ✅ Use context function to fetch latest data
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isLightMode) {
      root.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
  }, [isLightMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setShowUserPopover(false);
      }

      const sidebar = document.querySelector(".sidebar_container");
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
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <section className="sidebar_navbar">
      {/* Sidebar */}
      <section className={`sidebar_container ${isActive ? "active" : ""}`}>
        <div className="sidebar_heading">
          <h1>AtoZeeVisas</h1>
        </div>

        <div>
          <h3 className="sidebar_crm">CRM</h3>
        </div>

        <nav className="navbar_container">
          <ul><b>
            <li>
              <Link to="/executive" className="sidebar_nav">
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="#"
                className="sidebar_nav"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faUserPlus} />
                </span>
                Leads
                <span style={{ marginLeft: "auto", fontSize: "12px" }}>▼</span>
              </Link>

              {isOpen && (
                <ul className="submenu_nav">
                  <li>
                    <Link to="/freshlead" className="submenu_item">
                      <span className="submenu_icon">
                        <FontAwesomeIcon icon={faUsers} />
                      </span>
                      Fresh Leads
                    </Link>
                  </li>
                  <li>
                    <Link to="/follow-up" className="submenu_item">
                      <span className="submenu_icon">
                        <FontAwesomeIcon icon={faList} />
                      </span>
                      Follow ups
                    </Link>
                  </li>
                  <li>
                    <Link to="/customer" className="submenu_item">
                      <span className="submenu_icon">
                        <FontAwesomeIcon icon={faClock} />
                      </span>
                      Convert
                    </Link>
                  </li>
                  <li>
                    <Link to="/close-leads" className="submenu_item">
                      <span className="submenu_icon">
                        <FontAwesomeIcon icon={faCircleXmark} />
                      </span>
                      Close
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="#" className="sidebar_nav">
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faFile} />
                </span>
                Task Management
              </Link>
            </li>

            <li>
              <Link to="#" className="sidebar_nav">
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faReceipt} />
                </span>
                Invoice
              </Link>
            </li>

            <li>
              <Link to="#" className="sidebar_nav">
                <span className="sidebar_icon">
                  <FontAwesomeIcon icon={faGear} />
                </span>
                Settings
              </Link>
            </li>
            <li>
              <div className="theme_toggle_wrapper">
                <div
                  className={`theme_toggle_btn ${isLightMode ? "light-mode-toggle" : "dark-mode-toggle"}`}
                  onClick={() => setIsLightMode((prev) => !prev)}
                >
                  <div className="toggle-label">Light</div>
                  <div className="toggle-label">Dark</div>
                  <div className="toggle-slider"></div>
                </div>
              </div>
            </li>
          </b></ul>
        </nav>
      </section>

      {/* Navbar */}
      <section className="navbar">
        <div className="menu_search">
          <button className="menu_toggle" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>

          <div className="search_bar">
            <input className="search_input" placeholder="Search" />
          </div>
        </div>

        <div className="navbar_icons">
          <FontAwesomeIcon className="navbar_icon" icon={faCircleQuestion} />
          <FontAwesomeIcon className="navbar_icon" icon={faBell} />
          <FontAwesomeIcon
            ref={userIconRef}
            className="navbar_icon"
            icon={faCircleUser}
            onClick={handleUserIconClick} // ✅ Call the function here
            style={{ cursor: "pointer", position: "relative" }}
          />
          <FontAwesomeIcon
            className="navbar_icon bot_icon"
            icon={faRobot}
            onClick={() => window.open("/chatbot", "_blank")}
            style={{ cursor: "pointer" }}
          />
          <FontAwesomeIcon
            className="navbar_icon"
            icon={faClock}
            title="Toggle Activity Tracker"
            onClick={() => setShowTracker((prev) => !prev)}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* User Popover */}
        {showUserPopover && (
  <div className="user_popover" ref={popoverRef}>
    {executiveLoading ? (
      <p>Loading user details........</p>
    ) : (
      <>
        <div className="user_details">
          <div className="user_avatar">{executiveInfo.name?.charAt(0)}</div>
          <div>
            <p className="user_name">{executiveInfo.name}</p>
            <p className="user_email">{executiveInfo.email}</p>
            <p className="user_role">{executiveInfo.role}</p>
          </div>
        </div>
        <button className="logout_btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: "8px" }} />
          Logout
        </button>
      </>
    )}
  </div>
)}
</section>
      {/* Activity Tracker */}
      {showTracker && <ExecutiveActivity />}
    </section>
  );
};

export default SidebarandNavbar;