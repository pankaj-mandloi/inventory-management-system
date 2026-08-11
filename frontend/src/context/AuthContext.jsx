import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token and user on page load
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('🔍 Checking auth on load...');
    console.log('📦 Token exists:', !!token);
    console.log('📦 User exists:', !!savedUser);
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Verify token validity with backend
        verifyUser();
      } catch (error) {
        console.error('Error parsing user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const verifyUser = async () => {
    try {
      console.log('🔐 Verifying user...');
      const response = await api.get('/auth/me');
      console.log('✅ User verified:', response.data.user);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('❌ User verification failed:', error);
      // Only clear if it's a 401 (unauthorized)
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } else {
        // For other errors, keep the user but show a toast
        toast.error('Failed to verify user. Please refresh.');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔑 Logging in...');
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set user in state
      setUser(user);
      
      console.log('✅ Login successful!', user.email);
      toast.success('Welcome back! 🌿');
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('📝 Registering...');
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      
      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set user in state
      setUser(user);
      
      console.log('✅ Registration successful!', user.email);
      toast.success('Registration successful! 🌱');
      return { success: true };
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear everything
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
      console.log('✅ Logout successful');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};