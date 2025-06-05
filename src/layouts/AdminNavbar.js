import React, { useState, useContext, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../context/ApiContext";
import { ThemeContext } from "../features/admin/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaBell,
  FaUser,
  FaComment,
} from "react-icons/fa";

function AdminNavbar() {
  const [showPopover, setShowPopover] = useState(false);
  const { logout } = useAuth();
  const { changeTheme, theme } = useContext(ThemeContext);
  const {
    adminProfile,
    loading,
    fetchAdmin,
    fetchNotifications,
    notifications,
    unreadCount,
    unreadMeetingsCount
  } = useApi();

  const navigate = useNavigate();
  const location = useLocation(); // 👈 Route detection
  const localStorageUser = JSON.parse(localStorage.getItem("user"));
  const hoverTimeout = useRef(null);
  const isHovering = useRef(false);
  const badgeRef = useRef(null);

  // 🔄 Fetch notifications on mount
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
  }, []); // Only on mount

  // 🎯 Bounce animation on every route change
  useEffect(() => {
    if (unreadCount > 0 && badgeRef.current) {
      badgeRef.current.classList.add("bounce");
      const timer = setTimeout(() => {
        badgeRef.current.classList.remove("bounce");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]); // 👈 triggers on route change

  const handleMouseEnter = async () => {
    clearTimeout(hoverTimeout.current);
    isHovering.current = true;
    setShowPopover(true);

    if (!adminProfile && !loading) {
      await fetchAdmin();
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
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

        {/* Icon Group */}
        <div className="admin-icons-group">
          <FaComment className="admin-logo_name icon-hover-zoom" />

          {/* Notification Icon */}
          <div
            className="admin-notification_wrapper"
            style={{ position: "relative" }}
          >
            <FaBell
              className="admin-logo_name icon-hover-zoom bell-align"
              title="Notifications"
              tabIndex="0"
              onClick={() => navigate("/admin/notification")}
            />
{(unreadCount + unreadMeetingsCount) > 0 && (
  <span ref={badgeRef} className="admin-notification_badge">
    {unreadCount + unreadMeetingsCount}
  </span>
)}


          </div>

          {/* User Popover */}
          <div
            className="user-icon-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ position: "relative", display: "inline-block" }}
          >
            <FaUser
              className="admin-logo_name icon-hover-zoom"
              style={{ cursor: "pointer" }}
            />

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
                  adminProfile && (
                    <div className="admin_user_details">
                      <div className="admin_user_avatar">
                        {adminProfile.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="admin_user_name">{adminProfile.name}</p>
                        <p className="admin_user_email">{adminProfile.email}</p>
                        <p className="admin_user_role">{adminProfile.role}</p>
                      </div>
                    </div>
                  )
                )}
                <button className="logout_btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
