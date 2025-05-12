import React from "react";

const InvoiceHeader = () => {
  return (
    <div className="invoice-header">
      <h2>Invoices - Converted Clients</h2>
      <div className="invoice-actions">
        <input type="text" placeholder="Search..." />
        <button>+ New Invoice</button>
      </div>
    </div>
  );
};

export default InvoiceHeader;
