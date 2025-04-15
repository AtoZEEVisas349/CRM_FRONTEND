import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import ExecutiveActivity from "../features/executive/ExecutiveActivity";
import { recordStopWork } from "../services/executiveService";
import { useApi } from "../context/ApiContext"; // ✅ Using your ApiContext
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
import { FaPlay, FaClock } from "react-icons/fa";

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
      // if (executiveId) {
      //   await recordStopWork({ executiveId });
      // }
  
      // Call the logout function from context (not authService directly!)
      await logout();
  
      // ✅ Do not manually clear localStorage or setUser here, it's already handled inside context
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  const [workTime, setWorkTime] = useState("00:00");
  const [breakTime, setBreakTime] = useState("00:00");
  const [isWorkRunning, setIsWorkRunning] = useState(false);
  const [isBreakRunning, setIsBreakRunning] = useState(false);
  const workIntervalRef = useRef(null);
  const breakIntervalRef = useRef(null);

  const handleWorkToggle = () => {
    if (isWorkRunning) {
      clearInterval(workIntervalRef.current);
      setIsWorkRunning(false);
      setWorkTime("00:00");
    } else {
      let time = 25 * 60;
      workIntervalRef.current = setInterval(() => {
        time--;
        const min = String(Math.floor(time / 60)).padStart(2, "0");
        const sec = String(time % 60).padStart(2, "0");
        setWorkTime(`${min}:${sec}`);
        if (time <= 0) {
          clearInterval(workIntervalRef.current);
          setIsWorkRunning(false);
          setWorkTime("00:00");
        }
      }, 1000);
      setIsWorkRunning(true);
    }
  };

  const toggleBreak = () => {
    if (isBreakRunning) {
      clearInterval(breakIntervalRef.current);
      setIsBreakRunning(false);
      setBreakTime("00:00");
    } else {
      let time = 5 * 60;
      breakIntervalRef.current = setInterval(() => {
        time--;
        const min = String(Math.floor(time / 60)).padStart(2, "0");
        const sec = String(time % 60).padStart(2, "0");
        setBreakTime(`${min}:${sec}`);
        if (time <= 0) {
          clearInterval(breakIntervalRef.current);
          setIsBreakRunning(false);
          setBreakTime("00:00");
        }
      }, 1000);
      setIsBreakRunning(true);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearInterval(workIntervalRef.current);
      clearInterval(breakIntervalRef.current);
    };
  }, []);

  const [hourDeg, setHourDeg] = useState(0);
  const [minuteDeg, setMinuteDeg] = useState(0);
  const [secondDeg, setSecondDeg] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      setSecondDeg(seconds * 6); // 360 / 60
      setMinuteDeg(minutes * 6 + seconds * 0.1); // 360 / 60 + smooth transition
      setHourDeg((hours % 12) * 30 + minutes * 0.5); // 360 / 12 + progress
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);


  
  const handleUserIconClick = async () => {
    setShowUserPopover((prev) => !prev);
  await  fetchExecutiveData(); // ✅ Use context function to fetch latest data
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
          <ul>
            <li><Link to="/executive" className="sidebar_nav"><FontAwesomeIcon icon={faHouse} /> Dashboard</Link></li>
            <li>
              <Link to="#" className="sidebar_nav" onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon={faUserPlus} /> Leads
                <span style={{ marginLeft: "auto", fontSize: "12px" }}>▼</span>
              </Link>
              {isOpen && (
                <ul className="submenu_nav">
                  <li><Link to="/freshlead" className="sidebar_nav"><FontAwesomeIcon icon={faUsers} /> Fresh Leads</Link></li>
                  <li><Link to="/follow-up" className="sidebar_nav"><FontAwesomeIcon icon={faList} /> Follow ups</Link></li>
                  <li><Link to="/customer" className="sidebar_nav"><FontAwesomeIcon icon={faClock} /> Convert</Link></li>
                  <li><Link to="/close-leads" className="sidebar_nav"><FontAwesomeIcon icon={faCircleXmark} /> Close</Link></li>
                </ul>
              )}
            </li>
            <li><Link to="#" className="sidebar_nav"><FontAwesomeIcon icon={faFile} /> Task Management</Link></li>
            <li><Link to="#" className="sidebar_nav"><FontAwesomeIcon icon={faReceipt} /> Invoice</Link></li>
            <li><Link to="#" className="sidebar_nav"><FontAwesomeIcon icon={faGear} /> Settings</Link></li>
            <li>
              <div className="theme_toggle_wrapper">
                <div className={`theme_toggle_btn ${isLightMode ? "light-mode-toggle" : "dark-mode-toggle"}`} onClick={() => setIsLightMode((prev) => !prev)}>
                  <div className="toggle-label">Light</div>
                  <div className="toggle-label">Dark</div>
                  <div className="toggle-slider"></div>
                </div>
              </div>
            </li>
          </ul>
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
   
    {/* ✅ Timer Component beside Search */}
    <div className="compact-timer">
          <div className="timer-item">
            <button className="timer-btn-small" onClick={handleWorkToggle}>
              <FaPlay />
            </button>
            <span className="timer-label-small">Work:</span>
            <span className="timer-box-small">{workTime}</span>
          </div>


          {/* Clock in between */}
          <div className="analog-clock">
            <div className="hand hour" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
            <div className="hand minute" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
            <div className="hand second" style={{ transform: `rotate(${secondDeg}deg)` }}></div>
            <div className="center-dot"></div>
          </div>



          <div className="timer-item">
            <button className="timer-btn-small" onClick={toggleBreak}>
              <FaPlay />
            </button>
            <span className="timer-label-small">Break:</span>
            <span className="timer-box-small">{breakTime}</span>
          </div>
        </div>

        <div className="navbar_icons">
        <div className="navbar_divider"></div>
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