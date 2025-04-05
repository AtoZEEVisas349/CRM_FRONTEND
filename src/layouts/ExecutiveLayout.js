// /layouts/ExecutiveLayout.js
import React from "react";
import SidebarandNavbar from "../layouts/SidebarandNavbar";
import ReportCard from "../features/executive/ReportCard";
import ExecutiveActivity from "../features/executive/ExecutiveActivity";
import LeadSectionGraph from "../features/executive/LeadSectionGraph";
import MapDisplay from "../features/executive/MapDisplay";
import NewsSection from "../features/executive/NewsSection";
import "../styles/executive.css";

const ExecutiveLayout = () => {
  return (
    <div className="executive-app-container">
      <SidebarandNavbar />
      <div className="executive-main-content">
        <div className="dashboard-container">
          {/* Top Section: Report Cards and Map */}
          <div className="top-section">
            <ReportCard />
            <MapDisplay />
          </div>
          
          {/* Middle Section: Analytics Graph and Executive Activity */}
          <div className="middle-section">
          <LeadSectionGraph />
          <ExecutiveActivity />
          </div>
          
          {/* Bottom Section: Lead Section Graph and News */}
          <div className="bottom-section">
            <NewsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveLayout;
