import { Routes, Route, Navigate } from "react-router-dom";
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

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Navigate replace to={"/signup"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/follow-up/*" element={<FollowUpRoutes />} />
        <Route path="/executive/*" element={<ExecutiveRoutes />} />
        <Route path="/customer/*" element={<CustomerRoutes />} />
        <Route path="/close-leads/*" element={<CloseLeadRoutes />} />
        <Route path="/clients/*" element={<ClientRoutes />} />
        <Route path="/chatBot/*" element={<ChatBotRoutes/>} />
      </Routes>
  );
};

export default App;
