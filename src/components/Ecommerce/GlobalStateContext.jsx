import React, { createContext, useState, useEffect } from 'react';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
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
// GlobalStateContext.jsx
// import React, { createContext, useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import * as jwtDecode from 'jwt-decode'; // Updated import statement
// import BaseUrl from '../../config';

// export const GlobalStateContext = createContext();

// export const GlobalStateProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [authChecked, setAuthChecked] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Verify token with backend
//   const verifyToken = useCallback(async (token) => {
//     try {
//       const response = await axios.get(`${BaseUrl}/verify-token`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       return response.data;
//     } catch (error) {
//       console.error('Token verification failed:', error);
//       return null;
//     }
//   }, []);

//   // Check if token is expired
//   const isTokenExpired = (token) => {
//     try {
//       const decoded = jwtDecode.jwtDecode(token); // Updated usage
//       return decoded.exp * 1000 < Date.now();
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return true;
//     }
//   };

//   // Refresh token
//   const refreshToken = useCallback(async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) throw new Error('No refresh token available');
      
//       const response = await axios.post(`${BaseUrl}/refresh-token`, {
//         refreshToken
//       });
      
//       const { token, user: userData } = response.data;
//       localStorage.setItem('token', token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       return { token, user: userData };
//     } catch (error) {
//       console.error('Token refresh failed:', error);
//       logoutUser();
//       return null;
//     }
//   }, []);

//   // Initialize auth state
//   const initializeAuth = useCallback(async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (!token || !userData) {
//       setAuthChecked(true);
//       setLoading(false);
//       return;
//     }

//     try {
//       // Check if token is expired
//       if (isTokenExpired(token)) {
//         const newTokens = await refreshToken();
//         if (!newTokens) {
//           throw new Error('Token refresh failed');
//         }
//         setUser(newTokens.user);
//         setIsAuthenticated(true);
//         localStorage.setItem('user', JSON.stringify(newTokens.user));
//       } else {
//         // Verify token with backend
//         const verified = await verifyToken(token);
//         if (!verified) {
//           throw new Error('Token verification failed');
//         }
        
//         setUser(JSON.parse(userData));
//         setIsAuthenticated(true);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.error('Authentication initialization failed:', error);
//       logoutUser();
//     } finally {
//       setAuthChecked(true);
//       setLoading(false);
//     }
//   }, [verifyToken, refreshToken]);

//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   const loginUser = async (token, userData, refreshToken) => {
//     try {
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userData));
//       if (refreshToken) {
//         localStorage.setItem('refreshToken', refreshToken);
//       }
      
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(userData);
//       setIsAuthenticated(true);
//       return true;
//     } catch (error) {
//       console.error('Login failed:', error);
//       logoutUser();
//       return false;
//     }
//   };

//   const logoutUser = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('refreshToken');
//     delete axios.defaults.headers.common['Authorization'];
    
//     // Optional: Notify backend about logout
//     axios.post(`${BaseUrl}/logout`).catch(error => {
//       console.error('Logout notification failed:', error);
//     });
//   };

//   // Auto-logout when token expires
//   useEffect(() => {
//     if (!isAuthenticated) return;

//     const token = localStorage.getItem('token');
//     if (!token) return;

//     try {
//       const decoded = jwtDecode.jwtDecode(token); // Updated usage
//       const expiresIn = decoded.exp * 1000 - Date.now();

//       if (expiresIn <= 0) {
//         logoutUser();
//         return;
//       }

//       const timer = setTimeout(() => {
//         logoutUser();
//       }, expiresIn);

//       return () => clearTimeout(timer);
//     } catch (error) {
//       console.error('Error decoding token for auto-logout:', error);
//       logoutUser();
//     }
//   }, [isAuthenticated]);

//   // Interceptor to handle token refresh on 401 errors
//   useEffect(() => {
//     const interceptor = axios.interceptors.response.use(
//       response => response,
//       async error => {
//         const originalRequest = error.config;
        
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;
          
//           try {
//             const newTokens = await refreshToken();
//             if (newTokens) {
//               originalRequest.headers['Authorization'] = `Bearer ${newTokens.token}`;
//               return axios(originalRequest);
//             }
//           } catch (refreshError) {
//             console.error('Auto-refresh failed:', refreshError);
//             logoutUser();
//           }
//         }
        
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, [refreshToken]);

//   return (
//     <GlobalStateContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         authChecked,
//         loading,
//         loginUser,
//         logoutUser,
//         refreshToken
//       }}
//     >
//       {children}
//     </GlobalStateContext.Provider>
//   );
// };