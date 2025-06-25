import React, { createContext, useState, useEffect } from 'react';

export const GlobalStateContext = createContext();

export const EcommerceStateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <GlobalStateContext.Provider
      value={{
        user,
        isAuthenticated,
        loginUser,
        logoutUser,
        setUser
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
