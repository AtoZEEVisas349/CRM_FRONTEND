import React, { useState, useContext, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext"; // using logoutManager from here
import { useApi } from "../context/ApiContext";
import { ThemeContext } from "../features/admin/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaBell,
  FaUser,
  FaComment,
  FaSpinner,
  FaSignOutAlt
} from "react-icons/fa";

function ManagerNavbar() {
  const [showPopover, setShowPopover] = useState(false);
  const { handleLogoutManager } = useAuth(); // ✅ Use the manager-specific logout
  const { changeTheme, theme } = useContext(ThemeContext);
  const {
    getManagerProfile,
    adminProfile,
    loading,
    fetchAdmin,
    fetchNotifications,
    notifications,
    unreadCount,
    unreadMeetingsCount,
  } = useApi();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const localStorageUser = JSON.parse(localStorage.getItem("user"));
  const hoverTimeout = useRef(null);
  const isHovering = useRef(false);
  const badgeRef = useRef(null);

  useEffect(() => {
    if (
      localStorageUser?.id &&
      localStorageUser?.role &&
      notifications.length === 0
    ) {
      fetchNotifications({
        userId: localStorageUser.id,
        userRole: localStorageUser.role,
      });
    }
  }, []);

  useEffect(() => {
    if (unreadCount > 0 && badgeRef.current) {
      badgeRef.current.classList.add("bounce");
      const timer = setTimeout(() => {
        badgeRef.current.classList.remove("bounce");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleMouseEnter = async () => {
    clearTimeout(hoverTimeout.current);
    isHovering.current = true;
    setShowPopover(true);

    if (!managerProfile && !loading) {
      await fetchProfile();
    }
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    hoverTimeout.current = setTimeout(() => {
      if (!isHovering.current) {
        setShowPopover(false);
      }
    }, 200);
  };
  const[managerProfile,setManagerProfile]=useState()
 const fetchProfile = async () => {
      try {
        const profile = await getManagerProfile();
          console.log(profile,"p");
        setManagerProfile(profile);
      
      } catch (err) {
        // setError(err.response?.data?.error || "Failed to load profile");
      } 
    };
  useEffect(() => {


    fetchProfile();
    
  }, []);
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // Show spinner
      await handleLogoutManager(); // Custom logout logic
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false); // Hide spinner
    }
  };
  

  const isLight = theme === "light";
  const handleToggle = () => {
    changeTheme(isLight ? "dark" : "light");
  };

  return (
    <div className="admin-navbar">
      <div className="header-icons" style={{ position: "relative" }}>
        {/* Theme Toggle */}
        <button
          onClick={handleToggle}
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
          className="theme-toggle"
        >
          {isLight ? <FaMoon /> : <FaSun />}
        </button>

        <div className="admin-icons-group">
          <div className="icon-wrapper icon-comment">
            <FaComment size={20} />
          </div>

          <div
            className="icon-wrapper icon-bell"
            style={{ position: "relative" }}
            onClick={() => navigate("/manager/notification")}
          >
            <FaBell size={20} />
            {(unreadCount + unreadMeetingsCount) > 0 && (
              <span
                key={location.key}
                ref={badgeRef}
                className="admin-notification_badge bounce"
              >
                {unreadCount + unreadMeetingsCount}
              </span>
            )}
          </div>

          <div
            className="icon-wrapper icon-user"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <FaUser size={20} />
          </div>

          {showPopover && (
            <div
              className="admin_user_popover"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ position: "absolute", top: "100%", right: 0 }}
            >
              {loading ? (
                <div>Loading...</div>
              ) : (
                managerProfile && (
                  <div className="admin_user_details">
                    <div className="admin_user_avatar">
                      {managerProfile.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="admin_user_name">{managerProfile.name}</p>
                      <p className="admin_user_email">{managerProfile.email}</p>
                      <p className="admin_user_role">{managerProfile.role}</p>
                    </div>
                  </div>
                )
              )}
             <button className="logout_btn" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <>
                  <FaSpinner className="logout-spinner" />
                  <span className="logout-text">Logging out</span>
                </>
              ) : (
                <>
                  <FaSignOutAlt />
                  <span className="logout-text">Logout</span>
                </>
              )}
            </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerNavbar;