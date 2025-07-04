

import React from "react";
import { Routes, Route } from "react-router-dom";
import AssignTask from "../features/admin/AssignTask";
import ExecutiveDetails from "../features/admin/ExecutiveDetails";
import AdminSettings from "../features/admin-settings/AdminSettings";
import ContactUs from "../features/admin/ContactUs";
import AdminNotification from "../features/admin/AdminNotification"
import Eod from "../features/admin/Eod";
import AttendanceTable from "../features/admin/AttendanceTable";
import RequirePermission from "../features/admin-settings/RequirePermission";
import ManagerLayout from "../layouts/ManagerLayout";
import Monitoring from "../features/admin/Monitoring";
import TaskManagement from "../features/LeadAssign/TaskManagement";
import ExecutiveCredentialsForm from "../features/admin/ExecutiveCredentialsForm";
import HrLayout from "../layouts/HrLayout";
import LeaveManagement from "../features/hr/LeaveManagement";
import HrNotification from "../features/hr/HrNotification";
import HrSettings from "../features/hr/HrSettings";
const HrRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HrLayout />}>
        <Route path="assign-task" element={
            <RequirePermission requiredKey="assign_task">
                <AssignTask />
            </RequirePermission>} />
        <Route path="executive-details" element={
            <RequirePermission requiredKey="executive_details">
            <ExecutiveDetails />
            </RequirePermission>} />
        <Route path="settings" element={
            <RequirePermission requiredKey="settings">
            <HrSettings />
            </RequirePermission>} />
       <Route path="notification" element={
          <RequirePermission requiredKey="push_notifications">
          <HrNotification />
          </RequirePermission>} />
        <Route path="monitoring" element={
          <RequirePermission requiredKey="monitoring">
          <Monitoring />
          </RequirePermission>} />
        <Route path="leadassign" element={
          <RequirePermission requiredKey="task_management">
          <TaskManagement />
          </RequirePermission>} />
        <Route path="executiveform" element={
          <RequirePermission requiredKey="user_management">
          <ExecutiveCredentialsForm />
          </RequirePermission>} />
        <Route path="help-support" element ={<ContactUs/>}/>
        <Route path="leave-management" element ={<LeaveManagement/>}/>
        <Route path="eod-report" element={
            <RequirePermission requiredKey="reporting">
            <Eod />
            </RequirePermission>} /> {/* ✅ EOD route added here */}
        <Route path="executive-attendance" element={<AttendanceTable />} />
        
      </Route>
    </Routes>
  );
};

export default HrRoutes;

