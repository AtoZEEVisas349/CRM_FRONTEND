import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// 1. Create Context
const AuthContext = createContext();

// 2. Create Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    if (!email || !password) {
      toast.error("All fields are required.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await authService.loginUser(email, password);
      const user = response.user;
  
      localStorage.setItem("token", response.token);
localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("executiveId", user.id);

  
      setUser(user);
      toast.success("Login successful!");
  
      // Add timeout before redirecting
      setTimeout(() => {
        const role = user.role;
        if (role === "Admin") navigate("/admin");
        else if (role === "Executive") navigate("/executive");
        else if (role === "TL") navigate("/user");
      }, 5000); // 5000ms = 5 seconds
  
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  

//signup
const signup = async (username, email, password, role) => {
  if (!username || !email || !password || !role) {
    toast.error("All fields are required!");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long.");
    return;
  }

  try {
    setLoading(true);
    const data = await authService.signupUser(username, email, password, role);
    toast.success("Signup successful! Redirecting...");
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
      })
    );

    // You can redirect based on role
    setTimeout(() => {
      const redirectPath =
        data.user.role === "Admin" || data.user.role === "Executive"
          ? "/login"
          : "/user";
      navigate(redirectPath);
    }, 5000);
  } catch (error) {
    console.error("Signup error:", error);
    toast.error(error.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};

  // Logout function
  const logout = async () => {
    try {
      await authService.logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("executiveId");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  
  
  
  // Forgot Password
 const forgotPassword = async (email) => {
  if (!email) {
    toast.error("Please enter your email!");
    return;
  }

  try {
    setLoading(true);
    const data = await authService.forgotPassword(email);
    toast.success(data.message);
    navigate("/login");
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  // Reset Password
  const resetPassword = async (token, newPassword) => {
    if (!newPassword) {
      toast.error("Please enter a new password!");
      return;
    }
  
    try {
      setLoading(true);
      const data = await authService.resetPassword(token, newPassword);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };
  

  // Signup
 

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        forgotPassword,
        resetPassword,
        signup,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook for consuming context
export const useAuth = () => useContext(AuthContext);
