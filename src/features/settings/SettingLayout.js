import React from "react";
import { Link, Outlet } from "react-router-dom";

const SettingsLayout = () => {
  return (
    <div className="settings-layout">
      <aside className="settings-sidebar">
        <ul>
          <li><Link to="profile">My Profile</Link></li>
          <li><Link to="theme">Theme</Link></li>
          <li><Link to="change-password">Change Password</Link></li>
        </ul>
      </aside>
      <main className="settings-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;
