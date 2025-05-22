// --- App.js ---
import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./services/auth";
import Login from "./features/authentication/Login";
import Signup from "./features/authentication/Signup";
import LoginMaster from "./features/masteruser/LoginMaster";
import SignupMaster from "./features/masteruser/SignupMaster";
import { PrivateMasterRoute } from './context/MasterContext';
import ForgotPassword from "./features/authentication/ForgotPassword";
import ResetPassword from "./features/authentication/ResetPassword";
import AdminRoutes from "./routes/AdminRoutes";
import FollowUpRoutes from "./routes/FollowUpRoutes";
import ExecutiveRoutes from "./routes/ExecutiveRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";
import CloseLeadRoutes from "./routes/CloseLeadRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import ChatBotRoutes from "./routes/ChatBotRoutes";
import FreshLeadRoutes from "./routes/FreshLeadRoutes";
import LeadAssignRoutes from "./routes/LeadAssignRoute";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./features/admin/ThemeContext";
import { AuthProvider } from './context/AuthContext'; 
import NotificationRoutes from "./routes/NotificationRoutes";
import InvoiceRoutes from "./routes/InvoiceRoutes";
import SettingRoutes from "./routes/SettingRoutes";
import MyProfile from "./features/settings/MyProfile";
import Theme from "./features/settings/Theme";
import ChangePassword from "./features/settings/ChangePassword";
import ScheduleRoutes from "./routes/ScheduleRoutes";
import AdminPanelRoutes from "./routes/MonitoringRoutes";
import MasterRoutes from "./routes/MasterRoutes";
import ProcessRoutes from "./routes/ProcessRoutes";
import ClientLogin from "./features/process-client/ClientLogin";
import ClientSignup from "./features/process-client/ClientSignup";
import ExecutiveFormRoutes from "./routes/ExecutiveFormRoutes";


const App = () => {
  const [followUpText, setFollowUpText] = useState(() => {
    const saved = localStorage.getItem('followUpText');
    return saved || "";
  });

  useEffect(() => {
    localStorage.setItem('followUpText', followUpText);
  }, [followUpText]);

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Navigate replace to="/signup" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Public master routes - login & signup */}
        <Route path="/master/loginmaster" element={<LoginMaster />} />
        <Route path="/master/signupmaster" element={<SignupMaster />} />
        <Route path="/process/client/login" element={<ClientLogin />} />
        <Route path="/process/client/signup" element={<ClientSignup />} />
        <Route 
          path="/follow-up/*" 
          element={
            <PrivateRoute>
              <FollowUpRoutes onTextUpdate={setFollowUpText} />
            </PrivateRoute>
          } 
        />
          <Route 
          path="/clients/*" 
          element={
            <PrivateRoute>
              <ClientRoutes />
            </PrivateRoute>
          } 
        />
        <Route path="/process/*" element={<PrivateRoute><ProcessRoutes /></PrivateRoute>} />
        <Route path="/executiveform/*" element={<PrivateRoute><ExecutiveFormRoutes/></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingRoutes/></PrivateRoute>} >
        <Route index element={<Navigate to="profile" replace />} />  {/* ✅ This does the redirect */}
        <Route path="profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
         <Route path="theme" element={<PrivateRoute><Theme /></PrivateRoute>} />
          <Route path="change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
        </Route>
        <Route path="/master/*" element={
          <PrivateMasterRoute>
            <MasterRoutes />
          </PrivateMasterRoute>
        } />   
        <Route path="/monitoring/*" element={<PrivateRoute><AdminPanelRoutes /></PrivateRoute>} />
        <Route path="/schedule" element={<PrivateRoute><ScheduleRoutes/></PrivateRoute>} />
        <Route path="/invoice" element={<PrivateRoute><InvoiceRoutes/></PrivateRoute>} />
        <Route path="/notification" element={<PrivateRoute><NotificationRoutes/></PrivateRoute>} />
        <Route path="/admin/*" element={<PrivateRoute><AdminRoutes /></PrivateRoute>} />
        <Route path="/executive/*" element={<PrivateRoute><ExecutiveRoutes /></PrivateRoute>} />
        <Route path="/customer/*" element={<PrivateRoute><CustomerRoutes /></PrivateRoute>} />
        <Route path="/close-leads/*" element={<PrivateRoute><CloseLeadRoutes /></PrivateRoute>} />
        <Route path="/chatBot/*" element={<PrivateRoute><ChatBotRoutes /></PrivateRoute>} />
        <Route path="/leadassign/*" element={<PrivateRoute><LeadAssignRoutes /></PrivateRoute>} />
        <Route path="/freshlead/*" element={<PrivateRoute><FreshLeadRoutes /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;