import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell } from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';

export const NotificationBell: React.FC = () => {
  const { 
    unreadNotificationsCount, 
    isNotificationsOpen, 
    setIsNotificationsOpen,
    toggleNotificationsOpen, 
    hasNewNotification 
  } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen, setIsNotificationsOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isNotificationsOpen) {
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotificationsOpen, setIsNotificationsOpen]);

  return (
    <div ref={containerRef} className="relative z-[110]">
      <button
        onClick={toggleNotificationsOpen}
        className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
          isNotificationsOpen
            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md'
            : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white'
        }`}
        title="Notifications"
        aria-label="Open notifications"
      >
        <Bell className="w-4 h-4" />

        {/* Unread Badge */}
        {unreadNotificationsCount > 0 && (
          <span 
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-black flex items-center justify-center border border-white dark:border-black shadow-sm ${
              hasNewNotification ? 'animate-pulse scale-110' : ''
            } transition-transform`}
          >
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isNotificationsOpen && (
        <NotificationPopover onClose={() => setIsNotificationsOpen(false)} />
      )}
    </div>
  );
};
