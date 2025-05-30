import React, { useEffect, useState, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import useCopyNotification from "../../hooks/useCopyNotification";
import { SearchContext } from "../../context/SearchContext"; // <-- added

const CustomerTable = () => {
  const {
    convertedClients,
    fetchConvertedClientsAPI,
    convertedClientsLoading,
    fetchNotifications,
    createCopyNotification,
  } = useApi();

  const { searchQuery } = useContext(SearchContext); // <-- get search input
  useCopyNotification(createCopyNotification, fetchNotifications);

  const [customers, setCustomers] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      if (!isDataFetched) {
        await fetchConvertedClientsAPI();
        setIsDataFetched(true);
      }
    };
    fetchClients();
  }, [isDataFetched, fetchConvertedClientsAPI]);

  useEffect(() => {
    if (Array.isArray(convertedClients)) {
      setCustomers(convertedClients);
    }
  }, [convertedClients]);

  // 🔍 Filter customers by name/email/phone
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
    <div className="table-container">
      <table className="table">
        <thead className="table-head">
          <tr>
            <th>All Customers ({customerCount})</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Last Contacted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {convertedClientsLoading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                Loading...
              </td>
            </tr>
          ) : customerCount > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={index}>
                <td className="name">
                  <input type="checkbox" className="checkbox" />
                  <i className="fa-solid fa-circle-user"></i>
                  <p>{customer.name || "N/A"}</p>
                </td>
                <td>{customer.email || "N/A"}</td>
                <td>{customer.phone || "N/A"}</td>
                <td>{customer.last_contacted || "N/A"}</td>
                <td><i className="fa-solid fa-ellipsis"></i></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No customers available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
