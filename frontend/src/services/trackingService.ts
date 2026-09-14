import { Shipment, ShipmentStatus } from '../types';
import { CORRIDOR_CHENNAI_BENGALURU } from './mockData';

export interface TrackingPoint {
  coordinates: [number, number];
  progress: number;
  status: ShipmentStatus;
  statusLabel: string;
  etaMinutes: number;
  speedKmph: number;
}

export class TrackingService {
  /**
   * Get interpolated waypoint coordinates for a progress (0 - 100)
   */
  public static getInterpolatedPosition(
    progressPercent: number,
    polyline: [number, number][] = CORRIDOR_CHENNAI_BENGALURU
  ): TrackingPoint {
    const clampedProgress = Math.max(0, Math.min(100, progressPercent));
    const totalPoints = polyline.length;
    
    if (totalPoints <= 1) {
      return {
        coordinates: polyline[0] || [13.0827, 80.2707],
        progress: clampedProgress,
        status: 'in_transit',
        statusLabel: 'In Transit',
        etaMinutes: 24,
        speedKmph: 58
      };
    }

    const floatIndex = (clampedProgress / 100) * (totalPoints - 1);
    const lowerIndex = Math.floor(floatIndex);
    const upperIndex = Math.min(totalPoints - 1, lowerIndex + 1);
    const fraction = floatIndex - lowerIndex;

    const p1 = polyline[lowerIndex];
    const p2 = polyline[upperIndex];

    const lat = p1[0] + (p2[0] - p1[0]) * fraction;
    const lng = p1[1] + (p2[1] - p1[1]) * fraction;

    let status: ShipmentStatus = 'in_transit';
    let statusLabel = 'In Transit';

    if (clampedProgress < 10) {
      status = 'confirmed';
      statusLabel = 'Booking Confirmed';
    } else if (clampedProgress < 20) {
      status = 'driver_assigned';
      statusLabel = 'Driver Assigned';
    } else if (clampedProgress < 30) {
      status = 'going_to_pickup';
      statusLabel = 'Going to Pickup';
    } else if (clampedProgress < 40) {
      status = 'picked_up';
      statusLabel = 'Shipment Picked Up';
    } else if (clampedProgress >= 98) {
      status = 'delivered';
      statusLabel = 'Delivered';
    } else {
      status = 'in_transit';
      statusLabel = 'In Transit';
    }

    const etaMinutes = Math.max(0, Math.round((1 - clampedProgress / 100) * 45));
    const speedKmph = clampedProgress >= 98 ? 0 : Math.round(52 + Math.sin(clampedProgress) * 8);

    return {
      coordinates: [lat, lng],
      progress: clampedProgress,
      status,
      statusLabel,
      etaMinutes,
      speedKmph
    };
  }
}
