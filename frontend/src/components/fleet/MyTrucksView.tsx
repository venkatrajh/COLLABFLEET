import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck } from '../../types';
import { TruckService } from '../../services/truckService';
import { AddTruckModal } from './AddTruckModal';
import { 
  Truck as TruckIcon, 
  Plus, 
  ArrowRight, 
  MapPin, 
  User, 
  Layers
} from 'lucide-react';

export const MyTrucksView: React.FC = () => {
  const { setActiveView, setIsAddTruckOpen, showToast } = useApp();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrucks = async () => {
    setIsLoading(true);
    try {
      const data = await TruckService.getMyTrucks();
      setTrucks(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrucks();
  }, []);

  const handleFindFreightForTruck = (truck: Truck) => {
    setActiveView('find_freight');
    showToast(`Showing freight matching ${truck.name}`, 'info');
  };

  const availableCount = trucks.filter(t => t.isAvailable).length;
  const offlineCount = trucks.filter(t => !t.isAvailable).length;

  return (
    <div className="w-full max-w-3xl mx-auto pb-20 pointer-events-auto">
      
      {/* Unified Floating Island */}
      <div className="bg-white/95 backdrop-blur-md border border-[#DEDDD8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-130px)]">
        
        {/* Island Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EBEAE5] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold shadow-sm">
              <TruckIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-[#111111] tracking-tight">
                  My Trucks
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#111111] text-white text-[11px] font-mono font-bold">
                  {trucks.length}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Manage fleet capacity, toggle availability, and connect return loads
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddTruckOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#111111] text-white font-extrabold text-xs shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Truck</span>
          </button>
        </div>

        {/* Section 1: Fleet Summary Strip */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#FAF9F6] border-b border-[#EBEAE5] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4 text-[11px] font-medium text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span><strong>{availableCount}</strong> Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              <span><strong>{offlineCount}</strong> In Transit / Offline</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-neutral-400 hidden sm:block">
            Verified Carrier Fleet
          </div>
        </div>

        {/* Scrollable Connected Truck List */}
        <div className="overflow-y-auto divide-y divide-[#EBEAE5] bg-white scrollbar-thin">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-neutral-500">
              Loading fleet vehicles...
            </div>
          ) : trucks.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <p className="text-sm font-bold text-[#111111]">No trucks in fleet yet.</p>
              <p className="text-xs text-neutral-500">Add your first vehicle to start matching with freight.</p>
            </div>
          ) : (
            trucks.map((truck) => {
              const loadPercent = Math.round((truck.currentLoadTons / truck.totalCapacityTons) * 100);

              return (
                <div 
                  key={truck.id}
                  className="p-4 sm:p-5 hover:bg-[#FAF9F6] transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F0EFEA] border border-[#DEDDD8] flex items-center justify-center font-bold text-[#111111] shrink-0">
                        <TruckIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-extrabold text-[#111111]">
                            {truck.name}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF9F6] border border-[#EBEAE5] text-neutral-600 font-bold">
                            {truck.registrationNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {truck.truckType} · Total Capacity: <strong>{truck.totalCapacityTons} Tons</strong>
                        </div>
                      </div>
                    </div>

                    {/* Availability Toggle */}
                    <button
                      onClick={async () => {
                        const updated = await TruckService.toggleTruckAvailability(truck.id);
                        if (updated) {
                          setTrucks(prev => prev.map(t => t.id === truck.id ? { ...t, isAvailable: updated.isAvailable } : t));
                          showToast(`${truck.name} is now ${updated.isAvailable ? 'Available for matching' : 'Offline / In Transit'}`, 'info');
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                        truck.isAvailable
                          ? 'bg-[#111111] text-white shadow-sm'
                          : 'bg-[#F0EFEA] text-neutral-500 border border-[#DEDDD8]'
                      }`}
                      title="Click to toggle matching availability"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${truck.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-400'}`} />
                      <span>{truck.isAvailable ? 'Available' : 'Offline'}</span>
                    </button>
                  </div>

                  {/* Compact Capacity Utilization Gauge */}
                  <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">
                        Available Space: <strong className="text-[#111111]">{truck.availableCapacityTons} T</strong>
                      </span>
                      <span className="text-neutral-500">
                        Loaded: <strong className="text-[#111111]">{truck.currentLoadTons} T</strong> ({loadPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EBEAE5] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#111111] rounded-full transition-all"
                        style={{ width: `${loadPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Row: Location, Driver & CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5 text-xs">
                    <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>Current Hub: <strong className="text-[#111111]">{truck.currentLocation.name}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-neutral-400" />
                        <span>Driver: <strong className="text-[#111111]">{truck.driver.name}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFindFreightForTruck(truck)}
                      className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <span>Find Freight</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      <AddTruckModal onTruckAdded={loadTrucks} />
    </div>
  );
};
