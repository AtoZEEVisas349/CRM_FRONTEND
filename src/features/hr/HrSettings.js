import React, { useState, useEffect, useRef } from "react";
import "../../styles/adminsettings.css";
import SidebarToggle from "../admin/SidebarToggle";
import PageAccessControl from "../admin-settings/PageAccessControl";
import { useApi } from "../../context/ApiContext";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";

const HrSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { fetchHrUserData, updateHrProfileById } = useApi();
  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const hasLoaded = useRef(false);

  const [hrProfile, setHrProfile] = useState({
    id: "",
    name: "", 
    email: "",
    username: "",
    role: "",
    jobTitle: "",
  });

  useEffect(() => {
  const handleSidebarToggle = () => {
    const expanded = localStorage.getItem("adminSidebarExpanded") !== "false";
    document.body.classList.toggle("sidebar-collapsed", !expanded);
    document.body.classList.toggle("sidebar-expanded", expanded);
  };

  handleSidebarToggle();
  window.addEventListener("sidebarToggle", handleSidebarToggle);

  const init = async () => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    try {
      showLoader("Loading HR profile...", "admin");
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser?.id) throw new Error("No HR ID found");

      const hrData = await fetchHrUserData(currentUser.id);
      setHrProfile({
        id: hrData.id || "",
        name: hrData.name || "",
        email: hrData.email || "",
        username: hrData.username || "", // Handle null
        role: hrData.role || "",
        jobTitle: hrData.jobTitle || "", // Handle null
      });
    } catch (err) {
      console.error("Failed to load HR profile:", err);
    } finally {
      hideLoader();
    }
  };

  init();

  return () => {
    window.removeEventListener("sidebarToggle", handleSidebarToggle);
  };
}, [fetchHrUserData]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateHrProfileById(hrProfile.id, {
        name: hrProfile.name,
        email: hrProfile.email,
        username: hrProfile.username,
        jobTitle: hrProfile.jobTitle,

      });
      alert("HR profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update HR profile");
    }
  };

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "password", label: "Password" },
    { key: "pageAccess", label: "Page Access Controller" },
    { key: "team", label: "Team" },
    { key: "plan", label: "Plan" },
    { key: "billing", label: "Billing" },
    { key: "integrations", label: "Integrations" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "pageAccess":
        return <PageAccessControl />;
      case "plan":
        return (
          <div className="blur-overlay-wrapper">
            <div className="section-block">
              <h3>Current Plan</h3>
              <p>
                You are on the <strong>Pro</strong> plan. Next billing: <strong>May 10, 2025</strong>
              </p>
              <button className="primary-btn">Upgrade Plan</button>
            </div>
          </div>
        );
      case "billing":
        return (
          <div className="blur-overlay-wrapper">
            <div className="section-block">
              <h3>Billing History</h3>
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>April 10</td>
                    <td>$49</td>
                    <td>Paid</td>
                    <td><button className="mini-btn">Download</button></td>
                  </tr>
                  <tr>
                    <td>March 10</td>
                    <td>$49</td>
                    <td>Paid</td>
                    <td><button className="mini-btn">Download</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "team":
        return (
          <div className="blur-overlay-wrapper">
            <div className="section-block">
              <h3>Team Members</h3>
              <ul className="team-list">
                {[
                  { id: 1, name: "Sakshi Verma", email: "sakshi@example.com", role: "Executive" },
                  { id: 2, name: "Rohan Malhotra", email: "rohan@example.com", role: "Manager" },
                  { id: 3, name: "Neha Sinha", email: "neha@example.com", role: "Admin" },
                ].map((member) => (
                  <li key={member.id}>
                    <span><strong>ID:</strong> {member.id}</span>
                    <span><strong>Name:</strong> {member.name}</span>
                    <span><strong>Email:</strong> {member.email}</span>
                    <span><strong>Role:</strong> {member.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "integrations":
        return (
          <div className="blur-overlay-wrapper">
            <div className="section-block">
              <h3>Connected Apps</h3>
              <ul className="integration-list">
                <li>Slack <button className="mini-btn">Disconnect</button></li>
                <li>Google Drive <button className="mini-btn">Disconnect</button></li>
                <li>Connect new <button className="mini-btn">Add Integration</button></li>
              </ul>
            </div>
          </div>
        );
      case "password":
        return (
          <>
            <h3>Change Password</h3>
            <p>This section is under development.</p>
          </>
        );
      case "profile":
default:
  return (
    <>
      <h3>Profile</h3>
      <form className="profile-form" onSubmit={handleProfileSubmit}>
        <div className="form-group full profile-pic">
          <label>Your Photo</label>
          <div className="pic-wrapper">
            <img src="https://via.placeholder.com/80" alt="Profile" />
            <div className="pic-actions">
              <button type="button">Delete</button>
              <button type="button">Update</button>
            </div>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={hrProfile.name}
              onChange={(e) => setHrProfile({ ...hrProfile, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={hrProfile.email}
              onChange={(e) => setHrProfile({ ...hrProfile, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={hrProfile.username || ""} // Ensure null is handled
              onChange={(e) => setHrProfile({ ...hrProfile, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" value={hrProfile.role} readOnly />
          </div>
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              value={hrProfile.jobTitle || ""} // Ensure null is handled
              onChange={(e) => setHrProfile({ ...hrProfile, jobTitle: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group full save-btn-wrapper">
          <button className="save-btn" type="submit">Save Changes</button>
        </div>
      </form>
    </>
  );
    }
  };

  return (
    <div className="admin-settings">
      <SidebarToggle />
      {isLoading && variant === "admin" && (
        <AdminSpinner text="Loading Settings..." />
      )}
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="settings-card">{renderTabContent()}</div>
    </div>
  );
};

export default HrSettings;

