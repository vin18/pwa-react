import { Outlet } from 'react-router-dom';

import SideMenu from '@/components/SideMenu';
import Footer from '@/components/Footer';

function AppLayout() {
  return (
    <div>
      <div className="flex gap-6">
        <SideMenu />
        <div className="p-4 lg:py-8 lg:px-16 flex-1">
          <Outlet />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default AppLayout;
