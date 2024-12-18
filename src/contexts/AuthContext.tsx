import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { socket } from '@/utils/socket';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import {
  VTS_LOCAL_STORAGE_DEALER_DATA_KEY,
  VTS_LOCAL_STORAGE_TOKEN_KEY,
} from '@/utils/constants';
import { localStorageApi, logoutApi } from '@/services/apiAuth';
import { useEditHistory } from '@/hooks/useEditCallHistory';
import { useSIPProvider } from '@/components/SipProvider';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { sessionManager } = useSIPProvider();
  const { onClose } = useEditHistory();
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  const [secretKey, setSecretKey] = useState('');
  const [token, setToken] = useLocalStorageState(
    null,
    VTS_LOCAL_STORAGE_TOKEN_KEY
  );
  const [dealer, setDealer] = useLocalStorageState(
    null,
    VTS_LOCAL_STORAGE_DEALER_DATA_KEY
  );

  const isAuthenticated = Boolean(token);

  const login = (loginData = null) => {
    setToken(loginData?.authToken);
    setDealer(loginData?.dealer);
    handleSocketConnect(loginData?.authToken);
    setSecretKey(loginData?.lssk);
    sessionManager?.connect();
    sessionManager?.register();
  };

  const logout = async (callApi = true) => {
    await sessionManager?.unregister();
    await sessionManager?.disconnect();
    if (callApi) await logoutApi();
    setToken(null);
    setDealer(null);
    localStorage.clear();
    handleSocketDisconnect();
    onClose();
  };

  const handleSocketConnect = (dealerAuthToken: string | null) => {
    socket.auth = {};
    socket.auth.token = `Bearer ${dealerAuthToken}`;
    socket.connect();
  };

  const handleSocketDisconnect = () => {
    socket.auth = {};
    socket.auth.token = `Bearer ${token}`;
    socket.disconnect();
  };

  // TODO: Add local storage support
  // useEffect(() => {
  //   async function getLocalStorageSecretKey() {
  //     const localStorageSecretKeyResponse = await localStorageApi();
  //     setSecretKey(localStorageSecretKeyResponse);
  //   }

  //   if (!token) getLocalStorageSecretKey();
  // }, [token, navigate]);

  const value = {
    isAuthenticated,
    login,
    logout,
    token,
    setToken,
    dealer,
    isWebSocketConnected,
    setIsWebSocketConnected,
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
