import React from "react";

const ClientDetails = () => {
  return (
    <div className="client-details-container">
      <h3 className="client-details-title">Clients Details</h3>

      <div className="client-details">
        <div className="client-info">
          <div className="user-icon-bg">
            <div className="user-icon">👤</div>
          </div>
          <div className="client-text">
            <h4>Cody Fisher</h4>
            <p>Fugiat laborum non ani</p>
            <div className="lead-info">
              <span className="lead-badge">Lead</span>
            </div>
          </div>
        </div>

        <div className="last-followup">
          <h5>Last follow up</h5>
          <p>
            Anthony Griffith is a 40-year-old non-gay man who identifies as
            African American and appears to be his stated age. He is
            approximately 6'4" tall and weighs 200 lbs and appears to be in
            good health. He has been married for sixteen years in a "loving
            relationship" and was self-referred to counseling. The client has a
            BFA degree in Comedic Arts and is currently performing throughout
            the United States as a Stand-Up comic.
          </p>
        </div>

        <div className="close-btn">✖</div>
      </div>
    </div>
  );
};

export default ClientDetails;
