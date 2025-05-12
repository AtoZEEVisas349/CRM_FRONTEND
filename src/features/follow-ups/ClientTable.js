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

const filteredClients = clients.filter((client) => {
  const type = (client.follow_up_type || "").toLowerCase().trim();
  const status = (client.clientLeadStatus || "").toLowerCase().trim();

  if (status === "follow-up") {
    if (filter === "Interested") {
      return type === "interested"; // Filter by "Interested" type
    } else if (filter === "Not Interested") {
      return type === "not interested"; // Filter by "Not Interested" type
    } else {
      return true; 
    }
  }

  return false; 
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

  const handleEdit = (client) => {
    const freshLeadId = client.freshLead?.id || client.fresh_lead_id;  
        if (!freshLeadId) {
      console.error("Fresh Lead ID is missing or incorrect");
      return;
    }
  
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
      className="table-container responsive-table-wrapper">
      <table className="client-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Add follow up</th>
            <th>Status</th>
            <th>Call</th>
          </tr>
        </thead>
        <tbody>
          {followUpLoading ? (
            <tr>
              <td colSpan="6">
                Loading...
              </td>
            </tr>
          ) : (
            filteredClients.map((client, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td>
                  <div className="client-name">
                    <div
                      className="user-icon-bg">
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
                    className="followup-badge">
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
                  <span>
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
