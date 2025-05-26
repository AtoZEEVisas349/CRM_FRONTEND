import React, { useState, useEffect } from 'react';
import SidebarandNavbar from '../layouts/SidebarandNavbar';
import SettingsLayout from '../features/settings/SettingLayout';
import "../styles/setting.css";

const SettingRoutes = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`settings-page-container ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* Navigation Bar */}
      <div className="settings-navbar">
        <SidebarandNavbar />
      </div>

      {/* Main Content Area */}
      <div className="settings-main-content">
        {/* Mobile Header with Menu Toggle */}
        {isMobile && (
          <div className="settings-mobile-header">
            <button 
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              aria-label="Toggle Settings Menu"
            >
              <span className={`hamburger ${sidebarCollapsed ? '' : 'active'}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            <h1 className="settings-page-title">Settings</h1>
          </div>
        )}

        {/* Settings Content with Sidebar State */}
        <div className={`settings-content-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          <SettingsLayout 
            isMobile={isMobile}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={toggleSidebar}
          />
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="mobile-backdrop"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default SettingRoutes;
