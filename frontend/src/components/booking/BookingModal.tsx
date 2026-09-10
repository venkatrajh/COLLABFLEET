import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  CheckCircle2, 
  MapPin, 
  Truck as TruckIcon, 
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
      maxWidth="max-w-md"
      title={
        <div>
          <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Confirm Your Shipment</h3>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">
            Review freight booking details before confirming
          </p>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs">
        
        {/* Route Card */}
        <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="flex flex-col items-center mt-1">
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
              <span className="w-0.5 h-6 bg-neutral-300 dark:bg-neutral-700 my-0.5" />
              <span className="w-2 h-2 rounded-full border-2 border-black dark:border-white" />
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <span className="text-[9px] uppercase font-bold text-neutral-400">Pickup</span>
                <div className="text-xs font-black text-neutral-900 dark:text-white">
                  {searchQuery.fromLocation?.name || 'Chennai'}
                </div>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-neutral-400">Destination</span>
                <div className="text-xs font-black text-neutral-900 dark:text-white">
                  {searchQuery.toLocation?.name || 'Bengaluru'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cargo & Truck */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[9px] font-bold text-neutral-400 uppercase block">Cargo</span>
            <div className="font-bold text-neutral-900 dark:text-white mt-0.5">{searchQuery.cargoType}</div>
            <div className="text-[10px] text-neutral-500">{searchQuery.weightTons} Tons load</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[9px] font-bold text-neutral-400 uppercase block">Truck & Driver</span>
            <div className="font-bold text-neutral-900 dark:text-white mt-0.5 truncate">{truck.name}</div>
            <div className="text-[10px] text-neutral-500 truncate">{truck.driver.name} (★ {truck.driver.rating})</div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span>Base Collaborative Fare</span>
            <span className="font-mono text-neutral-900 dark:text-white font-semibold">₹{Math.round(estimatedPrice * 0.88).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span>Tolls & Fuel</span>
            <span className="font-mono text-neutral-900 dark:text-white font-semibold">₹{Math.round(estimatedPrice * 0.12).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5 border-t border-neutral-200 dark:border-neutral-800 text-sm font-extrabold text-neutral-900 dark:text-white">
            <span>Total Payable</span>
            <span className="text-base font-black">₹{estimatedPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 gap-2.5">
          <button
            type="button"
            onClick={() => setIsBookingModalOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          >
            Change Truck
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 px-5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming...</span>
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
