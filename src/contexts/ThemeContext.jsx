import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * Custom hook to use the theme context
 * @returns {Object} Theme context methods and state
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Provider component for theme management
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - Rendered component
 */
export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPrefs = window.localStorage.getItem('color-theme');
      if (typeof storedPrefs === 'string') {
        return storedPrefs;
      }

      // Check for user's system preference
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return 'dark';
      }
    }

    // Default to light theme
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to document
  const applyTheme = (newTheme) => {
    const root = window.document.documentElement;
    
    // Remove the previous theme class
    root.classList.remove(theme === 'dark' ? 'dark' : 'light');
    
    // Add the new theme class
    root.classList.add(newTheme);
    
    // Store the theme preference in localStorage
    localStorage.setItem('color-theme', newTheme);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

