import React, { useState, useEffect } from "react";
import "../../styles/adminsettings.css";
import { FaBars } from "react-icons/fa";
import SidebarToggle from "../admin/SidebarToggle";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [bio, setBio] = useState("");
  const [showJobTitle, setShowJobTitle] = useState(false);
 const [pageAccess, setPageAccess] = useState({
  // Page Access Controls
  dashboard_manager: true,
  dashboard_teamlead: true,
  dashboard_hr: false,
  task_management_manager: true,
  task_management_teamlead: true,
  task_management_hr: false,
  user_management_manager: true,
  user_management_teamlead: false,
  user_management_hr: true,
  reporting_manager: true,
  reporting_teamlead: true,
  reporting_hr: false,
  settings_manager: false,
  settings_teamlead: false,
  settings_hr: false,
  billing_manager: false,
  billing_teamlead: false,
  billing_hr: false,
  executive_details_manager: false,
  executive_details_teamlead: false,
  executive_details_hr: false,
  monitoring_manager: true,
  monitoring_teamlead: true,
  monitoring_hr: false,
  invoice_manager: true,
  invoice_teamlead: false,
  invoice_hr: false,
});

const [emailPreferences, setEmailPreferences] = useState({
  // Email Preferences
  weekly_summary_manager: true,
  weekly_summary_teamlead: true,
  weekly_summary_hr: false,
  account_updates_manager: true,
  account_updates_teamlead: false,
  account_updates_hr: true,
  marketing_emails_manager: false,
  marketing_emails_teamlead: false,
  marketing_emails_hr: false,
  system_alerts_manager: true,
  system_alerts_teamlead: true,
  system_alerts_hr: true,
  newsletter_manager: false,
  newsletter_teamlead: false,
  newsletter_hr: false,
});

