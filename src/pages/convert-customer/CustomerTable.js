import React from "react";
import CustomerRow from "./CustomerRow";

const customers = [
  { name: "John Hill", email: "ryoung@yahoo.com", phone: "(717) 817-8593", tags: ["Lead", "Long-Term"], lastContacted: "Jul 22, 2022" },
  { name: "Jerry Clark", email: "real.sarahjohnson@yahoo.com", phone: "(610) 818-9038", tags: ["Lead"], lastContacted: "Jul 22, 2022" },
  { name: "John Hill", email: "ryoung@yahoo.com", phone: "(717) 817-8593", tags: ["Lead", "Long-Term"], lastContacted: "Jul 22, 2022" },
  { name: "John Hill", email: "ryoung@yahoo.com", phone: "(717) 817-8593", tags: ["Lead", "Long-Term"], lastContacted: "Jul 22, 2022" },
  { name: "John Hill", email: "ryoung@yahoo.com", phone: "(717) 817-8593", tags: ["Lead", "Long-Term"], lastContacted: "Jul 22, 2022" },
];

const CustomerTable = () => (
  <div className="table-container">
    <table className="table">
      <thead className="table-head">
        <tr>
          <th>All Customers ({customers.length})</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Tags</th>
          <th>Last Contacted</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {customers.map((customer, index) => (
          <CustomerRow key={index} customer={customer} />
        ))}
      </tbody>
    </table>
  </div>
);

export default CustomerTable;
