import { Truck } from '../types';
import { INITIAL_TRUCKS } from './mockData';

export interface FleetStats {
  totalTrucks: number;
  availableTrucks: number;
  inTransitTrucks: number;
  offlineTrucks: number;
  averageCapacityTons: number;
  utilizationRate: number;
}

export class AdminFleetService {
  private static storageKey = 'collabfleet_fleet_trucks';

  private static getStoredFleet(): Truck[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [...INITIAL_TRUCKS];
  }

  public static async getFleet(): Promise<Truck[]> {
    return this.getStoredFleet();
  }

  public static async getFleetStats(): Promise<FleetStats> {
    const fleet = await this.getFleet();
    const totalTrucks = fleet.length;
    const availableTrucks = fleet.filter(t => t.isAvailable).length;
    const inTransitTrucks = fleet.filter(t => !t.isAvailable && t.currentLoadTons > 0).length;
    const offlineTrucks = Math.max(0, totalTrucks - availableTrucks - inTransitTrucks);

    const totalCapacity = fleet.reduce((acc, t) => acc + (t.totalCapacityTons || 0), 0);
    const currentLoad = fleet.reduce((acc, t) => acc + (t.currentLoadTons || 0), 0);

    return {
      totalTrucks,
      availableTrucks,
      inTransitTrucks,
      offlineTrucks,
      averageCapacityTons: totalTrucks > 0 ? Math.round((totalCapacity / totalTrucks) * 10) / 10 : 16,
      utilizationRate: totalCapacity > 0 ? Math.round((currentLoad / totalCapacity) * 100) : 78
    };
  }

  public static async toggleTruckStatus(truckId: string): Promise<Truck | null> {
    const fleet = this.getStoredFleet();
    const target = fleet.find(t => t.id === truckId);
    if (!target) return null;

    target.isAvailable = !target.isAvailable;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(fleet));
    } catch {}
    return { ...target };
  }
}
