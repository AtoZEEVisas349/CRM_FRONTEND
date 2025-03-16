import React, { useState } from "react";
import ClientDetails from "../pages/follow-ups/ClientDetails";
import ClientTable from "../pages/follow-ups/ClientTable";
import SidebarandNavbar from "../components/SidebarandNavbar";
import "../styles/followup.css";

const FollowUpRoutes = () => {
    const [activeTab, setActiveTab] = useState("All Follow Ups");

  return (
    <div className="follow-app-container">
      <SidebarandNavbar />
      <div className="follow-main-content">
        <h2>Client List</h2>
        <ClientDetails />
        {/* Follow-up Tabs */}
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
        <ClientTable />
      </div>
    </div>
  );
}

export default FollowUpRoutes;
