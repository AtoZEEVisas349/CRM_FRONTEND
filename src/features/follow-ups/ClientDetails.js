import React, { useState, useEffect } from "react";
import { useApi } from "../../context/ApiContext";

const ClientDetails = ({ selectedClient, onClose }) => {
  const { fetchFollowUpHistoriesAPI } = useApi();
  const [latestFollowUp, setLatestFollowUp] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedClient) {
      const freshLeadId = selectedClient.freshLead?.id || selectedClient.fresh_lead_id;
      if (freshLeadId) {
        setLoading(true);
        fetchFollowUpHistoriesAPI(freshLeadId)
          .then((histories) => {
            if (histories && Array.isArray(histories) && histories.length > 1) {
              setLatestFollowUp(histories[1]); // Second most recent follow-up
            } else {
              setLatestFollowUp(null);
            }
          })
          .catch((error) => {
            console.error("Error fetching follow-up histories:", error);
            setLatestFollowUp(null);
          })
          .finally(() => setLoading(false));
      } else {
        console.warn("No valid freshLeadId found for client:", selectedClient);
        setLatestFollowUp(null);
      }
    } else {
      setLatestFollowUp(null);
    }
  }, [selectedClient]);

  if (!selectedClient) {
    return (
      <div className="client-details-container">
        <h4 className="client-details-title">Select a client to view details</h4>
      </div>
    );
  }

  return (
    <div className="client-details-container">
      <h3 className="client-details-title">Clients Details</h3>
      <div className="client-details">
        <div className="client-info">
          <div className="user-icon-bg">
            <div className="user-icon">👤</div>
          </div>
          <div className="client-text">
            <h4>{selectedClient.freshLead?.name || "No Name"}</h4>
            <p>{selectedClient.freshLead?.profession || "No Profession"}</p>
            <div className="lead-info">
              <span className="lead-badge">Lead</span>
            </div>
          </div>
        </div>
        <div className="last-followup">
          <h5>Last Follow-up</h5>
          {loading ? (
            <p>Loading...</p>
          ) : latestFollowUp ? (
            <p>{latestFollowUp.reason_for_follow_up || "No description available."}</p>
          ) : (
            <p>No previous follow-up available.</p>
          )}
        </div>
        <div className="close-btn" onClick={onClose}>✖</div>
      </div>
    </div>
  );
};

export default ClientDetails;