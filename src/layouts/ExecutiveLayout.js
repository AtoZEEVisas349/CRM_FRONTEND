import React, { useEffect } from 'react';
import ReportCard from "../features/executive/ReportCard";
import SidebarandNavbar from "../layouts/SidebarandNavbar";
import "../styles/executive.css";
import NewsComponent from '../features/executive/NewsComponent';
import { recordStartWork, recordStopWork } from "../services/executiveService"; // ✅ Import stopWork also

const ExecutiveLayout = () => {  
  return (
    <div className="executive-app-container">
      <SidebarandNavbar />
      <div className="executive-main-content">
        <div className="dashboard-container">
          <div className="dashboard-main-content">
            <ReportCard />
            <NewsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveLayout;
