import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Maximize2, 
  Minimize2, 
  Menu, 
  ShieldCheck, 
  Activity,
  Bell
} from 'lucide-react';

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  title,
  subtitle,
  onOpenMobileMenu
}) => {
  const { 
    adminUser, 
    isWorkspaceMaximized, 
    toggleWorkspaceMaximized,
    showToast
  } = useAdmin();

  return (
    <header className="h-16 border-b border-[#E5E4DE] bg-white px-4 sm:px-8 flex items-center justify-between shrink-0 select-none">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-[#111111]">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EBEAE5] text-[10px] font-mono font-bold text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Grid
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-500 font-medium hidden md:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Workspace Maximize/Restore button */}
        <button
          onClick={toggleWorkspaceMaximized}
          className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            isWorkspaceMaximized
              ? 'bg-black text-white border-black shadow-md'
              : 'bg-[#FAF9F6] border-[#E5E4DE] text-neutral-700 hover:text-black hover:border-black'
          }`}
          title={isWorkspaceMaximized ? 'Restore normal workspace' : 'Maximize operational workspace'}
        >
          {isWorkspaceMaximized ? (
            <>
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Restore</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Maximize</span>
            </>
          )}
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => showToast('Operational alerts stream is currently active and healthy', 'info')}
          className="p-2 rounded-xl border border-[#E5E4DE] bg-[#FAF9F6] text-neutral-700 hover:text-black hover:border-black transition-colors relative"
          title="Operations alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
        </button>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#EBEAE5]">
          <div className="w-8 h-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {adminUser?.name ? adminUser.name.charAt(0) : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#111111] leading-tight">
              {adminUser?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>SUPER ADMIN</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
