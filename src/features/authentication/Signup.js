import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signupUser } from "../../services/auth"; // Import API function
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
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
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
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
        setSignupSuccess(true);
        setTimeout(() => {
            navigate(data.user.role === "Admin" ? "/login" : data.user.role === "Executive" ? "/login" : "/user");
        }, 5000);
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