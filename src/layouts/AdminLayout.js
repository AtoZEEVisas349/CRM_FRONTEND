import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../features/admin/Header";
import Summary from "../features/admin/Summary";
import DealFunnel from "../features/admin/DealFunnel";
import OpportunityStage from "../features/admin/OpportunityStage";
import RevenueChart from "../features/admin/RevenueChart";
import ProfitChart from "../features/admin/ProfitChart";
import Meetings from "../features/admin/Meetings";
import LeadGraph from "../features/admin/LeadGraph";
import ExecutiveActi from "../features/admin/ExecuitveActi";
import AdminSidebar from "../layouts/AdminSidebar";
import "../styles/admin.css";
import ExecutiveList from "../features/admin/ExecutiveList";
import { useApi } from "../context/ApiContext";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  const { topExecutive, fetchExecutives } = useApi();

  const location = useLocation();
  const [selectedExecutive, setSelectedExecutive] = useState(null);
 
  useEffect(() => {
    fetchExecutives();
  }, []);
  const currentExecutive = selectedExecutive || topExecutive;

  // Check if route is dashboard or sub-page
  const isDashboard = location.pathname === "/admin";

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar className="admin-sidebar" />
      <main className="admin-main-content">
        <AdminNavbar/>
        {isDashboard ? (
          <div className="dashboard-wrapper">
            <Header />
            <Summary />
            <div className="charts">
              <div className="chart-row">
                <DealFunnel />
                <ExecutiveActi
                  selectedExecutiveId={currentExecutive?.id}
                  executiveName={currentExecutive?.username}
                />
              </div>
              <div className="chart-row">
                <LeadGraph
                  selectedExecutiveId={currentExecutive?.id}
                  executiveName={currentExecutive?.username}
                />
                <ExecutiveList onSelectExecutive={setSelectedExecutive}/>
              </div>
            </div>
            <div className="revenue-executive-container">
              <RevenueChart />
            </div>
            <div className="additional-section">
              <ProfitChart />
              <Meetings />
            </div>
          </div>
        ) : (
          <Outlet /> // ✅ This will now only render sub-pages like "Assign Task"
        )}
      </main>
    </div>
  );
};

export default AdminLayout;