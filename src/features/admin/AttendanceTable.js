import SidebarToggle from "./SidebarToggle";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "../../styles/attendancetable.css";
import { useExecutiveActivity } from "../../context/ExecutiveActivityContext"; // adjust path if needed

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [dates, setDates] = useState([]);
  const isSidebarExpanded =
    localStorage.getItem("adminSidebarExpanded") === "true";
  const [weekStart, setWeekStart] = useState(
    dayjs().startOf("week").add(1, "day")
  );

  const { handleGetAttendance } = useExecutiveActivity();

  useEffect(() => {
    const fetchFromContext = async () => {
      const data = await handleGetAttendance(weekStart);
      setAttendanceData(data);
      if (data.length > 0) {
        setDates(Object.keys(data[0].attendance));
      }
    };

    fetchFromContext();
  }, [weekStart]);

  const weekOptions = Array.from({ length: 8 }, (_, i) =>
    dayjs().startOf("week").add(1, "day").subtract(i, "week")
  );

  return (
    <div
      className={`create-executive-container ${
        isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      <SidebarToggle />
      <div className="attendance-container">
        <h2 className="attendance-title">Weekly Attendance Report</h2>

        <div className="select-wrapper">
          <label className="select-label">Select Week:</label>
          <select
            value={weekStart.format("YYYY-MM-DD")}
            onChange={(e) => setWeekStart(dayjs(e.target.value))}
            className="select-dropdown"
          >
            {weekOptions.map((week) => (
              <option key={week.toString()} value={week.format("YYYY-MM-DD")}>
                {week.format("YYYY-MM-DD")} to{" "}
                {week.add(6, "day").format("YYYY-MM-DD")}
              </option>
            ))}
          </select>
        </div>
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Executive ID</th>
                {dates.map((date) => (
                  <th key={date}>{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((exec) => (
                <tr key={exec.executiveId}>
                  <td>{exec.executiveId}</td>
                  {dates.map((date) => (
                    <td key={date}>
                      <span
                        className={`status-badge ${
                          exec.attendance[date] === "Present"
                            ? "present"
                            : "absent"
                        }`}
                      >
                        {exec.attendance[date]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;