import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ import useNavigate
import { useProcess } from "../../context/ProcessAuthContext";
import { useProcessService } from "../../context/ProcessServiceContext";

const ClientLogin = () => {
  const { login } = useProcess();
  const {startWork}=useProcessService();
  const navigate = useNavigate(); // ✅ initialize navigate hook

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert("Login successful!");
  
      localStorage.setItem("userType", "processperson");
   const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser?.id) {
      try {
        await startWork(parsedUser.id);
        console.log("✅ Work session started");
      } catch (err) {
        console.error("❌ Failed to start work session:", err.message);
      }
    } else {
      console.warn("⚠ No user ID found to start work");
    }

        navigate("/process");
  
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="process-auth-wrapper">
      <div className="process-auth-card">
        <h2>Welcome back!</h2>
        <p>Log in to your account to continue exchanging books and discovering new editions.</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="process-primary-btn" onClick={handleLogin}>
          Log in
        </button>

        <a href="#" className="process-link">Forgot password?</a>

        <p className="process-footer-text">
          Don't have an account? <Link to="/process/client/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default ClientLogin;