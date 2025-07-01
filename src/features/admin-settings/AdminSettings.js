import React, { useState, useEffect,useRef } from "react";
import "../../styles/adminsettings.css";
import SidebarToggle from "../admin/SidebarToggle";
import PageAccessControl from "./PageAccessControl";
import { useApi } from "../../context/ApiContext";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";
const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [bio, setBio] = useState("");
  const [showJobTitle, setShowJobTitle] = useState(false);
  const { 
    user,
    fetchUserData,
    handleUpdateProfile,
    handleChangePassword,
    isProfileUpdating,
    isPasswordUpdating
  } = useApi();
  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const hasLoaded = useRef(false); // 👈 prevent double invocation
  useEffect(() => {
    const handleSidebarToggle = () => {
      const expanded = localStorage.getItem("adminSidebarExpanded") !== "false";
      document.body.classList.toggle("sidebar-collapsed", !expanded);
      document.body.classList.toggle("sidebar-expanded", expanded);
    };

    handleSidebarToggle();
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    const init = async () => {
      if (hasLoaded.current) return; // ✅ prevent repeat in dev/strict mode
      hasLoaded.current = true;

      try {
        showLoader("Loading settings...", "admin");
        await fetchUserData();
      } catch (err) {
        console.error("Failed to load user settings:", err);
      } finally {
        hideLoader();
      }
    };
    
    init();

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, [fetchUserData]);

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setShowJobTitle(user.showJobTitle || false);
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleUpdateProfile({
        email: user.email,
        bio,
        showJobTitle
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile");
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
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "",
    website: "",
    jobTitle: "",
    alternateEmail: ""
  });
  
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        email: user.email || "",
        username: user.username || "",
        role: user.role || ""
      }));
    }
  }, [user]);
  
    
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
          {
            id: 1,
            name: "Sakshi Verma",
            email: "sakshi@example.com",
            role: "Executive",
          },
          {
            id: 2,
            name: "Rohan Malhotra",
            email: "rohan@example.com",
            role: "Manager",
          },
          {
            id: 3,
            name: "Neha Sinha",
            email: "neha@example.com",
            role: "Admin",
          },
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
            <form
              className="profile-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const currentPassword = e.target.currentPassword.value;
                const newPassword = e.target.newPassword.value;
                const confirmPassword = e.target.confirmPassword.value;

                if (newPassword !== confirmPassword) {
                  alert("New password and confirm password do not match.");
                  return;
                }

                try {
                  await handleChangePassword(currentPassword, newPassword);
                  alert("Password updated successfully!");
                } catch (err) {
                  alert(err.message || "Something went wrong.");
                }
              }}
            >
              <div className="form-group full">
                <label>Current Password</label>
                <input name="currentPassword" type="password" placeholder="••••••••" required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>New Password</label>
                  <input name="newPassword" type="password" placeholder="New password" required />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input name="confirmPassword" type="password" placeholder="Confirm password" required />
                </div>
              </div>
              <div className="form-group full save-btn-wrapper">
                <button className="save-btn" type="submit" disabled={isPasswordUpdating}>
                  {isPasswordUpdating ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
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
                        value={profile.fullName}
                        onChange={(e) =>
                          setProfile({ ...profile, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                          <label>Email Address</label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
  <label>Username</label>
  <input type="text" value={profile.username} readOnly />
</div>
<div className="form-group">
  <label>Role</label>
  <input type="text" value={profile.role} readOnly />
</div>

                    <div className="form-group">
                      <label>Website</label>
                      <input type="url" value={profile.website} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Job Title</label>
                      <input type="text" value={profile.jobTitle} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Alternate Email</label>
                      <input type="email" value={profile.alternateEmail} readOnly />
                    </div>
                  </div>
                  <div className="form-group full">
                    <label>Your Bio</label>
                    <textarea
                      rows="4"
                      maxLength={275}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a short bio..."
                    />
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

export default AdminSettings;
