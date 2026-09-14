import React from 'react';
import { FreightOpportunity, Truck } from '../../types';
import { Modal } from '../common/Modal';
import { Check, ArrowRight, Package } from 'lucide-react';

interface WhyThisFreightModalProps {
  isOpen: boolean;
  onClose: () => void;
  freight: FreightOpportunity | null;
  truck: Truck | null;
  onAccept: (freight: FreightOpportunity) => void;
}

export const WhyThisFreightModal: React.FC<WhyThisFreightModalProps> = ({
  isOpen,
  onClose,
  freight,
  truck,
  onAccept
}) => {
  if (!freight || !truck) return null;

  const explanation = freight.explanation || {
    capacityFitScore: 92,
    routeMatchScore: freight.routeMatchScore || 90,
    distanceScore: 88,
    priceScore: 94,
    driverReliabilityScore: 95,
    returnTripScore: freight.isReturnTrip ? 96 : 60,
    summaryReason: `Strong opportunity because this shipment fits your ${truck.model}'s available capacity, connects along your return corridor to ${freight.toLocation.name}, and provides ₹${freight.estimatedEarnings.toLocaleString('en-IN')} in verified revenue.`,
    bulletPoints: [
      `Capacity Fit: ${freight.weightTons} tons utilizes space in your ${truck.availableCapacityTons}T truck`,
      `Route Alignment: Direct transit to ${freight.toLocation.name}`,
      `Backhaul: Eliminates ${freight.emptyKmSaved} km of empty travel`,
      `Shipper: ${freight.shipperName} (${freight.shipperRating} ★)`
    ]
  };

  const factors = [
    { name: 'Capacity Fit', score: explanation.capacityFitScore },
    { name: 'Route Match', score: explanation.routeMatchScore },
    { name: 'Distance / Proximity', score: explanation.distanceScore },
    { name: 'Earnings Potential', score: explanation.priceScore },
    { name: 'Shipper Reliability', score: explanation.driverReliabilityScore },
    { name: 'Return Trip Potential', score: explanation.returnTripScore },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
            <Package className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Why this freight?</h3>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">
              Matched for {truck.name} ({truck.registrationNumber})
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        
        {/* Prominent Match Badge & Natural Language Explanation */}
        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Intelligence Breakdown
            </span>
            <span className="px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black tracking-tight">
              {freight.matchScore}% FREIGHT MATCH
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed italic">
            "{explanation.summaryReason}"
          </p>
        </div>

        {/* Factor Progress Bars */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Factor Breakdown
          </h4>
          <div className="space-y-2">
            {factors.map((f, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{f.name}</span>
                  <span className="font-black text-neutral-900 dark:text-white">{f.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Criteria */}
        <div className="space-y-1.5 pt-1">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Verified Criteria
          </h4>
          {explanation.bulletPoints.slice(0, 5).map((pt, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              <Check className="w-3.5 h-3.5 mt-0.5 text-neutral-900 dark:text-white shrink-0" />
              <span>{pt}</span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          >
            Close
          </button>
          
          <button
            onClick={() => {
              onClose();
              onAccept(freight);
            }}
            className="px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-lg hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <span>Accept Load</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </Modal>
  );
};
