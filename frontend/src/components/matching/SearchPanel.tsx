import React from 'react';
import { useApp } from '../../context/AppContext';
import { LocationSearch } from '../map/LocationSearch';
import { TruckType } from '../../types';
import { Search, Sparkles, Box, Weight, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

const TRUCK_TYPES: { label: string; value: TruckType }[] = [
  { label: 'Mini', value: 'Mini Truck' },
  { label: 'Light', value: 'Light Truck' },
  { label: 'Medium', value: 'Medium Truck' },
  { label: 'Heavy', value: 'Heavy Truck' },
  { label: 'Container', value: 'Container Truck' }
];

export const SearchPanel: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    startFreightSearch, 
    isAiLoading,
    isSearchPanelCollapsed,
    setIsSearchPanelCollapsed
  } = useApp();

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

  // 1. Collapsed Mode (Uber / Ola compact pill)
  if (isSearchPanelCollapsed) {
    return (
      <div className="w-full max-w-sm glass-panel rounded-2xl p-3 border shadow-xl flex items-center justify-between pointer-events-auto transition-all animate-fadeIn">
        <div 
          onClick={() => setIsSearchPanelCollapsed(false)}
          className="cursor-pointer flex-1"
        >
          <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900 dark:text-white">
            <span>{searchQuery.fromLocation?.name || 'Chennai'}</span>
            <span className="text-neutral-400">→</span>
            <span>{searchQuery.toLocation?.name || 'Bengaluru'}</span>
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            {searchQuery.weightTons}T · {searchQuery.cargoType}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startFreightSearch()}
            className="px-3 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold shadow hover:opacity-90 transition-all flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            <span>Find</span>
          </button>
          <button
            onClick={() => setIsSearchPanelCollapsed(false)}
            className="p-1 text-neutral-500 hover:text-black dark:hover:text-white"
            title="Expand search"
            aria-label="Expand"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Expanded Mode (Clean Uber/Rapido-style card)
  return (
    <div className="w-full max-w-sm glass-panel rounded-3xl p-4 sm:p-5 border shadow-2xl space-y-3.5 pointer-events-auto transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Where are you shipping?
          </h2>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Instant matching with return-trip truck capacity
          </p>
        </div>
        
        {/* Collapse Button */}
        <button
          onClick={() => setIsSearchPanelCollapsed(true)}
          className="p-1 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Minimize search card"
          aria-label="Minimize"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        
        {/* Locations: From & To */}
        <div className="relative space-y-2">
          <LocationSearch
            label="Pickup"
            placeholder="City or port..."
            selectedLocation={searchQuery.fromLocation}
            onSelectLocation={(loc) => setSearchQuery(prev => ({ ...prev, fromLocation: loc }))}
          />

          {/* Swap Button */}
          <div className="flex justify-end -my-1 pr-2">
            <button
              type="button"
              onClick={handleSwapLocations}
              className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center justify-center transition-all shadow-sm"
              title="Swap locations"
            >
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>

          <LocationSearch
            label="Dropoff"
            placeholder="Destination hub..."
            selectedLocation={searchQuery.toLocation}
            onSelectLocation={(loc) => setSearchQuery(prev => ({ ...prev, toLocation: loc }))}
          />
        </div>

        {/* Cargo & Weight */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Cargo
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery.cargoType}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, cargoType: e.target.value }))}
                placeholder="Electronics"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Weight (Tons)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.5"
                max="40"
                step="0.5"
                value={searchQuery.weightTons}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, weightTons: parseFloat(e.target.value) || 1 }))}
                placeholder="8"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* Truck Type Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
            Truck Type
          </label>
          <div className="flex flex-wrap gap-1">
            {TRUCK_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setSearchQuery(prev => ({ ...prev, truckType: t.value }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  searchQuery.truckType === t.value
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA Button (Black in light mode, White in dark mode) */}
        <button
          type="submit"
          disabled={isAiLoading || !searchQuery.fromLocation || !searchQuery.toLocation}
          className="w-full py-3 px-5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-lg hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <Search className="w-4 h-4" />
          <span>{isAiLoading ? 'Matching Trucks...' : 'Find Matching Trucks'}</span>
        </button>

      </form>
    </div>
  );
};
