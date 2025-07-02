import React, { useState, useEffect } from "react";
import { useProcessService } from "../../context/ProcessServiceContext";

const ProcessNotification = () => {
  const { fetchNotifications } = useProcessService();
  const [notificationData, setNotificationData] = useState([]);
  const userRole = localStorage.getItem("userType");

  useEffect(() => {
    if (!userRole) return;

    const getNotifications = async () => {
      if (userRole === "customer") {
        try {
          const response = await fetchNotifications(userRole);
          console.log(response, "res");
          setNotificationData(response.notifications); // ✅ Keep full object
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    getNotifications();
  }, [userRole]);

  return (
    <div className="reminder-container">
      <h1>Reminders</h1>
      {notificationData?.length > 0 ? (
        notificationData.map((item) => (
          <div key={item.id} className="reminder-card">
            <input type="checkbox" className="reminder-checkbox" />
            <div className="reminder-content">
              <h3 className="reminder-title">
                {item.message?.toLowerCase().startsWith("reminder:")
                  ? item.message.slice(9).trim()
                  : item.message}
              </h3>
              <p className="reminder-time">
              🕒 {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
};

export default ProcessNotification;