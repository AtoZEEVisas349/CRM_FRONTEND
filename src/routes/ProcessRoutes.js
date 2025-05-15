import React from "react";
import { Routes, Route } from "react-router-dom";
import ProcessNavbar from "../layouts/ProcessNavbar"
import ClientDash from "../features/process-client/ClientDash";
import ClientSetting from "../features/process-client/ClientSetting";
import ClientUpload from "../features/process-client/ClientUpload";
import "../styles/process.css";

const ProcessRoutes = () => {
  return (
    <>
      <ProcessNavbar />
      <Routes>
        <Route path="client/dashboard" element={<ClientDash />} />
        <Route path="client/settings" element={<ClientSetting />} />
        <Route path="client/upload" element={<ClientUpload />} />
      </Routes>
    </>
  );
};

export default ProcessRoutes;