const [notificationSettings, setNotificationSettings] = useState({
  // Notification Settings
  push_notifications_manager: true,
  push_notifications_teamlead: false,
  push_notifications_hr: false,
  sms_alerts_manager: false,
  sms_alerts_teamlead: false,
  sms_alerts_hr: false,
  email_reminders_manager: true,
  email_reminders_teamlead: true,
  email_reminders_hr: false,
  task_assignments_manager: true,
  task_assignments_teamlead: true,
  task_assignments_hr: false,
  deadline_warnings_manager: true,
  deadline_warnings_teamlead: true,
  deadline_warnings_hr: false,
  approval_requests_manager: true,
  approval_requests_teamlead: false,
  approval_requests_hr: true,
});

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="toggle-switch">
    <input 
      type="checkbox" 
      checked={checked}
      onChange={onChange}
    />
    <span className="slider">
      <span className="toggle-label">{checked ? "On" : "Off"}</span>
    </span>
  </label>
);


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
  { key: "profile", label: "Profile" },
  { key: "password", label: "Password" },
  { key: "pageAccess", label: "Page Access Controller" }, 
  { key: "team", label: "Team" },
  { key: "plan", label: "Plan" },
  { key: "billing", label: "Billing" },
  { key: "integrations", label: "Integrations" }
];

  const renderTabContent = () => {
    switch (activeTab) {
   case "pageAccess":
  return (
    <div className="section-block">
      <div className="access-control-table">
        <div className="table-header">
          <div className="header-cell">Functionalities</div>
          <div className="header-cell">Manager</div>
          <div className="header-cell">Team Lead</div>
          <div className="header-cell">HR</div>
        </div>
        
        {/* Page Access Section */}
        <div className="functionality-group">
          <div className="group-title">Page Access </div>
          {[
            "Dashboard",
            "Task Management",
            "User Management",
            "Reporting",
            "Settings",
            "Billing"
          ].map((func) => (
            <div className="table-row" key={`page-${func}`}>
              <div className="row-cell functionality">{func}</div>
              <div className="row-cell">
                <ToggleSwitch 
                  checked={pageAccess[`${func.toLowerCase().replace(' ', '_')}_manager`] || false}
                  onChange={() => setPageAccess(prev => ({
                    ...prev,
                    [`${func.toLowerCase().replace(' ', '_')}_manager`]: 
                      !prev[`${func.toLowerCase().replace(' ', '_')}_manager`]
                  }))}
                />
              </div>
              <div className="row-cell">
                <ToggleSwitch 
                  checked={pageAccess[`${func.toLowerCase().replace(' ', '_')}_teamlead`] || false}
                  onChange={() => setPageAccess(prev => ({
                    ...prev,
                    [`${func.toLowerCase().replace(' ', '_')}_teamlead`]: 
                      !prev[`${func.toLowerCase().replace(' ', '_')}_teamlead`]
                  }))}
                />
              </div>
              <div className="row-cell">
                <ToggleSwitch 
                  checked={pageAccess[`${func.toLowerCase().replace(' ', '_')}_hr`] || false}
                  onChange={() => setPageAccess(prev => ({
                    ...prev,
                    [`${func.toLowerCase().replace(' ', '_')}_hr`]: 
                      !prev[`${func.toLowerCase().replace(' ', '_')}_hr`]
                  }))}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Email Preferences Section */}
        <div className="functionality-group">
          <div className="group-title">Email Preferences</div>
          {[
            "Weekly Summary",
            "Account Updates",
            "Marketing Emails"
          ].map((func) => (
            <div className="table-row" key={`email-${func}`}>
              <div className="row-cell functionality">{func}</div>
              <div className="row-cell">
                <ToggleSwitch 
                  checked={emailPreferences[`${func.toLowerCase().replace(' ', '_')}_manager`] || false}
                  onChange={() => setEmailPreferences(prev => ({
                    ...prev,
                    [`${func.toLowerCase().replace(' ', '_')}_manager`]: 
                      !prev[`${func.toLowerCase().replace(' ', '_')}_manager`]
                  }))}
                />
              </div>
              <div className="row-cell">
                <ToggleSwitch 
                  checked={emailPreferences[`${func.toLowerCase().replace(' ', '_')}_teamlead`] || false}
                  onChange={() => setEmailPreferences(prev => ({
                    ...prev,
                    [`${func.toLowerCase().replace(' ', '_')}_teamlead`]: 
                      !prev[`${func.toLowerCase().replace(' ', '_')}_teamlead`]
                  }))}
                />
              </div>
              <div className="row-cell">
                <ToggleSwitch 
                  checked={emailPreferences[`${func.toLowerCase().replace(' ', '_')}_hr`] || false}
                  onChange={() => setEmailPreferences(prev => ({
                    ...prev,
                    [`${func.toLowerCase().replace(' ', '_')}_hr`]: 
                      !prev[`${func.toLowerCase().replace(' ', '_')}_hr`]
                  }))}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Notification Settings Section */}
        <div className="functionality-group">
          <div className="group-title">Notification Settings</div>
          {[
            "Push Notifications",
            "SMS Alerts",
            "Email Reminders"
          ].map((func) => (
            <div className="table-row" key={`notif-${func}`}>
              <div className="row-cell functionality">{func}</div>
              <div className="row-cell">
                <ToggleSwitch 
                  checked={notificationSettings[`${func.toLowerCase().replace(' ', '_')}_manager`] || false}
                  onChange={() => setNotificationSettings(prev => ({
                    ...prev,
                    [`${func.toLowerCase().replace(' ', '_')}_manager`]: 
                      !prev[`${func.toLowerCase().replace(' ', '_')}_manager`]
                  }))}
                />
              </div>
              <div className="row-cell">
                <ToggleSwitch 
                  checked={notificationSettings[`${func.toLowerCase().replace(' ', '_')}_teamlead`] || false}
                  onChange={() => setNotificationSettings(prev => ({
                    ...prev,
                    [`${func.toLowerCase().replace(' ', '_')}_teamlead`]: 
                      !prev[`${func.toLowerCase().replace(' ', '_')}_teamlead`]
                  }))}
                />
              </div>
              <div className="row-cell">
                <ToggleSwitch 
                  checked={notificationSettings[`${func.toLowerCase().replace(' ', '_')}_hr`] || false}
                  onChange={() => setNotificationSettings(prev => ({
                    ...prev,
                    [`${func.toLowerCase().replace(' ', '_')}_hr`]: 
                      !prev[`${func.toLowerCase().replace(' ', '_')}_hr`]
                  }))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
      <SidebarToggle />

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