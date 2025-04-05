import React from "react";
import { Routes, Route } from "react-router-dom";
import ExecutiveLayout from "../layouts/ExecutiveLayout";

const ExecutiveRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ExecutiveLayout />} />
    </Routes>
  );
};

export default ExecutiveRoutes;
