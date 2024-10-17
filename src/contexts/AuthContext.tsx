import { createContext, useContext, useState } from 'react';
import { socket } from '@/utils/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const isAuthenticated = Boolean(token);
  // const isAuthenticated = true; // TODO: Remove

  const login = (loginData = null) => {
    setToken(loginData?.authToken);
    handleSocketConnect(loginData?.authToken);
  };

  const logout = () => {
    setToken(null);
    handleSocketDisconnect();
  };

  const handleSocketConnect = (userToken: string | null) => {
    socket.auth = {};
    socket.auth.token = `Bearer ${userToken}`;
    socket.connect();
  };

  const handleSocketDisconnect = () => {
    socket.disconnect();
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    token,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
