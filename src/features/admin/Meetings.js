import React, { useEffect, useState } from "react";
import { FaUserFriends, FaEllipsisV } from "react-icons/fa";
import { useApi } from "../../context/ApiContext"; // Ensure the correct path for your context

const Meetings = () => {
  const { adminMeeting } = useApi(); // Get the function from context

  const [meetings, setMeetings] = useState([]);  // Default as an empty array
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      setMeetingsLoading(true);
      try {
        const data = await adminMeeting();     
        if (Array.isArray(data)) {
          setMeetings(data);  // Set the meetings array if data is valid
        } else {
          console.error("Invalid data format:", data);  // Log error if data is not valid
          setMeetings([]);  // Fallback to empty array if data is not valid
        }
      } catch (error) {
        console.error("❌ Error fetching meetings:", error);
        setMeetings([]);  // Fallback to an empty array if there's an error
      } finally {
        setMeetingsLoading(false);
      }
    };    

    fetchMeetings();
  }, []);  // Dependency array to fetch only once

  if (meetingsLoading) {
    return <div className="meetings-container">Loading meetings...</div>;
  }

  const meetingsCount = Array.isArray(meetings) ? meetings.length : 0;

  return (
    <div className="meetings-container">
      <h3 className="chart-title">{meetingsCount} Meetings</h3>
      {meetingsCount === 0 ? (
        <div>No meetings scheduled for today.</div>
      ) : (
        meetings.map((meeting, index) => {
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
                <h4 className={titleClass}>{meeting.clientName}</h4> {/* Replace title with clientName */}
                <p className={timeClass}>{new Date(meeting.startTime).toLocaleString()}</p> {/* Format the time */}
              </div>
              <div className="meeting-icons">
                <FaUserFriends className="icon" />
                <FaUserFriends className="icon" />
                <FaUserFriends className="icon" />
                <FaEllipsisV className="icon" />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Meetings;
