import React, { useEffect, useState } from "react";
import { useApi } from "../../context/ApiContext";
import "../../styles/notification.css";

function Notification() {
  const {
    notifications = [],
    notificationsLoading,
    fetchNotifications,
    markNotificationReadAPI,
  } = useApi();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchNotifications({ userId: user.id, userRole: user.role });
    }
  }, [fetchNotifications]);

  // Group lead assignment notifications
  const groupedLeadAssignments = [];
  const otherNotifications = [];

  const groupKeyFormat = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`;
  };

  const leadGroups = {};

  notifications.forEach((n) => {
    const msg = n.message?.toLowerCase() || "";
    if (msg.includes("you have been assigned a new lead")) {
      const key = groupKeyFormat(n.createdAt);
      if (!leadGroups[key]) {
        leadGroups[key] = {
          id: key,
          createdAt: n.createdAt,
          is_read: n.is_read,
          count: 1,
          originalIds: [n.id],
        };
      } else {
        leadGroups[key].count += 1;
        leadGroups[key].originalIds.push(n.id);
        if (!n.is_read) leadGroups[key].is_read = false;
      }
    } else {
      otherNotifications.push(n);
    }
  });

  Object.values(leadGroups).forEach((group) => {
    groupedLeadAssignments.push({
      id: group.id,
      createdAt: group.createdAt,
      is_read: group.is_read,
      count: group.count,
      originalIds: group.originalIds,
      message: "You have been assigned new lead" + (group.count > 1 ? "s" : ""),
      type: "grouped-leads",
    });
  });

  const finalNotificationList = [...groupedLeadAssignments, ...otherNotifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPages = Math.ceil(finalNotificationList.length / itemsPerPage);
  const currentNotifications = finalNotificationList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMarkAsRead = (notification) => {
    if (notification.type === "grouped-leads") {
      notification.originalIds.forEach((id) => markNotificationReadAPI(id));
    } else {
      markNotificationReadAPI(notification.id);
    }
  };

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
      ) : finalNotificationList.length === 0 ? (
        <p className="empty-msg">No notifications</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <ul className="notification-list">
            {currentNotifications.map((n) => {
              const isGrouped = n.type === "grouped-leads";
              const [title, messageBody] = n.message?.split(":") || [];

              return (
                <li
                  key={n.id}
                  className={`notification-card ${n.is_read ? "read" : ""}`}
                >
                  <div className="notification-header">
                    <strong>
                      {isGrouped ? n.message : title?.trim()}
                    </strong>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </span>
                      <label className="read-checkbox">
                        <input
                          type="checkbox"
                          checked={n.is_read}
                          disabled={n.is_read}
                          onChange={() => handleMarkAsRead(n)}
                        />
                        Mark as read
                      </label>
                    </div>
                  </div>

                  {isGrouped ? (
                    <p style={{ fontWeight: "bold", color: "#6b7280" }}>
                      Count:{n.count}
                    </p>
                  ) : (
                    <p className="notification-message">{messageBody?.trim()}</p>
                  )}
                </li>
              );
            })}
          </ul>

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
