import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faMessage, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { fetchAdminProfile } from '../services/apiService'; // ✅ Make sure this is correct

function AdminNavbar() {
  const [showPopover, setShowPopover] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePopover = async () => {
    setShowPopover(!showPopover);

    if (!userData && !loading) {
      setLoading(true);
      try {
        const data = await fetchAdminProfile();

        // ✅ Map the backend response to the expected format
        if (data && data.username && data.email && data.role) {
          const mappedData = {
            name: data.username,
            email: data.email,
            role: data.role,
          };
          setUserData(mappedData);
        } else {
          console.warn("⚠️ Unexpected API response format:", data);
        }

      } catch (error) {
        console.error('🔴 Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
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
      <FontAwesomeIcon className="admin-logo_name" icon={faMessage} />
   
      <FontAwesomeIcon className="admin-logo_name" icon={faBell} />
    
    </div>
  );
}

export default AdminNavbar;
