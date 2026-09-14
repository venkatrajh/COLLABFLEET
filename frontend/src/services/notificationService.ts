import { AppNotification, NotificationPreferences, NotificationType, UserRole } from '../types';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  shipmentUpdates: true,
  newTruckMatches: true,
  bookingUpdates: true,
  deliveryUpdates: true,
  returnTripOpportunities: true,
  fleetOpportunities: true
};

export class NotificationService {
  private static getStorageKey(userEmail: string): string {
    const safe = (userEmail || 'demo_user').toLowerCase().replace(/[^a-z0-9_]/g, '_');
    return `collabfleet_notifications_${safe}`;
  }

  private static getPrefsKey(userEmail: string): string {
    const safe = (userEmail || 'demo_user').toLowerCase().replace(/[^a-z0-9_]/g, '_');
    return `collabfleet_notif_prefs_${safe}`;
  }

  /**
   * Helper to generate realistic seed notifications for first-time login
   */
  private static getInitialSeed(role: UserRole): AppNotification[] {
    const now = Date.now();
    const min = 60 * 1000;
    const hour = 60 * min;

    if (role === 'fleet_operator') {
      return [
        {
          id: 'notif-fo-1',
          type: 'RETURN_TRIP',
          title: 'Return Trip Opportunity',
          message: 'A return-trip match could save ₹1,850 on your Bengaluru → Chennai corridor.',
          timestamp: new Date(now - 4 * min).toISOString(),
          read: false,
          role: 'fleet_operator',
          relatedId: 'freight-chennai-bengaluru-1',
          relatedView: 'find_freight'
        },
        {
          id: 'notif-fo-2',
          type: 'BOOKING',
          title: 'Freight Confirmed',
          message: 'Load booked on your Ashok Leyland 1618 for Bengaluru → Coimbatore.',
          timestamp: new Date(now - 14 * min).toISOString(),
          read: false,
          role: 'fleet_operator',
          relatedId: 'CF-48291',
          relatedView: 'my_shipments'
        },
        {
          id: 'notif-fo-3',
          type: 'SYSTEM',
          title: 'Truck Availability Live',
          message: 'Eicher Pro 3019 is marked Available and actively receiving match queries.',
          timestamp: new Date(now - 35 * min).toISOString(),
          read: true,
          role: 'fleet_operator',
          relatedId: 'truck-eicher-3019',
          relatedView: 'my_trucks'
        },
        {
          id: 'notif-fo-4',
          type: 'MATCH',
          title: 'Corridor Demand Alert',
          message: 'High demand detected: 3 shippers are searching for capacity on NH48 today.',
          timestamp: new Date(now - 2 * hour).toISOString(),
          read: true,
          role: 'fleet_operator',
          relatedView: 'find_freight'
        },
        {
          id: 'notif-fo-5',
          type: 'ACCOUNT',
          title: 'Fleet Rating Updated',
          message: 'Shipper gave 5.0 stars for your completed run on NH544. Great job!',
          timestamp: new Date(now - 5 * hour).toISOString(),
          read: true,
          role: 'fleet_operator',
          relatedView: 'profile'
        }
      ];
    }

    // Default: Shipper
    return [
      {
        id: 'notif-sh-1',
        type: 'MATCH',
        title: 'Truck Match Found',
        message: 'A highly compatible 14T truck is available for your Chennai → Bengaluru shipment.',
        timestamp: new Date(now - 2 * min).toISOString(),
        read: false,
        role: 'shipper',
        relatedView: 'find_truck'
      },
      {
        id: 'notif-sh-2',
        type: 'BOOKING',
        title: 'Booking Confirmed',
        message: 'Your shipment CF-48291 has been successfully booked with Rajesh Transport.',
        timestamp: new Date(now - 8 * min).toISOString(),
        read: false,
        role: 'shipper',
        relatedId: 'CF-48291',
        relatedView: 'my_shipments'
      },
      {
        id: 'notif-sh-3',
        type: 'TRACKING',
        title: 'Shipment Update',
        message: 'Your truck has picked up the shipment and is now in transit on NH48.',
        timestamp: new Date(now - 18 * min).toISOString(),
        read: false,
        role: 'shipper',
        relatedId: 'CF-48291',
        relatedView: 'track_shipment'
      },
      {
        id: 'notif-sh-4',
        type: 'RETURN_TRIP',
        title: 'Return Trip Opportunity',
        message: 'A return-trip match could save ₹1,850 on this corridor.',
        timestamp: new Date(now - 32 * min).toISOString(),
        read: true,
        role: 'shipper',
        relatedView: 'find_truck'
      },
      {
        id: 'notif-sh-5',
        type: 'DELIVERY',
        title: 'Delivery Completed',
        message: 'Your shipment has been delivered to Sriperumbudur Hub. Rate your experience.',
        timestamp: new Date(now - 1 * hour).toISOString(),
        read: true,
        role: 'shipper',
        relatedId: 'CF-10928',
        relatedView: 'my_shipments'
      },
      {
        id: 'notif-sh-6',
        type: 'SYSTEM',
        title: 'Corridor Optimization',
        message: 'COLLABFLEET backhaul network saved 240 empty km across South India corridors.',
        timestamp: new Date(now - 4 * hour).toISOString(),
        read: true,
        role: 'shipper',
        relatedView: 'smart_insights'
      }
    ];
  }

