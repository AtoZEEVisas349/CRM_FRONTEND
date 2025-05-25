import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/process.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useProcess } from '../context/ProcessAuthContext';

const ProcessNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useProcess(); // ✅ Get `user` from context

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/process/client/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const dashboardTitle = user?.type === 'processperson' ? 'Process Dashboard' : 'Client Dashboard';

  return (
    <nav className="process-navbar">
      <h2 className="process-navbar-logo">{dashboardTitle}</h2>

      <ul
        className={isMobile ? "process-nav-links-mobile" : "process-nav-links"}
        onClick={() => setIsMobile(false)}
      >
        <li><Link to="/process/client/dashboard">Dashboard</Link></li>
        <li><Link to="/process/client/upload">Upload</Link></li>
         {/* ✅ Only show this link to processperson */}
          {user?.type === 'processperson' && (
            <li><Link to="/process/client/all-clients">Clients</Link></li>
          )}
          <li><Link to="/process/client/settings">Settings</Link></li>
        <li><button className="process-logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>

      <button
        className="process-mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}
      >
        {isMobile ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default ProcessNavbar;
