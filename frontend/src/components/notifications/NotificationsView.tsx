import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppNotification, NotificationType } from '../../types';
import { NotificationService } from '../../services/notificationService';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  BellOff, 
  Sparkles, 
  PackageCheck, 
  Navigation, 
  RotateCcw, 
  Award, 
  Sliders, 
  UserCheck, 
  ArrowRight,
  X
} from 'lucide-react';

type FilterTab = 'all' | 'unread' | 'bookings' | 'tracking' | 'opportunities';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    removeNotification, 
    clearAllNotifications, 
    setActiveView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Count calculations
  const unreadCount = notifications.filter(n => !n.read).length;
  const bookingsCount = notifications.filter(n => n.type === 'BOOKING').length;
  const trackingCount = notifications.filter(n => n.type === 'TRACKING' || n.type === 'DELIVERY').length;
  const opportunitiesCount = notifications.filter(n => n.type === 'MATCH' || n.type === 'RETURN_TRIP').length;

  // Filtered notifications
  const filteredNotifications = notifications.filter(item => {
    switch (activeTab) {
      case 'unread':
        return !item.read;
      case 'bookings':
        return item.type === 'BOOKING';
      case 'tracking':
        return item.type === 'TRACKING' || item.type === 'DELIVERY';
      case 'opportunities':
        return item.type === 'MATCH' || item.type === 'RETURN_TRIP';
      case 'all':
      default:
        return true;
    }
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'MATCH':
        return <Sparkles className="w-4 h-4 text-blue-600" />;
      case 'BOOKING':
        return <PackageCheck className="w-4 h-4 text-emerald-600" />;
      case 'TRACKING':
        return <Navigation className="w-4 h-4 text-indigo-600" />;
      case 'RETURN_TRIP':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      case 'DELIVERY':
        return <Award className="w-4 h-4 text-emerald-700" />;
      case 'SYSTEM':
        return <Sliders className="w-4 h-4 text-neutral-700" />;
      case 'ACCOUNT':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-600" />;
    }
  };

  const handleItemClick = (item: AppNotification) => {
    markNotificationAsRead(item.id);
    if (item.relatedView) {
      setActiveView(item.relatedView);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-20 pointer-events-auto">
      
      {/* Unified Floating Island */}
      <div className="bg-white/95 backdrop-blur-md border border-[#DEDDD8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-130px)]">
        
        {/* Island Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EBEAE5] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-[#111111] tracking-tight">
                  Notifications
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#111111] text-white text-[11px] font-mono font-bold">
                  {notifications.length}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Live updates on shipments, capacity matches, and corridor opportunities
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#DEDDD8] hover:bg-[#F0EFEA] text-[#111111] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#DEDDD8] hover:border-red-300 hover:text-red-600 text-neutral-500 text-xs font-semibold transition-all flex items-center gap-1"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Connected Filter Tabs Strip */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#FAF9F6] border-b border-[#EBEAE5] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'bookings', label: 'Bookings', count: bookingsCount },
            { key: 'tracking', label: 'Tracking', count: trackingCount },
            { key: 'opportunities', label: 'Opportunities', count: opportunitiesCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as FilterTab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-white border border-[#DEDDD8] text-neutral-600 hover:text-black hover:border-black'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                activeTab === tab.key
                  ? 'bg-neutral-800 text-white'
                  : 'bg-[#F0EFEA] text-neutral-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Scrollable Connected Notifications List */}
        <div className="overflow-y-auto divide-y divide-[#EBEAE5] bg-white scrollbar-thin flex-1">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] flex items-center justify-center mx-auto text-neutral-400">
                <BellOff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#111111]">
                  You're all caught up
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  New shipment updates, return-trip matches, and delivery notifications will appear here.
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isUnread = !item.read;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`group p-4 sm:p-4.5 transition-all cursor-pointer flex items-start gap-3.5 ${
                    isUnread
                      ? 'bg-[#FAF9F5] hover:bg-[#F2F1EA]'
                      : 'bg-white hover:bg-[#FAF9F6]'
                  }`}
                >
                  {/* Type Icon */}
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#DEDDD8] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Notification Details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs sm:text-sm tracking-tight ${
                          isUnread ? 'font-black text-[#111111]' : 'font-semibold text-neutral-700'
                        }`}>
                          {item.title}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-black shrink-0" />
                        )}
                      </div>

                      <span className="text-[11px] text-neutral-400 font-medium shrink-0 font-mono">
                        {NotificationService.formatRelativeTime(item.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    {item.relatedView && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#111111] group-hover:underline">
                        <span>View details</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-200 transition-all shrink-0"
                    title="Dismiss"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
