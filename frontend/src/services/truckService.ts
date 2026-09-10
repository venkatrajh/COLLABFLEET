import { FreightOpportunity, Truck } from '../types';
import { ApiClient } from './apiClient';
import { INITIAL_TRUCKS, INITIAL_FREIGHT_OPPORTUNITIES } from './mockData';

export class TruckService {
  private static localTrucks: Truck[] = [...INITIAL_TRUCKS];
  private static localFreight: FreightOpportunity[] = [...INITIAL_FREIGHT_OPPORTUNITIES];

  public static async getMyTrucks(): Promise<Truck[]> {
    return ApiClient.executeWithFallback<Truck[]>(
      '/trucks/my-fleet',
      { method: 'GET' },
      () => [...this.localTrucks]
    );
  }

  public static async addTruck(truckData: Omit<Truck, 'id' | 'driver'> & { driverName?: string; driverPhone?: string }): Promise<Truck> {
    return ApiClient.executeWithFallback<Truck>(
      '/trucks',
      {
        method: 'POST',
        body: JSON.stringify(truckData)
      },
      () => {
        const newTruck: Truck = {
          id: `truck-${Date.now()}`,
          name: truckData.name,
          model: truckData.model,
          registrationNumber: truckData.registrationNumber,
          truckType: truckData.truckType,
          totalCapacityTons: truckData.totalCapacityTons,
          currentLoadTons: truckData.currentLoadTons || 0,
          availableCapacityTons: truckData.availableCapacityTons,
          currentLocation: truckData.currentLocation,
          currentDestination: truckData.currentDestination,
          company: truckData.company || 'Collab Fleet Partner',
          pricePerKm: truckData.pricePerKm || 25,
          isAvailable: true,
          activeMatchesCount: 3,
          driver: {
            id: `drv-${Date.now()}`,
            name: truckData.driverName || 'Karthik Raman',
            phone: truckData.driverPhone || '+91 98400 11223',
            rating: 4.9,
            tripsCompleted: 150,
            experienceYears: 6
          }
        };
        this.localTrucks.unshift(newTruck);
        return newTruck;
      }
    );
  }

  public static async getFreightOpportunities(): Promise<FreightOpportunity[]> {
    return ApiClient.executeWithFallback<FreightOpportunity[]>(
      '/freight/opportunities',
      { method: 'GET' },
      () => [...this.localFreight]
    );
  }
}
