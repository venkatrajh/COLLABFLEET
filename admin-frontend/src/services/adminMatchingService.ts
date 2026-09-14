import { AdminMatchingRecord } from '../types/adminTypes';
import { INDIAN_LOCATION_HUBS, INITIAL_TRUCKS } from './mockData';
import { AdminAuditService } from './adminAuditService';

export class AdminMatchingService {
  private static storageKey = 'collabfleet_admin_matches';

  public static getMatchingWeights() {
    return {
      capacityFit: { label: 'Capacity Fit', weight: 25, description: 'Payload weight matches available truck space' },
      routeMatch: { label: 'Route Match', weight: 25, description: 'Route Alignment along highway corridor' },
      proximity: { label: 'Proximity', weight: 15, description: 'Distance from truck location to shipment pickup' },
      earnings: { label: 'Earnings', weight: 10, description: 'Optimal revenue rate per ton-kilometer' },
      reliability: { label: 'Reliability', weight: 10, description: 'Carrier delivery rating and verified track record' },
      returnTrip: { label: 'Return Trip / Backhaul', weight: 15, description: 'Empty-KM Reduction by filling return journey' }
    };
  }

  private static getDefaultRecords(): AdminMatchingRecord[] {
    return [
      {
        id: 'rec-1',
        matchId: 'MTC-9941',
        truckId: INITIAL_TRUCKS[0].id,
        truckName: INITIAL_TRUCKS[0].name,
        registrationNumber: INITIAL_TRUCKS[0].registrationNumber,
        shipmentId: 'SH-8841',
        cargoType: 'Industrial Electronics & Sensors',
        weightTons: 8,
        origin: INDIAN_LOCATION_HUBS[0],
        destination: INDIAN_LOCATION_HUBS[4],
        matchScore: 96,
        collaborationScore: 94,
        factors: {
          capacityFitScore: 98,
          routeMatchScore: 96,
          proximityScore: 94,
          earningsScore: 92,
          reliabilityScore: 98,
          returnTripScore: 95
        },
        status: 'active',
        createdAt: '4 mins ago'
      },
      {
        id: 'rec-2',
        matchId: 'MTC-9942',
        truckId: INITIAL_TRUCKS[1].id,
        truckName: INITIAL_TRUCKS[1].name,
        registrationNumber: INITIAL_TRUCKS[1].registrationNumber,
        shipmentId: 'SH-8842',
        cargoType: 'Automotive Stamping Components',
        weightTons: 6.5,
        origin: INDIAN_LOCATION_HUBS[3],
        destination: INDIAN_LOCATION_HUBS[6],
        matchScore: 94,
        collaborationScore: 92,
        factors: {
          capacityFitScore: 95,
          routeMatchScore: 94,
          proximityScore: 92,
          earningsScore: 90,
          reliabilityScore: 96,
          returnTripScore: 94
        },
        status: 'accepted',
        createdAt: '12 mins ago'
      },
      {
        id: 'rec-3',
        matchId: 'MTC-9943',
        truckId: INITIAL_TRUCKS[2].id,
        truckName: INITIAL_TRUCKS[2].name,
        registrationNumber: INITIAL_TRUCKS[2].registrationNumber,
        shipmentId: 'SH-8846',
        cargoType: 'FMCG Consumables & Beverages',
        weightTons: 10,
        origin: INDIAN_LOCATION_HUBS[9],
        destination: INDIAN_LOCATION_HUBS[10],
        matchScore: 93,
        collaborationScore: 90,
        factors: {
          capacityFitScore: 94,
          routeMatchScore: 95,
          proximityScore: 90,
          earningsScore: 89,
          reliabilityScore: 94,
          returnTripScore: 92
        },
        status: 'active',
        createdAt: '22 mins ago'
      },
      {
        id: 'rec-4',
        matchId: 'MTC-9944',
        truckId: INITIAL_TRUCKS[3].id,
        truckName: INITIAL_TRUCKS[3].name,
        registrationNumber: INITIAL_TRUCKS[3].registrationNumber,
        shipmentId: 'SH-8850',
        cargoType: 'Heavy Electrical Switchgear',
        weightTons: 14,
        origin: INDIAN_LOCATION_HUBS[8],
        destination: INDIAN_LOCATION_HUBS[14],
        matchScore: 91,
        collaborationScore: 88,
        factors: {
          capacityFitScore: 92,
          routeMatchScore: 92,
          proximityScore: 88,
          earningsScore: 87,
          reliabilityScore: 93,
          returnTripScore: 90
        },
        status: 'active',
        createdAt: '35 mins ago'
      },
      {
        id: 'rec-5',
        matchId: 'MTC-9945',
        truckId: INITIAL_TRUCKS[4].id,
        truckName: INITIAL_TRUCKS[4].name,
        registrationNumber: INITIAL_TRUCKS[4].registrationNumber,
        shipmentId: 'SH-8844',
        cargoType: 'Textile Spun Yarn',
        weightTons: 5,
        origin: INDIAN_LOCATION_HUBS[4],
        destination: INDIAN_LOCATION_HUBS[7],
        matchScore: 90,
        collaborationScore: 87,
        factors: {
          capacityFitScore: 91,
          routeMatchScore: 90,
          proximityScore: 86,
          earningsScore: 88,
          reliabilityScore: 95,
          returnTripScore: 89
        },
        status: 'accepted',
        createdAt: '48 mins ago'
      }
    ];
  }

  public static async getMatchRecords(): Promise<AdminMatchingRecord[]> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return this.getDefaultRecords();
  }

  public static async updateMatchStatus(
    id: string,
    newStatus: 'active' | 'accepted' | 'declined' | 'forced' | 'flagged'
  ): Promise<AdminMatchingRecord | null> {
    const list = await this.getMatchRecords();
    const target = list.find(m => m.id === id || m.matchId === id);
    if (!target) return null;

    target.status = newStatus;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch {}

    const actionText = newStatus === 'forced'
      ? 'Forced match'
      : newStatus === 'flagged'
      ? 'Flagged match'
      : `Updated match status to ${newStatus}`;

    AdminAuditService.logAction(
      actionText,
      target.matchId,
      `Truck: ${target.truckName} (${target.registrationNumber}) · Cargo: ${target.cargoType}`,
      newStatus === 'flagged' ? 'Flagged' : 'Completed'
    );

    return { ...target };
  }

  public static async getMatchingStats() {
    return {
      activeMatchesCount: 42,
      successRatePercent: 94.8,
      averageMatchScore: 92.6,
      backhaulMatchesPercent: 78.4,
      avgResponseTimeSeconds: 14
    };
  }
}
