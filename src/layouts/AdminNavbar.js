import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faMessage, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { fetchAdminProfile } from '../services/apiService';
import { useApi } from '../context/ApiContext'; 
// ✅ Import the context
import { useAuth } from '../context/AuthContext';

function AdminNavbar() {
 
  const { logout } = useAuth(); // ✅ Use the context
  const { adminProfile, loading, fetchAdmin } = useApi();
  const [showPopover, setShowPopover] = useState(false);

  const togglePopover = async () => {
    setShowPopover((prev) => !prev);
    if (!adminProfile && !loading) {
      await fetchAdmin(); // only call if needed
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // ✅ Use the context logout function
    } catch (error) {
      console.error('🔴 Logout failed:', error);
    }
  };

  return (
    <div className="admin-logo" style={{ position: 'relative' }}>
      <FontAwesomeIcon className="admin-logo_name" icon={faPhone} />
      <FontAwesomeIcon
        className="admin-logo_name"
        icon={faUser}
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
      <FontAwesomeIcon className="admin-logo_name" icon={faMessage} />
      <FontAwesomeIcon className="admin-logo_name" icon={faBell} />
    </div>
  );
}

export default AdminNavbar;
