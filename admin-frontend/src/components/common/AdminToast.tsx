import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const AdminToast: React.FC = () => {
  const { toastMessage, toastType } = useAdmin();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastType) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
      <div className="bg-[#111111] text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-3 text-xs font-semibold max-w-sm pointer-events-auto">
        {getIcon()}
        <span className="leading-snug">{toastMessage}</span>
      </div>
    </div>
  );
};
