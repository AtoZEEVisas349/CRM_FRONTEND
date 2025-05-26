import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AssignTask from "../features/admin/AssignTask";
import ExecutiveDetails from "../features/admin/ExecutiveDetails";
import AdminSettings from "../features/admin-settings/AdminSettings";
import ContactUs from "../features/admin/ContactUs";
import AdminNotification from "../features/admin/AdminNotification"
import Eod from "../features/admin/Eod";
import AttendanceTable from "../features/admin/AttendanceTable";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="assign-task" element={<AssignTask />} />
        <Route path="executive-details" element={<ExecutiveDetails />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="notification" element={<AdminNotification />} />
        <Route path="help-support" element ={<ContactUs/>}/>
        <Route path="eod-report" element={<Eod />} /> {/* ✅ EOD route added here */}
        <Route path="executive-attendance" element={<AttendanceTable />} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;
