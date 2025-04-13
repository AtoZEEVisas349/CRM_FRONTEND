import React from "react";
import { FaUserFriends, FaEllipsisV } from "react-icons/fa";

const meetingsData = [
  {
    title: "Internal Preparation Meeting",
    time: "08:00 - 09:00 AM",
    isUpcoming: true,
  },
  {
    title: "Internal Preparation Meeting",
    time: "03:00 - 04:00 PM",
    isUpcoming: false,
  },
  {
    title: "External Meeting - Negotiation",
    time: "04:00 - 05:00 PM",
    isUpcoming: false,
  },
];

const Meetings = () => {
  return (
    <div className="meetings-container">
      <h3 className="chart-title">3 Meetings Today</h3>
      {meetingsData.map((meeting, index) => {
        // Conditional classes for title and time
        let titleClass = "";
        let timeClass = "";

        if (index === 1) {
          titleClass = "meeting-title-dark-only";
          timeClass = "meeting-time-dark-only";
        } else if (meeting.title === "External Meeting - Negotiation") {
          titleClass = "meeting-title-special";
          timeClass = "meeting-time-special";
        }

        return (
          <div
            key={index}
            className={`meeting-card card-hover-${index} ${meeting.isUpcoming ? "upcoming" : ""}`}
          >
            <div className="meeting-details">
              <h4 className={titleClass}>{meeting.title}</h4>
              <p className={timeClass}>{meeting.time}</p>
            </div>
            <div className="meeting-icons">
              <FaUserFriends className="icon" />
              <FaUserFriends className="icon" />
              <FaUserFriends className="icon" />
              <FaEllipsisV className="icon" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Meetings;
