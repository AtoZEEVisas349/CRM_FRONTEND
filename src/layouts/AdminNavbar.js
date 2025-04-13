import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext'; // ✅ Using Context API
import { ThemeContext } from '../features/admin/ThemeContext';

import {
  FaFilter, FaCalendarAlt, FaChevronDown, FaBars,
  FaSun, FaMoon, FaPhone, FaUser, FaComment, FaBell
} from "react-icons/fa";

function AdminNavbar() {
  const [showPopover, setShowPopover] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout } = useAuth();
  const { adminProfile, loading, fetchAdmin } = useApi(); // ✅ Using context API

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

  return (
    <div className="header-icons" style={{ position: 'relative' }}>
      {/* Theme Toggle */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      {/* Other Icons */}
      <FaPhone className="admin-logo_name icon-hover-zoom" />
      <FaUser
        className="admin-logo_name icon-hover-zoom"
        onClick={togglePopover}
        style={{ cursor: 'pointer' }}
      />

      {/* User Popover */}
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

      <FaComment className="admin-logo_name icon-hover-zoom" />
      <FaBell className="admin-logo_name icon-hover-zoom" />
    </div>
  );
}

export default AdminNavbar;
