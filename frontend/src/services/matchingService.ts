import { LocationHub, MatchResult, SearchQueryParams, Truck } from '../types';
import { ApiClient } from './apiClient';
import { INITIAL_TRUCKS, CORRIDOR_CHENNAI_BENGALURU, CORRIDOR_CHENNAI_HYDERABAD, CORRIDOR_BENGALURU_COIMBATORE } from './mockData';

export class MatchingService {
  /**
   * Find matching trucks for a shipment query
   * AI-powered scoring with explainability breakdown
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

  private static calculateMockMatches(query: SearchQueryParams): MatchResult[] {
    const fromCity = query.fromLocation?.city.toLowerCase() || 'chennai';
    const toCity = query.toLocation?.city.toLowerCase() || 'bengaluru';
    const weightNeeded = query.weightTons || 8;

    // Pick appropriate corridor polyline if available
    let routeCoords = CORRIDOR_CHENNAI_BENGALURU;
    if (fromCity.includes('chennai') && toCity.includes('hyderabad')) {
      routeCoords = CORRIDOR_CHENNAI_HYDERABAD;
    } else if (fromCity.includes('bengaluru') && toCity.includes('coimbatore')) {
      routeCoords = CORRIDOR_BENGALURU_COIMBATORE;
    }

    return INITIAL_TRUCKS.map((truck, idx) => {
      // Truck 1 is our flagship 94% match
      const isTopMatch = idx === 0;
      const isReturnTrip = idx < 2; // top 2 are return trips
      
      const matchScore = isTopMatch ? 94 : idx === 1 ? 91 : idx === 2 ? 86 : idx === 3 ? 82 : 75;
      const collaborationScore = isTopMatch ? 92 : idx === 1 ? 89 : idx === 2 ? 84 : idx === 3 ? 80 : 72;
      
      const capacityScore = Math.min(99, Math.round(90 + (truck.availableCapacityTons / (weightNeeded || 8)) * 5));
      const routeScore = isTopMatch ? 91 : idx === 1 ? 94 : 85 - idx * 4;
      const distanceScore = isTopMatch ? 88 : 85 - idx * 3;
      const priceScore = isTopMatch ? 94 : 90 - idx * 3;
      const driverReliabilityScore = Math.round(truck.driver.rating * 19.5);
      const returnTripScore = isReturnTrip ? 96 : 45;

      const emptyKmSaved = isReturnTrip ? (idx === 0 ? 67 : 54) : 15;
      const savingsAmount = isReturnTrip ? (idx === 0 ? 1850 : 1400) : 400;
      const co2ReductionKg = Math.round(emptyKmSaved * 2.1);
      
      const distanceKm = 346 + idx * 12;
      const estimatedPrice = idx === 0 ? 8400 : Math.round(distanceKm * truck.pricePerKm * 0.95);
      const etaMinutes = 18 + idx * 14;

      const summaryReason = isReturnTrip 
        ? `This truck has ${truck.availableCapacityTons} tons of available space and is already travelling toward ${query.toLocation?.name || 'Bengaluru'}, making it a strong collaborative match.`
        : `This truck has ${truck.availableCapacityTons} tons of capacity and is stationed near ${query.fromLocation?.name || 'Chennai'} with an excellent driver rating.`;

      const bulletPoints = [
        `Capacity matches your shipment (${truck.availableCapacityTons} tons available for ${weightNeeded} tons)`,
        `Close to pickup (${etaMinutes} mins / ${(distanceKm * 0.04).toFixed(1)} km away)`,
        `Route aligns directly with destination (${query.toLocation?.name || 'Bengaluru'})`,
        ...(isReturnTrip ? [
          `Returning toward your destination — high backhaul compatibility`,
          `Low empty kilometres (${emptyKmSaved} km deadhead eliminated)`
        ] : []),
        `Reliable driver (${truck.driver.name} · ⭐ ${truck.driver.rating})`,
        `Competitive price (₹${estimatedPrice.toLocaleString('en-IN')})`
      ];

      return {
        truck: {
          ...truck,
          routePolyline: routeCoords
        },
        matchScore,
        collaborationScore,
        estimatedPrice,
        distanceKm,
        etaMinutes,
        isReturnTrip,
        emptyKmSaved,
        savingsAmount,
        co2ReductionKg,
        explanation: {
          capacityFitScore: capacityScore,
          routeMatchScore: routeScore,
          distanceScore,
          priceScore,
          driverReliabilityScore,
          returnTripScore,
          summaryReason,
          bulletPoints
        }
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }
}
