import React from "react";
import ClientDetail from '../pages/client-details/ClientDetail.js';
import ClientInteraction from '../pages/client-details/ClientInteraction.js';
import FollowUpDetail from '../pages/client-details/FollowupDetail.js';
import "../styles/client.css";
import SideandNavbar from "../components/SidebarandNavbar";

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
