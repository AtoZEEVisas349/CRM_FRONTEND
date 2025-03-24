import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const clients = [
  { name: "Cody Fisher", profession: "Fashion Designer", phone: "(212) 535-8263", email: "jacobjackson1988@yahoo.com", followUp: "Call today" },
  { name: "Andrea Sanchez", profession: "Economics Professor", phone: "(845) 732-4788", email: "jking@hotmail.com", followUp: "Not pic" },
  { name: "Brian Scott", profession: "Lawyer", phone: "(719) 810-7869", email: "ehall@hotmail.com", followUp: "Negotiation" },
  { name: "Jaime Jimenez", profession: "Housekeeper", phone: "(619) 656-7396", email: "bmartinez@yahoo.com", followUp: "Close as lost" },
  { name: "Anthony Davis", profession: "Clinical Psychologist", phone: "(312) 522-6378", email: "john_scott@hotmail.com", followUp: "Close as Won" },
  { name: "Jennifer Edwards", profession: "Chemist", phone: "(719) 817-6063", email: "swalker@hotmail.com", followUp: "Close as lost" },
];

const ClientTable = () => {
  const [editableIndex, setEditableIndex] = useState(null);
  const [followUps, setFollowUps] = useState(clients.map(client => client.followUp));
  const navigate = useNavigate();

  const handleEdit = (clientName) => {
    // Navigate to the client details page with the client's name as a URL parameter
    navigate(`/clients/${encodeURIComponent(clientName)}`);
  };

  const handleChange = (event, index) => {
    const updatedFollowUps = [...followUps];
    updatedFollowUps[index] = event.target.value;
    setFollowUps(updatedFollowUps);
  };

  return (
    <table className="client-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Add follow up</th>
          <th>Status</th>
          <th>Call</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client, index) => (
          <tr key={index}>
            <td>
              <div className="client-name">
                <div className="user-icon-bg">
                  <div className="user-icon">👤</div>
                </div>
                <div>
                  <strong>{client.name}</strong>
                  <p className="client-profession">{client.profession}</p>
                </div>
              </div>
            </td>
            <td>{client.phone}</td>
            <td>{client.email}</td>
            <td>
              <span className="followup-badge">{followUps[index]}</span>
              <span
                className="edit-icon"
                onClick={() => handleEdit(client.name)}
                style={{ marginLeft: "10px", cursor: "pointer" }}
              >
                ✏️
              </span>
            </td>
            <td>⚪</td>
            <td>📞</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientTable;
