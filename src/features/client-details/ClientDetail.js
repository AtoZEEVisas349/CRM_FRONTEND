import React, { useState } from "react";

const ClientDetail = ({ followUpText }) => {
  const [clientInfo, setClientInfo] = useState({
    name: "Cody Fisher",
    email: "Cody@gmail.com",
    phone: "999999999",
    altPhone: "988888888",
    education: "MCA",
    experience: "10 years",
    state: "Delhi",
    dob: "1970-01-01",
    country: "India",
    assignDate: "01/02/2024",
  });

  const handleChange = (field, value) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="c-container">
      <div className="c-header">
        <h2>Clients Details</h2>
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
