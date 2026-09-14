import { LocationHub, Truck, Shipment } from '../types';

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

export const CORRIDOR_CHENNAI_BENGALURU: [number, number][] = [
  [13.0827, 80.2707],
  [13.0489, 80.2084],
  [13.0067, 80.1195],
  [12.9675, 79.9436],
  [12.9248, 79.5932],
  [12.9165, 79.1325],
  [12.7933, 78.7188],
  [12.6789, 78.5398],
  [12.5255, 78.2144],
  [12.7409, 77.8253],
  [12.8452, 77.6602],
  [12.9172, 77.6228],
  [12.9716, 77.5946],
];

export const CORRIDOR_MUMBAI_PUNE: [number, number][] = [
  [19.0760, 72.8777],
  [19.0330, 73.0297],
  [18.9902, 73.1277],
  [18.7557, 73.4091],
  [18.7100, 73.6800],
  [18.5204, 73.8567],
];

export const INITIAL_TRUCKS: Truck[] = [
  {
    id: 'truck-1',
    name: 'Ashok Leyland 1618',
    model: 'Ecomet 1618 Star',
    registrationNumber: 'TN 09 BX 4821',
    truckType: 'Heavy Truck',
    totalCapacityTons: 16,
    currentLoadTons: 6,
    availableCapacityTons: 10,
    currentLocation: INDIAN_LOCATION_HUBS[0],
    currentDestination: INDIAN_LOCATION_HUBS[4],
    driver: {
      id: 'drv-1',
      name: 'Rajesh Kumar',
      phone: '+91 98410 44291',
      rating: 4.88,
      tripsCompleted: 438,
      experienceYears: 11
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
    currentLocation: INDIAN_LOCATION_HUBS[3],
    currentDestination: INDIAN_LOCATION_HUBS[4],
    driver: {
      id: 'drv-2',
      name: 'Vikram Singh',
      phone: '+91 98840 91234',
      rating: 4.92,
      tripsCompleted: 612,
      experienceYears: 14
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
    currentLoadTons: 11,
    availableCapacityTons: 14,
    currentLocation: INDIAN_LOCATION_HUBS[1],
    currentDestination: INDIAN_LOCATION_HUBS[4],
    driver: {
      id: 'drv-3',
      name: 'Murugan S.',
      phone: '+91 94441 55678',
      rating: 4.81,
      tripsCompleted: 340,
      experienceYears: 9
    },
    company: 'Coromandel Coastal Haulers',
    pricePerKm: 31,
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
    currentLoadTons: 7,
    availableCapacityTons: 7,
    currentLocation: INDIAN_LOCATION_HUBS[0],
    currentDestination: INDIAN_LOCATION_HUBS[4],
    driver: {
      id: 'drv-4',
      name: 'Amit Sharma',
      phone: '+91 97910 88201',
      rating: 4.85,
      tripsCompleted: 275,
      experienceYears: 7
    },
    company: 'VRL Collaborative Express',
    pricePerKm: 22,
    isAvailable: true,
    activeMatchesCount: 4,
    routePolyline: CORRIDOR_CHENNAI_BENGALURU
  },
  {
    id: 'truck-5',
    name: 'Tata Ultra T.12',
    model: 'Ultra Cargo Carrier',
    registrationNumber: 'TN 10 CK 4410',
    truckType: 'Medium Truck',
    totalCapacityTons: 12,
    currentLoadTons: 4,
    availableCapacityTons: 8,
    currentLocation: INDIAN_LOCATION_HUBS[4],
    currentDestination: INDIAN_LOCATION_HUBS[7],
    driver: {
      id: 'drv-5',
      name: 'P. Arumugam',
      phone: '+91 98402 11984',
      rating: 4.79,
      tripsCompleted: 198,
      experienceYears: 6
    },
    company: 'Southern Express Logistics',
    pricePerKm: 20,
    isAvailable: true,
    activeMatchesCount: 3
  },
  {
    id: 'truck-6',
    name: 'Mahindra Blazo X 28',
    model: 'Blazo Heavy 28T',
    registrationNumber: 'MH 12 QW 9901',
    truckType: 'Heavy Truck',
    totalCapacityTons: 28,
    currentLoadTons: 18,
    availableCapacityTons: 10,
    currentLocation: INDIAN_LOCATION_HUBS[9],
    currentDestination: INDIAN_LOCATION_HUBS[10],
    driver: {
      id: 'drv-6',
      name: 'Santosh Jadhav',
      phone: '+91 98220 33412',
      rating: 4.91,
      tripsCompleted: 520,
      experienceYears: 13
    },
    company: 'Western Corridor Carriers',
    pricePerKm: 32,
    isAvailable: false,
    activeMatchesCount: 1,
    routePolyline: CORRIDOR_MUMBAI_PUNE
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'CF-8841',
    trackingNumber: 'CF-48291',
    fromLocation: INDIAN_LOCATION_HUBS[0],
    toLocation: INDIAN_LOCATION_HUBS[4],
    cargoType: 'Industrial Electronics & Sensor Kits',
    weightTons: 8,
    truckTypeNeeded: 'Heavy Truck',
    pickupDate: '2026-09-12',
    pickupTime: '10:30',
    specialRequirements: 'Fragile cargo, palletized handling',
    status: 'in_transit',
    truck: INITIAL_TRUCKS[0],
    price: 34500,
    matchScore: 96,
    collaborationScore: 94
  },
  {
    id: 'CF-8842',
    trackingNumber: 'CF-39120',
    fromLocation: INDIAN_LOCATION_HUBS[3],
    toLocation: INDIAN_LOCATION_HUBS[6],
    cargoType: 'Automotive Precision Stampings',
    weightTons: 6.5,
    truckTypeNeeded: 'Heavy Truck',
    pickupDate: '2026-09-12',
    pickupTime: '14:00',
    status: 'driver_assigned',
    truck: INITIAL_TRUCKS[1],
    price: 28200,
    matchScore: 94,
    collaborationScore: 92
  },
  {
    id: 'CF-8843',
    trackingNumber: 'CF-28419',
    fromLocation: INDIAN_LOCATION_HUBS[9],
    toLocation: INDIAN_LOCATION_HUBS[10],
    cargoType: 'FMCG Packaged Goods',
    weightTons: 10,
    truckTypeNeeded: 'Heavy Truck',
    pickupDate: '2026-09-11',
    pickupTime: '08:00',
    status: 'delivered',
    truck: INITIAL_TRUCKS[5],
    price: 19800,
    matchScore: 93,
    collaborationScore: 90
  },
  {
    id: 'CF-8844',
    trackingNumber: 'CF-67104',
    fromLocation: INDIAN_LOCATION_HUBS[4],
    toLocation: INDIAN_LOCATION_HUBS[7],
    cargoType: 'Textile Spun Yarn',
    weightTons: 5,
    truckTypeNeeded: 'Medium Truck',
    pickupDate: '2026-09-13',
    pickupTime: '09:00',
    status: 'confirmed',
    truck: INITIAL_TRUCKS[4],
    price: 21500,
    matchScore: 90,
    collaborationScore: 87
  }
];
