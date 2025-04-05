import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../features/admin/Header";
import Summary from "../features/admin/Summary";
import DealFunnel from "../features/admin/DealFunnel";
import OpportunityStage from "../features/admin/OpportunityStage";
import RevenueChart from "../features/admin/RevenueChart";
import ProfitChart from "../features/admin/ProfitChart";
import Meetings from "../features/admin/Meetings";
import AssignTask from "../features/admin/AssignTask";
import LeadGraph from "../features/admin/LeadGraph";
import ExecutiveActi from "../features/admin/ExecuitveActi";
import AdminSidebar from "../layouts/AdminSidebar";
import "../styles/admin.css";
import ExecutiveList from "../features/admin/ExecutiveList";
import { fetchAllExecutivesActivities } from "../services/apiService";

const AdminLayout = () => {
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [topExecutive, setTopExecutive] = useState(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const executives = await fetchAllExecutivesActivities();

        if (executives.length > 0) {
          setTopExecutive(executives[0]);
        }
      } catch (error) {
        console.error("Error fetching executives:", error);
      }
    };

    fetchExecutives();
  }, []);

  const currentExecutive = selectedExecutive || topExecutive;

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <div className="dashboard-wrapper">
          <Header />
          <Summary />
          <div className="charts">
            <div className="chart-row">
              <DealFunnel />
              <OpportunityStage />
            </div>
            <div className="chart-row">
            <LeadGraph 
  selectedExecutiveId={currentExecutive?.id} 
  executiveName={currentExecutive?.username} 
/>
<ExecutiveActi 
  selectedExecutiveId={currentExecutive?.id} 
  executiveName={currentExecutive?.username} 
/>

            </div>
          </div>
          <div className="revenue-executive-container">
            <RevenueChart />
            <ExecutiveList onSelectExecutive={setSelectedExecutive} />
            </div>
          <div className="additional-section">
            <ProfitChart />
            <Meetings />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
