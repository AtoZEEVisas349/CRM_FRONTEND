import React, { useEffect, useState } from "react";
import { FaCoffee, FaBriefcase, FaPhone } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";

const ExecutiveActi = () => {
  const { fetchExecutiveDashboardData, fetchExecutivesAPI } = useApi();

  const [executives, setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState(null);

  const [activityData, setActivityData] = useState({
    workTime: 0,
    breakTime: 0,
    callTime: 0,
  });

  const FULL_DAY_SECONDS = 8 * 3600;

  // Convert time from seconds to "Xh Ym"
  const convertTime = (seconds) => {
    if (seconds > 0) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    return "0h 0m";
  };

  // Fetch all executives on mount
  useEffect(() => {
    const loadExecutives = async () => {
      try {
        const data = await fetchExecutivesAPI();
        setExecutives(data);
        if (data.length > 0) setSelectedExecutive(data[0]);
      } catch (error) {
        console.error("Error fetching executives:", error);
      }
    };
    loadExecutives();
  }, [fetchExecutivesAPI]);

  // Fetch activity data based on selected executive
  useEffect(() => {
    const fetchActivity = async () => {
      if (!selectedExecutive) return;

      try {
        const allData = await fetchExecutiveDashboardData();
        const exec = allData.find((e) => e.ExecutiveId === selectedExecutive.id);

        if (exec) {
          setActivityData({
            workTime: exec.workTime || 0,
            breakTime: exec.breakTime || 0,
            callTime: exec.dailyCallTime || 0,
          });
        } else {
          setActivityData({ workTime: 0, breakTime: 0, callTime: 0 });
        }
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };

    fetchActivity();
  }, [selectedExecutive]);

  // Simulate workTime increment (optional)
  useEffect(() => {
    let interval;
    if (activityData.workTime === 0) {
      interval = setInterval(() => {
        setActivityData((prev) => {
          if (prev.workTime < FULL_DAY_SECONDS) {
            return { ...prev, workTime: prev.workTime + 1 };
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, []); // run once

  const activities = [
    {
      name: "Break Time",
      value: activityData.breakTime,
      icon: <FaCoffee />,
      color: "#8b5cf6",
    },
    {
      name: "Work Time",
      value: activityData.workTime,
      icon: <FaBriefcase />,
      color: "#6d28d9",
    },
    {
      name: "Daily Call Time",
      value: activityData.callTime,
      icon: <FaPhone />,
      color: "#a78bfa",
    },
  ].map((activity) => ({
    ...activity,
    formattedValue: convertTime(activity.value),
    percentage: Math.min(
      Math.round((activity.value / FULL_DAY_SECONDS) * 100),
      100
    ),
  }));

  return (
    <div className="exec-activity">
      <h2 className="exec-section-title">Executive Activity</h2>

      <select
        value={selectedExecutive?.id || ""}
        onChange={(e) =>
          setSelectedExecutive(executives.find((ex) => ex.id === e.target.value))
        }
        style={{ marginBottom: "1rem" }}
      >
        {executives.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.username}
          </option>
        ))}
      </select>

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
