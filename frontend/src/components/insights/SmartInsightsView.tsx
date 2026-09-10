import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingDown, 
  IndianRupee, 
  Leaf, 
  Gauge, 
  Check 
} from 'lucide-react';

export const SmartInsightsView: React.FC = () => {
  const { userProfile, setActiveView } = useApp();
  const { stats } = userProfile;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-20 pointer-events-auto">
      
      {/* Header */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight">
            Smart Insights
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Economic and environmental impact from collaborative capacity matching
          </p>
        </div>

        <button
          onClick={() => setActiveView('find_truck')}
          className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow hover:opacity-90 transition-all"
        >
          Find a Truck
        </button>
      </div>

      {/* Primary Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Empty Travel Avoided */}
        <div className="glass-card rounded-2xl p-4 border space-y-2">
          <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {stats.emptyKmSaved.toLocaleString('en-IN')} <span className="text-xs font-bold text-neutral-500">km</span>
            </div>
            <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
              Empty travel avoided
            </div>
            <p className="text-[10px] text-neutral-500">
              Eliminated deadhead miles by utilizing return routes
            </p>
          </div>
        </div>

        {/* Money Saved */}
        <div className="glass-card rounded-2xl p-4 border space-y-2">
          <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              ₹{stats.moneySaved.toLocaleString('en-IN')}
            </div>
            <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
              Estimated savings
            </div>
            <p className="text-[10px] text-neutral-500">
              Saved compared to spot market freight rates
            </p>
          </div>
        </div>

        {/* CO2 Emissions Cut */}
        <div className="glass-card rounded-2xl p-4 border space-y-2">
          <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {stats.co2ReductionKg} <span className="text-xs font-bold text-neutral-500">kg</span>
            </div>
            <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
              CO₂ reduction
            </div>
            <p className="text-[10px] text-neutral-500">
              Direct emissions abated via capacity sharing
            </p>
          </div>
        </div>

      </div>

      {/* Operational Efficiency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-neutral-900 dark:text-white" />
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Truck Space Utilization</h3>
            </div>
            <span className="text-sm font-black text-neutral-900 dark:text-white">88.4%</span>
          </div>

          <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black dark:bg-white rounded-full"
              style={{ width: '88.4%' }}
            />
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Conventional freight averages ~45% utilization. Collaborative capacity matching increases corridor utilization to <strong>88.4%</strong>.
          </p>
        </div>

        <div className="glass-panel p-4 sm:p-5 rounded-2xl border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-neutral-900 dark:text-white" />
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Successful Matches</h3>
            </div>
            <span className="text-sm font-black text-neutral-900 dark:text-white">18 Trips</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">Avg. AI Match</span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white">92.6%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">On-Time Rate</span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white">99.1%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
