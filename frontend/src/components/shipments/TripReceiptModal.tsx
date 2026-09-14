import React from 'react';
import { Shipment } from '../../types';
import { 
  CheckCircle2, 
  MapPin, 
  Truck, 
  User, 
  TrendingDown, 
  Leaf, 
  Printer, 
  Star, 
  X, 
  ShieldCheck,
  Calendar,
  PackageCheck
} from 'lucide-react';

interface TripReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
  onBookSimilar: (shipment: Shipment) => void;
}

export const TripReceiptModal: React.FC<TripReceiptModalProps> = ({
  isOpen,
  onClose,
  shipment,
  onBookSimilar
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const baseFare = (shipment.price || 8000) + (shipment.savingsAmount || 1800);

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto pointer-events-auto print:p-0 print:bg-transparent print:backdrop-blur-none print:static">
      <div 
        id="collabfleet-print-receipt"
        className="w-full max-w-lg bg-white rounded-3xl border border-[#DEDDD8] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border print:border-neutral-300 print:rounded-2xl"
      >
        
        {/* Header Ribbon */}
        <div className="bg-[#111111] text-white p-5 sm:p-6 flex items-start justify-between relative">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-extrabold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                OFFICIAL TRIP RECEIPT
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase">
                Delivered
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>COLLABFLEET</span>
              <span className="text-neutral-500 font-normal">|</span>
              <span className="font-mono text-base font-bold text-neutral-300">{shipment.trackingNumber}</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Verified delivery record and freight settlement certificate
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors print:hidden"
            aria-label="Close receipt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 text-neutral-800 text-xs">
          
          {/* Route Card */}
          <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#EBEAE5] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-600" />
                Origin
              </span>
              <div className="font-black text-sm text-neutral-900">{shipment?.fromLocation?.name || 'Origin Hub'}</div>
              <div className="text-[11px] text-neutral-500">{shipment?.fromLocation?.city || 'Origin City'}, {shipment?.fromLocation?.state || 'India'}</div>
            </div>

            <div className="flex flex-col items-center px-3">
              <span className="text-[10px] font-bold text-neutral-400">Delivered</span>
              <div className="w-16 h-0.5 bg-neutral-300 relative my-1">
                <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-emerald-600"></div>
              </div>
              <span className="text-[9px] text-emerald-600 font-bold">100% On-Time</span>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[9px] uppercase font-bold text-neutral-400 flex items-center justify-end gap-1">
                <MapPin className="w-3 h-3 text-neutral-600" />
                Destination
              </span>
              <div className="font-black text-sm text-neutral-900">{shipment?.toLocation?.name || 'Destination Hub'}</div>
              <div className="text-[11px] text-neutral-500">{shipment?.toLocation?.city || 'Destination City'}, {shipment?.toLocation?.state || 'India'}</div>
            </div>
          </div>

          {/* Shipment & Driver Specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-[#EBEAE5] space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                <PackageCheck className="w-3 h-3 text-neutral-500" />
                Cargo Details
              </span>
              <div className="font-extrabold text-xs text-neutral-900 truncate">
                {shipment?.cargoType || 'Industrial Freight'}
              </div>
              <div className="text-[11px] text-neutral-600 font-medium">
                Payload: <strong className="text-neutral-900">{shipment?.weightTons || 8} Metric Tons</strong>
              </div>
              <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Pickup: {shipment?.pickupDate || 'Completed'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#EBEAE5] space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                <Truck className="w-3 h-3 text-neutral-500" />
                Assigned Carrier
              </span>
              <div className="font-extrabold text-xs text-neutral-900 truncate">
                {shipment?.truck?.name || (shipment?.truck?.registrationNumber ? `Truck ${shipment.truck.registrationNumber}` : 'Truck not assigned')}
              </div>
              <div className="text-[11px] text-neutral-600 flex items-center gap-1">
                <User className="w-3 h-3 text-neutral-400" />
                <span>{shipment?.truck?.driver?.name || 'Driver not assigned'}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{shipment?.truck?.driver?.rating || 4.95} Rating Verified</span>
              </div>
            </div>
          </div>

          {/* Financials & Collaborative Savings */}
          <div className="p-4 rounded-2xl bg-white border border-[#DEDDD8] space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Payment & Collaborative Savings
            </div>

            <div className="space-y-1.5 pt-1 border-b border-neutral-100 pb-2.5">
              <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                <span>Standard Solo Spot Rate:</span>
                <span className="font-mono line-through">₹{baseFare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-600 font-bold text-[11px]">
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  COLLABFLEET Network Discount:
                </span>
                <span className="font-mono">- ₹{(shipment.savingsAmount || 1850).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <div>
                <span className="text-xs font-black text-neutral-900 block">Final Settled Fare</span>
                <span className="text-[10px] text-neutral-400">Paid via Verified Freight Escrow</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-mono text-neutral-900">
                  ₹{shipment.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Environmental & Efficiency Impact */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950">
                  Green Logistics Milestone
                </div>
                <div className="text-[11px] text-emerald-700">
                  Backhaul collaboration avoided unnecessary empty transit.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="text-xs font-black font-mono text-emerald-900">
                  {shipment.emptyKmSaved || 67} km
                </div>
                <div className="text-[9px] uppercase font-bold text-emerald-600">
                  Empty Avoided
                </div>
              </div>
              <div className="border-l border-emerald-200 pl-3">
                <div className="text-xs font-black font-mono text-emerald-900">
                  -{shipment.co2ReductionKg || 142} kg
                </div>
                <div className="text-[9px] uppercase font-bold text-emerald-600">
                  CO₂ Saved
                </div>
              </div>
            </div>
          </div>

          {/* Compact Timeline */}
          <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#EBEAE5] space-y-2">
            <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              Trip Milestone Log
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-600 font-semibold">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Confirmed
              </span>
              <span className="text-neutral-300">→</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Assigned
              </span>
              <span className="text-neutral-300">→</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Picked Up
              </span>
              <span className="text-neutral-300">→</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Delivered
              </span>
            </div>
          </div>

          {/* Customer Rating Box */}
          <div className="p-3 rounded-xl bg-white border border-[#EBEAE5] flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-neutral-400 block">Shipper Feedback</span>
              <p className="text-[11px] text-neutral-700 italic mt-0.5">
                "Excellent handling and prompt updates. Cargo received in pristine condition."
              </p>
            </div>
            <div className="flex items-center gap-0.5 text-amber-400 pl-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#F8F7F4] border-t border-[#EBEAE5] flex flex-col sm:flex-row items-center justify-between gap-2.5 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 font-bold text-xs border border-[#DEDDD8] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save Receipt</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onBookSimilar(shipment);
              }}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-white font-extrabold text-xs shadow transition-all"
            >
              Book Similar Shipment
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
