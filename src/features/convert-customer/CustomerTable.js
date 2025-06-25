import React, { useEffect, useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import useCopyNotification from "../../hooks/useCopyNotification";
import { SearchContext } from "../../context/SearchContext";
import { FaPlus } from "react-icons/fa";
import { useLoading } from "../../context/LoadingContext";
import LoadingSpinner from "../spinner/LoadingSpinner";

const CustomerTable = () => {
  const {
    convertedClients,
    convertedClientsLoading,
    fetchNotifications,
    createCopyNotification,
    fetchFollowUpHistoriesAPI,
    setConvertedCustomerCount
  } = useApi();

  const [customers, setCustomers] = useState([]);
  const { searchQuery } = useContext(SearchContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [followUpHistories, setFollowUpHistories] = useState([]);
  const [followUpHistoriesLoading, setFollowUpHistoriesLoading] = useState(false);
  const { isLoading, loadingText, showLoader, hideLoader } = useLoading();

  useCopyNotification(createCopyNotification, fetchNotifications);

  useEffect(() => {
    const fetchAndSetCustomers = async () => {
      try {
        showLoader("Loading Converted Customers...");
        if (Array.isArray(convertedClients)) {
          const filtered = convertedClients.filter(
            (client) => client.status === "Converted"
          );
        
          const sorted = filtered.sort((a, b) => {
            const timeA = new Date(a.updatedAt || 0).getTime();
            const timeB = new Date(b.updatedAt || 0).getTime();
            return timeB - timeA;
          });
        
          setCustomers(sorted);
        }
      } catch (error) {
        console.error("Failed to process customers:", error);
      } finally {
        hideLoader();
      }
    };
  
    fetchAndSetCustomers();
  }, [convertedClients]);  

  const handleViewHistory = async (customer) => {
    setSelectedCustomer(customer);
    setFollowUpHistoriesLoading(true);

    try {
      const rawData = await fetchFollowUpHistoriesAPI();
      const customerLeadId =
        customer.fresh_lead_id || customer.freshLead?.id || customer.lead?.id || customer.id;

      const filtered = Array.isArray(rawData)
        ? rawData.filter((item) => {
            const historyLeadId = item.fresh_lead_id || item.followUp?.fresh_lead_id;
            return String(historyLeadId) === String(customerLeadId);
          })
        : [];

      const parsed = filtered.map((item) => ({
        date: item.follow_up_date || item.followUp?.follow_up_date || "N/A",
        time: item.follow_up_time || item.followUp?.follow_up_time || "N/A",
        reason: item.reason_for_follow_up || item.followUp?.reason_for_follow_up || "No reason provided",
        tags: [
          item.connect_via || item.followUp?.connect_via || "",
          item.follow_up_type || item.followUp?.follow_up_type || "",
          item.interaction_rating || item.followUp?.interaction_rating || ""
        ].filter(Boolean),
        // Add original timestamp for sorting
        originalDate: item.follow_up_date || item.followUp?.follow_up_date || "N/A",
        originalTime: item.follow_up_time || item.followUp?.follow_up_time || "N/A",
      }));

      // Sort by date and time in descending order (latest first)
      const sortedParsed = parsed.sort((a, b) => {
        // Create comparable datetime strings
        const dateTimeA = `${a.originalDate} ${a.originalTime}`;
        const dateTimeB = `${b.originalDate} ${b.originalTime}`;
        
        // Try to parse as dates
        const parsedDateA = new Date(dateTimeA);
        const parsedDateB = new Date(dateTimeB);
        
        // If both dates are valid, sort by them
        if (!isNaN(parsedDateA.getTime()) && !isNaN(parsedDateB.getTime())) {
          return parsedDateB.getTime() - parsedDateA.getTime(); // Descending order
        }
        
        // Fallback: string comparison (descending)
        return dateTimeB.localeCompare(dateTimeA);
      });

      setFollowUpHistories(sortedParsed);
    } catch (error) {
      console.error("Failed to load follow-up history:", error);
      setFollowUpHistories([]);
    } finally {
      setFollowUpHistoriesLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.toString().includes(query)
    );
  });

  useEffect(() => {
    setConvertedCustomerCount(filteredCustomers.length);
  }, [filteredCustomers]);

  const customerCount = filteredCustomers.length;

  return (
    <>
      {(isLoading || convertedClientsLoading) && (
        <LoadingSpinner text={loadingText || "Loading Converted Customers..."} />
      )}

      <div className="customer-leads-page">
        <h4 className="Total_leads">Total customers: {customerCount}</h4>

        {convertedClientsLoading ? (
          <p>Loading customers...</p>
        ) : filteredCustomers.length > 0 ? (
          <div className="scrollable-leads-container">
            <div className="country_container">
              {filteredCustomers.map((customer, index) => (
                <div key={index} className="country_cards">
                  <div className="country_name customer-card">
                    <div className="customer-header">
                      <div className="customer-name-section">
                        <div className="col checkbox-col">
                          <input type="checkbox" className="checkbox" />
                        </div>
                        <div className="col name-col">
                          <h3>{customer.name || "N/A"}</h3>
                        </div>
                        <div className="col phone-col">
                          <p>Phone: {customer.phone || "N/A"}</p>
                        </div>
                        <div className="col email-col">
                          <p>Email: {customer.email || "N/A"}</p>
                        </div>
                        <div className="col last-contacted-col">
                          <p>Last contacted: {customer.last_contacted || "N/A"}</p>
                        </div>
                      </div>
                      <div className="customer-actions">
                        <button
                          className="follow-history-btn"
                          onClick={() => handleViewHistory(customer)}
                          title="View Follow-up History"
                        >
                          <span className="history-icon">
                            <FaPlus />
                          </span>
                          Follow History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No customers available.</p>
        )}
      </div>

      {selectedCustomer && (
        <div className="h-followup-modal-overlay">
          <div className="h-followup-modal">
            <div className="h-followup-modal-header">
              <h3>{selectedCustomer.name}</h3>
              <button className="h-close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="h-followup-modal-body">
              {followUpHistoriesLoading ? (
                <p>Loading history...</p>
              ) : followUpHistories.length > 0 ? (
                followUpHistories.map((entry, idx) => (
                  <div className="h-followup-entry-card" key={idx}>
                    <div className="h-followup-date">
                      <span>{entry.date}</span>
                      <span>{entry.time}</span>
                      {idx === 0 && <span className="h-latest-tag">LATEST</span>}
                    </div>
                    <div className="h-followup-tags">
                      {entry.tags?.map((tag, i) => (
                        <button key={i} className={`h-tag ${tag === "Hot" ? "hot" : ""}`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="h-followup-reason-box">
                      <p>Follow-Up Reason</p>
                      <div className="h-reason-text">{entry.reason}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No follow-up history found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerTable;