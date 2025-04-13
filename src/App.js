// --- App.js ---
import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./services/auth";
import Login from "./features/authentication/Login";
import Signup from "./features/authentication/Signup";
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
              <ClientRoutes followUpText={followUpText} />
            </PrivateRoute>
          } 
        />

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