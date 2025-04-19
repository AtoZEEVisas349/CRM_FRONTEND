import React from "react";
import InvoiceHeader from "../features/Invoice/InvoiceHeader";
import InvoiceStats from "../features/Invoice/InvoiceStats";
import InvoiceTable from "../features/Invoice/InvoiceTable";
import "../styles/invoice.css"; 
import SidebarandNavbar from "../layouts/SidebarandNavbar";

const InvoiceRoutes = () => {
  return (
    <div className="invoice-container">
      <SidebarandNavbar />
      <div className="invoice-main">
        <InvoiceHeader />
        <InvoiceStats />
        <InvoiceTable />
      </div>
    </div>
  );
};

export default InvoiceRoutes;
