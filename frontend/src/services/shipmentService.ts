import { Shipment, ShipmentStatus, LocationHub, BookingMessage, UserRole } from '../types';
import { ApiClient } from './apiClient';
import { INITIAL_SHIPMENTS, INDIAN_LOCATION_HUBS } from './mockData';

const SHIPMENTS_STORAGE_KEY = 'collabfleet_shipments';

export class ShipmentService {
  private static localShipments: Shipment[] = ShipmentService.initShipments();

  public static sanitizeLocation(loc: any, fallback: LocationHub): LocationHub {
    if (loc && typeof loc === 'object' && loc.name && loc.coordinates) {
      return {
        id: loc.id || fallback.id,
        name: loc.name,
        city: loc.city || loc.name,
        state: loc.state || fallback.state,
        coordinates: Array.isArray(loc.coordinates) && loc.coordinates.length === 2 
          ? [Number(loc.coordinates[0]), Number(loc.coordinates[1])] 
          : fallback.coordinates,
        hubType: loc.hubType || fallback.hubType,
        landmark: loc.landmark || fallback.landmark
      };
    }
    if (typeof loc === 'string' && loc.trim().length > 0) {
      const match = INDIAN_LOCATION_HUBS.find(h => 
        h.name.toLowerCase() === loc.toLowerCase() || 
        h.city.toLowerCase() === loc.toLowerCase()
      );
      if (match) return match;
      return {
        ...fallback,
        id: `loc-custom-${Date.now()}`,
        name: loc.trim(),
        city: loc.trim()
      };
    }
    return fallback;
  }

  public static sanitizeShipment(raw: any, index = 0): Shipment {
    const defaultOrigin = INDIAN_LOCATION_HUBS[0];
    const defaultDestination = INDIAN_LOCATION_HUBS[4];

    const fromLocation = ShipmentService.sanitizeLocation(raw?.fromLocation, defaultOrigin);
    const toLocation = ShipmentService.sanitizeLocation(raw?.toLocation, defaultDestination);

    let truck = raw?.truck;
    if (truck && typeof truck === 'object') {
      truck = {
        ...truck,
        name: truck.name || (truck.registrationNumber ? `Truck ${truck.registrationNumber}` : 'Assigned Truck'),
        registrationNumber: truck.registrationNumber || 'KA 03 AA 4521',
        truckType: truck.truckType || raw?.truckTypeNeeded || 'Heavy Truck',
        driver: truck.driver && typeof truck.driver === 'object' ? {
          id: truck.driver.id || 'drv-gen',
          name: truck.driver.name || 'Driver Assigned',
          phone: truck.driver.phone || '+91 98401 00000',
          rating: typeof truck.driver.rating === 'number' ? truck.driver.rating : 4.85,
          tripsCompleted: typeof truck.driver.tripsCompleted === 'number' ? truck.driver.tripsCompleted : 240,
          experienceYears: typeof truck.driver.experienceYears === 'number' ? truck.driver.experienceYears : 6
        } : undefined
      };
    } else {
      truck = undefined;
    }

    const randomDigits = Math.floor(10000 + Math.random() * 90000);

    return {
      id: raw?.id || `ship-${Date.now()}-${index}`,
      trackingNumber: raw?.trackingNumber || `CF-${randomDigits}`,
      fromLocation,
      toLocation,
      cargoType: raw?.cargoType || 'Industrial Freight',
      weightTons: typeof raw?.weightTons === 'number' ? raw.weightTons : 8,
      truckTypeNeeded: raw?.truckTypeNeeded || 'Heavy Truck',
      pickupDate: raw?.pickupDate || 'Today',
      pickupTime: raw?.pickupTime || '05:30 PM',
      specialRequirements: raw?.specialRequirements || '',
      status: raw?.status || 'pending',
      truck,
      price: typeof raw?.price === 'number' ? raw.price : 8400,
      matchScore: typeof raw?.matchScore === 'number' ? raw.matchScore : 94,
      collaborationScore: typeof raw?.collaborationScore === 'number' ? raw.collaborationScore : 92,
      isReturnTrip: raw?.isReturnTrip ?? true,
      emptyKmSaved: typeof raw?.emptyKmSaved === 'number' ? raw.emptyKmSaved : 67,
      co2ReductionKg: typeof raw?.co2ReductionKg === 'number' ? raw.co2ReductionKg : 142,
      savingsAmount: typeof raw?.savingsAmount === 'number' ? raw.savingsAmount : 1850,
      createdAt: raw?.createdAt || new Date().toISOString(),
      acceptedAt: raw?.acceptedAt,
      tripStartedAt: raw?.tripStartedAt,
      completedAt: raw?.completedAt,
      declinedAt: raw?.declinedAt,
      shipperName: raw?.shipperName || 'Nakul Venkatesh',
      shipperCompany: raw?.shipperCompany || 'Apex Technologies Freight Co.',
      shipperPhone: raw?.shipperPhone || '+91 98401 23456',
      messages: Array.isArray(raw?.messages) ? raw.messages : [],
      estimatedDeliveryTime: raw?.estimatedDeliveryTime || 'Tonight, 10:45 PM',
      currentTrackingPosition: Array.isArray(raw?.currentTrackingPosition) 
        ? raw.currentTrackingPosition 
        : fromLocation.coordinates,
      progressPercentage: typeof raw?.progressPercentage === 'number' 
        ? raw.progressPercentage 
        : (raw?.status === 'delivered' ? 100 : (raw?.status === 'in_transit' ? 35 : 0))
    };
  }

