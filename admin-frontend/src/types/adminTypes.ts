import { LocationHub, Truck, Shipment } from './index';

export type AdminPageView = 
  | 'overview' 
  | 'fleet' 
  | 'shipments' 
  | 'live_ops' 
  | 'matching' 
  | 'finance'
  | 'support'
  | 'insights' 
  | 'audit'
  | 'users' 
  | 'settings';

export type DateRangePeriod = 'today' | '7d' | '30d' | 'custom';

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'Completed' | 'Pending Review' | 'Flagged';
  details?: string;
}

export interface DisputeTicket {
  id: string;
  bookingId: string;
  customerName: string;
  fleetOperator: string;
  category: 'Booking issue' | 'Payment issue' | 'Vehicle issue' | 'Delivery delay' | 'Matching issue';
  shortDescription: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  status: 'open' | 'in_progress' | 'resolved';
  notes: { id: string; author: string; text: string; timestamp: string }[];
}

export interface FinancialMetrics {
  totalRevenue: number;
  operatingCosts: number;
  fleetEarnings: number;
  netProfit: number;
  costBreakdown: {
    fuel: number;
    driverPayouts: number;
    maintenance: number;
    operations: number;
    platformTolls: number;
  };
}

export interface OperationalAlertSummary {
  delayedShipments: number;
  lowUtilizationTrucks: number;
  openDisputes: number;
  pendingKyc: number;
  flaggedMatches: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'operations_manager' | 'dispatch_officer';
  avatar?: string;
  token?: string;
}

export interface AdminNetworkMetrics {
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
}

export interface LiveOperationEvent {
  id: string;
  timestamp: string;
  type: 'DISPATCH' | 'MATCH' | 'ALERT' | 'COMPLETED' | 'DETOUR';
  severity: 'info' | 'warning' | 'success' | 'critical';
  title: string;
  description: string;
  referenceId: string;
  location: string;
}

export interface AdminMatchingRecord {
  id: string;
  matchId: string;
  truckId: string;
  truckName: string;
  registrationNumber: string;
  shipmentId: string;
  cargoType: string;
  weightTons: number;
  origin: LocationHub;
  destination: LocationHub;
  matchScore: number;
  collaborationScore: number;
  factors: {
    capacityFitScore: number;
    routeMatchScore: number;
    proximityScore: number;
    earningsScore: number;
    reliabilityScore: number;
    returnTripScore: number;
  };
  status: 'active' | 'accepted' | 'declined' | 'forced' | 'flagged';
  createdAt: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'shipper' | 'fleet_operator' | 'driver';
  company?: string;
  tripsCount: number;
  rating: number;
  status: 'verified' | 'pending' | 'suspended';
  joinedDate: string;
  activeShipmentsOrTrucks: number;
  location: string;
}
