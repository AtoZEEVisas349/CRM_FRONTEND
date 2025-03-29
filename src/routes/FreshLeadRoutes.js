import React from 'react'
import FreshLeads from '../pages/freshLeads/FreshLead';
import SidebarandNavbar from "../components/SidebarandNavbar";
import "../styles/freshlead.css";

const FreshLeadRoutes=()=> {
  return (
    <div className="lead-assign-container">
      <div className='lead-sidebar'>
        <SidebarandNavbar/>
      </div>  
      <div className='lead-content'>
       <FreshLeads/> 
      </div>
    </div>
  )
}

export default FreshLeadRoutes;