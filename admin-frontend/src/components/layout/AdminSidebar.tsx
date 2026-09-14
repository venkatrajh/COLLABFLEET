import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { LiquidGlassNavItem } from '../common/LiquidGlassNavItem';
import { USER_APP_URL } from '../../services/adminApiConfig';
import { AdminMetricsService } from '../../services/adminMetrics';
import logoMark from '../../assets/branding/collabfleet-logo-mark.png';
import { 
  LayoutDashboard, 
  Truck, 
  Package, 
  Navigation2, 
  GitMerge, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  IndianRupee,
  LifeBuoy,
  FileText
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    isSidebarCollapsed, 
    toggleSidebar, 
    signOut,
    isWorkspaceMaximized
  } = useAdmin();

  if (isWorkspaceMaximized) {
    return null;
  }

  const handleReturnToPublicApp = () => {
    window.location.href = USER_APP_URL;
  };

  return (
    <aside 
      className={`h-screen bg-[#0D0D0D] text-white flex flex-col justify-between border-r border-neutral-800 transition-all duration-300 z-30 shrink-0 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Section */}
      <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex items-center justify-between">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <img 
              src={logoMark} 
              alt="COLLABFLEET Logo" 
              className="w-8 h-8 object-contain shrink-0 brightness-0 invert" 
            />
            <div>
              <div className="text-sm font-black tracking-wider text-white">
                COLLABFLEET
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-bold">
                ADMIN CONSOLE
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <img 
              src={logoMark} 
              alt="COLLABFLEET Logo" 
              className="w-9 h-9 object-contain brightness-0 invert" 
            />
          </div>
        )}

        {/* Collapse Button */}
        {!isSidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        
        {/* Collapse button when in collapsed mode */}
        {isSidebarCollapsed && (
          <div className="flex justify-center pb-2">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* COMMAND */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 pb-1">
              COMMAND
            </div>
          )}
          {/* 1. Overview */}
          <LiquidGlassNavItem
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Overview"
            isActive={activePage === 'overview'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('overview')}
          />
        </div>

        {/* OPERATIONS & LOGISTICS */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 pb-1">
              OPERATIONS & LOGISTICS
            </div>
          )}
          {/* 2. Live Operations */}
          <LiquidGlassNavItem
            icon={<Navigation2 className="w-4 h-4" />}
            label="Live Operations"
            isActive={activePage === 'live_ops'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('live_ops')}
          />
          {/* 3. Fleet */}
          <LiquidGlassNavItem
            icon={<Truck className="w-4 h-4" />}
            label="Fleet"
            isActive={activePage === 'fleet'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('fleet')}
          />
          {/* 4. Users & KYC */}
          <LiquidGlassNavItem
            icon={<Users className="w-4 h-4" />}
            label="Users & KYC"
            isActive={activePage === 'users'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('users')}
            badge={AdminMetricsService.OPERATIONAL_ALERTS.pendingKyc > 0 ? AdminMetricsService.OPERATIONAL_ALERTS.pendingKyc.toString() : undefined}
          />
          {/* 5. Shipments */}
          <LiquidGlassNavItem
            icon={<Package className="w-4 h-4" />}
            label="Shipments"
            isActive={activePage === 'shipments'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('shipments')}
          />
          {/* 8. Support / Disputes */}
          <LiquidGlassNavItem
            icon={<LifeBuoy className="w-4 h-4" />}
            label="Support & Disputes"
            isActive={activePage === 'support'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('support')}
            badge={AdminMetricsService.OPERATIONAL_ALERTS.openDisputes > 0 ? AdminMetricsService.OPERATIONAL_ALERTS.openDisputes.toString() : undefined}
          />
        </div>

        {/* MARKETPLACE & INTELLIGENCE */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 pb-1">
              MARKETPLACE & INTELLIGENCE
            </div>
          )}
          {/* 6. Matching Monitor */}
          <LiquidGlassNavItem
            icon={<GitMerge className="w-4 h-4" />}
            label="Matching Monitor"
            isActive={activePage === 'matching'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('matching')}
          />
          {/* 7. Finance */}
          <LiquidGlassNavItem
            icon={<IndianRupee className="w-4 h-4" />}
            label="Finance"
            isActive={activePage === 'finance'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('finance')}
          />
          {/* 9. Insights */}
          <LiquidGlassNavItem
            icon={<BarChart3 className="w-4 h-4" />}
            label="Insights"
            isActive={activePage === 'insights'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('insights')}
          />
        </div>

        {/* GOVERNANCE */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 pb-1">
              GOVERNANCE
            </div>
          )}
          {/* 10. Audit Log */}
          <LiquidGlassNavItem
            icon={<FileText className="w-4 h-4" />}
            label="Audit Log"
            isActive={activePage === 'audit'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('audit')}
          />
          {/* 11. Settings */}
          <LiquidGlassNavItem
            icon={<Settings className="w-4 h-4" />}
            label="Settings"
            isActive={activePage === 'settings'}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActivePage('settings')}
          />
        </div>

      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-neutral-800/80 space-y-1.5">
        <button
          onClick={handleReturnToPublicApp}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ${
            isSidebarCollapsed ? 'justify-center px-2' : ''
          }`}
          title="Open User Platform (localhost:5173)"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Public App (5173)</span>}
        </button>

        <button
          onClick={signOut}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ${
            isSidebarCollapsed ? 'justify-center px-2' : ''
          }`}
          title="Sign out of admin"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
