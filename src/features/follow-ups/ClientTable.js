import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const ClientTable = ({ filter = "All Follow Ups", onSelectClient }) => {
  const { followUps, getAllFollowUps, followUpLoading } = useApi();
  const clients = Array.isArray(followUps?.data) ? followUps.data : [];
  const [activePopoverIndex, setActivePopoverIndex] = useState(null);
  const [tableHeight, setTableHeight] = useState("500px");
  const navigate = useNavigate();

  useEffect(() => {
    getAllFollowUps();
  }, []);

  useEffect(() => {
    const updateTableHeight = () => {
      const windowHeight = window.innerHeight;
      const tablePosition = document.querySelector(".table-container")?.getBoundingClientRect().top || 0;
      const footerHeight = 40;
      const newHeight = Math.max(300, windowHeight - tablePosition - footerHeight);
      setTableHeight(`${newHeight}px`);
    };

    updateTableHeight();
    window.addEventListener("resize", updateTableHeight);
    return () => window.removeEventListener("resize", updateTableHeight);
  }, []);

  const filteredClients = clients.filter((client) => {
    const type = (client.follow_up_type || "").toLowerCase().trim();
    const status = (client.clientLeadStatus || "").toLowerCase().trim();

    if (status === "follow-up") {
      if (filter === "Interested") return type === "interested";
      if (filter === "Not Interested") return type === "not interested";
      return true;
    }
    return false;
  });

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
      state: { client: leadData, createFollowUp: false, from: "followup" },
    });
  };

  const getStatusColorClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "follow-up":
        return "status-followup";
      case "converted":
        return "status-converted";
      case "not interested":
        return "status-notinterested";
      default:
        return "status-default";
    }
  };

  return (
    <div className="table-container responsive-table-wrapper" style={{ maxHeight: tableHeight }}>
      <table className="client-table">
        <thead>
          <tr className="sticky-header">
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
              <td colSpan="6" className="loading-row">Loading...</td>
            </tr>
          ) : (
            filteredClients.map((client, index) => (
              <tr key={index}>
                <td onClick={() => onSelectClient?.(client)}>
                  <div className="client-name">
                    <div className="client-info">
                      <strong>{client.freshLead?.name || "No Name"}</strong>
                    </div>
                  </div>
                </td>
                <td>{client.freshLead?.phone?.toString() || "No Phone"}</td>
                <td>{client.freshLead?.email || "N/A"}</td>
                <td>
                <span className="followup-badge">
                  {filter === "All Follow Ups"
                    ? "Create"
                    : (client.follow_up_type || "").toLowerCase()}
                </span>
                <span className="edit-icon" onClick={() => handleEdit(client)}>✏</span>
              </td>
                <td>
                  <span className={`status-badge ${getStatusColorClass(client.clientLeadStatus)}`}>
                    {client.clientLeadStatus || "N/A"}
                  </span>
                </td>
                <td className="call-cell">
                  <button
                    className="call-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopoverIndex(activePopoverIndex === index ? null : index);
                    }}
                  >
                    📞
                  </button>
                  {activePopoverIndex === index && (
                    <div className="popover">
                      <button className="popover-option">
                        <FontAwesomeIcon icon={faWhatsapp} className="icon" />
                        WhatsApp
                      </button>
                      <button className="popover-option">
                        <FontAwesomeIcon icon={faPhone} className="icon" />
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
