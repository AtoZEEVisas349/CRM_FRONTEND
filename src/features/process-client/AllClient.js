import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaGlobeAsia,
} from "react-icons/fa";
import { useProcessService } from "../../context/ProcessServiceContext"; // ✅ use context

const AllClient = () => {
  const {
    convertedClients,
    fetchConvertedClients,
    convertedLoading,
    convertedError,
  } = useProcessService();
  const navigate = useNavigate();
  const handleCardClick = (client) => {
    navigate("/process/client/create-client", { state: { client } });
  };
  useEffect(() => {
    fetchConvertedClients().catch((err) => {
      console.error("❌ Error fetching clients:", err);
    });
  }, []);

  return (
    <div className="all-client-container">
      <div className="all-client-header">
        <h1>All Clients</h1>
      </div>

      {convertedLoading ? (
        <p className="client-count">Loading clients...</p>
      ) : convertedError ? (
        <p className="client-count" style={{ color: "red" }}>
          {convertedError}
        </p>
      ) : (
<>
<div className="client-count-row">
  <p className="client-count">Total clients: {convertedClients.length}</p>
  <button className="new-client-btn" onClick={() => navigate("/process/client/create-client")}>
    + New
  </button>
</div>    <p className="client-instruction">
      👉 Click on any client card below to auto-fill their information in the Create Client form.
    </p>
  </>      )}

      <div className="client-list">
      {convertedClients.map((client) => (
  <div
    className="client-card"
    key={client.id}
    onClick={() => handleCardClick(client)}
    style={{ cursor: "pointer" }}
  >
    <div className="client-item">
      <FaUser className="client-icon" />
      <span className="client-text">{client.name}</span>
    </div>
    <div className="client-item">
      <FaPhoneAlt className="client-icon" />
      <span className="client-text">{client.phone}</span>
    </div>
    <div className="client-item">
      <FaEnvelope className="client-icon" />
      <span className="client-text">{client.email || "No Email"}</span>
    </div>
    <div className="client-item">
      <FaCalendarAlt className="client-icon" />
      <span className="client-text">
        {new Date(client.last_contacted || client.created_at).toLocaleDateString("en-GB")}
      </span>
    </div>
    <div className="client-item">
      <FaGlobeAsia className="client-icon" />
      <span className="client-text">{client.country || "No Country"}</span>
    </div>
  </div>
))}
      </div>
    </div>
  );
};

export default AllClient;
