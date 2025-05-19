import React from "react";

const InvoiceHeader = () => {
  return (
    <div className="invoice-header">
      <h2>Invoices - Converted Clients</h2>
      <div className="invoice-actions">
       <div className="contact-admin-container" >
        <div className="contact-admin-box-invoice ">
            <FaUserShield className="admin-icon" />
        <p className="change-password-text">Contact to Administrater for adding Invoice</p>
       
      </div>
      </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
