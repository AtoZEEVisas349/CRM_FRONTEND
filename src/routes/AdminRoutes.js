import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AssignTask from "../features/admin/AssignTask";
import ExecutiveDetails from "../features/admin/ExecutiveDetails";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="assign-task" element={<AssignTask />} />
        <Route path="executive-details" element={<ExecutiveDetails />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;