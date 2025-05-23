import React, { useEffect, useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import { ThemeContext } from "../../features/admin/ThemeContext";
import SidebarToggle from "../admin/SidebarToggle";
import "../../styles/leadassign.css";

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
  const totalPages = Math.ceil(totalLeads / leadsPerPage);
  const paginatedLeads = leads;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("adminSidebarExpanded") === "false"
  );

  const { theme } = useContext(ThemeContext);
  const {
    reassignLead,
    fetchLeadsAPI,
    fetchExecutivesAPI,
    assignLeadAPI,
    createFreshLeadAPI,
    createLeadAPI,
  } = useApi();

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
    fetchLeads();
    fetchExecutives();
  }, [currentPage, leadsPerPage]);

  const fetchLeads = async () => {
    try {
      const offset = (currentPage - 1) * leadsPerPage;
      const data = await fetchLeadsAPI(leadsPerPage, offset);
      setLeads(data.leads);
      setTotalLeads(data.pagination.total);
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

      const clientLeadId = lead.clientLeadId || lead.id;
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
        previousAssignedTo: lead.previousAssignedTo
      };

      try {
        let finalLeadId = leadId;

        const createdLead = await createLeadAPI(leadPayload);
        if (!createdLead?.id) throw new Error("Lead creation failed");

        finalLeadId = createdLead.id;

        if (!lead.assignedToExecutive) {
          await assignLeadAPI(Number(finalLeadId), executive.username);
        } else {
          if (lead.previousAssignedTo) {
            alert("❌ Lead ID was already reassigned. Cannot reassign again.");
            failCount++;
            continue;
          } else {
            await reassignLead(Number(lead.id), executive.username);
          }
        }

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
    setSelectedLeads([]);
    setSelectedExecutive("");

    if (successCount > 0 && failCount === 0) {
      alert("✅ Leads assigned successfully.");
    } else if (successCount > 0 && failCount > 0) {
      alert(`⚠️ ${successCount} lead(s) assigned, ${failCount} failed. Check console.`);
    } else {
      alert("❌ Leads was already reassigned.");
    }
  };

  return (
    <div className={`f-lead-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <SidebarToggle />
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

            <select className="lead-type-dropdown">
              <option value="">-- Fresh Type --</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>

            <select className="lead-status-dropdown">
              <option value="">-- Lead Status --</option>
              <option value="followup">Follow-Up</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
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
                      <span>Phone No: {lead.phone}</span>
                      <span>Education: {lead.education}</span>
                      {expandedLeads[lead.id] && (
                        <>
                          <span>Experience: {lead.experience}</span>
                          <span>State: {lead.state}</span>
                          <span>Country: {lead.country}</span>
                          <span>DOB: {lead.dob || "N/A"}</span>
                          <span>Lead Assign Date: {lead.leadAssignDate || "N/A"}</span>
                          <span>Country Preference: {lead.countryPreference || "N/A"}</span>
                        </>
                      )}
                      <button className="see-more-btn" onClick={() => toggleExpandLead(lead.id)}>
                        {expandedLeads[lead.id] ? "See less..." : "See more..."}
                      </button>
                    </div>
                  </div>
                  <div className="lead-source">{lead.source}</div>
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
