import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminMap } from '../components/common/AdminMap';
import { DetailDrawer } from '../components/common/DetailDrawer';
import { AdminFleetService } from '../services/adminFleetService';
import { AdminShipmentService } from '../services/adminShipmentService';
import { AdminOperationsService } from '../services/adminOperationsService';
import { Truck, Shipment } from '../types';
import { LiveOperationEvent } from '../types/adminTypes';
import { 
  Navigation2, 
  Maximize2, 
  Minimize2, 
  MapPin, 
  Phone 
} from 'lucide-react';

export const AdminLiveOps: React.FC = () => {
  const { isWorkspaceMaximized, toggleWorkspaceMaximized } = useAdmin();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [events, setEvents] = useState<LiveOperationEvent[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'transit'>('all');
  const [showFeedOverlay, setShowFeedOverlay] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const [fleet, ship, opEvents] = await Promise.all([
        AdminFleetService.getFleet(),
        AdminShipmentService.getAllShipments(),
        AdminOperationsService.getRecentEvents()
      ]);
      setTrucks(fleet);
      setShipments(ship);
      setEvents(opEvents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTrucks = trucks.filter(t => {
    if (statusFilter === 'available') return t.isAvailable;
    if (statusFilter === 'transit') return !t.isAvailable;
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Live Ops Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E4DE] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
            <Navigation2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">
                Live Operations & Tactical Map
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live GPS
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              National dispatch radar · {filteredTrucks.length} Active commercial units tracked
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#E5E4DE] p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'all' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              All ({trucks.length})
            </button>
            <button
              onClick={() => setStatusFilter('transit')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'transit' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'available' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Available
            </button>
          </div>

          {/* Toggle Feed */}
          <button
            onClick={() => setShowFeedOverlay(!showFeedOverlay)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
              showFeedOverlay
                ? 'border-black bg-black text-white'
                : 'border-[#E5E4DE] bg-white text-neutral-700 hover:border-black'
            }`}
          >
            {showFeedOverlay ? 'Hide Stream' : 'Show Stream'}
          </button>

          {/* Maximize Workspace Button */}
          <button
            onClick={toggleWorkspaceMaximized}
            className="p-2 rounded-xl border border-[#E5E4DE] bg-white hover:border-black text-neutral-700 hover:text-black transition-colors"
            title={isWorkspaceMaximized ? 'Restore View' : 'Maximize Map Canvas'}
          >
            {isWorkspaceMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map First Canvas with Relative Overlay */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-[#E5E4DE] shadow-sm bg-white">
        
        <AdminMap
          trucks={filteredTrucks}
          shipments={shipments}
          onSelectTruck={(t) => setSelectedTruck(t)}
          height={isWorkspaceMaximized ? 'h-[calc(100vh-160px)]' : 'h-[620px]'}
        />

        {/* Floating Telemetry & Operations Stream Overlay */}
        {showFeedOverlay && (
          <div className="absolute top-4 left-4 z-10 w-80 max-h-[540px] bg-white/95 backdrop-blur-md border border-[#DEDDD8] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fadeIn">
            <div className="p-3.5 border-b border-[#EBEAE5] bg-[#FAF9F6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#111111]">
                  Operations Radar
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-400">
                {events.length} Events
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-xl border border-[#EBEAE5] bg-white/80 hover:bg-white text-[11px] space-y-1 transition-all"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-neutral-700 bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#EBEAE5]">
                      {evt.referenceId}
                    </span>
                    <span className="text-neutral-400 font-medium">{evt.timestamp}</span>
                  </div>
                  <div className="font-bold text-[#111111]">{evt.title}</div>
                  <p className="text-neutral-600 text-[10.5px] leading-tight">{evt.description}</p>
                  <div className="text-[10px] text-neutral-400 font-medium flex items-center gap-1 pt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-[#EBEAE5] bg-[#FAF9F6] text-[10px] font-mono text-center text-neutral-500">
              Corridor Telemetry Sync: Active
            </div>
          </div>
        )}

      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedTruck}
        onClose={() => setSelectedTruck(null)}
        title={selectedTruck ? selectedTruck.name : 'Vehicle Telemetry'}
        subtitle={selectedTruck ? `${selectedTruck.registrationNumber} · ${selectedTruck.company}` : ''}
      >
        {selectedTruck && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Operating Status</span>
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  selectedTruck.isAvailable
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedTruck.isAvailable ? 'Available for Dispatch' : 'In Transit'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-500 font-medium">Class:</span>
                <span className="font-bold text-[#111111]">{selectedTruck.truckType}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Payload Allocation
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Current Payload:</span>
                  <span className="font-bold text-[#111111]">{selectedTruck.currentLoadTons}T / {selectedTruck.totalCapacityTons}T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Available Space:</span>
                  <span className="font-bold text-emerald-600">{selectedTruck.availableCapacityTons} Tons</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Driver Communications
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white space-y-2">
                <div className="flex justify-between font-bold text-sm text-[#111111]">
                  <span>{selectedTruck.driver.name}</span>
                  <span className="text-amber-600 font-mono">★ {selectedTruck.driver.rating.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedTruck.driver.phone}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
