import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingDown, 
  IndianRupee, 
  Leaf, 
  Gauge, 
  Check,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Truck,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const SmartInsightsView: React.FC = () => {
  const { userProfile, setActiveView } = useApp();
  const { stats } = userProfile;

  return (
    <div className="w-full max-w-3xl mx-auto pb-20 pointer-events-auto">
      
      {/* Unified Floating Island */}
      <div className="bg-white/95 backdrop-blur-md border border-[#DEDDD8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-130px)]">
        
        {/* Island Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EBEAE5] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold shadow-sm">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-black text-[#111111] tracking-tight">
                Smart Insights
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Economic & corridor impact from collaborative capacity matching
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('find_truck')}
            className="px-3.5 py-1.5 rounded-xl bg-[#111111] text-white font-extrabold text-xs shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Find a Truck</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Section 1: Connected 4-Column Impact Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#EBEAE5] border-b border-[#EBEAE5] bg-[#FAF9F6] shrink-0 text-center">
          
          <div className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              <TrendingDown className="w-3.5 h-3.5 text-neutral-700" />
              <span>Empty KM</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-[#111111]">
              {stats.emptyKmSaved.toLocaleString('en-IN')} <span className="text-xs font-bold text-neutral-500">km</span>
            </div>
            <div className="text-[10px] text-neutral-500">Deadhead eliminated</div>
          </div>

          <div className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              <IndianRupee className="w-3.5 h-3.5 text-neutral-700" />
              <span>Savings</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-[#111111]">
              ₹{stats.moneySaved.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-neutral-500">vs spot freight market</div>
          </div>

          <div className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              <Gauge className="w-3.5 h-3.5 text-neutral-700" />
              <span>Utilization</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-[#111111]">
              88.4%
            </div>
            <div className="text-[10px] text-neutral-500">Corridor load factor</div>
          </div>

          <div className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>CO₂ Abated</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-[#111111]">
              {stats.co2ReductionKg} <span className="text-xs font-bold text-neutral-500">kg</span>
            </div>
            <div className="text-[10px] text-neutral-500">Emissions prevented</div>
          </div>

        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto divide-y divide-[#EBEAE5] scrollbar-thin">
          
          {/* Section 2: Fleet Space Utilization & Corridor Efficiency */}
          <div className="p-5 sm:p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#111111] uppercase tracking-wider">
                  Corridor Capacity Utilization
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Comparison against conventional one-way freight empty-return baseline
                </p>
              </div>
              <span className="text-base sm:text-lg font-black text-[#111111]">
                88.4%
              </span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-[#EFEFEA] rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-[#111111] transition-all"
                  style={{ width: '88.4%' }}
                  title="CollabFleet shared utilization (88.4%)"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>Industry Average: <strong>~45%</strong></span>
                <span className="font-bold text-[#111111]">COLLABFLEET Network: +43.4% uplift</span>
              </div>
            </div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] text-center">
                <span className="text-neutral-500 block text-[10px] font-bold uppercase tracking-wider">Successful Trips</span>
                <span className="text-sm sm:text-base font-black text-[#111111] mt-0.5 block">18 Trips</span>
                <span className="text-[10px] text-emerald-600 font-semibold">100% completed</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] text-center">
                <span className="text-neutral-500 block text-[10px] font-bold uppercase tracking-wider">Avg. Match Score</span>
                <span className="text-sm sm:text-base font-black text-[#111111] mt-0.5 block">92.6%</span>
                <span className="text-[10px] text-neutral-500 font-semibold">6-factor evaluated</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] text-center">
                <span className="text-neutral-500 block text-[10px] font-bold uppercase tracking-wider">On-Time Rate</span>
                <span className="text-sm sm:text-base font-black text-[#111111] mt-0.5 block">99.1%</span>
                <span className="text-[10px] text-neutral-500 font-semibold">Verified delivery</span>
              </div>
            </div>
          </div>

          {/* Section 3: Smart Recommendations */}
          <div className="bg-[#FAF9F6]">
            <div className="px-5 sm:px-6 py-3 border-b border-[#EBEAE5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Live Corridor Recommendations
                </h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">3 actionable matches</span>
            </div>

            <div className="divide-y divide-[#EBEAE5] bg-white">
              
              {/* Recommendation 1 */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#111111]">
                        Optimize Return Route: Chennai → Bengaluru
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 text-[10px] font-mono font-bold">
                        94% Backhaul
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 max-w-lg leading-relaxed">
                      Heavy truck returning empty on NH-48 corridor. 8 tons available capacity can capture electronics freight from Sriperumbudur.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('find_freight')}
                  className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-[#111111] text-white text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Find Freight</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Recommendation 2 */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#111111]">
                        Improve Capacity Utilization in Bengaluru Hub
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-800 text-[10px] font-mono font-bold">
                        Idle Fleet
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 max-w-lg leading-relaxed">
                      2 vehicles currently have idle capacity in Electronic City hub. Consolidating partial loads reduces empty kilometers by 34%.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('my_trucks')}
                  className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-white border border-[#DEDDD8] hover:bg-[#F0EFEA] text-[#111111] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>View Trucks</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Recommendation 3 */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#111111]">
                        High Shipper Demand: Mumbai → Pune Corridor
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 text-[10px] font-mono font-bold">
                        +18% Premium
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 max-w-lg leading-relaxed">
                      Expressway corridor experiencing peak load volume. Deploying available container trucks unlocks high-yield return cargo.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('find_freight')}
                  className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-[#111111] text-white text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>View Opportunities</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
