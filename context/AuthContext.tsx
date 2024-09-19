// /context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextProps {
  isLoggedIn: boolean;
  carInfo: string | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [carInfo, setCarInfo] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      // Fetch car information if token exists
      fetch('/api/car', {
        method: 'GET',  // Add the method key to specify HTTP method
        headers: {
          'Authorization': `Bearer ${token}`, // Assuming Bearer format for token
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.car) {
            setCarInfo(data.car); // Update car info from API
            setIsLoggedIn(true);
          }
        })
        .catch(() => setIsLoggedIn(false));
    }
  }, []);

  const login = () => {
    // You can trigger login logic here (e.g., fetch new car data)
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Clear the authToken cookie and reset the state
    Cookies.remove('authToken');
    setIsLoggedIn(false);
    setCarInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, carInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
