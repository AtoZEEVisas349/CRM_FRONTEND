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
    fetchCustomers,
    customers,
    setCustomers,
    handleImportConvertedClients,
    convertedClients,
    fetchConvertedClients,
    convertedLoading,
    convertedError,
    setConvertedClients, // Assuming you have this setter exposed from context
  } = useProcessService();

  const navigate = useNavigate();

  // Map clients to add id property from _id if needed
  // This assumes fetchConvertedClients only fetches raw data, so mapping here is safe
  // Alternatively, do this mapping inside fetchConvertedClients itself
  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        // If data returned from fetchConvertedClients is the raw clients array
        if (data && Array.isArray(data)) {
          const mappedClients = data.map((client) => ({
            ...client,
            id: client.id || client._id, // prefer id, fallback to _id
          }));
          setCustomers(mappedClients);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching clients:", err);
      });
  }, []);

  // Navigate to dashboard with correct client ID
    const handleClick = async () => {
    try {
      const result = await handleImportConvertedClients();
     
      console.log("Errors:", result.errors);
    } catch (error) {
      alert("Failed to import: " + error.message);
    }
  };
  const handleCardClick = (client) => {
    navigate(`/process/client/dashboard/${client.id}`, { state: { client } });
  };

  return (
    <div className="all-client-container">
      <div className="all-client-header">
        <h1>All Clients</h1>
      </div>

      {/* {convertedLoading ? (
        <p className="client-count">Loading clients...</p>
      ) : convertedError ? (
        <p className="client-count" style={{ color: "red" }}>
          {convertedError}
        </p>
      ) : ( */}
        <>
          <div className="client-count-row">
            <p className="client-count">Total clients: {customers.length}</p>
            <button
              className="new-client-btn"
              onClick={handleClick}
            >
              + New
            </button>
          </div>
          <p className="client-instruction">
            👉 Click on any client card below to view their dashboard.
          </p>
        </>
      {/* )} */}

      <div className="client-list">
        {customers.map((client) => (
          <div
            className="client-card"
            key={client.id}
            onClick={() => handleCardClick(client)}
            style={{ cursor: "pointer" }}
          >
            <div className="client-item">
              <FaUser className="client-icon" />
              <span className="client-text">{client.fullName}</span>
            </div>
            {/* <div className="client-item">
              <FaPhoneAlt className="client-icon" />
              <span className="client-text">{client.phone}</span>
            </div> */}
            <div className="client-item">
              <FaEnvelope className="client-icon" />
              <span className="client-text">{client.email || "No Email"}</span>
            </div>
            <div className="client-item">
              <FaCalendarAlt className="client-icon" />
              <span className="client-text">
                {new Date(client.last_contacted || client.createdAt).toLocaleDateString("en-GB")}
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