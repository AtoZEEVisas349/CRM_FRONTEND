import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
const Signup = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState("");
  const slides = [{
    text: "Fast & Secure",
    img:img1
  },
  {
    text: "User-Friendly Interface",
    img: img3
  },
  {
    text: "24/7 Support",
    img: img2
  }];
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const handleSignup = (e) => {
    e.preventDefault();
    signup(username, email, password, role); // Removed companyId
  };
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Signup allowed for Admins only. Please login first.");
      navigate("/login");
      return;
    }
  
    const { role } = JSON.parse(userData);
    if (role !== "Admin") {
      toast.error("Access denied. Only Admins can access the signup page.");
      navigate("/login");
    }
  }, []);
  
  return (
    <div className="main-container">
    <div className="container">
<ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        closeButton
      />    <div className="left-half">  
    <div className="image-wrapper">
      <img src={slides[currentIndex].img}
    alt="Slide"
    className="background-img" />

      <img
        src={slides[currentIndex].img}
        alt="Slide"
        className="background-img"
      />

      <div className="slider-overlay">
        <div className="slider-text">{slides[currentIndex].text}</div>
        <div className="indicator-container">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`indicator-line ${i === currentIndex ? "active" : ""}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
    </div>

    <div className="right-half">
      <div className="login-form">
            <div className="create">Create an Account</div>
            <p className="small-text">
             Already have an account? <a href="/login" style={{color:"black"}}>Login</a>
            </p>
            {error && <p className="error-message">{error}</p>}
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

<input type="hidden" value="Admin" />



             <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "SIGN UP"}
            </button>
          </form>
      </div>
    </div>
  </div>
  </div>
  );
};

export default Signup;