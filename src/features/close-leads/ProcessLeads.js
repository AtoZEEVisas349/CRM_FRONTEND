import React, { useContext, useEffect, useState } from "react";
import { useApi } from "../../context/ApiContext";
import useCopyNotification from "../../hooks/useCopyNotification";
import { SearchContext } from "../../context/SearchContext";
import { FaPlus } from "react-icons/fa";
import { useLoading } from "../../context/LoadingContext"; // ✅ Add this
import LoadingSpinner from "../spinner/LoadingSpinner"; // ✅ Import spinner
import { useProcessService } from "../../context/ProcessServiceContext";
const ProcessLeads = ({searchQuery}) => {
  const { closeLeads, fetchAllCloseLeadsAPI, closeLeadsLoading,
    fetchNotifications,
    createCopyNotification,
    fetchFollowUpHistoriesAPI,
   } = useApi();
   const {getAllFinalStages, fetchCustomers, customers, setCustomers,getProcessFollowup} =useProcessService();
  const {activePage}= useContext(SearchContext);
  
  // New state for follow-up history modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [followUpHistories, setFollowUpHistories] = useState([]);
  const [followUpHistoriesLoading, setFollowUpHistoriesLoading] = useState(false);
  const { showLoader, hideLoader, isLoading, loadingText } = useLoading(); // ✅ destructure
   const[historyData,setHistoryData]=useState();
   useCopyNotification(createCopyNotification, fetchNotifications);
  const leadsArray = closeLeads?.data || [];
 // ✅ apply search only if this page is active
 const filteredLeads =
 activePage === "close-leads"
   ? leadsArray.filter((lead) =>
       [lead.name, lead.phone, lead.email]
         .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
     )
   : leadsArray;

  // Handle viewing follow-up history for a lead
 
 const handleViewHistory = async (lead) => {
  setSelectedLead(lead);
  setFollowUpHistoriesLoading(true);

  try {
    // Call the old API (optional – if you still want to fetch it)
    const rawData = await fetchFollowUpHistoriesAPI();

    const leadId = lead.fresh_lead_id || lead.freshLead?.id || lead.lead?.id || lead.id;

    const filtered = Array.isArray(rawData)
      ? rawData.filter(item => {
          const historyLeadId = item.fresh_lead_id || item.followUp?.fresh_lead_id;
          return String(historyLeadId) === String(leadId);
        })
      : [];

    const parsed = filtered.map((item) => ({
      date: item.follow_up_date || item.followUp?.follow_up_date || "N/A",
      time: item.follow_up_time || item.followUp?.follow_up_time || "N/A",
      reason: item.reason_for_follow_up || item.followUp?.reason_for_follow_up || "No reason provided",
      tags: [
        item.connect_via || item.followUp?.connect_via || "",
        item.follow_up_type || item.followUp?.follow_up_type || "",
        item.interaction_rating || item.followUp?.interaction_rating || "",
      ].filter(Boolean),
    }));

    setFollowUpHistories(parsed);

    // ✅ Also call getProcessFollowupHistory using lead.id
    const id = lead.id || lead.fresh_lead_id || lead.freshLead?.id || lead.lead?.id;
    if (id) {
      const result = await getProcessFollowup(lead.fresh_lead_id );
      console.log(result.data);
      console.log(historyData);
      setHistoryData(result.data || []);
    }

  } catch (error) {
    console.error("Failed to load follow-up history:", error);
 
    setHistoryData([]);
  } finally {
    setFollowUpHistoriesLoading(false);
  }
};

  // Handle closing the modal
  const handleCloseModal = () => {
    setSelectedLead(null);
  };
 useEffect(() => {
        fetchCustomers()
          .then((data) => {
            if (data && Array.isArray(data)) {
             const mappedClients = data
      .filter((client) => client.status === "under_review")
    
              setCustomers(mappedClients);
            }
          })
          .catch((err) => console.error("❌ Error fetching clients:", err));
          console.log(customers)
      }, []);
  const clients=customers.filter((client) => client.status === "approved")
  return (
    <>
      <div className="close-leads-page">
      {isLoading && (
        <div className="page-wrapper" style={{ position: "relative" }}>
          <LoadingSpinner text={loadingText || "Loading Final Stage Leads..."} />
        </div>
      )}
        <h2 className="c-heading">Final Stage Leads</h2>
        <div className="leads_page_wrapper">
  <h4 className="Total_leads" style={{marginBottom:"20px"}}>Total Final Stage leads: {clients.length}</h4>
  {closeLeadsLoading ? (
    <p>Loading Final Stage leads...</p>
  ) : clients.length > 0 ? (
    <div className="leads-table-wrapper">
      <table className="rejected-leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Follow-up</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((lead, index) => (
            <tr key={index}>
              <td>{lead.fullName || "Unnamed Lead"}</td>
              <td>{lead.phone}</td>
              <td>{lead.email || "No Email"}</td>
              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="follow-history-btn"
                  onClick={() => handleViewHistory(lead)}
                  title="View Follow-up History"
                >
                  <span className="history-icon"><FaPlus /></span> Follow History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No final stage leads found.</p>
  )}
</div>

      </div>

      {/* Follow-up History Modal */}
      {selectedLead && (
        <div className="h-followup-modal-overlay">
          <div className="h-followup-modal">
            <div className="h-followup-modal-header">
              <h3>{selectedLead.fullName || "Unnamed Lead"}</h3>
              <button className="h-close-btn" onClick={handleCloseModal}>×</button>
            </div>

            <div className="h-followup-modal-body">
              {followUpHistoriesLoading ? (
                <p>Loading history...</p>
              ) : historyData.length > 0 ? (
                historyData.map((entry, idx) => (
                  <div className="h-followup-entry-card" key={idx}>
                    <div className="h-followup-date">
                      <span>{entry.follow_up_date}</span>
                      <span>{entry.follow_up_time}</span>
                      {idx === 0 && <span className="h-latest-tag">LATEST</span>}
                    </div>
                    <div className="h-followup-tags">
                      {entry.tags?.map((tag, i) => (
                        <button key={i} className={`h-tag ${tag === "Hot" ? "hot" : ""}`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="h-followup-reason-box">
                      <p>Follow-Up Reason</p>
                      <div className="h-reason-text">{entry.comments}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No follow-up history found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProcessLeads;