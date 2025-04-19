import React from "react";

const MyProfile = () => {
  return (
    <div className="my-profile">
    <h2>My Profile</h2>
    <div className="profile-section">
  
      <div className="profile-header">
        <div className="left">
          <img src="https://via.placeholder.com/100" alt="Profile" className="profile-image" />
          <div>
            <h3>Rafiqul Rahman</h3>
            <p>Team Manager</p>
            <p>Leeds, United Kingdom</p>
          </div>
        </div>
        <button className="edit-btn">Edit ✏️</button>
      </div>
  
      <div className="profile-box">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4>Personal Information</h4>
          <button className="edit-btn">Edit ✏️</button>
        </div>
        <div className="profile-fields">
          <div className="field-group">
            <span className="field-label">First Name</span>
            <span className="field-value">Rafiqul</span>
          </div>
          <div className="field-group">
            <span className="field-label">Last Name</span>
            <span className="field-value">Rahman</span>
          </div>
          <div className="field-group">
            <span className="field-label">Email address</span>
            <span className="field-value">rafiqurrahman51@gmail.com</span>
          </div>
          <div className="field-group">
            <span className="field-label">Phone</span>
            <span className="field-value">+09 345 346 46</span>
          </div>
          <div className="field-group" style={{ gridColumn: "1 / span 2" }}>
            <span className="field-label">Bio</span>
            <span className="field-value">Team Manager</span>
          </div>
        </div>
      </div>
  
      <div className="profile-box">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4>Address</h4>
          <button className="edit-btn">Edit ✏️</button>
        </div>
        <div className="profile-fields">
          <div className="field-group">
            <span className="field-label">Country</span>
            <span className="field-value">United Kingdom</span>
          </div>
          <div className="field-group">
            <span className="field-label">City/State</span>
            <span className="field-value">Leeds, East London</span>
          </div>
          <div className="field-group">
            <span className="field-label">Postal Code</span>
            <span className="field-value">ERT 2354</span>
          </div>
          <div className="field-group">
            <span className="field-label">TAX ID</span>
            <span className="field-value">AS45645756</span>
          </div>
        </div>
      </div>
  
    </div>
  </div>
  
  );
};

export default MyProfile;
