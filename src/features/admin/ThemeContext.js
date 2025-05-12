import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const themes = {
  light: '#ffffff',
  dark: '#1e1e1e',
  red: '#f19aeb',
  blue: '#a9def9',
  green: '#4dff88',
  brown: '#f4ccbb',
};
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
document.body.style.backgroundColor = themes[savedTheme] || '#ffffff';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Load sidebar state from localStorage
    const savedSidebarState = localStorage.getItem('sidebarOpen') !== 'false';
    setSidebarOpen(savedSidebarState);
    document.body.classList.toggle('sidebar-open', savedSidebarState);
  }, []);

  const applyTheme = (themeKey) => {
    const color = themes[themeKey];
    if (color) {
      document.body.style.backgroundColor = color;
    }
  };
  const changeTheme = (themeKey) => {
    if (!themes[themeKey]) return;
    setTheme(themeKey);
    localStorage.setItem('theme', themeKey);
  
    // This is where it goes 👇
    document.documentElement.setAttribute('data-theme', themeKey);
  };
  

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', newState.toString());
    document.body.classList.toggle('sidebar-open', newState);

    window.dispatchEvent(new CustomEvent('sidebarToggle', {
      detail: { open: newState }
    }));
  };
  const resetTheme = () => {
    localStorage.clear(); // Clear all saved data
  
    // Reset theme to light
    setTheme('light');
    document.documentElement.setAttribute('theme', 'light');
    document.body.style.backgroundColor = themes['light'];
  
  }
    
  
  return (
    <ThemeContext.Provider value={{
      theme,
      changeTheme,   // For selecting specific themes
      themes,        // Object of all theme colors
      sidebarOpen,
      toggleSidebar,
      resetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};