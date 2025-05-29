import React from "react";
import { Routes, Route } from "react-router-dom";
import ProcessNavbar from "../layouts/ProcessNavbar";
import ClientDash from "../features/process-client/ClientDash";
import ClientSetting from "../features/process-client/ClientSetting";
import ClientUpload from "../features/process-client/ClientUpload";
import CreateClient from "../features/process-client/CreateClient";
import AllClient from "../features/process-client/AllClient";
import { useProcess } from "../context/ProcessAuthContext"; // ✅ Make sure to import it
import "../styles/process.css";

const ProcessRoutes = () => {
  const { user } = useProcess(); // ✅ Now it's correctly used inside the component

  return (
    <>
      <ProcessNavbar />
      <Routes>
        <Route path="client/dashboard" element={<ClientDash />} />
        <Route path="client/settings" element={<ClientSetting />} />
        <Route path="client/upload" element={<ClientUpload />} />
        {user?.type === "processperson" && (
          <>
             <Route path="client/dashboard/:id" element={<ClientDash />} />
            <Route path="client/create-client" element={<CreateClient />} />
            <Route path="client/all-clients" element={<AllClient />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default ProcessRoutes;