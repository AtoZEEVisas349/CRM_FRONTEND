import React, { useState } from "react";

const Theme = () => {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    document.body.setAttribute("data-theme", e.target.value); // simple theme switcher
  };

  return (
    <div className="theme-settings">
      <h2>Choose Your Theme</h2>
      <div className="theme-options">
        <label>
          <input
            type="radio"
            value="light"
            checked={theme === "light"}
            onChange={handleThemeChange}
          />
          <span>Light</span>
          <div className="theme-preview">
            <div className="theme-circle light-theme"></div>
            <span>🌞</span>
          </div>
        </label>
        <label>
          <input
            type="radio"
            value="dark"
            checked={theme === "dark"}
            onChange={handleThemeChange}
          />
          <span>Dark</span>
          <div className="theme-preview">
            <div className="theme-circle dark-theme"></div>
            <span>🌙</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Theme;
