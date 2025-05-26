import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import BeepNotification from "../BeepNotification";
import ExecutiveActivity from "../features/executive/ExecutiveActivity";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../features/admin/ThemeContext";
import { useExecutiveActivity } from "../context/ExecutiveActivityContext";
import useWorkTimer from "../features/executive/useLoginTimer";
import { useBreakTimer } from "../context/breakTimerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars, faHouse, faUserPlus, faUsers, faList, faClock, faCircleXmark,
  faFile, faReceipt, faGear, faArrowLeft, faCircleQuestion, faBell,
  faRobot, faCircleUser, faRightFromBracket, faMugHot, faPersonWalking,
  faBed, faCouch, faUmbrellaBeach, faPeace, faBookOpen, faMusic,
  faHeadphones, faYinYang, faStopCircle
} from "@fortawesome/free-solid-svg-icons";
import { FaPlay,FaPause ,BeepNo} from "react-icons/fa";
// Break timer icons
const breakIcons = [
  faMugHot, faPersonWalking, faBed, faCouch,
  faUmbrellaBeach, faPeace, faBookOpen, faMusic, faHeadphones, faYinYang
];

const SidebarandNavbar = () => {
  const { breakTimer, startBreak, stopBreak, isBreakActive, resetBreakTimer } = useBreakTimer();
  const timer = useWorkTimer();
  const { user, logout } = useAuth();
  const {
    executiveInfo, executiveLoading, fetchExecutiveData,
    fetchNotifications, unreadCount, notifications,markNotificationReadAPI
  } = useApi();
  const { handleStopWork } = useExecutiveActivity();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(() => location.pathname.startsWith("/freshlead") || location.pathname.startsWith("/follow-up") || location.pathname.startsWith("/customer") || location.pathname.startsWith("/close-leads"));
  const [isActive, setIsActive] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showUserPopover, setShowUserPopover] = useState(false);

  const [workTime, setWorkTime] = useState("00:00");
  const [isWorkRunning, setIsWorkRunning] = useState(false);
  const [breakTime, setBreakTime] = useState("00:00");
  const [isBreakRunning, setIsBreakRunning] = useState(false);
  const workIntervalRef = useRef(null);
  const breakIntervalRef = useRef(null);

  const [hourDeg, setHourDeg] = useState(0);
  const [minuteDeg, setMinuteDeg] = useState(0);
  const [secondDeg, setSecondDeg] = useState(0);

  const popoverRef = useRef(null);
  const userIconRef = useRef(null);
  const historyStackRef = useRef([]);

  const toggleSidebar = () => setIsActive(prev => !prev);
  const toggle = async () => {
    if (!isBreakActive) {
      await startBreak();
    } else {
      await stopBreak();
      }
    };

  const handleLogout = async () => {
    try {
      await stopBreak();
      await logout();
      resetBreakTimer();
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleBack = () => {
    let stack = JSON.parse(sessionStorage.getItem("navStack")) || [];
    stack.pop();
    while (stack.length > 0) {
      const prev = stack.pop();
      if (prev !== "/login" && prev !== "/signup") {
        sessionStorage.setItem("navStack", JSON.stringify(stack));
        navigate(prev);
        return;
      }
    }
    navigate("/executive");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id && user?.role) {
      fetchNotifications({ userId: user.id, userRole: user.role });
    }
  }, [fetchNotifications]);
  
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setSecondDeg(now.getSeconds() * 6);
      setMinuteDeg(now.getMinutes() * 6 + now.getSeconds() * 0.1);
      setHourDeg((now.getHours() % 12) * 30 + now.getMinutes() * 0.5);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);


