import React, { useEffect, useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import { ThemeContext } from "../../features/admin/ThemeContext";
import SidebarToggle from "../admin/SidebarToggle";

const TaskManagement = () => {
  const [leads, setLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [expandedLeads, setExpandedLeads] = useState({});
  const { theme} = useContext(ThemeContext);
  const {
    fetchLeadsAPI,
    fetchExecutivesAPI,
    assignLeadAPI,
    createFreshLeadAPI,
    createLeadAPI,
  } = useApi();

  const [sidebarState, setSidebarState] = useState(
    localStorage.getItem("adminSidebarExpanded") === "true" ? "expanded" : "collapsed"
  );

  const leadsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0); // New state for total leads from backend
  const totalPages = Math.ceil(totalLeads / leadsPerPage); // Use totalLeads instead of leads.length

  const paginatedLeads = leads; // Since backend handles pagination, leads already represent the current page

  useEffect(() => {
    const updateSidebarState = () => {
      const isExpanded = localStorage.getItem("adminSidebarExpanded") === "true";
      setSidebarState(isExpanded ? "expanded" : "collapsed");
    };

    window.addEventListener("sidebarToggle", updateSidebarState);
    updateSidebarState();

    return () => window.removeEventListener("sidebarToggle", updateSidebarState);
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchExecutives();
  }, [currentPage]); // Re-fetch leads when currentPage changes

  const fetchLeads = async () => {
    try {
      const offset = (currentPage - 1) * leadsPerPage; // Calculate offset based on current page
      const data = await fetchLeadsAPI(leadsPerPage, offset); // Pass limit and offset
      setLeads(data.leads); // Set the leads for the current page
      setTotalLeads(data.pagination.total); // Set the total leads from backend
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

  const toggleExpandLead = (leadId) => {
    setExpandedLeads((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
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
        selectedLeads.map(async (leadId) => {
          const lead = leads.find((l) => String(l.id) === leadId);
          if (!lead) return;

          const clientLeadId = lead.clientLeadId || lead.id;
          if (!clientLeadId) {
            console.warn("❌ Missing clientLeadId for lead:", lead.name);
            return;
          }

          const phone = String(lead.phone).replace(/[eE]+([0-9]+)/gi, '');

          if (!executive.username) {
            console.warn("❌ Missing executive username.");
            return;
          }

          const leadPayload = {
            name: lead.name,
            email: lead.email || "defaultEmail@example.com",
            phone: phone,
            source: lead.source,
            clientLeadId: Number(clientLeadId),
            assignedToExecutive: executive.username,
          };

          try {
            const createdLead = await createLeadAPI(leadPayload);
            if (!createdLead || !createdLead.id) {
              console.error("❌ Lead creation failed or returned invalid data.");
              return;
            }

            await assignLeadAPI(leadId, executive.id, executive.username);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const freshLeadPayload = {
              leadId: createdLead.id,
              name: createdLead.name,
              email: createdLead.email,
              phone: String(createdLead.phone),
              assignedTo: executive.username,
              assignedToId: executive.id,
              assignDate: new Date().toISOString(),
            };

            try {
              await createFreshLeadAPI(freshLeadPayload);
            } catch (err) {
              console.error("❌ Error creating fresh lead:", err);
            }
          } catch (err) {
            console.error("❌ Error creating lead via createLeadAPI:", err);
          }
        })
      );

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          selectedLeads.includes(String(lead.id))
            ? { ...lead, assignedToExecutive: executive.username }
            : lead
        )
      );

      setSelectedLeads([]);
      setSelectedExecutive("");
      alert("Leads have been assigned successfully!");
    } catch (err) {
      console.error("❌ Error during lead assignment process:", err);
    }
  };

  return (
    <>
      <SidebarToggle />
      <div className={`leads-dashboard ${sidebarState}`} data-theme={theme}>
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
              <span>All customers ({totalLeads})</span> {/* Update to show totalLeads */}
              <span className="source-header">Source</span>
              <span className="assign-header">Assigned To</span>
            </div>
            {paginatedLeads.map((lead) => (
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
                    <button
                      className="see-more-btn"
                      onClick={() => toggleExpandLead(lead.id)}
                      style={{
                        marginTop: "5px",
                        color: "#007bff",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {expandedLeads[lead.id] ? "See less..." : "See more..."}
                    </button>
                  </div>
                  <div className="lead-source">{lead.source}</div>
                  <div className="lead-assign">
                    {lead.assignedToExecutive || "Unassigned"}
                  </div>
                  <div className="lead-actions">
                    <button className="edit">Edit</button>
                    <button className="delete">Delete</button>
                    <button className="follow-up">Follow Up</button>
                    <button className="whatsapp">WhatsApp Connect</button>
                  </div>
                </div>
              </div>
            ))}

            {leads.length > 0 && (
              <div className="pagination-controls">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
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
    </>
  );
};

export default TaskManagement;
