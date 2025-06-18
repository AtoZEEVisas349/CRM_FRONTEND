import React, { useEffect, useState } from "react";
import { usePermissionContext } from "../../context/PermissionContext";
import RequirePermission from "./RequirePermission";

const PageAccessControl = () => {
  const {
    fetchUsers,
    createPermission,
    fetchAllRolePermissions,
    fetchSinglePermission,
    togglePermission,
  } = usePermissionContext();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(""); // Stores "id-role" (e.g., "4-Manager")
  const [selectedRole, setSelectedRole] = useState("");
  const [createStatus, setCreateStatus] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const [pageAccess, setPageAccess] = useState({});
  const [emailPreferences, setEmailPreferences] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({});

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider">
        <span className="toggle-label">{checked ? "On" : "Off"}</span>
      </span>
    </label>
  );

  // Fetch users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const data = await fetchUsers();
        const parsedUsers = Array.isArray(data) ? data : data.users || [];
        setUsers(parsedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchAllUsers();
  }, []);

  // Create permission
  const handleCreatePermission = async () => {
    if (!selectedUser || !selectedRole) {
      setCreateStatus("Please select both user and role.");
      return;
    }

    // Parse selectedUser (e.g., "4-Manager")
    const [id, role] = selectedUser.split("-");
    if (!id || !role) {
      setCreateStatus("Invalid selection.");
      return;
    }

    const selectedUserObj = users.find(
      (u) => String(u.id) === String(id) && u.label.includes(role)
    );
    if (!selectedUserObj) {
      setCreateStatus("Invalid user selected.");
      return;
    }

    const roleLower = selectedRole.toLowerCase();
    const payload = {
      manager_id: roleLower === "manager" ? Number(id) : null,
      hr_id: roleLower === "hr" ? Number(id) : null,
      user_id:
        roleLower === "tl" || roleLower === "executive" ? Number(id) : null,
      role: selectedRole,
    };

    console.log("Permission payload:", payload); // Debug payload

    try {
      await createPermission(payload);
      setCreateStatus("Permission created successfully!");
      setSelectedUser("");
      setSelectedRole("");
    } catch (err) {
      console.error("Failed to create permission:", err);
      setCreateStatus("Failed to create permission.");
    }
  };

  // Fetch all permissions for dropdown
  useEffect(() => {
    const fetchAllPermissions = async () => {
      try {
        const data = await fetchAllRolePermissions();
        setPermissions(data);
      } catch (err) {
        console.error("Error fetching role permissions:", err);
      }
    };

    fetchAllPermissions();
  }, [createStatus]);

  // Fetch selected permission details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedPermission?.id) return;

      try {
        const data = await fetchSinglePermission(selectedPermission.id);
        const permission = data.permission;

        const newPageAccess = {};
        const newEmailPreferences = {};
        const newNotificationSettings = {};

        const pageKeys = [
          "overview",
          "assign_task",
          "task_management",
          "monitoring",
          "executive_details",
          "invoice",
          "dashboard",
          "user_management",
          "reporting",
          "settings",
          "billing",
          "page_access",
        ];
        const emailKeys = [
          "weekly_summary",
          "account_updates",
          "marketing_emails",
        ];
        const notificationKeys = [
          "push_notifications",
          "sms_notifications",
          "email_notifications",
        ];

        Object.entries(permission).forEach(([key, value]) => {
          if (pageKeys.includes(key)) newPageAccess[key] = value;
          else if (emailKeys.includes(key)) newEmailPreferences[key] = value;
          else if (notificationKeys.includes(key))
            newNotificationSettings[key] = value;
        });

        setPageAccess(newPageAccess);
        setEmailPreferences(newEmailPreferences);
        setNotificationSettings(newNotificationSettings);
      } catch (err) {
        console.error("Error loading permission details:", err);
      }
    };

    fetchDetails();
  }, [selectedPermission]);

  // Handle toggle update
  const handleToggle = async (funcKey, role) => {
    if (!selectedPermission?.id) {
      alert("Please select a permission first");
      return;
    }

    const permissionKey = funcKey.toLowerCase().replace(" ", "_");
    const allKeys = {
      page: [
        "dashboard",
        "task_management",
        "user_management",
        "assign_task",
        "monitoring",
        "executive_details",
        "reporting",
        "settings",
        "billing",
        "invoice",
        "page_access",
      ],
      email: ["weekly_summary", "account_updates", "marketing_emails"],
      notification: [
        "push_notifications",
        "sms_notifications",
        "email_notifications",
      ],
    };

    let setState, currentState;
    if (allKeys.page.includes(permissionKey)) {
      setState = setPageAccess;
      currentState = pageAccess[permissionKey] || false;
    } else if (allKeys.email.includes(permissionKey)) {
      setState = setEmailPreferences;
      currentState = emailPreferences[permissionKey] || false;
    } else if (allKeys.notification.includes(permissionKey)) {
      setState = setNotificationSettings;
      currentState = notificationSettings[permissionKey] || false;
    } else {
      console.error("Invalid permission key:", permissionKey);
      return;
    }

    try {
      await togglePermission(selectedPermission.id, permissionKey);
      setState((prev) => ({ ...prev, [permissionKey]: !currentState }));
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const roleSuffix = selectedPermission?.role?.toLowerCase() || "";

  return (
  <RequirePermission requiredKey="page_access">
    <div className="section-block">
      <div className="create-permission-section" style={{ marginTop: "20px" }}>
        <h3>Create New Permission</h3>
        <div className="form-row">
          <select
            value={selectedUser}
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (!selectedValue) {
                setSelectedUser("");
                setSelectedRole("");
                return;
              }
              const [id, role] = selectedValue.split("-");
              const selectedUserObj = users.find(
                (u) => String(u.id) === String(id) && u.label.includes(role)
              );
              if (selectedUserObj) {
                setSelectedUser(selectedValue);
                setSelectedRole(role);
              }
            }}
          >
            <option value="">Select User</option>
            {users.map((user) => {
              const match = user.label.match(/id\s*-\s*(\d+)\s*-\s*(\w+)/i);
              const role = match ? match[2].trim() : "";
              const value = `${user.id}-${role}`;
              return (
                <option key={value} value={value}>
                  {user.label}
                </option>
              );
            })}
          </select>

          <button className="primary-btn" onClick={handleCreatePermission}>
            Grant Access
          </button>
        </div>

        {createStatus && (
          <p
            style={{
              marginTop: "10px",
              color: createStatus.includes("success") ? "green" : "red",
            }}
          >
            {createStatus}
          </p>
        )}
      </div>

      <div className="create-permission-section" style={{ marginTop: "20px" }}>
        <h3>Select From Existing Permissions</h3>
        <select
          value={selectedPermission?.id || ""}
          onChange={(e) => {
            const selected = permissions.find((p) => p.id === e.target.value);
            setSelectedPermission(selected);
          }}
        >
          <option value="">Select Permissions for users</option>
          {permissions.map((perm) => (
            <option key={perm.id} value={perm.id}>
              {perm.label}
            </option>
          ))}
        </select>
      </div>

      {selectedPermission && (
        <div className="access-control-table" style={{ marginTop: "20px" }}>
          <div className="table-header">
            <div className="header-cell">Functionalities</div>
            <div className="header-cell">{selectedPermission.role}</div>
          </div>

          {[
            {
              title: "Page Access",
              keys: [
                "Dashboard",
                "Task Management",
                "User Management",
                "Assign Task",
                "Monitoring",
                "Executive Details",
                "Reporting",
                "Settings",
                "Billing",
                "Invoice",
                "Page Access"
              ],
              state: pageAccess,
            },
            {
              title: "Email Preferences",
              keys: ["Weekly Summary", "Account Updates", "Marketing Emails"],
              state: emailPreferences,
            },
            {
              title: "Notification Settings",
              keys: [
                "Push Notifications",
                "SMS Notifications",
                "Email Notifications",
              ],
              state: notificationSettings,
            },
          ].map(({ title, keys, state }) => (
            <div className="functionality-group" key={title}>
              <div className="group-title">{title}</div>
              {keys.map((func) => (
                <div className="table-row" key={`${title}-${func}`}>
                <div className="row-cell functionality">{func}</div>
                  <div className="row-cell">
                    <ToggleSwitch
                      checked={
                        state[func.toLowerCase().replace(" ", "_")] || false
                      }
                      onChange={() => handleToggle(func, roleSuffix)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
    </RequirePermission>
  );
};

export default PageAccessControl;