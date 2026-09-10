import React from 'react';
import { useApp } from '../../context/AppContext';
import { MatchResult } from '../../types';
import { 
  Truck as TruckIcon, 
  Clock, 
  ArrowRight, 
  Star 
} from 'lucide-react';

interface TruckCardProps {
  match: MatchResult;
}

export const TruckCard: React.FC<TruckCardProps> = ({ match }) => {
  const { 
    selectedMatch, 
    setSelectedMatch, 
    setIsWhyThisTruckOpen, 
    setIsTruckDetailOpen,
    handleBookTruck,
    recenterMap
  } = useApp();

  const isSelected = selectedMatch?.truck.id === match.truck.id;
  const { truck, matchScore, estimatedPrice, etaMinutes, isReturnTrip, emptyKmSaved } = match;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMatch(match);
    recenterMap(truck.currentLocation.coordinates, 10);
  };

  const handleWhyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMatch(match);
    setIsWhyThisTruckOpen(true);
  };

  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMatch(match);
    setIsTruckDetailOpen(true);
  };

  return (
    <div
      onClick={handleSelect}
      className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer border ${
        isSelected
          ? 'bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white shadow-lg ring-1 ring-black/10 dark:ring-white/20'
          : 'glass-card hover:border-neutral-400 dark:hover:border-neutral-600'
      }`}
    >
      {/* Top Header: Truck Name & AI Match Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isSelected 
              ? 'bg-black text-white dark:bg-white dark:text-black font-bold' 
              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
          }`}>
            <TruckIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white leading-tight">
              {truck.name}
            </h4>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {truck.company} · ⭐ {truck.driver.rating}
            </div>
          </div>
        </div>

        {/* AI Match Badge */}
        <div className="text-right">
          <span className="inline-block px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-extrabold tracking-tight">
            {matchScore}% Match
          </span>
          {isReturnTrip && (
            <div className="text-[9px] font-bold text-neutral-600 dark:text-neutral-300 mt-0.5">
              Return Trip · {emptyKmSaved}km saved
            </div>
          )}
        </div>
      </div>

      {/* Capacity, ETA & Price */}
      <div className="flex items-center justify-between text-xs py-2 border-y border-neutral-200 dark:border-neutral-800 my-1.5">
        <div>
          <span className="text-[9px] uppercase font-bold text-neutral-400 block">Capacity</span>
          <span className="font-extrabold text-neutral-900 dark:text-white">
            {truck.availableCapacityTons} T available
          </span>
        </div>

        <div>
          <span className="text-[9px] uppercase font-bold text-neutral-400 block">ETA</span>
          <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            {etaMinutes} min away
          </span>
        </div>

        <div className="text-right">
          <span className="text-[9px] uppercase font-bold text-neutral-400 block">Fare</span>
          <span className="font-black text-sm text-neutral-900 dark:text-white">
            ₹{estimatedPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Bottom Actions: Why this truck & Book */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleWhyClick}
          className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white underline underline-offset-2 transition-colors"
        >
          Why this truck?
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleViewDetail}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors"
          >
            Details
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBookTruck(match);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow hover:opacity-90 transition-all flex items-center gap-1"
          >
            <span>Book</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
