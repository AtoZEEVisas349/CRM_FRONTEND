import React, { useContext } from "react";
import { ThemeContext } from "../features/admin/ThemeContext";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceStats from "./InvoiceStats";
import InvoiceTable from "./InvoiceTable";

const InvoicePage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="invoice-container" data-theme={theme}>
      <div className="invoice-main">
        <InvoiceHeader />
        <InvoiceStats />
        <InvoiceTable />
      </div>
    </div>
  );
};

export default InvoicePage;