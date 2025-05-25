import React, { useEffect, useState } from "react";
import { useApi } from "../../context/ApiContext";
import "../../styles/notification.css";

function Notification() {
  const {
    notifications,
    notificationsLoading,
    fetchNotifications,
    markNotificationReadAPI,
  } = useApi();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      fetchNotifications({ userId: user.id, userRole: user.role }); // Pass both id and role
    }
  }, [fetchNotifications]);

  const handleMarkAsRead = (notificationId) => {
    markNotificationReadAPI(notificationId);
  };

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const currentNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="notification-container">
      <h2>Notifications</h2>

      {notificationsLoading ? (
        <p className="loading-msg">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="empty-msg">No notifications</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <ul className="notification-list">
            {currentNotifications.map((n, index) => (
              <li
              className={`notification-card ${n.is_read ? "read" : ""}`}
              key={n.id}
              >
                <div className="notification-header">
                  <strong>{n.message.split(":")[0].trim()}</strong>
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
                  {/* You have been assigned a new lead # */}
                  {n.message.split(":")[1].trim()}
                  {/* {(currentPage - 1) * itemsPerPage + index + 1} */}
                </p>
              </li>
            ))}
          </ul>

          {/* Pagination pinned at the bottom */}
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

export default Notification;