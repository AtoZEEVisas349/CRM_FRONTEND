
import React, { useState, useEffect } from "react";
import ClientDetails from "../features/follow-ups/ClientDetails";
import ClientTable from "../features/follow-ups/ClientTable";
import SidebarandNavbar from "../layouts/SidebarandNavbar";
import "../styles/followup.css";
import { useLocation } from "react-router-dom";

const FollowUpRoutes = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "All Follow Ups"
  );
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  return (
    <div className="follow-app-container">
      {/* <SidebarandNavbar /> */}
      <div className="follow-main-content">
        <h2>Client List</h2>
        <ClientDetails selectedClient={selectedClient} onClose={() => setSelectedClient(null)} />
        <div className="followup-tabs">
          {["All Follow Ups", "Interested", "Not Interested"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <ClientTable filter={activeTab} onSelectClient={setSelectedClient} />
      </div>
    </div>
  );
};

export default FollowUpRoutes;