import React, { useState, useContext } from 'react';
import { fetchAdminProfile } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../features/admin/ThemeContext';
import {
  FaFilter, FaCalendarAlt, FaChevronDown, FaBars,
  FaSun, FaMoon, FaPhone, FaUser, FaComment, FaBell
} from "react-icons/fa";

function AdminNavbar() {
  const [showPopover, setShowPopover] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout } = useAuth();

  const togglePopover = async () => {
    setShowPopover(!showPopover);

    if (!userData && !loading) {
      setLoading(true);
      try {
        const data = await fetchAdminProfile();
        if (data && data.username && data.email && data.role) {
          const mappedData = {
            name: data.username,
            email: data.email,
            role: data.role,
          };
          setUserData(mappedData);
        } else {
          console.warn("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
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
<div className="header-icons">
  <button
    className="theme-toggle"
    onClick={toggleTheme}
    aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
  >
    {theme === 'light' ? <FaMoon /> : <FaSun />}
  </button>

  <FaPhone className="admin-logo_name icon-hover-zoom" />

 <FaUser className="admin-logo_name icon-hover-zoom" onClick={togglePopover} style={{ cursor: 'pointer' }} />


  {showPopover && (
    <div className="admin_user_popover">
      {loading ? (
        <div>Loading...</div>
      ) : (
        userData && (
          <div className="admin_user_details">
            <div className="admin_user_avatar">
              {userData.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="admin_user_name">{userData.name}</p>
              <p className="admin_user_email">{userData.email}</p>
              <p className="admin_user_role">{userData.role}</p>
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
