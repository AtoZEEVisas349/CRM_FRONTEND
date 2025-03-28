import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskManagement = () => {
  const [leads, setLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/client-leads/getClients");
      setLeads(response.data.leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

// Fetch Executives
const fetchExecutives = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/executives", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Fetched Executives:", response.data); // Log the response

    if (response.data.executives) {
      setExecutives(response.data.executives);
      console.log("✔ Executives Set:", response.data.executives);
    } else {
      console.log("⚠ No executives found!");
    }
  } catch (error) {
    console.error("❌ Error fetching executives:", error.response?.data || error.message);
  }
};


  useEffect(() => {
    fetchLeads();
    fetchExecutives();
  }, []);

  // Handle Select Executive
  const handleExecutiveChange = (event) => {
    setSelectedExecutive(event.target.value);
  };

  // Handle Select Lead Checkbox
  const handleLeadSelection = (leadId) => {
    setSelectedLeads((prevSelectedLeads) =>
      prevSelectedLeads.includes(String(leadId))
        ? prevSelectedLeads.filter((id) => id !== String(leadId))
        : [...prevSelectedLeads, String(leadId)]
    );
  };

  // Select/Unselect All Leads
  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((lead) => String(lead.id)));
    }
  };

  const assignLeads = async () => {
    if (!selectedExecutive) {
      alert("Please select an executive before assigning leads.");
      return;
    }
  
    if (selectedLeads.length === 0) {
      alert("Please select at least one lead to assign.");
      return;
    }
  
    // Find the selected executive's details (convert IDs to numbers if necessary)
    const executive = executives.find((exec) => String(exec.id) === String(selectedExecutive));
    
    if (!executive) {
      alert("Invalid executive selected.");
      console.error("❌ Executive not found in the list. Executives:", executives, "Selected ID:", selectedExecutive);
      return;
    }
  
    try {
      await Promise.all(
        selectedLeads.map(async (leadId) => {
          console.log(`🔄 Assigning Lead ID: ${leadId} to Executive: ${executive.username}`);
  
          const response = await axios.put(
            `http://localhost:5000/api/client-leads/assign-executive/${leadId}`,
            {
              executiveId: executive.id, // Correct executive ID
              executiveName: executive.username, // Correct executive name
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
  
          console.log(`✅ Lead ${leadId} assigned successfully:`, response.data);
        })
      );
  
      alert("Leads assigned successfully!");
      fetchLeads(); // Refresh the leads list
      setSelectedLeads([]); // Reset selection
    } catch (error) {
      console.error("❌ Error assigning leads:", error.response?.data || error.message);
      alert("Failed to assign leads. Check the console for details.");
    }
  };
  
  
  return (
    <div className="leads-dashboard">
      <div className="Logo">Lead Assign</div>
      <div className="taskmanage-header">
        <div className="header-actions">
        <select value={selectedExecutive} onChange={handleExecutiveChange}>
  <option value="">-- Select Executive --</option>
  {executives.map((exec) => (
    <option key={exec.id} value={String(exec.id)}> {/* Ensure value is a string */}
      {exec.username}
    </option>
  ))}
</select>

          <select>
            <option>Fresh</option>
          </select>
          <select>
            <option>All</option>
          </select>
          <select>
            <option>Default Sorting</option>
          </select>
          <div className="header-sort-filter">
            <button className="Selection-btn" onClick={toggleSelectAll}>
              Select/Unselect All Leads
            </button>
            <button className="assign-btn" onClick={assignLeads}>
              Assign
            </button>
            <button className="reset" onClick={() => setSelectedLeads([])}>
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="leads-table">
          <div className="leads-header">
            <span>All customers ({leads.length})</span>
            <span className="source-header">Source</span>
            <span className="assign-header">Assigned To</span>
          </div>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <div key={lead.id} className="lead-row">
                <div className="lead-details">
                  <input
                    type="checkbox"
                    className="lead-checkbox"
                    checked={selectedLeads.includes(String(lead.id))}
                    onChange={() => handleLeadSelection(lead.id)}
                  />
                  <span className="container-icon">👤</span>
                  <div className="lead-info">
                    <span>Name: {lead.name}</span>
                    <span>Email: {lead.email}</span>
                    <span>Phone No: {lead.phone}</span>
                    <span>Education: {lead.education}</span>
                    <span>Experience: {lead.experience}</span>
                    <span>State: {lead.state}</span>
                    <span>Country: {lead.country}</span>
                    <span>DOB: {lead.dob || "N/A"}</span>
                    <span>Lead Assign Date: {lead.leadAssignDate || "N/A"}</span>
                    <span>Country Preference: {lead.countryPreference || "N/A"}</span>
                  </div>
                  <div className="lead-source">{lead.source}</div>
                  <div className="lead-assign">{lead.assignedToExecutive || "Unassigned"}</div>
                  <div className="lead-actions">
                    <button className="edit">Edit</button>
                    <button className="delete">Delete</button>
                    <button className="follow-up">Follow Up</button>
                    <button className="whatsapp">WhatsApp Connect</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No leads available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
