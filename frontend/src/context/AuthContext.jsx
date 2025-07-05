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


  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }


        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {

          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }


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


  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      

      const expirationTime = decodedToken.exp * 1000;
      const timeUntilExpiration = expirationTime - Date.now();
      

      const logoutTimer = setTimeout(() => {
        logout();
      }, timeUntilExpiration);
      

      return () => clearTimeout(logoutTimer);
    }
  }, [isAuthenticated]);


  const register = async (userData) => {
    try {
      setError(null);
      const data = await apiService.register(userData);
      

      localStorage.setItem('token', data.token);
      

      setUser(data);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };


  const login = async (userData) => {
    try {
      setError(null);
      const data = await apiService.login(userData);
      console.log("response", data.token);
      
      localStorage.setItem('token', data.token);
      
      setUser(data);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };


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