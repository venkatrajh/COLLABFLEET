import React, { useState } from 'react';

interface LiquidGlassNavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  badge?: string | number;
}

export const LiquidGlassNavItem: React.FC<LiquidGlassNavItemProps> = ({
  icon,
  label,
  isActive,
  isCollapsed,
  onClick,
  badge
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group flex items-center">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-300 relative select-none ${
          isCollapsed ? 'justify-center px-2' : 'justify-between'
        } ${
          isActive
            ? 'bg-white/[0.14] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.28)] border border-white/20 backdrop-blur-md font-bold'
            : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.05] border border-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'group-hover:scale-105'}`}>
            {icon}
          </span>
          {!isCollapsed && <span className="truncate">{label}</span>}
        </div>

        {!isCollapsed && badge !== undefined && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            isActive ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300'
          }`}>
            {badge}
          </span>
        )}
      </button>

      {/* Floating Hover Tooltip for Collapsed Sidebar */}
      {isCollapsed && isHovered && (
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#111111] text-white text-xs font-bold rounded-xl border border-neutral-700 shadow-xl whitespace-nowrap z-50 pointer-events-none animate-in fade-in duration-150">
          {label}
        </div>
      )}
    </div>
  );
};
