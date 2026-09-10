import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck } from '../../types';
import { TruckService } from '../../services/truckService';
import { AddTruckModal } from './AddTruckModal';
import { 
  Truck as TruckIcon, 
  Plus, 
  ArrowRight, 
  Check 
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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-20 pointer-events-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-4 sm:p-5 rounded-3xl border shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight">
              My Trucks
            </h1>
            <span className="px-2 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold">
              {trucks.length}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your fleet capacity and backhaul freight
          </p>
        </div>

        <button
          onClick={() => setIsAddTruckOpen(true)}
          className="px-4 py-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add a Truck</span>
        </button>
      </div>

      {/* Truck List */}
      {isLoading ? (
        <div className="p-8 text-center glass-panel rounded-3xl text-neutral-400 text-xs">
          Loading fleet vehicles...
        </div>
      ) : (
        <div className="space-y-3">
          {trucks.map((truck) => {
            const loadPercent = Math.round((truck.currentLoadTons / truck.totalCapacityTons) * 100);

            return (
              <div 
                key={truck.id} 
                className="glass-card rounded-2xl p-4 border hover:border-black dark:hover:border-white transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-900 dark:text-white">
                      <TruckIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white">{truck.name}</h3>
                      <div className="text-[10px] text-neutral-500">
                        {truck.registrationNumber} · {truck.truckType}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold">
                    <Check className="w-3 h-3" />
                    Available
                  </span>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1 bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Available: <strong className="text-neutral-900 dark:text-white">{truck.availableCapacityTons} T</strong></span>
                    <span className="text-neutral-500">Loaded: <strong className="text-neutral-900 dark:text-white">{truck.currentLoadTons} T</strong></span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black dark:bg-white rounded-full"
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>

                {/* Locations & Find Freight CTA */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="text-[11px] text-neutral-500">
                    Location: <strong className="text-neutral-900 dark:text-white">{truck.currentLocation.name}</strong> · Driver: {truck.driver.name}
                  </div>

                  <button
                    onClick={() => handleFindFreightForTruck(truck)}
                    className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow hover:opacity-90 transition-all flex items-center gap-1"
                  >
                    <span>Find Freight</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddTruckModal onTruckAdded={loadTrucks} />
    </div>
  );
};
