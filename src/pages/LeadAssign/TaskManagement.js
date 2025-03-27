import React from 'react';
import "../../styles/taskmanagement.css"

const TaskManagement = () => {
  const leads = [
    {
      name: 'Pratap Nilam',
      email: 'pratapnilam2@gmail.com',
      phone: '9830596988',
      education: 'BE Mechanical',
      experience: '7 years',
      state: 'Maharashtra',
      country: 'India',
      source: 'website',
      assignedTo: 'gaurav',
      leadAssignDate: '2025-03-07',
      countryPreference: 'MIDDLE EAST (Dubai, Qatar, Saudi Arabia, Kuwait etc.)'
    },
    {
      name: 'Pratap Nilam',
      email: 'pratapnilam2@gmail.com',
      phone: '9830596988',
      education: 'BE Mechanical',
      experience: '7 years',
      state: 'Maharashtra',
      country: 'India',
      source: 'google ads',
      assignedTo: 'rahul',
      leadAssignDate: '2025-03-07',
      countryPreference: 'MIDDLE EAST (Dubai, Qatar, Saudi Arabia, Kuwait etc.)'
    },
    {
      name: 'Pratap Nilam',
      email: 'pratapnilam2@gmail.com',
      phone: '9830596988',
      education: 'BE Mechanical',
      experience: '7 years',
      state: 'Maharashtra',
      country: 'India',
      source: 'just dial',
      assignedTo: 'deepak',
      leadAssignDate: '2025-03-07',
      countryPreference: 'MIDDLE EAST (Dubai, Qatar, Saudi Arabia, Kuwait etc.)'
    },
    {
      name: 'Pratap Nilam',
      email: 'pratapnilam2@gmail.com',
      phone: '9830596988',
      education: 'BE Mechanical',
      experience: '7 years',
      state: 'Maharashtra',
      country: 'India',
      source: 'website',
      assignedTo: 'Achu',
      leadAssignDate: '2025-03-07',
      countryPreference: 'MIDDLE EAST (Dubai, Qatar, Saudi Arabia, Kuwait etc.)'
    },
    {
      name: 'Pratap Nilam',
      email: 'pratapnilam2@gmail.com',
      phone: '9830596988',
      education: 'BE Mechanical',
      experience: '7 years',
      state: 'Maharashtra',
      country: 'India',
      source: 'google',
      assignedTo: 'Riya',
      leadAssignDate: '2025-03-07',
      countryPreference: 'MIDDLE EAST (Dubai, Qatar, Saudi Arabia, Kuwait etc.)'
    }
  ];

  return (
    <div className="leads-dashboard">
      <div className='Logo'>Lead Assign</div>
      <div className="taskmanage-header">
        <div className="header-actions">
          <select>
            <option>Select User</option>
          </select>
          <select >
            <option>Fresh</option>
          </select>
          <select >
            <option>All </option>
          </select>
          <select >
            <option>Default Sorting</option>
          </select>
         <div className='header-sort-filter'>
        <button className='Selection-btn'>Select/Unselect All Leads</button>
        <button className='assign-btn'>Assign</button>
        <button className='reset'>Reset</button>
         </div>

        </div>
      </div>
      <div className="main-content">
        <div className="leads-table">
          <div className="leads-header">
            <span>All customer (4618)</span>
            <span className="source-header">Source</span>
            <span className="assign-header">Lead assign to</span>
          </div>
          {leads.map((lead, index) => (
            <div key={index} className="lead-row">
              <div className="lead-details">
              <input type="checkbox" className='lead-checkbox'/>
              <span className='container-icon'>
              👤
              </span>
                <div className="lead-info">
                  <span>Name: {lead.name}</span>
                  <span>Email: {lead.email}</span>
                  <span>Phone No: {lead.phone}</span>
                  <span>Education: {lead.education}</span>
                  <span>Experience: {lead.experience}</span>
                  <span>State: {lead.state}</span>
                  <span>Country: {lead.country}</span>
                  <span>DOB: 1995-01-02</span>
                  <span>Lead Assign Date: {lead.leadAssignDate}</span>
                  <span>Country Preference: {lead.countryPreference}</span>
                </div>
                <div className="lead-source">{lead.source}</div>
                <div className="lead-assign">{lead.assignedTo}</div>
                <div className="lead-actions">
                  <button className="edit">Edit</button>
                  <button className="delete">Delete</button>
                  <button className="follow-up">Follow Up</button>
                  <button className="whatsapp">WhatsApp Connect</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;