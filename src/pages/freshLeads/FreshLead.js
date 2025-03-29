import React, { useEffect, useState } from "react";
import "../../styles/freshlead.css";
import { fetchAssignedLeads } from "../../api/apiService"; 

function FreshLead() {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        const data = await fetchAssignedLeads(); 
        setLeadsData(data);
      } catch (err) {
        setError("Failed to load leads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

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
              <th>Add follow-ups</th>  {/* Updated this */}
              <th>Status</th>  {/* Updated this */}
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
                  {/* Add follow-ups as button-like elements */}
                  <td>
                    <button className="followup-badge">
                     Add Follow Up ✏ {lead.followUp}
                    </button>
                  </td>
                  {/* Status as a radio button */}
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
