import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { DashboardLayout } from '@/pages/DashboardLayout';
import Login from '@/pages/login/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SIPProvider } from './contexts/ProviderContext';

export const SIP_URL = import.meta.env.VITE_SIP_IP;
export const SIP_WS_PATH = import.meta.env.VITE_SIP_WS_PATH;

const sipProviderConfig = {
  domain: SIP_URL,
  webSocketServer: SIP_WS_PATH,
};

function App() {
  return (
    <Router>
      <div className="p-2 md:p-5">
        <AuthProvider>
          <SIPProvider
            options={{
              domain: sipProviderConfig.domain,
              webSocketServer: sipProviderConfig.webSocketServer,
            }}
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

            <Toaster richColors position="top-center" duration={2000} />
          </SIPProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
