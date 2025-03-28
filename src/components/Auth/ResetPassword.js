import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/styles.css";
import { resetPassword } from "../../api/auth"; // Import API function

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
  
    // Extract token from URL
    const token = new URLSearchParams(location.search).get("token");
  
    const handleResetPassword = async (e) => {
      e.preventDefault();
      if (!newPassword) {
        toast.error("Please enter a new password!");
        return;
      }
  
   
      try {
        setLoading(true);
        const data = await resetPassword(token, newPassword); // Call API function

        toast.success(data.message);
        navigate("/login"); // Redirect to login after success
    } catch (error) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};
  
    return (
      <div className="auth-container">
        <div className="auth-box">
          {/* Icons for Reset Password */}
          <div className="icons-container">
            <i className="fas fa-key"></i>  {/* Key Icon */}
          </div>
          
          <h2>Reset Password</h2>
          <p>Enter your new password below.</p>
          
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    );
  };
  
export default ResetPassword;
