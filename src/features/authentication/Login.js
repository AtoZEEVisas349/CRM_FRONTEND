import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { loginUser } from "../../services/auth"; // Import API function
import "react-toastify/dist/ReactToastify.css";
import {Link} from "react-router-dom"

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
      const data = await loginUser(email, password); // Call API function

      // ✅ Check if user data contains `username`
      if (!data.user || !data.user.username) {
        throw new Error("User username missing in response!");
      }

      // ✅ Store user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      console.log("User data after login:", data.user);
      localStorage.setItem("userId", data.user.id); // ✅ use "id" instead of "_id"

      if (data.user.role === "Admin") {
        localStorage.setItem("adminName", data.user.username); // ✅ admin name
        localStorage.setItem("adminId", data.user.id);         // ✅ admin id
        navigate("/admin");
      } else if (data.user.role === "Executive") {
        localStorage.setItem("executiveName", data.user.username);
        localStorage.setItem("executiveId", data.user.id);
        navigate("/executive");
      } else if (data.user.role === "TL") {
        navigate("/user");
      }
      

      
      toast.success("Login successful! Redirecting...");

      setTimeout(() => {
        if (data.user.role === "Admin") {
          navigate("/admin");
        } else if (data.user.role === "Executive") {
          navigate("/executive");
        } else if (data.user.role === "TL") {
          navigate("/user");
        }
      }, 2000);
    } catch (error) {
      setError(error.message);
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
            <Link to= "/forgot-password" className="forgot-link">Forgot Password</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
