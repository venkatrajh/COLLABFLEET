import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Check, ArrowRight, Truck } from 'lucide-react';

export const WhyThisTruckModal: React.FC = () => {
  const { isWhyThisTruckOpen, setIsWhyThisTruckOpen, selectedMatch, handleBookTruck } = useApp();

  if (!selectedMatch) return null;

  const { truck, matchScore, explanation, estimatedPrice } = selectedMatch;

  const factors = [
    { name: 'Capacity Fit', score: explanation.capacityFitScore },
    { name: 'Route Match', score: explanation.routeMatchScore },
    { name: 'Distance', score: explanation.distanceScore },
    { name: 'Price', score: explanation.priceScore },
    { name: 'Driver Reliability', score: explanation.driverReliabilityScore },
    { name: 'Return Trip', score: explanation.returnTripScore },
  ];

  return (
    <Modal
      isOpen={isWhyThisTruckOpen}
      onClose={() => setIsWhyThisTruckOpen(false)}
      maxWidth="max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
            <Truck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Why this truck?</h3>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">
              {truck.name} · {matchScore}% AI Match
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        
        {/* Natural Language Explanation */}
        <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed">
            "This truck has enough available space, is close to pickup, and already matches your route."
          </p>
        </div>

        {/* Monochrome Progress Bars */}
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

        {/* Verified Points */}
        <div className="space-y-1.5 pt-1">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Verified Criteria
          </h4>
          {explanation.bulletPoints.slice(0, 4).map((pt, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              <Check className="w-3.5 h-3.5 mt-0.5 text-neutral-900 dark:text-white shrink-0" />
              <span>{pt}</span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 gap-3">
          <button
            onClick={() => setIsWhyThisTruckOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          >
            Close
          </button>

          <button
            onClick={() => {
              setIsWhyThisTruckOpen(false);
              handleBookTruck(selectedMatch);
            }}
            className="px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <span>Book This Truck (₹{estimatedPrice.toLocaleString('en-IN')})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </Modal>
  );
};
