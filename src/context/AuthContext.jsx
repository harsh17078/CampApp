import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [themeMode, setThemeMode] = useState(localStorage.getItem('camp_theme') || 'light');

  // Apply theme to DOM so CSS variables are activated
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    localStorage.setItem('camp_theme', nextTheme);
  };

  // Load authenticated user on app boot
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('userdata');

      if (savedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('userdata', JSON.stringify(res.user));
          }
        } catch {
          // If offline or token expired, fallback to cached user or clear
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              logout();
            }
          } else {
            logout();
          }
        }
      } else if (savedUser) {
        // Fallback backward compatibility for demo
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('userdata');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      if (data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userdata', JSON.stringify(data.user));
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Connection to server failed';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      if (data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userdata', JSON.stringify(data.user));
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, message };
    }
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const data = await userAPI.updateProfile(profileData);
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('userdata', JSON.stringify(data.user));
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || 'Update failed' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Update failed';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userdata');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user || !!token,
        loading,
        themeMode,
        toggleTheme,
        login,
        register,
        updateProfile,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
