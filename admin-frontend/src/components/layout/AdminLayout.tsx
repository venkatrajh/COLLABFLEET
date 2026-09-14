import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { AdminToast } from '../common/AdminToast';
import { X } from 'lucide-react';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  subtitle,
  children
}) => {
  const { isWorkspaceMaximized } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#F8F8F6] text-[#111111] flex overflow-hidden font-sans">
      
      {/* Desktop Persistent Black Sidebar */}
      <AdminSidebar />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-64 max-w-xs bg-[#0D0D0D] z-50 flex flex-col h-full shadow-2xl">
            <div className="p-4 flex justify-between items-center border-b border-neutral-800">
              <span className="text-white font-black text-sm tracking-wider">COLLABFLEET ADMIN</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setIsMobileMenuOpen(false)}>
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header Bar */}
        <AdminTopBar
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Scrollable Main Application Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>

      {/* Operational Toast Feedback */}
      <AdminToast />

    </div>
  );
};
