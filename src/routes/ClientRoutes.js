import React from "react";
import ClientDetail from '../features/client-details/ClientDetail.js';
import ClientInteraction from '../features/client-details/ClientInteraction.js';
import FollowUpDetail from '../features/client-details/FollowupDetail.js';
import "../styles/client.css";
import SideandNavbar from "../layouts/SidebarandNavbar";

const ClientRoutes = () => {
    return (
        <div className="client-app-container">
            <SideandNavbar/>
            <div className="client-main-content">
                {/* Merged Dashboard components here */}
                <ClientDetail />
                <ClientInteraction />
                <FollowUpDetail />
            </div>
        </div>
    );
}

export default ClientRoutes;
