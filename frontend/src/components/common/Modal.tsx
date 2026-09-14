import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className={`relative w-full ${maxWidth} glass-modal rounded-3xl overflow-hidden border shadow-2xl z-10 my-auto transform transition-all animate-scaleUp`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
            <div className="text-base font-extrabold text-neutral-900 dark:text-white">{title}</div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
