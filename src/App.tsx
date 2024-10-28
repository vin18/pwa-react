import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SIPProvider } from 'react-sipjs';

import { DashboardLayout } from '@/pages/DashboardLayout';
import Login from '@/pages/login/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

export const SIP_URL = import.meta.env.VITE_SIP_IP;
export const SIP_WS_PATH = import.meta.env.VITE_SIP_WS_PATH;

const sipProviderConfig = {
  domain: SIP_URL,
  webSocketServer: SIP_WS_PATH,
};

function App() {
  const { dealer } = useAuth();
  const WEBRTC_PASSWORD = import.meta.env.VITE_WEBRTC_PASSWORD;

  const sipConfig = {
    uri: `sip:${dealer.phonenumber}@testsip.nirmalbang.com:5070`,
    wsServers: [SIP_WS_PATH], // Replace with your WebSocket server
    authorizationUser: dealer.phonenumber,
    password: WEBRTC_PASSWORD,
    traceSip: true, // Optional: Enable SIP trace logging
    sessionDescriptionHandlerFactoryOptions: {
      peerConnectionConfiguration: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }, // Public STUN server from Google
          // Additional STUN/TURN servers can be added here
          // { urls: "turn:turnserver.example.com", username: "user", credential: "password" }
        ],
      },
    },
  };

  return (
    <Router>
      <div className="p-5">
        <AuthProvider>
          <SIPProvider
            // options={{
            //   domain: sipProviderConfig.domain,
            //   webSocketServer: sipProviderConfig.webSocketServer,
            // }}
            {...sipConfig}
          >
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardLayout />} />
              </Route>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
            </Routes>

            <Toaster richColors position="top-right" />
          </SIPProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
