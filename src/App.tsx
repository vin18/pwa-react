import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SIPProvider } from 'react-sipjs';

import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export const SIP_URL = `172.18.2.72:8089`;

const sipProviderConfig = {
  domain: SIP_URL,
  webSocketServer: `wss://${SIP_URL}/asterisk/ws`,
};

function App() {
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
          <Toaster richColors position="top-right" />
        </SIPProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
