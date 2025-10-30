// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { tokenExtractor } from '../utils/helper/tokenExtractor';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLevel, setUserLevel] = useState(null);



  useEffect(() => {
    const fetchLoginDetails = () => {
      const loginDetails = JSON.parse(localStorage.getItem("login_Details"));
      if (loginDetails?.authorisation?.token) {
        setUser({
          role: `${loginDetails?.type}` // Example role, fetch this dynamically
        });
        // setUserLevel({
        //   role:  
        // })
      }
    };

    fetchLoginDetails(); // Initial fetch

    // Listen for custom login event
    window.addEventListener('login', fetchLoginDetails);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('login', fetchLoginDetails);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
