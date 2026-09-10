import React from 'react';
import { X, ChevronDown } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative glass-modal rounded-t-3xl border-t border-x border-white/10 z-10 max-h-[85vh] flex flex-col animate-slideUp">
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-600 rounded-full cursor-pointer" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div className="text-base font-semibold text-white">{title}</div>
            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
