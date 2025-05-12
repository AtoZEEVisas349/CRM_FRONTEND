import React, { useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { ThemeContext } from "../admin/ThemeContext";

const Theme = () => {
  // const { theme, toggleTheme } = useContext(ThemeContext);
  const { changeTheme, themes, theme } = useContext(ThemeContext);
  return (
    <div className="theme-settings">
      <h2>Choose Your Theme</h2>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap',marginTop:"30px" }}>
        {Object.entries(themes).map(([key, color]) => (
          <div
            key={key}
            onClick={() => changeTheme(key)}
            title={key}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: color,
              border: theme === key ? '2px solid black' : '1px solid gray',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
    
  
  );
};

export default Theme;