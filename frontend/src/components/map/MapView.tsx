import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import { Truck } from '../../types';
import { INITIAL_TRUCKS, CORRIDOR_CHENNAI_BENGALURU } from '../../services/mockData';
import { Plus, Minus, Crosshair, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

// Geographic Bounding Box for Indian Subcontinent - anchors focus to India while ensuring full tile coverage
export const INDIA_BOUNDS = L.latLngBounds([1.0, 56.0], [42.0, 108.0]);
export const INDIA_CENTER: [number, number] = [21.5, 78.96];

export const isInsideIndia = (coords?: [number, number] | null): boolean => {
  if (!coords || !Array.isArray(coords) || coords.length !== 2) return false;
  const [lat, lng] = coords;
  return lat >= 6.0 && lat <= 38.0 && lng >= 67.0 && lng <= 98.0;
};

export const MapView: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const { 
    theme,
    searchQuery, 
    matchingResults, 
    selectedMatch, 
    setSelectedMatch,
    activeView,
    activeTrackingShipment,
    setIsTruckDetailOpen,
    mapCenterTrigger,
    recenterMap,
    userLocation,
    recenterOnUserLocation,
    isMapExpanded,
    toggleMapExpanded,
    showToast
  } = useApp();

  // Initialize Leaflet Map once with OpenStreetMap (Constrained to India)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: INDIA_CENTER,
      zoom: 5,
      minZoom: 5,
      maxZoom: 18,
      maxBounds: INDIA_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: true
    });

    // Standard OpenStreetMap Tile Layer - uninterrupted coverage across entire container
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 5,
      maxZoom: 18,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Invalidate size on mount to ensure full canvas coverage
    setTimeout(() => map.invalidateSize(), 150);
    setTimeout(() => map.invalidateSize(), 500);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size on theme switch and map expansion without recreating map instance
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    
    // Immediate and frame-delayed invalidation ensures tiles render cleanly after CSS filter/theme switch
    requestAnimationFrame(() => {
      map.invalidateSize({ animate: false });
    });

    const timer = setTimeout(() => {
      map.invalidateSize({ animate: false });
    }, 120);

    return () => clearTimeout(timer);
  }, [theme, isMapExpanded]);

  // Listen to mapCenterTrigger to flyTo or panTo (Guarded to India)
  useEffect(() => {
    if (!mapInstanceRef.current || !mapCenterTrigger) return;
    const { coords, zoom } = mapCenterTrigger;
    if (isInsideIndia(coords)) {
      mapInstanceRef.current.flyTo(coords, Math.max(4, Math.min(zoom || 8, 18)), {
        duration: 1
      });
    } else {
      mapInstanceRef.current.flyTo(INDIA_CENTER, 5, { duration: 1 });
    }
  }, [mapCenterTrigger]);

  // Update Markers, Route, and Telemetry dynamically
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
    const isDark = theme === 'dark';

    // Helper: Minimalist monochrome pin
    const createPinIcon = (label: string, isDest: boolean = false) => {
      return L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div class="relative flex flex-col items-center pointer-events-auto">
            <div class="w-7 h-7 rounded-full ${
              isDest 
                ? (isDark ? 'bg-white text-black border-2 border-black' : 'bg-black text-white border-2 border-white')
                : (isDark ? 'bg-neutral-200 text-black border-2 border-black' : 'bg-neutral-900 text-white border-2 border-white')
            } flex items-center justify-center font-bold text-xs shadow-lg">
              ${isDest ? 'B' : 'A'}
            </div>
            <div class="mt-1 px-2 py-0.5 rounded-md ${
              isDark ? 'bg-black/90 text-white border border-neutral-800' : 'bg-white/95 text-black border border-neutral-300'
            } text-[10px] font-bold shadow-md whitespace-nowrap">
              ${label}
            </div>
          </div>
        `,
        iconSize: [28, 46],
        iconAnchor: [14, 23]
      });
    };

    // Helper: Clean monochrome truck marker (Lucide truck SVG)
    const createTruckIcon = (truck: Truck, isSelected: boolean, matchScore?: number) => {
      const bgClass = isSelected
        ? (isDark ? 'bg-white text-black ring-4 ring-white/30 scale-110' : 'bg-black text-white ring-4 ring-black/20 scale-110')
        : (isDark ? 'bg-neutral-900 text-neutral-200 border border-neutral-700 hover:border-white' : 'bg-white text-neutral-800 border border-neutral-300 hover:border-black');

      return L.divIcon({
        className: 'custom-truck-marker',
        html: `
          <div class="relative flex flex-col items-center cursor-pointer group pointer-events-auto">
            <div class="w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center transition-all shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                <path d="M15 18H9"/>
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                <circle cx="17" cy="18" r="2"/>
                <circle cx="7" cy="18" r="2"/>
              </svg>
            </div>
            ${matchScore ? `
              <div class="mt-1 px-1.5 py-0.5 rounded ${
                isSelected 
                  ? (isDark ? 'bg-white text-black font-extrabold' : 'bg-black text-white font-extrabold')
                  : (isDark ? 'bg-black/90 text-white border border-neutral-800' : 'bg-white text-black border border-neutral-300')
              } text-[9px] font-bold shadow whitespace-nowrap">
                ${matchScore}% Match
              </div>
            ` : `
              <div class="mt-0.5 px-1 py-0.2 rounded ${
                isDark ? 'bg-black/85 text-neutral-300 border border-neutral-800' : 'bg-white/90 text-neutral-700 border border-neutral-300'
              } text-[8px] font-semibold whitespace-nowrap">
                ${truck.availableCapacityTons}T avail
              </div>
            `}
          </div>
        `,
        iconSize: [36, 46],
        iconAnchor: [18, 23]
      });
    };

    // 0. User Current GPS Location ("You are here" - Guarded to India)
    if (userLocation && isInsideIndia(userLocation)) {
      boundsPoints.push(userLocation);
      const userLocIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex flex-col items-center pointer-events-auto cursor-pointer">
            <div class="relative flex items-center justify-center">
              <span class="absolute w-6 h-6 rounded-full bg-black/20 dark:bg-white/20 animate-ping"></span>
              <div class="w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black border-2 border-white dark:border-black shadow-xl flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-white dark:bg-black"></div>
              </div>
            </div>
            <div class="mt-1 px-2 py-0.5 rounded-md bg-[#111111] text-white text-[9px] font-black shadow-lg whitespace-nowrap tracking-wide">
              You are here
            </div>
          </div>
        `,
        iconSize: [28, 38],
        iconAnchor: [14, 19]
      });

      const userMarker = L.marker(userLocation, { icon: userLocIcon }).bindPopup(`
        <div class="p-1 text-center font-sans text-xs">
          <div class="font-extrabold text-[#111111]">Your Current GPS Location</div>
          <div class="text-[10px] text-neutral-500 mt-0.5">${userLocation[0].toFixed(4)}° N, ${userLocation[1].toFixed(4)}° E</div>
        </div>
      `);
      markersLayer.addLayer(userMarker);
    }

    // 1. Pickup Location (Guarded to India)
    if (searchQuery.fromLocation && isInsideIndia(searchQuery.fromLocation.coordinates)) {
      const coords = searchQuery.fromLocation.coordinates;
      boundsPoints.push(coords);
      const marker = L.marker(coords, {
        icon: createPinIcon(searchQuery.fromLocation.name, false)
      }).bindTooltip(`Pickup: ${searchQuery.fromLocation.name}`);
      markersLayer.addLayer(marker);
    }

    // 2. Destination Location (Guarded to India)
    if (searchQuery.toLocation && isInsideIndia(searchQuery.toLocation.coordinates)) {
      const coords = searchQuery.toLocation.coordinates;
      boundsPoints.push(coords);
      const marker = L.marker(coords, {
        icon: createPinIcon(searchQuery.toLocation.name, true)
      }).bindTooltip(`Destination: ${searchQuery.toLocation.name}`);
      markersLayer.addLayer(marker);
    }

    // Route color based on theme
    const routeColor = isDark ? '#F5F5F5' : '#171717';

    // 3. In Tracking Mode: Draw live route and moving truck
    if (activeView === 'track_shipment' && activeTrackingShipment) {
      const route = activeTrackingShipment.truck?.routePolyline || CORRIDOR_CHENNAI_BENGALURU;
      
      const poly = L.polyline(route, {
        color: routeColor,
        weight: 4,
        opacity: 0.9,
        lineCap: 'round',
        dashArray: '3, 6'
      }).addTo(markersLayer);
      routePolylineRef.current = poly;
      boundsPoints.push(...route);

      // Live truck marker
      const livePos = activeTrackingShipment.currentTrackingPosition || route[Math.floor(route.length / 2)];
      const liveTruckMarker = L.marker(livePos, {
        icon: L.divIcon({
          className: 'live-tracking-marker pointer-events-auto',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="w-11 h-11 rounded-2xl ${
                isDark ? 'bg-white text-black ring-4 ring-white/30' : 'bg-black text-white ring-4 ring-black/20'
              } flex items-center justify-center shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                  <path d="M15 18H9"/>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                  <circle cx="17" cy="18" r="2"/>
                  <circle cx="7" cy="18" r="2"/>
                </svg>
              </div>
              <div class="mt-1 px-2 py-0.5 rounded-full ${
                isDark ? 'bg-black text-white border border-neutral-700' : 'bg-white text-black border border-neutral-300'
              } text-[9px] font-extrabold shadow-md whitespace-nowrap">
                In Transit · 58 km/h
              </div>
            </div>
          `,
          iconSize: [44, 50],
          iconAnchor: [22, 25]
        })
      });
      markersLayer.addLayer(liveTruckMarker);
    }
    // 4. In Matching Results View
    else if (activeView === 'matching_results' && matchingResults.length > 0) {
      const activeRoute = selectedMatch?.truck.routePolyline || CORRIDOR_CHENNAI_BENGALURU;
      
      const poly = L.polyline(activeRoute, {
        color: routeColor,
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
        if (!isInsideIndia(coords)) return;
        boundsPoints.push(coords);

        const marker = L.marker(coords, {
          icon: createTruckIcon(truck, isSelected, match.matchScore)
        });

        // Click popup similar to ride-booking app
        marker.bindPopup(`
          <div style="font-family: inherit; min-width: 170px; padding: 2px;">
            <div style="font-weight: 800; font-size: 13px; color: ${isDark ? '#fff' : '#000'};">
              ${truck.name}
            </div>
            <div style="font-size: 11px; color: ${isDark ? '#aaa' : '#666'}; margin-top: 2px;">
              ${truck.availableCapacityTons} tons available · ${match.etaMinutes} min away
            </div>
            <div style="font-weight: 800; font-size: 14px; margin-top: 6px; color: ${isDark ? '#fff' : '#000'};">
              ₹${match.estimatedPrice.toLocaleString('en-IN')}
              <span style="font-size: 10px; font-weight: bold; background: ${isDark ? '#333' : '#eee'}; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">
                ${match.matchScore}% Match
              </span>
            </div>
          </div>
        `, {
          className: isDark ? 'dark-leaflet-popup' : 'light-leaflet-popup'
        });

        marker.on('click', () => {
          setSelectedMatch(match);
        });

        markersLayer.addLayer(marker);
      });
    }
    // 5. Default Home / Search View
    else {
      const defaultRoute = CORRIDOR_CHENNAI_BENGALURU;
      const poly = L.polyline(defaultRoute, {
        color: routeColor,
        weight: 3.5,
        opacity: 0.85,
        lineCap: 'round'
      }).addTo(markersLayer);
      routePolylineRef.current = poly;
      boundsPoints.push(...defaultRoute);

      INITIAL_TRUCKS.forEach(truck => {
        const coords = truck.currentLocation.coordinates;
        if (!isInsideIndia(coords)) return;
        boundsPoints.push(coords);

        const isSelected = selectedMatch?.truck.id === truck.id;
        const marker = L.marker(coords, {
          icon: createTruckIcon(truck, isSelected)
        });

        marker.bindPopup(`
          <div style="font-family: inherit; min-width: 160px; padding: 2px;">
            <div style="font-weight: 800; font-size: 12px; color: ${isDark ? '#fff' : '#000'};">
              ${truck.name}
            </div>
            <div style="font-size: 11px; color: ${isDark ? '#aaa' : '#666'}; margin-top: 2px;">
              ${truck.availableCapacityTons} tons available · ${truck.currentLocation.name}
            </div>
            <div style="font-size: 11px; font-weight: 700; margin-top: 4px; color: ${isDark ? '#ddd' : '#333'};">
              Driver: ${truck.driver.name} (★ ${truck.driver.rating})
            </div>
          </div>
        `);

        marker.on('click', () => {
          const foundMatch = matchingResults.find(m => m.truck.id === truck.id);
          if (foundMatch) {
            setSelectedMatch(foundMatch);
          } else {
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
                  `Reliable driver: ${truck.driver.name} (★ ${truck.driver.rating})`,
                  `Return trip capability along key highway corridors`
                ]
              }
            });
          }
        });

        markersLayer.addLayer(marker);
      });
    }

    // Auto-fit on matching results or tracking (strictly inside India)
    const validBoundsPoints = boundsPoints.filter(isInsideIndia);
    if (validBoundsPoints.length > 1 && (activeView === 'matching_results' || activeView === 'track_shipment')) {
      map.fitBounds(L.latLngBounds(validBoundsPoints), {
        padding: [80, 80],
        maxZoom: 11,
        animate: true,
        duration: 0.5
      });
    }
  }, [theme, searchQuery, matchingResults, selectedMatch, activeView, activeTrackingShipment]);

  // Map Controls Handlers (Zoom in, Zoom out, Geolocation, Recenter)
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleLocateMe = () => {
    recenterOnUserLocation();
  };

  const handleRecenter = () => {
    recenterMap(INDIA_CENTER, 5);
    showToast('Map recentered to India freight network', 'info');
  };

  return (
    <div 
      className={`relative isolate z-0 w-full h-full min-h-[420px] overflow-hidden rounded-3xl border border-neutral-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.04)] bg-neutral-100 ${className}`}
      style={{ isolation: 'isolate' }}
    >
      
      {/* Real Leaflet Map */}
      <div 
        ref={mapContainerRef} 
        className={`w-full h-full min-h-[420px] ${theme === 'dark' ? 'dark-map' : 'light-map'}`}
      />

      {/* Floating Map Controls (Contained in bottom-right corner of map card) */}
      <div className="absolute right-3.5 bottom-3.5 sm:right-4 sm:bottom-4 z-[400] flex flex-col items-center gap-1.5 pointer-events-auto">
        
        {/* Zoom In/Out Cluster */}
        <div className="flex flex-col rounded-2xl bg-white border border-neutral-200/90 shadow-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors border-b border-neutral-200"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Current Location (Locate Me) */}
        <button
          onClick={handleLocateMe}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-neutral-200/90 shadow-md flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors"
          title="My Location"
          aria-label="My location"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Recenter Corridor */}
        <button
          onClick={handleRecenter}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-neutral-200/90 shadow-md flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors"
          title="Recenter Map"
          aria-label="Recenter map"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Expand / Minimize Map Toggle */}
        <button
          onClick={toggleMapExpanded}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border shadow-md flex items-center justify-center transition-colors ${
            isMapExpanded 
              ? 'bg-neutral-950 text-white border-neutral-950' 
              : 'bg-white border-neutral-200/90 text-neutral-800 hover:bg-neutral-100'
          }`}
          title={isMapExpanded ? "Restore UI Panels" : "Expand Map (Full View)"}
          aria-label="Expand or collapse map"
        >
          {isMapExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
};
