import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppNotification, NotificationType } from '../../types';
import { NotificationService } from '../../services/notificationService';
import { 
  CheckCheck, 
  X, 
  BellOff, 
  Sparkles, 
  PackageCheck, 
  Navigation, 
  RotateCcw, 
  Award, 
  Sliders, 
  UserCheck, 
  ArrowRight 
} from 'lucide-react';

interface NotificationPopoverProps {
  onClose: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ onClose }) => {
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    removeNotification, 
    setActiveView 
  } = useApp();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'MATCH':
        return <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'BOOKING':
        return <PackageCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'TRACKING':
        return <Navigation className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'RETURN_TRIP':
        return <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'DELIVERY':
        return <Award className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />;
      case 'SYSTEM':
        return <Sliders className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />;
      case 'ACCOUNT':
        return <UserCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  const handleNotificationClick = (item: AppNotification) => {
    markNotificationAsRead(item.id);
    if (item.relatedView) {
      setActiveView(item.relatedView);
      onClose();
    }
  };

  const handleViewAll = () => {
    setActiveView('notifications');
    onClose();
  };

  return (
    <div 
      className="absolute right-0 top-12 w-[calc(100vw-24px)] max-w-sm sm:w-96 bg-white dark:bg-neutral-900 border border-[#DEDDD8] dark:border-neutral-800 rounded-2xl shadow-2xl z-[120] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 pointer-events-auto"
      onClick={e => e.stopPropagation()}
    >
      {/* Popover Header */}
      <div className="p-3.5 px-4 border-b border-[#EBEAE5] dark:border-neutral-800 flex items-center justify-between bg-[#FAF9F6] dark:bg-neutral-900/90">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-black text-[#111111] dark:text-white tracking-tight">
            Notifications
          </h2>
          {unreadNotificationsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold">
              {unreadNotificationsCount} unread
            </span>
          )}
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-[#F0EFEA] dark:divide-neutral-800/80">
        {notifications.length === 0 ? (
          <div className="py-12 px-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#F0EFEA] dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
              <BellOff className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-[#111111] dark:text-white">
              You're all caught up.
            </h3>
            <p className="text-[11px] text-neutral-500 max-w-[220px] mx-auto leading-relaxed">
              New shipment updates, matches and opportunities will appear here.
            </p>
          </div>
        ) : (
          notifications.map((item) => {
            const isUnread = !item.read;

            return (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`group relative p-3.5 sm:p-4 transition-all cursor-pointer flex items-start gap-3 ${
                  isUnread
                    ? 'bg-[#F9F8F5] dark:bg-neutral-800/60 hover:bg-[#F2F1EC] dark:hover:bg-neutral-800'
                    : 'bg-white dark:bg-neutral-900 hover:bg-[#FAF9F6] dark:hover:bg-neutral-800/40'
                }`}
              >
                {/* Type Icon Badge */}
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 border border-[#E5E4DE] dark:border-neutral-700 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-1.5">
                    <h4 className={`text-xs tracking-tight truncate ${
                      isUnread 
                        ? 'font-black text-[#111111] dark:text-white' 
                        : 'font-semibold text-neutral-800 dark:text-neutral-300'
                    }`}>
                      {item.title}
                    </h4>
                    {isUnread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-snug line-clamp-2">
                    {item.message}
                  </p>

                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 block font-medium">
                    {NotificationService.formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all absolute right-2.5 top-3"
                  title="Dismiss"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Popover Footer */}
      <div className="p-2.5 px-4 bg-[#FAF9F6] dark:bg-neutral-900 border-t border-[#EBEAE5] dark:border-neutral-800 text-center">
        <button
          onClick={handleViewAll}
          className="w-full py-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
        >
          <span>View all notifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
