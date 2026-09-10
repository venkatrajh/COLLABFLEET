import React from 'react';
import { ArrowLeftRight, TrendingDown, Leaf, IndianRupee } from 'lucide-react';

interface ReturnTripBadgeProps {
  destinationCity: string;
  emptyKmSaved: number;
  savingsAmount: number;
  co2ReductionKg: number;
  compact?: boolean;
}

export const ReturnTripBadge: React.FC<ReturnTripBadgeProps> = ({
  destinationCity,
  emptyKmSaved,
  savingsAmount,
  co2ReductionKg,
  compact = false
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
        <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Return Trip · {emptyKmSaved} km empty travel avoided</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/70 via-dark-900/90 to-dark-950 border border-emerald-500/30 shadow-lg relative overflow-hidden">
      {/* Subtle Glow backdrop */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300 tracking-wide uppercase">
              Smart Return Trip Opportunity
            </div>
            <div className="text-[11px] text-slate-300">
              This truck is already returning toward <span className="font-bold text-white">{destinationCity}</span>
            </div>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
          96% Backhaul Fit
        </span>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-500/20 text-center">
        <div className="bg-dark-950/60 p-2 rounded-lg border border-white/5">
          <div className="text-xs sm:text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-0.5">
            <TrendingDown className="w-3 h-3" />
            {emptyKmSaved} km
          </div>
          <div className="text-[10px] text-slate-400">Empty travel avoided</div>
        </div>

        <div className="bg-dark-950/60 p-2 rounded-lg border border-white/5">
          <div className="text-xs sm:text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-0.5">
            <IndianRupee className="w-3 h-3" />
            ₹{savingsAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400">Potential savings</div>
        </div>

        <div className="bg-dark-950/60 p-2 rounded-lg border border-white/5">
          <div className="text-xs sm:text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-0.5">
            <Leaf className="w-3 h-3" />
            {co2ReductionKg} kg
          </div>
          <div className="text-[10px] text-slate-400">CO₂ emissions cut</div>
        </div>
      </div>
    </div>
  );
};
