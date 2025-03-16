import React from "react";
import { FaUserFriends, FaEllipsisV } from "react-icons/fa";

const meetingsData = [
  {
    title: "Internal Preparation Meeting",
    time: "08:00 - 09:00 AM",
    isUpcoming: true, // Show "In 10 mins" badge
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
      <h3 className="meetings-header">4 Meetings Today</h3>
      {meetingsData.map((meeting, index) => (
        <div
          key={index}
          className={`meeting-card ${meeting.isUpcoming ? "upcoming" : ""}`}
        >
          <div className="meeting-details">
            {meeting.isUpcoming && <span className="badge">In 10 mins</span>}
            <h4>{meeting.title}</h4>
            <p>{meeting.time}</p>
          </div>
          <div className="meeting-icons">
            <FaUserFriends className="icon" />
            <FaUserFriends className="icon" />
            <FaUserFriends className="icon" />
            <FaEllipsisV className="icon" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Meetings;
