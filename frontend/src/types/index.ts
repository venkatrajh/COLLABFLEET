export type UserRole = 'shipper' | 'fleet_operator';

export type TruckType = 
  | 'Mini Truck'
  | 'Light Truck'
  | 'Medium Truck'
  | 'Heavy Truck'
  | 'Container Truck';

export interface LocationHub {
  id: string;
  name: string;
  city: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  hubType: 'port' | 'airport' | 'hub' | 'city';
  landmark?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  tripsCompleted: number;
  experienceYears: number;
  avatar?: string;
}

export interface Truck {
  id: string;
  name: string;
  model: string;
  registrationNumber: string;
  truckType: TruckType;
  totalCapacityTons: number;
  currentLoadTons: number;
  availableCapacityTons: number;
  currentLocation: LocationHub;
  currentDestination?: LocationHub;
  driver: Driver;
  company: string;
  pricePerKm: number;
  isAvailable: boolean;
  activeMatchesCount?: number;
  routePolyline?: [number, number][];
}

export interface AIExplanation {
  capacityFitScore: number;
  routeMatchScore: number;
  distanceScore: number;
  priceScore: number;
  driverReliabilityScore: number;
  returnTripScore: number;
  summaryReason: string;
  bulletPoints: string[];
}

export interface MatchResult {
  truck: Truck;
  matchScore: number; // 0-100 (e.g. 94)
  collaborationScore: number; // 0-100 (e.g. 92)
  estimatedPrice: number;
  distanceKm: number;
  etaMinutes: number;
  isReturnTrip: boolean;
  emptyKmSaved: number;
  savingsAmount: number;
  co2ReductionKg: number;
  explanation: AIExplanation;
}

export type ShipmentStatus = 
  | 'pending'
  | 'accepted'
  | 'confirmed'
  | 'driver_assigned'
  | 'going_to_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'declined'
  | 'cancelled';

export interface BookingMessage {
  id: string;
  bookingId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
  read?: boolean;
}

export interface Shipment {
  id: string;
  trackingNumber: string; // e.g. CF-48291
  fromLocation: LocationHub;
  toLocation: LocationHub;
  cargoType: string;
  weightTons: number;
  truckTypeNeeded: TruckType;
  pickupDate: string;
  pickupTime: string;
  specialRequirements?: string;
  status: ShipmentStatus;
  truck?: Truck;
  price: number;
  matchScore?: number;
  collaborationScore?: number;
  isReturnTrip?: boolean;
  emptyKmSaved?: number;
  co2ReductionKg?: number;
  savingsAmount?: number;
  createdAt: string;
  acceptedAt?: string;
  tripStartedAt?: string;
  completedAt?: string;
  declinedAt?: string;
  estimatedDeliveryTime?: string;
  currentTrackingPosition?: [number, number];
  progressPercentage?: number;
  shipperName?: string;
  shipperCompany?: string;
  shipperPhone?: string;
  messages?: BookingMessage[];
}

export interface FreightOpportunity {
  id: string;
  shipmentId: string;
  fromLocation: LocationHub;
  toLocation: LocationHub;
  cargoType: string;
  weightTons: number;
  pickupTime: string;
  estimatedEarnings: number;
  matchScore: number;
  emptyKmSaved: number;
  routeMatchScore: number;
  shipperName: string;
  shipperRating: number;
  truckTypeNeeded?: TruckType;
  co2ReductionKg?: number;
  savingsAmount?: number;
  isReturnTrip?: boolean;
  explanation?: AIExplanation;
}

export interface UserProfile {
  id: string;
  name: string;
  company: string;
  role: UserRole;
  email: string;
  phone: string;
  rating: number;
  savedLocations: LocationHub[];
  stats: {
    emptyKmSaved: number;
    moneySaved: number;
    co2ReductionKg: number;
    completedTrips: number;
    activeShipments: number;
  };
  settings?: UserSettings;
}

export type NotificationType = 
  | 'MATCH' 
  | 'BOOKING' 
  | 'TRACKING' 
  | 'RETURN_TRIP' 
  | 'DELIVERY' 
  | 'SYSTEM' 
  | 'ACCOUNT';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  role?: UserRole;
  relatedId?: string;
  relatedView?: AppView;
}

export interface NotificationPreferences {
  shipmentUpdates: boolean;
  newTruckMatches: boolean;
  bookingUpdates: boolean;
  deliveryUpdates: boolean;
  returnTripOpportunities: boolean;
  fleetOpportunities?: boolean;
}

export interface UserSettings {
  notifications: NotificationPreferences;
  privacy: {
    profileVisibility: boolean;
    showCompanyInfo: boolean;
    shareTracking: boolean;
  };
  location: {
    locationServicesEnabled: boolean;
    permissionStatus: 'granted' | 'denied' | 'prompt' | 'unsupported';
  };
}

export interface SearchQueryParams {
  fromLocation: LocationHub | null;
  toLocation: LocationHub | null;
  cargoType: string;
  weightTons: number;
  truckType?: TruckType | 'Any' | '';
}

export type AppView = 
  | 'landing'
  | 'login'
  | 'home'
  | 'find_truck'
  | 'matching_results'
  | 'post_shipment'
  | 'my_shipments'
  | 'track_shipment'
  | 'find_freight'
  | 'my_trucks'
  | 'smart_insights'
  | 'profile'
  | 'notifications';
