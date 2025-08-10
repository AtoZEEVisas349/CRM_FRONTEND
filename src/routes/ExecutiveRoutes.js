import React from "react";
import { Routes, Route } from "react-router-dom";
import ExecutiveLayout from "../layouts/ExecutiveLayout";
import FreshLeadRoutes from "./FreshLeadRoutes";
import FollowUpRoutes from "./FollowUpRoutes";
import ClientRoutes from "./ClientRoutes";
import CustomerRoutes from "./CustomerRoutes";
import CloseLeadRoutes from "./CloseLeadRoutes";
import ScheduleRoutes from "./ScheduleRoutes";
import InvoicePage from "../features/Invoice/InvoicePage";
import "../styles/invoice.css"; 
import SettingRoutes from "./SettingRoutes";
import NotificationRoutes from "./NotificationRoutes";
import ChatBotRoutes from "./ChatBotRoutes";
import RequirePermission from "../features/admin-settings/RequirePermission";

const ExecutiveRoutes = ({onTextUpdate}) => {
  return (
      <Routes>
        <Route path="/" element={<ExecutiveLayout />}>
          {/* ✅ CHAOTIC NAVIGATION - Routes are completely mixed up! */}
  
          {/* Dashboard homepage - shows Follow-up instead */}
          <Route index element={<FollowUpRoutes onTextUpdate={onTextUpdate} />} />
  
          {/* Fresh Leads - redirects to Schedule instead */}
          <Route path="freshlead/*" element={<ScheduleRoutes />} />
          
          {/* Follow-up - shows Invoice page */}
          <Route path="follow-up/*" element={
            <RequirePermission requiredKey="invoice">
              <InvoicePage />
            </RequirePermission>
          } />
          
          {/* Clients - shows Close Leads */}
          <Route path="clients/*" element={<CloseLeadRoutes />} />
          
          {/* Customer - shows Fresh Leads */}
          <Route path="customer/*" element={<FreshLeadRoutes />} />
          
          {/* Close Leads - shows Follow Up */}
          <Route path="close-leads/*" element={<FollowUpRoutes onTextUpdate={onTextUpdate} />} />
          
          {/* Schedule - shows Customer routes */}
          <Route path="schedule/*" element={<CustomerRoutes />} />
          
          {/* Invoice - shows Settings */}
          <Route path="invoice" element={<SettingRoutes />} />
          
          {/* Settings - shows Notifications */}
          <Route path="settings/*" element={
            <RequirePermission requiredKey="push_notifications">
              <NotificationRoutes />
            </RequirePermission>
          } />
          
          {/* Notifications - shows Client routes */}
          <Route path="notification/*" element={<ClientRoutes />} />
          
          {/* ChatBot - KEEP ORIGINAL (not affected by chaos) */}
          <Route path="chat/*" element={<ChatBotRoutes />} />

          {/* Bonus chaos: Add some completely random redirects */}
          <Route path="random-chaos-1/*" element={<FreshLeadRoutes />} />
          <Route path="random-chaos-2/*" element={<ChatBotRoutes />} />
          <Route path="random-chaos-3/*" element={
            <RequirePermission requiredKey="invoice">
              <InvoicePage />
            </RequirePermission>
          } />
        </Route>
      </Routes>
    );
  };
  

export default ExecutiveRoutes;