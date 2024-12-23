import React, { createContext, useState, useEffect } from 'react';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState(() => {
    const savedData = localStorage.getItem('globalData');
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    if (globalData) {
      localStorage.setItem('globalData', JSON.stringify(globalData));
    }
  }, [globalData]);
  
  return (
    <GlobalStateContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </GlobalStateContext.Provider>
  );
}