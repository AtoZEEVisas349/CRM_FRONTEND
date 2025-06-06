import apiService from "./apiService";
import { Navigate, useLocation } from "react-router-dom";

const API_BASE_URL = "https://crm-backend-production-c208.up.railway.app/api";

// Shared headers
const BASE_HEADERS = {
  "Content-Type": "application/json",
  "x-company-id": "0aa80c0b-0999-4d79-8980-e945b4ea700d",
};

/*------------------------------LOGIN---------------------------*/
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  const data = await res.json();

  // Save user and type
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("userType", data.user.role?.toLowerCase());

  return data;
};

/*------------------------------SIGNUP---------------------------*/
export const signupUser = async (username, email, password, role) => {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify({ username, email, password, role }),
  });

  const response = await res.json();

  if (!res.ok) {
    console.error("Signup API error details:", response);
    throw new Error(response.message || "Signup failed");
  }

  // Save role after signup (optional)
  localStorage.setItem("userType", role.toLowerCase());

  return response;
};

/*------------------------------FORGOT PASSWORD---------------------------*/
export const forgotPassword = async (email) => {
  try {
    const response = await apiService.post(
      "/forgot-password",
      { email },
      { headers: BASE_HEADERS }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to send reset link!");
  }
};

/*------------------------------RESET PASSWORD---------------------------*/
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiService.post(
      "/reset-password",
      { token, newPassword },
      { headers: BASE_HEADERS }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to reset password!");
  }
};

/*------------------------------LOGOUT---------------------------*/
export const logoutUser = async (executiveName) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiService.post(
      "/logout",
      { executiveName },
      {
        headers: {
          ...BASE_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error in logoutUser:", error);
    throw error;
  }
};

// ---------------------- UTILITY --------------------------
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/*------------------------------PRIVATE ROUTE---------------------------*/
export const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!token || !user?.role) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role.toLowerCase();

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const fallbackPath = getFallbackPath(role);
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

/*------------------------------PUBLIC ROUTE---------------------------*/
export const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const path = window.location.pathname;

  if (!token || !user?.role) return children;

  const role = user.role.toLowerCase();
  const expectedPrefix = getRoutePrefix(role);

  // If already in correct role-based section, prevent public access
  if (!path.startsWith(expectedPrefix)) {
    return <Navigate to={getFallbackPath(role)} replace />;
  }

  return <Navigate to={path} replace />;
};

// ---------------------- HELPERS --------------------------
const getFallbackPath = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "executive":
      return "/executive";
    case "hr":
      return "/hr";
    case "manager":
      return "/manager";
    case "tl":
      return "/tl";
    default:
      return "/dashboard"; // default fallback
  }
};

const getRoutePrefix = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "executive":
      return "/executive";
    case "hr":
      return "/hr";
    case "manager":
      return "/manager";
    case "tl":
      return "/tl";
    default:
      return "/";
  }
};
