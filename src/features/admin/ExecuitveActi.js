import React, { useEffect, useState } from "react";
import { FaCoffee, FaBriefcase, FaPhone } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";

const ExecutiveActi = ({ selectedExecutiveId, executiveName }) => {
  const { fetchExecutiveDashboardData } = useApi();
  const [activityData, setActivityData] = useState({
    workTime: 0,
    breakTime: 0,
    callTime: 0,
  });

  // ✅ Move this line to top
  const FULL_DAY_SECONDS = 8 * 3600;

  // Convert time from seconds to hours and minutes
  const convertTime = (seconds) => {
    if (seconds > 0) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    return "0h 0m";
  };

  // Fetch data on executive change
  useEffect(() => {
    if (selectedExecutiveId) {
      const fetchData = async () => {
        try {
          const allData = await fetchExecutiveDashboardData();
          const executiveData = allData.find(exec => exec.ExecutiveId === selectedExecutiveId);

          if (executiveData) {
            setActivityData({
              workTime: executiveData.workTime || 0,
              breakTime: executiveData.breakTime || 0,
              callTime: executiveData.dailyCallTime || 0,
            });
          } else {
            setActivityData({ workTime: 0, breakTime: 0, callTime: 0 });
          }
        } catch (error) {
          console.error("Error fetching activity data:", error);
        }
      };
      fetchData();
    }
  }, [selectedExecutiveId]);

  // Simulate timer if workTime is 0
  useEffect(() => {
    let interval;
    if (activityData.workTime === 0) {
      interval = setInterval(() => {
        setActivityData((prevState) => {
          if (prevState.workTime < FULL_DAY_SECONDS) {
            return {
              ...prevState,
              workTime: prevState.workTime + 1,
            };
          } else {
            clearInterval(interval);
            return prevState;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, []); // Run once

  const activitiesRaw = [
    { name: "Break Time", value: activityData.breakTime, icon: <FaCoffee />, color: "#8b5cf6" },
    { name: "Work Time", value: activityData.workTime, icon: <FaBriefcase />, color: "#6d28d9" },
    { name: "Daily Call Time", value: activityData.callTime, icon: <FaPhone />, color: "#a78bfa" },
  ];

  const activities = activitiesRaw.map((activity) => ({
    ...activity,
    formattedValue: convertTime(activity.value),
    percentage: Math.min(Math.round((activity.value / FULL_DAY_SECONDS) * 100), 100),
  }));

  return (
    <div className="exec-activity">
      <h2 className="exec-section-title">
        <span>Executive Activity</span>
        <span className="executive-name">{executiveName || "Loading..."}</span>
      </h2>
      {activities.map((activity, index) => (
        <div key={index} className="activity-item">
          <div className="activity-label">
            <span className="activity-icon">{activity.icon}</span>
            <span className="activity-name">{activity.name}</span>
            <span className="activity-percentage">{activity.formattedValue}</span>
          </div>
          <div className="activity-progress">
            <div
              className="progress-fill"
              style={{
                width: `${activity.percentage}%`,
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