  /**
   * Get user notification preferences
   */
  public static getPreferences(userEmail: string): NotificationPreferences {
    try {
      const raw = localStorage.getItem(this.getPrefsKey(userEmail));
      if (raw) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.error('[NotificationService] Error reading preferences', e);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  /**
   * Update and persist notification preferences
   */
  public static updatePreferences(userEmail: string, prefs: Partial<NotificationPreferences>): NotificationPreferences {
    const current = this.getPreferences(userEmail);
    const updated = { ...current, ...prefs };
    try {
      localStorage.setItem(this.getPrefsKey(userEmail), JSON.stringify(updated));
    } catch (e) {
      console.error('[NotificationService] Error saving preferences', e);
    }
    return updated;
  }

  /**
   * Check if a notification type is permitted by user preferences
   */
  public static isTypeAllowed(userEmail: string, type: NotificationType): boolean {
    const prefs = this.getPreferences(userEmail);
    switch (type) {
      case 'TRACKING':
        return prefs.shipmentUpdates;
      case 'MATCH':
        return prefs.newTruckMatches;
      case 'BOOKING':
        return prefs.bookingUpdates;
      case 'DELIVERY':
        return prefs.deliveryUpdates;
      case 'RETURN_TRIP':
        return prefs.returnTripOpportunities;
      case 'SYSTEM':
      case 'ACCOUNT':
      default:
        return true;
    }
  }

  /**
   * Get all notifications for the given user and role
   */
  public static getNotifications(userEmail: string, role: UserRole = 'shipper'): AppNotification[] {
    const key = this.getStorageKey(userEmail);
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        const seed = this.getInitialSeed(role);
        localStorage.setItem(key, JSON.stringify(seed));
        return seed;
      }
      const list: AppNotification[] = JSON.parse(raw);
      // Filter to relevant role if specified
      return list.filter(n => !n.role || n.role === role);
    } catch (e) {
      console.error('[NotificationService] Error parsing notifications', e);
      return this.getInitialSeed(role);
    }
  }

  /**
   * Add a new notification (checks user preferences first)
   */
  public static addNotification(
    userEmail: string,
    role: UserRole,
    data: Omit<AppNotification, 'id' | 'timestamp' | 'read' | 'role'> & { role?: UserRole }
  ): AppNotification | null {
    // 1. Check user preference
    if (!this.isTypeAllowed(userEmail, data.type)) {
      return null;
    }

    const key = this.getStorageKey(userEmail);
    const all = this.getAllRawNotifications(userEmail);

    const newNotification: AppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: data.type,
      title: data.title,
      message: data.message,
      timestamp: new Date().toISOString(),
      read: false,
      role: data.role || role,
      relatedId: data.relatedId,
      relatedView: data.relatedView
    };

    const updated = [newNotification, ...all].slice(0, 50); // cap at 50
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.error('[NotificationService] Error saving notification', e);
    }

    return newNotification;
  }

  /**
   * Mark a single notification as read
   */
  public static markAsRead(userEmail: string, id: string): AppNotification[] {
    const key = this.getStorageKey(userEmail);
    const all = this.getAllRawNotifications(userEmail);
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.error('[NotificationService] Error updating notification', e);
    }
    return updated;
  }

  /**
   * Mark all notifications as read for the user & role
   */
  public static markAllAsRead(userEmail: string, role?: UserRole): AppNotification[] {
    const key = this.getStorageKey(userEmail);
    const all = this.getAllRawNotifications(userEmail);
    const updated = all.map(n => {
      if (!role || !n.role || n.role === role) {
        return { ...n, read: true };
      }
      return n;
    });
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.error('[NotificationService] Error marking all read', e);
    }
    return updated;
  }

  /**
   * Remove a single notification
   */
  public static removeNotification(userEmail: string, id: string): AppNotification[] {
    const key = this.getStorageKey(userEmail);
    const all = this.getAllRawNotifications(userEmail);
    const updated = all.filter(n => n.id !== id);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.error('[NotificationService] Error deleting notification', e);
    }
    return updated;
  }

  /**
   * Clear all notifications for user
   */
  public static clearNotifications(userEmail: string, role?: UserRole): void {
    const key = this.getStorageKey(userEmail);
    if (!role) {
      try {
        localStorage.setItem(key, JSON.stringify([]));
      } catch (e) {
        console.error('[NotificationService] Error clearing notifications', e);
      }
      return;
    }
    const all = this.getAllRawNotifications(userEmail);
    const remaining = all.filter(n => n.role && n.role !== role);
    try {
      localStorage.setItem(key, JSON.stringify(remaining));
    } catch (e) {
      console.error('[NotificationService] Error clearing notifications', e);
    }
  }

  /**
   * Get unread count for current role
   */
  public static getUnreadCount(userEmail: string, role: UserRole = 'shipper'): number {
    const list = this.getNotifications(userEmail, role);
    return list.filter(n => !n.read).length;
  }

  private static getAllRawNotifications(userEmail: string): AppNotification[] {
    const key = this.getStorageKey(userEmail);
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Relative time formatting: "Just now", "2 min ago", "18 min ago", "1 hr ago", "Today", etc.
   */
  public static formatRelativeTime(isoString: string): string {
    try {
      const past = new Date(isoString).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - past);
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 45) return 'Just now';
      if (diffMin < 60) return `${diffMin} min ago`;
      if (diffHour < 24) return `${diffHour} hr ago`;
      if (diffDay === 1) return 'Yesterday';
      if (diffDay < 7) return `${diffDay}d ago`;
      return new Date(isoString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  }
}
