import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('bitego_token');
    const savedUser = localStorage.getItem('bitego_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('bitego_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('bitego_token', token);
    localStorage.setItem('bitego_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (name, email, phone, password) => {
    const res = await api.post('/auth/register', { name, email, phone, password });
    const { token, user } = res.data;
    localStorage.setItem('bitego_token', token);
    localStorage.setItem('bitego_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('bitego_token');
    localStorage.removeItem('bitego_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('bitego_user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'restaurantOwner';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin, isOwner }}>
      {children}
    </AuthContext.Provider>
  );
};
