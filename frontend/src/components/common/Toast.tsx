import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 animate-bounce-short pointer-events-auto">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-glass backdrop-blur-xl ${
        toast.type === 'success' 
          ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100 shadow-emerald-950/50' 
          : toast.type === 'error'
          ? 'bg-rose-950/80 border-rose-500/30 text-rose-100 shadow-rose-950/50'
          : 'bg-dark-850/90 border-cyan-500/30 text-cyan-100 shadow-cyan-950/50'
      }`}>
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
        
        <span className="text-sm font-medium pr-2">{toast.message}</span>
      </div>
    </div>
  );
};
