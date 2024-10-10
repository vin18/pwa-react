import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SIPProvider } from 'react-sipjs';

import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login/Login';
import Call from '@/pages/Call';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { AuthProvider } from './contexts/AuthContext';

// TODO:
// 1. Handle reload confirmation
// 2. Add user on click event

const sipProviderConfig = {
  domain: '172.18.1.194:8089',
  webSocketServer: 'wss://172.18.1.194:8089/asterisk/ws',
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
                {/* <Route path="/call-ui" element={<CallUI />} /> */}
                {/* <Route path="/call" element={<Call />} /> */}
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
