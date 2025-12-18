import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Settings,
  Files,
  Users,
  Search,
  History,
  UserCheck,
  Headphones
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  subItems?: { label: string; path: string }[];
}

const judgeMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/judge' },
  { icon: Mic, label: 'Transcripts', path: '/judge/transcripts' },
  { icon: BookOpen, label: 'Legal Research', path: '/judge/research' },
];

const clerkMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/clerk' },
  { icon: Mic, label: 'Transcription Control', path: '/clerk/transcription' },
  {
    icon: Users,
    label: 'User Management',
    path: '/clerk/users',
    subItems: [
      { label: 'Users List', path: '/clerk/users' },
      { label: 'Users Role', path: '/clerk/roles' }
    ]
  },
  { icon: History, label: 'Audit Log', path: '/clerk/audit-log' },
];

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['User Management']);

  const menuItems =
    user?.role === 'judge' ? judgeMenuItems :
      user?.role === 'clerk' ? clerkMenuItems :
        [];

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground border-r border-border flex flex-col transition-all duration-300 relative z-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="h-[72px] flex items-center px-6 bg-primary border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <img src="/judicial-removebg-preview.png" alt="Logo" className="w-6 h-6 object-contain brightness-0 invert" />
          </div>
          <div className={cn("flex flex-col transition-opacity duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
            <span className="font-bold text-xl leading-none tracking-tight text-white">Judicial</span>
            <span className="text-[10px] text-white/80 font-medium tracking-wide">Systems</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isExpanded = expandedItems.includes(item.label);
          const hasSubItems = item.subItems && item.subItems.length > 0;

          // Dashboard should only be active on exact match, others on prefix match
          const isActive = item.label === 'Dashboard'
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <div key={item.label} className="space-y-1">
              <div
                onClick={() => hasSubItems && toggleExpand(item.label)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative",
                  isActive && !hasSubItems ? "bg-primary text-primary-foreground shadow-md font-medium" :
                    (hasSubItems && isExpanded) ? "bg-slate-100 text-primary font-bold" : "text-muted-foreground hover:text-primary"
                )}
              >
                {!hasSubItems ? (
                  <NavLink
                    to={item.path}
                    className="flex items-center gap-3 w-full"
                  >
                    <item.icon className={cn("w-5 h-5 flex-shrink-0")} />
                    {!isCollapsed && (
                      <span>{item.label}</span>
                    )}
                  </NavLink>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("w-5 h-5 flex-shrink-0")} />
                      {!isCollapsed && (
                        <span>{item.label}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      isExpanded ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none border">
                    {item.label}
                  </div>
                )}
              </div>

              {/* Sub Items */}
              {hasSubItems && isExpanded && !isCollapsed && (
                <div className="space-y-1 mt-1">
                  {item.subItems?.map((subItem) => {
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        className={cn(
                          "flex items-center h-10 pl-11 pr-3 rounded-lg text-sm transition-all duration-200",
                          isSubActive
                            ? "bg-primary text-white font-bold shadow-md"
                            : "text-slate-500 hover:text-primary hover:bg-slate-50 font-medium"
                        )}
                      >
                        {subItem.label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / Support & Settings */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="space-y-1">
          <NavLink
            to="/support"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-white hover:shadow-sm transition-all duration-200 group font-medium"
            )}
          >
            <Headphones className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Support</span>}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none border">
                Support
              </div>
            )}
          </NavLink>
          <NavLink
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-white hover:shadow-sm transition-all duration-200 group font-medium"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Setting</span>}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none border">
                Setting
              </div>
            )}
          </NavLink>
        </div>
      </div>
    </aside >
  );
};
