import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-md sm:max-w-lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className={`w-screen ${width} bg-white shadow-2xl border-l border-[#E5E4DE] flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right`}>
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#EBEAE5] bg-[#FAF9F6] flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                  {subtitle}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-[#EFEFEA] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};
