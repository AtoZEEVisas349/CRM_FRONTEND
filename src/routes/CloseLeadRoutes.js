import React from "react";
import Leads from "../pages/close-leads/leads";
import NavSearch from "../pages/close-leads/NavSearch";
import "../styles/closeLeads.css";
import SideandNavbar from "../components/SidebarandNavbar";

const CloseLeadRoutes = () => {
  return (
    <div className="close-leads-container">
      <SideandNavbar/>
      <div className="close-leads-main">
      <NavSearch />
      <Leads />
      </div>
    </div>
  );
};

export default CloseLeadRoutes;
