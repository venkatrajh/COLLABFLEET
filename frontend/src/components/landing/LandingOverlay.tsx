import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  Search, 
  PlusCircle, 
  Check, 
  Truck as TruckIcon,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export const LandingOverlay: React.FC = () => {
  const { setActiveView, currentRole } = useApp();

  return (
    <div className="space-y-12 py-4 pointer-events-auto max-w-5xl mx-auto">
      
      {/* 1. Hero Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border shadow-xl text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold">
          <span>Collaborative Freight Mobility</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
          Move More. Waste Less.
        </h1>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium max-w-lg mx-auto leading-relaxed">
          AI-powered freight matching connecting shipments with available truck capacity — especially on return journeys.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => setActiveView('find_truck')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs sm:text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Find a Truck</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveView(currentRole === 'fleet_operator' ? 'find_freight' : 'post_shipment')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{currentRole === 'fleet_operator' ? 'Find Freight' : 'Post a Shipment'}</span>
          </button>
        </div>
      </div>

      {/* 2. How CollabFleet Works */}
      <div className="space-y-4">
        <div className="text-center space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Process
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
            How CollabFleet Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {[
            { step: '1', title: 'Where you are shipping', desc: 'Select pickup and dropoff hubs across India.' },
            { step: '2', title: 'We find available trucks', desc: 'Scan active corridors for underutilized capacity.' },
            { step: '3', title: 'AI compares options', desc: 'Multi-factor match on space, route, and ETA.' },
            { step: '4', title: 'Choose a match', desc: 'Review transparent factor breakdown and savings.' },
            { step: '5', title: 'Track your shipment', desc: 'Live map-first telemetry with status updates.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl border space-y-1.5">
              <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-black text-neutral-900 dark:text-white font-mono">
                {item.step}
              </span>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug">{item.title}</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI That Explains Itself (Hackathon Showcase) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Explainable AI
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
              AI that explains itself.
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Every truck match includes clear mathematical and natural language reasoning so shippers and fleet owners know exactly why a recommendation was made.
            </p>

            <div className="space-y-1.5 pt-1 text-xs text-neutral-700 dark:text-neutral-300">
              {[
                '8.5 tons verified available capacity',
                '12.4 km distance from pickup hub',
                'Already returning toward destination (backhaul)',
                '67 km empty deadhead travel avoided',
                '₹1,850 direct freight savings'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Miniature Preview Card */}
          <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-bold text-neutral-900 dark:text-white">
                Ashok Leyland 1618
              </div>
              <span className="px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-extrabold">
                94% AI Match
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">Capacity Fit:</span>
                <span className="font-bold text-neutral-900 dark:text-white">95%</span>
              </div>
              <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-black dark:bg-white w-[95%]" />
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Route Match:</span>
                <span className="font-bold text-neutral-900 dark:text-white">91%</span>
              </div>
              <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-black dark:bg-white w-[91%]" />
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Return Trip Fit:</span>
                <span className="font-bold text-neutral-900 dark:text-white">96%</span>
              </div>
              <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-black dark:bg-white w-[96%]" />
              </div>
            </div>

            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 italic pt-1 border-t border-neutral-200 dark:border-neutral-800">
              "This truck has 8.5 tons of available capacity and is already travelling toward Bengaluru, making it a strong collaborative match."
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
