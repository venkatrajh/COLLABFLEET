import React from 'react';

interface FloatingIslandProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  header?: React.ReactNode;
  maxHeight?: string;
  scrollable?: boolean;
}

/**
 * FloatingIsland — Core visual building block for COLLABFLEET.
 * Provides a unified, continuous floating surface over the Leaflet map and background.
 */
export const FloatingIsland: React.FC<FloatingIslandProps> = ({
  children,
  className = '',
  containerClassName = 'w-full max-w-xl xl:max-w-2xl pointer-events-auto self-start',
  header,
  maxHeight = 'max-h-[calc(100vh-125px)] sm:max-h-[calc(100vh-135px)]',
  scrollable = false
}) => {
  return (
    <div className={`${containerClassName} transition-all duration-300`}>
      <div 
        className={`bg-white/95 backdrop-blur-md border border-[#DEDDD8] rounded-3xl shadow-2xl overflow-hidden flex flex-col ${maxHeight} ${className}`}
      >
        {header && (
          <div className="shrink-0 border-b border-[#EBEAE5] bg-white">
            {header}
          </div>
        )}

        <div className={`flex-1 ${scrollable ? 'overflow-y-auto scrollbar-thin' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
