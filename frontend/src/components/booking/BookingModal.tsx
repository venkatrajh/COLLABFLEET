import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  CheckCircle2, 
  MapPin, 
  Truck as TruckIcon, 
  User, 
  Clock, 
  IndianRupee, 
  Sparkles, 
  ShieldCheck,
  ArrowRight,
  Loader2
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    selectedMatch, 
    searchQuery,
    handleConfirmBooking 
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedMatch) return null;

  const { truck, matchScore, estimatedPrice, etaMinutes } = selectedMatch;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await handleConfirmBooking();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isBookingModalOpen}
      onClose={() => setIsBookingModalOpen(false)}
      maxWidth="max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Confirm Your Shipment</h3>
            <p className="text-[11px] text-slate-400 font-normal">
              Review trip details before locking collaborative reservation
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        
        {/* Route Summary */}
        <div className="p-3.5 rounded-xl bg-dark-900/90 border border-white/10 space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="flex flex-col items-center mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
              <span className="w-0.5 h-6 bg-slate-700 my-0.5" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Pickup</span>
                <div className="text-xs font-bold text-white">
                  {searchQuery.fromLocation?.name || 'Chennai'}
                </div>
                <span className="text-[10px] text-slate-400">Today, 05:30 PM</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Drop-off Destination</span>
                <div className="text-xs font-bold text-white">
                  {searchQuery.toLocation?.name || 'Bengaluru'}
                </div>
                <span className="text-[10px] text-slate-400">Tonight, ~10:45 PM (Est. {etaMinutes} min to pickup)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cargo & Truck Summary */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Shipment Cargo</span>
            <div className="font-bold text-white">{searchQuery.cargoType}</div>
            <div className="text-[11px] text-brand-cyan">{searchQuery.weightTons} Tons load</div>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Truck</span>
            <div className="font-bold text-white truncate">{truck.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{truck.registrationNumber}</div>
          </div>
        </div>

        {/* Driver Snapshot */}
        <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center text-brand-cyan font-bold text-xs border border-white/10">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{truck.driver.name}</div>
              <div className="text-[10px] text-slate-400">⭐ {truck.driver.rating} · {truck.company}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-brand-cyan px-2 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30">
            <Sparkles className="w-3 h-3" />
            <span>{matchScore}% AI Match</span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-3.5 rounded-xl bg-dark-950/80 border border-brand-cyan/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Base Collaborative Freight Fare</span>
            <span className="font-mono text-slate-200">₹{Math.round(estimatedPrice * 0.88).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Toll & Fuel Surcharge</span>
            <span className="font-mono text-slate-200">₹{Math.round(estimatedPrice * 0.12).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Return Trip Collaborative Discount</span>
            <span className="font-mono">-₹{selectedMatch.savingsAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-sm font-extrabold text-white">
            <span>Total Payable</span>
            <span className="text-base text-brand-cyan font-black">
              ₹{estimatedPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-3">
          <button
            type="button"
            onClick={() => setIsBookingModalOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Change Truck
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-brand-cyan via-sky-500 to-blue-600 text-dark-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-dark-950" />
                <span>Confirming Booking...</span>
              </>
            ) : (
              <>
                <span>Confirm Booking</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </Modal>
  );
};
