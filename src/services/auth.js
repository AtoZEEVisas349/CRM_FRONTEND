import apiService from "./apiService";
import { Navigate } from "react-router-dom";

const API_BASE_URL = "https://crm-backend-production-c208.up.railway.app/api";

// Shared headers
const BASE_HEADERS = {
  "Content-Type": "application/json",
  "x-company-id": "0aa80c0b-0999-4d79-8980-e945b4ea700d",
};

/*------------------------------LOGIN (fetch)---------------------------*/
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

  return await res.json();
};

/*------------------------------SIGNUP (fetch)---------------------------*/
export const signupUser = async (username, email, password, role) => {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify({ username, email, password, role }),
  });

  const errorBody = await res.json();
  if (!res.ok) {
    console.error("Signup API error details:", errorBody);
    throw new Error(errorBody.message || "Signup failed");
  }

  return errorBody;
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
      {
        executiveName, // Now included in the request body
      },
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


/*------------------------------AUTH HELPERS---------------------------*/
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};
/*-------------------------------PUBLIC ROUTES-----------------*/
// export const PublicRoute = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");

//   // If no user is logged in, allow access to the public page
//   if (!token) return children;

//   // Redirect logged-in users based on their role
//   if (user?.role === "admin") return <Navigate to="/admin" replace />;
//   if (user?.role === "executive") return <Navigate to="/executive" replace />;
  
//   // Optionally fallback to a default route
//   return <Navigate to="/executive" replace />;
// };