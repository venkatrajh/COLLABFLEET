import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Gauge, 
  IndianRupee, 
  MapPin, 
  RotateCcw,
  Zap
} from 'lucide-react';

export const WhyThisTruckModal: React.FC = () => {
  const { isWhyThisTruckOpen, setIsWhyThisTruckOpen, selectedMatch, handleBookTruck } = useApp();

  if (!selectedMatch) return null;

  const { truck, matchScore, explanation, isReturnTrip, emptyKmSaved, savingsAmount } = selectedMatch;

  const factors = [
    { name: 'Capacity Fit', score: explanation.capacityFitScore, icon: <Gauge className="w-4 h-4 text-cyan-400" /> },
    { name: 'Route Match', score: explanation.routeMatchScore, icon: <MapPin className="w-4 h-4 text-blue-400" /> },
    { name: 'Distance to Pickup', score: explanation.distanceScore, icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { name: 'Price Competitiveness', score: explanation.priceScore, icon: <IndianRupee className="w-4 h-4 text-emerald-400" /> },
    { name: 'Driver Reliability', score: explanation.driverReliabilityScore, icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
    { name: 'Return Trip Potential', score: explanation.returnTripScore, icon: <RotateCcw className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <Modal
      isOpen={isWhyThisTruckOpen}
      onClose={() => setIsWhyThisTruckOpen(false)}
      maxWidth="max-w-2xl"
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Why we recommend this truck</h3>
            <p className="text-[11px] text-slate-400 font-normal">
              Explainable AI Match Assessment for {truck.name}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Top Overall Score Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-cyan/20 via-dark-850 to-dark-900 border border-brand-cyan/30 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-brand-cyan tracking-wider uppercase">
              CollabFleet AI Match
            </div>
            <div className="text-3xl font-extrabold text-white mt-0.5">
              {matchScore}% <span className="text-sm font-semibold text-slate-300">Composite Score</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {truck.model} · {truck.driver.name} ({truck.company})
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Estimated Fare</div>
            <div className="text-2xl font-black text-brand-cyan">
              ₹{selectedMatch.estimatedPrice.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              Save ~₹{savingsAmount.toLocaleString('en-IN')} vs standard
            </div>
          </div>
        </div>

        {/* Natural Language AI Summary */}
        <div className="p-4 rounded-xl bg-dark-900/90 border border-white/10">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-cyan mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              "{explanation.summaryReason}"
            </p>
          </div>
        </div>

        {/* 6 AI Factors Score Breakdown (Clean Animated Progress Bars) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            AI Factor Breakdown
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {factors.map((f, i) => (
              <div key={i} className="p-3 rounded-xl bg-dark-900/70 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-300">
                    {f.icon}
                    <span>{f.name}</span>
                  </div>
                  <span className="font-extrabold text-white">{f.score}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-dark-950 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-cyan to-blue-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concrete Verified Reasons */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Key Collaborative Highlights
          </h4>
          <div className="space-y-2">
            {explanation.bulletPoints.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => setIsWhyThisTruckOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              setIsWhyThisTruckOpen(false);
              handleBookTruck(selectedMatch);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
          >
            <span>Book This Truck</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </Modal>
  );
};
