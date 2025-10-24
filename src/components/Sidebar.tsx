import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  BookOpen,
  ChevronLeft,
  ChevronRight
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

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  const menuItems =
    user?.role === 'judge' ? judgeMenuItems :
    user?.role === 'clerk' ? clerkMenuItems :
    [];

  return (
    <aside
      className={cn(
        "h-screen bg-primary text-white border-r border-primary/20 transition-all duration-300 flex flex-col shadow-2xl relative overflow-hidden",
        isCollapsed ? "w-16" : "w-64",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none"
      )}
    >
      <div className="p-4 border-b border-white/10 flex justify-end relative z-10 backdrop-blur-sm bg-primary/95">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/15 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto relative z-10">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                "hover:bg-white/15 hover:shadow-lg hover:scale-[1.02]",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
                isActive && "bg-accent/90 text-white font-medium shadow-lg border border-accent/50",
                !isActive && "text-white/80 hover:text-white"
              )
            }
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative z-10 flex items-center justify-center w-5 h-5">
              <item.icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium relative z-10">{item.label}</span>
            )}
            {isCollapsed && (
              <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary/95 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-white/10 relative z-10 backdrop-blur-sm bg-primary/95">
          <div className="text-xs text-white/60 text-center font-medium">
to            © 2025 Judicial AI Suite
          </div>
        </div>
      )}
    </aside>
  );
};
