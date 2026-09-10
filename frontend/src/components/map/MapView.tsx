import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import { Truck } from '../../types';
import { INITIAL_TRUCKS, CORRIDOR_CHENNAI_BENGALURU } from '../../services/mockData';
import { Plus, Minus, Crosshair, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

export const MapView: React.FC = () => {
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
    isMapExpanded,
    toggleMapExpanded,
    showToast
  } = useApp();

  // Initialize Leaflet Map once with OpenStreetMap
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = [13.08, 80.27];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 6,
      zoomControl: false,
      attributionControl: true
    });

    // Standard OpenStreetMap Tile Layer (100% Free, NO API KEY)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
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

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Listen to mapCenterTrigger to flyTo or panTo
  useEffect(() => {
    if (!mapInstanceRef.current || !mapCenterTrigger) return;
    mapInstanceRef.current.flyTo(mapCenterTrigger.coords, mapCenterTrigger.zoom || 8, {
      duration: 1
    });
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

    // 1. Pickup Location
    if (searchQuery.fromLocation) {
      const coords = searchQuery.fromLocation.coordinates;
      boundsPoints.push(coords);
      const marker = L.marker(coords, {
        icon: createPinIcon(searchQuery.fromLocation.name, false)
      }).bindTooltip(`Pickup: ${searchQuery.fromLocation.name}`);
      markersLayer.addLayer(marker);
    }

    // 2. Destination Location
    if (searchQuery.toLocation) {
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

    // Auto-fit on matching results or tracking
    if (boundsPoints.length > 1 && (activeView === 'matching_results' || activeView === 'track_shipment')) {
      map.fitBounds(L.latLngBounds(boundsPoints), {
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          mapInstanceRef.current?.flyTo(userCoords, 12);
          showToast('Centered on your current location', 'info');
        },
        () => {
          // Graceful fallback to Chennai
          mapInstanceRef.current?.flyTo([13.0827, 80.2707], 10);
          showToast('Centered on Chennai Hub (Location permission denied)', 'info');
        }
      );
    } else {
      mapInstanceRef.current?.flyTo([13.0827, 80.2707], 10);
      showToast('Centered on Chennai Hub', 'info');
    }
  };

  const handleRecenter = () => {
    recenterMap([13.08, 80.27], 6);
    showToast('Map recentered to South India freight corridor', 'info');
  };

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      
      {/* Real Leaflet Map */}
      <div 
        ref={mapContainerRef} 
        className={`w-full h-full ${theme === 'dark' ? 'dark-map' : 'light-map'}`}
        style={{ height: '100vh', width: '100vw' }}
      />

      {/* Floating Map Controls (Right Side - Uber/Ola style) */}
      <div className="fixed right-4 sm:right-6 bottom-24 sm:bottom-10 z-30 flex flex-col items-center gap-2 pointer-events-auto">
        
        {/* Zoom In/Out Cluster */}
        <div className="flex flex-col rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-200 dark:border-neutral-800"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Current Location (Locate Me) */}
        <button
          onClick={handleLocateMe}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="My Location"
          aria-label="My location"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Recenter Corridor */}
        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Recenter Map"
          aria-label="Recenter map"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Expand / Minimize Map Toggle */}
        <button
          onClick={toggleMapExpanded}
          className={`w-10 h-10 rounded-2xl border shadow-xl flex items-center justify-center transition-colors ${
            isMapExpanded 
              ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
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
