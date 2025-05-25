import React, { useState, useEffect, useRef, useContext } from "react";
import { useApi } from "../../context/ApiContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const MyProfile = () => {
  const [editingSections, setEditingSections] = useState({
    header: false,
    personal: false,
    address: false,
  });
  const { fetchSettings,userSettings,updateSettings,setUserSettings } = useApi();
  const [profile, setProfile] = useState({});
   const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchSettings(); 
      hasFetched.current = true; 
    }
  }, [userSettings]);

  useEffect(() => {
    if (userSettings) {
      const mappedProfile = {
        firstname: userSettings?.user?.firstname ? userSettings.user.firstname.trim() : "First Name",
        lastname: userSettings?.user?.lastname ? userSettings.user.lastname.trim() : "",
        username: userSettings?.user?.username ? userSettings.user.username.trim() : "Not set",
        email: userSettings?.user?.email ? userSettings.user.email.trim() : "Not set",
        phone: userSettings?.user?.phone ? userSettings.user.phone.trim() : "Not set",
        profile_picture: userSettings.profile_picture || "https://via.placeholder.com/100",
        city: (userSettings?.user.city && userSettings?.user.state)
          ? `${userSettings.user.city}, ${userSettings.user.state}`
          : userSettings?.user.city
            ? userSettings.user.city
            : userSettings?.user.state
              ? userSettings.user.state
              : "Not set",
              country: userSettings?.user?.country ? userSettings.user.country.trim() : "Not set",
              postal_code: userSettings?.user?.postal_code ? userSettings.user.postal_code.trim() : "Not set",
              tax_id: userSettings?.user?.tax_id ? userSettings.user.tax_id.trim() : "Not set",
              role: userSettings?.user?.role ? userSettings.user.role.trim() : "No role specified",
            };      
            setProfile(mappedProfile);
          }
        }, [userSettings]);
        const handleChange = (e) => {
          const { name, value } = e.target;
          setProfile((prev) => ({ ...prev, [name]: value }));
        };

    const toggleSection = (section) => {
     setEditingSections((prev) => {
      const newEditingState = { ...prev, [section]: !prev[section] };
      if (!prev[section]) {
        setProfile({
          firstname: userSettings?.user?.firstname || "",
          lastname: userSettings?.user?.lastname || "",
          username: userSettings?.user?.username || "",
          email: userSettings?.user?.email || "",
          role: userSettings?.user?.role || "",
          phone: userSettings?.user?.phone || "",
          country: userSettings?.user?.country || "",
          role: userSettings?.user?.role || "",
          tax_id: userSettings?.user?.tax_id || "",
          city: userSettings?.user?.city || "",
          state: userSettings?.user?.state || "",
          postal_code: userSettings?.user?.postal_code || "",
        });
      }
      return newEditingState;
    });
  };
  
  const isEditing = Object.values(editingSections).some(Boolean);
  const handleSaveAll = async () => {  
    try {
      const updated = await updateSettings(profile);  // ✅ wait for API call to finish
  
      if (updated) {
        setUserSettings(updated); // ✅ set updated user from response (not local profile)
      }
      setEditingSections({
        header: false,
        personal: false,
        address: false,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
    }
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
          value={profile[name] || ""}
          onChange={handleChange}
          className="field-input"
        />
      ) : (
        <span className="field-value">{profile[name] || "Not Available"}</span>
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
              {editingSections.header ? (
                "Cancel ❌"
              ) : (
                <>
                  Edit <FontAwesomeIcon icon={faPenToSquare} style={{ marginLeft: "6px" }} />
                </>
              )}
            </button>
          </div>
          <div className="profile-header">
       
  <div className="left" style={{ display: "flex", gap: "16px" }}>
  {editingSections.header ? (
    <input
      type="text"
      name="profileImage"
      value={profile.profileImage || ""}
      onChange={handleChange}
      className="field-input"
      style={{ width: "100px" }}
    />
  ) : (
    <img
      src={profile.profileImage || "https://via.placeholder.com/100"}
      alt="Profile"
      className="profile-image"
    />
  )}
  <div>
    {editingSections.header ? (
      <>
        <input
          type="text"
          name="firstname"
          value={profile.firstname || ""}
          onChange={handleChange}
          className="field-input"
          placeholder="Name"
        />
        <input
          type="text"
          name="lastname"
          value={profile.lastname  || ""}
          onChange={handleChange}
          className="field-input"
          placeholder="Last Name"
        />
        <input
          type="text"
          name="username"
          value={profile?.username || ""}
          onChange={handleChange}
          className="field-input"
          placeholder="Username"
        />
        <input
          type="text"
          name="role"
          value={profile.role  || ""}
          onChange={handleChange}
          className="field-input"
          placeholder="Role"
        />
         <input
          type="text"
          name="city"
          value={profile.city  || ""}
          onChange={handleChange}
          className="field-input"
          placeholder="City"
        />
      </>
    ) : (
      <>
        <h3>{userSettings?.user?.firstname  || "First Name"} {userSettings?.user?.lastname|| ""}</h3>
        <p><strong>Username:</strong> {userSettings?.user?.username || "Not set"}</p>
        <p><strong>Role:</strong> {userSettings?.user?.role || "No role specified"}</p>
        <p><strong>City:</strong>{userSettings?.user?.city || "Not set"}</p>
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
              {editingSections.personal ? (
                "Cancel ❌"
              ) : (
                <>
                  Edit <FontAwesomeIcon icon={faPenToSquare} style={{ marginLeft: "6px" }} />
                </>
              )}
            </button>
          </div>
          <div className="profile-fields">
            {renderField( "Email Address",  "email")}
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
              {editingSections.address ? (
                "Cancel ❌"
              ) : (
                <>
                  Edit <FontAwesomeIcon icon={faPenToSquare} style={{ marginLeft: "6px" }} />
                </>
              )}
            </button>
          </div>
          <div className="profile-fields">
            {renderField("Country", "country")}
            {renderField("City/State", "city")}
            {renderField("Postal Code", "postal_code")}
            {renderField("TAX ID", "tax_id")}
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

export default MyProfile;
