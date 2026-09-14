import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[300] animate-bounce-short pointer-events-auto">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black border border-neutral-800 dark:border-neutral-200 shadow-2xl">
        {toast.type === 'success' && <Check className="w-4 h-4 shrink-0 stroke-[2.5]" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 dark:text-rose-600" />}
        {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
        
        <span className="text-xs font-bold pr-1">{toast.message}</span>
      </div>
    </div>
  );
};
