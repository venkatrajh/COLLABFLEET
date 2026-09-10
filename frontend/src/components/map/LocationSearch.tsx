import React, { useState, useRef, useEffect } from 'react';
import { LocationHub } from '../../types';
import { INDIAN_LOCATION_HUBS } from '../../services/mockData';
import { MapPin, Plane, Anchor, Building2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LocationSearchProps {
  label: string;
  placeholder?: string;
  selectedLocation: LocationHub | null;
  onSelectLocation: (loc: LocationHub) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  label,
  placeholder = 'Search location...',
  selectedLocation,
  onSelectLocation,
}) => {
  const { recenterMap } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(selectedLocation ? selectedLocation.name : '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedLocation) {
      setSearchQuery(selectedLocation.name);
    }
  }, [selectedLocation]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredHubs = INDIAN_LOCATION_HUBS.filter(hub => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      hub.name.toLowerCase().includes(q) ||
      hub.city.toLowerCase().includes(q) ||
      hub.state.toLowerCase().includes(q) ||
      (hub.landmark && hub.landmark.toLowerCase().includes(q))
    );
  });

  const getHubIcon = (type: LocationHub['hubType']) => {
    switch (type) {
      case 'port':
        return <Anchor className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />;
      case 'airport':
        return <Plane className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />;
      case 'hub':
        return <Building2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />;
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
          <MapPin className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 rounded-xl glass-input text-xs font-semibold focus:ring-1 focus:ring-black dark:focus:ring-white"
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsOpen(true);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-black dark:hover:text-white"
            aria-label="Clear location"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 glass-modal rounded-xl border shadow-2xl max-h-56 overflow-y-auto">
          <div className="p-1 space-y-0.5">
            {filteredHubs.length > 0 ? (
              filteredHubs.map(hub => (
                <div
                  key={hub.id}
                  onClick={() => {
                    onSelectLocation(hub);
                    setSearchQuery(hub.name);
                    setIsOpen(false);
                    recenterMap(hub.coordinates, 10);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                      {getHubIcon(hub.hubType)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white group-hover:underline">
                        {hub.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {hub.city}, {hub.state}
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                    {hub.hubType}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-neutral-500">
                No location found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
