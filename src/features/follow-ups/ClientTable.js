import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext"; // Adjust path if needed

const ClientTable = ({ filter = "All Follow Ups" }) => {
  const { followUps, fetchAllFollowUps, followUpLoading } = useApi();
  const clients = Array.isArray(followUps) ? followUps : []; // Ensure followUps is an array

  const [tableHeight, setTableHeight] = useState("500px");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllFollowUps(); // Centralized fetch
  }, [fetchAllFollowUps]); // Only call this once when the component mounts

  // Log followUps to check if data is available
  console.log("Fetched FollowUps:", followUps);

  // Apply filter for "Interested" or "Non-Interested" only
  const filteredClients = clients.filter(client => {
    if (filter === "Interested") {
      return client.follow_up_type === "interested"; // Filter for interested clients
    } else if (filter === "Non-Interested") {
      return client.follow_up_type !== "interested"; // Filter for non-interested clients
    }
    // If filter is "All Follow Ups", show all follow ups
    return true;
  });

  console.log("Filtered Clients:", filteredClients); // Log filtered result

  useEffect(() => {
    const updateTableHeight = () => {
      const windowHeight = window.innerHeight;
      const tablePosition =
        document.querySelector(".table-container")?.getBoundingClientRect().top || 0;
      const footerHeight = 40;
      const availableHeight = windowHeight - tablePosition - footerHeight;
      const newHeight = Math.max(300, availableHeight);
      setTableHeight(`${newHeight}px`);
    };

    updateTableHeight();
    window.addEventListener("resize", updateTableHeight);
    return () => window.removeEventListener("resize", updateTableHeight);
  }, []);

  const handleEdit = (clientName) => {
    navigate(`/clients/${encodeURIComponent(clientName)}`);
  };

  return (
    <div
      className="table-container responsive-table-wrapper"
      style={{
        maxHeight: tableHeight,
        overflowX: "auto",
        overflowY: "auto",
        position: "relative",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <table className="client-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#2c2c2c",
              zIndex: 10,
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <th style={{ color: "white" }}>Name</th>
            <th style={{ color: "white" }}>Phone</th>
            <th style={{ color: "white" }}>Email</th>
            <th style={{ color: "white" }}>Add follow up</th>
            <th style={{ color: "white" }}>Status</th>
            <th style={{ color: "white" }}>Call</th>
          </tr>
        </thead>
        <tbody>
          {followUpLoading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                Loading...
              </td>
            </tr>
          ) : (
            filteredClients.map((client, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td>
                  <div className="client-name" style={{ display: "flex", alignItems: "center" }}>
                    <div
                      className="user-icon-bg"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: "#f1f1f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10,
                      }}
                    >
                      <div className="user-icon">👤</div>
                    </div>
                    <div>
                      <strong>{client.freshLead?.name || "No Name"}</strong>
                      <p className="client-profession" style={{ margin: 0, fontSize: 12, color: "#777" }}>
                        {client.freshLead?.profession || "No Profession"}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  {client.freshLead?.phone ? client.freshLead.phone.toString() : "No Phone"}
                </td>
                <td>{client.freshLead?.email || "N/A"}</td>
                <td>
                  <span className="followup-badge">{client.follow_up_type}</span>
                  <span
                    className="edit-icon"
                    onClick={() => handleEdit(client.freshLead?.name)}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    ✏
                  </span>
                </td>
                <td>⚪</td>
                <td>📞</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
