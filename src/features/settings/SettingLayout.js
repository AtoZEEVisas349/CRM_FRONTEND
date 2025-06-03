import React, { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ThemeContext } from "../admin/ThemeContext";

const SettingsLayout = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const settingsMenuItems = [
    { path: "profile", label: "My Profile", icon: "👤" },
    { path: "theme", label: "Theme", icon: "🎨" },
    { path: "change-password", label: "Change Password", icon: "🔒" },
    { path: "change-beep", label: "Change in Beep", icon: "🔔" },
  ];

  const styles = {
    settingsLayout: {
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: '24px',
      minHeight: '100vh',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    settingsSidebar: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '0',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      height: 'fit-content',
      position: 'sticky',
      top: '100px',
    },
    sidebarTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    menuList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    menuItem: {
      marginBottom: '8px',
    },
    menuLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 20px',
      textDecoration: 'none',
      color: '#4a5568',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      fontSize: '16px',
      fontWeight: '500',
      border: '1px solid transparent',
    },
    menuLinkActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      transform: 'translateY(-2px)',
    },
    menuLinkHover: {
      background: 'rgba(102, 126, 234, 0.1)',
      color: '#667eea',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      transform: 'translateX(4px)',
    },
    menuIcon: {
      marginRight: '0',
      fontSize: '18px',
    },
    settingsContent: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      minHeight: '600px',
    },
    // Responsive styles
    '@media (max-width: 1024px)': {
      settingsLayout: {
        gridTemplateColumns: '250px 1fr',
        gap: '20px',
      },
    },
    '@media (max-width: 768px)': {
      settingsLayout: {
        gridTemplateColumns: '1fr',
        gap: '16px',
      },
      settingsSidebar: {
        position: 'static',
        marginBottom: '20px',
      },
    },
  };

  const isActivePath = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <>
      <style>
        {`
          .settings-layout {
            display: grid;
            grid-template-columns: 340px 1fr;
            min-height: 100vh;
            max-width: 2000px;
            margin: 0 auto;
          }
          
          .settings-sidebar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: sticky;
          }
          
          .sidebar-title {
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .menu-item {
            margin-bottom: 8px;
          }
          
          .menu-link {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            text-decoration: none;
            color: #4a5568;
            border-radius: 12px;
            transition: all 0.3s ease;
            font-size: 19px !important;
            font-weight: 500;
            border: 1px solid transparent;
          }
          
          .menu-link:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            border: 1px solid rgba(102, 126, 234, 0.2);
            transform: translateX(4px);
          }
          
          .menu-link.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            transform: translateY(-2px);
          }
          
          .menu-icon {
            margin-right: 12px;
            font-size: 25px;
          }
          
          .settings-content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            min-height: 400px;
            overflow-x:hidden;
          }
          
          @media (max-width: 1024px) {
            .settings-layout {
              grid-template-columns: 250px 1fr;
              gap: 20px;
            }
            
            .settings-sidebar {
              padding: 20px;
            }
            
            .settings-content {
              padding: 24px;
            }
          }
          
          @media (max-width: 768px) {
            .settings-layout {
              grid-template-columns: 1fr;
              gap: 16px;
              padding: 0 16px;
            }
            
            .settings-sidebar {
              position: static;
              margin-bottom: 20px;
              padding: 16px;
            }
            
            .menu-link {
              padding: 12px 16px;
              font-size: 15px;
            }
            
            .settings-content {
              padding: 20px;
            }
          }
          
          @media (max-width: 480px) {
            .settings-layout {
              padding: 0 12px;
            }
            
            .settings-sidebar {
              padding: 12px;
            }
            
            .settings-content {
              padding: 16px;
            }
            
            .menu-link {
              padding: 10px 12px;
              font-size: 14px;
            }
          }
        `}
      </style>
      <div className="settings-layout" data-theme={theme}>
        <aside className="settings-sidebar">
          <h3 className="sidebar-title">Settings</h3>
          <ul className="menu-list">
            {settingsMenuItems.map((item) => (
              <li key={item.path} className="menu-item">
                <Link 
                  to={item.path} 
                  className={`menu-link ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <main className="settings-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default SettingsLayout;