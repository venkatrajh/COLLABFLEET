import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingDown, 
  Leaf, 
  IndianRupee, 
  Truck as TruckIcon,
  Cpu,
  Layers,
  MapPin
} from 'lucide-react';

export const LandingOverlay: React.FC = () => {
  const { setActiveView, startFreightSearch, currentRole } = useApp();

  return (
    <div className="space-y-16 py-6 pointer-events-auto max-w-6xl mx-auto">
      
      {/* 1. Hero Section over Map */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 shadow-glass text-center relative overflow-hidden">
        {/* Subtle cyan glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan text-xs font-black tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>AI-Powered Collaborative Freight Matching</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none font-sans">
            Move More. <br />
            <span className="text-gradient-cyan">Waste Less.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-xl mx-auto">
            Connect your shipments with verified trucks that have available or underutilized capacity — especially on return journeys.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveView('find_truck')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-cyan via-sky-500 to-blue-600 text-dark-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find a Truck</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView(currentRole === 'fleet_operator' ? 'find_freight' : 'post_shipment')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-dark-900/90 hover:bg-dark-850 border border-white/10 text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-brand-cyan" />
              <span>{currentRole === 'fleet_operator' ? 'Find Freight' : 'Post a Shipment'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. How CollabFleet Works (5 Steps) */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-cyan">
            Seamless Logistics Mobility
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How CollabFleet Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            { step: '01', title: 'Tell us where you\'re shipping', desc: 'Select pickup and dropoff hubs across India with cargo weight.' },
            { step: '02', title: 'We find available trucks', desc: 'Real-time telemetry scans live fleet corridors with spare axle capacity.' },
            { step: '03', title: 'AI compares the best options', desc: 'Scores route fit, deadhead reduction, price, and driver track record.' },
            { step: '04', title: 'You choose a match', desc: 'Review explainable AI reasons and return-trip cost savings before booking.' },
            { step: '05', title: 'Track your shipment', desc: 'Live map-first GPS tracking with instant updates and driver communication.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-white/10 space-y-2 hover:border-brand-cyan/40 transition-all">
              <span className="text-xs font-black text-brand-cyan font-mono">{item.step}</span>
              <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI That Explains Itself (Hackathon Showcase Section) */}
      <div className="glass-panel p-8 rounded-3xl border border-brand-cyan/30 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan text-xs font-black">
              <Cpu className="w-3.5 h-3.5" />
              <span>Hackathon Core USP</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI that explains itself.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Most freight marketplaces give you a black-box percentage or a spreadsheet. CollabFleet deconstructs every recommendation with transparent, multi-factor collaborative scoring.
            </p>

            <div className="space-y-2.5 pt-1">
              {[
                '8.5 tons verified available capacity',
                '12.4 km distance from your pickup point',
                'Already travelling toward Bengaluru (backhaul journey)',
                '67 km of empty deadhead travel avoided',
                '₹1,850 estimated discount passed to shipper',
                'Reliable driver with 4.85 rating & 400+ completed trips'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveView('find_truck')}
                className="px-6 py-2.5 rounded-xl bg-brand-cyan text-dark-950 font-black text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all"
              >
                Experience AI Matching Live
              </button>
            </div>
          </div>

          {/* Interactive AI Preview Card */}
          <div className="p-6 rounded-2xl bg-dark-900/90 border border-brand-cyan/40 shadow-glass-glow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-cyan text-dark-950 flex items-center justify-center font-bold">
                  <TruckIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Ashok Leyland 1618</h4>
                  <span className="text-[10px] text-slate-400">Deccan Freight Logistics</span>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan text-xs font-black border border-brand-cyan/40">
                94% AI Match
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Capacity Fit:</span>
                <strong className="text-white">95%</strong>
              </div>
              <div className="w-full h-1.5 bg-dark-950 rounded-full overflow-hidden">
                <div className="h-full bg-brand-cyan w-[95%]" />
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Route Match:</span>
                <strong className="text-white">91%</strong>
              </div>
              <div className="w-full h-1.5 bg-dark-950 rounded-full overflow-hidden">
                <div className="h-full bg-brand-cyan w-[91%]" />
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Return Trip Potential:</span>
                <strong className="text-emerald-400">96% (Smart Backhaul)</strong>
              </div>
              <div className="w-full h-1.5 bg-dark-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[96%]" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-dark-950/80 border border-white/5 text-[11px] text-slate-300 italic">
              "This truck has 8.5 tons of available capacity and is already travelling toward Bengaluru, making it a strong collaborative match."
            </div>
          </div>

        </div>
      </div>

      {/* 4. Why CollabFleet Value Props */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-cyan">
            Measurable Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Why CollabFleet
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <TrendingDown className="w-5 h-5 text-brand-cyan" />,
              title: 'Reduce Empty Travel',
              desc: 'Eliminate deadhead miles by pairing cargo with trucks returning along the same transport corridors.'
            },
            {
              icon: <IndianRupee className="w-5 h-5 text-emerald-400" />,
              title: 'Save Up to 25% On Freight',
              desc: 'Shippers gain access to dynamic collaborative pricing lower than conventional spot markets.'
            },
            {
              icon: <Layers className="w-5 h-5 text-blue-400" />,
              title: 'Monetize Unused Axle Capacity',
              desc: 'Fleet operators fill partial truck space and return journeys, turning empty runs into profit.'
            },
            {
              icon: <Cpu className="w-5 h-5 text-purple-400" />,
              title: 'Smarter Corridor Matching',
              desc: 'Intelligent multi-factor scoring evaluates weight, volume, route alignment, and pickup ETA.'
            },
            {
              icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />,
              title: 'Know Why You Were Matched',
              desc: 'Zero guesswork. View concrete factor scores and explainable reasons for every recommendation.'
            },
            {
              icon: <Leaf className="w-5 h-5 text-emerald-400" />,
              title: 'Measurable ESG Impact',
              desc: 'Track and report verified CO₂ reductions and fuel savings across all company shipments.'
            }
          ].map((card, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-3 hover:border-brand-cyan/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-dark-900 border border-white/10 flex items-center justify-center shadow">
                {card.icon}
              </div>
              <h3 className="text-base font-bold text-white">{card.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
