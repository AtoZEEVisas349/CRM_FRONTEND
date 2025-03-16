import React from 'react';
import ReportCards from "../pages/executive/ReportCards";
import NewsSection from "../pages/executive/NewsSection";
import SidebarandNavbar from "../components/SidebarandNavbar";
import "../styles/executive.css";

const ExecutiveRoutes = () => {
  return (
    <div className="executive-app-container">
      <SidebarandNavbar />
      <div className="executive-main-content">
        <div className="dashboard-container">
          <div className="dashboard-main-content">
            <ReportCards />
            <NewsSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveRoutes;
