import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { socket } from '@/utils/socket';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import {
  VTS_LOCAL_STORAGE_DEALER_DATA_KEY,
  VTS_LOCAL_STORAGE_TOKEN_KEY,
} from '@/utils/constants';
import { localStorageApi, logoutApi } from '@/services/apiAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [secretKey, setSecretKey] = useState('');
  // const [token, setToken] = useLocalStorageState(
  //   null,
  //   VTS_LOCAL_STORAGE_TOKEN_KEY,
  //   secretKey
  // );
  // const [dealer, setDealer] = useLocalStorageState(
  //   null,
  //   VTS_LOCAL_STORAGE_DEALER_DATA_KEY,
  //   secretKey
  // );
  const [token, setToken] = useState(null);
  const [dealer, setDealer] = useState(null);

  const isAuthenticated = Boolean(token);

  const login = (loginData = null) => {
    setToken(loginData?.authToken);
    handleSocketConnect(loginData?.authToken);
    setDealer(loginData?.dealer);
    setSecretKey(loginData?.lssk);
  };

  const logout = async (callApi = true) => {
    if (callApi) await logoutApi();
    setToken(null);
    setDealer(null);
    localStorage.clear();
    handleSocketDisconnect();
  };

  const handleSocketConnect = (dealerAuthToken: string | null) => {
    socket.auth = {};
    socket.auth.token = `Bearer ${dealerAuthToken}`;
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
  }, [token, navigate]);

  const value = {
    isAuthenticated,
    login,
    logout,
    token,
    setToken,
    dealer,
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