  private static initShipments(): Shipment[] {
    try {
      const stored = localStorage.getItem(SHIPMENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((item, idx) => ShipmentService.sanitizeShipment(item, idx));
          try {
            localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(sanitized));
          } catch {}
          return sanitized;
        }
      }
    } catch {}
    
    const defaults = INITIAL_SHIPMENTS.map((item, idx) => ShipmentService.sanitizeShipment(item, idx));
    try {
      localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(defaults));
    } catch {}
    return defaults;
  }

  private static saveShipments(): void {
    try {
      localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(this.localShipments));
    } catch {}
  }

  public static async getShipments(statusFilter: 'all' | 'requests' | 'active' | 'completed' | 'cancelled' = 'all'): Promise<Shipment[]> {
    return ApiClient.executeWithFallback<Shipment[]>(
      `/shipments?status=${statusFilter}`,
      { method: 'GET' },
      () => {
        if (statusFilter === 'all') return [...this.localShipments];
        if (statusFilter === 'requests') {
          return this.localShipments.filter(s => s.status === 'pending');
        }
        if (statusFilter === 'active') {
          return this.localShipments.filter(s => ['pending', 'accepted', 'confirmed', 'driver_assigned', 'going_to_pickup', 'picked_up', 'in_transit'].includes(s.status));
        }
        if (statusFilter === 'completed') {
          return this.localShipments.filter(s => s.status === 'delivered');
        }
        if (statusFilter === 'cancelled') {
          return this.localShipments.filter(s => s.status === 'cancelled' || s.status === 'declined');
        }
        return [...this.localShipments];
      }
    );
  }

  public static async getShipmentByTracking(trackingNumber: string): Promise<Shipment | null> {
    return ApiClient.executeWithFallback<Shipment | null>(
      `/shipments/${trackingNumber}`,
      { method: 'GET' },
      () => {
        const found = this.localShipments.find(s => s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase());
        return found || this.localShipments[0] || null;
      }
    );
  }

  public static async createBooking(shipmentData: Partial<Shipment>): Promise<Shipment> {
    return ApiClient.executeWithFallback<Shipment>(
      '/shipments/book',
      {
        method: 'POST',
        body: JSON.stringify(shipmentData)
      },
      () => {
        const randomDigits = Math.floor(10000 + Math.random() * 90000);
        const trackingNumber = shipmentData.trackingNumber || `CF-${randomDigits}`;

        const initialMessages: BookingMessage[] = shipmentData.messages && shipmentData.messages.length > 0 
          ? shipmentData.messages 
          : [
              {
                id: `msg-${Date.now()}`,
                bookingId: `ship-${Date.now()}`,
                senderRole: 'shipper',
                senderName: shipmentData.shipperName || 'Shipper',
                text: `Booking request sent for ${shipmentData.cargoType || 'Cargo'} (${shipmentData.weightTons || 8}T). Waiting for fleet operator acceptance.`,
                timestamp: new Date().toISOString()
              }
            ];

        const newShipment = ShipmentService.sanitizeShipment({
          id: `ship-${Date.now()}`,
          trackingNumber,
          fromLocation: shipmentData.fromLocation,
          toLocation: shipmentData.toLocation,
          cargoType: shipmentData.cargoType || 'Industrial Cargo',
          weightTons: shipmentData.weightTons || 8,
          truckTypeNeeded: shipmentData.truckTypeNeeded || 'Heavy Truck',
          pickupDate: shipmentData.pickupDate || 'Today',
          pickupTime: shipmentData.pickupTime || '05:30 PM',
          specialRequirements: shipmentData.specialRequirements || 'Temperature controlled, shock-resistant packing',
          status: shipmentData.status || 'pending',
          truck: shipmentData.truck,
          price: shipmentData.price || 8400,
          matchScore: shipmentData.matchScore || 94,
          collaborationScore: shipmentData.collaborationScore || 92,
          isReturnTrip: shipmentData.isReturnTrip ?? true,
          emptyKmSaved: shipmentData.emptyKmSaved || 67,
          co2ReductionKg: shipmentData.co2ReductionKg || 142,
          savingsAmount: shipmentData.savingsAmount || 1850,
          createdAt: new Date().toISOString(),
          shipperName: shipmentData.shipperName || 'Nakul Venkatesh',
          shipperCompany: shipmentData.shipperCompany || 'Apex Technologies Freight Co.',
          shipperPhone: shipmentData.shipperPhone || '+91 98401 23456',
          messages: initialMessages,
          estimatedDeliveryTime: 'Tonight, 10:45 PM',
          currentTrackingPosition: shipmentData.fromLocation ? shipmentData.fromLocation.coordinates : [13.0827, 80.2707],
          progressPercentage: 0
        });

        // Put at front of shipments list and persist to localStorage
        this.localShipments.unshift(newShipment);
        this.saveShipments();
        return newShipment;
      }
    );
  }

  public static acceptBooking(shipmentId: string): Shipment | null {
    const s = this.localShipments.find(item => item.id === shipmentId || item.trackingNumber === shipmentId);
    if (!s) return null;
    s.status = 'accepted';
    s.acceptedAt = new Date().toISOString();
    if (!s.messages) s.messages = [];
    s.messages.push({
      id: `msg-${Date.now()}`,
      bookingId: s.id,
      senderRole: 'fleet_operator',
      senderName: s.truck?.driver?.name || s.truck?.company || 'Fleet Partner',
      text: `Booking confirmed! We have accepted this shipment and are preparing ${s.truck?.name || 'the vehicle'} for pickup.`,
      timestamp: new Date().toISOString()
    });
    this.saveShipments();
    return { ...s };
  }

  public static declineBooking(shipmentId: string, reason?: string): Shipment | null {
    const s = this.localShipments.find(item => item.id === shipmentId || item.trackingNumber === shipmentId);
    if (!s) return null;
    s.status = 'declined';
    s.declinedAt = new Date().toISOString();
    if (!s.messages) s.messages = [];
    s.messages.push({
      id: `msg-${Date.now()}`,
      bookingId: s.id,
      senderRole: 'fleet_operator',
      senderName: s.truck?.driver?.name || s.truck?.company || 'Fleet Partner',
      text: reason || 'Booking request was declined by the fleet owner. Please select another available truck.',
      timestamp: new Date().toISOString()
    });
    this.saveShipments();
    return { ...s };
  }

  public static startTrip(shipmentId: string): Shipment | null {
    const s = this.localShipments.find(item => item.id === shipmentId || item.trackingNumber === shipmentId);
    if (!s) return null;
    s.status = 'in_transit';
    s.tripStartedAt = new Date().toISOString();
    s.progressPercentage = Math.max(s.progressPercentage || 0, 15);
    if (!s.messages) s.messages = [];
    s.messages.push({
      id: `msg-${Date.now()}`,
      bookingId: s.id,
      senderRole: 'fleet_operator',
      senderName: s.truck?.driver?.name || s.truck?.company || 'Fleet Partner',
      text: `Trip started! ${s.truck?.name || 'Truck'} has commenced transit from ${s.fromLocation.name} towards ${s.toLocation.name}. Live tracking active.`,
      timestamp: new Date().toISOString()
    });
    this.saveShipments();
    return { ...s };
  }

  public static completeTrip(shipmentId: string): Shipment | null {
    const s = this.localShipments.find(item => item.id === shipmentId || item.trackingNumber === shipmentId);
    if (!s) return null;
    s.status = 'delivered';
    s.completedAt = new Date().toISOString();
    s.progressPercentage = 100;
    if (!s.messages) s.messages = [];
    s.messages.push({
      id: `msg-${Date.now()}`,
      bookingId: s.id,
      senderRole: 'fleet_operator',
      senderName: s.truck?.driver?.name || s.truck?.company || 'Fleet Partner',
      text: 'Shipment successfully delivered and verified at destination.',
      timestamp: new Date().toISOString()
    });
    this.saveShipments();
    return { ...s };
  }

  public static addBookingMessage(
    shipmentId: string, 
    msg: { senderRole: UserRole; senderName: string; text: string }
  ): BookingMessage | null {
    const s = this.localShipments.find(item => item.id === shipmentId || item.trackingNumber === shipmentId);
    if (!s) return null;
    if (!s.messages) s.messages = [];
    const newMsg: BookingMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookingId: s.id,
      senderRole: msg.senderRole,
      senderName: msg.senderName,
      text: msg.text,
      timestamp: new Date().toISOString(),
      read: false
    };
    s.messages.push(newMsg);
    this.saveShipments();
    return newMsg;
  }

  public static markMessagesAsRead(shipmentId: string, currentRole: UserRole): Shipment | null {
    const s = this.localShipments.find(item => item.id === shipmentId || item.trackingNumber === shipmentId);
    if (!s || !s.messages) return null;
    let changed = false;
    s.messages.forEach(msg => {
      if (msg.senderRole !== currentRole && !msg.read) {
        msg.read = true;
        changed = true;
      }
    });
    if (changed) {
      this.saveShipments();
    }
    return { ...s };
  }

  public static getUnreadCount(shipment: Shipment, currentRole: UserRole): number {
    if (!shipment.messages || shipment.messages.length === 0) return 0;
    return shipment.messages.filter(m => m.senderRole !== currentRole && !m.read).length;
  }

  public static getPendingRequests(): Shipment[] {
    return this.localShipments.filter(s => s.status === 'pending');
  }

  public static updateShipmentStatus(id: string, status: ShipmentStatus, progress: number): void {
    const s = this.localShipments.find(item => item.id === id || item.trackingNumber === id);
    if (s) {
      s.status = status;
      s.progressPercentage = progress;
      this.saveShipments();
    }
  }
}
