import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./api/auth"; // ✅ Import from API folder

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

import AdminRoutes from "./routes/AdminRoutes";
import FollowUpRoutes from "./routes/FollowUpRoutes";
import ExecutiveRoutes from "./routes/ExecutiveRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";
import CloseLeadRoutes from "./routes/CloseLeadRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import ChatBotRoutes from "./routes/ChatBotRoutes";
import FreshLeadRoutes from "./routes/FreshLeadRoutes";
import LeadAssignRoutes from "./routes/LeadAssignRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={"/signup"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ✅ Protected Routes Using PrivateRoute */}
      <Route path="/admin/*" element={<PrivateRoute><AdminRoutes /></PrivateRoute>} />
      <Route path="/follow-up/*" element={<PrivateRoute><FollowUpRoutes /></PrivateRoute>} />
      <Route path="/executive/*" element={<PrivateRoute><ExecutiveRoutes /></PrivateRoute>} />
      <Route path="/customer/*" element={<PrivateRoute><CustomerRoutes /></PrivateRoute>} />
      <Route path="/close-leads/*" element={<PrivateRoute><CloseLeadRoutes /></PrivateRoute>} />
      <Route path="/clients/*" element={<PrivateRoute><ClientRoutes /></PrivateRoute>} />
      <Route path="/chatBot/*" element={<PrivateRoute><ChatBotRoutes /></PrivateRoute>} />
      <Route path="/leadassign/*" element={<PrivateRoute><LeadAssignRoutes /></PrivateRoute>} />
      <Route path="/freshlead/*" element={<PrivateRoute><FreshLeadRoutes /></PrivateRoute>} />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
