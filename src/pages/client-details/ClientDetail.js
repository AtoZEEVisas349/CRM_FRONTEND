import React from "react";

const ClientDetail= () => {
  return (
    <div className="c-container">
      <div className="c-header">
        <h2>Clients Details</h2>
        <button className="c-button">×</button>
      </div>

      <div className="c-content">
        <div className="c-layout">
          {/* Left Column - Client Info */}
          <div className="client-info-column">
            <div className="c-profile">
              <div className="avatar-container">
                <div className="avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="User Avatar">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>

              <div className="c-info">
                <div className="info-item">
                  <span className="label">Name -</span>
                  <span clasnsName="value">Cody Fisher</span>
                </div>
                <div className="info-item">
                  <span className="label">Email -</span>
                  <span className="value">Cody@gmail.com</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone Number -</span>
                  <span className="value">999999999</span>
                </div>
                <div className="info-item">
                  <span className="label">Alt P.No -</span>
                  <span className="value">988888888</span>
                </div>
                <div className="info-item">
                  <span className="label">Education -</span>
                  <span className="value">MCA</span>
                </div>
                <div className="info-item">
                  <span className="label">Experience -</span>
                  <span className="value">10 years</span>
                </div>
                <div className="info-item">
                  <span className="label">State -</span>
                  <span className="value">Delhi</span>
                </div>
                <div className="info-item">
                  <span className="label">Date of Birth -</span>
                  <span className="value">1970-01-01</span>
                </div>
                <div className="info-item">
                  <span className="label">Country -</span>
                  <span className="value">India</span>
                </div>
                <div className="info-item">
                  <span className="label">Date of Assign -</span>
                  <span className="value">01/02/2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Follow-up Info */}
          <div className="follow-up-column">
            <div className="last-follow-up">
              <h3>Last Follow-up</h3>
              <p>
                Anthony Griffin is a 40-year-old man who identifies as African American and appears to be his stated age. He is approximately 6'4" tall, weighs 200 lbs, and appears to be in good health. He has been married for sixteen years in a "loving relationship" and was self-referred to counseling. The client has a BFA degree in Comedic Arts and is currently performing throughout the United States as a Stand-Up comic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
