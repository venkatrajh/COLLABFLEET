import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Check, Truck, Navigation, Share2, ArrowRight } from 'lucide-react';

export const BookingSuccess: React.FC = () => {
  const { 
    isBookingSuccessOpen, 
    setIsBookingSuccessOpen, 
    activeBookingShipment,
    handleTrackShipment,
    showToast
  } = useApp();

  if (!activeBookingShipment) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast(`Tracking link for ${activeBookingShipment.trackingNumber} copied!`, 'info');
  };

  return (
    <Modal
      isOpen={isBookingSuccessOpen}
      onClose={() => setIsBookingSuccessOpen(false)}
      maxWidth="max-w-md"
    >
      <div className="text-center space-y-4 py-1">
        
        {/* Checkmark Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mx-auto shadow-xl">
          <Check className="w-6 h-6 stroke-[3]" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Booking Confirmed
          </span>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white mt-0.5 tracking-tight font-mono">
            {activeBookingShipment.trackingNumber}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Driver is assigned and heading to pickup location
          </p>
        </div>

        {/* Receipt Card */}
        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <span className="font-extrabold text-neutral-900 dark:text-white">
              {activeBookingShipment.truck?.name || 'Ashok Leyland 1618'}
            </span>
            <span className="font-mono font-black text-neutral-900 dark:text-white text-sm">
              ₹{activeBookingShipment.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <div className="flex justify-between">
              <span>Driver:</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{activeBookingShipment.truck?.driver.name || 'Rajesh Kumar'}</span>
            </div>
            <div className="flex justify-between">
              <span>Route:</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{activeBookingShipment.fromLocation.name} → {activeBookingShipment.toLocation.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Arrival:</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{activeBookingShipment.estimatedDeliveryTime || 'Tonight'}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={() => handleTrackShipment(activeBookingShipment)}
            className="w-full py-3.5 px-6 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Track Shipment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Tracking</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
