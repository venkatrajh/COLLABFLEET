import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { CollaborationBadge } from './CollaborationBadge';
import { ReturnTripBadge } from './ReturnTripBadge';
import { 
  Truck as TruckIcon, 
  User, 
  Phone, 
  Star, 
  MapPin, 
  Clock, 
  Navigation, 
  IndianRupee, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
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
    collaborationScore, 
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
      maxWidth="max-w-2xl"
      title={
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <TruckIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{truck.name}</h3>
              <p className="text-[11px] text-slate-400 font-normal">
                {truck.registrationNumber} · {truck.company}
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan text-xs font-black">
            {matchScore}% AI Match
          </div>
        </div>
      }
    >
      <div className="space-y-5">

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-dark-900/80 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Space</span>
            <span className="text-sm font-extrabold text-brand-cyan">{truck.availableCapacityTons} Tons</span>
            <span className="text-[10px] text-slate-500 block">of {truck.totalCapacityTons} T total</span>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-900/80 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance & ETA</span>
            <span className="text-sm font-extrabold text-white">{etaMinutes} mins away</span>
            <span className="text-[10px] text-slate-400 block">{(distanceKm * 0.04).toFixed(1)} km to pickup</span>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-900/80 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Trip Fare</span>
            <span className="text-sm font-extrabold text-emerald-400">₹{estimatedPrice.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-emerald-400/80 block">Save ₹{savingsAmount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-900/80 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Truck Type</span>
            <span className="text-xs font-bold text-white truncate block">{truck.truckType}</span>
            <span className="text-[10px] text-slate-400 block">{truck.model}</span>
          </div>
        </div>

        {/* Return Trip Opportunity Highlight */}
        {isReturnTrip && (
          <ReturnTripBadge
            destinationCity={searchQuery.toLocation?.name || 'Bengaluru'}
            emptyKmSaved={emptyKmSaved}
            savingsAmount={savingsAmount}
            co2ReductionKg={co2ReductionKg}
          />
        )}

        {/* Collaboration Score & AI Reason */}
        <div className="p-4 rounded-xl bg-dark-900/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <CollaborationBadge score={collaborationScore} size="md" />
            
            <button
              onClick={() => {
                setIsTruckDetailOpen(false);
                setIsWhyThisTruckOpen(true);
              }}
              className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why recommended?</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed italic border-t border-white/5 pt-2.5">
            "{explanation.summaryReason}"
          </p>
        </div>

        {/* Driver Card */}
        <div className="p-3.5 rounded-xl bg-dark-900/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={truck.driver.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} 
              alt={truck.driver.name}
              className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">{truck.driver.name}</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {truck.driver.rating}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {truck.driver.tripsCompleted} collaborative trips · {truck.driver.experienceYears} yrs experience
              </div>
              <div className="text-[11px] text-brand-cyan font-mono mt-0.5">
                {truck.driver.phone}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" />
              Verified Pro
            </span>
          </div>
        </div>

        {/* Route Snapshot */}
        <div className="p-3 rounded-xl bg-dark-950/70 border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-brand-cyan" />
            <span className="text-slate-300">
              <strong className="text-white">{searchQuery.fromLocation?.name || 'Chennai'}</strong> → <strong className="text-white">{searchQuery.toLocation?.name || 'Bengaluru'}</strong>
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">~{distanceKm} km transit</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            onClick={() => setIsTruckDetailOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Go Back
          </button>

          <button
            onClick={() => handleBookTruck(selectedMatch)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 text-dark-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all"
          >
            <span>Book This Truck</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </Modal>
  );
};
