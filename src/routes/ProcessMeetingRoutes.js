import React from 'react';
import ScheduleMeeting from '../features/schedule-meet/ScheduleMeeting';
import ProcessScheduleMeeting from '../features/process-client/ProcessScheduleMeeting';
import schedule from '../styles/schedule.css'

const ProcessMeetingRoutes = () => {
  return (
    <div className="app-container">
      {/* <SidebarandNavbar /> */}
      <div>
        <ProcessScheduleMeeting/>
      </div>
    </div>
    
  );
};

export default ProcessMeetingRoutes;