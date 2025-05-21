import React from "react";
import AdminSidebar from "../layouts/AdminSidebar";
import TaskManagement from "../features/LeadAssign/TaskManagement";
import "../styles/leadassign.css";

function LeadAssignRoutes() {
  return (
    <div className="lead-assign-container">
      <div className="lead-sidebar">
        <AdminSidebar />
      </div>
      <div className="f-lead-content">
        <TaskManagement />
      </div>
    </div>
  );
}

export default LeadAssignRoutes;
