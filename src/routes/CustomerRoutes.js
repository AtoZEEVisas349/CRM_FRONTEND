import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerTable from "../features/convert-customer/CustomerTable";
import SidebarandNavbar from "../layouts/SidebarandNavbar";
import { useApi } from "../context/ApiContext";
import "../styles/customer.css";

const CustomerRoutes = () => {
  const { convertedClients, fetchConvertedClientsAPI } = useApi();
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchConvertedClientsAPI();
    console.log("Fetched converted clients in CustomerRoutes:", convertedClients);
  }, []);

  useEffect(() => {
    if (Array.isArray(convertedClients)) {
      setFilteredCustomers(convertedClients);
    }
  }, [convertedClients]);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredCustomers(convertedClients);
      return;
    }
    const filtered = convertedClients.filter(
      (customer) =>
        (customer.name &&
          customer.name.toLowerCase().includes(query.toLowerCase())) ||
        (customer.email &&
          customer.email.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredCustomers(filtered);
  };

  const openInvoiceInNewTab = () => {
    window.open("/invoice.html", "_blank");
  };

  return (
    <div className="customer-container">
      <SidebarandNavbar />
      <div className="customer-main-content">
        <div className="convert-heading">
          <h2>Convert Customers</h2>
          <button className="button">Export List</button>
        </div>
        <CustomerTable customers={filteredCustomers} />
        <div className="generate-btn-wrapper">
          <button className="button invoice-btn" onClick={openInvoiceInNewTab}>
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerRoutes;