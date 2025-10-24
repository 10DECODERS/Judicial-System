import { Search, Bell, User, LayoutDashboard, Mic, BookOpen } from 'lucide-react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const judgeMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/judge' },
  { icon: Mic, label: 'Transcripts', path: '/judge/transcripts' },
  { icon: BookOpen, label: 'Legal Research', path: '/judge/research' },
];

const clerkMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/clerk' },
  { icon: Mic, label: 'Transcription Control', path: '/clerk/transcription' },
];

export const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems =
    user?.role === 'judge' ? judgeMenuItems :
    user?.role === 'clerk' ? clerkMenuItems :
    [];

  const isActivePath = (path: string) => {
    if (path === '/judge' && location.pathname === '/judge') return true;
    if (path === '/clerk' && location.pathname === '/clerk') return true;
    return location.pathname.startsWith(path) && path !== `/${user?.role}`;
  };

  return (
    <header className="h-20 border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="./public/judicial-removebg-preview.png" alt="Judicial System Logo" className="w-12 h-12 object-contain" />
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-foreground">Judicial AI Suite</h1>
              <p className="text-xs text-muted-foreground">Court Management</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 h-10 px-4",
                    isActive && "bg-accent text-white hover:bg-accent/90"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Mobile Navigation Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {menuItems.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex items-center gap-3 cursor-pointer",
                      isActive && "bg-accent/10 text-accent"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        {/* Search */}
        <div className="flex items-center gap-6 flex-1">

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cases, documents, or statutes..."
              className="pl-10 bg-background border-border focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative hover:bg-muted">
            <Bell className="w-5 h-5" />
            <Badge
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-accent hover:bg-accent"
            >
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 hover:bg-muted">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">{user?.username}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
