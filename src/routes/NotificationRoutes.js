import React from 'react';
import Notification from '../features/executive/Notification';
import SidebarandNavbar from "../layouts/SidebarandNavbar";
import "../styles/notification.css";

const NotificationRoutes = () => {
  return (
    <div className="notification-page-wrapper">
      <SidebarandNavbar />
      <div className="notification-content-area">
        <Notification />
      </div>
    </div>
  );
};

export default NotificationRoutes;