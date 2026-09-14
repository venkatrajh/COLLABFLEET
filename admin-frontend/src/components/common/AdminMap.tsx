import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Truck, Shipment, LocationHub } from '../../types';
import { CORRIDOR_CHENNAI_BENGALURU, CORRIDOR_MUMBAI_PUNE, INDIAN_LOCATION_HUBS } from '../../services/mockData';

interface AdminMapProps {
  trucks?: Truck[];
  shipments?: Shipment[];
  onSelectTruck?: (truck: Truck) => void;
  onSelectShipment?: (shipment: Shipment) => void;
  height?: string;
  className?: string;
}

// Geographic Bounding Box for Indian Subcontinent - anchors focus to India while ensuring full tile coverage
const INDIA_BOUNDS = L.latLngBounds([1.0, 56.0], [42.0, 108.0]);
const INDIA_CENTER: [number, number] = [21.5, 78.96];

const isInsideIndia = (coords?: [number, number] | null): boolean => {
  if (!coords || !Array.isArray(coords) || coords.length !== 2) return false;
  const [lat, lng] = coords;
  return lat >= 6.0 && lat <= 38.0 && lng >= 67.0 && lng <= 98.0;
};

export const AdminMap: React.FC<AdminMapProps> = ({
  trucks = [],
  shipments = [],
  onSelectTruck,
  onSelectShipment,
  height = 'h-[440px]',
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on India geographic heartland with restricted bounds
    const map = L.map(mapContainerRef.current, {
      center: INDIA_CENTER,
      zoom: 5,
      minZoom: 5,
      maxZoom: 18,
      maxBounds: INDIA_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: false
    });

    // Standard OpenStreetMap Tile Layer - continuous coverage across entire container
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 5,
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors',
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    // Custom Zoom Control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

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

  // Update Markers & Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Major Freight Corridors (Subtle dark polylines)
    const corridorLine1 = L.polyline(CORRIDOR_CHENNAI_BENGALURU, {
      color: '#111111',
      weight: 3.5,
      opacity: 0.6,
      dashArray: '6, 6'
    }).addTo(layerGroup);
    corridorLine1.bindTooltip('NH-48 Freight Corridor (Chennai ⇄ Bengaluru)');

    const corridorLine2 = L.polyline(CORRIDOR_MUMBAI_PUNE, {
      color: '#111111',
      weight: 3.5,
      opacity: 0.6,
      dashArray: '6, 6'
    }).addTo(layerGroup);
    corridorLine2.bindTooltip('Mumbai ⇄ Pune Expressway Corridor');

    // 2. Plot Hub Markers
    (INDIAN_LOCATION_HUBS as LocationHub[]).slice(0, 8).forEach((hub: LocationHub) => {
      if (!isInsideIndia(hub.coordinates)) return;
      const hubIcon = L.divIcon({
        className: 'custom-hub-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: white;
            padding: 3px 8px;
            border-radius: 9999px;
            border: 1px solid #DEDDD8;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            font-size: 10px;
            font-weight: 800;
            color: #111111;
            white-space: nowrap;
          ">
            <span style="width: 6px; height: 6px; border-radius: 9999px; background: #111111;"></span>
            <span>${hub.city}</span>
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12]
      });

      L.marker(hub.coordinates, { icon: hubIcon })
        .bindTooltip(`Hub: ${hub.name} (${hub.hubType.toUpperCase()})`)
        .addTo(layerGroup);
    });

    // 3. Plot Truck Markers
    trucks.forEach(truck => {
      const coords = truck.currentLocation?.coordinates;
      if (!coords || !isInsideIndia(coords)) return;

      const isAvail = truck.isAvailable;
      const statusColor = isAvail ? '#10B981' : '#6B7280';

      const truckIcon = L.divIcon({
        className: 'custom-admin-truck-pin',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #111111;
            border: 2px solid white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18.5" r="2.5"/>
              <circle cx="7" cy="18.5" r="2.5"/>
            </svg>
            <span style="
              position: absolute;
              top: -3px;
              right: -3px;
              width: 9px;
              height: 9px;
              border-radius: 9999px;
              background: ${statusColor};
              border: 1.5px solid white;
            "></span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(coords, { icon: truckIcon }).addTo(layerGroup);
      marker.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px;">
          <strong>${truck.name}</strong> (${truck.truckType})<br/>
          <span>${truck.registrationNumber} · ${isAvail ? 'Available' : 'In Transit'}</span><br/>
          <span>Driver: ${truck.driver.name}</span>
        </div>
      `);

      marker.on('click', () => {
        onSelectTruck?.(truck);
      });
    });

  }, [trucks, shipments, onSelectTruck, onSelectShipment]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#E5E4DE] shadow-sm light-map ${height} ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
