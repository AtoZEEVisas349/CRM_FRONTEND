import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/freshlead.css";
import { useApi } from "../../context/ApiContext"; // Import context
import { useExecutiveActivity } from "../../context/ExecutiveActivityContext";

function FreshLead() {
  const {
    fetchFreshLeadsAPI, // Import fetchFreshLeadsAPI from context
    executiveInfo,
    fetchExecutiveData,
    executiveLoading,
    createFollowUp, // Import createFollowUp from context
  } = useApi();
  const { leadtrack } = useExecutiveActivity();
  const [leadsData, setLeadsData] = useState([]); // ✅ should be an array
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
        const data = await fetchFreshLeadsAPI();        
        if (Array.isArray(data)) {
          setLeadsData(data);
        } else if (data && Array.isArray(data.data)) {
          setLeadsData(data.data);
        } else {
          console.error("❌ leadsData is not an array:", data);
          setError("Invalid data format received for leads.");
        }
      } catch (err) {
        setError("Failed to load leads. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    loadLeads();
  // ✅ Removed functions from deps
  }, [executiveInfo?.username, executiveLoading]);  

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

  // Handle follow-up creation
  const handleAddFollowUp = async (lead, clientName) => {
    try {  
      // Ensure freshLeadId is extracted correctly from the lead object
      const freshLeadId = lead.id;  
      if (!freshLeadId) {
        throw new Error("Valid freshLeadId not found in lead object.");
      }
  
      const userData = JSON.parse(localStorage.getItem("user"));
      const executiveId = userData?.id;
  
      if (!executiveId) {
        throw new Error("Executive ID is missing.");
      }
  
      const now = new Date();
      const followUpData = {
        connect_via: "Call", 
        follow_up_type: "interested", 
        interaction_rating: "Hot", 
        reason_for_follow_up: "Lead interested in our product", 
        follow_up_date: now.toISOString().split("T")[0],
        follow_up_time: now.toTimeString().split(" ")[0],
        fresh_lead_id: freshLeadId, // ✅ Ensure correct freshLeadId is used
      };
  
      const followUpResponse = await createFollowUp(followUpData);
    if (followUpResponse) {
      // Filter the data to only include the required fields
      const filteredClientData = {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        altPhone: lead.altPhone,
        education: lead.education,
        experience: lead.experience,
        state: lead.state,
        dob: lead.dob,
        country: lead.country,
        assignDate: lead.assignDate,
      };

      // Navigate to the ClientDetail page with the filtered data
      navigate(`/clients/${encodeURIComponent(clientName)}`, {
        state: { client: filteredClientData }
      });
    } else {
      console.error("❌ Follow-up creation failed.");
    }
  } catch (error) {
    console.error("❌ Error creating follow-up:", error);
    if (error.response) {
      console.log("API Error response data:", error.response.data);
    }
  }
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
                  currentLeads.map((lead, index) => {
                    return (
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
                            onClick={() => handleAddFollowUp(lead, lead.name)}  // Pass the whole lead object here
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
                    );
                  })
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
              className="fresh-pagination-btn"
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
