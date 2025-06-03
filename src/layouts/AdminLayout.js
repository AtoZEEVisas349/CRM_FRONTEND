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
  };

  const handleExecutiveChange = (e) => {
    const selectedId = e.target.value;
    setSelectedExecutiveId(selectedId);

    // Find the selected executive from the executives list
    if (selectedId === "all") {
      setSelectedExecutive(null); // Reset to show data for all executives
    } else {
      const exec = executives.find((exec) => exec.id === parseInt(selectedId));
      setSelectedExecutive(exec || null); // Update selectedExecutive state
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar className="admin-sidebar" />
      <main className="admin-main-content">
        <AdminNavbar />
        {isDashboard ? (
          <div className="dashboard-wrapper">
            <Header />
            <Summary />

            {/* Selectors Section */}
            <div className="dashboard-selectors">
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
                  selectedExecutiveId={selectedExecutiveId === "all" ? null : currentExecutive?.id}
                  executiveName={selectedExecutiveId === "all" ? "All Executives" : currentExecutive?.username}
                />
              </div>
              <div className="chart-row">
                <LeadGraph
                  selectedExecutiveId={selectedExecutiveId === "all" ? null : currentExecutive?.id}
                  executiveName={selectedExecutiveId === "all" ? "All Executives" : currentExecutive?.username}
                />
                <ExecutiveList onSelectExecutive={setSelectedExecutive} />
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
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default AdminLayout;