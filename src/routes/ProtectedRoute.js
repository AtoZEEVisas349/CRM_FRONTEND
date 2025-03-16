import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
    const token = useSelector((state) => state.auth.token); // Get token from Redux store

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
