import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '@/utils/socket';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { VTS_LOCAL_STORAGE_TOKEN_KEY } from '@/utils/constants';
import { localStorageApi, logoutApi } from '@/services/apiAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // const [token, setToken] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [token, setToken] = useLocalStorageState(
    null,
    VTS_LOCAL_STORAGE_TOKEN_KEY,
    secretKey
  );

  const isAuthenticated = Boolean(token);
  // const isAuthenticated = true; // TODO: Remove

  const login = (loginData = null) => {
    setToken(loginData?.authToken);
    handleSocketConnect(loginData?.authToken);
    setSecretKey(loginData?.lssk);
  };

  const logout = async (callApi = true) => {
    if (callApi) await logoutApi();
    setToken(null);
    localStorage.clear();
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

  useEffect(() => {
    async function getLocalStorageSecretKey() {
      const localStorageSecretKeyResponse = await localStorageApi();
      setSecretKey(localStorageSecretKeyResponse);
    }

    if (!token) getLocalStorageSecretKey();
  }, [token]);

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
