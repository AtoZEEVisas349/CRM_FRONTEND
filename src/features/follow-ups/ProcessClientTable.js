import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { SearchContext } from "../../context/SearchContext";
import { useLoading } from "../../context/LoadingContext";
import LoadingSpinner from "../spinner/LoadingSpinner";
import { useProcessService } from "../../context/ProcessServiceContext";

const ProcessClientTable = ({ filter = "All Follow Ups", onSelectClient }) => {

  const [activePopoverIndex, setActivePopoverIndex] = useState(null);
  const [tableHeight, setTableHeight] = useState("500px");
  const navigate = useNavigate();
  const { searchQuery, setActivePage } = useContext(SearchContext);
  const location = useLocation();
  const {  isLoading, loadingText } = useLoading();
 
  const {getProcessAllFollowup, fetchCustomers, customers, setCustomers}=useProcessService();

  const[processFollowup,setProcessFollowup]=useState()

   useEffect(() => {
 
    const fetchFollowups = async () => {
     
      try {
        const result = await getProcessAllFollowup();
        setProcessFollowup(result)
     
      } catch (err) {
        console.error("❌ Failed to load follow-ups:", err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchFollowups();
    console.log("processFollowup:", processFollowup);
  }, []);
   useEffect(() => {
      fetchCustomers()
        .then((data) => {
          if (data && Array.isArray(data)) {
           const mappedClients = data
    .filter((client) => client.status === "under_review")
            setCustomers(mappedClients);
          }
        })
        .catch((err) => console.error("❌ Error fetching clients:", err));
        console.log(customers)
    }, []);
    const clients=customers.filter((client) => client.status === "under_review")

  const isFollowUpOld = (followUpDate) => {
    if (!followUpDate) return false;
    const today = new Date();
    const followDate = new Date(followUpDate);
    const diffTime = Math.abs(today - followDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  };


  useEffect(() => {
    setActivePage("follow-up");
  }, [setActivePage]);

  useEffect(() => {
    const updateTableHeight = () => {
      const windowHeight = window.innerHeight;
      const tablePosition = document
        .querySelector(".table-container")
        ?.getBoundingClientRect().top || 0;
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

    if (filter === "Document collection" && type !== "document collection") return false;
     if (filter === "Payment follow-up" && type !== "payment follow-up") return false; 
     if (filter === "Visa filing" && type !== "visa filing") return false; 
    
    

    if (location.pathname.includes("process-follow-up") && searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      const name = client.freshLead?.name?.toLowerCase() || "";
      const phone = client.freshLead?.phone?.toString() || "";
      const email = client.freshLead?.email?.toLowerCase() || "";
      return name.includes(search) || phone.includes(search) || email.includes(search);
    }

    return true;
  });

  const handleEdit = (client) => {
    const freshLeadId = client.freshLead?.id || client.fresh_lead_id;
    if (!freshLeadId) {
      console.error("Fresh Lead ID is missing or incorrect");
      return;
    }
    const leadData = {
      name: client.freshLead?.name || "",
      email: client.freshLead?.email || "",
      phone: client.freshLead?.phone || "",
      altPhone: client.freshLead?.altPhone || "",
      education: client.freshLead?.education || "",
      experience: client.freshLead?.experience || "",
      state: client.freshLead?.state || "",
      dob: client.freshLead?.dob || "",
      country: client.freshLead?.country || "",
      fresh_lead_id: freshLeadId,
      followUpId: client.id,
    };
    
    navigate(`/process/clients/details/${encodeURIComponent(client.id)}/${client.id}`, {
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

  const getRatingColorClass = (rating) => {
    switch ((rating || "").toLowerCase()) {
      case "hot":
        return "rating-hot";
      case "warm":
        return "rating-warm";
      case "cold":
        return "rating-cold";
      default:
        return "rating-default";
    }
  };

  return (
    <>
      <div className="client-table-wrapper" style={{ position: "relative" }}>
        {isLoading && <LoadingSpinner text={loadingText} />}

        <div
          className="table-container responsive-table-wrapper"
          style={{ maxHeight: tableHeight }}
        >
            
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
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data-text">No follow-up clients found.</td>
                </tr>
              ) : (
                filteredClients.map((client, index) => {
                  const isOld = isFollowUpOld(client.follow_up_date);

                  return (
                    <tr
                      key={index}
                      className={isOld ? "old-followup-row" : ""}
                      style={
                        isOld
                          ? {
                              backgroundColor: "#ffebee",
                              borderLeft: "4px solid #f44336",
                            }
                          : {}
                      }
                    >
                      <td onClick={() => onSelectClient?.(client)}>
                        <div className="client-name">
                          <div className="client-info">
                            <strong
                              style={
                                isOld
                                  ? { color: "#c62828", fontWeight: "bold" }
                                  : {}
                              }
                            >
                              {client.fullName || "No Name"}
                            </strong>
                          </div>
                        </div>
                      </td>
                      <td style={isOld ? { color: "#c62828" } : {}}>
                        {client.phone?.toString() || "No Phone"}
                      </td>
                      <td style={isOld ? { color: "#c62828" } : {}}>
                        {client.email || "N/A"}
                      </td>
                      <td>
                        <button
                          className={`followup-badge full-click ${
                            isOld ? "old-followup-button" : ""
                          }`}
                          onClick={() => handleEdit(client)}
                          style={
                            isOld
                              ? {
                                  backgroundColor: "#f44336",
                                  borderColor: "#d32f2f",
                                  color: "white",
                                }
                              : {}
                          }
                        >
                          {filter === "All Follow Ups"
                            ? "Create"
                            : (client.follow_up_type || "").toLowerCase()}
                          <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                        </button>
                      </td>
                      <td>
                        {client.interaction_rating ? (
                          <span
                            className={`rating-badge ${getRatingColorClass(
                              client.interaction_rating
                            )} ${isOld ? "old-followup-badge" : ""}`}
                            style={
                              isOld
                                ? {
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "1px solid #d32f2f",
                                  }
                                : {}
                            }
                          >
                            {client.interaction_rating.charAt(0).toUpperCase() +
                              client.interaction_rating.slice(1)}
                          </span>
                        ) : (
                          <span
                            className={`status-badge ${getStatusColorClass(
                              client.status
                            )} ${isOld ? "old-followup-badge" : ""}`}
                            style={
                              isOld
                                ? {
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "1px solid #d32f2f",
                                  }
                                : {}
                            }
                          >
                            {client.status || "N/A"}
                          </span>
                        )}
                      </td>
                      <td className="call-cell">
                        <button
                          className={`call-button ${
                            isOld ? "old-followup-call" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePopoverIndex(
                              activePopoverIndex === index ? null : index
                            );
                          }}
                          style={
                            isOld
                              ? {
                                  backgroundColor: "#f44336",
                                  color: "white",
                                  border: "1px solid #d32f2f",
                                }
                              : {}
                          }
                        >
                          📞
                        </button>
                        {activePopoverIndex === index && (
                          <div className="popover">
                            <button
                              className="popover-option"
                              onClick={() => {
                                const cleaned = (
                                  client.phone || ""
                                ).replace(/[^\d]/g, "");
                                window.location.href = `whatsapp://send?phone=91${cleaned}`;
                                setActivePopoverIndex(null);
                              }}
                            >
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
                            <button
                              className="popover-option"
                              onClick={() => {
                                const cleaned = (
                                  client.phone || ""
                                ).replace(/[^\d]/g, "");
                                window.open(`tel:${cleaned}`);
                                setActivePopoverIndex(null);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPhone}
                                style={{
                                  color: "#4285F4",
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProcessClientTable;