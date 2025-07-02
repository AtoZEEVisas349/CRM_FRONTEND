import React from "react";
import { Routes, Route } from "react-router-dom";
import ProcessNavbar from "../layouts/ProcessNavbar";

import ClientDash from "../features/process-client/ClientDash";
import ClientSetting from "../features/process-client/ClientSetting";
import ClientUpload from "../features/process-client/ClientUpload";

import { useProcess } from "../context/ProcessAuthContext"; // ✅ Make sure to import it
import "../styles/process.css";
import ProcessNotification from "../features/process-client/ProcessNotification";


const ClientCustomerRoutes = () => {
  const { user } = useProcess(); // ✅ Now it's correctly used inside the component

  return (
    
    <>
   <ProcessNavbar/>
      <Routes>
       
       <Route path="client/dashboard" element={<ClientDash />} />
        <Route path="client/settings" element={<ClientSetting />} />
        <Route path="client/upload" element={<ClientUpload />} />
          <Route path="client/notifications" element={<ProcessNotification />} />
      </Routes>
    </>
  );
};

export default ClientCustomerRoutes;