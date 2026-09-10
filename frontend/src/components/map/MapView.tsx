import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { Truck } from '../../types';
import { CORRIDOR_CHENNAI_BENGALURU } from '../../services/mockData';

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const trackingMarkerRef = useRef<L.Marker | null>(null);

  const { 
    searchQuery, 
    matchingResults, 
    selectedMatch, 
    setSelectedMatch,
    activeView,
    activeTrackingShipment,
    setIsTruckDetailOpen
  } = useApp();

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = [13.04, 79.5]; // South India freight corridor center
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 8,
      zoomControl: false,
      attributionControl: true
    });

    // High tech dark themed tiles from CartoDB or OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | CollabFleet Intelligence',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom controls positioned at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers and Routes dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    const boundsPoints: [number, number][] = [];

    // Helper: Create custom HTML icons
    const createPinIcon = (label: string, colorClass: string, isDest: boolean = false) => {
      return L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute -top-1 w-7 h-7 rounded-full ${colorClass} opacity-30 animate-ping"></div>
            <div class="w-8 h-8 rounded-full ${colorClass} text-dark-950 flex items-center justify-center font-black text-xs shadow-lg border-2 border-white/80 z-10">
              ${isDest ? '●' : '▲'}
            </div>
            <div class="absolute -bottom-6 bg-dark-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10 shadow whitespace-nowrap z-20">
              ${label}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    const createTruckIcon = (truck: Truck, isSelected: boolean, matchScore?: number) => {
      return L.divIcon({
        className: 'custom-truck-marker',
        html: `
          <div class="relative flex flex-col items-center cursor-pointer group">
            ${isSelected ? '<div class="absolute -inset-2 rounded-full bg-brand-cyan/40 animate-ping"></div>' : ''}
            <div class="w-10 h-10 rounded-xl ${
              isSelected 
                ? 'bg-gradient-to-tr from-brand-cyan to-blue-500 shadow-glass-glow border-2 border-white scale-110' 
                : 'bg-dark-850/95 border border-white/20 shadow-lg hover:border-brand-cyan'
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
                isSelected ? 'border-brand-cyan text-brand-cyan' : 'border-white/10'
              } shadow-md whitespace-nowrap z-20">
                ${matchScore}% AI
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 24]
      });
    };

    // 1. Plot Pickup Location if selected
    if (searchQuery.fromLocation) {
      const coords = searchQuery.fromLocation.coordinates;
      boundsPoints.push(coords);
      const marker = L.marker(coords, {
        icon: createPinIcon(searchQuery.fromLocation.name, 'bg-brand-cyan', false)
      }).bindTooltip(`Pickup: ${searchQuery.fromLocation.name}`);
      markersLayer.addLayer(marker);
    }

    // 2. Plot Destination Location if selected
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
      
      // Draw path line with neon cyan glow
      const poly = L.polyline(route, {
        color: '#00F2FE',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        dashArray: '1, 8',
      }).addTo(markersLayer);

      const backgroundPoly = L.polyline(route, {
        color: '#0284C7',
        weight: 3,
        opacity: 0.4,
      }).addTo(markersLayer);

      routePolylineRef.current = poly;
      boundsPoints.push(...route);

      // Plot truck position
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
      trackingMarkerRef.current = liveTruckMarker;
    }
    // 4. In Matching / Search / Home View: Plot matched or candidate trucks
    else if (matchingResults.length > 0) {
      // Draw active selected truck route if available
      const activeRoute = selectedMatch?.truck.routePolyline || CORRIDOR_CHENNAI_BENGALURU;
      const poly = L.polyline(activeRoute, {
        color: '#00F2FE',
        weight: 4,
        opacity: 0.85,
        lineCap: 'round',
      }).addTo(markersLayer);
      routePolylineRef.current = poly;
      boundsPoints.push(...activeRoute);

      // Plot candidate trucks
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

    // Auto-fit map bounds
    if (boundsPoints.length > 1) {
      map.fitBounds(L.latLngBounds(boundsPoints), {
        padding: [80, 80],
        maxZoom: 12,
        animate: true,
        duration: 0.8
      });
    }
  }, [searchQuery, matchingResults, selectedMatch, activeView, activeTrackingShipment]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full dark-map"
      />

      {/* Subtle vignette gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark-950 via-transparent to-dark-950/40 opacity-80" />
    </div>
  );
};
