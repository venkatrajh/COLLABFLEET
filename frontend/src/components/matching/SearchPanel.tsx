import React from 'react';
import { useApp } from '../../context/AppContext';
import { LocationSearch } from '../map/LocationSearch';
import { TruckType } from '../../types';
import { Search, Sparkles, Box, Weight, ArrowRightLeft } from 'lucide-react';

const TRUCK_TYPES: TruckType[] = [
  'Mini Truck',
  'Light Truck',
  'Medium Truck',
  'Heavy Truck',
  'Container Truck'
];

export const SearchPanel: React.FC = () => {
  const { searchQuery, setSearchQuery, startFreightSearch, isAiLoading } = useApp();

  const handleSwapLocations = () => {
    setSearchQuery(prev => ({
      ...prev,
      fromLocation: prev.toLocation,
      toLocation: prev.fromLocation
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startFreightSearch();
  };

  return (
    <div className="w-full max-w-md glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl space-y-4 pointer-events-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>Where are you shipping?</span>
          </h2>
          <p className="text-xs text-slate-400">
            AI matches your cargo with available return-trip capacity
          </p>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-ping" />
      </div>

      <form onSubmit={handleSearch} className="space-y-3.5">
        {/* From & To Location Search with swap button */}
        <div className="relative space-y-2.5">
          <LocationSearch
            label="From (Pickup)"
            placeholder="Search pickup city, port or hub..."
            selectedLocation={searchQuery.fromLocation}
            onSelectLocation={(loc) => setSearchQuery(prev => ({ ...prev, fromLocation: loc }))}
            iconColor="text-brand-cyan"
          />

          {/* Swap locations button */}
          <div className="flex justify-end -my-1 pr-3">
            <button
              type="button"
              onClick={handleSwapLocations}
              className="w-7 h-7 rounded-full bg-dark-800 border border-white/10 hover:border-brand-cyan text-slate-400 hover:text-white flex items-center justify-center transition-all shadow"
              title="Swap pickup and destination"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <LocationSearch
            label="To (Destination)"
            placeholder="Search destination city or depot..."
            selectedLocation={searchQuery.toLocation}
            onSelectLocation={(loc) => setSearchQuery(prev => ({ ...prev, toLocation: loc }))}
            iconColor="text-emerald-400"
          />
        </div>

        {/* Cargo Type & Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              What are you carrying?
            </label>
            <div className="relative">
              <Box className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery.cargoType}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, cargoType: e.target.value }))}
                placeholder="e.g. Electronics"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl glass-input text-xs font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              How much? (Tons)
            </label>
            <div className="relative">
              <Weight className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="0.5"
                max="40"
                step="0.5"
                value={searchQuery.weightTons}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, weightTons: parseFloat(e.target.value) || 1 }))}
                placeholder="e.g. 8"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl glass-input text-xs font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Truck Type Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Truck Needed
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TRUCK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSearchQuery(prev => ({ ...prev, truckType: type }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  searchQuery.truckType === type
                    ? 'bg-brand-cyan text-dark-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'bg-dark-900/80 text-slate-300 border border-white/5 hover:border-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA: Find Matching Trucks */}
        <button
          type="submit"
          disabled={isAiLoading || !searchQuery.fromLocation || !searchQuery.toLocation}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-cyan via-sky-500 to-blue-600 text-dark-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Sparkles className="w-4 h-4 text-dark-950 group-hover:rotate-12 transition-transform" />
          <span>{isAiLoading ? 'Calculating AI Matches...' : 'Find Matching Trucks'}</span>
        </button>
      </form>
    </div>
  );
};
