


import React, { useEffect, useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import { ThemeContext } from "../../features/admin/ThemeContext";
import SidebarToggle from "../admin/SidebarToggle";
import "../../styles/leadassign.css";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";

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
  const paginatedLeads = leads;
  const [showPagination, setShowPagination] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { isLoading, variant, showLoader, hideLoader } = useLoading();
  const {
    fetchAllClients,
    reassignLead,
    fetchExecutivesAPI,
    assignLeadAPI,
    createFreshLeadAPI,
    createLeadAPI,
    updateClientLead,
    deleteClientLead,
  } = useApi();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("adminSidebarExpanded") === "false"
  );
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    const container = document.querySelector(".scrollable-container");
  
    const handleScroll = () => {
      if (!container) return;
      const threshold = 50; // small buffer from bottom
      const isBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
      setShowPagination(isBottom);
    };
  
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
  
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  
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

  useEffect(() => {
    const getAllLeads = async () => {
      setLoading(true);
      try {
        showLoader("Loading task management...", "admin");
        const data = await fetchAllClients(); // Make sure this returns { leads: [...] }
        const normalizedLeads = Array.isArray(data) ? data : data.leads || [];
        setLeads(normalizedLeads);
        setAllClients(normalizedLeads); 
        setTotalLeads(data.pagination?.total || normalizedLeads.length);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLeads([]);
        setAllClients([]); 
        setTotalLeads(0);
      } finally {
        hideLoader();
      }
    };
  
    getAllLeads(); // Call the async function
  }, []); 

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
  // Start with the full dataset
  let filtered = [...allClients];

  // Apply filter type
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

  const total = filtered.length;
  const totalPages = Math.ceil(total / leadsPerPage);

  // Ensure current page is within valid bounds after filtering
  const newPage = currentPage > totalPages ? 1 : currentPage;

  const offset = (newPage - 1) * leadsPerPage;
  const paginated = filtered.slice(offset, offset + leadsPerPage);

  setLeads(paginated);
  setTotalLeads(total);
  setCurrentPage(newPage); // Ensures pagination is stable
}, [filterType, allClients, currentPage, leadsPerPage]);

  const handleEditClick = (lead) => {
    setEditingLead({ ...lead });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingLead(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingLead) return;
    try {
      await updateClientLead(editingLead.id, editingLead);
      const updatedLeads = leads.map((lead) =>
        lead.id === editingLead.id ? { ...lead, ...editingLead } : lead
      );
      setLeads(updatedLeads);
      setAllClients(
        allClients.map((lead) =>
          lead.id === editingLead.id ? { ...lead, ...editingLead } : lead
        )
      );
      alert("✅ Lead updated successfully.");
      handleCloseModal();
    } catch (error) {
      console.error("❌ Error updating lead:", error);
      alert("❌ Failed to update lead.");
    }
  };

  const handleDeleteClick = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await deleteClientLead(leadId);
      const updatedLeads = leads.filter((lead) => lead.id !== leadId);
      setLeads(updatedLeads);
      setAllClients(allClients.filter((lead) => lead.id !== leadId));
      setTotalLeads(totalLeads - 1);
      alert("✅ Lead deleted successfully.");
    } catch (error) {
      console.error("❌ Error deleting lead:", error);
      alert("❌ Failed to delete lead.");
    }
  };

  return (
    <div className={`f-lead-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <SidebarToggle />
    
      <div className="leads-dashboard" data-theme={theme}>
      {isLoading && variant === "admin" && (
        <AdminSpinner text="Loading Lead Assign..." />
      )}
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
                  onClick={() => handleFilterChange(type)}
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
                      <span>Email: {lead.email}
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
                           <span>Phone No: {lead.phone}</span>
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
                    <button className="edit" onClick={() => handleEditClick(lead)}>
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDeleteClick(lead.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {leads.length > 0 && showPagination && (
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

      {isEditModalOpen && editingLead && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Lead</h2>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editingLead.name}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editingLead.email || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={editingLead.phone}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Education:</label>
              <input
                type="text"
                name="education"
                value={editingLead.education || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Experience:</label>
              <input
                type="text"
                name="experience"
                value={editingLead.experience || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={editingLead.state || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={editingLead.country || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth (DOB):</label>
              <input
                type="date"
                name="dob"
                value={editingLead.dob || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Lead Assign Date:</label>
              <input
                type="date"
                name="leadAssignDate"
                value={editingLead.leadAssignDate || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Country Preference:</label>
              <input
                type="text"
                name="countryPreference"
                value={editingLead.countryPreference || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;