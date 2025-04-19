import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock as farClock,
  faSyncAlt,
  faEllipsisV,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { faClock as farClockRegular } from "@fortawesome/free-regular-svg-icons";

const ScheduleMeeting = () => {
  const [activeFilter, setActiveFilter] = useState("today");

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
      id: 2,
      title: "Project Kick Off",
      time: "1:00 pm",
      endTime: "1:30 pm",
      duration: "30 min",
      tags: ["Design", "Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: true
    },
    {
      id: 3,
      title: "Project Kick Off",
      time: "1:00 pm",
      endTime: "1:30 pm",
      duration: "30 min",
      tags: ["Design", "Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
    {
      id: 3,
      title: "Project Kick Off",
      time: "1:00 pm",
      endTime: "1:30 pm",
      duration: "30 min",
      tags: ["Design", "Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
    {
      id: 3,
      title: "Project Kick Off",
      time: "1:00 pm",
      endTime: "1:30 pm",
      duration: "30 min",
      tags: ["Design", "Marketing"],
      attendees: [
        "https://storage.googleapis.com/a1aa/image/7a1f2eda-982f-4aeb-5847-4f99eb1d382e.jpg",
        "https://storage.googleapis.com/a1aa/image/5233d893-6522-4596-1e67-df1d191337fc.jpg"
      ],
      highlighted: false
    },
  ];

  return (
    <div className="task-management-container full-width">
    <div className="task-management-wrapper full-width">
  
        <header className="content-header">
          <h2 className="meetings-title">Your Meetings</h2>
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
        </header>

        <div className="date-section">
          <p className="day-name">Thursday</p>
          <p className="current-date">15 November</p>
        </div>

        <ul className="meetings-list">
          {meetings.map(meeting => (
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
                  {meeting.tags.map(tag => (
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
                <button className="add-attendee">+</button>
              </div>

              <button className="meeting-options">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScheduleMeeting;