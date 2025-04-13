import React, { useEffect, useState } from "react";
import { FaCoffee, FaBriefcase, FaPhone } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";

const ExecutiveActi = ({ selectedExecutiveId, executiveName }) => {
  const { activityData, getExecutiveActivity } = useApi();
 

  useEffect(() => {
    getExecutiveActivity(selectedExecutiveId);
  }, [selectedExecutiveId]);

  const activities = [
    { name: "Break Time", value: activityData.breakTime, icon: <FaCoffee />, color: "#8b5cf6" },
    { name: "Work Time", value: activityData.workTime, icon: <FaBriefcase />, color: "#6d28d9" },
    { name: "Daily Call Time", value: activityData.callTime, icon: <FaPhone />, color: "#a78bfa" },
  ];

  return (
    <div className="exec-activity">
      <h2 className="exec-section-title">
        <span>Executive Activity</span>
        <span className="executive-name">{executiveName || "Loading..."}</span>
      </h2>
      {activities.map((activity, index) => (
        <div key={index} className="activity-item">
          <div className="activity-label">
            <span className="activity-icon">
              {activity.icon}
            </span>
            <span className="activity-name">{activity.name}</span>
            <span className="activity-percentage">{activity.value}%</span>
          </div>
          <div className="activity-progress">
            <div
              className="progress-fill"
              style={{
                width: `${activity.value}%`,
                backgroundColor: activity.color,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExecutiveActi;
