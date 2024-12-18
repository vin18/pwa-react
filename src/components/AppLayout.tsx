import { Outlet } from 'react-router-dom';

import SideMenu from '@/components/SideMenu';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { socket } from '@/utils/socket';
import { useAuth } from '@/contexts/AuthContext';
import usePageRefresh from '@/hooks/usePageRefresh';
import logo from '/public/nb-logo.svg';
import { useSIPProvider } from './SipProvider';

function AppLayout() {
  const { isAuthenticated, logout, setIsWebSocketConnected } = useAuth();
  const { sessionManager } = useSIPProvider();
  usePageRefresh();

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        setIsWebSocketConnected(true);
        console.log('Socket connected on client');
      });
      socket.on('disconnect', async () => {
        console.log('Socket disconnected on client');
        setIsWebSocketConnected(false);
        if (isAuthenticated) {
          await logout(false);
          await sessionManager.unregister();
          await sessionManager.disconnect();
        }
      });
    }
  }, [isAuthenticated]);

  return (
    <div>
      <div className="flex gap-6">
        {/* <SideMenu /> */}
        <div className="md:p-4 lg:py-8 lg:px-16 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
