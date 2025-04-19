import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SidebarandNavbar from '../layouts/SidebarandNavbar';
import ScheduleMeeting from '../features/schedule-meet/ScheduleMeeting';
import schedule from '../styles/schedule.css'
const ScheduleRoutes = () => {
  return (
    <div className="app-container">
      <SidebarandNavbar />
      <div>
        <ScheduleMeeting/>
      </div>
    </div>
    
  );
};

export default ScheduleRoutes;