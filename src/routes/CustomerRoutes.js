import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import SearchBar from "../features/convert-customer/SearchBar";
import CustomerTable from "../features/convert-customer/CustomerTable";
import SidebarandNavbar from "../layouts/SidebarandNavbar";
import "../styles/customer.css";

const CustomerRoutes = () => {
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  const handleSearch = (query) => {
    setFilteredCustomers(
      CustomerTable.filter((customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const openInvoiceInNewTab = () => {
    window.open("/invoice.html", "_blank"); // ✅ Opens invoice in a new tab
  };
  

  return (
    <div className="customer-container">
      <SidebarandNavbar />
      <div className="customer-main-content">
        <div className="heading">
          <h2>Convert Customers</h2>
          <button className="button">Import List</button>
        </div>

        <SearchBar onSearch={handleSearch} />
        <CustomerTable
          customers={filteredCustomers.length > 0 ? filteredCustomers : CustomerTable}
        />

        {/* ✅ Invoice Button Outside Invoice */}
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
