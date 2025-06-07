// src/context/UserContext.js
import { createContext, useContext } from 'react';

export const UserContext = createContext(null);

export const useUser = () => {
  return useContext(UserContext);
};