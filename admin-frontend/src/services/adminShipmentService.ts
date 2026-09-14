import { Shipment, ShipmentStatus } from '../types';
import { INITIAL_SHIPMENTS } from './mockData';

export interface ShipmentOverviewStats {
  totalShipments: number;
  pendingCount: number;
  inTransitCount: number;
  deliveredCount: number;
  totalFreightValueINR: number;
}

export class AdminShipmentService {
  private static storageKey = 'collabfleet_shipments';

  private static getStoredShipments(): Shipment[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [...INITIAL_SHIPMENTS];
  }

  public static async getAllShipments(): Promise<Shipment[]> {
    return this.getStoredShipments();
  }

  public static async getShipmentsByStatus(status: string): Promise<Shipment[]> {
    const all = await this.getAllShipments();
    if (status === 'all' || !status) return all;
    if (status === 'active' || status === 'in_transit') {
      return all.filter(s => ['confirmed', 'driver_assigned', 'going_to_pickup', 'picked_up', 'in_transit'].includes(s.status));
    }
    if (status === 'delivered' || status === 'completed') {
      return all.filter(s => s.status === 'delivered');
    }
    return all.filter(s => s.status === status);
  }

  public static async getShipmentStats(): Promise<ShipmentOverviewStats> {
    const all = await this.getAllShipments();
    const inTransitCount = all.filter(s => ['in_transit', 'picked_up', 'going_to_pickup'].includes(s.status)).length;
    const pendingCount = all.filter(s => ['confirmed', 'driver_assigned'].includes(s.status)).length;
    const deliveredCount = all.filter(s => s.status === 'delivered').length;
    const totalFreightValueINR = all.reduce((acc, s) => acc + (s.price || 0), 0);

    return {
      totalShipments: all.length,
      pendingCount,
      inTransitCount,
      deliveredCount,
      totalFreightValueINR
    };
  }

  public static updateStatus(shipmentId: string, status: ShipmentStatus): void {
    const shipments = this.getStoredShipments();
    const target = shipments.find(s => s.id === shipmentId);
    if (target) {
      target.status = status;
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(shipments));
      } catch {}
    }
  }
}
