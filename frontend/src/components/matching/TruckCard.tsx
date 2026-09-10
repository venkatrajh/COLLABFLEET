import React from 'react';
import { useApp } from '../../context/AppContext';
import { MatchResult } from '../../types';
import { 
  Truck as TruckIcon, 
  Star, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ArrowLeftRight,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';

interface TruckCardProps {
  match: MatchResult;
}

export const TruckCard: React.FC<TruckCardProps> = ({ match }) => {
  const { 
    selectedMatch, 
    setSelectedMatch, 
    setIsWhyThisTruckOpen, 
    setIsTruckDetailOpen,
    handleBookTruck
  } = useApp();

  const isSelected = selectedMatch?.truck.id === match.truck.id;
  const { truck, matchScore, estimatedPrice, etaMinutes, distanceKm, isReturnTrip, emptyKmSaved } = match;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMatch(match);
  };

  const handleWhyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMatch(match);
    setIsWhyThisTruckOpen(true);
  };

  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMatch(match);
    setIsTruckDetailOpen(true);
  };

  return (
    <div
      onClick={handleSelect}
      className={`relative p-4 rounded-2xl transition-all cursor-pointer border ${
        isSelected
          ? 'bg-dark-900/95 border-brand-cyan shadow-glass-glow ring-1 ring-brand-cyan/50'
          : 'glass-card glass-card-hover border-white/10 hover:border-brand-cyan/40'
      }`}
    >
      {/* Top Banner: Name, Type & AI Match Score Badge */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isSelected 
              ? 'bg-brand-cyan text-dark-950 font-bold shadow-md' 
              : 'bg-dark-800 text-brand-cyan border border-white/10'
          }`}>
            <TruckIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white group-hover:text-brand-cyan transition-colors">
              {truck.name}
            </h4>
            <div className="text-[11px] text-slate-400 font-medium">
              {truck.model} · {truck.company}
            </div>
          </div>
        </div>

        {/* AI Match Badge */}
        <div className="flex flex-col items-end">
          <div className="px-2.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan text-xs font-black tracking-tight flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-brand-cyan" />
            <span>{matchScore}% AI Match</span>
          </div>
          {matchScore >= 94 && (
            <span className="text-[9px] font-extrabold text-brand-cyan uppercase tracking-wider mt-0.5">
              ★ Top Recommendation
            </span>
          )}
        </div>
      </div>

      {/* Capacity, Distance, ETA & Driver Details */}
      <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-white/5 my-2 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Space</span>
          <span className="font-extrabold text-brand-cyan">{truck.availableCapacityTons} Tons</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance & ETA</span>
          <span className="font-bold text-white flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {etaMinutes} min ({ (distanceKm * 0.04).toFixed(1) } km)
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Fare</span>
          <span className="font-extrabold text-white text-sm">
            ₹{estimatedPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Driver info & Return trip indicator */}
      <div className="flex items-center justify-between text-xs py-1">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="font-semibold text-slate-200">{truck.driver.name}</span>
          <span className="flex items-center text-[11px] text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
            {truck.driver.rating}
          </span>
        </div>

        {isReturnTrip && (
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <ArrowLeftRight className="w-3 h-3" />
            <span>{emptyKmSaved} km empty travel saved</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/5 gap-2">
        <button
          onClick={handleWhyClick}
          className="text-xs font-bold text-brand-cyan hover:text-white transition-colors flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-white/5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why this truck?</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleViewDetail}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          >
            View Match
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBookTruck(match);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 text-dark-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-1"
          >
            <span>Book</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
