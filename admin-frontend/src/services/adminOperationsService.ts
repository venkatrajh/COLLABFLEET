import { LiveOperationEvent } from '../types/adminTypes';

export class AdminOperationsService {
  public static async getRecentEvents(): Promise<LiveOperationEvent[]> {
    return [
      {
        id: 'evt-1',
        timestamp: 'Just now',
        type: 'MATCH',
        severity: 'success',
        title: 'Corridor Match Verified',
        description: 'Ashok Leyland 1618 matched with 8T Electronics on NH-48 corridor.',
        referenceId: 'CF-48291',
        location: 'Ranipet Hub'
      },
      {
        id: 'evt-2',
        timestamp: '4 mins ago',
        type: 'DISPATCH',
        severity: 'info',
        title: 'Truck Dispatched',
        description: 'Tata Signa departed Whitefield ICD for Chennai Port container return.',
        referenceId: 'CF-39120',
        location: 'Whitefield ICD'
      },
      {
        id: 'evt-3',
        timestamp: '18 mins ago',
        type: 'COMPLETED',
        severity: 'success',
        title: 'Delivery Confirmed',
        description: 'Consignment CF-28419 successfully received in Bhiwandi Logistics Yard.',
        referenceId: 'CF-28419',
        location: 'Mumbai Hub'
      },
      {
        id: 'evt-4',
        timestamp: '32 mins ago',
        type: 'ALERT',
        severity: 'warning',
        title: 'Highway Congestion Alert',
        description: 'Heavy toll gate queue at Walajapet on NH-48. ETA updated +18 mins.',
        referenceId: 'CORR-NH48',
        location: 'Walajapet Toll'
      },
      {
        id: 'evt-5',
        timestamp: '1 hour ago',
        type: 'DISPATCH',
        severity: 'info',
        title: 'Backhaul Pickup Initiated',
        description: 'Eicher Pro 6028 commenced loading 7T agro commodities in Salem.',
        referenceId: 'CF-67104',
        location: 'Salem Hub'
      }
    ];
  }
}
