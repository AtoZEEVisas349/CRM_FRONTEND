import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("All fields are required!");
      return;
    }
  
    setError(""); // Clear previous errors
  
    try {
      setLoading(true);
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Find user with matching email and password
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Invalid email or password");
      }
      
      // Store user session info
      localStorage.setItem("token", user.token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("currentUser", JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }));
      
      toast.success("Login successful! Redirecting...");
      
      // Redirect based on role
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "executive") {
          navigate("/executive");
        } else {
          navigate("/user");
        }
      }, 2000);
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="background-box-1"></div>
      <div className="background-box-2"></div>

      <div className="form-container">
        <div className="left-box">
          <h2>WELCOME!</h2>
          <p>Don't have an account? Click below to sign up.</p>
          <button className="switch-btn" onClick={() => navigate("/signup")}>
            SIGN UP
          </button>
        </div>

        <div className="right-box">
          <h2>Login to Your Account</h2>
          {error && <p className="error-message">{error}</p>}
          
          <p>Enter your credentials</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;