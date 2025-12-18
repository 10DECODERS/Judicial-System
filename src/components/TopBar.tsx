import { Search, Bell, ChevronDown, Menu, Calendar, Globe } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Clock } from 'lucide-react';

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const mockNotifications = [
  { id: 1, title: 'Case Update', desc: 'New evidence added to Case #2024-CR-089', time: '2m ago', unread: true },
  { id: 2, title: 'Hearing Reschedule', desc: 'Case #2024-CV-102 moved to 2:00 PM', time: '1h ago', unread: true },
  { id: 3, title: 'Document Signed', desc: 'Clerk processed summary judgment', time: '3h ago', unread: false },
  { id: 4, title: 'System Alert', desc: 'Scheduled maintenance tonight', time: '5h ago', unread: false },
];

const mockSchedule = [
  { id: 1, title: 'Initial Hearing', case: 'State v. Johnson', time: '09:30 AM', type: 'Criminal', room: '3A' },
  { id: 2, title: 'Motion Hearing', case: 'Smith v. Jones', time: '11:00 AM', type: 'Civil', room: '4B' },
  { id: 3, title: 'Sentencing', case: 'State v. Williams', time: '02:00 PM', type: 'Criminal', room: '3A' },
];

export const TopBar = ({ toggleSidebar, isSidebarCollapsed }: TopBarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-[72px] box-border py-4 border-b border-white/10 bg-primary shadow-md shadow-slate-200/50 sticky top-0 z-10 px-6 flex items-center justify-between gap-4 transition-all duration-300">

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
      <div className="flex items-center gap-4">
        {/* Search Icon */}
        <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full w-10 h-10">
          <Search className="w-6 h-6" strokeWidth={2.5} />
        </Button>

        {/* Schedule/Calendar */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full w-10 h-10">
              <Calendar className="w-6 h-6" strokeWidth={2.5} />
              <Badge
                className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-red-500 text-white rounded-full border-2 border-primary font-bold"
              >
                {mockSchedule.length}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 shadow-xl border-slate-100" align="end">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h4 className="font-semibold text-sm text-slate-900">Daily Schedule</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <ScrollArea className="h-[280px]">
              <div className="p-2 space-y-1">
                {mockSchedule.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{item.time}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider group-hover:text-primary transition-colors">{item.room}</span>
                    </div>
                    <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.case}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-2 border-t border-slate-100 bg-slate-50/30">
              <Button variant="ghost" size="sm" className="w-full text-xs text-primary h-8 hover:bg-primary/5 hover:text-primary">
                View All Events
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full w-10 h-10">
              <Bell className="w-6 h-6" strokeWidth={2.5} />
              <Badge
                className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-red-500 text-white rounded-full border-2 border-primary font-bold"
              >
                64
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 shadow-xl border-slate-100" align="end">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Notifications</h4>
                <p className="text-xs text-slate-500 mt-0.5">You have 4 unread alerts</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-primary">
                <Check className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-[320px]">
              <div className="divide-y divide-slate-50">
                {mockNotifications.map((note) => (
                  <div key={note.id} className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${note.unread ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <p className={`text-sm ${note.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {note.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{note.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{note.desc}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-2 border-t border-slate-100 bg-slate-50/30">
              <Button variant="ghost" size="sm" className="w-full text-xs text-primary h-8 hover:bg-primary/5 hover:text-primary">
                View All Notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Language/Globe */}
        <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full w-10 h-10">
          <Globe className="w-6 h-6" strokeWidth={2.5} />
        </Button>



        {/* Separator */}
        <div className="h-6 w-px bg-primary-foreground/20 mx-1" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 hover:bg-primary-foreground/10 rounded-full border border-transparent hover:border-primary-foreground/10 transition-all h-auto py-0.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-foreground/20 shadow-sm">
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
