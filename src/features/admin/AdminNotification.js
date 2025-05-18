import React, { useEffect, useState } from "react";
import { useApi } from "../../context/ApiContext";
import "../../styles/notification.css";

function AdminNotification() {
  const {
    notifications,
    notificationsLoading,
    fetchNotifications,
    markNotificationReadAPI,
  } = useApi();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const user = JSON.parse(localStorage.getItem("user"));

  // ------------------------------
  // Effect: Fetch notifications
  // ------------------------------
  useEffect(() => {
    if (user?.id && user?.role) {
      fetchNotifications({ userId: user.id, userRole: user.role });
    }
  }, [fetchNotifications]);

  // ------------------------------
  // Pagination Calculations
  // ------------------------------
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const currentNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // ------------------------------
  // Mark notification as read
  // ------------------------------
  const handleMarkAsRead = (notificationId) => {
    markNotificationReadAPI(notificationId);
  };

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="notification-container">
      <h2>Notifications</h2>

      {notificationsLoading ? (
        <p className="loading-msg">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="empty-msg">No notifications</p>
      ) : (
        <div className="notification-content">
          <ul className="notification-list">
            {currentNotifications.map((n) => {
              const [title, messageBody] = n.message.split(":");
              return (
                <li
                  key={n.id}
                  className={`notification-card ${n.is_read ? "read" : ""}`}
                >
                  <div className="notification-header">
                    <strong>{title?.trim()}</strong>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </span>
                      <label className="read-checkbox">
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
                  <p className="notification-message">
                    Executive {n.userId} copied {messageBody?.trim()}
                  </p>
                </li>
              );
            })}
          </ul>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotification;
