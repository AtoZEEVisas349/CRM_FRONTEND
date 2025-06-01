import React, { useEffect, useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import useCopyNotification from "../../hooks/useCopyNotification";
import { SearchContext } from "../../context/SearchContext";
import { FaUser } from "react-icons/fa";

const CustomerTable = () => {
  const { convertedClients, convertedClientsLoading, fetchNotifications, createCopyNotification } = useApi();
  const [customers, setCustomers] = useState([]);
  const { searchQuery } = useContext(SearchContext);

  useCopyNotification(createCopyNotification, fetchNotifications);

  useEffect(() => {
    if (Array.isArray(convertedClients)) {
      setCustomers(convertedClients);
    }
  }, [convertedClients]);

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.toString().includes(query)
    );
  });

  const customerCount = filteredCustomers.length;

  return (
    <div className="customer-leads-page">
      <div className="leads_page_wrapper">
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
                        <input type="checkbox" className="checkbox" />
                        <FaUser />
                        <h3>{customer.name || "N/A"}</h3>
                        <p>Phone: {customer.phone || "N/A"}</p>
                        <p>Email: {customer.email || "N/A"}</p>  
                        <p>Last contacted: {customer.last_contacted || "N/A"}</p>                      
                      </div>
                      <div className="customer-actions">
                        <p>Name:{customer.name || "N/A"}</p>
                        <p>Phone: {customer.phone || "N/A"}</p>
                        <p>Email: {customer.email || "N/A"}</p>
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
    </div>
  );
};

export default CustomerTable;