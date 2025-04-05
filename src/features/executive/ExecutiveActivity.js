// import React from "react";
// import { FaCoffee, FaBriefcase, FaPhone } from "react-icons/fa";

// const ExecutiveActivity = () => {
//   const activities = [
//     { name: "Break Time", value: 15, icon: <FaCoffee />, color: "#8b5cf6" },
//     { name: "Work Time", value: 50, icon: <FaBriefcase />, color: "#6d28d9" },
//     { name: "Daily Call Time", value: 30, icon: <FaPhone />, color: "#a78bfa" },
//   ];

//   return (
//     <div className="executive-activity">
//       <h2 className="e-section-title">Executive Activity</h2>
//       {activities.map((activity, index) => (
//         <div key={index} className="activity-item">
//           <div className="activity-label">
//             <span className="activity-icon" style={{ color: activity.color }}>
//               {activity.icon}
//             </span>
//             <span className="activity-name">{activity.name}</span>
//             <span className="activity-percentage">{activity.value}%</span>
//           </div>
//           <div className="activity-progress">
//             <div
//               className="progress-fill"
//               style={{
//                 width: `${activity.value}%`,
//                 backgroundColor: activity.color,
//               }}
//             ></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ExecutiveActivity;
