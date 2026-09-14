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
  },
  {
    id: 'loc-vizag-port',
    name: 'Visakhapatnam Port Hub',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    coordinates: [17.6868, 83.2185],
    hubType: 'port',
    landmark: 'Harbour Multi-Modal Terminal'
  },
  {
    id: 'loc-ahmedabad-main',
    name: 'Ahmedabad Industrial Cluster',
    city: 'Ahmedabad',
    state: 'Gujarat',
    coordinates: [23.0225, 72.5714],
    hubType: 'city',
    landmark: 'Sanand Industrial Express Gate'
  },
  {
    id: 'loc-delhi-ncr',
    name: 'Delhi NCR Freight Hub',
    city: 'Delhi',
    state: 'Delhi',
    coordinates: [28.6139, 77.2090],
    hubType: 'city',
    landmark: 'Tughlakabad ICD Depot'
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

// Waypoint corridor for Mumbai to Pune (Mumbai-Pune Expressway)
export const CORRIDOR_MUMBAI_PUNE: [number, number][] = [
  [19.0760, 72.8777], // Mumbai
  [19.0330, 73.0297], // Navi Mumbai
  [18.9902, 73.1277], // Panvel
  [18.7557, 73.4091], // Lonavala
  [18.7100, 73.6800], // Talegaon
  [18.5204, 73.8567], // Pune
];

// Waypoint corridor for Pune to Bengaluru (NH48)
export const CORRIDOR_PUNE_BENGALURU: [number, number][] = [
  [18.5204, 73.8567], // Pune
  [17.6805, 74.0183], // Satara
  [16.8524, 74.5815], // Sangli / Kolhapur
  [15.8497, 74.4977], // Belagavi
  [15.3647, 75.1240], // Hubballi
  [14.4644, 75.9218], // Davanagere
  [13.3409, 77.1006], // Tumakuru
  [12.9716, 77.5946], // Bengaluru
];

// Waypoint corridor for Bengaluru to Hyderabad (NH44)
export const CORRIDOR_BENGALURU_HYDERABAD: [number, number][] = [
  [12.9716, 77.5946], // Bengaluru
  [13.3768, 77.7118], // Chikkaballapur
  [14.6819, 77.6006], // Anantapur
  [15.8281, 78.0373], // Kurnool
  [16.7488, 78.0035], // Mahbubnagar
  [17.3850, 78.4867], // Hyderabad
];

// Waypoint corridor for Coimbatore to Kochi (NH544)
export const CORRIDOR_COIMBATORE_KOCHI: [number, number][] = [
  [11.0168, 76.9558], // Coimbatore
  [10.7867, 76.6548], // Palakkad
  [10.5276, 76.2144], // Thrissur
  [10.1076, 76.3516], // Aluva
  [9.9312, 76.2673],  // Kochi
];

export const INITIAL_TRUCKS: Truck[] = [
  // --- CHENNAI <-> BENGALURU CORRIDOR (NH48) ---
  {
    id: 'truck-1',
    name: 'Ashok Leyland 1618',
    model: 'Ecomet 1618 Star',
    registrationNumber: 'TN 09 BX 4821',
    truckType: 'Heavy Truck',
    totalCapacityTons: 16,
    currentLoadTons: 6,
    availableCapacityTons: 10,
    currentLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-1',
      name: 'Rajesh Kumar',
      phone: '+91 98410 44291',
      rating: 4.88,
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
    currentLoadTons: 11,
    availableCapacityTons: 14,
    currentLocation: INDIAN_LOCATION_HUBS[1], // Chennai Port
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-3',
      name: 'Murugan S.',
      phone: '+91 94441 55678',
      rating: 4.81,
      tripsCompleted: 340,
      experienceYears: 9,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
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
    currentLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-4',
      name: 'Amit Sharma',
      phone: '+91 97910 88201',
      rating: 4.85,
      tripsCompleted: 275,
      experienceYears: 7,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
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
    truckType: 'Light Truck',
    totalCapacityTons: 7,
    currentLoadTons: 2,
    availableCapacityTons: 5,
    currentLocation: INDIAN_LOCATION_HUBS[2], // Chennai Airport
    currentDestination: INDIAN_LOCATION_HUBS[5], // Whitefield ICD
    driver: {
      id: 'drv-11',
      name: 'Pravin Nair',
      phone: '+91 98411 77203',
      rating: 4.79,
      tripsCompleted: 195,
      experienceYears: 5,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'FastTrack Air Cargo Feeder',
    pricePerKm: 18,
    isAvailable: true,
    activeMatchesCount: 2,
    routePolyline: CORRIDOR_CHENNAI_BENGALURU
  },
  {
    id: 'truck-6',
    name: 'Mahindra Bolero Maxi',
    model: 'Maxi Truck Plus',
    registrationNumber: 'TN 04 EE 9102',
    truckType: 'Mini Truck',
    totalCapacityTons: 2.5,
    currentLoadTons: 0.5,
    availableCapacityTons: 2,
    currentLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    currentDestination: INDIAN_LOCATION_HUBS[6], // Hosur
    driver: {
      id: 'drv-12',
      name: 'V. Sundaram',
      phone: '+91 94440 22910',
      rating: 4.84,
      tripsCompleted: 310,
      experienceYears: 6,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Express Feeder Line',
    pricePerKm: 14,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_CHENNAI_BENGALURU
  },
  {
    id: 'truck-7',
    name: 'Ashok Leyland Captain 2518',
    model: 'Captain Heavy Tipper',
    registrationNumber: 'KA 03 AA 4521',
    truckType: 'Heavy Truck',
    totalCapacityTons: 25,
    currentLoadTons: 11,
    availableCapacityTons: 14,
    currentLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    currentDestination: INDIAN_LOCATION_HUBS[0], // Chennai (Backhaul)
    driver: {
      id: 'drv-9',
      name: 'Manjunath Gowda',
      phone: '+91 98450 67890',
      rating: 4.87,
      tripsCompleted: 620,
      experienceYears: 13,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Karnataka Bulk Logistics',
    pricePerKm: 25,
    isAvailable: true,
    activeMatchesCount: 4,
    routePolyline: CORRIDOR_CHENNAI_BENGALURU
  },
  {
    id: 'truck-8',
    name: 'Tata Signa 4018.S',
    model: 'Signa Prime Mover',
    registrationNumber: 'KA 51 D 1994',
    truckType: 'Container Truck',
    totalCapacityTons: 32,
    currentLoadTons: 14,
    availableCapacityTons: 18,
    currentLocation: INDIAN_LOCATION_HUBS[5], // Whitefield ICD
    currentDestination: INDIAN_LOCATION_HUBS[1], // Chennai Port (Backhaul)
    driver: {
      id: 'drv-13',
      name: 'Hemanth Rao',
      phone: '+91 99801 34567',
      rating: 4.93,
      tripsCompleted: 710,
      experienceYears: 15,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Southern Portway Freight',
    pricePerKm: 34,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_CHENNAI_BENGALURU
  },

  // --- CHENNAI <-> HYDERABAD CORRIDOR (NH16 / NH65) ---
  {
    id: 'truck-9',
    name: 'Mahindra Blazo X 28',
    model: 'Blazo X Multi-Axle Hauler',
    registrationNumber: 'TS 09 UA 9940',
    truckType: 'Heavy Truck',
    totalCapacityTons: 28,
    currentLoadTons: 10,
    availableCapacityTons: 18,
    currentLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    currentDestination: INDIAN_LOCATION_HUBS[8], // Hyderabad
    driver: {
      id: 'drv-5',
      name: 'Gurpreet Singh',
      phone: '+91 98110 33491',
      rating: 4.96,
      tripsCompleted: 820,
      experienceYears: 16,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'TransIndia Fleetways',
    pricePerKm: 26,
    isAvailable: true,
    activeMatchesCount: 4,
    routePolyline: CORRIDOR_CHENNAI_HYDERABAD
  },
  {
    id: 'truck-10',
    name: 'Ashok Leyland 2820',
    model: '2820 Haulage Star',
    registrationNumber: 'AP 16 TG 7712',
    truckType: 'Heavy Truck',
    totalCapacityTons: 20,
    currentLoadTons: 6,
    availableCapacityTons: 14,
    currentLocation: INDIAN_LOCATION_HUBS[14], // Vijayawada
    currentDestination: INDIAN_LOCATION_HUBS[8], // Hyderabad
    driver: {
      id: 'drv-14',
      name: 'Srinivasa Rao',
      phone: '+91 98480 56789',
      rating: 4.86,
      tripsCompleted: 490,
      experienceYears: 10,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Krishna Delta Logistics',
    pricePerKm: 24,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_CHENNAI_HYDERABAD
  },
  {
    id: 'truck-11',
    name: 'Tata Signa 2823',
    model: 'Signa 2823 Cargo',
    registrationNumber: 'TS 07 HK 2049',
    truckType: 'Heavy Truck',
    totalCapacityTons: 22,
    currentLoadTons: 5,
    availableCapacityTons: 17,
    currentLocation: INDIAN_LOCATION_HUBS[8], // Hyderabad
    currentDestination: INDIAN_LOCATION_HUBS[0], // Chennai
    driver: {
      id: 'drv-15',
      name: 'Mohammed Azhar',
      phone: '+91 97000 88210',
      rating: 4.89,
      tripsCompleted: 530,
      experienceYears: 12,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Deccan Express Cargo',
    pricePerKm: 25,
    isAvailable: true,
    activeMatchesCount: 5,
    routePolyline: CORRIDOR_CHENNAI_HYDERABAD
  },
  {
    id: 'truck-12',
    name: 'Eicher Pro 2095XP',
    model: 'Pro 2095XP Light',
    registrationNumber: 'AP 39 Z 4419',
    truckType: 'Light Truck',
    totalCapacityTons: 6,
    currentLoadTons: 1.5,
    availableCapacityTons: 4.5,
    currentLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    currentDestination: INDIAN_LOCATION_HUBS[8], // Hyderabad
    driver: {
      id: 'drv-16',
      name: 'Babu Reddy',
      phone: '+91 99590 12390',
      rating: 4.77,
      tripsCompleted: 210,
      experienceYears: 6,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Rayalaseema Freightways',
    pricePerKm: 19,
    isAvailable: true,
    activeMatchesCount: 2,
    routePolyline: CORRIDOR_CHENNAI_HYDERABAD
  },

  // --- BENGALURU <-> COIMBATORE / SALEM CORRIDOR (NH44 / NH544) ---
  {
    id: 'truck-13',
    name: 'Tata Ultra T.16',
    model: 'Ultra Cargo Carrier',
    registrationNumber: 'TN 38 BL 8945',
    truckType: 'Medium Truck',
    totalCapacityTons: 16,
    currentLoadTons: 6,
    availableCapacityTons: 10,
    currentLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    currentDestination: INDIAN_LOCATION_HUBS[7], // Coimbatore
    driver: {
      id: 'drv-10',
      name: 'K. Palanisamy',
      phone: '+91 94432 78901',
      rating: 4.93,
      tripsCompleted: 480,
      experienceYears: 11,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Kongu Express Freight',
    pricePerKm: 22,
    isAvailable: true,
    activeMatchesCount: 4,
    routePolyline: CORRIDOR_BENGALURU_COIMBATORE
  },
  {
    id: 'truck-14',
    name: 'BharatBenz 1617R',
    model: 'Medium Cargo Carrier',
    registrationNumber: 'TN 30 AH 6231',
    truckType: 'Medium Truck',
    totalCapacityTons: 12,
    currentLoadTons: 4,
    availableCapacityTons: 8,
    currentLocation: INDIAN_LOCATION_HUBS[13], // Salem
    currentDestination: INDIAN_LOCATION_HUBS[7], // Coimbatore
    driver: {
      id: 'drv-17',
      name: 'M. Selvam',
      phone: '+91 98427 65432',
      rating: 4.88,
      tripsCompleted: 395,
      experienceYears: 9,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Salem Steel Corridors',
    pricePerKm: 21,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_BENGALURU_COIMBATORE
  },
  {
    id: 'truck-15',
    name: 'Ashok Leyland 1920',
    model: '1920 Twin Axle Hauler',
    registrationNumber: 'TN 37 CY 8801',
    truckType: 'Heavy Truck',
    totalCapacityTons: 18,
    currentLoadTons: 5,
    availableCapacityTons: 13,
    currentLocation: INDIAN_LOCATION_HUBS[7], // Coimbatore
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-18',
      name: 'R. Soundararajan',
      phone: '+91 94431 88902',
      rating: 4.91,
      tripsCompleted: 560,
      experienceYears: 13,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Coimbatore Textile Freight',
    pricePerKm: 23,
    isAvailable: true,
    activeMatchesCount: 4,
    routePolyline: CORRIDOR_BENGALURU_COIMBATORE
  },
  {
    id: 'truck-16',
    name: 'Tata Ace Gold',
    model: 'Ace Super Plus Mini',
    registrationNumber: 'TN 38 AA 1109',
    truckType: 'Mini Truck',
    totalCapacityTons: 2,
    currentLoadTons: 0.5,
    availableCapacityTons: 1.5,
    currentLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    currentDestination: INDIAN_LOCATION_HUBS[6], // Hosur
    driver: {
      id: 'drv-19',
      name: 'K. Venkatesh',
      phone: '+91 98442 33445',
      rating: 4.82,
      tripsCompleted: 280,
      experienceYears: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Garden City Logistics',
    pricePerKm: 13,
    isAvailable: true,
    activeMatchesCount: 2,
    routePolyline: CORRIDOR_BENGALURU_COIMBATORE
  },

  // --- MUMBAI <-> PUNE CORRIDOR (Expressway) ---
  {
    id: 'truck-17',
    name: 'Tata Signa 4825.TK',
    model: 'Signa Multi-Axle Hauler',
    registrationNumber: 'MH 12 QX 6610',
    truckType: 'Heavy Truck',
    totalCapacityTons: 30,
    currentLoadTons: 12,
    availableCapacityTons: 18,
    currentLocation: INDIAN_LOCATION_HUBS[9], // Mumbai
    currentDestination: INDIAN_LOCATION_HUBS[10], // Pune
    driver: {
      id: 'drv-6',
      name: 'Sachin Patil',
      phone: '+91 98220 54321',
      rating: 4.90,
      tripsCompleted: 510,
      experienceYears: 12,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Sahyadri Freight Lines',
    pricePerKm: 29,
    isAvailable: true,
    activeMatchesCount: 4,
    routePolyline: CORRIDOR_MUMBAI_PUNE
  },
  {
    id: 'truck-18',
    name: 'BharatBenz 1923C',
    model: 'Medium Cargo Carrier',
    registrationNumber: 'MH 14 TR 3302',
    truckType: 'Medium Truck',
    totalCapacityTons: 15,
    currentLoadTons: 5,
    availableCapacityTons: 10,
    currentLocation: INDIAN_LOCATION_HUBS[10], // Pune
    currentDestination: INDIAN_LOCATION_HUBS[9], // Mumbai
    driver: {
      id: 'drv-7',
      name: 'Ganesh Kadam',
      phone: '+91 99210 87654',
      rating: 4.84,
      tripsCompleted: 390,
      experienceYears: 8,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Western Express Cargo',
    pricePerKm: 23,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_MUMBAI_PUNE
  },
  {
    id: 'truck-19',
    name: 'Eicher Pro 3015',
    model: 'Pro 3015 Container',
    registrationNumber: 'MH 04 FK 8119',
    truckType: 'Container Truck',
    totalCapacityTons: 16,
    currentLoadTons: 6,
    availableCapacityTons: 10,
    currentLocation: INDIAN_LOCATION_HUBS[9], // Mumbai
    currentDestination: INDIAN_LOCATION_HUBS[10], // Pune
    driver: {
      id: 'drv-20',
      name: 'Ajay Shinde',
      phone: '+91 98200 44556',
      rating: 4.88,
      tripsCompleted: 440,
      experienceYears: 10,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Bhiwandi Hub Carriers',
    pricePerKm: 26,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_MUMBAI_PUNE
  },

  // --- PUNE <-> BENGALURU CORRIDOR (NH48) ---
  {
    id: 'truck-20',
    name: 'Ashok Leyland 2825',
    model: '2825 Multi-Axle Carrier',
    registrationNumber: 'MH 12 BN 9012',
    truckType: 'Heavy Truck',
    totalCapacityTons: 25,
    currentLoadTons: 9,
    availableCapacityTons: 16,
    currentLocation: INDIAN_LOCATION_HUBS[10], // Pune
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-21',
      name: 'Nitin Deshmukh',
      phone: '+91 98230 77123',
      rating: 4.92,
      tripsCompleted: 580,
      experienceYears: 14,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Deccan Highway Transporters',
    pricePerKm: 27,
    isAvailable: true,
    activeMatchesCount: 4,
    routePolyline: CORRIDOR_PUNE_BENGALURU
  },
  {
    id: 'truck-21',
    name: 'Tata Prima 3530.K',
    model: 'Prima Heavy Multi-Axle',
    registrationNumber: 'KA 22 M 5543',
    truckType: 'Heavy Truck',
    totalCapacityTons: 28,
    currentLoadTons: 10,
    availableCapacityTons: 18,
    currentLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    currentDestination: INDIAN_LOCATION_HUBS[10], // Pune
    driver: {
      id: 'drv-22',
      name: 'Sunil Patil',
      phone: '+91 98860 11998',
      rating: 4.87,
      tripsCompleted: 490,
      experienceYears: 11,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Belagavi Express Haulers',
    pricePerKm: 28,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_PUNE_BENGALURU
  },

  // --- BENGALURU <-> HYDERABAD CORRIDOR (NH44) ---
  {
    id: 'truck-22',
    name: 'BharatBenz 3523R',
    model: '3523R Rigid Truck',
    registrationNumber: 'TS 08 UB 4102',
    truckType: 'Heavy Truck',
    totalCapacityTons: 26,
    currentLoadTons: 8,
    availableCapacityTons: 18,
    currentLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    currentDestination: INDIAN_LOCATION_HUBS[8], // Hyderabad
    driver: {
      id: 'drv-23',
      name: 'Vijay Chary',
      phone: '+91 98490 22334',
      rating: 4.91,
      tripsCompleted: 640,
      experienceYears: 13,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Telangana Roadlines',
    pricePerKm: 26,
    isAvailable: true,
    activeMatchesCount: 4,
    routePolyline: CORRIDOR_BENGALURU_HYDERABAD
  },
  {
    id: 'truck-23',
    name: 'Eicher Pro 6037',
    model: 'Pro 6037 Heavy Duty',
    registrationNumber: 'KA 04 MP 3390',
    truckType: 'Heavy Truck',
    totalCapacityTons: 24,
    currentLoadTons: 9,
    availableCapacityTons: 15,
    currentLocation: INDIAN_LOCATION_HUBS[8], // Hyderabad
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-24',
      name: 'Raghavendra K.',
      phone: '+91 98450 99881',
      rating: 4.86,
      tripsCompleted: 420,
      experienceYears: 9,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Anantapur Transit Line',
    pricePerKm: 25,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_BENGALURU_HYDERABAD
  },

  // --- COIMBATORE <-> KOCHI / MADURAI (NH544 / NH44) ---
  {
    id: 'truck-24',
    name: 'Eicher Pro 6028',
    model: 'Pro 6028 Container',
    registrationNumber: 'KL 07 CD 9012',
    truckType: 'Container Truck',
    totalCapacityTons: 22,
    currentLoadTons: 8,
    availableCapacityTons: 14,
    currentLocation: INDIAN_LOCATION_HUBS[11], // Kochi
    currentDestination: INDIAN_LOCATION_HUBS[7], // Coimbatore
    driver: {
      id: 'drv-8',
      name: 'Mathew Thomas',
      phone: '+91 94470 12345',
      rating: 4.93,
      tripsCompleted: 440,
      experienceYears: 10,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Malabar Logistics Network',
    pricePerKm: 27,
    isAvailable: true,
    activeMatchesCount: 3,
    routePolyline: CORRIDOR_COIMBATORE_KOCHI
  },
  {
    id: 'truck-25',
    name: 'Tata Signa 2818.T',
    model: 'Signa Medium Hauler',
    registrationNumber: 'TN 58 AW 4018',
    truckType: 'Medium Truck',
    totalCapacityTons: 16,
    currentLoadTons: 5,
    availableCapacityTons: 11,
    currentLocation: INDIAN_LOCATION_HUBS[12], // Madurai
    currentDestination: INDIAN_LOCATION_HUBS[0], // Chennai
    driver: {
      id: 'drv-25',
      name: 'S. Muthuvel',
      phone: '+91 94420 66778',
      rating: 4.85,
      tripsCompleted: 380,
      experienceYears: 8,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    company: 'Pandian Express Cargo',
    pricePerKm: 22,
    isAvailable: true,
    activeMatchesCount: 2
  },
  {
    id: 'truck-26',
    name: 'BharatBenz 2823R',
    model: 'Heavy Haul 2823',
    registrationNumber: 'GJ 01 CZ 9102',
    truckType: 'Heavy Truck',
    totalCapacityTons: 18,
    currentLoadTons: 6,
    availableCapacityTons: 12,
    currentLocation: INDIAN_LOCATION_HUBS[16], // Ahmedabad
    currentDestination: INDIAN_LOCATION_HUBS[9], // Mumbai
    driver: {
      id: 'drv-26',
      name: 'Pravin Patel',
      phone: '+91 98250 11223',
      rating: 4.92,
      tripsCompleted: 510,
      experienceYears: 11
    },
    company: 'Gujarat Maritime Roadways',
    pricePerKm: 26,
    isAvailable: true,
    activeMatchesCount: 4
  },
  {
    id: 'truck-27',
    name: 'Tata Prima 3530.K',
    model: 'Prima Heavy Multi-Axle',
    registrationNumber: 'MH 04 EF 4421',
    truckType: 'Container Truck',
    totalCapacityTons: 24,
    currentLoadTons: 8,
    availableCapacityTons: 16,
    currentLocation: INDIAN_LOCATION_HUBS[9], // Mumbai
    currentDestination: INDIAN_LOCATION_HUBS[16], // Ahmedabad
    driver: {
      id: 'drv-27',
      name: 'Santosh Jadhav',
      phone: '+91 98200 44332',
      rating: 4.88,
      tripsCompleted: 420,
      experienceYears: 9
    },
    company: 'Konkan Intermodal Freight',
    pricePerKm: 29,
    isAvailable: true,
    activeMatchesCount: 3
  },
  {
    id: 'truck-28',
    name: 'Ashok Leyland 1920',
    model: 'Ecomet 1920',
    registrationNumber: 'DL 1G AB 7812',
    truckType: 'Medium Truck',
    totalCapacityTons: 12,
    currentLoadTons: 4.5,
    availableCapacityTons: 7.5,
    currentLocation: INDIAN_LOCATION_HUBS[17], // Delhi
    currentDestination: INDIAN_LOCATION_HUBS[9], // Mumbai
    driver: {
      id: 'drv-28',
      name: 'Harpreet Singh',
      phone: '+91 98110 55667',
      rating: 4.94,
      tripsCompleted: 590,
      experienceYears: 14
    },
    company: 'Northern Grand Trunk Logistics',
    pricePerKm: 23,
    isAvailable: true,
    activeMatchesCount: 4
  },
  {
    id: 'truck-29',
    name: 'Eicher Pro 2110',
    model: 'Pro Express 2110',
    registrationNumber: 'MH 12 PQ 5519',
    truckType: 'Light Truck',
    totalCapacityTons: 7.5,
    currentLoadTons: 2.5,
    availableCapacityTons: 5,
    currentLocation: INDIAN_LOCATION_HUBS[10], // Pune
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-29',
      name: 'Nitin Deshmukh',
      phone: '+91 98900 77889',
      rating: 4.87,
      tripsCompleted: 310,
      experienceYears: 7
    },
    company: 'Deccan Highway Lines',
    pricePerKm: 21,
    isAvailable: true,
    activeMatchesCount: 3
  },
  {
    id: 'truck-30',
    name: 'Mahindra Blazo X 28',
    model: 'Blazo Heavy Cargo',
    registrationNumber: 'AP 31 TT 9021',
    truckType: 'Heavy Truck',
    totalCapacityTons: 18,
    currentLoadTons: 4,
    availableCapacityTons: 14,
    currentLocation: INDIAN_LOCATION_HUBS[15], // Visakhapatnam
    currentDestination: INDIAN_LOCATION_HUBS[0], // Chennai
    driver: {
      id: 'drv-30',
      name: 'K. Satyanarayana',
      phone: '+91 98480 33445',
      rating: 4.91,
      tripsCompleted: 460,
      experienceYears: 10
    },
    company: 'Coastal Andhra Express',
    pricePerKm: 25,
    isAvailable: true,
    activeMatchesCount: 2
  },
  {
    id: 'truck-31',
    name: 'Tata Ultra T.16',
    model: 'Ultra Freight Hauler',
    registrationNumber: 'TS 08 FG 3310',
    truckType: 'Medium Truck',
    totalCapacityTons: 10,
    currentLoadTons: 3.2,
    availableCapacityTons: 6.8,
    currentLocation: INDIAN_LOCATION_HUBS[8], // Hyderabad
    currentDestination: INDIAN_LOCATION_HUBS[14], // Vijayawada
    driver: {
      id: 'drv-31',
      name: 'Mohd. Riaz',
      phone: '+91 98490 88776',
      rating: 4.86,
      tripsCompleted: 290,
      experienceYears: 6
    },
    company: 'Telangana Speed Freight',
    pricePerKm: 22,
    isAvailable: true,
    activeMatchesCount: 3
  },
  {
    id: 'truck-32',
    name: 'Eicher Pro 6028',
    model: 'Pro Heavy Rig',
    registrationNumber: 'AP 16 JK 8844',
    truckType: 'Heavy Truck',
    totalCapacityTons: 20,
    currentLoadTons: 5,
    availableCapacityTons: 15,
    currentLocation: INDIAN_LOCATION_HUBS[14], // Vijayawada
    currentDestination: INDIAN_LOCATION_HUBS[15], // Visakhapatnam
    driver: {
      id: 'drv-32',
      name: 'V. Ramanujam',
      phone: '+91 99890 22110',
      rating: 4.89,
      tripsCompleted: 350,
      experienceYears: 8
    },
    company: 'Krishna Valley Transporters',
    pricePerKm: 26,
    isAvailable: true,
    activeMatchesCount: 2
  },
  {
    id: 'truck-33',
    name: 'Ashok Leyland 4220',
    model: 'AVTR Multi-Axle 4220',
    registrationNumber: 'DL 3C MM 1120',
    truckType: 'Container Truck',
    totalCapacityTons: 28,
    currentLoadTons: 10,
    availableCapacityTons: 18,
    currentLocation: INDIAN_LOCATION_HUBS[17], // Delhi
    currentDestination: INDIAN_LOCATION_HUBS[16], // Ahmedabad
    driver: {
      id: 'drv-33',
      name: 'Joginder Singh',
      phone: '+91 98100 44556',
      rating: 4.96,
      tripsCompleted: 680,
      experienceYears: 16
    },
    company: 'National Corridor Haulers',
    pricePerKm: 31,
    isAvailable: true,
    activeMatchesCount: 5
  },
  {
    id: 'truck-34',
    name: 'Tata 407 Gold',
    model: 'SFC 407 City Feeder',
    registrationNumber: 'KA 51 DD 6612',
    truckType: 'Mini Truck',
    totalCapacityTons: 2.5,
    currentLoadTons: 0.7,
    availableCapacityTons: 1.8,
    currentLocation: INDIAN_LOCATION_HUBS[6], // Hosur
    currentDestination: INDIAN_LOCATION_HUBS[3], // Sriperumbudur
    driver: {
      id: 'drv-34',
      name: 'L. Manjunath',
      phone: '+91 98800 66778',
      rating: 4.82,
      tripsCompleted: 240,
      experienceYears: 5
    },
    company: 'Pennar Border Logistics',
    pricePerKm: 18,
    isAvailable: true,
    activeMatchesCount: 2
  },
  {
    id: 'truck-35',
    name: 'BharatBenz 1617R',
    model: 'Medium Cargo 1617',
    registrationNumber: 'TN 30 ZZ 4511',
    truckType: 'Medium Truck',
    totalCapacityTons: 11,
    currentLoadTons: 3,
    availableCapacityTons: 8,
    currentLocation: INDIAN_LOCATION_HUBS[13], // Salem
    currentDestination: INDIAN_LOCATION_HUBS[7], // Coimbatore
    driver: {
      id: 'drv-35',
      name: 'K. Saravanan',
      phone: '+91 94430 99887',
      rating: 4.9,
      tripsCompleted: 410,
      experienceYears: 9
    },
    company: 'Salem Steel Highway Carriers',
    pricePerKm: 23,
    isAvailable: true,
    activeMatchesCount: 3
  },
  {
    id: 'truck-36',
    name: 'Tata Signa 4825.TK',
    model: 'Signa 4825 Heavy Duty',
    registrationNumber: 'KL 07 BB 7788',
    truckType: 'Heavy Truck',
    totalCapacityTons: 22,
    currentLoadTons: 6,
    availableCapacityTons: 16,
    currentLocation: INDIAN_LOCATION_HUBS[11], // Kochi
    currentDestination: INDIAN_LOCATION_HUBS[12], // Madurai
    driver: {
      id: 'drv-36',
      name: 'Anish Varghese',
      phone: '+91 94460 33221',
      rating: 4.89,
      tripsCompleted: 360,
      experienceYears: 8
    },
    company: 'Periyar Valley Freight',
    pricePerKm: 27,
    isAvailable: true,
    activeMatchesCount: 2
  },
  {
    id: 'truck-37',
    name: 'Eicher Pro 3015',
    model: 'Pro 3015 Medium Carrier',
    registrationNumber: 'TN 59 CC 2341',
    truckType: 'Medium Truck',
    totalCapacityTons: 9.5,
    currentLoadTons: 3.5,
    availableCapacityTons: 6,
    currentLocation: INDIAN_LOCATION_HUBS[12], // Madurai
    currentDestination: INDIAN_LOCATION_HUBS[0], // Chennai
    driver: {
      id: 'drv-37',
      name: 'P. Alagarsamy',
      phone: '+91 94440 77665',
      rating: 4.86,
      tripsCompleted: 330,
      experienceYears: 7
    },
    company: 'Meenakshi Roadways',
    pricePerKm: 22,
    isAvailable: true,
    activeMatchesCount: 3
  },
  {
    id: 'truck-38',
    name: 'Ashok Leyland 2820',
    model: 'Boss 2820 Heavy Cargo',
    registrationNumber: 'KA 04 MN 9922',
    truckType: 'Heavy Truck',
    totalCapacityTons: 18,
    currentLoadTons: 4.5,
    availableCapacityTons: 13.5,
    currentLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    currentDestination: INDIAN_LOCATION_HUBS[8], // Hyderabad
    driver: {
      id: 'drv-38',
      name: 'Shivanna Gowda',
      phone: '+91 98450 11998',
      rating: 4.93,
      tripsCompleted: 520,
      experienceYears: 12
    },
    company: 'Bangalore-Hyderabad Intercity',
    pricePerKm: 25,
    isAvailable: true,
    activeMatchesCount: 4
  },
  {
    id: 'truck-39',
    name: 'Tata Ace Gold',
    model: 'Ace High Deck Mini',
    registrationNumber: 'TN 02 AA 1109',
    truckType: 'Mini Truck',
    totalCapacityTons: 1.2,
    currentLoadTons: 0.3,
    availableCapacityTons: 0.9,
    currentLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    currentDestination: INDIAN_LOCATION_HUBS[3], // Sriperumbudur
    driver: {
      id: 'drv-39',
      name: 'V. Elango',
      phone: '+91 98410 44556',
      rating: 4.79,
      tripsCompleted: 190,
      experienceYears: 4
    },
    company: 'Metro Feeder Freight',
    pricePerKm: 16,
    isAvailable: true,
    activeMatchesCount: 2
  },
  {
    id: 'truck-40',
    name: 'BharatBenz 3528CM',
    model: 'Heavy Container Tractor',
    registrationNumber: 'GJ 27 HK 4920',
    truckType: 'Container Truck',
    totalCapacityTons: 26,
    currentLoadTons: 7,
    availableCapacityTons: 19,
    currentLocation: INDIAN_LOCATION_HUBS[16], // Ahmedabad
    currentDestination: INDIAN_LOCATION_HUBS[10], // Pune
    driver: {
      id: 'drv-40',
      name: 'Jitendra Solanki',
      phone: '+91 98240 77889',
      rating: 4.91,
      tripsCompleted: 480,
      experienceYears: 11
    },
    company: 'Western Corridor Logistics',
    pricePerKm: 30,
    isAvailable: true,
    activeMatchesCount: 4
  },
  {
    id: 'truck-41',
    name: 'Mahindra Furio 14',
    model: 'Furio Express Cargo',
    registrationNumber: 'TS 07 LL 8192',
    truckType: 'Light Truck',
    totalCapacityTons: 8.5,
    currentLoadTons: 3,
    availableCapacityTons: 5.5,
    currentLocation: INDIAN_LOCATION_HUBS[8], // Hyderabad
    currentDestination: INDIAN_LOCATION_HUBS[4], // Bengaluru
    driver: {
      id: 'drv-41',
      name: 'D. Srinivas',
      phone: '+91 98499 55443',
      rating: 4.88,
      tripsCompleted: 340,
      experienceYears: 7
    },
    company: 'Deccan Transit Express',
    pricePerKm: 21,
    isAvailable: true,
    activeMatchesCount: 3
  },
  {
    id: 'truck-42',
    name: 'Eicher Pro 2049',
    model: 'City Pro Feeder',
    registrationNumber: 'MH 14 RR 3201',
    truckType: 'Mini Truck',
    totalCapacityTons: 3.2,
    currentLoadTons: 1,
    availableCapacityTons: 2.2,
    currentLocation: INDIAN_LOCATION_HUBS[10], // Pune
    currentDestination: INDIAN_LOCATION_HUBS[9], // Mumbai
    driver: {
      id: 'drv-42',
      name: 'Sachin Gaikwad',
      phone: '+91 98220 88990',
      rating: 4.83,
      tripsCompleted: 280,
      experienceYears: 6
    },
    company: 'Pune Expressway Cargo',
    pricePerKm: 19,
    isAvailable: true,
    activeMatchesCount: 2
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
    estimatedEarnings: 18400,
    matchScore: 96,
    emptyKmSaved: 67,
    routeMatchScore: 96,
    shipperName: 'Foxconn India Assembly',
    shipperRating: 4.9,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-2',
    shipmentId: 'SH-8842',
    fromLocation: INDIAN_LOCATION_HUBS[3], // Sriperumbudur
    toLocation: INDIAN_LOCATION_HUBS[6], // Hosur
    cargoType: 'Automotive Stamping Components',
    weightTons: 6.5,
    pickupTime: 'Today, 7:00 PM',
    estimatedEarnings: 12900,
    matchScore: 94,
    emptyKmSaved: 54,
    routeMatchScore: 92,
    shipperName: 'Hyundai Mobis Parts',
    shipperRating: 4.8,
    truckTypeNeeded: 'Medium Truck'
  },
  {
    id: 'freight-3',
    shipmentId: 'SH-8843',
    fromLocation: INDIAN_LOCATION_HUBS[1], // Chennai Port
    toLocation: INDIAN_LOCATION_HUBS[5], // Whitefield ICD Depot
    cargoType: 'Solar Inverters & Batteries',
    weightTons: 9,
    pickupTime: 'Tomorrow, 08:30 AM',
    estimatedEarnings: 19800,
    matchScore: 93,
    emptyKmSaved: 48,
    routeMatchScore: 90,
    shipperName: 'Schneider Electric Logistics',
    shipperRating: 4.7,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-4',
    shipmentId: 'SH-8844',
    fromLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    toLocation: INDIAN_LOCATION_HUBS[7], // Coimbatore
    cargoType: 'Textile Spun Yarn',
    weightTons: 5,
    pickupTime: 'Tomorrow, 11:00 AM',
    estimatedEarnings: 11700,
    matchScore: 91,
    emptyKmSaved: 42,
    routeMatchScore: 88,
    shipperName: 'Lakshmi Mills Group',
    shipperRating: 4.9,
    truckTypeNeeded: 'Light Truck'
  },
  {
    id: 'freight-5',
    shipmentId: 'SH-8845',
    fromLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    toLocation: INDIAN_LOCATION_HUBS[8], // Hyderabad
    cargoType: 'Pharmaceutical Equipment',
    weightTons: 12,
    pickupTime: 'Today, 9:00 PM',
    estimatedEarnings: 26500,
    matchScore: 95,
    emptyKmSaved: 85,
    routeMatchScore: 95,
    shipperName: 'Aurobindo Pharma Logistics',
    shipperRating: 4.9,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-6',
    shipmentId: 'SH-8846',
    fromLocation: INDIAN_LOCATION_HUBS[9], // Mumbai
    toLocation: INDIAN_LOCATION_HUBS[10], // Pune
    cargoType: 'FMCG Consumables & Beverages',
    weightTons: 10,
    pickupTime: 'Tomorrow, 06:00 AM',
    estimatedEarnings: 11400,
    matchScore: 92,
    emptyKmSaved: 38,
    routeMatchScore: 94,
    shipperName: 'Hindustan Unilever Bhiwandi',
    shipperRating: 4.8,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-7',
    shipmentId: 'SH-8847',
    fromLocation: INDIAN_LOCATION_HUBS[16], // Ahmedabad
    toLocation: INDIAN_LOCATION_HUBS[9], // Mumbai
    cargoType: 'Chemical Polymers & Resins',
    weightTons: 14,
    pickupTime: 'Today, 8:30 PM',
    estimatedEarnings: 29800,
    matchScore: 96,
    emptyKmSaved: 112,
    routeMatchScore: 97,
    shipperName: 'Reliance Polymers Sanand',
    shipperRating: 4.95,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-8',
    shipmentId: 'SH-8848',
    fromLocation: INDIAN_LOCATION_HUBS[10], // Pune
    toLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    cargoType: 'Precision Auto Transmission Gears',
    weightTons: 4.5,
    pickupTime: 'Tomorrow, 09:00 AM',
    estimatedEarnings: 18200,
    matchScore: 93,
    emptyKmSaved: 78,
    routeMatchScore: 93,
    shipperName: 'Bharat Forge Chakan',
    shipperRating: 4.85,
    truckTypeNeeded: 'Light Truck'
  },
  {
    id: 'freight-9',
    shipmentId: 'SH-8849',
    fromLocation: INDIAN_LOCATION_HUBS[11], // Kochi
    toLocation: INDIAN_LOCATION_HUBS[7], // Coimbatore
    cargoType: 'Export Seafood Frozen Cargo',
    weightTons: 12,
    pickupTime: 'Today, 10:00 PM',
    estimatedEarnings: 16800,
    matchScore: 94,
    emptyKmSaved: 56,
    routeMatchScore: 95,
    shipperName: 'Cochin Frozen Sea Foods Ltd',
    shipperRating: 4.9,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-10',
    shipmentId: 'SH-8850',
    fromLocation: INDIAN_LOCATION_HUBS[8], // Hyderabad
    toLocation: INDIAN_LOCATION_HUBS[14], // Vijayawada
    cargoType: 'Heavy Electrical Switchgear',
    weightTons: 15,
    pickupTime: 'Tomorrow, 07:00 AM',
    estimatedEarnings: 22400,
    matchScore: 95,
    emptyKmSaved: 68,
    routeMatchScore: 96,
    shipperName: 'BHEL Ramachandrapuram',
    shipperRating: 4.92,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-11',
    shipmentId: 'SH-8851',
    fromLocation: INDIAN_LOCATION_HUBS[15], // Visakhapatnam
    toLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    cargoType: 'Steel Coils & Industrial Billets',
    weightTons: 16,
    pickupTime: 'Today, 11:30 PM',
    estimatedEarnings: 34500,
    matchScore: 97,
    emptyKmSaved: 140,
    routeMatchScore: 98,
    shipperName: 'Rashtriya Ispat Nigam Ltd (Vizag Steel)',
    shipperRating: 4.95,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-12',
    shipmentId: 'SH-8852',
    fromLocation: INDIAN_LOCATION_HUBS[13], // Salem
    toLocation: INDIAN_LOCATION_HUBS[12], // Madurai
    cargoType: 'Packaged Agro Commodities',
    weightTons: 7,
    pickupTime: 'Tomorrow, 08:00 AM',
    estimatedEarnings: 12600,
    matchScore: 91,
    emptyKmSaved: 48,
    routeMatchScore: 92,
    shipperName: 'Cauvery Agro Trading',
    shipperRating: 4.8,
    truckTypeNeeded: 'Medium Truck'
  },
  {
    id: 'freight-13',
    shipmentId: 'SH-8853',
    fromLocation: INDIAN_LOCATION_HUBS[17], // Delhi
    toLocation: INDIAN_LOCATION_HUBS[9], // Mumbai
    cargoType: 'Telecommunication Server Racks',
    weightTons: 3.5,
    pickupTime: 'Tomorrow, 01:00 PM',
    estimatedEarnings: 28900,
    matchScore: 94,
    emptyKmSaved: 135,
    routeMatchScore: 95,
    shipperName: 'Bharti Airtel Telecom Infra',
    shipperRating: 4.9,
    truckTypeNeeded: 'Medium Truck'
  },
  {
    id: 'freight-14',
    shipmentId: 'SH-8854',
    fromLocation: INDIAN_LOCATION_HUBS[12], // Madurai
    toLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    cargoType: 'Automobile Radial Tires & Tubes',
    weightTons: 8,
    pickupTime: 'Today, 06:30 PM',
    estimatedEarnings: 19500,
    matchScore: 95,
    emptyKmSaved: 88,
    routeMatchScore: 96,
    shipperName: 'TVS Srichakra Tyres',
    shipperRating: 4.91,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-15',
    shipmentId: 'SH-8855',
    fromLocation: INDIAN_LOCATION_HUBS[8], // Hyderabad
    toLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    cargoType: 'Aerospace & Avionics Modules',
    weightTons: 2.8,
    pickupTime: 'Tomorrow, 10:30 AM',
    estimatedEarnings: 17800,
    matchScore: 92,
    emptyKmSaved: 62,
    routeMatchScore: 94,
    shipperName: 'Tata Advanced Systems Hyderabad',
    shipperRating: 4.95,
    truckTypeNeeded: 'Light Truck'
  },
  {
    id: 'freight-16',
    shipmentId: 'SH-8856',
    fromLocation: INDIAN_LOCATION_HUBS[7], // Coimbatore
    toLocation: INDIAN_LOCATION_HUBS[11], // Kochi
    cargoType: 'Organic Arabica Coffee & Green Pepper',
    weightTons: 4,
    pickupTime: 'Tomorrow, 07:30 AM',
    estimatedEarnings: 9800,
    matchScore: 90,
    emptyKmSaved: 44,
    routeMatchScore: 91,
    shipperName: 'Nilgiri Plantations Exporters',
    shipperRating: 4.85,
    truckTypeNeeded: 'Light Truck'
  },
  {
    id: 'freight-17',
    shipmentId: 'SH-8857',
    fromLocation: INDIAN_LOCATION_HUBS[7], // Coimbatore
    toLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    cargoType: 'Export Knitwear & Garments',
    weightTons: 6,
    pickupTime: 'Today, 09:00 PM',
    estimatedEarnings: 16200,
    matchScore: 94,
    emptyKmSaved: 74,
    routeMatchScore: 95,
    shipperName: 'Tirupur Exporters Guild',
    shipperRating: 4.92,
    truckTypeNeeded: 'Medium Truck'
  },
  {
    id: 'freight-18',
    shipmentId: 'SH-8858',
    fromLocation: INDIAN_LOCATION_HUBS[16], // Ahmedabad
    toLocation: INDIAN_LOCATION_HUBS[17], // Delhi
    cargoType: 'Solar Photovoltaic Cell Modules',
    weightTons: 11,
    pickupTime: 'Tomorrow, 11:00 AM',
    estimatedEarnings: 31200,
    matchScore: 95,
    emptyKmSaved: 120,
    routeMatchScore: 96,
    shipperName: 'Adani Solar Manufacturing Mundra',
    shipperRating: 4.9,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-19',
    shipmentId: 'SH-8859',
    fromLocation: INDIAN_LOCATION_HUBS[9], // Mumbai
    toLocation: INDIAN_LOCATION_HUBS[16], // Ahmedabad
    cargoType: 'Industrial Lubricants & Petrochemicals',
    weightTons: 9.5,
    pickupTime: 'Today, 05:00 PM',
    estimatedEarnings: 21500,
    matchScore: 93,
    emptyKmSaved: 84,
    routeMatchScore: 94,
    shipperName: 'Castrol India Patalganga',
    shipperRating: 4.88,
    truckTypeNeeded: 'Medium Truck'
  },
  {
    id: 'freight-20',
    shipmentId: 'SH-8860',
    fromLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    toLocation: INDIAN_LOCATION_HUBS[0], // Chennai
    cargoType: 'Medical Diagnostic Devices & Sensors',
    weightTons: 7.5,
    pickupTime: 'Today, 06:00 PM',
    estimatedEarnings: 18500,
    matchScore: 96,
    emptyKmSaved: 68,
    routeMatchScore: 97,
    shipperName: 'Wipro GE Healthcare Whitefield',
    shipperRating: 4.96,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-21',
    shipmentId: 'SH-8861',
    fromLocation: INDIAN_LOCATION_HUBS[10], // Pune
    toLocation: INDIAN_LOCATION_HUBS[8], // Hyderabad
    cargoType: 'Earthmoving Equipment Heavy Spares',
    weightTons: 13,
    pickupTime: 'Tomorrow, 08:00 AM',
    estimatedEarnings: 27800,
    matchScore: 94,
    emptyKmSaved: 95,
    routeMatchScore: 95,
    shipperName: 'JCB India Pune Logistics',
    shipperRating: 4.9,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-22',
    shipmentId: 'SH-8862',
    fromLocation: INDIAN_LOCATION_HUBS[16], // Ahmedabad
    toLocation: INDIAN_LOCATION_HUBS[10], // Pune
    cargoType: 'Vitrified Ceramic Tiles & Sanitaryware',
    weightTons: 14,
    pickupTime: 'Today, 10:30 PM',
    estimatedEarnings: 28400,
    matchScore: 95,
    emptyKmSaved: 104,
    routeMatchScore: 96,
    shipperName: 'Somany Ceramics Morbi Hub',
    shipperRating: 4.87,
    truckTypeNeeded: 'Heavy Truck'
  },
  {
    id: 'freight-23',
    shipmentId: 'SH-8863',
    fromLocation: INDIAN_LOCATION_HUBS[14], // Vijayawada
    toLocation: INDIAN_LOCATION_HUBS[8], // Hyderabad
    cargoType: 'Refined Edible Oils & Food Packaging',
    weightTons: 8.2,
    pickupTime: 'Tomorrow, 06:30 AM',
    estimatedEarnings: 15400,
    matchScore: 92,
    emptyKmSaved: 58,
    routeMatchScore: 93,
    shipperName: 'Adani Wilmar Mangalagiri',
    shipperRating: 4.89,
    truckTypeNeeded: 'Medium Truck'
  },
  {
    id: 'freight-24',
    shipmentId: 'SH-8864',
    fromLocation: INDIAN_LOCATION_HUBS[6], // Hosur
    toLocation: INDIAN_LOCATION_HUBS[3], // Sriperumbudur
    cargoType: 'EV Battery Wire Harnesses',
    weightTons: 4.2,
    pickupTime: 'Today, 04:00 PM',
    estimatedEarnings: 11200,
    matchScore: 93,
    emptyKmSaved: 52,
    routeMatchScore: 94,
    shipperName: 'Ather Energy Hosur Plant',
    shipperRating: 4.94,
    truckTypeNeeded: 'Light Truck'
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
    progressPercentage: 42,
    messages: [
      {
        id: 'msg-init-1',
        bookingId: 'ship-101',
        senderRole: 'fleet_operator',
        senderName: 'Rajesh Kumar (Driver)',
        text: "Namaste! I have accepted your booking for Chennai → Bengaluru with our Ashok Leyland 1618.",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        read: true
      },
      {
        id: 'msg-init-2',
        bookingId: 'ship-101',
        senderRole: 'shipper',
        senderName: 'Nakul Venkatesh',
        text: "Thanks Rajesh! 8 tons of electronics are packed in Bay 4. What's your estimated arrival time?",
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        read: true
      },
      {
        id: 'msg-init-3',
        bookingId: 'ship-101',
        senderRole: 'fleet_operator',
        senderName: 'Rajesh Kumar (Driver)',
        text: "Arrived at Bay 4. Loading is underway, pallets are strapped securely.",
        timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
        read: true
      },
      {
        id: 'msg-init-4',
        bookingId: 'ship-101',
        senderRole: 'fleet_operator',
        senderName: 'Rajesh Kumar (Driver)',
        text: "Trip started! Cruising on NH48 past Ranipet. Reaching Bengaluru warehouse by 10:45 PM.",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        read: false
      }
    ]
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
    progressPercentage: 100,
    messages: [
      {
        id: 'msg-init-201',
        bookingId: 'ship-102',
        senderRole: 'fleet_operator',
        senderName: 'Venkatesh S (Driver)',
        text: "Booking accepted for Sriperumbudur → Hosur. Vehicle Tata Prima 2830.K ready.",
        timestamp: '2026-09-09T09:00:00Z',
        read: true
      },
      {
        id: 'msg-init-202',
        bookingId: 'ship-102',
        senderRole: 'shipper',
        senderName: 'Nakul Venkatesh',
        text: "Auto parts ready with customs gate pass. Please verify seal before dispatch.",
        timestamp: '2026-09-09T09:15:00Z',
        read: true
      },
      {
        id: 'msg-init-203',
        bookingId: 'ship-102',
        senderRole: 'fleet_operator',
        senderName: 'Venkatesh S (Driver)',
        text: "Seal verified #TL-9941. Shipment delivered safely at Hosur depot at 07:15 PM.",
        timestamp: '2026-09-09T19:20:00Z',
        read: true
      }
    ]
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
  },
  {
    id: 'ship-104',
    trackingNumber: 'CF-28419',
    fromLocation: INDIAN_LOCATION_HUBS[9], // Pune
    toLocation: INDIAN_LOCATION_HUBS[8], // Mumbai
    cargoType: 'Industrial Heavy Machinery',
    weightTons: 9.2,
    truckTypeNeeded: 'Heavy Truck',
    pickupDate: 'Sep 08, 2026',
    pickupTime: '09:30 AM',
    status: 'delivered',
    truck: INITIAL_TRUCKS[2],
    price: 11800,
    matchScore: 96,
    collaborationScore: 94,
    isReturnTrip: true,
    emptyKmSaved: 84,
    co2ReductionKg: 180,
    savingsAmount: 2600,
    createdAt: '2026-09-08T07:00:00Z',
    estimatedDeliveryTime: 'Delivered at 03:45 PM',
    progressPercentage: 100
  },
  {
    id: 'ship-105',
    trackingNumber: 'CF-67104',
    fromLocation: INDIAN_LOCATION_HUBS[7], // Hyderabad
    toLocation: INDIAN_LOCATION_HUBS[4], // Bengaluru
    cargoType: 'Solar Panels & Inverters',
    weightTons: 7.0,
    truckTypeNeeded: 'Heavy Truck',
    pickupDate: 'Sep 05, 2026',
    pickupTime: '06:00 AM',
    status: 'delivered',
    truck: INITIAL_TRUCKS[3],
    price: 16400,
    matchScore: 93,
    collaborationScore: 91,
    isReturnTrip: true,
    emptyKmSaved: 110,
    co2ReductionKg: 240,
    savingsAmount: 3200,
    createdAt: '2026-09-05T05:30:00Z',
    estimatedDeliveryTime: 'Delivered at 08:20 PM',
    progressPercentage: 100
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
  },
  settings: {
    notifications: {
      shipmentUpdates: true,
      newTruckMatches: true,
      bookingUpdates: true,
      deliveryUpdates: true,
      returnTripOpportunities: true,
      fleetOpportunities: true
    },
    privacy: {
      profileVisibility: true,
      showCompanyInfo: true,
      shareTracking: false
    },
    location: {
      locationServicesEnabled: true,
      permissionStatus: 'prompt'
    }
  }
};
