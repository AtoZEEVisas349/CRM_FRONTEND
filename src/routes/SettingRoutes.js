// --- SettingRoutes.js ---
import React from 'react';
import SidebarandNavbar from '../layouts/SidebarandNavbar';
import SettingsLayout from '../features/settings/SettingLayout';
import "../styles/setting.css";

const SettingRoutes = () => {
  return (
    <div className="settings-page-wrapper">
      <SidebarandNavbar />
      <SettingsLayout />  
    </div>
  );
};

export default SettingRoutes;
