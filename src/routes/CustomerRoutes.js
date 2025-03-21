import React, { useState } from "react";
import SearchBar from "../pages/convert-customer/SearchBar";
import CustomerTable from "../pages/convert-customer/CustomerTable";
import SidebarandNavbar from "../components/SidebarandNavbar";
import "../styles/customer.css";

const CustomerRoutes = () => {
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const handleSearch = (query) => {
    setFilteredCustomers(
      CustomerTable.filter(customer =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
      )
    );
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
        <CustomerTable customers={filteredCustomers.length > 0 ? filteredCustomers : CustomerTable} />
      </div>
    </div>
  );
};

export default CustomerRoutes;
