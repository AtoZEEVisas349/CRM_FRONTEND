import React, { useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';
import { ThemeContext } from '../features/admin/ThemeContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import {
  FaFilter, FaCalendarAlt, FaChevronDown, FaBars,
  FaSun, FaMoon, FaPhone, FaUser, FaComment
} from "react-icons/fa";

function AdminNavbar() {
  const [showPopover, setShowPopover] = useState(false);
  const { logout } = useAuth();
  const { changeTheme, theme } = useContext(ThemeContext);
  const { adminProfile, loading, fetchAdmin, notifications } = useApi();
  const navigate = useNavigate();
  const [unreadLeadCount, setUnreadLeadCount] = useState(0);
  const localStorageUser = JSON.parse(localStorage.getItem("user"));

  const hoverTimeout = useRef(null);

  // Filter unread lead notifications
  useEffect(() => {
    if (!notifications || notifications.length === 0) {
      setUnreadLeadCount(0);
      return;
    }

    const unreadLeads = notifications.filter(
      (n) =>
        n.message.includes("You have been assigned a new lead") &&
        !n.is_read &&
        n.userId === localStorageUser?.id
    );
    setUnreadLeadCount(unreadLeads.length);
  }, [notifications, localStorageUser]);

  const handleMouseEnter = async () => {
    clearTimeout(hoverTimeout.current);
    setShowPopover(true);
    if (!adminProfile && !loading) {
      await fetchAdmin();
    }
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowPopover(false);
    }, 200); // delay to allow hover on popover
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isLight = theme === "light";
  const handleToggle = () => {
    changeTheme(isLight ? "dark" : "light");
  };

  return (
    <div className="header-icons" style={{ position: 'relative' }}>
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
        <div className="notification_wrapper" style={{ position: 'relative' }}>
          <FontAwesomeIcon
            className="navbar_icon"
            icon={faBell}
            title="Notifications"
            tabIndex="0"
            onClick={() => navigate("/admin/notification")}
          />
          {unreadLeadCount > 0 && (
            <span className="notification_badge">{unreadLeadCount}</span>
          )}
        </div>

        {/* User Icon and Hover Popover */}
        <div
          className="user-icon-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ position: "relative", display: "inline-block" }}
        >
          <FaUser
            className="admin-logo_name icon-hover-zoom"
            style={{ cursor: 'pointer' }}
          />
          {showPopover && (
            <div
              className="admin_user_popover"
              onMouseEnter={() => clearTimeout(hoverTimeout.current)}
              onMouseLeave={handleMouseLeave}
              style={{ position: "absolute", top: "100%", right: 0 }}
            >
              {loading ? (
                <div>Loading...</div>
              ) : (
                adminProfile && (
                  <div className="admin_user_details">
                    <div className="admin_user_avatar">
                      {adminProfile.name?.charAt(0).toUpperCase() || 'U'}
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
  );
}

export default AdminNavbar;
