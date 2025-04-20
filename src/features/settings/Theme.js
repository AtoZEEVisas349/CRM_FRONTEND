import React, { useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { ThemeContext } from "../admin/ThemeContext";

const Theme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="theme-settings">
      <h2>Choose Your Theme</h2>
      <div className="theme-options">
        <button 
          className="theme-toggle-icon" 
          onClick={toggleTheme}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />} 
          {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        </button>
      </div>
    </div>
  );
};

export default Theme;
