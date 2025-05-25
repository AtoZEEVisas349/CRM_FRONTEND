import { Navigate } from "react-router-dom";
const API_BASE_URL = "https://crm-backend-production-c208.up.railway.app/api";
const BASE_HEADERS = {
  "Content-Type": "application/json",
  "x-company-id": "0aa80c0b-0999-4d79-8980-e945b4ea700d",
};

/*------------------------------LOGIN---------------------------*/
export const loginUser = async (email, password) => {
  const tryLogin = async (userType) => {
    const res = await fetch(`${API_BASE_URL}/${userType}/login`, {
      method: "POST",
      headers: BASE_HEADERS,
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw await res.json();
    const data = await res.json();
    localStorage.setItem("userType", userType);
    return { ...data, type: userType };
  };

  try {
    return await tryLogin("customer");
  } catch (err1) {
    try {
      return await tryLogin("processperson");
    } catch (err2) {
      const errorMessage =
        err2?.message || err1?.message || "Login failed for both user types.";
      throw new Error(errorMessage);
    }
  }
};

/*------------------------------SIGNUP---------------------------*/
export const signupUser = async (fullName, email, password, userType = "customer") => {
  const res = await fetch(`${API_BASE_URL}/${userType}/signup`, {
    method: "POST",
    headers: BASE_HEADERS,
    credentials: "include",
    body: JSON.stringify({ fullName, email, password }),
  });

  const responseBody = await res.json();
  if (!res.ok) {
    console.error("Signup API error details:", responseBody);
    throw new Error(responseBody.error || "Signup failed");
  }

  return responseBody;
};
/*------------------------------LOGOUT---------------------------*/
export const logoutUser = async (userType = "customer") => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/${userType}/logout`, {
    method: "POST",
    headers: {
      ...BASE_HEADERS,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // still needed for cookie fallback
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Logout failed");
  return data;
};

// export const isAuthenticated = () => {
//   return !!localStorage.getItem("token");
// };
// export const getUserType = () => {
//   const data = localStorage.getItem("userType");
//   return data || null;
// };

// export const ProcessPrivateRoute = ({ children }) => {
//   return isAuthenticated()
//     ? children
//     : <Navigate to="/process/client/login" replace />;
// };
// export const ProcessPublicRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const userType = localStorage.getItem("userType");

//   // If user is not logged in, allow access to login/signup
//   if (!token) return children;

//   // Redirect authenticated users based on their type
//   if (userType === "customer") return <Navigate to="/process/client/dashboard" replace />;
//   if (userType === "processperson") return <Navigate to="/process/person/dashboard" replace />;

//   // Default fallback redirect (if type is unknown or missing)
//   return <Navigate to="/process/client/dashboard" replace />;
// };
