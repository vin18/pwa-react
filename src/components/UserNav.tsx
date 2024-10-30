import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useSIPProvider } from './SipProvider';

export default function UserNav() {
  const [open, setOpen] = useState(false);
  const { dealer, logout } = useAuth();
  const { sessionManager } = useSIPProvider();

  const handleLogout = async () => {
    await logout();
    await sessionManager.unregister();
    await sessionManager.disconnect();
    toast.success(`Logged out successfully`);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              // src={`https://api.dicebear.com/6.x/initials/svg?seed=${dealer.dealername}`}
              alt={dealer.dealername}
              className="rounded-full"
            />
            <AvatarFallback className="border-2  bg-green-600 text-green-100">
              {dealer.dealername
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {dealer.dealername}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              Phone number: {dealer.phonenumber}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              Dealer ID: {dealer.dealerid}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
