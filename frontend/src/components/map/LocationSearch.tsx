import React, { useState, useRef, useEffect } from 'react';
import { LocationHub } from '../../types';
import { INDIAN_LOCATION_HUBS } from '../../services/mockData';
import { MapPin, Plane, Anchor, Building2, Search, X } from 'lucide-react';

interface LocationSearchProps {
  label: string;
  placeholder?: string;
  selectedLocation: LocationHub | null;
  onSelectLocation: (loc: LocationHub) => void;
  iconColor?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  label,
  placeholder = 'Search city, port or hub...',
  selectedLocation,
  onSelectLocation,
  iconColor = 'text-brand-cyan'
}) => {
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
        return <Anchor className="w-3.5 h-3.5 text-blue-400" />;
      case 'airport':
        return <Plane className="w-3.5 h-3.5 text-amber-400" />;
      case 'hub':
        return <Building2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-brand-cyan" />;
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </label>

      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor}`}>
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
          className="w-full pl-9 pr-8 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-medium focus:bg-dark-900/90"
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsOpen(true);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 glass-modal rounded-xl border border-white/10 shadow-2xl max-h-60 overflow-y-auto">
          <div className="p-1.5 space-y-0.5">
            {filteredHubs.length > 0 ? (
              filteredHubs.map(hub => (
                <div
                  key={hub.id}
                  onClick={() => {
                    onSelectLocation(hub);
                    setSearchQuery(hub.name);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-brand-cyan/10 hover:border-brand-cyan/20 border border-transparent cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-dark-900 flex items-center justify-center shrink-0 border border-white/5">
                      {getHubIcon(hub.hubType)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-brand-cyan transition-colors">
                        {hub.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {hub.city}, {hub.state} {hub.landmark ? `· ${hub.landmark}` : ''}
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-dark-900/80 text-slate-400 border border-white/5">
                    {hub.hubType}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">
                No transport hubs matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
