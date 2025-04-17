import React, { useEffect, useState } from "react";
import "../../styles/freshlead.css";
import { useApi } from "../../context/ApiContext";

function FreshLead() {
  const { fetchAssignedLeads, executiveInfo, fetchExecutiveData, executiveLoading } = useApi();
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("✅ FreshLead component mounted");

  useEffect(() => {
    const loadLeads = async () => {
      // Ensure that executiveInfo is loaded before fetching leads
      if (!executiveInfo?.username) {  // Ensure executiveInfo has username
        if (!executiveLoading) {
          console.log("🔄 Fetching executive data...");
          await fetchExecutiveData(); // Fetch executive data if not available
        }
        return; // Exit early if username is missing
      }

      try {
        setLoading(true);
        console.log("👉 Calling fetchAssignedLeads...");
        const data = await fetchAssignedLeads(executiveInfo.username); // Pass the executive's username
        console.log("✅ Received leads:", data);
        setLeadsData(data);
      } catch (err) {
        console.log("❌ Failed to fetch leads:", err);
        setError("Failed to load leads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, [fetchAssignedLeads, executiveInfo?.username, executiveLoading, fetchExecutiveData]);

  if (executiveLoading) {
    return <p>Loading executive data...</p>; // Loading state while executive data is being fetched
  }

  return (
    <div className="fresh-leads-main-content">
      {loading && <p className="loading-text">Loading leads...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && (
        <div className="fresh-leads-table-container">
          <table className="fresh-leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Add follow-ups</th>
                <th>Status</th>
                <th>Call</th>
              </tr>
            </thead>
            <tbody>
              {leadsData.length > 0 ? (
                leadsData.map((lead, index) => (
                  <tr key={index}>
                    <td>
                      <div className="fresh-leads-name">
                        <div className="freshlead-icon">👤</div>
                        <div className="fresh-lead-detail">
                          <div>{lead.name}</div>
                          <div className="fresh-leads-profession">{lead.profession}</div>
                        </div>
                      </div>
                    </td>
                    <td>{lead.phone}</td>
                    <td>{lead.email}</td>
                    <td>
                      <button className="followup-badge">
                        Add Follow Up ✏ {lead.followUp}
                      </button>
                    </td>
                    <td>
                      <input type="radio" name="leadStatus" className="status-radio" />
                    </td>
                    <td>
                      <button className="fresh-leads-call-button">📞</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-leads-text">No assigned leads available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FreshLead;
