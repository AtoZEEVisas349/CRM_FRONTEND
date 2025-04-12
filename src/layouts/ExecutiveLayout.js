import React, { useEffect } from 'react';
import ReportCard from "../features/executive/ReportCard";
import SidebarandNavbar from "../layouts/SidebarandNavbar";
import "../styles/executive.css";
import NewsComponent from '../features/executive/NewsComponent';
import { recordStartWork, recordStopWork } from "../services/executiveService"; // ✅ Import stopWork also

const ExecutiveLayout = () => {
  useEffect(() => {
    const startWork = async () => {
      try {
        const response = await recordStartWork();
  
        if (response.startWorkTime) {
          localStorage.setItem('workStartTime', new Date(response.startWorkTime).getTime());
        }
      } catch (error) {
        console.error("❌ Error recording start work:", error);
      }
    };
  
    startWork();
  
    const handleBeforeUnload = async () => {
      try {
        await recordStopWork();
      } catch (error) {
        console.error("❌ Error recording stop work:", error);
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  

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
