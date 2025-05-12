import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock as farClockRegular,
  faSyncAlt,
  faEllipsisV,
  faPlus,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { ThemeProvider } from "../admin/ThemeContext";
import { useApi } from "../../context/ApiContext";
// Updated helper function
const isSameDay = (d1, d2) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

const ScheduleMeeting = () => {
  const { fetchMeetings } = useApi();
  const [meetings, setMeetings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("today");
  const [scrolled, setScrolled] = useState(false);

  const loadMeetings = async () => {
    try {
      const allMeetings = await fetchMeetings(); // <-- directly await array  
      if (!Array.isArray(allMeetings)) {
        console.error("Meetings response is not an array:", allMeetings);
        setMeetings([]);
        return;
      }
  
      const meetingStatusData = allMeetings.filter((m) => m?.clientLead?.status === "Meeting");
  
      const now = new Date();
  
      const filtered = meetingStatusData.filter((m) => {
        const startDate = new Date(m.startTime);
        if (activeFilter === "today") {
          return isSameDay(startDate, now);
        }
        if (activeFilter === "week") {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return startDate >= weekAgo && startDate <= now;
        }
        if (activeFilter === "month") {
          return (
            startDate.getFullYear() === now.getFullYear() &&
            startDate.getMonth() === now.getMonth()
          );
        }
        return true;
      });
  
      setMeetings(filtered);
    } catch (error) {
      console.error("Error loading meetings:", error);
      setMeetings([]);
    }
  };  

  useEffect(() => {
    loadMeetings();
  }, [activeFilter]);

  const handleScroll = (e) => {
    setScrolled(e.target.scrollTop > 10);
  };

  return (
    <div className="task-management-container">
      <div className="task-management-wrapper">
        <header className={`content-header ${scrolled ? "scrolled" : ""}`}>
          <div className="header-top">
            <div className="header-left">
              <h2 className="meetings-title">Your Meetings</h2>
              <div className="date-section">
                <p className="day-name">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long' })}
                </p>
                <p className="current-date">
                  {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
                </p>
                <FontAwesomeIcon icon={faChevronDown} className="date-dropdown" />
              </div>
            </div>

            <div className="filter-controls">
              {['today', 'week', 'month'].map((key) => (
                <button
                  key={key}
                  className={activeFilter === key ? 'active-filter' : ''}
                  onClick={() => setActiveFilter(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
              <button className="refresh-button" onClick={loadMeetings}>
                <FontAwesomeIcon icon={faSyncAlt} />
              </button>
            </div>
          </div>
        </header>

        <div className="meetings-content" onScroll={handleScroll}>
          <ul className="meetings-list">
            {meetings.length > 0 ? (
              meetings.map((meeting) => {
                const start = new Date(meeting.startTime);
                const end = meeting.endTime ? new Date(meeting.endTime) : null;
                return (
                  <li
                    key={meeting.id}
                    className={`meeting-item ${meeting.highlighted ? 'highlighted-meeting' : ''}`}
                  >
                    <div className="meeting-time">
                      <p className="start-time">
                        {start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {end && (
                        <p className="end-time">
                          {end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>

                    <div className="meeting-duration">
                      <FontAwesomeIcon icon={farClockRegular} />
                      <span>
                        {meeting.duration ||
                          (end
                            ? ((end - start) / 3600000).toFixed(1) + " hrs"
                            : "N/A")}
                      </span>
                    </div>

                    <div className="meeting-details">
                      <p className="meeting-title">{meeting.clientName || "Unnamed Client"}</p>
                      <div className="meeting-tags">
                        <span className="meeting-tag">{meeting.reasonForFollowup || "No Reason"}</span>
                      </div>
                    </div>

                    <div className="meeting-attendees">
                      <button className="add-attendee">
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    <button className="meeting-options">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="no-meetings">No meetings scheduled</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ScheduleMeetingWithTheme = () => (
  <ThemeProvider>
    <ScheduleMeeting />
  </ThemeProvider>
);

export default ScheduleMeetingWithTheme;
