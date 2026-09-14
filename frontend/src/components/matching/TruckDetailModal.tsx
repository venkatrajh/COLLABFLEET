import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  Truck as TruckIcon, 
  User, 
  Star, 
  MapPin, 
  Clock, 
  Navigation, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const TruckDetailModal: React.FC = () => {
  const { 
    isTruckDetailOpen, 
    setIsTruckDetailOpen, 
    selectedMatch, 
    setIsWhyThisTruckOpen,
    handleBookTruck,
    searchQuery
  } = useApp();

  if (!selectedMatch) return null;

  const { 
    truck, 
    matchScore, 
    estimatedPrice, 
    distanceKm, 
    etaMinutes, 
    isReturnTrip, 
    emptyKmSaved, 
    savingsAmount, 
    co2ReductionKg,
    explanation
  } = selectedMatch;

  return (
    <Modal
      isOpen={isTruckDetailOpen}
      onClose={() => setIsTruckDetailOpen(false)}
      maxWidth="max-w-xl"
      title={
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
              <TruckIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white leading-tight">
                {truck.name}
              </h3>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">
                {truck.registrationNumber} · {truck.company}
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black">
            {matchScore}% Match
          </div>
        </div>
      }
    >
      <div className="space-y-4">

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[9px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">Available</span>
            <span className="text-sm font-black text-neutral-900 dark:text-white">{truck.availableCapacityTons} Tons</span>
            <span className="text-[9px] text-neutral-400 block">of {truck.totalCapacityTons} T total</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[9px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">ETA</span>
            <span className="text-sm font-black text-neutral-900 dark:text-white">{etaMinutes} mins</span>
            <span className="text-[9px] text-neutral-400 block">{(distanceKm * 0.04).toFixed(1)} km to pickup</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[9px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">Trip Fare</span>
            <span className="text-sm font-black text-neutral-900 dark:text-white">₹{estimatedPrice.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-neutral-400 block">Save ₹{savingsAmount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[9px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">Vehicle</span>
            <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block">{truck.truckType}</span>
            <span className="text-[9px] text-neutral-400 block truncate">{truck.model}</span>
          </div>
        </div>

        {/* Return Trip Savings Note */}
        {isReturnTrip && (
          <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-neutral-900 dark:text-white block">Smart Return Trip</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Heading toward {searchQuery.toLocation?.name || 'Bengaluru'} · {emptyKmSaved} km empty travel avoided
              </span>
            </div>
            <span className="text-xs font-black text-neutral-900 dark:text-white font-mono">
              -₹{savingsAmount} saved
            </span>
          </div>
        )}

        {/* AI Explanation Callout */}
        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              AI Recommendation
            </span>
            <button
              onClick={() => {
                setIsTruckDetailOpen(false);
                setIsWhyThisTruckOpen(true);
              }}
              className="text-xs font-bold text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-80"
            >
              Why this truck?
            </button>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
            "{explanation.summaryReason}"
          </p>
        </div>

        {/* Driver Card */}
        <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-sm text-neutral-900 dark:text-white">
              {truck.driver.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">{truck.driver.name}</span>
                <span className="flex items-center text-[11px] text-amber-500 font-bold">
                  ★ {truck.driver.rating}
                </span>
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                {truck.driver.tripsCompleted} completed trips · {truck.driver.experienceYears} yrs experience
              </div>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold">
            Verified Pro
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setIsTruckDetailOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          >
            Go Back
          </button>

          <button
            onClick={() => handleBookTruck(selectedMatch)}
            className="px-6 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs sm:text-sm shadow-md hover:opacity-90 transition-all flex items-center gap-2"
          >
            <span>Book This Truck</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </Modal>
  );
};
