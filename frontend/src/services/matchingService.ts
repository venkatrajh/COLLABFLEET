import { FreightOpportunity, MatchResult, SearchQueryParams, Truck } from '../types';
import { ApiClient } from './apiClient';
import { 
  CORRIDOR_CHENNAI_BENGALURU, 
  CORRIDOR_CHENNAI_HYDERABAD, 
  CORRIDOR_BENGALURU_COIMBATORE,
  CORRIDOR_MUMBAI_PUNE,
  CORRIDOR_PUNE_BENGALURU,
  CORRIDOR_BENGALURU_HYDERABAD,
  CORRIDOR_COIMBATORE_KOCHI
} from './mockData';
import { TruckService } from './truckService';

/**
 * Approximate geographical distance between two coordinate pairs (in km)
 */
function calculateHaversineDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export class MatchingService {
  /**
   * Find matching trucks for a shipment query
   * AI-powered multi-factor dynamic scoring engine with explainability
   */
  public static async findMatchingTrucks(query: SearchQueryParams): Promise<MatchResult[]> {
    return ApiClient.executeWithFallback<MatchResult[]>(
      '/matching/recommendations',
      {
        method: 'POST',
        body: JSON.stringify(query)
      },
      () => this.calculateMockMatches(query)
    );
  }

  /**
   * Bidirectional Freight Matching Engine:
   * Finds the best freight opportunities for a given fleet owner's truck
   * Uses weighted multi-factor intelligence:
   * - Capacity Fit (25%)
   * - Route Match (25%)
   * - Proximity (15%)
   * - Earnings (10%)
   * - Reliability (10%)
   * - Return Trip (15%)
   */
  public static async findFreightForTruck(truck: Truck, customOpportunities?: FreightOpportunity[]): Promise<FreightOpportunity[]> {
    return ApiClient.executeWithFallback<FreightOpportunity[]>(
      `/matching/freight-for-truck/${truck.id}`,
      { method: 'GET' },
      () => this.calculateFreightMatchesForTruck(truck, customOpportunities)
    );
  }

  private static async calculateFreightMatchesForTruck(
    truck: Truck,
    customOpportunities?: FreightOpportunity[]
  ): Promise<FreightOpportunity[]> {
    // If truck is marked offline, it cannot receive new matching opportunities
    if (!truck.isAvailable) {
      return [];
    }

    const allOpportunities = customOpportunities || await TruckService.getFreightOpportunities();
    const truckCoords = truck.currentLocation.coordinates;
    const truckCity = (truck.currentLocation.city || truck.currentLocation.name).toLowerCase();
    const truckDestCity = (truck.currentDestination?.city || truck.currentDestination?.name || '').toLowerCase();
    const availableCap = truck.availableCapacityTons;

    // 1. FILTERING:
    // Exclude freight that strictly exceeds truck available capacity
    const eligible = allOpportunities.filter(f => f.weightTons <= availableCap);

    // Fallback if none fit strictly to prevent blank screen
    const candidateFreight = eligible.length > 0 
      ? eligible 
      : allOpportunities.filter(f => f.weightTons <= truck.totalCapacityTons);

    // 2. SCORING EACH CANDIDATE:
    const scoredFreight: FreightOpportunity[] = candidateFreight.map(freight => {
      const freightOriginCoords = freight.fromLocation.coordinates;
      const freightDestCoords = freight.toLocation.coordinates;
      const fOriginCity = (freight.fromLocation.city || freight.fromLocation.name).toLowerCase();
      const fDestCity = (freight.toLocation.city || freight.toLocation.name).toLowerCase();

      // Proximity: Haversine distance from truck's current location to freight pickup hub
      const distanceToPickupKm = calculateHaversineDistanceKm(truckCoords, freightOriginCoords);
      const isSameCity = truckCity.includes(fOriginCity) || fOriginCity.includes(truckCity);
      const destinationMatches = truckDestCity && (truckDestCity.includes(fDestCity) || fDestCity.includes(truckDestCity));

      // Estimated freight road distance
      const freightDistanceKm = Math.max(30, Math.round(calculateHaversineDistanceKm(freightOriginCoords, freightDestCoords) * 1.25));

      // A. Capacity Fit Score (25%)
      let capacityFitScore = 80;
      if (freight.weightTons <= availableCap) {
        const utilRatio = freight.weightTons / availableCap;
        if (utilRatio >= 0.70) {
          capacityFitScore = 98;
        } else if (utilRatio >= 0.45) {
          capacityFitScore = 92;
        } else if (utilRatio >= 0.25) {
          capacityFitScore = 85;
        } else {
          capacityFitScore = 76;
        }
      } else {
        capacityFitScore = 50;
      }

      // Bonus if truck type fits needed type
      if (freight.truckTypeNeeded && freight.truckTypeNeeded === truck.truckType) {
        capacityFitScore = Math.min(100, capacityFitScore + 2);
      }

      // B. Route Match Score (25%)
      let routeMatchScore = 70;
      if (destinationMatches && isSameCity) {
        routeMatchScore = 98;
      } else if (destinationMatches) {
        routeMatchScore = 94;
      } else if (isSameCity) {
        routeMatchScore = 86;
      } else {
        routeMatchScore = 65;
      }

      // C. Proximity Score (15%)
      let distanceScore = 65;
      if (distanceToPickupKm <= 15) {
        distanceScore = 98;
      } else if (distanceToPickupKm <= 40) {
        distanceScore = 91;
      } else if (distanceToPickupKm <= 80) {
        distanceScore = 82;
      } else if (distanceToPickupKm <= 150) {
        distanceScore = 72;
      } else {
        distanceScore = 58;
      }

      // D. Earnings Potential (10%)
      const ratePerKm = freight.estimatedEarnings / freightDistanceKm;
      let earningsScore = 85;
      if (ratePerKm >= 28) {
        earningsScore = 98;
      } else if (ratePerKm >= 22) {
        earningsScore = 92;
      } else {
        earningsScore = 84;
      }

      // E. Reliability (10%)
      const reliabilityScore = Math.min(99, Math.round(80 + (freight.shipperRating - 4.0) * 19));

      // F. Return Trip Potential (15%)
      const isReturnTrip = Boolean(destinationMatches || (isSameCity && truck.currentDestination));
      const returnTripScore = isReturnTrip ? (destinationMatches ? 98 : 90) : 52;

      // Total Weighted Score (100%)
      const rawScore = 
        capacityFitScore * 0.25 +
        routeMatchScore * 0.25 +
        distanceScore * 0.15 +
        earningsScore * 0.10 +
        reliabilityScore * 0.10 +
        returnTripScore * 0.15;

      const matchScore = Math.min(99, Math.max(68, Math.round(rawScore)));

      // Economic & Environmental metrics
      const emptyKmSaved = isReturnTrip ? Math.round(freightDistanceKm * 0.24) : 18;
      const co2ReductionKg = Math.round(emptyKmSaved * 2.15);
      const savingsAmount = isReturnTrip ? Math.round(emptyKmSaved * 26 + 250) : 400;

      // Dynamic explainable natural-language explanation
      const utilPercent = Math.round((freight.weightTons / availableCap) * 100);
      let summaryReason = '';
      if (isReturnTrip && destinationMatches) {
        summaryReason = `Top return-trip match: This shipment utilizes ${utilPercent}% of your available capacity (${freight.weightTons}T of ${availableCap}T), picks up just ${distanceToPickupKm} km from your current hub in ${truck.currentLocation.city}, and eliminates ${emptyKmSaved} km of empty deadhead travel back to ${freight.toLocation.city}.`;
      } else if (isSameCity) {
        summaryReason = `Stationed just ${distanceToPickupKm} km from pickup in ${freight.fromLocation.name}. Offers high per-km revenue (₹${Math.round(ratePerKm)}/km) with a trusted shipper (${freight.shipperName} · ${freight.shipperRating}★).`;
      } else {
        summaryReason = `Balanced opportunity matching your ${truck.truckType} capacity (${freight.weightTons}T load) along the active ${freight.fromLocation.city} → ${freight.toLocation.city} corridor.`;
      }

      const bulletPoints: string[] = [
        `Capacity Utilization: ${freight.weightTons} tons utilizes ${utilPercent}% of your ${availableCap}T space`,
        `Proximity to Pickup: ${distanceToPickupKm} km from your truck in ${truck.currentLocation.name}`,
        `Corridor Transit: Directly connects ${freight.fromLocation.name} to ${freight.toLocation.name} (${freightDistanceKm} km)`,
        ...(isReturnTrip ? [
          `Backhaul Efficiency: Eliminates ${emptyKmSaved} km of empty deadhead travel`,
          `Estimated Return Savings: ₹${savingsAmount.toLocaleString('en-IN')} in operational costs`
        ] : [
          `High-Paying Cargo: ₹${Math.round(ratePerKm)} per highway kilometer`
        ]),
        `Verified Shipper: ${freight.shipperName} (${freight.shipperRating} ★ rating)`
      ];

      return {
        ...freight,
        matchScore,
        emptyKmSaved,
        co2ReductionKg,
        savingsAmount,
        isReturnTrip,
        routeMatchScore,
        explanation: {
          capacityFitScore,
          routeMatchScore,
          distanceScore,
          priceScore: earningsScore,
          driverReliabilityScore: reliabilityScore,
          returnTripScore,
          summaryReason,
          bulletPoints
        }
      };
    });

    // Sort descending by calculated matchScore
    return scoredFreight.sort((a, b) => b.matchScore - a.matchScore);
  }

  private static async calculateMockMatches(query: SearchQueryParams): Promise<MatchResult[]> {
    const fromCity = (query.fromLocation?.city || query.fromLocation?.name || 'Chennai').toLowerCase();
    const toCity = (query.toLocation?.city || query.toLocation?.name || 'Bengaluru').toLowerCase();
    const weightNeeded = query.weightTons || 8;
    const requestedTruckType = query.truckType;

    // Pick appropriate corridor polyline if available
    let routeCoords = CORRIDOR_CHENNAI_BENGALURU;
    if (
      (fromCity.includes('chennai') && toCity.includes('hyderabad')) ||
      (fromCity.includes('hyderabad') && toCity.includes('chennai'))
    ) {
      routeCoords = CORRIDOR_CHENNAI_HYDERABAD;
    } else if (
      (fromCity.includes('bengaluru') && toCity.includes('coimbatore')) ||
      (fromCity.includes('coimbatore') && toCity.includes('bengaluru'))
    ) {
      routeCoords = CORRIDOR_BENGALURU_COIMBATORE;
    } else if (
      (fromCity.includes('mumbai') && toCity.includes('pune')) ||
      (fromCity.includes('pune') && toCity.includes('mumbai'))
    ) {
      routeCoords = CORRIDOR_MUMBAI_PUNE;
    } else if (
      (fromCity.includes('pune') && toCity.includes('bengaluru')) ||
      (fromCity.includes('bengaluru') && toCity.includes('pune'))
    ) {
      routeCoords = CORRIDOR_PUNE_BENGALURU;
    } else if (
      (fromCity.includes('bengaluru') && toCity.includes('hyderabad')) ||
      (fromCity.includes('hyderabad') && toCity.includes('bengaluru'))
    ) {
      routeCoords = CORRIDOR_BENGALURU_HYDERABAD;
    } else if (
      (fromCity.includes('coimbatore') && toCity.includes('kochi')) ||
      (fromCity.includes('kochi') && toCity.includes('coimbatore'))
    ) {
      routeCoords = CORRIDOR_COIMBATORE_KOCHI;
    }

    // Origin-to-destination road distance estimation
    const originCoords = query.fromLocation?.coordinates || [13.0827, 80.2707];
    const destCoords = query.toLocation?.coordinates || [12.9716, 77.5946];
    const totalRoadDistanceKm = Math.max(35, Math.round(calculateHaversineDistanceKm(originCoords, destCoords) * 1.25));

    // Retrieve active pool from TruckService
    const allTrucks = await TruckService.getAllTrucks();

    // 1. FILTERING:
    // Only include trucks that:
    // - are available (isAvailable === true)
    // - have sufficient available capacity to carry the weight needed (availableCapacityTons >= weightNeeded)
    // If a specific truck type was requested, prioritize it, but do not necessarily hard-drop unless requested capacity doesn't fit
    const eligibleTrucks = allTrucks.filter(truck => {
      if (!truck.isAvailable) return false;
      if (truck.availableCapacityTons < weightNeeded) return false;
      return true;
    });

    // If no trucks fit strictly, fallback to trucks with at least 80% capacity or any available truck to avoid blank screen
    const candidateTrucks = eligibleTrucks.length > 0 
      ? eligibleTrucks 
      : allTrucks.filter(t => t.isAvailable);

    // 2. MULTI-FACTOR WEIGHTED EVALUATION:
    // Factors:
    // - Capacity Fit (25%): How well does load fit without excessive empty waste?
    // - Route Match (25%): Does the truck's destination/corridor align with toCity?
    // - Distance / Proximity to Pickup (15%): How close is the truck to the pickup location?
    // - Price Competitiveness (10%): Rate per km relative to market median
    // - Driver Reliability (10%): Driver star rating & completed trips
    // - Return Trip Potential (15%): Is the truck heading home/backhaul?
    const scoredMatches: MatchResult[] = candidateTrucks.map(truck => {
      const truckLocationCoords = truck.currentLocation.coordinates;
      const truckCity = (truck.currentLocation.city || truck.currentLocation.name).toLowerCase();
      const truckDestCity = (truck.currentDestination?.city || truck.currentDestination?.name || '').toLowerCase();

      // Proximity: Haversine distance from truck to pickup hub
      const distanceToPickupKm = calculateHaversineDistanceKm(truckLocationCoords, originCoords);
      const isSameCity = truckCity.includes(fromCity) || fromCity.includes(truckCity);

      // A. Capacity Fit Score (25%)
      // If availableCapacity matches weight closely (ratio 1.0 to 1.5), perfect score.
      // If truck is 32T for a 2T cargo, slight penalty for overkill.
      let capacityFitScore = 90;
      if (truck.availableCapacityTons >= weightNeeded) {
        const capacityUtilizationRatio = weightNeeded / truck.availableCapacityTons; // e.g. 8 / 8.5 = 0.94
        if (capacityUtilizationRatio >= 0.8) {
          capacityFitScore = 98;
        } else if (capacityUtilizationRatio >= 0.5) {
          capacityFitScore = 93;
        } else if (capacityUtilizationRatio >= 0.25) {
          capacityFitScore = 86;
        } else {
          capacityFitScore = 78;
        }
      } else {
        capacityFitScore = Math.max(40, Math.round((truck.availableCapacityTons / weightNeeded) * 80));
      }

      // Bonus if user requested a specific truck type and it matches
      if (requestedTruckType && requestedTruckType !== 'Any' && truck.truckType === requestedTruckType) {
        capacityFitScore = Math.min(100, capacityFitScore + 3);
      }

      // B. Route Match Score (25%)
      // High score if truck's destination is toCity or adjacent corridor
      let routeMatchScore = 70;
      const destinationMatches = truckDestCity.includes(toCity) || toCity.includes(truckDestCity);
      if (destinationMatches) {
        routeMatchScore = 96;
      } else if (isSameCity) {
        routeMatchScore = 84;
      } else {
        routeMatchScore = 65;
      }

      // C. Distance / Proximity Score (15%)
      let distanceScore = 70;
      if (distanceToPickupKm <= 15) {
        distanceScore = 97;
      } else if (distanceToPickupKm <= 40) {
        distanceScore = 90;
      } else if (distanceToPickupKm <= 80) {
        distanceScore = 82;
      } else if (distanceToPickupKm <= 150) {
        distanceScore = 74;
      } else {
        distanceScore = 60;
      }

      // D. Price Score (10%)
      // Standard benchmark is ~25 ₹/km
      const benchmarkPricePerKm = 25;
      let priceScore = 85;
      if (truck.pricePerKm <= 20) {
        priceScore = 98;
      } else if (truck.pricePerKm <= 25) {
        priceScore = 92;
      } else if (truck.pricePerKm <= 30) {
        priceScore = 86;
      } else {
        priceScore = 78;
      }

      // E. Driver Reliability Score (10%)
      // Rating: 4.7 to 5.0 scaled to 80-100, plus trips bonus
      const ratingRatio = Math.max(0, (truck.driver.rating - 4.0) / 1.0); // 0 to 1
      const driverReliabilityScore = Math.min(99, Math.round(80 + ratingRatio * 18 + Math.min(2, truck.driver.tripsCompleted / 400)));

      // F. Return Trip Potential (15%)
      // If truck's destination aligns with query dropoff or was traveling in return direction
      const isReturnTrip = destinationMatches || (isSameCity && truck.currentDestination !== undefined);
      const returnTripScore = isReturnTrip ? (destinationMatches ? 96 : 88) : 48;

      // Weighted Total Score Calculation (100% total)
      const rawMatchScore = 
        capacityFitScore * 0.25 +
        routeMatchScore * 0.25 +
        distanceScore * 0.15 +
        priceScore * 0.10 +
        driverReliabilityScore * 0.10 +
        returnTripScore * 0.15;

      const matchScore = Math.min(99, Math.max(65, Math.round(rawMatchScore)));
      const collaborationScore = Math.min(98, Math.max(60, Math.round(matchScore * 0.97)));

      // Economic & Ecological impact calculations
      const emptyKmSaved = isReturnTrip ? Math.round(totalRoadDistanceKm * 0.22) : 15;
      const savingsAmount = isReturnTrip ? Math.round(emptyKmSaved * 26 + 200) : 350;
      const co2ReductionKg = Math.round(emptyKmSaved * 2.15);

      // Estimated price based on road distance and truck per-km rate
      // 10% collaborative discount applied for shared backhaul
      const baseFare = Math.round(totalRoadDistanceKm * truck.pricePerKm * (isReturnTrip ? 0.90 : 1.0));
      const estimatedPrice = Math.round(baseFare / 100) * 100; // round to nearest 100

      // ETA estimation: distance to pickup / average speed 40km/h + 10 min handling
      const etaMinutes = Math.max(12, Math.round((distanceToPickupKm / 40) * 60 + 10));

      // Dynamic explainable natural-language explanation
      let summaryReason = '';
      if (isReturnTrip && destinationMatches) {
        summaryReason = `This ${truck.model} has ${truck.availableCapacityTons} tons of space and is already scheduled to return to ${query.toLocation?.name || 'Bengaluru'}, eliminating ${emptyKmSaved} km of empty driving.`;
      } else if (isSameCity) {
        summaryReason = `Stationed just ${distanceToPickupKm} km from pickup in ${query.fromLocation?.name || 'Chennai'} with ${truck.availableCapacityTons}T capacity and top driver reliability (${truck.driver.rating} ★).`;
      } else {
        summaryReason = `Strong capacity fit (${truck.availableCapacityTons}T available for your ${weightNeeded}T load) with direct highway connectivity along the corridor.`;
      }

      const bulletPoints: string[] = [
        `Capacity: ${truck.availableCapacityTons} tons available (fits your ${weightNeeded}T shipment)`,
        `Proximity: ${distanceToPickupKm} km from pickup (${etaMinutes} min arrival)`,
        `Route Alignment: Directly connects ${query.fromLocation?.name || 'Origin'} to ${query.toLocation?.name || 'Destination'}`,
        ...(isReturnTrip ? [
          `Backhaul Efficiency: Eliminates ${emptyKmSaved} km empty deadhead travel`,
          `Shared Corridor Discount: ₹${savingsAmount.toLocaleString('en-IN')} below spot rate`
        ] : [
          `Experienced Hauler: ${truck.driver.name} · ${truck.driver.tripsCompleted} trips completed`
        ]),
        `Fair Price: ₹${estimatedPrice.toLocaleString('en-IN')} (₹${truck.pricePerKm}/km)`
      ];

      return {
        truck: {
          ...truck,
          routePolyline: routeCoords
        },
        matchScore,
        collaborationScore,
        estimatedPrice,
        distanceKm: totalRoadDistanceKm,
        etaMinutes,
        isReturnTrip,
        emptyKmSaved,
        savingsAmount,
        co2ReductionKg,
        explanation: {
          capacityFitScore,
          routeMatchScore,
          distanceScore,
          priceScore,
          driverReliabilityScore,
          returnTripScore,
          summaryReason,
          bulletPoints
        }
      };
    });

    // Sort descending by calculated matchScore
    return scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
  }
}
