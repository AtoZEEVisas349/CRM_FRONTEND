import React, { useEffect } from 'react';
import ReportCard from "../features/executive/ReportCard";
import SidebarandNavbar from "../layouts/SidebarandNavbar";
import "../styles/executive.css";
import NewsComponent from '../features/executive/NewsComponent';
import { recordStartWork, recordStopWork } from "../services/executiveService"; // ✅ Import stopWork also

const ExecutiveLayout = () => {
  useEffect(() => {
    const startWork = async () => {
      console.log("📌 Initiating work start API call...");
      try {
        const response = await recordStartWork();
        console.log("✅ Work start response:", response);
  
        if (response.startWorkTime) {
          console.log("🕒 Saving work start time to localStorage:", response.startWorkTime);
          localStorage.setItem('workStartTime', new Date(response.startWorkTime).getTime());
        }
      } catch (error) {
        console.error("❌ Error recording start work:", error);
      }
    };
  
    startWork();
  
    const handleBeforeUnload = async () => {
      console.log("📌 Initiating work stop API call on unload...");
      try {
        await recordStopWork();
        console.log("✅ Work stop recorded successfully");
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
