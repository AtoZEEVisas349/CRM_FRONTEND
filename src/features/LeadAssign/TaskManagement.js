import React, { useEffect, useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import { ThemeContext } from "../../features/admin/ThemeContext";
import SidebarToggle from "../admin/SidebarToggle";

const TaskManagement = () => {
  const [leads, setLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { fetchLeadsAPI, fetchExecutivesAPI, assignLeadAPI } = useApi();

  // ✅ Sidebar State Tracking
  const [sidebarState, setSidebarState] = useState(
    localStorage.getItem("adminSidebarExpanded") !== "false" ? "expanded" : "collapsed"
  );

  useEffect(() => {
    const updateSidebarState = () => {
      const isExpanded = localStorage.getItem("adminSidebarExpanded") === "true";
      setSidebarState(isExpanded ? "expanded" : "collapsed");
    };

    window.addEventListener("sidebarToggle", updateSidebarState);
    updateSidebarState();

    return () => window.removeEventListener("sidebarToggle", updateSidebarState);
  }, []);

  // ✅ Data Fetch
  const fetchLeads = async () => {
    try {
      const data = await fetchLeadsAPI();
      setLeads(data);
    } catch (error) {
      console.error("❌ Failed to load leads:", error);
    }
  };

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

  // ✅ Actions
  const handleExecutiveChange = (event) => {
    setSelectedExecutive(event.target.value);
  };

  const handleLeadSelection = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(String(leadId))
        ? prev.filter((id) => id !== String(leadId))
        : [...prev, String(leadId)]
    );
  };

  const toggleSelectAll = () => {
    setSelectedLeads((prev) =>
      prev.length === leads.length ? [] : leads.map((lead) => String(lead.id))
    );
  };

  const assignLeads = async () => {
    if (!selectedExecutive) return alert("Select an executive.");
    if (!selectedLeads.length) return alert("Select at least one lead.");

    const executive = executives.find((exec) => String(exec.id) === selectedExecutive);
    if (!executive) return alert("Invalid executive selected.");

    try {
      await Promise.all(
        selectedLeads.map((leadId) =>
          assignLeadAPI(leadId, executive.id, executive.username)
        )
      );
      alert("Leads assigned!");
      fetchLeads();
      setSelectedLeads([]);
    } catch (err) {
      console.error("Assign error:", err);
      alert("Failed to assign leads.");
    }
  };

  return (
    <>
      <SidebarToggle />
      <div className={`leads-dashboard ${sidebarState}`}>
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

            <select><option>Fresh</option></select>
            <select><option>All</option></select>
            <select><option>Default Sorting</option></select>
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
            {leads.map((lead) => (
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskManagement;
