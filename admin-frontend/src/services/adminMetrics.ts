import { AdminNetworkMetrics, DateRangePeriod, FinancialMetrics, OperationalAlertSummary } from '../types/adminTypes';

export interface DateFilteredMetrics {
  totalTrucks: number;
  activeTrucks: number;
  totalShipments: number;
  inTransitShipments: number;
  completedShipments: number;
  networkUtilization: number;
  emptyKmAvoided: number;
  totalSavingsINR: number;
  co2MitigatedKg: number;
  activeCorridorsCount: number;
  revenueINR: number;
  operatingCostsINR: number;
  fleetEarningsINR: number;
  netProfitINR: number;
}

export class AdminMetricsService {
  // Base 30-Day Master Truth Metrics
  public static readonly BASE_METRICS: AdminNetworkMetrics = {
    totalTrucks: 347,
    activeTrucks: 242,
    totalShipments: 128,
    inTransitShipments: 86,
    completedShipments: 1492,
    networkUtilization: 78.4,
    emptyKmAvoided: 28450,
    totalSavingsINR: 842000,
    co2MitigatedKg: 24600,
    activeCorridorsCount: 14
  };

  public static readonly BASE_FINANCIALS: FinancialMetrics = {
    totalRevenue: 4280000, // ₹42.8 Lakhs
    operatingCosts: 1120000, // ₹11.2 Lakhs
    fleetEarnings: 2840000, // ₹28.4 Lakhs
    netProfit: 320000, // ₹3.2 Lakhs
    costBreakdown: {
      fuel: 470400, // 42%
      driverPayouts: 392000, // 35%
      maintenance: 134400, // 12%
      operations: 78400, // 7%
      platformTolls: 44800 // 4%
    }
  };

  public static readonly OPERATIONAL_ALERTS: OperationalAlertSummary = {
    delayedShipments: 3,
    lowUtilizationTrucks: 5,
    openDisputes: 2,
    pendingKyc: 4,
    flaggedMatches: 1
  };

  /**
   * Returns consistent metrics adjusted by date range filter
   */
  public static getMetricsByPeriod(period: DateRangePeriod): DateFilteredMetrics {
    const base = this.BASE_METRICS;
    const fin = this.BASE_FINANCIALS;

    switch (period) {
      case 'today':
        return {
          totalTrucks: base.totalTrucks,
          activeTrucks: 184,
          totalShipments: 34,
          inTransitShipments: 28,
          completedShipments: 46,
          networkUtilization: 81.2,
          emptyKmAvoided: 980,
          totalSavingsINR: 28500,
          co2MitigatedKg: 840,
          activeCorridorsCount: 12,
          revenueINR: 142000,
          operatingCostsINR: 37500,
          fleetEarningsINR: 94000,
          netProfitINR: 10500
        };
      case '7d':
        return {
          totalTrucks: base.totalTrucks,
          activeTrucks: 220,
          totalShipments: 88,
          inTransitShipments: 64,
          completedShipments: 362,
          networkUtilization: 79.8,
          emptyKmAvoided: 7420,
          totalSavingsINR: 218000,
          co2MitigatedKg: 6350,
          activeCorridorsCount: 14,
          revenueINR: 1080000,
          operatingCostsINR: 282000,
          fleetEarningsINR: 718000,
          netProfitINR: 80000
        };
      case 'custom':
        return {
          totalTrucks: base.totalTrucks,
          activeTrucks: 235,
          totalShipments: 110,
          inTransitShipments: 74,
          completedShipments: 890,
          networkUtilization: 77.9,
          emptyKmAvoided: 18200,
          totalSavingsINR: 540000,
          co2MitigatedKg: 15800,
          activeCorridorsCount: 14,
          revenueINR: 2650000,
          operatingCostsINR: 695000,
          fleetEarningsINR: 1760000,
          netProfitINR: 195000
        };
      case '30d':
      default:
        return {
          ...base,
          revenueINR: fin.totalRevenue,
          operatingCostsINR: fin.operatingCosts,
          fleetEarningsINR: fin.fleetEarnings,
          netProfitINR: fin.netProfit
        };
    }
  }

