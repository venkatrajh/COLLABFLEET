import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  CheckCircle2, 
  MapPin, 
  Truck as TruckIcon, 
  User, 
  Navigation, 
  Share2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

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
      <div className="text-center space-y-4 py-2">
        
        {/* Animated Success Badge */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-glass-glow animate-bounce-short">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Booking Confirmed
          </span>
          <h2 className="text-2xl font-black text-white mt-0.5">
            {activeBookingShipment.trackingNumber}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Driver is dispatched and preparing for pickup
          </p>
        </div>

        {/* Receipt Card */}
        <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/10 text-left space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <TruckIcon className="w-4 h-4 text-brand-cyan" />
              <span className="text-xs font-bold text-white">
                {activeBookingShipment.truck?.name || 'Ashok Leyland 1618'}
              </span>
            </div>
            <span className="text-xs font-extrabold text-emerald-400 font-mono">
              ₹{activeBookingShipment.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>Driver:</span>
              <span className="text-slate-200 font-semibold">
                {activeBookingShipment.truck?.driver.name || 'Rajesh Kumar'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Pickup:</span>
              <span className="text-slate-200 font-semibold">{activeBookingShipment.fromLocation.name}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Destination:</span>
              <span className="text-slate-200 font-semibold">{activeBookingShipment.toLocation.name}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Cargo:</span>
              <span className="text-slate-200 font-semibold">
                {activeBookingShipment.cargoType} ({activeBookingShipment.weightTons} T)
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Estimated Arrival:</span>
              <span className="text-brand-cyan font-bold">{activeBookingShipment.estimatedDeliveryTime}</span>
            </div>
          </div>
        </div>

        {/* Buttons: Track Shipment & Share */}
        <div className="pt-2 space-y-2">
          <button
            onClick={() => handleTrackShipment(activeBookingShipment)}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-cyan via-sky-500 to-blue-600 text-dark-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Track Shipment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Tracking Details</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
