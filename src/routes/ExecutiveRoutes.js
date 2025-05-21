import React from "react";
import { Routes, Route } from "react-router-dom";
import ExecutiveLayout from "../layouts/ExecutiveLayout";
import ReportCard from "../features/executive/ReportCard";
import NewsComponent from "../features/executive/NewsComponent";

const ExecutiveRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ExecutiveLayout />}>
        {/* 👇 This renders default content at /executive */}
        <Route
          index
          element={
            <>
              <ReportCard />
              <NewsComponent />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default ExecutiveRoutes;
