import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signupUser } from "../../services/auth"; // Import API function

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!username || !email || !password) {
      setError("All fields are required!");
      return;
    }
  
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
  
    setError("");

    try {
        setLoading(true);
        const data = await signupUser(username, email, password, role); // Call API function

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

        setTimeout(() => {
            navigate(data.user.role === "Admin" ? "/admin" : data.user.role === "Executive" ? "/executive" : "/user");
        }, 2000);
    } catch (error) {
        console.error("Signup error:", error);
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
        <div className="left-box1">
          <h2>WELCOME BACK!</h2>
          <p>Already have an account? Click below to log in.</p>
          <button className="switch-btn" onClick={() => navigate("/login")}>
            SIGN IN
          </button>
        </div>

        <div className="right-box">
          <h2>Create Account</h2>
          {error && <p className="error-message">{error}</p>}

          <p>or use your email account</p>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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

            <select value={role} onChange={(e) => setRole(e.target.value)} className="Role">
              <option value="admin">Admin</option>
              <option value="executive">Executive</option>
              <option value="user">Team Lead</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
