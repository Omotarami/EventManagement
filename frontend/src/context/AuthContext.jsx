import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('eventro_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mike make ya call here
      let userData = null;
      
      // Mike this is mock check for organizer
      if (email.includes('organizer')) {
        userData = {
          id: 1,
          name: 'Demo Organizer',
          email: email,
          role: 'organizer'
        };
      } 
      // Mike this is mock check for attendee
      else {
        userData = {
          id: 2,
          name: 'Demo Attendee',
          email: email,
          role: 'attendee'
        };
      }

      localStorage.setItem('eventro_user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Welcome back!');
      return userData;
    } catch (error) {
      toast.error('Invalid credentials');
      throw error;
    }
  };

  const signup = async (userData, userType) => {
    try {
      // Michael make your API call here
      const newUser = {
        ...userData,
        id: Date.now(),
        role: userType
      };
      
      localStorage.setItem('eventro_user', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('Account created successfully!');
      return newUser;
    } catch (error) {
      toast.error('Signup failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('eventro_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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