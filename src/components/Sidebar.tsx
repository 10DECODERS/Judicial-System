import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Settings,
  Files,
  Users,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const judgeMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/judge' },
  { icon: Mic, label: 'Transcripts', path: '/judge/transcripts' },
  { icon: BookOpen, label: 'Legal Research', path: '/judge/research' },
];

const clerkMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/clerk' },
  { icon: Mic, label: 'Transcription Control', path: '/clerk/transcription' },
];

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const { user } = useAuth();

  const menuItems =
    user?.role === 'judge' ? judgeMenuItems :
      user?.role === 'clerk' ? clerkMenuItems :
        [];

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground border-r border-border flex flex-col transition-all duration-300 relative z-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 bg-primary border-b border-primary-foreground/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <img src="/judicial-removebg-preview.png" alt="Logo" className="w-6 h-6 object-contain brightness-0 invert" />
          </div>
          <div className={cn("flex flex-col transition-opacity duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
            <span className="font-bold text-lg leading-none tracking-tight text-primary-foreground">Judicial</span>
            <span className="text-xs text-primary-foreground/70 font-medium">AI Suite</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">


        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                !isActive && "hover:text-primary",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-medium"
                  : "text-muted-foreground"
              )
            }
          >
            <item.icon className={cn("w-5 h-5 flex-shrink-0", isCollapsed && "mx-auto")} />

            {!isCollapsed && (
              <span>{item.label}</span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none border">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