// BeepNotification handlers
const handleDismissBeepNotification = () => {
  // This function can be used to handle any additional logic when dismissing
  console.log('BeepNotification dismissed');
};
  useEffect(() => {
    const currentPath = location.pathname;
    if (!["/login", "/signup"].includes(currentPath)) {
      let stack = JSON.parse(sessionStorage.getItem("navStack")) || [];
      if (stack[stack.length - 1] !== currentPath) {
        stack.push(currentPath);
        sessionStorage.setItem("navStack", JSON.stringify(stack));
      }
      historyStackRef.current = stack;
    }
  }, [location]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    const unreadNotifications = notifications.filter(n => !n.is_read);
    unreadNotifications.forEach(notification => {
      markNotificationReadAPI(notification.id);
    });
  };
  return (
    <>
    <section className="sidebar_navbar" data-theme={theme}>
<section className={`sidebar_container ${isActive ? "active" : ""}`}>
<button className="menuToggle" onClick={toggleSidebar}><FontAwesomeIcon icon={faBars} /></button>
    <div className="sidebar_heading"><h1>AtoZeeVisas</h1></div>
    <div><h3 className="sidebar_crm">CRM</h3></div>
    <nav className="navbar_container">
    <ul>
        <li><Link to="/executive" className="sidebar_nav"><FontAwesomeIcon icon={faHouse} /> Dashboard</Link></li>
        <li  style={{ position: "relative" }}>
          <Link to="#" className="sidebar_nav" onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faUserPlus} /> Leads
            <span style={{ marginLeft: "auto", fontSize: "12px" }}>▼
            </span>
          </Link>
          {isOpen && (
          <ul className="submenu_nav">
            <li>
              <Link
                to="/freshlead"
                className="submenu_item"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faUsers} /> Fresh Leads
              </Link>
            </li>
            <li>
              <Link
                to="/follow-up"
                className="submenu_item"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faList} /> Follow ups
              </Link>
            </li>
            <li>
              <Link
                to="/customer"
                className="submenu_item"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faClock} /> Convert
              </Link>
            </li>
            <li>
              <Link
                to="/close-leads"
                className="submenu_item"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faCircleXmark} /> Close
              </Link>
            </li>
          </ul>
        )}
        </li>
        <li><Link to="/schedule" className="sidebar_nav"><FontAwesomeIcon icon={faFile} /> Scheduled Meetings</Link></li>
        <li><Link to="/invoice" className="sidebar_nav"><FontAwesomeIcon icon={faReceipt} /> Invoice</Link></li>
        <li><Link to="/settings" className="sidebar_nav"><FontAwesomeIcon icon={faGear} /> Settings</Link></li>
      </ul>
    </nav>
  </section>

  <section className="navbar">
    <div className="menu_search">
      <button className="menu_toggle" onClick={toggleSidebar}><FontAwesomeIcon icon={faBars} /></button>
      <div className="search_bar">
      <FontAwesomeIcon icon={faArrowLeft} onClick={handleBack} style={{fontSize:"20px",cursor:"pointer",
      }} />
    <input className="search-input-exec" placeholder="Search" />
    </div>
    </div>

    <div className="compact-timer">
      <div className="timer-item">
        <button className="timer-btn-small"><FaPause /></button>
        <span className="timer-label-small">Work:</span>
        <span className="timer-box-small">{timer}</span>
      </div>

      <div className="analog-clock">
      <div className="hand hour" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
      <div className="hand minute" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
<div className="hand second" style={{ transform: `rotate(${secondDeg}deg)` }}></div>

      <div className="center-dot"></div>
      </div>

      <div className="timer-item">
        <button className="timer-btn-small" onClick={toggle}>
        {isBreakActive ? <FaPause />: <FaPlay />}
        </button>
        <span className="timer-label-small">Break:</span>
        <span className="timer-box-small">{breakTimer}</span>
      </div>
        </div>

    <div className="navbar_icons">
      <div className="navbar_divider"></div>
      <div className="notification-wrapper">
  <FontAwesomeIcon
    className="navbar_icon"
    icon={faBell}
    style={{ cursor: "pointer" }}
    title="Notifications"
    tabIndex="0"
    onClick={() => navigate("/notification")}
  />
  {unreadCount > 0 && (
    <span className="notification-badge">{unreadCount}</span>
  )}
</div>

      <FontAwesomeIcon className="navbar_icon bot_icon" icon={faRobot} onClick={() => window.open("/chatbot", "_blank")} />
      <div onMouseEnter={() => setShowTracker(true)} onMouseLeave={() => setShowTracker(false)}>
      <FontAwesomeIcon 
        className="navbar_icon" icon={faClock} title="Toggle Activity Tracker" onClick={() => setShowTracker(prev => !prev)}  /> {showTracker &&<ExecutiveActivity /> }
      </div>
        
      <div
  className="user-icon-wrapper"
  ref={popoverRef}
  onMouseLeave={() => setShowUserPopover(false)}
>
  <FontAwesomeIcon
    ref={userIconRef}
    className="navbar_icon"
    icon={faCircleUser}
    onClick={() => setShowUserPopover((prev) => !prev)}
  />


  {showUserPopover && (
    <div className="user_popover">
      {executiveLoading ? (
        <p>Loading user details...</p>
      ) : (
        <>
          <div className="user_details">
            <div className="user_avatar">
              {executiveInfo.username?.charAt(0)}
            </div>
            <div>
              <p className="user_name">{executiveInfo.username}</p>
              <p className="user_role">{executiveInfo.role}</p>
            </div>
          </div>
          <button className="logout_btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: "8px" }} /> Logout
          </button>
        </>
      )}
    </div>
  )}
</div>


    </div>

  </section>

      {isBreakActive && (
        <div className="blur-screen">
          <div className="floating-icons">
            {breakIcons.map((icon, index) => (
              <FontAwesomeIcon key={index} icon={icon} className="floating-icon" />
            ))}
          </div>
          <div className="break-message">
            <FontAwesomeIcon icon={faMugHot} /> You are on a break
          </div>
          <div className="timer-display">{breakTimer}</div>
          <button className="stop-break-btn" onClick={stopBreak}>
            <FontAwesomeIcon icon={faStopCircle} /> Stop break
          </button>
        </div>
      )}
    </section>
    <BeepNotification
    notifications={notifications}
    unreadCount={unreadCount}
    onDismissPopup={handleDismissBeepNotification}
    onMarkAllRead={handleMarkAllAsRead}
  />
  </>
  );
};

export default SidebarandNavbar;
