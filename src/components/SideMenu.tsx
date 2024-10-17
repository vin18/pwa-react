import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGridIcon, LogOutIcon, Menu } from 'lucide-react';
import { toast } from 'sonner';

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function SideMenu() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    toast.success(`Logged out successfully`);
  };

  return (
    <div className="fixed group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <div className="flex items-center justify-between px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full group-data-[collapsed=true]:rotate-180 transition-transform"
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 bg-background p-4 shadow-lg flex flex-col justify-between"
          >
            <nav className="grid gap-2 mt-6">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-primary ' +
                  (isActive ? 'active-link' : '')
                }
                onClick={handleClose}
              >
                <LayoutGridIcon className="w-5 h-5" />
                Dashboard
              </NavLink>

              <div
                className="flex items-center space-x-4 ml-3 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </nav>
            <Footer isSideMenuFooter />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
