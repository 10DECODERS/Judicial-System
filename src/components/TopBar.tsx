import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-20 border-b border-primary/20 bg-primary text-primary-foreground shadow-md sticky top-0 z-10 px-6 flex items-center justify-between gap-4">

      {/* Search Section */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
          <Input
            placeholder="Search cases, documents, or statutes..."
            className="pl-10 bg-primary-foreground/10 border-transparent text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20 focus:border-primary-foreground/30 focus:ring-0 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <Badge
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-red-500 text-white border-2 border-primary shadow-sm hover:bg-red-600"
          >
            3
          </Badge>
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 hover:bg-primary-foreground/10 rounded-full border border-transparent hover:border-primary-foreground/10 transition-all">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-semibold ring-2 ring-primary-foreground/20 shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-semibold leading-none text-primary-foreground">{user?.username}</span>
                <span className="text-xs text-primary-foreground/70 capitalize leading-none">{user?.role}</span>
              </div>
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
