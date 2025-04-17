// // src/pages/NotificationPage.js
// import React, { useEffect, useState } from "react";
// import "../../styles/notification.css";

// function Notification() {
//   const [notifications, setNotifications] = useState([]);

// //   useEffect(() => {
// //     const getNotifications = async () => {
// //       try {
// //         const data = await fetchNotifications();

// //         const mappedNotifications = data.map((notification) => ({
// //           id: notification.id,
// //           title: "📩 New Lead Assigned",
// //           message: notification.message || "You have a new notification.",
// //           time: new Date(notification.createdAt).toLocaleString("en-IN", {
// //             day: "2-digit",
// //             month: "2-digit",
// //             year: "numeric",
// //             hour: "2-digit",
// //             minute: "2-digit",
// //             second: "2-digit",
// //             hour12: true,
// //           }),
// //         }));

// //         setNotifications(mappedNotifications);
// //       } catch (error) {
// //         console.error("Error fetching notifications:", error);
// //       }
// //     };

// //     getNotifications();
// //   }, []);

// //   const handleDelete = async (id) => {
// //     try {
// //       await deleteNotificationAPI(id);
// //       setNotifications((prev) => prev.filter((note) => note.id !== id));
// //     } catch (error) {
// //       console.error("Failed to delete notification:", error);
// //     }
// //   };

//   return (
//     <div className="notification-container">
//       <h2>Notifications</h2>
//       {notifications.length === 0 ? (
//         <p className="empty-msg">No notifications to show</p>
//       ) : (
//         <ul className="notification-list">
//           {notifications.map((note) => (
//             <li className="notification-card" key={note.id}>
//               <div className="notification-header">
//                 <strong>{note.title}</strong>
//                 <span className="notification-time">{note.time}</span>
//               </div>
//               <p className="notification-message">{note.message}</p>
//               <button
//                 className="delete-notification-btn"
//                 onClick={() => handleDelete(note.id)}
//                 title="Delete notification"
//               >
//                 🗑
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default Notification;