  /**
   * Returns financial trend chart data points scaled for the selected period
   */
  public static getFinancialTrend(period: DateRangePeriod) {
    if (period === 'today') {
      return [
        { label: '06:00', revenue: 12000, costs: 3200, profit: 900 },
        { label: '09:00', revenue: 28000, costs: 7400, profit: 2100 },
        { label: '12:00', revenue: 56000, costs: 14800, profit: 4200 },
        { label: '15:00', revenue: 89000, costs: 23600, profit: 6700 },
        { label: '18:00', revenue: 118000, costs: 31200, profit: 8900 },
        { label: '21:00', revenue: 142000, costs: 37500, profit: 10500 }
      ];
    }
    if (period === '7d') {
      return [
        { label: 'Mon', revenue: 140000, costs: 36000, profit: 10400 },
        { label: 'Tue', revenue: 152000, costs: 39500, profit: 11200 },
        { label: 'Wed', revenue: 168000, costs: 43800, profit: 12500 },
        { label: 'Thu', revenue: 174000, costs: 45400, profit: 12900 },
        { label: 'Fri', revenue: 192000, costs: 50100, profit: 14200 },
        { label: 'Sat', revenue: 146000, costs: 38200, profit: 10800 },
        { label: 'Sun', revenue: 108000, costs: 29000, profit: 8000 }
      ];
    }
    // 30d or custom
    return [
      { label: 'Week 1', revenue: 980000, costs: 256000, profit: 73000 },
      { label: 'Week 2', revenue: 1060000, costs: 277000, profit: 79000 },
      { label: 'Week 3', revenue: 1140000, costs: 298000, profit: 85000 },
      { label: 'Week 4', revenue: 1100000, costs: 289000, profit: 83000 }
    ];
  }

  /**
   * Top earning corridors with internal consistency
   */
  public static getTopEarningCorridors(period: DateRangePeriod) {
    const scale = period === 'today' ? 0.035 : period === '7d' ? 0.25 : 1;
    return [
      {
        corridor: 'Chennai ⇄ Bengaluru (NH-48)',
        shipments: Math.round(168 * scale),
        revenue: Math.round(1420000 * scale),
        cost: Math.round(370000 * scale),
        profit: Math.round(112000 * scale),
        marginPercent: 7.9
      },
      {
        corridor: 'Mumbai ⇄ Pune (Expressway)',
        shipments: Math.round(124 * scale),
        revenue: Math.round(980000 * scale),
        cost: Math.round(255000 * scale),
        profit: Math.round(76000 * scale),
        marginPercent: 7.8
      },
      {
        corridor: 'Ahmedabad ⇄ Mumbai (NH-48)',
        shipments: Math.round(94 * scale),
        revenue: Math.round(890000 * scale),
        cost: Math.round(232000 * scale),
        profit: Math.round(68000 * scale),
        marginPercent: 7.6
      },
      {
        corridor: 'Bengaluru ⇄ Hyderabad (NH-44)',
        shipments: Math.round(88 * scale),
        revenue: Math.round(740000 * scale),
        cost: Math.round(195000 * scale),
        profit: Math.round(54000 * scale),
        marginPercent: 7.3
      },
      {
        corridor: 'Bengaluru ⇄ Coimbatore (NH-544)',
        shipments: Math.round(76 * scale),
        revenue: Math.round(610000 * scale),
        cost: Math.round(162000 * scale),
        profit: Math.round(44000 * scale),
        marginPercent: 7.2
      }
    ];
  }

  /**
   * Recent financial activity / settlements
   */
  public static getRecentFinancialActivity() {
    return [
      {
        id: 'TXN-9024',
        bookingId: 'CF-48291',
        corridor: 'Chennai → Bengaluru',
        shipper: 'Apex Technologies',
        carrier: 'Swamy Inter-State Carriers',
        grossAmount: 34500,
        platformFee: 2760,
        carrierPayout: 31740,
        status: 'Settled',
        timestamp: 'Today, 14:22'
      },
      {
        id: 'TXN-9023',
        bookingId: 'CF-39120',
        corridor: 'Sriperumbudur → Hosur',
        shipper: 'Auto Components Assemblers',
        carrier: 'VRL Collaborative Express',
        grossAmount: 28200,
        platformFee: 2256,
        carrierPayout: 25944,
        status: 'Escrow Held',
        timestamp: 'Today, 12:05'
      },
      {
        id: 'TXN-9022',
        bookingId: 'CF-28419',
        corridor: 'Mumbai → Pune',
        shipper: 'FMCG Packaged Goods Co.',
        carrier: 'Western Corridor Carriers',
        grossAmount: 19800,
        platformFee: 1584,
        carrierPayout: 18216,
        status: 'Settled',
        timestamp: 'Yesterday, 18:40'
      },
      {
        id: 'TXN-9021',
        bookingId: 'CF-67104',
        corridor: 'Bengaluru → Coimbatore',
        shipper: 'Pharma Cold Chain',
        carrier: 'Southern Express Logistics',
        grossAmount: 21500,
        platformFee: 1720,
        carrierPayout: 19780,
        status: 'Disbursed',
        timestamp: 'Yesterday, 16:15'
      },
      {
        id: 'TXN-9020',
        bookingId: 'CF-55102',
        corridor: 'Hyderabad → Bengaluru',
        shipper: 'Precision Stampings Ltd',
        carrier: 'Karnataka Bulk Logistics',
        grossAmount: 36000,
        platformFee: 2880,
        carrierPayout: 33120,
        status: 'Settled',
        timestamp: 'Sep 11, 11:30'
      }
    ];
  }
}