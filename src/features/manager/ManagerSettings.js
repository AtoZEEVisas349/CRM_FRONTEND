

import React, { useState, useEffect, useRef } from "react";
import "../../styles/adminsettings.css";
import SidebarToggle from "../admin/SidebarToggle";
import PageAccessControl from "../admin-settings/PageAccessControl";
import { useApi } from "../../context/ApiContext";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";
import { Alert, soundManager } from "../modal/alert";

const ManagerSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { getManager, updateManagerProfile, managerProfile, managerLoading, setManagerProfile } = useApi();
  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const hasLoaded = useRef(false);
  const [alerts, setAlerts] = useState([]); // Added for alert.js integration

  useEffect(() => {
    const init = async () => {
      if (hasLoaded.current) return;
      hasLoaded.current = true;

      try {
        showLoader("Loading Manager profile...", "admin");
        await getManager();
      } catch (err) {
        console.error("Failed to load Manager profile:", err);
        setAlerts([
          ...alerts,
          {
            id: Date.now(),
            type: "error",
            title: "Load Failed",
            message: "Failed to load Manager profile: " + (err.message || "Unknown error"),
            duration: 5000,
          },
        ]);
        soundManager.playSound("error");
      } finally {
        hideLoader();
      }
    };

    init();
  }, [getManager]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      await updateManagerProfile(currentUser.id, {
        name: managerProfile.name,
        email: managerProfile.email,
        username: managerProfile.username,
        jobTitle: managerProfile.jobTitle,
      });
      setAlerts([
        ...alerts,
        {
          id: Date.now(),
          type: "success",
          title: "Profile Updated",
          message: "Manager profile updated successfully!",
          duration: 5000,
        },
      ]);
      soundManager.playSound("success");
    } catch (err) {
      console.error("Update failed:", err);
      setAlerts([
        ...alerts,
        {
          id: Date.now(),
          type: "error",
          title: "Update Failed",
          message: "Failed to update Manager profile",
          duration: 5000,
        },
      ]);
      soundManager.playSound("error");
    }
  };

  // Handle alert close
  const handleAlertClose = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
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
                    value={managerProfile?.name || ""}
                    onChange={(e) => setManagerProfile({ ...managerProfile, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={managerProfile?.email || ""}
                    onChange={(e) => setManagerProfile({ ...managerProfile, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" value={managerProfile?.username || ""} readOnly />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" value={managerProfile?.role || ""} readOnly />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={managerProfile?.jobTitle || ""}
                    onChange={(e) => setManagerProfile({ ...managerProfile, jobTitle: e.target.value })}
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
      <Alert alerts={alerts} onClose={handleAlertClose} />
    </div>
  );
};

export default ManagerSettings;