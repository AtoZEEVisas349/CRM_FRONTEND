import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../styles/styles.css";
import { forgotPassword } from "../../api/auth"; // Import API function
import { FaLock } from "react-icons/fa"; // Importing a lock icon
import {Link} from "react-router-dom"


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email!");
            return;
        }

        try {
            setLoading(true);
            const data = await forgotPassword(email); // Call API function

            toast.success(data.message);
            navigate("/login"); // Redirect to login after showing success
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
        <div className="auth-box">
            <FaLock className="auth-icon" /> {/* Lock Icon */}
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a password reset link.</p>
            <form onSubmit={handleForgotPassword}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <p className="login-link">
                Remembered your password? <a href="/login">Login here</a>
            </p> 
            </form>

        </div>
    </div>
);
};

export default ForgotPassword;