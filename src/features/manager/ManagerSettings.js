

import React, { useState, useEffect, useRef } from "react";
import "../../styles/adminsettings.css";
import SidebarToggle from "../admin/SidebarToggle";
import PageAccessControl from "../admin-settings/PageAccessControl";
import { useApi } from "../../context/ApiContext";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";

const ManagerSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { getManager, updateManagerProfile, managerProfile, managerLoading , setManagerProfile} = useApi();
  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const hasLoaded = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (hasLoaded.current) return;
      hasLoaded.current = true;

      try {
        showLoader("Loading Manager profile...", "admin");
        await getManager();
      } catch (err) {
        console.error("Failed to load Manager profile:", err);
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
      alert("Manager profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update Manager profile");
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
      // Other cases remain the same
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
    </div>
  );
};

export default ManagerSettings;