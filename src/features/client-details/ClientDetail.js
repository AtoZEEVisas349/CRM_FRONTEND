import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ClientDetail = ({ followUpText }) => {
  const location = useLocation();
  const client = location.state?.client;  // Extract the filtered client data from state

  const [clientInfo, setClientInfo] = useState(client || {});  // Initialize state with the passed client data

  const handleChange = (field, value) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (client) {
      setClientInfo(client);
    }
  }, [client]);

  if (!client) {
    return <p>No client data available.</p>;
  }

  return (
    <div className="c-container">
      <div className="c-header">
        <h2>Client Details</h2>
        <button className="c-button">×</button>
      </div>

      <div className="c-content">
        <div className="c-layout">
          <div className="client-info-column">
            <div className="c-profile">
              <div className="c-info">
                {Object.entries(clientInfo).map(([key, val]) => (
                  <div className="info-item" key={key}>
                    <span className="label">{key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())} -</span>
                    <span
                      className="value"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleChange(key, e.target.innerText)}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="follow-up-column">
            <div className="last-follow-up">
              <h3>Last Follow-up</h3>
              <p>{followUpText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
