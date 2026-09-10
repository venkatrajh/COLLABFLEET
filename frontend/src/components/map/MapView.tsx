import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import { Truck } from '../../types';
import { INITIAL_TRUCKS, CORRIDOR_CHENNAI_BENGALURU } from '../../services/mockData';

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeGlowPolylineRef = useRef<L.Polyline | null>(null);

  const { 
    searchQuery, 
    matchingResults, 
    selectedMatch, 
    setSelectedMatch,
    activeView,
    activeTrackingShipment,
    setIsTruckDetailOpen
  } = useApp();

  // Initialize Leaflet Map once with standard OpenStreetMap tiles (100% Free, NO API KEY)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center around South India freight corridor (Latitude: 13.08, Longitude: 80.27, Zoom: 6)
    const initialCenter: [number, number] = [13.08, 80.27];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 6,
      zoomControl: false,
      attributionControl: true
    });

    // Standard OpenStreetMap Tile Layer - NO API KEY REQUIRED
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    // Zoom controls positioned at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Force size invalidation to ensure Leaflet renders full bounds immediately
    const timer1 = setTimeout(() => map.invalidateSize(), 100);
    const timer2 = setTimeout(() => map.invalidateSize(), 500);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers, Routes, and Telemetry dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    if (routeGlowPolylineRef.current) {
      routeGlowPolylineRef.current.remove();
      routeGlowPolylineRef.current = null;
    }

    const boundsPoints: [number, number][] = [];

    // Helper: Create custom HTML pin icon
    const createPinIcon = (label: string, colorClass: string, isDest: boolean = false) => {
      return L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div class="relative flex items-center justify-center pointer-events-auto">
            <div class="absolute -top-1 w-7 h-7 rounded-full ${colorClass} opacity-30 animate-ping"></div>
            <div class="w-8 h-8 rounded-full ${colorClass} text-dark-950 flex items-center justify-center font-black text-xs shadow-lg border-2 border-white/90 z-10">
              ${isDest ? '●' : '▲'}
            </div>
            <div class="absolute -bottom-6 bg-dark-900/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 shadow-xl whitespace-nowrap z-20">
              ${label}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    // Helper: Create custom truck icon
    const createTruckIcon = (truck: Truck, isSelected: boolean, matchScore?: number) => {
      return L.divIcon({
        className: 'custom-truck-marker',
        html: `
          <div class="relative flex flex-col items-center cursor-pointer group pointer-events-auto">
            ${isSelected ? '<div class="absolute -inset-2 rounded-full bg-brand-cyan/40 animate-ping"></div>' : ''}
            <div class="w-10 h-10 rounded-xl ${
              isSelected 
                ? 'bg-gradient-to-tr from-brand-cyan to-blue-500 shadow-glass-glow border-2 border-white scale-110' 
                : 'bg-dark-850/95 border border-white/30 shadow-lg hover:border-brand-cyan hover:scale-105'
            } flex items-center justify-center transition-all z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ${isSelected ? 'text-dark-950' : 'text-brand-cyan'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                <path d="M15 18H9"/>
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                <circle cx="17" cy="18" r="2"/>
                <circle cx="7" cy="18" r="2"/>
              </svg>
            </div>
            ${matchScore ? `
              <div class="mt-1 bg-dark-950/95 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border ${
                isSelected ? 'border-brand-cyan text-brand-cyan' : 'border-white/20'
              } shadow-md whitespace-nowrap z-20">
                ${matchScore}% AI
              </div>
            ` : `
              <div class="mt-0.5 bg-dark-950/90 text-slate-300 text-[9px] font-semibold px-1.5 py-0.2 rounded border border-white/10 whitespace-nowrap z-20">
                ${truck.availableCapacityTons}T avail
              </div>
            `}
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 24]
      });
    };

    // 1. Always Plot Pickup Location (default: Chennai)
    if (searchQuery.fromLocation) {
      const coords = searchQuery.fromLocation.coordinates;
      boundsPoints.push(coords);
      const marker = L.marker(coords, {
        icon: createPinIcon(searchQuery.fromLocation.name, 'bg-brand-cyan', false)
      }).bindTooltip(`Pickup: ${searchQuery.fromLocation.name}`);
      markersLayer.addLayer(marker);
    }

    // 2. Always Plot Destination Location (default: Bengaluru)
    if (searchQuery.toLocation) {
      const coords = searchQuery.toLocation.coordinates;
      boundsPoints.push(coords);
      const marker = L.marker(coords, {
        icon: createPinIcon(searchQuery.toLocation.name, 'bg-emerald-400', true)
      }).bindTooltip(`Destination: ${searchQuery.toLocation.name}`);
      markersLayer.addLayer(marker);
    }

    // 3. In Tracking Mode: Draw live route and animated moving truck
    if (activeView === 'track_shipment' && activeTrackingShipment) {
      const route = activeTrackingShipment.truck?.routePolyline || CORRIDOR_CHENNAI_BENGALURU;
      
      // Draw background glow and main route line
      const bgPoly = L.polyline(route, {
        color: '#0284C7',
        weight: 6,
        opacity: 0.5,
        lineCap: 'round'
      }).addTo(markersLayer);

      const poly = L.polyline(route, {
        color: '#00F2FE',
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        dashArray: '2, 8'
      }).addTo(markersLayer);

      routeGlowPolylineRef.current = bgPoly;
      routePolylineRef.current = poly;
      boundsPoints.push(...route);

      // Plot live moving truck position
      const livePos = activeTrackingShipment.currentTrackingPosition || route[Math.floor(route.length / 2)];
      const liveTruckMarker = L.marker(livePos, {
        icon: L.divIcon({
          className: 'live-tracking-marker',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="absolute -inset-3 rounded-full bg-brand-cyan/30 animate-ping"></div>
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-cyan to-blue-600 flex items-center justify-center text-dark-950 shadow-glass-glow border-2 border-white live-truck-glow z-20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                  <path d="M15 18H9"/>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                  <circle cx="17" cy="18" r="2"/>
                  <circle cx="7" cy="18" r="2"/>
                </svg>
              </div>
              <div class="mt-1 bg-dark-950/95 text-brand-cyan text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-brand-cyan/40 shadow-xl whitespace-nowrap z-30">
                IN TRANSIT · 58 km/h
              </div>
            </div>
          `,
          iconSize: [48, 54],
          iconAnchor: [24, 27]
        })
      });
      markersLayer.addLayer(liveTruckMarker);
    }
    // 4. In Matching Results View: Draw selected match route & matched trucks
    else if (activeView === 'matching_results' && matchingResults.length > 0) {
      const activeRoute = selectedMatch?.truck.routePolyline || CORRIDOR_CHENNAI_BENGALURU;
      
      const poly = L.polyline(activeRoute, {
        color: '#00F2FE',
        weight: 4,
        opacity: 0.9,
        lineCap: 'round'
      }).addTo(markersLayer);
      routePolylineRef.current = poly;
      boundsPoints.push(...activeRoute);

      matchingResults.forEach(match => {
        const truck = match.truck;
        const isSelected = selectedMatch?.truck.id === truck.id;
        const coords = truck.currentLocation.coordinates;
        boundsPoints.push(coords);

        const marker = L.marker(coords, {
          icon: createTruckIcon(truck, isSelected, match.matchScore)
        });

        marker.on('click', () => {
          setSelectedMatch(match);
          setIsTruckDetailOpen(true);
        });

        markersLayer.addLayer(marker);
      });
    }
    // 5. Default Home / Search / General View: Always show Chennai -> Bengaluru Route + Regional Demo Trucks
    else {
      // Draw visible corridor route between Chennai and Bengaluru
      const defaultRoute = CORRIDOR_CHENNAI_BENGALURU;
      const poly = L.polyline(defaultRoute, {
        color: '#00F2FE',
        weight: 4,
        opacity: 0.85,
        lineCap: 'round'
      }).addTo(markersLayer);
      routePolylineRef.current = poly;
      boundsPoints.push(...defaultRoute);

      // Plot all regional demo trucks across Chennai, Bengaluru, Coimbatore, Hyderabad, Mumbai, Pune, Kochi
      INITIAL_TRUCKS.forEach(truck => {
        const coords = truck.currentLocation.coordinates;
        boundsPoints.push(coords);

        const isSelected = selectedMatch?.truck.id === truck.id;
        const marker = L.marker(coords, {
          icon: createTruckIcon(truck, isSelected)
        });

        marker.on('click', () => {
          // If truck exists in matching results, select it; otherwise find or wrap it
          const foundMatch = matchingResults.find(m => m.truck.id === truck.id);
          if (foundMatch) {
            setSelectedMatch(foundMatch);
          } else {
            // Provide a mock match context so truck details open smoothly
            setSelectedMatch({
              truck,
              matchScore: 92,
              collaborationScore: 90,
              estimatedPrice: 8400,
              distanceKm: 346,
              etaMinutes: 20,
              isReturnTrip: true,
              emptyKmSaved: 67,
              savingsAmount: 1850,
              co2ReductionKg: 140,
              explanation: {
                capacityFitScore: 94,
                routeMatchScore: 92,
                distanceScore: 90,
                priceScore: 92,
                driverReliabilityScore: 94,
                returnTripScore: 95,
                summaryReason: `This ${truck.name} is stationed at ${truck.currentLocation.name} with ${truck.availableCapacityTons} tons available capacity.`,
                bulletPoints: [
                  `Capacity matches your requirements (${truck.availableCapacityTons} tons available)`,
                  `Stationed near ${truck.currentLocation.name}`,
                  `Reliable driver: ${truck.driver.name} (⭐ ${truck.driver.rating})`,
                  `Return trip capability along key highway corridors`
                ]
              }
            });
          }
          setIsTruckDetailOpen(true);
        });

        markersLayer.addLayer(marker);
      });
    }

    // Auto-fit map bounds when locations are set, or keep nice South India view
    if (boundsPoints.length > 1 && (activeView === 'matching_results' || activeView === 'track_shipment')) {
      map.fitBounds(L.latLngBounds(boundsPoints), {
        padding: [90, 90],
        maxZoom: 12,
        animate: true,
        duration: 0.6
      });
    }
  }, [searchQuery, matchingResults, selectedMatch, activeView, activeTrackingShipment]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-dark-950">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full dark-map"
        style={{ height: '100vh', width: '100vw' }}
      />

      {/* Subtle vignette gradient overlay that leaves map visible behind glass panels */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark-950/80 via-transparent to-dark-950/40 opacity-70" />
    </div>
  );
};
