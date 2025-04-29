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

  // Convert workTime from seconds to hours and minutes
  const convertTime = (seconds) => {
    if (seconds > 0) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    return "0h 0m"; // Show 0h 0m instead of "No Data"
  };

  // Fetch data whenever selectedExecutiveId changes
  useEffect(() => {
    console.log("Selected Executive ID:", selectedExecutiveId);

    if (selectedExecutiveId) {
      const fetchData = async () => {
        try {
          const allData = await fetchExecutiveDashboardData(); // returns array or object
          console.log("Fetched Activity Data:", allData);

          const executiveData = allData.find(exec => exec.ExecutiveId === selectedExecutiveId);
          console.log("Selected Executive Data:", executiveData);

          if (executiveData) {
            console.log(`Work Time for Executive ${selectedExecutiveId}:`, executiveData.workTime);

            setActivityData({
              workTime: executiveData.workTime || 0,
              breakTime: executiveData.breakTime || 0,
              callTime: executiveData.dailyCallTime || 0,
            });
          } else {
            console.log("No executive data found for this ID");
            setActivityData({
              workTime: 0,
              breakTime: 0,
              callTime: 0,
            });
          }
        } catch (error) {
          console.error("Error fetching activity data:", error);
        }
      };

      fetchData();
    }
  }, [selectedExecutiveId]);

  // Track time if executive is logged in and workTime is still zero
  useEffect(() => {
    const interval = setInterval(() => {
      if (activityData.workTime === 0) {
        setActivityData(prevState => ({
          ...prevState,
          workTime: prevState.workTime + 1,  // Increment work time each second
        }));
      }
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [activityData.workTime]);

  useEffect(() => {
    console.log("Updated Activity Data:", activityData);
  }, [activityData]);

  const activities = [
    { name: "Break Time", value: convertTime(activityData.breakTime), icon: <FaCoffee />, color: "#8b5cf6" },
    { name: "Work Time", value: convertTime(activityData.workTime), icon: <FaBriefcase />, color: "#6d28d9" },
    { name: "Daily Call Time", value: activityData.callTime || "No Data", icon: <FaPhone />, color: "#a78bfa" },
  ];

  return (
    <div className="exec-activity">
      <h2 className="exec-section-title">
        <span>Executive Activity</span>
        <span className="executive-name">{executiveName || "Loading..."}</span>
      </h2>
      {activities.map((activity, index) => {
        const value = activity.value;
        return (
          <div key={index} className="activity-item">
            <div className="activity-label">
              <span className="activity-icon">{activity.icon}</span>
              <span className="activity-name">{activity.name}</span>
              <span className="activity-percentage">
                {value ? `${value}` : "No Data"}
              </span>
            </div>
            <div className="activity-progress">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.max(value && value !== "No Data" ? 1 : 0, 1)}%`,
                  backgroundColor: activity.color,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExecutiveActi;
