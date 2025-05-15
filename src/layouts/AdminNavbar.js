import React, { useState, useContext,useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext'; // ✅ Using Context API
import { ThemeContext } from '../features/admin/ThemeContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import {
  FaFilter, FaCalendarAlt, FaChevronDown, FaBars,
  FaSun, FaMoon, FaPhone, FaUser, FaComment, FaBell
} from "react-icons/fa";

function AdminNavbar() {
  const [showPopover, setShowPopover] = useState(false);
  const { logout } = useAuth();
  const { changeTheme,theme } = useContext(ThemeContext); 
  const { adminProfile, loading, fetchAdmin,notifications } = useApi(); // ✅ Using context API
  const navigate = useNavigate();
  const [unreadLeadCount, setUnreadLeadCount] = useState(0);
  const localStorageUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!notifications || notifications.length === 0) {
      console.log("No notifications available.");
      return;
    }

    const filterUnreadLeads = () => {
      const unreadLeads = notifications.filter(
        (n) =>
          n.message.includes("You have been assigned a new lead") &&
          !n.is_read &&
          n.userId === localStorageUser?.id
      );
      setUnreadLeadCount(unreadLeads.length);
    };

    filterUnreadLeads();
  }, [notifications, localStorageUser]);
  const togglePopover = async () => {
    setShowPopover(prev => !prev);
    if (!adminProfile && !loading) {
      await fetchAdmin(); // ✅ Call fetch only if needed
    }
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
    <div className="notification_wrapper">
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
    {/* User Icon and Popover Wrapper */}
    <div className="user-icon-wrapper">
      <FaUser
        className="admin-logo_name icon-hover-zoom"
        onClick={togglePopover}
        style={{ cursor: 'pointer' }}
      />
      {showPopover && (
        <div className="admin_user_popover">
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

export default AdminNavbar;