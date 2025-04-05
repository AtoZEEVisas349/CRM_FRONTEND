import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AssignTask from "../features/admin/AssignTask";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="assign-task" element={<AssignTask />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
