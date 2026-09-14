import React from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, Loader2 } from 'lucide-react';

export const AILoadingModal: React.FC = () => {
  const { isAiLoading, aiLoadingMessage } = useApp();

  if (!isAiLoading) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xs glass-modal rounded-3xl p-6 text-center border shadow-2xl space-y-4 animate-scaleUp">
        
        {/* Minimalist Spinner Badge */}
        <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-neutral-400 dark:text-neutral-500 animate-spin stroke-[1.5]" />
          <Truck className="w-5 h-5 text-black dark:text-white absolute" />
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
            Matching Available Trucks
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1 min-h-[18px]">
            {aiLoadingMessage}
          </p>
        </div>

      </div>
    </div>
  );
};
