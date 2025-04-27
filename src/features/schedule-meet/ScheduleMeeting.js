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


const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const ScheduleMeeting = () => {
  const { fetchMeetings } = useApi();
  const [meetings, setMeetings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("today");
  const [scrolled, setScrolled] = useState(false);

  // Load and filter meetings
  const loadMeetings = async () => {
    try {
      const all = await fetchMeetings();
      const now = new Date();
      const filtered = all.filter((m) => {
        const d = new Date(m.startTime);
        if (activeFilter === "today") {
          return isSameDay(d, now);
        }
        if (activeFilter === "week") {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return d >= weekAgo && d <= now;
        }
        if (activeFilter === "month") {
          return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth()
          );
        }
        return true;
      });
      setMeetings(filtered);
    } catch (error) {
      console.error("Error loading meetings:", error);
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
              {['today','week','month'].map((key) => (
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
            {meetings.map((meeting) => {
              const start = new Date(meeting.startTime);
              const end = meeting.endTime ? new Date(meeting.endTime) : null;
              return (
                <li key={meeting.id} className={`meeting-item ${meeting.highlighted ? 'highlighted-meeting' : ''}`}>

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
                    {meeting.duration || (((end || start) - start) / 3600000 + " hrs")}
                    </span>
                  </div>

                  <div className="meeting-details">
                    <p className="meeting-title">{meeting.clientName}</p>
                    <div className="meeting-tags">
                      <span className="meeting-tag">{meeting.reasonForFollowup}</span>
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
            })}
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
