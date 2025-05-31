import React, { useEffect, useState } from "react";
import { FaUserFriends, FaEllipsisV } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";

const Meetings = ({ selectedExecutiveId }) => {
  const { adminMeeting } = useApi();
  const [meetings, setMeetings] = useState([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  useEffect(() => {
    const fetchMeetingsData = async () => {
      setMeetingsLoading(true);
      try {
        const allMeetings = await adminMeeting();
        console.log("Fetched meetings:", allMeetings);
        console.log("Selected Executive ID:", selectedExecutiveId);
        if (Array.isArray(allMeetings)) {
          if (selectedExecutiveId && selectedExecutiveId !== "all") {
            const filteredMeetings = allMeetings.filter(
              (meeting) => String(meeting.executiveId) === selectedExecutiveId
            );
            console.log("Filtered meetings:", filteredMeetings);
            setMeetings(filteredMeetings);
          } else {
            setMeetings(allMeetings);
          }
        } else {
          console.error("Invalid data format from adminMeeting:", allMeetings);
          setMeetings([]);
        }
      } catch (error) {
        console.error("❌ Error fetching meetings:", error);
        setMeetings([]);
      } finally {
        setMeetingsLoading(false);
      }
    };

    fetchMeetingsData();
  }, [selectedExecutiveId]);

  if (meetingsLoading) {
    return <div className="meetings-container">Loading meetings...</div>;
  }

  const meetingsCount = Array.isArray(meetings) ? meetings.length : 0;

  const getTitle = () => {
    if (selectedExecutiveId && selectedExecutiveId !== "all") {
      return `${meetingsCount} Executive Meetings`;
    }
    return `${meetingsCount} Meetings`;
  };

  return (
    <div className="meetings-container">
      <h3 className="chart-title">{getTitle()}</h3>
      {meetingsCount === 0 ? (
        <div>No meetings scheduled.</div>
      ) : (
        meetings.map((meeting, index) => (
          <div
            key={meeting.id}
            className={`meeting-card ${meeting.isUpcoming ? "upcoming" : ""} card-hover-${index % 5}`}
          >
            <div className="meeting-details">
              <h4>{meeting.clientName}</h4>
              <p>{new Date(meeting.startTime).toLocaleString()}</p>
            </div>
            <div className="meeting-icons">
              <FaUserFriends className="icon" />
              <FaUserFriends className="icon" />
              <FaUserFriends className="icon" />
              <FaEllipsisV className="icon" />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Meetings;