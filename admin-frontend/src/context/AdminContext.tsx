import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminPageView, AdminUser } from '../types/adminTypes';
import { AdminAuthService, AdminLoginCredentials } from '../services/adminAuthService';

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  activePage: AdminPageView;
  setActivePage: (page: AdminPageView) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isWorkspaceMaximized: boolean;
  toggleWorkspaceMaximized: () => void;
  toastMessage: string | null;
  toastType: 'info' | 'success' | 'warning' | 'error';
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  signInWithEmail: (creds: AdminLoginCredentials) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  selectedDrawerEntity: any;
  setSelectedDrawerEntity: (entity: any) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(AdminAuthService.isAuthenticated());
  const [adminUser, setAdminUser] = useState<AdminUser | null>(AdminAuthService.getCurrentAdmin());
  const [activePage, setActivePage] = useState<AdminPageView>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isWorkspaceMaximized, setIsWorkspaceMaximized] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [selectedDrawerEntity, setSelectedDrawerEntity] = useState<any>(null);

  // Sync hash routing if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('fleet')) setActivePage('fleet');
      else if (hash.includes('shipments')) setActivePage('shipments');
      else if (hash.includes('live') || hash.includes('ops')) setActivePage('live_ops');
      else if (hash.includes('matching')) setActivePage('matching');
      else if (hash.includes('finance')) setActivePage('finance');
      else if (hash.includes('support') || hash.includes('dispute')) setActivePage('support');
      else if (hash.includes('insights')) setActivePage('insights');
      else if (hash.includes('audit')) setActivePage('audit');
      else if (hash.includes('users') || hash.includes('kyc')) setActivePage('users');
      else if (hash.includes('settings')) setActivePage('settings');
      else if (hash.includes('overview')) setActivePage('overview');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const toggleWorkspaceMaximized = () => {
    setIsWorkspaceMaximized(prev => !prev);
  };

  const signInWithEmail = async (creds: AdminLoginCredentials) => {
    const user = await AdminAuthService.signInWithEmail(creds);
    setAdminUser(user);
    setIsAuthenticated(true);
    showToast(`Welcome, ${user.name}. Admin Console initialized.`, 'success');
  };

  const signInWithGoogle = async () => {
    const user = await AdminAuthService.signInWithGoogle();
    setAdminUser(user);
    setIsAuthenticated(true);
    showToast(`Google Authentication verified. Connected as ${user.name}.`, 'success');
  };

  const signOut = () => {
    AdminAuthService.signOut();
    setAdminUser(null);
    setIsAuthenticated(false);
    showToast('Admin session terminated.', 'info');
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        activePage,
        setActivePage: (p) => {
          setActivePage(p);
          setSelectedDrawerEntity(null);
          window.location.hash = `#/${p}`;
        },
        isSidebarCollapsed,
        toggleSidebar,
        isWorkspaceMaximized,
        toggleWorkspaceMaximized,
        toastMessage,
        toastType,
        showToast,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        selectedDrawerEntity,
        setSelectedDrawerEntity
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
