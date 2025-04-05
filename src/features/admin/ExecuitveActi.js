import React, { useEffect, useState } from "react";
import { FaCoffee, FaBriefcase, FaPhone } from "react-icons/fa";
import { fetchExecutiveActivity } from "../../services/apiService";

const ExecutiveActi = ({ selectedExecutiveId, executiveName }) => {
  console.log("ExecutiveActi - selectedExecutiveId:", selectedExecutiveId);
  console.log("ExecutiveActi - executiveName:", executiveName);

  const [activityData, setActivityData] = useState({
    breakTime: 0,
    workTime: 0,
    callTime: 0,
  });

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!selectedExecutiveId) return;

      try {
        const data = await fetchExecutiveActivity(selectedExecutiveId);

        setActivityData({
          breakTime: data.breakTime || 0,
          workTime: data.workTime || 0,
          callTime: data.callTime || 0,
        });
      } catch (err) {
        console.error("Error fetching executive activity data:", err);
      }
    };

    fetchActivityData();
  }, [selectedExecutiveId]);

  const activities = [
    { name: "Break Time", value: activityData.breakTime, icon: <FaCoffee />, color: "#8b5cf6" },
    { name: "Work Time", value: activityData.workTime, icon: <FaBriefcase />, color: "#6d28d9" },
    { name: "Daily Call Time", value: activityData.callTime, icon: <FaPhone />, color: "#a78bfa" },
  ];

  return (
    <div className="executive-activity">
      <h2 className="exec-section-title">
        <span>Executive Activity</span>
        <span className="executive-name">{executiveName || "Loading..."}</span>
      </h2>
      {activities.map((activity, index) => (
        <div key={index} className="activity-item">
          <div className="activity-label">
            <span className="activity-icon" style={{ color: activity.color }}>
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
