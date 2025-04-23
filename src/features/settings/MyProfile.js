import React, { useState } from "react";

const MyProfile = () => {
  const [editingSections, setEditingSections] = useState({
    header: false,
    personal: false,
    address: false,
  });

  const [profile, setProfile] = useState({
    firstName: "Rafiqul",
    lastName: "Rahman",
    email: "rafiqurrahman51@gmail.com",
    phone: "+09 345 346 46",
    bio: "Team Manager",
    country: "United Kingdom",
    cityState: "Leeds, East London",
    postalCode: "ERT 2354",
    taxId: "AS45645756",
    profileImage: "https://via.placeholder.com/100",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSection = (section) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isEditing = Object.values(editingSections).some(Boolean);

  const handleSaveAll = () => {
    console.log("Saved profile:", profile);
    setEditingSections({
      header: false,
      personal: false,
      address: false,
    });
  };

  const renderField = (label, name, span = false) => (
    <div
      className="field-group"
      style={span ? { gridColumn: "1 / span 2" } : {}}
    >
      <span className="field-label">{label}</span>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={profile[name]}
          onChange={handleChange}
          className="field-input"
        />
      ) : (
        <span className="field-value">{profile[name]}</span>
      )}
    </div>
  );

  return (
    <div className="my-profile">
      <h2>My Profile</h2>
      <div className="profile-section">

        {/* Profile Header */}
        <div className="profile-box">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Profile Info</h4>
            <button
              className="edit-btn"
              onClick={() => toggleSection("header")}
            >
              {editingSections.header ? "Cancel ❌" : "Edit ✏️"}
            </button>
          </div>
          <div className="profile-header">
            <div className="left" style={{ display: "flex", gap: "16px" }}>
              {editingSections.header ? (
                <input
                  type="text"
                  name="profileImage"
                  value={profile.profileImage}
                  onChange={handleChange}
                  className="field-input"
                  style={{ width: "100px" }}
                />
              ) : (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="profile-image"
                />
              )}
              <div>
                {editingSections.header ? (
                  <>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className="field-input"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="field-input"
                    />
                    <input
                      type="text"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      className="field-input"
                    />
                    <input
                      type="text"
                      name="cityState"
                      value={profile.cityState}
                      onChange={handleChange}
                      className="field-input"
                    />
                  </>
                ) : (
                  <>
                    <h3>{profile.firstName} {profile.lastName}</h3>
                    <p>{profile.bio}</p>
                    <p>{profile.cityState}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-box">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Personal Information</h4>
            <button
              className="edit-btn"
              onClick={() => toggleSection("personal")}
            >
              {editingSections.personal ? "Cancel ❌" : "Edit ✏️"}
            </button>
          </div>
          <div className="profile-fields">
            {renderField("Email address", "email")}
            {renderField("Phone", "phone")}
          </div>
        </div>

        {/* Address Information */}
        <div className="profile-box">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Address</h4>
            <button
              className="edit-btn"
              onClick={() => toggleSection("address")}
            >
              {editingSections.address ? "Cancel ❌" : "Edit ✏️"}
            </button>
          </div>
          <div className="profile-fields">
            {renderField("Country", "country")}
            {renderField("City/State", "cityState")}
            {renderField("Postal Code", "postalCode")}
            {renderField("TAX ID", "taxId")}
          </div>
        </div>

        {/* Save Button at the Bottom */}
        {isEditing && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button className="save-btn" onClick={handleSaveAll}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
