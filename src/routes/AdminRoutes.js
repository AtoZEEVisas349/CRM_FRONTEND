import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../pages/admin/Sidebar";
import Header from "../pages/admin/Header";
import Summary from "../pages/admin/Summary";
import DealFunnel from "../pages/admin/DealFunnel";
import OpportunityStage from "../pages/admin/OpportunityStage";
import RevenueChart from "../pages/admin/RevenueChart";
import ProfitChart from "../pages/admin/ProfitChart";
import Meetings from "../pages/admin/Meetings";
import AssignTask from "../pages/admin/AssignTask"; 
import "../styles/admin.css";
import AdminSidebar from "../components/AdminSidebar";

const AdminRoutes = () => {
  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Summary />
                <div className="charts">
                  <DealFunnel />
                  <OpportunityStage />
                </div>
                <RevenueChart />
                <div className="additional-section">
                  <ProfitChart />
                  <Meetings />
                </div>
              </>
            }
          />

          {/* Assign Task Page */}
          <Route path="/assign-task" element={<AssignTask />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminRoutes;