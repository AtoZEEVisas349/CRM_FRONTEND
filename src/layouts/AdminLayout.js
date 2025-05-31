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
  const { topExecutive, fetchExecutives, fetchExecutivesAPI } = useApi();

  const location = useLocation();
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [timeRange, setTimeRange] = useState("last30days");
  const [selectedExecutiveId, setSelectedExecutiveId] = useState("all");
  const [executives, setExecutives] = useState([]);
 
  useEffect(() => {
    fetchExecutives();
    fetchExecutivesList();
  }, []);

  const fetchExecutivesList = async () => {
    try {
      const data = await fetchExecutivesAPI();
      setExecutives(data);
    } catch (error) {
      console.error("❌ Error fetching executives:", error);
    }
  };

  const currentExecutive = selectedExecutive || topExecutive;

  // Check if route is dashboard or sub-page
  const isDashboard = location.pathname === "/admin";

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
    // Add your logic here to filter data based on time range
  };

  const handleExecutiveChange = (e) => {
    setSelectedExecutiveId(e.target.value);
    // Add your logic here to filter data based on selected executive
    console.log("Selected Executive ID:", e.target.value);
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar className="admin-sidebar" />
      <main className="admin-main-content">
        <AdminNavbar/>
        {isDashboard ? (
          <div className="dashboard-wrapper">
            <Header />
            <Summary />
            
            {/* Selectors Section */}
            <div className="dashboard-selectors">
              <div className="selector-group">
                <label htmlFor="time-range-select" className="selector-label">
                  Time Range
                </label>
                <select
                  id="time-range-select"
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  className="dashboard-select"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="thismonth">This Month</option>
                  <option value="lastmonth">Last Month</option>
                  <option value="thisyear">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div className="selector-group">
                <label htmlFor="executive-select" className="selector-label">
                  Executive
                </label>
                <select
                  id="executive-select"
                  value={selectedExecutiveId}
                  onChange={handleExecutiveChange}
                  className="dashboard-select"
                >
                  <option value="all">All Executives</option>
                  {executives.map((exec) => (
                    <option key={exec.id} value={exec.id}>
                      {exec.username} (ID: {exec.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
              <Meetings selectedExecutiveId={selectedExecutiveId} />
            </div>
          </div>
        ) : (
          <Outlet /> // ✅ This will now only render sub-pages like "Assign Task"
        )}
      </main>
    </div>
  );
};

export default AdminLayout;