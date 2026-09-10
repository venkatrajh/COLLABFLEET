import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  TrendingDown, 
  IndianRupee, 
  Leaf, 
  Truck, 
  CheckCircle2, 
  ArrowLeftRight,
  ShieldAlert,
  Gauge
} from 'lucide-react';

export const SmartInsightsView: React.FC = () => {
  const { userProfile, setActiveView } = useApp();
  const { stats } = userProfile;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 pointer-events-auto">
      
      {/* Title & Introduction */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Smart Insights
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Live Impact
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-world economic and environmental gains powered by collaborative capacity matching
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('find_truck')}
            className="px-4 py-2 rounded-xl bg-brand-cyan text-dark-950 font-black text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all"
          >
            Find a Truck
          </button>
        </div>
      </div>

      {/* Hero Environmental & Economic Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Empty Travel Avoided */}
        <div className="glass-card rounded-3xl p-6 border border-brand-cyan/30 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glass-glow">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {stats.emptyKmSaved.toLocaleString('en-IN')} <span className="text-sm text-brand-cyan font-bold">km</span>
            </div>
            <div className="text-xs font-bold text-slate-300 mt-1">
              Empty travel avoided
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Deadhead kilometers eliminated by filling return journeys
            </p>
          </div>
        </div>

        {/* Money Saved */}
        <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glass-glow">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              ₹{stats.moneySaved.toLocaleString('en-IN')}
            </div>
            <div className="text-xs font-bold text-emerald-400 mt-1">
              Estimated savings
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Saved compared to dedicated point-to-point spot market rates
            </p>
          </div>
        </div>

        {/* CO2 Emissions Cut */}
        <div className="glass-card rounded-3xl p-6 border border-teal-500/30 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-glass-glow">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {stats.co2ReductionKg} <span className="text-sm text-teal-300 font-bold">kg</span>
            </div>
            <div className="text-xs font-bold text-teal-300 mt-1">
              Estimated CO₂ reduction
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Greenhouse emissions abated by maximizing axle load utilization
            </p>
          </div>
        </div>

      </div>

      {/* Secondary Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Truck Utilization Metric */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-sm font-bold text-white">Truck Space Utilization</h3>
            </div>
            <span className="text-base font-black text-brand-cyan">88.4%</span>
          </div>

          <div className="w-full h-3 bg-dark-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-brand-cyan to-blue-500 rounded-full"
              style={{ width: '88.4%' }}
            />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Standard freight trucks in India operate at ~45% capacity. CollabFleet's AI match engine raises fleet capacity utilization to <strong>88.4%</strong> across key logistics corridors.
          </p>
        </div>

        {/* Collaborative Match Efficiency */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Successful Matches</h3>
            </div>
            <span className="text-base font-black text-emerald-400">18 Trips</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5">
              <span className="text-slate-400 block">Avg. AI Match Score</span>
              <span className="text-sm font-extrabold text-white">92.6%</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5">
              <span className="text-slate-400 block">On-Time Reliability</span>
              <span className="text-sm font-extrabold text-emerald-400">99.1%</span>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Zero cancelled loads with automated GPS tracking and vetted fleet drivers.
          </p>
        </div>

      </div>

    </div>
  );
};
