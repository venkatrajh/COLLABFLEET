import React from 'react';
import { useApp } from '../../context/AppContext';
import { LocationSearch } from '../map/LocationSearch';
import { TruckType } from '../../types';
import { Search, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

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

  // 1. Collapsed Mode (Compact pill)
  if (isSearchPanelCollapsed) {
    return (
      <div className="w-full bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-xs flex items-center justify-between transition-all animate-fadeIn">
        <div 
          onClick={() => setIsSearchPanelCollapsed(false)}
          className="cursor-pointer flex-1"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-950" />
            <span className="text-xs font-bold text-neutral-950 truncate">
              {searchQuery.fromLocation?.name || 'Chennai'} → {searchQuery.toLocation?.name || 'Bengaluru'}
            </span>
          </div>
          <div className="text-[10px] text-neutral-500 pl-4 mt-0.5">
            {searchQuery.weightTons} Tons · {searchQuery.cargoType}
          </div>
        </div>

        <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200">
          <button
            onClick={() => startFreightSearch()}
            className="p-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 transition-all shadow-xs"
            title="Search Trucks"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsSearchPanelCollapsed(false)}
            className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 transition-colors"
            title="Expand Search"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Expanded Mode (Full route entry card)
  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs space-y-3.5 transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-neutral-950">
            Where are you shipping?
          </h2>
          <p className="text-[11px] text-neutral-500">
            Instant matching with return-trip truck capacity
          </p>
        </div>
        
        {/* Collapse Button */}
        <button
          onClick={() => setIsSearchPanelCollapsed(true)}
          className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-[#FAF9F6] transition-colors"
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
              className="w-6 h-6 rounded-full bg-[#FAF9F6] border border-[#DEDDD8] text-neutral-600 hover:text-black flex items-center justify-center transition-all shadow-sm"
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
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Cargo
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery.cargoType}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, cargoType: e.target.value }))}
                placeholder="Electronics"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
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
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* Truck Type / Preference (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Truck Preference <span className="text-neutral-400 font-normal lowercase">(optional)</span>
            </label>
            <span className="text-[10px] font-medium text-neutral-500">
              {(!searchQuery.truckType || searchQuery.truckType === 'Any') 
                ? 'AI selects best truck automatically' 
                : `${searchQuery.truckType} preferred`}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSearchQuery(prev => ({ ...prev, truckType: 'Any' }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                !searchQuery.truckType || searchQuery.truckType === 'Any'
                  ? 'bg-neutral-950 text-white shadow-xs font-bold'
                  : 'bg-[#FAF9F6] text-neutral-600 hover:text-neutral-950 border border-[#DEDDD8]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${(!searchQuery.truckType || searchQuery.truckType === 'Any') ? 'bg-emerald-400' : 'bg-neutral-400'}`} />
              Any suitable truck
            </button>

            {TRUCK_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setSearchQuery(prev => ({ 
                  ...prev, 
                  truckType: prev.truckType === t.value ? 'Any' : t.value 
                }))}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  searchQuery.truckType === t.value
                    ? 'bg-neutral-950 text-white shadow-xs font-bold'
                    : 'bg-[#FAF9F6] text-neutral-600 hover:text-neutral-950 border border-[#DEDDD8]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          type="submit"
          disabled={isAiLoading || !searchQuery.fromLocation || !searchQuery.toLocation}
          className="w-full py-3 px-5 rounded-2xl bg-[#111111] hover:bg-black text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <Search className="w-4 h-4" />
          <span>{isAiLoading ? 'Matching Trucks...' : 'Find Matching Trucks'}</span>
        </button>

      </form>
    </div>
  );
};
