import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarandNavbar from "../layouts/SidebarandNavbar";
import "../styles/executive.css";

const ExecutiveLayout = () => {  
  return (
    <div className="executive-app-container">
      <SidebarandNavbar />
      <div className="executive-main-content">
        <div className="dashboard-container">
          <div className="dashboard-main-content">
            <Outlet /> {/* 👈 This is now where ReportCard + NewsComponent will render */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveLayout;
