import React, { useState, useEffect } from "react";
import "../../styles/adminsettings.css";
import { FaBars } from "react-icons/fa"; 
import SidebarToggle from "../admin/SidebarToggle";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [bio, setBio] = useState("");
  const [showJobTitle, setShowJobTitle] = useState(false);
  const [pageAccess, setPageAccess] = useState({
    overview: true,
    assignTask: true,
    taskManagement: false,
    monitoring: true,
    executiveDetails: false,
    invoice: true,
  });

  useEffect(() => {
    const handleSidebarToggle = () => {
      const expanded = localStorage.getItem("adminSidebarExpanded") !== "false";
      document.body.classList.toggle("sidebar-collapsed", !expanded);
      document.body.classList.toggle("sidebar-expanded", expanded);
    };

    handleSidebarToggle();
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  const tabs = [
    "profile", "password", "security",
    "team", "plan", "billing",
    "email", "notifications", "integrations"
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "security":
        return (
          <div className="section-block">
            <h3>Page Access Control</h3>
            {Object.entries(pageAccess).map(([page, access]) => (
              <label key={page} className="form-group">
                <input
                  type="checkbox"
                  checked={access}
                  onChange={() =>
                    setPageAccess(prev => ({ ...prev, [page]: !prev[page] }))
                  }
                />
                {page.charAt(0).toUpperCase() + page.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
            ))}
          </div>
        );
      case "team":
        return (
          <div className="section-block">
            <h3>Team Members</h3>
            <ul className="team-list">
              <li><strong>Olivia Rhye</strong> – Admin</li>
              <li><strong>James Doe</strong> – Manager</li>
              <li><strong>Invite new member</strong> <button className="mini-btn">Invite</button></li>
            </ul>
          </div>
        );
      case "plan":
        return (
          <div className="section-block">
            <h3>Current Plan</h3>
            <p>You are on the <strong>Pro</strong> plan. Next billing: <strong>May 10, 2025</strong></p>
            <button className="primary-btn">Upgrade Plan</button>
          </div>
        );
      case "billing":
        return (
          <div className="section-block">
            <h3>Billing History</h3>
            <table className="billing-table">
              <thead>
                <tr><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td>April 10</td><td>$49</td><td>Paid</td><td><button className="mini-btn">Download</button></td></tr>
                <tr><td>March 10</td><td>$49</td><td>Paid</td><td><button className="mini-btn">Download</button></td></tr>
              </tbody>
            </table>
          </div>
        );
      case "email":
        return (
          <div className="section-block">
            <h3>Email Preferences</h3>
            <label><input type="checkbox" /> Weekly summary</label><br />
            <label><input type="checkbox" /> Important account updates</label><br />
            <label><input type="checkbox" /> Marketing emails</label>
          </div>
        );
      case "notifications":
        return (
          <div className="section-block">
            <h3>Notification Settings</h3>
            <label><input type="checkbox" /> Push notifications</label><br />
            <label><input type="checkbox" /> SMS alerts</label><br />
            <label><input type="checkbox" /> Email reminders</label>
          </div>
        );
      case "integrations":
        return (
          <div className="section-block">
            <h3>Connected Apps</h3>
            <ul className="integration-list">
              <li>Slack <button className="mini-btn">Disconnect</button></li>
              <li>Google Drive <button className="mini-btn">Disconnect</button></li>
              <li>Connect new <button className="mini-btn">Add Integration</button></li>
            </ul>
          </div>
        );
      case "password":
        return (
          <>
            <h3>Change Password</h3>
            <form className="profile-form">
              <div className="form-group full">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="New password" />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="Confirm password" />
                </div>
              </div>
              <div className="form-group full save-btn-wrapper">
                <button className="save-btn" type="submit">Update Password</button>
              </div>
            </form>
          </>
        );
      case "profile":
      default:
        return (
          <>
            <h3>Profile</h3>
            <form className="profile-form">
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
                <div className="form-group"><label>Full Name</label><input type="text" placeholder="John Doe" /></div>
                <div className="form-group"><label>Email Address</label><input type="email" placeholder="admin@example.com" /></div>
                <div className="form-group"><label>Username</label><input type="text" placeholder="admin123" /></div>
                <div className="form-group"><label>Website</label><input type="url" placeholder="https://yourwebsite.com" /></div>
                <div className="form-group"><label>Job Title</label><input type="text" placeholder="CRM Admin" /></div>
                <div className="form-group"><label>Alternate Email</label><input type="email" placeholder="alternate@example.com" /></div>
              </div>
              <div className="form-group full">
                <label>Your Bio</label>
                <textarea
                  rows="4"
                  maxLength={275}
                  placeholder="Write a short bio..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <small>{275 - bio.length} characters left</small>
              </div>
              <div className="form-group full">
                <label>
                  <input
                    type="checkbox"
                    checked={showJobTitle}
                    onChange={(e) => setShowJobTitle(e.target.checked)}
                  />
                  Show my job title in my profile
                </label>
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
      {/* Here is the Sidebar Toggle Button */}
      <SidebarToggle />

      <div className="settings-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="settings-card">{renderTabContent()}</div>
    </div>
  );
};

export default AdminSettings;
