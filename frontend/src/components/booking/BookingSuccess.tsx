import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Send, Clock, Share2, ArrowRight, CheckCircle, Package } from 'lucide-react';

export const BookingSuccess: React.FC = () => {
  const { 
    isBookingSuccessOpen, 
    setIsBookingSuccessOpen, 
    activeBookingShipment,
    setActiveView,
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
        
        {/* Animated Pending Request Badge */}
        <div className="w-13 h-13 rounded-2xl bg-neutral-950 text-white flex items-center justify-center mx-auto shadow-xl">
          <Send className="w-6 h-6 stroke-[2.5]" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-extrabold mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>REQUEST SENT · PENDING</span>
          </div>

          <h2 className="text-xl font-black text-neutral-950 tracking-tight">
            Booking Request Sent
          </h2>
          <p className="text-xs font-semibold text-neutral-500 mt-0.5 font-mono">
            ID: {activeBookingShipment.trackingNumber}
          </p>
          <p className="text-xs text-neutral-600 font-medium mt-1">
            Waiting for fleet owner confirmation.
          </p>
        </div>

        {/* Request Summary Card */}
        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-neutral-200/90 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <div>
              <span className="font-extrabold text-neutral-950 block">
                {activeBookingShipment.truck?.name || 'Commercial Carrier'}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                {activeBookingShipment.truck?.registrationNumber}
              </span>
            </div>
            <span className="font-mono font-black text-neutral-950 text-sm">
              ₹{(activeBookingShipment.price || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-1.5 text-neutral-600">
            <div className="flex justify-between">
              <span>Route:</span>
              <span className="font-bold text-neutral-950">
                {activeBookingShipment.fromLocation?.name} → {activeBookingShipment.toLocation?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cargo:</span>
              <span className="font-semibold text-neutral-900">
                {activeBookingShipment.cargoType} ({activeBookingShipment.weightTons} Tons)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Carrier:</span>
              <span className="font-semibold text-neutral-900">
                {activeBookingShipment.truck?.company || 'Verified Carrier'}
              </span>
            </div>
          </div>
        </div>

        {/* Informational Guidance Box */}
        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-left text-xs text-blue-900 flex items-start gap-2">
          <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            The fleet operator has received your request. Once they <strong>Accept</strong>, direct in-app messaging and call channels will be enabled, followed by trip dispatch.
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={() => {
              setIsBookingSuccessOpen(false);
              setActiveView('my_shipments');
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-neutral-950 text-white hover:bg-black font-extrabold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>View My Shipments & Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookingSuccessOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:border-neutral-950 text-xs font-bold text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </Modal>
  );
};
