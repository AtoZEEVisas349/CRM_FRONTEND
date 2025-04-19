import React, { useEffect } from "react";
import { useApi } from "../../context/ApiContext"; // ✅ Import context hook
import "../../styles/notification.css";

function Notification() {
  const {
    notifications,
    notificationsLoading,
    fetchNotifications,
  } = useApi(); // ✅ Use context

  // ✅ Fetch notifications on mount
  useEffect(() => {
    const uid = localStorage.getItem("executiveId");
    if (uid) fetchNotifications(uid);
  }, [fetchNotifications]);

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      {notificationsLoading ? (
        <p className="loading-msg">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="empty-msg">No notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((n, index) => (
            <li className="notification-card" key={n.id}>
                <div className="notification-header">
                <strong>New Lead Assigned</strong>
                <span className="notification-time">
                    {new Date(n.createdAt).toLocaleTimeString()}
                </span>
                </div>
                <p className="notification-message">
                You have been assigned a new lead #{index + 1}
                </p>
            </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;
