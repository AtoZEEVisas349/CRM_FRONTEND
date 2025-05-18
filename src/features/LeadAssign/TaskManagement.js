import React, { useEffect, useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import { ThemeContext } from "../../features/admin/ThemeContext";
import SidebarToggle from "../admin/SidebarToggle";

const TaskManagement = () => {
  const [fetchedLeads, setFetchedLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [expandedLeads, setExpandedLeads] = useState({});
  const [leadsPerPageLimit, setLeadsPerPageLimit] = useState(10); // how many leads to load total
  const [currentPage, setCurrentPage] = useState(1); // for pagination view
  const { theme } = useContext(ThemeContext);

  const {
    fetchLeadsAPI,
    fetchExecutivesAPI,
    assignLeadAPI,
    createFreshLeadAPI,
    createLeadAPI,
  } = useApi();

  const leadsPerPageDisplay = 10;
  const totalLeads = fetchedLeads.length;
  const totalPages = Math.ceil(totalLeads / leadsPerPageDisplay);
  const paginatedLeads = fetchedLeads.slice(
    (currentPage - 1) * leadsPerPageDisplay,
    currentPage * leadsPerPageDisplay
  );

  const [sidebarState, setSidebarState] = useState(
    localStorage.getItem("adminSidebarExpanded") === "true" ? "expanded" : "collapsed"
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

  useEffect(() => {
    fetchLeads();
    fetchExecutives();
  }, [leadsPerPageLimit]);

  const fetchLeads = async () => {
    try {
      const data = await fetchLeadsAPI(leadsPerPageLimit, 0); // load entire chunk
      setFetchedLeads(data.leads);
      setCurrentPage(1);
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

  const handleLeadLimitChange = (value) => {
    setLeadsPerPageLimit(Number(value));
    setCurrentPage(1);
    setSelectedLeads([]); // optionally reset selection
  };

  const handleExecutiveChange = (event) => {
    setSelectedExecutive(event.target.value);
  };

  const handleLeadSelection = (leadId) => {
    const id = String(leadId);
    setSelectedLeads((prev) => {
      const set = new Set(prev);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return Array.from(set);
    });
  };

  const toggleSelectAll = () => {
    const currentPageIds = paginatedLeads.map((l) => String(l.id));
    const allSelected = currentPageIds.every((id) => selectedLeads.includes(id));

    if (allSelected) {
      setSelectedLeads((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedLeads((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const toggleExpandLead = (leadId) => {
    setExpandedLeads((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
  };

  const assignLeads = async () => {
    if (!selectedExecutive) return alert("⚠️ Please select an executive.");
    if (selectedLeads.length === 0) return alert("⚠️ Please select at least one lead.");

    const executive = executives.find((e) => String(e.id) === selectedExecutive);
    if (!executive?.username) return alert("⚠️ Invalid executive selected.");

    let success = 0;
    let fail = 0;

    for (const leadId of selectedLeads) {
      const lead = fetchedLeads.find((l) => String(l.id) === leadId);
      if (!lead) {
        fail++;
        continue;
      }

      const clientLeadId = lead.clientLeadId || lead.id;
      const phone = String(lead.phone).replace(/[eE]+([0-9]+)/gi, "");

      const payload = {
        name: lead.name,
        email: lead.email || "default@example.com",
        phone,
        source: lead.source || "Unknown",
        clientLeadId: Number(clientLeadId),
        assignedToExecutive: executive.username,
      };

      try {
        const createdLead = await createLeadAPI(payload);
        if (!createdLead?.id) throw new Error("Lead not created");

        await assignLeadAPI(Number(leadId), executive.username);

        await createFreshLeadAPI({
          leadId: createdLead.id,
          name: createdLead.name,
          email: createdLead.email,
          phone: String(createdLead.phone),
          assignedTo: executive.username,
          assignedToId: executive.id,
          assignDate: new Date().toISOString(),
        });

        success++;
      } catch (err) {
        console.error(`❌ Error assigning lead ${leadId}:`, err);
        fail++;
      }
    }

    setSelectedLeads([]);
    setSelectedExecutive("");
    fetchLeads(); // reload updated leads

    if (success && !fail) alert("✅ Leads assigned successfully.");
    else if (success && fail) alert(`⚠️ ${success} assigned, ${fail} failed.`);
    else alert("❌ Assignment failed.");
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
            <select value={leadsPerPageLimit} onChange={(e) => handleLeadLimitChange(e.target.value)}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <div className="header-sort-filter">
              <button onClick={toggleSelectAll}>Select/Unselect All Leads</button>
              <button onClick={assignLeads}>Assign</button>
              <button onClick={() => setSelectedLeads([])}>Reset</button>
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                Selected: {selectedLeads.length}
              </span>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="leads-table">
            <div className="leads-header">
              <span>All customers ({totalLeads})</span>
              <span className="source-header">Source</span>
              <span className="assign-header">Assigned To</span>
            </div>

            {paginatedLeads.map((lead) => (
              <div key={lead.id} className="lead-row">
                <div className="lead-details">
                  <input
                    type="checkbox"
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

            {totalPages > 1 && (
              <div className="pagination-controls">
                <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
                <span className="page-indicator">Page {currentPage} of {totalPages}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskManagement;
