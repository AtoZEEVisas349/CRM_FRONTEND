import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import BeepNotification from "../BeepNotification";
import ExecutiveActivity from "../features/executive/ExecutiveActivity";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../features/admin/ThemeContext";
import useWorkTimer from "../features/executive/useLoginTimer";
import { useBreakTimer } from "../context/breakTimerContext";
import { SearchContext } from "../context/SearchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faUserPlus,
  faUsers,
  faList,
  faClock,
  faCircleXmark,
  faFile,
  faReceipt,
  faGear,
  faArrowLeft,
  faBell,
  faRobot,
  faCircleUser,
  faRightFromBracket,
  faMugHot,
  faPersonWalking,
  faBed,
  faCouch,
  faUmbrellaBeach,
  faPeace,
  faBookOpen,
  faMusic,
  faHeadphones,
  faYinYang,
  faStopCircle,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FaPlay, FaPause } from "react-icons/fa";

// Break timer icons
const breakIcons = [
  faMugHot,
  faPersonWalking,
  faBed,
  faCouch,
  faUmbrellaBeach,
  faPeace,
  faBookOpen,
  faMusic,
  faHeadphones,
  faYinYang,
];

const SidebarandNavbar = () => {
  const { breakTimer, startBreak, stopBreak, isBreakActive, resetBreakTimer } =
    useBreakTimer();
  const timer = useWorkTimer();
  const chatbotRef = useRef(null);
  const chatbotHeaderRef = useRef(null);

  const { logout } = useAuth();
  const {
    executiveInfo,
    executiveLoading,
    fetchNotifications,
    unreadCount,
    notifications,
    markNotificationReadAPI,
  } = useApi();
  const { theme } = useContext(ThemeContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setSearchQuery } = useContext(SearchContext);
  const [isOpen, setIsOpen] = useState(
    () =>
      location.pathname.startsWith("/freshlead") ||
      location.pathname.startsWith("/follow-up") ||
      location.pathname.startsWith("/customer") ||
      location.pathname.startsWith("/close-leads")
  );
  const [isActive, setIsActive] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showUserPopover, setShowUserPopover] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [hourDeg, setHourDeg] = useState(0);
  const [minuteDeg, setMinuteDeg] = useState(0);
  const [secondDeg, setSecondDeg] = useState(0);

  // BUG: Random title changing state
  const [appTitle, setAppTitle] = useState("AtoZeeVisas");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search");
  const [breakMessage, setBreakMessage] = useState("You are on a break");
  const [loginButtonText, setLoginButtonText] = useState("Logout");

  const popoverRef = useRef(null);
  const userIconRef = useRef(null);
  const historyStackRef = useRef([]);

  const toggleSidebar = () => setIsActive((prev) => !prev);
  const toggle = async () => {
    if (!isBreakActive) {
      await startBreak();
    } else {
      await stopBreak();
    }
  };

  // BUG: Title changes randomly every 3 seconds
  useEffect(() => {
    const titleVariations = [
      "Salary dede AtoZeeVisas",
      "Fraud AtoZeeVisas", 
      "Atu jhatu zee Visa$", 
      "gandu ViSaS",
      "Gobar A2ZeeVisas",
      "ChorAtoZeeVis@s",
      "Fuddu AtoZeeVisaz",
      "$a$"
    ];
    
    let titleIndex = 0;
    const titleInterval = setInterval(() => {
      titleIndex = (titleIndex + 1) % titleVariations.length;
      setAppTitle(titleVariations[titleIndex]);
    }, 3000);

    return () => clearInterval(titleInterval);
  }, []);

  // BUG: Search placeholder keeps changing
  useEffect(() => {
    const placeholders = [
      "Dhundo bc",
      "Serach",
      "Search...",
      "ha lele",
      "Find something",
      "Looking for?",
      "Search here plz",
      "chamm chum"
    ];
    
    const placeholderInterval = setInterval(() => {
      const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
      setSearchPlaceholder(randomPlaceholder);
    }, 2000);

    return () => clearInterval(placeholderInterval);
  }, []);

  // BUG: Break message changes randomly
  useEffect(() => {
    if (isBreakActive) {
      const messages = [
        "You are on a break",
        "chai piyo biscuit khao",
        "mkc company ki",
        "Taking a brake",
        "lunch pe chla ab me!",
        "Rest mode activated",
        "Chill time",
        "khane chla: ON"
      ];
      
      const messageInterval = setInterval(() => {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setBreakMessage(randomMessage);
      }, 1500);

      return () => clearInterval(messageInterval);
    }
  }, [isBreakActive]);

  // BUG: Logout button text keeps changing
  useEffect(() => {
    const buttonTexts = [
      "Logout",
      "nikal laude",
    ];
    
    const buttonInterval = setInterval(() => {
      if (!isLoggingOut) {
        const randomText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
        setLoginButtonText(randomText);
      }
    }, 2500);

    return () => clearInterval(buttonInterval);
  }, [isLoggingOut]);

  // New function to handle chatbot toggle
  const handleChatbotToggle = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }
    setShowChatbot((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
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
    if (!showChatbot || !chatbotRef.current || !chatbotHeaderRef.current)
      return;

    const popup = chatbotRef.current;
    const header = chatbotHeaderRef.current;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      const rect = popup.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      popup.style.position = "absolute";
      popup.style.zIndex = 10000;
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        popup.style.left = `${e.clientX - offsetX}px`;
        popup.style.top = `${e.clientY - offsetY}px`;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    header.style.cursor = "move";
    header.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      header.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [showChatbot]);

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
    console.log("BeepNotification dismissed");
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
    const unreadNotifications = notifications.filter((n) => !n.is_read);
    unreadNotifications.forEach((notification) => {
      markNotificationReadAPI(notification.id);
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user popover if clicked outside
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setShowUserPopover(false);
      }

      // Close tracker if clicked outside
      const trackerButton = document.querySelector(".fa-clock");
      const trackerWrapper = document.querySelector(
        ".activity-tracker-wrapper"
      );
      if (
        trackerWrapper &&
        !trackerWrapper.contains(event.target) &&
        trackerButton &&
        !trackerButton.contains(event.target)
      ) {
        setShowTracker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // BUG: Random text glitching for nav items
  const getGlitchedText = (originalText) => {
    if (Math.random() < 0.1) { // 10% chance of glitch
      const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      return originalText.split('').map(char => 
        Math.random() < 0.3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
      ).join('');
    }
    return originalText;
  };

  return (
    <>
      <section className="sidebar_navbar" data-theme={theme}>
        <section className={`sidebar_container ${isActive ? "active" : ""}`}>
          <button className="menuToggle" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="sidebar_heading">
            {/* BUG: Title changes every 3 seconds */}
            <h1 style={{ 
              transition: 'color 0.3s ease',
              color: appTitle.includes('Raudy') ? '#ff6b6b' : 
                     appTitle.includes('$') ? '#4ecdc4' : 
                     appTitle.includes('@') ? '#45b7d1' : 'inherit'
            }}>
              {appTitle}
            </h1>
          </div>
          <div>
            <h3 className="sidebar_crm">{getGlitchedText("CRM")}</h3>
          </div>
          <nav className="navbar_container">
            <ul>
              <li>
                <Link to="/executive" className="sidebar_nav">
                  <FontAwesomeIcon icon={faHouse} /> {getGlitchedText("Dashboard")}
                </Link>
              </li>
              <li style={{ position: "relative" }}>
                <Link
                  to="#"
                  className="sidebar_nav"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <FontAwesomeIcon icon={faUserPlus} /> {getGlitchedText("Leads")}
                  <span style={{ marginLeft: "auto", fontSize: "12px" }}>
                    ▼
                  </span>
                </Link>
                {isOpen && (
                  <ul className="submenu_nav">
                    <li>
                      <Link
                        to="/executive/freshlead"
                        className="submenu_item"
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUsers} /> {getGlitchedText("Fresh Leads")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/executive/follow-up"
                        className="submenu_item"
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={faList} /> {getGlitchedText("Follow ups")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/executive/customer"
                        className="submenu_item"
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={faClock} /> {getGlitchedText("Convert")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/executive/close-leads"
                        className="submenu_item"
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={faCircleXmark} /> {getGlitchedText("Close")}
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/executive/schedule" className="sidebar_nav">
                  <FontAwesomeIcon icon={faFile} /> {getGlitchedText("Scheduled Meetings")}
                </Link>
              </li>
              <li>
                <Link to="/executive/invoice" className="sidebar_nav">
                  <FontAwesomeIcon icon={faReceipt} /> {getGlitchedText("Invoice")}
                </Link>
              </li>
              <li>
                <Link to="/executive/settings" className="sidebar_nav">
                  <FontAwesomeIcon icon={faGear} /> {getGlitchedText("Settings")}
                </Link>
              </li>
            </ul>
          </nav>
        </section>

        <section className="navbar">
          <div className="menu_search">
            <button className="menu_toggle" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <div className="search_bar">
              <FontAwesomeIcon
                icon={faArrowLeft}
                onClick={handleBack}
                style={{ fontSize: "20px", cursor: "pointer" }}
              />
              {/* BUG: Search placeholder keeps changing */}
              <input
                className="search-input-exec"
                placeholder={searchPlaceholder}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  transition: 'all 0.3s ease',
                  transform: searchPlaceholder.includes('plz') ? 'rotate(1deg)' : 'rotate(0deg)'
                }}
              />
            </div>
          </div>

          <div className="compact-timer">
            <div className="timer-item">
              <button className="timer-btn-small">
                <FaPause />
              </button>
              <span className="timer-label-small">{getGlitchedText("Work")}:</span>
              <span className="timer-box-small">{timer}</span>
            </div>

            <div className="analog-clock" style={{
              // BUG: Clock occasionally spins randomly
              transform: Math.random() < 0.05 ? `rotate(${Math.random() * 360}deg)` : 'rotate(0deg)',
              transition: 'transform 0.5s ease'
            }}>
              <div
                className="hand hour"
                style={{ transform: `rotate(${hourDeg}deg)` }}
              ></div>
              <div
                className="hand minute"
                style={{ transform: `rotate(${minuteDeg}deg)` }}
              ></div>
              <div
                className="hand second"
                style={{ transform: `rotate(${secondDeg}deg)` }}
              ></div>
              <div className="center-dot"></div>
            </div>

            <div className="timer-item">
              <button className="timer-btn-small" onClick={toggle}>
                {isBreakActive ? <FaPause /> : <FaPlay />}
              </button>
              <span className="timer-label-small">{getGlitchedText("Break")}:</span>
              <span className="timer-box-small">{breakTimer}</span>
            </div>
          </div>

          <div className="navbar_icons">
            <div className="navbar_divider"></div>
            <div className="notification-wrapper">
              <FontAwesomeIcon
                className="navbar_icon"
                icon={faBell}
                style={{ 
                  cursor: "pointer",
                  // BUG: Bell icon randomly shakes
                  animation: Math.random() < 0.1 ? 'shake 0.5s ease-in-out infinite' : 'none'
                }}
                title={getGlitchedText("Notifications")}
                tabIndex="0"
                onClick={() => navigate("/executive/notification")}
              />
              {unreadCount > 0 && (
                <span className="notification-badge" style={{
                  // BUG: Notification badge randomly changes color
                  backgroundColor: ['red', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 5)]
                }}>{unreadCount}</span>
              )}
            </div>

            <FontAwesomeIcon
              className="navbar_icon bot_icon"
              icon={faRobot}
              onClick={handleChatbotToggle}
              title={getGlitchedText("Open ChatBot")}
              style={{ 
                cursor: "pointer",
                // BUG: Bot icon randomly rotates
                transform: Math.random() < 0.08 ? `rotate(${Math.random() * 360}deg)` : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
            <FontAwesomeIcon
              className="navbar_icon"
              icon={faClock}
              title={getGlitchedText("Toggle Activity Tracker")}
              onClick={() => setShowTracker((prev) => !prev)}
              style={{ cursor: "pointer" }}
            />

            {showTracker && (
              <div className="activity-tracker-wrapper">
                <ExecutiveActivity />
              </div>
            )}

            <div className="user-icon-wrapper" ref={popoverRef}>
              <FontAwesomeIcon
                ref={userIconRef}
                className="navbar_icon"
                icon={faCircleUser}
                onClick={() => setShowUserPopover((prev) => !prev)}
                style={{
                  // BUG: User icon occasionally bounces
                  animation: Math.random() < 0.07 ? 'bounce 1s ease-in-out infinite' : 'none'
                }}
              />

              {showUserPopover && (
                <div className="user_popover">
                  {executiveLoading ? (
                    <p>{getGlitchedText("Loading user details...")}</p>
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
                      <button
                        className="logout_btns"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        aria-label={
                          isLoggingOut ? "Logging out, please wait" : loginButtonText
                        }
                        style={{
                          // BUG: Logout button color changes randomly
                          backgroundColor: Math.random() < 0.1 ? '#ff6b6b' : 'inherit'
                        }}
                      >
                        <FontAwesomeIcon
                          icon={isLoggingOut ? faSpinner : faRightFromBracket}
                          className={isLoggingOut ? "logout-spinner" : ""}
                        />
                        <span className="logout-text">
                          {isLoggingOut ? getGlitchedText("Logging out") : loginButtonText}
                        </span>
                        {isLoggingOut && <span className="loading-dots"></span>}
                        {isLoggingOut && (
                          <span className="sr-only">
                            Please wait while we log you out
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Break timer overlay */}
        {isBreakActive && (
          <div className="blur-screen">
            <div className="floating-icons">
              {breakIcons.map((icon, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={icon}
                  className="floating-icon"
                  style={{
                    // BUG: Break icons randomly change size
                    fontSize: Math.random() < 0.2 ? `${Math.random() * 2 + 0.5}em` : '1em'
                  }}
                />
              ))}
            </div>
            <div className="break-message" style={{
              // BUG: Break message color changes
              color: ['#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 5)]
            }}>
              <FontAwesomeIcon icon={faMugHot} /> {breakMessage}
            </div>
            <div className="timer-display">{breakTimer}</div>
            <button className="stop-break-btn" onClick={stopBreak}>
              <FontAwesomeIcon icon={faStopCircle} /> {getGlitchedText("Stop break")}
            </button>
          </div>
        )}

        {/* Chatbot Popup Overlay */}
        {showChatbot && (
          <div
            className="chatbot-popup-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowChatbot(false);
              }
            }}
          >
            <div className="chatbot-popup-container" ref={chatbotRef} style={{
              // BUG: Chatbot popup randomly tilts
              transform: Math.random() < 0.15 ? `rotate(${Math.random() * 10 - 5}deg)` : 'rotate(0deg)'
            }}>
              <div className="chatbot-popup-header" ref={chatbotHeaderRef}>
                <h3>{getGlitchedText("ChatBot Assistant")}</h3>
                <button
                  className="chatbot-close-btn"
                  onClick={() => setShowChatbot(false)}
                  aria-label="Close chatbot"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div
                className="chatbot-popup-content"
                style={{ height: "500px" }}
              >
                <iframe
                  src={process.env.REACT_APP_BOTPRESS_URL}
                  title="Botpress Chatbot"
                  width="100%"
                  height="100%"
                  allow="microphone; camera"
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <BeepNotification
        notifications={notifications}
        unreadCount={unreadCount}
        onDismissPopup={handleDismissBeepNotification}
        onMarkAllRead={handleMarkAllAsRead}
      />

      {/* Add CSS animations for the bugs */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
};

export default SidebarandNavbar;