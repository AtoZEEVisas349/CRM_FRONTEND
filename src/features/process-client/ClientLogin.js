import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ import useNavigate
import { useProcess } from "../../context/ProcessContext";

const ClientLogin = () => {
  const { login } = useProcess();
  const navigate = useNavigate(); // ✅ initialize navigate hook

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert("Login successful!");

      // ✅ Navigate to dashboard
      navigate("/process/client/dashboard");
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
