import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck } from '../../types';
import { TruckService } from '../../services/truckService';
import { AddTruckModal } from './AddTruckModal';
import { 
  Truck as TruckIcon, 
  Plus, 
  Search, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
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
    showToast(`Showing freight opportunities matching ${truck.name} corridor`, 'info');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 pointer-events-auto">
      
      {/* Header with Title & Add Truck CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-5 rounded-3xl border border-white/10 shadow-glass">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              My Trucks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
              {trucks.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your fleet capacity and discover backhaul freight opportunities
          </p>
        </div>

        <button
          onClick={() => setIsAddTruckOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-cyan to-blue-600 text-dark-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add a Truck</span>
        </button>
      </div>

      {/* Truck Fleet Cards */}
      {isLoading ? (
        <div className="p-8 text-center glass-panel rounded-3xl text-slate-400 text-xs">
          Loading fleet vehicles...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trucks.map((truck) => {
            const loadPercent = Math.round((truck.currentLoadTons / truck.totalCapacityTons) * 100);

            return (
              <div 
                key={truck.id} 
                className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 hover:border-brand-cyan/30 transition-all"
              >
                {/* Truck Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center text-brand-cyan">
                      <TruckIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">{truck.name}</h3>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {truck.registrationNumber} · {truck.truckType}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold">
                    <CheckCircle2 className="w-3 h-3" />
                    Available
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 bg-dark-900/60 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Available Space: <strong className="text-brand-cyan font-bold">{truck.availableCapacityTons} T</strong></span>
                    <span className="text-slate-400">Loaded: <strong className="text-white">{truck.currentLoadTons} T</strong></span>
                  </div>
                  <div className="w-full h-2 bg-dark-950 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">
                    Total Capacity: {truck.totalCapacityTons} Tons ({loadPercent}% utilized)
                  </div>
                </div>

                {/* Locations & Driver */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-dark-900/50 border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Location</span>
                    <span className="font-semibold text-slate-200">{truck.currentLocation.name}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-dark-900/50 border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Driver</span>
                    <span className="font-semibold text-slate-200">{truck.driver.name} (⭐ {truck.driver.rating})</span>
                  </div>
                </div>

                {/* Potential Matches Callout & Find Freight CTA */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-brand-cyan font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{truck.activeMatchesCount || 3} potential freight matches</span>
                  </div>

                  <button
                    onClick={() => handleFindFreightForTruck(truck)}
                    className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-brand-cyan/20 border border-white/10 hover:border-brand-cyan/40 text-xs font-bold text-slate-200 hover:text-brand-cyan transition-all flex items-center gap-1.5"
                  >
                    <span>Find Freight</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Truck Modal */}
      <AddTruckModal onTruckAdded={loadTrucks} />
    </div>
  );
};
