import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { SIPProvider } from 'react-sipjs';

import Dashboard from '@/pages/dashboard';
import Call from '@/pages/Call';
import CallUI from '@/pages/CallUI';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';

// TODO:
// 1. Handle reload confirmation
// 2. Add user on click event

function App() {
  return (
    <div className="p-5">
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
            <Route path="/call-ui" element={<CallUI />} />
            <Route path="/call" element={<Call />} />
          </Route>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
      <Toaster richColors position="top-center" duration={100000} />
    </div>
  );
}

export default App;
