import React from "react";
import Tag from "./Tag";

const CustomerRow = ({ customer }) => (
  <tr>
    <td className="name">
      <input type="checkbox" className="checkbox" />
      <i className="fa-solid fa-circle-user"></i>
      <p>{customer.name}</p>
    </td>
    <td>{customer.email}</td>
    <td>{customer.phone}</td>
    <td>
      {customer.tags.map((tag, i) => (
        <Tag key={i} tag={tag} />
      ))}
    </td>
    <td>{customer.lastContacted}</td>
    <td><i className="fa-solid fa-ellipsis"></i></td>
  </tr>
);

export default CustomerRow;
