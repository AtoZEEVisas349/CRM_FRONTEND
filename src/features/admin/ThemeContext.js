import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed from collapsed to open

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Load sidebar state
    const savedSidebarState = localStorage.getItem('sidebarOpen') !== 'false'; // Default to true if not set
    setSidebarOpen(savedSidebarState);
    document.body.classList.toggle('sidebar-open', savedSidebarState);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
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

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      sidebarOpen, 
      toggleSidebar 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};