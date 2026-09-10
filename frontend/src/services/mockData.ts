import { LocationHub, Truck, FreightOpportunity, Shipment, UserProfile } from '../types';

export const INDIAN_LOCATION_HUBS: LocationHub[] = [
  {
    id: 'loc-chennai-main',
    name: 'Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: [13.0827, 80.2707],
    hubType: 'city',
    landmark: 'Central Freight Corridor'
  },
  {
    id: 'loc-chennai-port',
    name: 'Chennai Port Trust',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: [13.0900, 80.2980],
    hubType: 'port',
    landmark: 'Container Terminal 2'
  },
  {
    id: 'loc-chennai-airport',
    name: 'Chennai Air Cargo Complex',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: [12.9941, 80.1709],
    hubType: 'airport',
    landmark: 'Meenambakkam Cargo Wing'
  },
  {
    id: 'loc-sriperumbudur',
    name: 'Sriperumbudur Auto Hub',
    city: 'Kanchipuram',
    state: 'Tamil Nadu',
    coordinates: [12.9675, 79.9436],
    hubType: 'hub',
    landmark: 'SIPCOT Industrial Park'
  },
  {
    id: 'loc-bengaluru-main',
    name: 'Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    coordinates: [12.9716, 77.5946],
    hubType: 'city',
    landmark: 'Majestic Logistics Yard'
  },
  {
    id: 'loc-bengaluru-whitefield',
    name: 'Whitefield ICD Depot',
    city: 'Bengaluru',
    state: 'Karnataka',
    coordinates: [12.9698, 77.7499],
    hubType: 'hub',
    landmark: 'Container Corporation Terminal'
  },
  {
    id: 'loc-hosur',
    name: 'Hosur Logistics Terminal',
    city: 'Hosur',
    state: 'Tamil Nadu',
    coordinates: [12.7409, 77.8253],
    hubType: 'hub',
    landmark: 'NH48 Border Hub'
  },
  {
    id: 'loc-coimbatore-main',
    name: 'Coimbatore',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    coordinates: [11.0168, 76.9558],
    hubType: 'city',
    landmark: 'SIDCO Industrial Estate'
  },
  {
    id: 'loc-hyderabad-main',
    name: 'Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    coordinates: [17.3850, 78.4867],
    hubType: 'city',
    landmark: 'Sanathnagar Cargo Terminal'
  },
  {
    id: 'loc-mumbai-main',
    name: 'Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    coordinates: [19.0760, 72.8777],
    hubType: 'city',
    landmark: 'Bhiwandi Freight Hub'
  },
  {
    id: 'loc-pune-main',
    name: 'Pune',
    city: 'Pune',
    state: 'Maharashtra',
    coordinates: [18.5204, 73.8567],
    hubType: 'city',
    landmark: 'Chakan Auto Cluster'
  },
  {
    id: 'loc-kochi-main',
    name: 'Kochi (Cochin Port)',
    city: 'Kochi',
    state: 'Kerala',
    coordinates: [9.9312, 76.2673],
    hubType: 'port',
    landmark: 'Vallarpadam ICTT'
  },
  {
    id: 'loc-madurai-main',
    name: 'Madurai',
    city: 'Madurai',
    state: 'Tamil Nadu',
    coordinates: [9.9252, 78.1198],
    hubType: 'city',
    landmark: 'Kappalur Industrial Hub'
  },
  {
    id: 'loc-salem-main',
    name: 'Salem Junction Hub',
    city: 'Salem',
    state: 'Tamil Nadu',
    coordinates: [11.6643, 78.1460],
    hubType: 'hub',
    landmark: 'Steel Plant Logistics Gate'
  },
  {
    id: 'loc-vijayawada-main',
    name: 'Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    coordinates: [16.5062, 80.6480],
    hubType: 'city',
    landmark: 'Autonagar Logistics Complex'
  }
];

// High-fidelity waypoint corridor for Chennai to Bengaluru (NH48)
export const CORRIDOR_CHENNAI_BENGALURU: [number, number][] = [
  [13.0827, 80.2707], // Chennai Central
  [13.0489, 80.2084], // Koyambedu
  [13.0067, 80.1195], // Poonamallee
  [12.9675, 79.9436], // Sriperumbudur
  [12.9248, 79.5932], // Ranipet
  [12.9165, 79.1325], // Vellore bypass
  [12.7933, 78.7188], // Ambur
  [12.6789, 78.5398], // Vaniyambadi
  [12.5255, 78.2144], // Krishnagiri
  [12.7409, 77.8253], // Hosur
  [12.8452, 77.6602], // Electronic City
  [12.9172, 77.6228], // Silk Board
  [12.9716, 77.5946], // Bengaluru Center
];

// Waypoint corridor for Chennai to Hyderabad (NH16/NH65)
export const CORRIDOR_CHENNAI_HYDERABAD: [number, number][] = [
  [13.0827, 80.2707], // Chennai
  [13.3421, 80.1293], // Gummidipoondi
  [13.6288, 79.4192], // Tirupati bypass
  [14.4426, 79.9865], // Nellore
  [15.5057, 80.0499], // Ongole
  [16.5062, 80.6480], // Vijayawada
  [17.0005, 80.1000], // Suryapet
  [17.3850, 78.4867], // Hyderabad
];

