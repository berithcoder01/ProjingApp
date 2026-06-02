import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login, register } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@orcaai:token');
    if (token) {
      getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('@orcaai:token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email, password) => {
    const data = await login(email, password);
    localStorage.setItem('@orcaai:token', data.token);
    setUser(data.user);
  };

  const signUp = async (name, email, password) => {
    const data = await register(name, email, password);
    return data;
  };

  const signOut = () => {
    localStorage.removeItem('@orcaai:token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
