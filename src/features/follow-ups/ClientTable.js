import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const ClientTable = ({ filter = "All Follow Ups" }) => {
  const { followUps, getAllFollowUps, followUpLoading } = useApi();
  const clients = Array.isArray(followUps?.data) ? followUps.data : [];
  const [activePopoverIndex, setActivePopoverIndex] = useState(null);
  const [tableHeight, setTableHeight] = useState("500px");
  const navigate = useNavigate();

  useEffect(() => {
    getAllFollowUps(); // Fetch on mount
  }, []);

// Filter clients based on follow_up_type
const filteredClients = clients.filter((client) => {
  const type = (client.follow_up_type || "").toLowerCase().trim();

  if (filter === "Interested") {
    return type === "interested"; // only match by type
  } else if (filter === "Not Interested") {
    return type === "not interested";
  } else {
    return true; // All Follow Ups
  }
});
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

  // Navigate to follow-up detail
  const handleEdit = (client) => {
    const freshLeadId = client.freshLead?.id || client.id;
    const leadData = {
      ...client.freshLead,
      fresh_lead_id: freshLeadId,
      followUpId: client.id,
    };

    navigate(`/clients/${encodeURIComponent(client.id)}/details`, {
      state: {
        client: leadData,
        createFollowUp: false,
        from: "followup",
      },
    });
  };

  // Dynamic status badge color
  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "follow-up":
        return "#e0f7fa"; // light blue
      case "converted":
        return "#c8e6c9"; // light green
      case "not interested":
        return "#ffcdd2"; // light red
      default:
        return "#f0f0f0"; // neutral gray
    }
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
                      <p style={{ margin: 0, fontSize: 12, color: "#777" }}>
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
                  <span
                    className="followup-badge"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      backgroundColor: "#f0f0f0",
                      fontSize: "12px",
                      color: "#555",
                      marginLeft:"10px",
                    }}
                  >
                    {(filter === "Interested" && (client.follow_up_type || "").toLowerCase() === "interested") ||
                    (filter === "Not Interested" && (client.follow_up_type || "").toLowerCase() === "not interested")
                      ? client.follow_up_type
                      : ""}
                  </span>
                  <span
                    className="edit-icon"
                    onClick={() => handleEdit(client)}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    ✏
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                      backgroundColor: getStatusColor(client.clientLeadStatus),
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#333",
                      textTransform: "capitalize",
                    }}
                  >
                    {client.clientLeadStatus || "N/A"}
                  </span>
                </td>
                <td className="call-cell">
                  <button
                    className="call-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopoverIndex(
                        activePopoverIndex === index ? null : index
                      );
                    }}
                  >
                    📞
                  </button>
                  {activePopoverIndex === index && (
                    <div className="popover">
                      <button className="popover-option">
                        <FontAwesomeIcon
                          icon={faWhatsapp}
                          style={{
                            color: "#25D366",
                            marginRight: "6px",
                            fontSize: "18px",
                          }}
                        />
                        WhatsApp
                      </button>
                      <button className="popover-option">
                        <FontAwesomeIcon
                          icon={faPhone}
                          style={{
                            color: "#25D366",
                            marginRight: "6px",
                            fontSize: "16px",
                          }}
                        />
                        Normal Call
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
