// --- ClientRoutes.js ---
import React from "react";
import "../styles/client.css";
import SideandNavbar from "../layouts/SidebarandNavbar";
import ClientOverview from "../features/client-details/ClientOverview";
import ClientDetailsOverview from "../features/follow-ups/ClientDetailsOverview";
import { Routes, Route } from "react-router-dom";

const ClientRoutes = () => {
  return (
    <div className="client-app-container">
      <SideandNavbar />
      <div className="client-main-content">
        <Routes>
          {/* Use absolute path for nested routes */}
          <Route path=":clientId" element={<ClientOverview />} />
          <Route path=":clientId/details" element={<ClientDetailsOverview />} />
        </Routes>
      </div>
    </div>
  );
};

export default ClientRoutes;