import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sample client data
const clients = [
  { name: "Cody Fisher", profession: "Fashion Designer", phone: "(212) 535-8263", email: "jacobjackson1988@yahoo.com", followUp: "Call today" },
  { name: "Andrea Sanchez", profession: "Economics Professor", phone: "(845) 732-4788", email: "jking@hotmail.com", followUp: "Not pic" },
  { name: "Brian Scott", profession: "Lawyer", phone: "(719) 810-7869", email: "ehall@hotmail.com", followUp: "Negotiation" },
  { name: "Jaime Jimenez", profession: "Housekeeper", phone: "(619) 656-7396", email: "bmartinez@yahoo.com", followUp: "Close as lost" },
  { name: "Anthony Davis", profession: "Clinical Psychologist", phone: "(312) 522-6378", email: "john_scott@hotmail.com", followUp: "Close as Won" },
  { name: "Jennifer Edwards", profession: "Chemist", phone: "(719) 817-6063", email: "swalker@hotmail.com", followUp: "Close as lost" },
  // Adding more rows to demonstrate scrolling
  { name: "Michael Johnson", profession: "Software Engineer", phone: "(415) 555-1234", email: "mjohnson@gmail.com", followUp: "Call today" },
  { name: "Sarah Williams", profession: "Marketing Director", phone: "(212) 555-6789", email: "swilliams@outlook.com", followUp: "Not pic" },
  { name: "Robert Brown", profession: "Financial Analyst", phone: "(312) 555-4321", email: "rbrown@yahoo.com", followUp: "Negotiation" },
  { name: "Emily Davis", profession: "Graphic Designer", phone: "(415) 555-9876", email: "edavis@gmail.com", followUp: "Close as lost" },
  { name: "David Wilson", profession: "Project Manager", phone: "(212) 555-2468", email: "dwilson@hotmail.com", followUp: "Close as Won" },
  { name: "Jessica Miller", profession: "HR Specialist", phone: "(312) 555-1357", email: "jmiller@yahoo.com", followUp: "Close as lost" },
];

const ClientTable = ({ filter = "All Follow Ups" }) => {
  const [editableIndex, setEditableIndex] = useState(null);
  const [followUps, setFollowUps] = useState(clients.map(client => client.followUp));
  const navigate = useNavigate();
  const [tableHeight, setTableHeight] = useState("500px");

  // Dynamically adjust table height
  useEffect(() => {
    const updateTableHeight = () => {
      // Check available space
      const windowHeight = window.innerHeight;
      const tablePosition = document.querySelector(".table-container")?.getBoundingClientRect().top || 0;
      const footerHeight = 40; // Estimated footer height
      const availableHeight = windowHeight - tablePosition - footerHeight;
      
      // Set a minimum height but allow it to grow
      const newHeight = Math.max(300, availableHeight);
      setTableHeight(`${newHeight}px`);
    };
    
    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    
    return () => window.removeEventListener('resize', updateTableHeight);
  }, []);

  const filteredClients = filter === "All Follow Ups" 
    ? clients 
    : filter === "Interested" 
      ? clients.filter(client => ["Call today", "Negotiation", "Close as Won"].includes(client.followUp))
      : clients.filter(client => ["Not pic", "Close as lost"].includes(client.followUp));
      
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
    <div 
    className="table-container responsive-table-wrapper" 
    style={{ 
      maxHeight: tableHeight, 
      overflowX: "auto",      // horizontal scroll
      overflowY: "auto",      // vertical scroll
      position: "relative",
      border: "1px solid #e0e0e0",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      backgroundColor: "white",
      width: "100%"
    }}
  >
  

      <table className="client-table" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
  <tr style={{ 
    position: "sticky", 
    top: 0, 
    backgroundColor: "#2c2c2c", // Dark background for contrast
    zIndex: 10,
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
  }}>
    <th style={{ color: "white" }}>Name</th>
    <th style={{ color: "white" }}>Phone</th>
    <th style={{ color: "white" }}>Email</th>
    <th style={{ color: "white" }}>Add follow up</th>
    <th style={{ color: "white" }}>Status</th>
    <th style={{ color: "white" }}>Call</th>
  </tr>
</thead>

        <tbody>
          {filteredClients.map((client, index) => {
            // Find the correct index in the original clients array for followUps
            const originalIndex = clients.findIndex(c => c.name === client.name);
            return (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
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
                  <span className="followup-badge">{followUps[originalIndex]}</span>
                  <span
                    className="edit-icon"
                    onClick={() => handleEdit(client.name)}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    ✏
                  </span>
                </td>
                <td>⚪</td>
                <td>📞</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
