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

export type ShipmentStatus = 
  | 'confirmed'
  | 'driver_assigned'
  | 'going_to_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface Shipment {
  id: string;
  trackingNumber: string;
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
}
