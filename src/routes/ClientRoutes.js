// --- ClientRoutes.js ---
import React, { useState } from "react";
import ClientDetail from '../features/client-details/ClientDetail.js';
import ClientInteraction from '../features/client-details/ClientInteraction.js';
import FollowUpDetail from '../features/client-details/FollowupDetail.js';
import "../styles/client.css";
import SideandNavbar from "../layouts/SidebarandNavbar";

const ClientRoutes = ({ followUpText }) => {
  const [lastFollowUp, setLastFollowUp] = useState(followUpText);

  return (
    <div className="client-app-container">
      <SideandNavbar />
      <div className="client-main-content">
        <ClientDetail followUpText={lastFollowUp} />
        <ClientInteraction />
        <FollowUpDetail onTextChange={(text) => setLastFollowUp(text)} />
      </div>
    </div>
  );
};

export default ClientRoutes;