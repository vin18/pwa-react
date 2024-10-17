import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SIPProvider } from 'react-sipjs';

import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login/Login';
import Call from '@/pages/Call';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import { socket } from '@/utils/socket';
import {
  VTS_SOCKET_CALL_CHANNEL,
  VTS_SOCKET_MESSAGE_CHANNEL,
} from './utils/constants';

// TODO:
// 1. Handle reload confirmation
// 2. Add user on click event

const SIP_URL = `172.18.2.72:8089`;

const sipProviderConfig = {
  domain: SIP_URL,
  webSocketServer: `wss://${SIP_URL}/asterisk/ws`,
};

async function getData() {
  const url = `https://${SIP_URL}/asterisk/ws`;
  try {
    const response = await fetch(url, {
      mode: 'no-cors',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return Promise.resolve(json);
  } catch (error) {
    console.error(error.message);
    return Promise.reject(error);
  }
}

function App() {
  useEffect(() => {
    getData()
      .then(() => console.log('SSL handshake completed'))
      .catch(() => console.log('Failed SSL handshake'));
  }, []);

  return (
    <div className="p-5">
      <AuthProvider>
        <SIPProvider
          options={{
            domain: sipProviderConfig.domain,
            webSocketServer: sipProviderConfig.webSocketServer,
          }}
        >
          <Router>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
          <Toaster richColors position="top-right" duration={50000} />
        </SIPProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
