import React from "react";
import Leads from "../features/close-leads/leads";
import "../styles/closeLeads.css";
import SideandNavbar from "../layouts/SidebarandNavbar";
import { SearchContext } from "../context/SearchContext";
import { useEffect,useContext } from "react";
import ProcessLeads from "../features/close-leads/ProcessLeads";

const ProcessFinalRoutes = () => {
  const { searchQuery, setActivePage } = useContext(SearchContext); 
  useEffect(() => {
    setActivePage("close-leads"); 
  }, []);
  return (
    <div className="close-leads-container">
   
      <div className="close-leads-main">
      <ProcessLeads searchQuery={searchQuery}/>
      </div>
    </div>
  );
};

export default ProcessFinalRoutes;