import { Outlet } from 'react-router-dom';

import SideMenu from '@/components/SideMenu';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { socket } from '@/utils/socket';
import { useAuth } from '@/contexts/AuthContext';
import usePageRefresh from '@/hooks/usePageRefresh';

function AppLayout() {
  const { isAuthenticated, logout } = useAuth();
  // TODO: Uncomment after testing
  // usePageRefresh();

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => console.log('Socket connected on client'));
      socket.on('disconnect', async () => {
        console.log('Socket disconnected on client');
        if (isAuthenticated) {
          await logout(false);
        }
      });
    }
  }, [isAuthenticated]);

  return (
    <div>
      <div className="flex gap-6">
        <SideMenu />
        <div className="p-4 lg:py-8 lg:px-16 flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
