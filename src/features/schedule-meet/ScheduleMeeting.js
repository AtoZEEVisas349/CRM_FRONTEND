import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock as farClock,
  faSyncAlt,
  faEllipsisV,
  faPlus,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { faClock as farClockRegular } from "@fortawesome/free-regular-svg-icons";
import { ThemeProvider } from "../admin/ThemeContext";
const ScheduleMeeting = () => {
  const [activeFilter, setActiveFilter] = useState("today");
  const [scrolled, setScrolled] = useState(false);

  // Sample meeting data
  const meetings = [
    {
      id: 1,
      title: "Week Launch",
      time: "10:00 am",
      endTime: "11:20 am",
      duration: "1.20 hrs",
      tags: ["Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/a0216252-f326-472a-944c-97f7f24b64af.jpg",
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
    {
      id: 1,
      title: "Week Launch",
      time: "10:00 am",
      endTime: "11:20 am",
      duration: "1.20 hrs",
      tags: ["Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/a0216252-f326-472a-944c-97f7f24b64af.jpg",
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: true
    },
    {
      id: 1,
      title: "Week Launch",
      time: "10:00 am",
      endTime: "11:20 am",
      duration: "1.20 hrs",
      tags: ["Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/a0216252-f326-472a-944c-97f7f24b64af.jpg",
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
    {
      id: 1,
      title: "Week Launch",
      time: "10:00 am",
      endTime: "11:20 am",
      duration: "1.20 hrs",
      tags: ["Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/a0216252-f326-472a-944c-97f7f24b64af.jpg",
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
    {
      id: 1,
      title: "Week Launch",
      time: "10:00 am",
      endTime: "11:20 am",
      duration: "1.20 hrs",
      tags: ["Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/a0216252-f326-472a-944c-97f7f24b64af.jpg",
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
    {
      id: 1,
      title: "Week Launch",
      time: "10:00 am",
      endTime: "11:20 am",
      duration: "1.20 hrs",
      tags: ["Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/a0216252-f326-472a-944c-97f7f24b64af.jpg",
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
    {
      id: 1,
      title: "Week Launch",
      time: "10:00 am",
      endTime: "11:20 am",
      duration: "1.20 hrs",
      tags: ["Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/a0216252-f326-472a-944c-97f7f24b64af.jpg",
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
    {
      id: 1,
      title: "Week Launch",
      time: "10:00 am",
      endTime: "11:20 am",
      duration: "1.20 hrs",
      tags: ["Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/a0216252-f326-472a-944c-97f7f24b64af.jpg",
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
  ];

  const handleScroll = (e) => {
    setScrolled(e.target.scrollTop > 10);
  };

  return (
    <div className="task-management-container">
      <div className="task-management-wrapper">
        {/* Sticky Header Section */}
        <header className={`content-header ${scrolled ? "scrolled" : ""}`}>
          <div className="header-top">
            <div className="header-left">
              <h2 className="meetings-title">Your Meetings</h2>
              <div className="date-section">
                <p className="day-name">Thursday</p>
                <p className="current-date">15 November</p>
                <FontAwesomeIcon icon={faChevronDown} className="date-dropdown" />
              </div>
            </div>
            
            <div className="filter-controls">
              <button 
                className={activeFilter === "today" ? "active-filter" : ""}
                onClick={() => setActiveFilter("today")}
              >
                Today
              </button>
              <button 
                className={activeFilter === "week" ? "active-filter" : ""}
                onClick={() => setActiveFilter("week")}
              >
                Week
              </button>
              <button 
                className={activeFilter === "month" ? "active-filter" : ""}
                onClick={() => setActiveFilter("month")}
              >
                Month
              </button>
              <button className="refresh-button">
                <FontAwesomeIcon icon={faSyncAlt} />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Section */}
        <div 
          className="meetings-content" 
          onScroll={handleScroll}
        >
          <ul className="meetings-list">
            {meetings.map((meeting) => (
              <li 
                key={meeting.id} 
                className={`meeting-item ${
                  meeting.highlighted ? "highlighted-meeting" : ""
                }`}
              >
                <div className="meeting-time">
                  <p className="start-time">{meeting.time}</p>
                  <p className="end-time">{meeting.endTime}</p>
                </div>
                <div className="meeting-duration">
                  <FontAwesomeIcon icon={farClockRegular} />
                  <span>{meeting.duration}</span>
                </div>

                <div className="meeting-details">
                  <p className="meeting-title">{meeting.title}</p>
                  <div className="meeting-tags">
                    {meeting.tags.map((tag) => (
                      <span key={tag} className="meeting-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="meeting-attendees">
                  {meeting.attendees.map((avatar, idx) => (
                    <img 
                      key={idx} 
                      alt="Attendee" 
                      className="attendee-thumbnail" 
                      src={avatar} 
                    />
                  ))}
                  <button className="add-attendee">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>

                <button className="meeting-options">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
              </li>
            ))}
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

 export default ScheduleMeeting;
