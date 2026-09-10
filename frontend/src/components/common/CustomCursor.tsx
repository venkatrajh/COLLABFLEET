import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeafletOrInput, setIsLeafletOrInput] = useState(false);

  useEffect(() => {
    // Only enable on precise pointing devices (desktops/laptops, not touchscreens)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check target element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Do NOT interfere with Leaflet map interactions or text inputs
      const insideLeaflet = !!target.closest('.leaflet-container');
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;

      if (insideLeaflet || isInput) {
        setIsLeafletOrInput(true);
        setIsHovering(false);
        return;
      } else {
        setIsLeafletOrInput(false);
      }

      // Check if hovering an interactive element
      const isInteractive = !!target.closest('button, a, [role="button"], label, .cursor-pointer');
      setIsHovering(isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible || isLeafletOrInput) {
    return null;
  }

  return (
    <div 
      className="pointer-events-none fixed top-0 left-0 z-[99999] transition-transform duration-75 ease-out will-change-transform"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }}
      aria-hidden="true"
    >
      {/* Inner Dot */}
      <div 
        className={`w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
          isHovering 
            ? 'scale-150 bg-black dark:bg-white ring-4 ring-black/10 dark:ring-white/20' 
            : 'bg-black dark:bg-white'
        }`}
      />
    </div>
  );
};
