import React, { useEffect, useState ,useContext} from "react";
import { useApi } from "../../context/ApiContext"; // ✅ 
// Import useApi hook
import { ThemeContext } from "../../features/admin/ThemeContext";


const TaskManagement = () => {
  const [leads, setLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const { theme } = useContext(ThemeContext);


  const { fetchLeadsAPI, fetchExecutivesAPI, assignLeadAPI } = useApi(); // ✅ Destructure API functions from context

  // ✅ Fetch Leads
  const fetchLeads = async () => {
    try {
      const data = await fetchLeadsAPI();
      setLeads(data);
    } catch (error) {
      console.error("❌ Failed to load leads:", error);
    }
  };

  // ✅ Fetch Executives
  const fetchExecutives = async () => {
    try {
      const data = await fetchExecutivesAPI();
      setExecutives(data);
    } catch (error) {
      console.error("❌ Failed to load executives:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchExecutives();
  }, []);

  const handleExecutiveChange = (event) => {
    setSelectedExecutive(event.target.value);
  };

  const handleLeadSelection = (leadId) => {
    setSelectedLeads((prevSelectedLeads) =>
      prevSelectedLeads.includes(String(leadId))
        ? prevSelectedLeads.filter((id) => id !== String(leadId))
        : [...prevSelectedLeads, String(leadId)]
    );
  };

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

    const executive = executives.find((exec) => String(exec.id) === String(selectedExecutive));
    if (!executive) {
      alert("Invalid executive selected.");
      return;
    }

    try {
      await Promise.all(
        selectedLeads.map(async (leadId) => {
          await assignLeadAPI(leadId, executive.id, executive.username);
        })
      );

      alert("Leads assigned successfully!");
      fetchLeads();
      setSelectedLeads([]);
    } catch (error) {
      console.error("❌ Error assigning leads:", error);
      alert("Failed to assign leads.");
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
              <option key={exec.id} value={String(exec.id)}>
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