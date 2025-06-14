import React from "react";
import AdminSidebar from "../layouts/AdminSidebar";
import "../styles/monitoring.css";
import AdminPanel from "../features/admin/Monitoring";

function MonitoringRoutes() {
  return (
    <div className="admi-container">
      {/* <div className="admi-sidebar">
        <AdminSidebar />
      </div> */}
      <div className="admi-content">
        <AdminPanel />
      </div>
    </div>
  );
}

export default MonitoringRoutes;