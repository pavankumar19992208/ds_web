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

  useEffect(() => {
    // Fetch subjects and grades from the backend
    const fetchData = async () => {
      try {
        const subjectsResponse = await fetch('/api/subjects');
        const gradesResponse = await fetch('/api/grades');
        const subjects = await subjectsResponse.json();
        const grades = await gradesResponse.json();
        setGlobalData((prevData) => ({
          ...prevData,
          subjects,
          grades,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <GlobalStateContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </GlobalStateContext.Provider>
  );
};