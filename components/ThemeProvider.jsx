'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Changed default to dark

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Changed default to dark
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const colors = {
    background: theme === 'dark' ? '#011627' : '#ffffff',
    text: theme === 'dark' ? '#ffffff' : '#011627',
    primary: theme === 'dark' ? '#4dabf7' : '#1a6fb0',
    secondary: theme === 'dark' ? 'rgba(1, 22, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    accent: theme === 'dark' ? '#16a699' : '#16a699',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}; 