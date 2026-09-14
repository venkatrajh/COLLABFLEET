import { AdminNetworkMetrics } from '../types/adminTypes';
import { AdminMetricsService } from './adminMetrics';

export interface CorridorPerformance {
  corridor: string;
  volumeTons: number;
  tripsCount: number;
  utilizationPercent: number;
  emptyKmAvoided: number;
  growthPercent: number;
}

export interface VolumeTrendPoint {
  day: string;
  shipments: number;
  trucks: number;
  utilization: number;
}

export class AdminInsightsService {
  public static async getNetworkMetrics(): Promise<AdminNetworkMetrics> {
    return { ...AdminMetricsService.BASE_METRICS };
  }

  public static async getTopCorridors(): Promise<CorridorPerformance[]> {
    return [
      {
        corridor: 'Chennai ⇄ Bengaluru (NH-48)',
        volumeTons: 1420,
        tripsCount: 168,
        utilizationPercent: 88.4,
        emptyKmAvoided: 9400,
        growthPercent: 18.2
      },
      {
        corridor: 'Mumbai ⇄ Pune (Expressway)',
        volumeTons: 980,
        tripsCount: 124,
        utilizationPercent: 82.1,
        emptyKmAvoided: 6200,
        growthPercent: 14.5
      },
      {
        corridor: 'Bengaluru ⇄ Hyderabad (NH-44)',
        volumeTons: 740,
        tripsCount: 88,
        utilizationPercent: 76.5,
        emptyKmAvoided: 5800,
        growthPercent: 12.0
      },
      {
        corridor: 'Bengaluru ⇄ Coimbatore (NH-544)',
        volumeTons: 610,
        tripsCount: 76,
        utilizationPercent: 74.2,
        emptyKmAvoided: 4100,
        growthPercent: 9.8
      },
      {
        corridor: 'Ahmedabad ⇄ Mumbai (NH-48)',
        volumeTons: 890,
        tripsCount: 94,
        utilizationPercent: 79.0,
        emptyKmAvoided: 2950,
        growthPercent: 16.4
      }
    ];
  }

  public static async getVolumeTrends(): Promise<VolumeTrendPoint[]> {
    return [
      { day: 'Mon', shipments: 68, trucks: 140, utilization: 72 },
      { day: 'Tue', shipments: 84, trucks: 165, utilization: 75 },
      { day: 'Wed', shipments: 102, trucks: 198, utilization: 81 },
      { day: 'Thu', shipments: 118, trucks: 220, utilization: 84 },
      { day: 'Fri', shipments: 128, trucks: 242, utilization: 88 },
      { day: 'Sat', shipments: 92, trucks: 180, utilization: 77 },
      { day: 'Sun', shipments: 64, trucks: 135, utilization: 69 }
    ];
  }
}
