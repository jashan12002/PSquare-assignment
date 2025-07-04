import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import apiService from '../utils/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Check if token is expired
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token has expired
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Token is valid, get user profile
        const userData = await apiService.getUserProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("error", error);
        // localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, [navigate]);

  // Auto logout when token expires
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      
      // Calculate time until token expires (in milliseconds)
      const expirationTime = decodedToken.exp * 1000;
      const timeUntilExpiration = expirationTime - Date.now();
      
      // Set timer to log out when token expires
      const logoutTimer = setTimeout(() => {
        logout();
      }, timeUntilExpiration);
      
      // Clean up timer
      return () => clearTimeout(logoutTimer);
    }
  }, [isAuthenticated]);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const data = await apiService.register(userData);
      
      // Store token
      localStorage.setItem('token', data.token);
      
      // Set user and auth state
      setUser(data);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setError(null);
      const data = await apiService.login(userData);
      console.log("response", data.token);
      
      // Store token
      localStorage.setItem('token', data.token);
      
      // Set user and auth state
      setUser(data);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};