import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/freshlead.css";
import { useApi } from "../../context/ApiContext";
import { useExecutiveActivity } from "../../context/ExecutiveActivityContext";

function FreshLead() {
  const {
    fetchAssignedLeads,
    executiveInfo,
    fetchExecutiveData,
    executiveLoading,
  } = useApi();
  const { leadtrack } = useExecutiveActivity();
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const executiveId = userData?.id;
    if (executiveId) {
      leadtrack(executiveId);
    } else {
      console.error("ExecutiveId not found");
    }
  }, []);

  useEffect(() => {
    const loadLeads = async () => {
      if (!executiveInfo?.username) {
        if (!executiveLoading) {
          await fetchExecutiveData();
        }
        return;
      }

      try {
        setLoading(true);
        const data = await fetchAssignedLeads(executiveInfo.username);
        setLeadsData(data);
      } catch (err) {
        setError("Failed to load leads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, [fetchAssignedLeads, executiveInfo?.username, executiveLoading, fetchExecutiveData]);

  const totalPages = Math.ceil(leadsData.length / itemsPerPage);
  const currentLeads = leadsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEditClient = (clientName) => {
    navigate(`/clients/${encodeURIComponent(clientName)}`);
  };

  if (executiveLoading) {
    return <p>Loading executive data...</p>;
  }

  return (
    <div className="fresh-leads-main-content">
      {loading && <p className="loading-text">Loading leads...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && (
        <>
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
                {currentLeads.length > 0 ? (
                  currentLeads.map((lead, index) => (
                    <tr key={index}>
                      <td>
                        <div className="fresh-leads-name">
                          <div className="fresh-lead-detail">
                            <div>{lead.name}</div>
                            <div className="fresh-leads-profession">
                              {lead.profession}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{lead.phone}</td>
                      <td>{lead.email}</td>
                      <td>
                        <button
                          className="followup-badge"
                          onClick={() => handleEditClient(lead.name)}
                        >
                          Add Follow Up ✏ {lead.followUp}
                        </button>
                      </td>
                      <td>
                        <input
                          type="radio"
                          name={`leadStatus-${index}`}
                          className="status-radio"
                        />
                      </td>
                      <td>
                        <button className="fresh-leads-call-button">📞</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-leads-text">
                      No assigned leads available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="fresh-pagination">
            <button
              className="fresh-pagination-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              « Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="fresh-pagination-btn" // use the correct class here
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next »
            </button>
          </div>

        </>
      )}
    </div>
  );
}

export default FreshLead;
