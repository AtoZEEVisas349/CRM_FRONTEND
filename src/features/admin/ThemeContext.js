

import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const themes = {
  light: '#ffffff',
  dark: '#1e1e1e',
  red: '#f19aeb',
  blue: '#a9def9',
  green: '#4dff88',
  brown: '#f4ccbb',
  lavender: '#c5a8ff', // Replacing ocean-sunset with Lavender Twilight theme
  ocean: '#5e9ad9', // Ocean Blue Mist Theme
  peach: '#6d4c41'

};


export const ThemeProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user?.role?.toLowerCase() || 'executive';

  const executiveId = localStorage.getItem('executiveId');
  const id = user?.id;
  
  const THEME_KEYS = {
    admin: `adminTheme_${executiveId || 'light'}`,
    executive: `executiveTheme_${id || 'light'}`,
  };
  
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const roleKey = THEME_KEYS[role] || 'theme';
    const savedTheme = localStorage.getItem(roleKey) || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const savedSidebarState = localStorage.getItem('sidebarOpen') !== 'false';
    setSidebarOpen(savedSidebarState);
    // document.body.classList.toggle('sidebar-open', savedSidebarState);
  }, [role]);

  const applyTheme = (themeKey) => {
    const color = themes[themeKey];
    document.documentElement.setAttribute('data-theme', themeKey);
    // document.body.style.backgroundColor = color || themes.light;
  };

  const changeTheme = (themeKey) => {
    if (!themes[themeKey]) return;
    setTheme(themeKey);
    const roleKey = THEME_KEYS[role] || 'theme';
    localStorage.setItem(roleKey, themeKey);
    applyTheme(themeKey);
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', newState.toString());
    // document.body.classList.toggle('sidebar-open', newState);

    window.dispatchEvent(new CustomEvent('sidebarToggle', {
      detail: { open: newState }
    }));
  };

  const forceLightTheme = () => {
    changeTheme('light');
  };

  const resetTheme = () => {
    const roleKey = THEME_KEYS[role] || 'theme';
    localStorage.removeItem(roleKey);
    changeTheme('light');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
        toggleTheme,
        themes,
        sidebarOpen,
        toggleSidebar,
        resetTheme,
        forceLightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
