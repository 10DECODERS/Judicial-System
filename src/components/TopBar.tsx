import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const TopBar = ({ toggleSidebar, isSidebarCollapsed }: TopBarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-20 border-b border-primary-foreground/10 bg-primary shadow-sm sticky top-0 z-10 px-6 flex items-center justify-between gap-4 transition-all duration-300">

      {/* Left: Sidebar Toggle */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Menu className="w-6 h-6" strokeWidth={3} />
        </Button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Search Icon */}
        <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full">
          <Search className="w-5 h-5" strokeWidth={3} />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full">
          <Bell className="w-5 h-5" strokeWidth={3} />
          <Badge
            className="absolute top-2 right-2 w-2 h-2 p-0 bg-red-500 rounded-full border-2 border-primary"
          />
        </Button>

        {/* Separator */}
        <div className="h-6 w-px bg-primary-foreground/20 mx-2" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 hover:bg-primary-foreground/10 rounded-full border border-transparent hover:border-primary-foreground/10 transition-all h-auto py-1.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-foreground/20 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100"
                    alt={user?.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-primary rounded-full" />
              </div>

              <div className="flex flex-col items-start gap-0.5 ml-1 hidden md:flex">
                <span className="text-sm font-semibold leading-none text-primary-foreground">{user?.username || 'Nasser Al Mazroi'}</span>
                <span className="text-xs text-primary-foreground/70 capitalize leading-none">{user?.role || 'Super Manager'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-primary-foreground/70 ml-1" strokeWidth={2.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
