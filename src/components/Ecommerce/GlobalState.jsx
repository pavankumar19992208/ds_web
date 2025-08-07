import React, { createContext, useState, useEffect } from 'react';

export const GlobalStateContext = createContext();

export const EcommerceStateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAgentAuthenticated, setIsAgentAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsUserAuthenticated(true);
    }
    const storedAgent = localStorage.getItem('agent');
    if (storedAgent) {
      setAgent(JSON.parse(storedAgent));
      setIsAgentAuthenticated(true);
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setIsUserAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    setIsUserAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Agent login/logout
  const loginAgent = (agentData) => {
    setAgent(agentData);
    setIsAgentAuthenticated(true);
    localStorage.setItem('agent', JSON.stringify(agentData));
  };

  const logoutAgent = () => {
    setAgent(null);
    setIsAgentAuthenticated(false);
    localStorage.removeItem('agent');
  };

  return (
    <GlobalStateContext.Provider
      value={{
        user,
        agent,
        isUserAuthenticated,
        isAgentAuthenticated,
        loginUser,
        logoutUser,
        loginAgent,
        logoutAgent,
        setUser,
        setAgent,
        cartCount,
        setCartCount
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
