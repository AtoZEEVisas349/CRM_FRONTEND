import React from 'react'
import AdminSidebar from '../components/AdminSidebar';
import TaskManagement from '../pages/LeadAssign/TaskManagement';
import '../styles/leadAssign.css';


function LeadAssignRoutes() {
  return (
    <div className="lead-assign-container">
      <div className='lead-sidebar'>
        <AdminSidebar/>
      </div>  
      <div className='lead-content'>
       <TaskManagement/> 
      </div>
    </div>
  )
}

export default LeadAssignRoutes;