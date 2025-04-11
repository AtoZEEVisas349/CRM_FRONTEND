import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { loginUser } from "../../services/auth"; // Import API function
import "react-toastify/dist/ReactToastify.css";
import "../../styles/signup.css";
import img1 from "../../assets/img1.jpg";
import {Link} from "react-router-dom";
import img3 from "../../assets/img2.jpg";
import img4 from "../../assets/img3.jpg";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const texts = ["Fast & Secure", "User-Friendly Interface", "24/7 Support"];
  const [currentIndex, setCurrentIndex] = useState(0);
  
   const slides = [{
      text: "Fast & Secure",
      img:img1
    },
    {
      text: "User-Friendly Interface",
      img: img4
    },
    {
      text: "24/7 Support",
      img: img3
    }];
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }, 3000);
      return () => clearInterval(interval);
    }, []);
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

      // ✅ Store executive's username (only for Executives)
      if (data.user.role === "Executive") {
        localStorage.setItem("executiveName", data.user.username);
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
      }, 5000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
 
     <div className="container">
           <ToastContainer position="top-right" autoClose={3000} />
        <div className="left-half">  
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
                <div className="create">Login to your Account</div>
         <p style={{paddingTop:"10px"}}>Enter your credentials</p>
         {error && <p className="error-message">{error}</p>}
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
            <div className="text-bottom">
            <p className="small-text">
             Don't have an account? <a href="/signup" style={{color:"black"}}>Signup</a>   </p>
             <Link to= "/forgot-password"  style={{color:"black",marginTop:"10px"}}>Forgot Password</Link>
            </div>
         </form>
          </div>
        </div>  
      </div>
  );
};

export default Login;