// Waypoint corridor for Bengaluru to Coimbatore (NH44/NH544)
export const CORRIDOR_BENGALURU_COIMBATORE: [number, number][] = [
  [12.9716, 77.5946], // Bengaluru
  [12.7409, 77.8253], // Hosur
  [12.5255, 78.2144], // Krishnagiri
  [12.0621, 78.1568], // Dharmapuri
  [11.6643, 78.1460], // Salem
  [11.3410, 77.7172], // Erode bypass
  [11.1085, 77.3411], // Tiruppur
  [11.0168, 76.9558], // Coimbatore
];

export const INITIAL_TRUCKS: Truck[] = [
  {
    id: 'truck-1',
    name: 'Ashok Leyland 1618',
    model: 'Ecomet 1618 Star',
    registrationNumber: 'TN 09 BX 4821',
    truckType: 'Heavy Truck',
    totalCapacityTons: 16,
    currentLoadTons: 7.5,
    availableCapacityTons: 8.5,
    currentLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-1',
      name: 'Rajesh Kumar',
      phone: '+91 98410 44291',
      rating: 4.85,
      tripsCompleted: 438,
      experienceYears: 11,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Deccan Freight Logistics',
    pricePerKm: 24,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_CHENNAI_BENGALURU
  },
  {
    id: 'truck-2',
    name: 'Tata Prima 2830.K',
    model: 'Prima Heavy Hauler',
    registrationNumber: 'KA 01 MJ 8820',
    truckType: 'Heavy Truck',
    totalCapacityTons: 20,
    currentLoadTons: 8,
    availableCapacityTons: 12,
    currentLocation: INDIAN_LOCATION_HUBS[3], // Sriperumbudur
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-2',
      name: 'Vikram Singh',
      phone: '+91 98840 91234',
      rating: 4.92,
      tripsCompleted: 612,
      experienceYears: 14,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'BlueDart Express Line',
    pricePerKm: 28,
    isAvailable: true,
    activeMatchesCount: 5,
    routePolyline: CORRIDOR_CHENNAI_BENGALURU
  },
  {
    id: 'truck-3',
    name: 'BharatBenz 2823R',
    model: '2823R Multi-Axle Carrier',
    registrationNumber: 'TN 22 CZ 7339',
    truckType: 'Container Truck',
    totalCapacityTons: 25,
    currentLoadTons: 15,
    availableCapacityTons: 10,
    currentLocation: INDIAN_LOCATION_HUBS[1], // Chennai Port
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-3',
      name: 'Murugan S.',
      phone: '+91 94441 55678',
      rating: 4.79,
      tripsCompleted: 340,
      experienceYears: 9,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Coromandel Coastal Haulers',
    pricePerKm: 32,
    isAvailable: true,
    activeMatchesCount: 2,
    routePolyline: CORRIDOR_CHENNAI_BENGALURU
  },
  {
    id: 'truck-4',
    name: 'Eicher Pro 3019',
    model: 'Pro 3019 XP',
    registrationNumber: 'TN 37 DB 5112',
    truckType: 'Medium Truck',
    totalCapacityTons: 14,
    currentLoadTons: 8,
    availableCapacityTons: 6,
    currentLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    currentDestination: INDIAN_LOCATION_HUBS[7], // Coimbatore
    driver: {
      id: 'drv-4',
      name: 'Amit Sharma',
      phone: '+91 97910 88201',
      rating: 4.88,
      tripsCompleted: 275,
      experienceYears: 7,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
    },
    company: 'VRL Collaborative Express',
    pricePerKm: 21,
    isAvailable: true,
    activeMatchesCount: 4,
    routePolyline: CORRIDOR_CHENNAI_BENGALURU
  },
  {
    id: 'truck-5',
    name: 'Mahindra Blazo X 28',
    model: 'Blazo X Tipper-Carrier',
    registrationNumber: 'TS 09 UA 9940',
    truckType: 'Heavy Truck',
    totalCapacityTons: 28,
    currentLoadTons: 13,
    availableCapacityTons: 15,
    currentLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    currentDestination: INDIAN_LOCATION_HUBS[8], // Hyderabad
    driver: {
      id: 'drv-5',
      name: 'Gurpreet Singh',
      phone: '+91 98110 33491',
      rating: 4.95,
      tripsCompleted: 820,
      experienceYears: 16,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'TransIndia Fleetways',
    pricePerKm: 26,
    isAvailable: true,
    activeMatchesCount: 1,
    routePolyline: CORRIDOR_CHENNAI_HYDERABAD
  }
];

export const INITIAL_FREIGHT_OPPORTUNITIES: FreightOpportunity[] = [
  {
    id: 'freight-1',
    shipmentId: 'SH-8841',
    fromLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    toLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    cargoType: 'Industrial Electronics & Sensors',
    weightTons: 8,
    pickupTime: 'Today, 5:30 PM',
    estimatedEarnings: 8400,
    matchScore: 94,
    emptyKmSaved: 67,
    routeMatchScore: 96,
    shipperName: 'Foxconn India Assembly',
    shipperRating: 4.9
  },
  {
    id: 'freight-2',
    shipmentId: 'SH-8842',
    fromLocation: INDIAN_LOCATION_HUBS[3], // Sriperumbudur
    toLocation: INDIAN_LOCATION_HUBS[6], // Hosur
    cargoType: 'Automotive Stamping Components',
    weightTons: 6.5,
    pickupTime: 'Today, 7:00 PM',
    estimatedEarnings: 6900,
    matchScore: 91,
    emptyKmSaved: 54,
    routeMatchScore: 92,
    shipperName: 'Hyundai Mobis Parts',
    shipperRating: 4.8
  },
  {
    id: 'freight-3',
    shipmentId: 'SH-8843',
    fromLocation: INDIAN_LOCATION_HUBS[1], // Chennai Port
    toLocation: INDIAN_LOCATION_HUBS[5], // Whitefield ICD Depot
    cargoType: 'Solar Inverters & Batteries',
    weightTons: 9,
    pickupTime: 'Tomorrow, 08:30 AM',
    estimatedEarnings: 9800,
    matchScore: 89,
    emptyKmSaved: 48,
    routeMatchScore: 90,
    shipperName: 'Schneider Electric Logistics',
    shipperRating: 4.7
  },
  {
    id: 'freight-4',
    shipmentId: 'SH-8844',
    fromLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    toLocation: INDIAN_LOCATION_HUBS[7], // Coimbatore
    cargoType: 'Textile Spun Yarn',
    weightTons: 5,
    pickupTime: 'Tomorrow, 11:00 AM',
    estimatedEarnings: 5700,
    matchScore: 87,
    emptyKmSaved: 42,
    routeMatchScore: 88,
    shipperName: 'Lakshmi Mills Group',
    shipperRating: 4.9
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'ship-101',
    trackingNumber: 'CF-48291',
    fromLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    toLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    cargoType: 'Electronics Components',
    weightTons: 8,
    truckTypeNeeded: 'Heavy Truck',
    pickupDate: 'Today',
    pickupTime: '05:30 PM',
    specialRequirements: 'Temperature controlled, shock-resistant packing',
    status: 'in_transit',
    truck: INITIAL_TRUCKS[0],
    price: 8400,
    matchScore: 94,
    collaborationScore: 92,
    isReturnTrip: true,
    emptyKmSaved: 67,
    co2ReductionKg: 142,
    savingsAmount: 1850,
    createdAt: '2026-09-10T11:00:00Z',
    estimatedDeliveryTime: 'Tonight, 10:45 PM',
    currentTrackingPosition: [12.9248, 79.5932], // Near Ranipet
    progressPercentage: 42
  },
  {
    id: 'ship-102',
    trackingNumber: 'CF-39120',
    fromLocation: INDIAN_LOCATION_HUBS[3], // Sriperumbudur
    toLocation: INDIAN_LOCATION_HUBS[6], // Hosur
    cargoType: 'Auto Parts',
    weightTons: 5.5,
    truckTypeNeeded: 'Medium Truck',
    pickupDate: 'Yesterday',
    pickupTime: '02:00 PM',
    status: 'delivered',
    truck: INITIAL_TRUCKS[1],
    price: 6200,
    matchScore: 91,
    collaborationScore: 89,
    isReturnTrip: true,
    emptyKmSaved: 52,
    co2ReductionKg: 110,
    savingsAmount: 1400,
    createdAt: '2026-09-09T08:30:00Z',
    estimatedDeliveryTime: 'Delivered at 07:15 PM',
    progressPercentage: 100
  },
  {
    id: 'ship-103',
    trackingNumber: 'CF-51982',
    fromLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    toLocation: INDIAN_LOCATION_HUBS[7], // Coimbatore
    cargoType: 'Apparel & Garments',
    weightTons: 3.2,
    truckTypeNeeded: 'Light Truck',
    pickupDate: 'Tomorrow',
    pickupTime: '10:00 AM',
    status: 'confirmed',
    price: 4900,
    matchScore: 88,
    collaborationScore: 86,
    isReturnTrip: false,
    emptyKmSaved: 28,
    co2ReductionKg: 62,
    savingsAmount: 750,
    createdAt: '2026-09-10T09:15:00Z',
    estimatedDeliveryTime: 'Tomorrow, 04:30 PM',
    progressPercentage: 10
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-collab-1',
  name: 'Nakul Venkatesh',
  company: 'Apex Technologies Freight Co.',
  role: 'shipper',
  email: 'nakul@collabfleet.ai',
  phone: '+91 98401 23456',
  rating: 4.95,
  savedLocations: [
    INDIAN_LOCATION_HUBS[0],
    INDIAN_LOCATION_HUBS[4],
    INDIAN_LOCATION_HUBS[3],
    INDIAN_LOCATION_HUBS[7]
  ],
  stats: {
    emptyKmSaved: 1240,
    moneySaved: 32500,
    co2ReductionKg: 420,
    completedTrips: 18,
    activeShipments: 1
  }
};
