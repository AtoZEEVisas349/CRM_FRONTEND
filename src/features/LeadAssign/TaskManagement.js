import React, { useEffect, useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import { ThemeContext } from "../../features/admin/ThemeContext";
import SidebarToggle from "../admin/SidebarToggle";
import "../../styles/leadassign.css";
import AdminNavbar from "../../layouts/AdminNavbar";

const TaskManagement = () => {
  const [leads, setLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [expandedLeads, setExpandedLeads] = useState({});
  const [selectedRange, setSelectedRange] = useState("");
  const [leadsPerPage, setLeadsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [filterType, setFilterType] = useState("all"); 
  const totalPages = Math.ceil(totalLeads / leadsPerPage);
  const [filteredClients, setFilteredClients] = useState([]);
  const paginatedLeads = filteredClients;
  const { theme } = useContext(ThemeContext);
  const {

    fetchAllClients,
    reassignLead,
    fetchExecutivesAPI,
    assignLeadAPI,
    createFreshLeadAPI,
    createLeadAPI,

  } = useApi();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("adminSidebarExpanded") === "false"
  );

  useEffect(() => {
    const updateSidebarState = () => {
      const isExpanded = localStorage.getItem("adminSidebarExpanded") === "true";
      setSidebarCollapsed(!isExpanded);
    };
    window.addEventListener("sidebarToggle", updateSidebarState);
    updateSidebarState();
    return () => window.removeEventListener("sidebarToggle", updateSidebarState);
  }, []);

  useEffect(() => {
    fetchExecutives();
  }, []);
  const[allClients,setAllClients]=useState([]);
  useEffect(() => {
  const getAllLeads = async () => {
    try {
      const data = await fetchAllClients(); // Make sure this returns { leads: [...] }

     const normalizedLeads = Array.isArray(data) ? data : data.leads || [];
      setLeads(normalizedLeads);
      setTotalLeads(data.pagination?.total || normalizedLeads.length);
      if (Array.isArray(data?.leads)) {
        setAllClients(data.leads);             
        setFilteredClients(allClients);     
      } else {
        setAllClients([]); // fallback to empty array
        setFilteredClients([]);
      
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
      setTotalLeads(0);
    }
  };

  getAllLeads(); // Call the async function
}, [currentPage, leadsPerPage, filterType]); 


  const fetchExecutives = async () => {
    try {
      const data = await fetchExecutivesAPI();
      setExecutives(data);
    } catch (error) {
      console.error("❌ Failed to load executives:", error);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page when filter changes
    setSelectedLeads([]); // Clear selected leads
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleExecutiveChange = (e) => setSelectedExecutive(e.target.value);

  const handleLeadSelection = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(String(leadId))
        ? prev.filter((id) => id !== String(leadId))
        : [...prev, String(leadId)]
    );
  };

  const toggleExpandLead = (leadId) => {
    setExpandedLeads((prev) => ({ ...prev, [leadId]: !prev[leadId] }));
  };

  const toggleSelectAll = () => {
    setSelectedLeads((prev) =>
      prev.length === leads.length ? [] : leads.map((lead) => String(lead.id))
    );
  };

  const handleRangeChange = (e) => {
    const range = e.target.value;
    setSelectedRange(range);
    const [start] = range.split("-").map(Number);
    const newPage = Math.ceil(start / leadsPerPage);
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (!selectedRange || leads.length === 0) return;

    const [start, end] = selectedRange.split("-").map(Number);
    const startIndex = (currentPage - 1) * leadsPerPage + 1;

    const selectedIds = leads
      .map((lead, idx) => ({ lead, index: startIndex + idx }))
      .filter(({ index }) => index >= start && index <= end)
      .map(({ lead }) => String(lead.id));

    setSelectedLeads(selectedIds);
  }, [leads, selectedRange, currentPage]);
const assignLeads = async () => {
  if (!selectedExecutive) return alert("⚠️ Please select an executive.");
  if (selectedLeads.length === 0) return alert("⚠️ Please select at least one lead.");

  const executive = executives.find((exec) => String(exec.id) === selectedExecutive);
  if (!executive || !executive.username) return alert("⚠️ Invalid executive selected.");

  let successCount = 0;
  let failCount = 0;
  const updatedLeads = [...leads];

  for (const leadId of selectedLeads) {
    const lead = leads.find((l) => String(l.id) === leadId);
    if (!lead) {
      failCount++;
      continue;
    }

    const clientLeadId = lead.id; // since this is the actual ID from your API
    if (!clientLeadId) {
      console.warn("❌ Missing clientLeadId or lead.id:", lead);
      failCount++;
      continue;
    }

    const phone = String(lead.phone).replace(/[eE]+([0-9]+)/gi, "");

    const leadPayload = {
      name: lead.name,
      email: lead.email || "default@example.com",
      phone,
      source: lead.source || "Unknown",
      clientLeadId: Number(clientLeadId),
      assignedToExecutive: executive.username,
    };
      
    try {
   
   let finalLeadId = leadId;

  // Assign or Reassign based on whether lead was already assigned
  if (!lead.assignedToExecutive) {
      // Always create the lead first
  const createdLead = await createLeadAPI(leadPayload);
  if (!createdLead?.id) throw new Error("Lead creation failed");

  finalLeadId = createdLead.clientLeadId;
    await assignLeadAPI(Number(finalLeadId), executive.username);
    const freshLeadPayload = {
      leadId: createdLead.id,
      name: createdLead.name,
      email: createdLead.email,
      phone: String(createdLead.phone),
      assignedTo: executive.username,
      assignedToId: executive.id,
      assignDate: new Date().toISOString(),
    };
  
    await createFreshLeadAPI(freshLeadPayload);
  
  } else {
    await reassignLead(lead.id, executive.username);
    alert("Lead resassigned successfully!!");
  }

      const index = updatedLeads.findIndex((l) => String(l.id) === leadId);
      if (index !== -1) {
        updatedLeads[index] = {
          ...updatedLeads[index],
          assignedToExecutive: executive.username,
        };
      }

      successCount++;
    } catch (err) {
      console.error(`❌ Error processing lead ID ${leadId}:`, err);
      failCount++;
    }
  }

  setLeads(updatedLeads);
  setAllClients(updatedLeads); // ✅ update the full list
  setFilteredClients(updatedLeads); // ✅ re-filter so the UI refreshes
  setSelectedLeads([]);
  setSelectedExecutive("");

  if (successCount > 0 && failCount === 0) {
    alert("✅ Leads assigned successfully.");
  } else if (successCount > 0 && failCount > 0) {
    alert(`⚠️ ${successCount} lead(s) assigned, ${failCount} failed. Check console`);
  } else {
    alert("❌ All lead assignments failed.");
  }
};
useEffect(() => {
  let filtered = [...allClients];

  switch (filterType) {
    case "converted":
      filtered = filtered.filter((lead) => lead.status === "Converted");
      break;
    case "followup":
      filtered = filtered.filter((lead) => lead.status === "Follow-Up");
      break;
       case "fresh":
      filtered = filtered.filter((lead) => lead.status === "New");
      break;
       case "meeting":
      filtered = filtered.filter((lead) => lead.status === "Meeting");
      break;
    case "closed":
      filtered = filtered.filter((lead) => lead.status === "Closed");
      break;
    
    default:
      break;
  }

  setFilteredClients(filtered);
  setTotalLeads(filtered.length);
  setCurrentPage(1);
}, [filterType, allClients]);

const handleFilterChangee = (type) => {
  setFilterType(type);
    setCurrentPage(1); 
    setSelectedLeads([]); 
};

  return (
    <div className={`f-lead-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <SidebarToggle />
      <AdminNavbar />

      <div className="leads-dashboard" data-theme={theme}>
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

            <select value={selectedRange} onChange={handleRangeChange}>
              <option value="">Default Sorting</option>
              <option value="1-10">1 - 10</option>
              <option value="11-20">11 - 20</option>
              <option value="21-50">21 - 50</option>
              <option value="51-100">51 - 100</option>
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
            <div className="lead-filter-buttons">
              {["all", "fresh", "followup", "converted", "closed","meeting"].map(type => (
                <button
                  key={type}
                  className={`lead-filter-btn ${filterType === type ? "active" : ""}`}
                  onClick={() => handleFilterChangee(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} 
                </button>
              ))}
            </div>        
          </div>
        </div>
        <div className="scrollable-container">
          <div className="leads-table">
            <div className="leads-header">
              <span>All customers ({totalLeads})</span>
              <span className="source-header">Source</span>
              <span className="assign-header">Assigned To</span>
              <span></span>
            </div>
            {paginatedLeads.map((lead) => (
              <div key={lead.id} className="lead-row">
                <div className="lead-details">
                  <div className="lead-info-container">
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
                      <span>Phone No: {lead.phone}
                        {!expandedLeads[lead.id] && (
                          <button
                            className="see-more-btn-inline"
                            onClick={() => toggleExpandLead(lead.id)}
                          >
                            See more...
                          </button>
                        )}
                      </span>
                      {expandedLeads[lead.id] && (
                        <div>
                          <span>Education: {lead.education || "N/A"}</span>
                          <span>Experience: {lead.experience || "N/A"}</span>
                          <span>State: {lead.state || "N/A"}</span>
                          <span>Country: {lead.country || "N/A"}</span>
                          <span>DOB: {lead.dob || "N/A"}</span>
                          <span>Lead Assign Date: {lead.leadAssignDate || "N/A"}</span>
                          <span>Country Preference: {lead.countryPreference || "N/A"}
                          <button
                          className="see-more-btn-inline"
                          onClick={() => toggleExpandLead(lead.id)}
                        >
                          See less...
                        </button>
                          </span>
                      
                        </div>
                      )}
                    
                    </div>
                  </div>
                  <div className="lead-source">{lead.source || "Unknown"}</div>
                  <div className="lead-assign">{lead.assignedToExecutive || "Unassigned"}</div>
                  <div className="lead-actions">
                    <button className="edit">Edit</button>
                    <button className="delete">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {leads.length > 0 && (
            <div className="pagination-controls">
              <button onClick={handlePrev} disabled={currentPage === 1} aria-label="Previous page">
                Prev
              </button>
              <span className="page-indicator">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;