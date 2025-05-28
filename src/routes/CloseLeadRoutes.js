import React from "react";
import Leads from "../features/close-leads/leads";
import "../styles/closeLeads.css";
import SideandNavbar from "../layouts/SidebarandNavbar";

const CloseLeadRoutes = () => {
  return (
    <div className="close-leads-container">
      <SideandNavbar/>
      <div className="close-leads-main">
      <Leads />
      </div>
    </div>
  );
};

export default CloseLeadRoutes;
