import { Shipment, ShipmentStatus } from '../types';
import { ApiClient } from './apiClient';
import { INITIAL_SHIPMENTS } from './mockData';

export class ShipmentService {
  private static localShipments: Shipment[] = [...INITIAL_SHIPMENTS];

  public static async getShipments(statusFilter: 'all' | 'active' | 'completed' | 'cancelled' = 'all'): Promise<Shipment[]> {
    return ApiClient.executeWithFallback<Shipment[]>(
      `/shipments?status=${statusFilter}`,
      { method: 'GET' },
      () => {
        if (statusFilter === 'all') return [...this.localShipments];
        if (statusFilter === 'active') {
          return this.localShipments.filter(s => ['confirmed', 'driver_assigned', 'going_to_pickup', 'picked_up', 'in_transit'].includes(s.status));
        }
        if (statusFilter === 'completed') {
          return this.localShipments.filter(s => s.status === 'delivered');
        }
        if (statusFilter === 'cancelled') {
          return this.localShipments.filter(s => s.status === 'cancelled');
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
        return found || this.localShipments[0];
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
        // Specific hackathon requirement: Booking ID CF-48291
        const trackingNumber = 'CF-48291';
        const newShipment: Shipment = {
          id: `ship-${Date.now()}`,
          trackingNumber,
          fromLocation: shipmentData.fromLocation || this.localShipments[0].fromLocation,
          toLocation: shipmentData.toLocation || this.localShipments[0].toLocation,
          cargoType: shipmentData.cargoType || 'Electronics',
          weightTons: shipmentData.weightTons || 8,
          truckTypeNeeded: shipmentData.truckTypeNeeded || 'Heavy Truck',
          pickupDate: shipmentData.pickupDate || 'Today',
          pickupTime: shipmentData.pickupTime || '05:30 PM',
          specialRequirements: shipmentData.specialRequirements || 'Temperature controlled, shock-resistant packing',
          status: 'confirmed',
          truck: shipmentData.truck || this.localShipments[0].truck,
          price: shipmentData.price || 8400,
          matchScore: shipmentData.matchScore || 94,
          collaborationScore: shipmentData.collaborationScore || 92,
          isReturnTrip: shipmentData.isReturnTrip ?? true,
          emptyKmSaved: shipmentData.emptyKmSaved || 67,
          co2ReductionKg: shipmentData.co2ReductionKg || 142,
          savingsAmount: shipmentData.savingsAmount || 1850,
          createdAt: new Date().toISOString(),
          estimatedDeliveryTime: 'Tonight, 10:45 PM',
          currentTrackingPosition: shipmentData.fromLocation ? shipmentData.fromLocation.coordinates : [13.0827, 80.2707],
          progressPercentage: 5
        };

        // Put at front of shipments list
        this.localShipments.unshift(newShipment);
        return newShipment;
      }
    );
  }

  public static updateShipmentStatus(id: string, status: ShipmentStatus, progress: number): void {
    const s = this.localShipments.find(item => item.id === id || item.trackingNumber === id);
    if (s) {
      s.status = status;
      s.progressPercentage = progress;
    }
  }
}
