import React from 'react'
import AdminSidebar from '../components/AdminSidebar'
import TaskManagement from '../pages/LeadAssign/TaskManagement'
import '../styles/leadassign.css'

function LeadAssignRoute() {
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

export default LeadAssignRoute