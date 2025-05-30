import React, { useEffect, useState, useMemo } from "react";
import { useApi } from "../../context/ApiContext";
import "../../styles/adminNotification.css";

function AdminNotification() {
  const {
    notifications = [],
    notificationsLoading,
    fetchNotifications,
    markNotificationReadAPI,
  } = useApi();
  const [activeTab, setActiveTab] = useState("notifications");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);

  useEffect(() => {
    if (user?.id && user?.role) {
      fetchNotifications({ userId: user.id, userRole: user.role });
    }
  }, [fetchNotifications, user?.id, user?.role]);

  // Pagination calculations
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const currentNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationReadAPI(notificationId);
  };

  return (
    <div className="admin-notification-wrapper">
      <h2 className="admin-notification-title">Notifications</h2>
      <div className="admin-tab-buttons">
  <button
    className={`admin-tab-btn ${activeTab === "notifications" ? "active" : ""}`}
    onClick={() => setActiveTab("notifications")}
  >
    Notifications
  </button>
  <button
    className={`admin-tab-btn ${activeTab === "meetings" ? "active" : ""}`}
    onClick={() => setActiveTab("meetings")}
  >
    Meetings
  </button>
</div>

{notificationsLoading ? (
  <p className="admin-notification-loading">Loading notifications...</p>
) : activeTab === "notifications" ? (
  <div className="admin-notification-content">
  <ul className="admin-notification-list">
    {currentNotifications
      .filter(n => !n.message.toLowerCase().includes("meeting")) // filter out meeting notifications
      .map((n) => {
        const [title, messageBody] = n.message.split(":");
        return (
          <li
            key={n.id}
            className={`admin-notification-item ${n.is_read ? "admin-notification-read" : ""}`}
          >
            <div className="admin-notification-item-header">
              <strong>{title?.trim()}</strong>
              <div className="admin-notification-meta">
                <span className="admin-notification-time">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </span>
                <label className="admin-notification-checkbox">
                  <input
                    type="checkbox"
                    checked={n.is_read}
                    disabled={n.is_read}
                    onChange={() => handleMarkAsRead(n.id)}
                  />
                  Mark as read
                </label>
              </div>
            </div>
            <p className="admin-notification-message">
              {messageBody?.trim()}
            </p>
          </li>
        );
      })}
  </ul>
</div>

) : (
  <div className="admin-meeting-notification-content">
    <ul className="admin-notification-list">
      {notifications
        .filter(n => n.message.toLowerCase().includes("meeting"))
        .map(n => {
          const [title, messageBody] = n.message.split(":");
          return (
            <li
              key={n.id}
              className={`admin-notification-item ${n.is_read ? "admin-notification-read" : ""}`}
            >
              <div className="admin-notification-item-header">
                <strong>{title?.trim()}</strong>
                <div className="admin-notification-meta">
                  <span className="admin-notification-time">
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                  <label className="admin-notification-checkbox">
                    <input
                      type="checkbox"
                      checked={n.is_read}
                      disabled={n.is_read}
                      onChange={() => handleMarkAsRead(n.id)}
                    />
                    Mark as read
                  </label>
                </div>
              </div>
              <p className="admin-notification-message">{messageBody?.trim()}</p>
            </li>
          );
        })}
    </ul>
  </div>
)}


          {/* Pagination */}
          <div className="admin-notification-pagination">
            <button
              className="admin-notification-pagination-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="admin-notification-page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="admin-notification-pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

  );
}

export default AdminNotification;