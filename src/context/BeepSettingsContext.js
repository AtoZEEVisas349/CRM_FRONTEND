import React, { createContext, useState, useEffect } from 'react';

export const BeepSettingsContext = createContext();

export const BeepSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    selectedSound: 'beep1',
    volume: 50,
    timing: 5,
    enabled: true
  });
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('beepSoundSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <BeepSettingsContext.Provider value={{ settings, setSettings: updateSettings }}>
      {children}
    </BeepSettingsContext.Provider>
  );
};