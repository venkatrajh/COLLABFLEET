import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ArrowRight, 
  Search, 
  Check, 
  ShieldCheck, 
  TrendingDown, 
  Sparkles, 
  Leaf, 
  Boxes, 
  Clock, 
  ChevronRight,
  Package,
  Truck,
  Layers,
  BarChart3,
  MapPin
} from 'lucide-react';
import { HeroNetworkVisual } from './HeroNetworkVisual';

export const LandingPage: React.FC = () => {
  const { setActiveView, setRole } = useApp();

  // 1. Rotating Animated Value Proposition Headline
  const HEADLINES = [
    { main: 'Move More.\nWaste Less.', sub: 'AI-powered freight matching connecting shipments with available truck capacity and smarter return journeys.' },
    { main: 'Smarter Freight\nMatching.', sub: 'Intelligent multi-factor scoring connecting shippers with verified carriers in seconds.' },
    { main: 'Better Return\nJourneys.', sub: 'Eliminating deadhead kilometers by converting empty return trips into profitable revenue.' },
    { main: 'Less Empty\nCapacity.', sub: 'Turn unused container space and wasted volume into collaborative backhaul freight.' },
    { main: 'Better Fleet\nUtilization.', sub: 'Maximizing truck trip earnings while reducing empty kilometers and emissions across India.' }
  ];

  const [headlineIdx, setHeadlineIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIdx(prev => (prev + 1) % HEADLINES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [HEADLINES.length]);

  // Handler for Role-Based Start
  const handleSelectRoleAndProceed = (role: UserRole) => {
    setRole(role);
    setActiveView('login');
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 selection:bg-white selection:text-black">
      
      {/* 1. Dedicated Minimalist Landing Navbar */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black shadow-sm">
              <Truck className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                COLLABFLEET
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-neutral-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#explainable-ai" className="hover:text-white transition-colors">
              AI Intelligence
            </a>
            <a href="#empty-miles" className="hover:text-white transition-colors">
              Collaboration
            </a>
            <a href="#impact" className="hover:text-white transition-colors">
              Impact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('login')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-neutral-300 hover:text-white transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('role-selection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION — ENHANCED LAYERED NEAR-BLACK CANVAS */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-neutral-800/80 bg-[#060606] overflow-hidden">
        
        {/* Layer 1: Very Faint Engineering Grid */}
        <div className="absolute inset-0 bg-engineering-grid opacity-25 pointer-events-none" />

        {/* Layer 2: Subtle Atmospheric Radial Lighting behind Hero */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-cyan-950/20 via-neutral-900/30 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-blue-950/20 via-neutral-900/20 to-transparent blur-[100px] pointer-events-none" />

        {/* Layer 3: Faint Architectural Route Lines in background */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="20%" x2="45%" y2="55%" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="45%" y1="55%" x2="85%" y2="35%" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="10%" cy="20%" r="3" fill="#38BDF8" />
          <circle cx="45%" cy="55%" r="3" fill="#FFFFFF" />
          <circle cx="85%" cy="35%" r="3" fill="#38BDF8" />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content (Columns 1-7) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              
              {/* Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[11px] font-bold text-neutral-300 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Next-Gen Freight Capacity Exchange</span>
              </div>

              {/* Animated Rotating Headline */}
              <div className="min-h-[120px] sm:min-h-[150px] flex flex-col justify-start">
                <h1 
                  key={headlineIdx} 
                  className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] whitespace-pre-line animate-text-transition text-white"
                >
                  {HEADLINES[headlineIdx].main}
                </h1>
              </div>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-neutral-400 font-normal max-w-xl leading-relaxed">
                AI-powered freight matching connecting shipments with available truck capacity and smarter return journeys.
              </p>

              {/* Direct CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    const el = document.getElementById('role-selection');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-white text-black font-extrabold text-xs sm:text-sm shadow-lg hover:bg-neutral-100 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-5 py-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Trust Information */}
              <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Instant Return-Trip Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Explainable AI Reasoning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Live Map Telemetry</span>
                </div>
              </div>

            </div>

            {/* Right Visual Element (Columns 8-12): Interactive Miniature Freight Network */}
            <div className="lg:col-span-5 relative">
              <HeroNetworkVisual />
            </div>

          </div>
        </div>
      </section>


      {/* 3. HOW COLLABFLEET WORKS (5 STEPS) */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              The Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              How CollabFleet Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Connecting available capacity to urgent freight in five seamless, automated steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {[
              { step: '01', title: "Tell us where you're shipping.", desc: 'Specify your pickup, destination, cargo weight, and preferred vehicle type.' },
              { step: '02', title: 'We find available trucks.', desc: 'Our engine scans active corridors for trucks already scheduled or returning nearby.' },
              { step: '03', title: 'AI compares the best options.', desc: 'Multi-factor evaluation of space utilization, detour distance, driver rating, and cost.' },
              { step: '04', title: 'You choose the right match.', desc: 'Review transparent AI scores and natural-language reasoning before booking.' },
              { step: '05', title: 'Track your shipment.', desc: 'Live map telemetry with simulated status milestones from dispatch to delivery.' }
            ].map((s, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#F7F7F5] dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-2.5 hover:border-black dark:hover:border-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all text-left"
              >
                <span className="text-xl font-mono font-black text-neutral-400 dark:text-neutral-600">
                  {s.step}
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white leading-snug">
                  {s.title}
                </h3>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. EXPLAINABLE AI SECTION */}
      <section id="explainable-ai" className="py-16 sm:py-24 border-b border-neutral-200/80 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Transparent Intelligence
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                AI that explains itself.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Every recommendation shows why a truck is a good match — from capacity and route to reliability, price and return-trip potential. No black boxes.
              </p>

              <div className="space-y-2.5 pt-1 text-xs text-neutral-700 dark:text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-black dark:text-white mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-neutral-900 dark:text-white">Capacity Fit (95%):</strong> Truck has 8.5 tons open capacity for your 8.0-ton load.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-black dark:text-white mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-neutral-900 dark:text-white">Route Match (91%):</strong> Driver is on the Chennai-Bengaluru highway with only 12 km detour.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-black dark:text-white mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-neutral-900 dark:text-white">Return Trip (96%):</strong> Backhaul cargo match, avoiding empty travel home.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card Showcase */}
            <div className="lg:col-span-6 text-left">
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                      Ashok Leyland 1618
                    </h3>
                    <p className="text-xs text-neutral-500">Tamil Nadu Express Logistics</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black">
                    94% AI Match
                  </span>
                </div>

                {/* Score Bars */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-neutral-600 dark:text-neutral-400">Capacity Fit</span>
                      <span className="text-neutral-900 dark:text-white">95%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-black dark:bg-white w-[95%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-neutral-600 dark:text-neutral-400">Route Match</span>
                      <span className="text-neutral-900 dark:text-white">91%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-black dark:bg-white w-[91%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-neutral-600 dark:text-neutral-400">Distance</span>
                      <span className="text-neutral-900 dark:text-white">88%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-black dark:bg-white w-[88%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-neutral-600 dark:text-neutral-400">Price Score</span>
                      <span className="text-neutral-900 dark:text-white">94%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-black dark:bg-white w-[94%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-neutral-600 dark:text-neutral-400">Driver Reliability</span>
                      <span className="text-neutral-900 dark:text-white">93%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-black dark:bg-white w-[93%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-neutral-600 dark:text-neutral-400">Return Trip Potential</span>
                      <span className="text-neutral-900 dark:text-white">96%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-black dark:bg-white w-[96%]" />
                    </div>
                  </div>
                </div>

                {/* Natural Language Reason */}
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
                  <p className="font-medium leading-relaxed">
                    "Enough available space, close to pickup, strong route compatibility and a high return-trip opportunity."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. COLLABORATION SCORE SECTION */}
      <section id="collaboration-score" className="py-16 sm:py-24 border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ecosystem Contribution Index</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Collaboration Score
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl">
                A proprietary metric measuring how effectively a fleet operator or shipper contributes to shared freight capacity, backhaul fulfillment, and deadhead elimination.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Space Sharing</div>
                  <div className="font-extrabold text-white text-sm">96%</div>
                  <div className="text-[10px] text-neutral-400">Shared volume utilization</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Backhaul Ratio</div>
                  <div className="font-extrabold text-white text-sm">92%</div>
                  <div className="text-[10px] text-neutral-400">Return legs monetized</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Partner Trust</div>
                  <div className="font-extrabold text-white text-sm">★ 4.95</div>
                  <div className="text-[10px] text-neutral-400">Zero default records</div>
                </div>
              </div>
            </div>

            {/* Right Circular Gauge */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 rounded-full bg-neutral-900/70 border border-neutral-800 flex flex-col items-center justify-center p-6 shadow-2xl">
                
                {/* Outer SVG Ring */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-neutral-800"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-cyan-400"
                    strokeWidth="6"
                    strokeDasharray={264}
                    strokeDashoffset={264 * (1 - 0.94)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center space-y-0.5">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    94
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                    High Collaboration
                  </span>
                  <span className="text-[9px] text-neutral-500 max-w-[120px]">
                    Top 5% of network operators
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. RETURN-TRIP PROBLEM VS SOLUTION VISUALIZATION */}
      <section id="empty-miles" className="py-16 sm:py-24 border-b border-neutral-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              The Economic Problem & Solution
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Turn empty kilometres into productive journeys.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              In traditional freight, up to 40% of trucks return empty. COLLABFLEET pairs returning vehicles with waiting cargo to eliminate waste.
            </p>
          </div>

          {/* Side-by-Side: Before vs After COLLABFLEET */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Before Card */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Before: Traditional Logistics
                </span>
                <span className="text-[11px] font-mono text-neutral-500 font-bold">40% Deadhead</span>
              </div>

              {/* Schematic */}
              <div className="py-6 px-4 rounded-2xl bg-black border border-neutral-900 space-y-6">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-white">Chennai Port</div>
                  <div className="flex-1 mx-4 flex items-center justify-center gap-1 text-[10px] text-neutral-400 border-b border-neutral-700 pb-1">
                    <span>Full Cargo Load (8 T)</span>
                    <span>→ 🚚 →</span>
                  </div>
                  <div className="font-bold text-white">Bengaluru</div>
                </div>

                <div className="flex items-center justify-between text-xs opacity-75">
                  <div className="font-bold text-neutral-500">Bengaluru</div>
                  <div className="flex-1 mx-4 flex items-center justify-center gap-1 text-[10px] text-red-400 border-b border-dashed border-red-800 pb-1">
                    <span>← 🚚 EMPTY RETURN (Deadhead 346 km) ←</span>
                  </div>
                  <div className="font-bold text-neutral-500">Chennai Port</div>
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Truck delivers cargo and is forced to return completely empty, wasting fuel, driver wages, and emitting unnecessary CO₂.
              </p>
            </div>

            {/* After Card */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-700 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  After: With COLLABFLEET
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">0% Empty Miles</span>
              </div>

              {/* Schematic */}
              <div className="py-6 px-4 rounded-2xl bg-black border border-neutral-900 space-y-6">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-white">Chennai Port</div>
                  <div className="flex-1 mx-4 flex items-center justify-center gap-1 text-[10px] text-white border-b border-neutral-700 pb-1">
                    <span>Primary Load</span>
                    <span>→ 🚚 →</span>
                  </div>
                  <div className="font-bold text-white">Bengaluru</div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-white">Bengaluru</div>
                  <div className="flex-1 mx-4 flex items-center justify-center gap-1 text-[10px] text-emerald-400 border-b border-emerald-500 pb-1 font-bold">
                    <span>← 🚚 AI RETURN LOAD (Electronics 8.5T) ←</span>
                  </div>
                  <div className="font-bold text-white">Chennai Port</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-300 pt-1">
                <span>Shipper savings: <strong className="text-emerald-400">Save ₹1,850</strong></span>
                <span>Fleet revenue: <strong className="text-white">+₹8,400 backhaul</strong></span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. IMPACT METRICS SECTION */}
      <section id="impact" className="py-16 sm:py-24 border-b border-neutral-200/80 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Measurable Results
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              Real Impact in India Freight
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Live impact generated through collaborative freight pooling across South India freight corridors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight font-mono">
                1,240 km
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-2">
                Empty travel avoided
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight font-mono">
                ₹32,500
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-2">
                Estimated shipper savings
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight font-mono">
                420 kg
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-2">
                CO₂ reduction
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight font-mono">
                88.4%
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-2">
                Truck space utilization
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. ROLE-BASED GET STARTED CALL TO ACTION */}
      <section id="role-selection" className="py-20 sm:py-28 bg-white dark:bg-neutral-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-left space-y-6">
          
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Account Onboarding
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              How will you use CollabFleet?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Choose your primary role to launch the tailored map-first workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* Option A: Shipper */}
            <div 
              onClick={() => handleSelectRoleAndProceed('shipper')}
              className="p-6 sm:p-8 rounded-3xl border-2 border-neutral-200/90 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all cursor-pointer bg-[#F7F7F5] dark:bg-neutral-900 group shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-xl space-y-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold shadow-sm">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white group-hover:translate-x-0.5 transition-transform">
                  I need a truck
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Find the right truck for your cargo with instant return-trip capacity and verified drivers.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs font-extrabold text-neutral-900 dark:text-white">
                <span>Continue as Shipper</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Option B: Fleet Owner */}
            <div 
              onClick={() => handleSelectRoleAndProceed('fleet_operator')}
              className="p-6 sm:p-8 rounded-3xl border-2 border-neutral-200/90 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all cursor-pointer bg-[#F7F7F5] dark:bg-neutral-900 group shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-xl space-y-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white group-hover:translate-x-0.5 transition-transform">
                  I have trucks
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Find high-paying freight for your available capacity and eliminate empty deadhead trips.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs font-extrabold text-neutral-900 dark:text-white">
                <span>Continue as Fleet Owner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Minimalist Premium Footer */}
      <footer className="py-14 border-t border-neutral-900 bg-black text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-neutral-900">
            
            {/* Col 1: Brand */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-black">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-sm text-white">COLLABFLEET</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">
                Move More. Waste Less.
              </p>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Next-generation freight capacity exchange connecting verified carriers and shippers with zero commission deadhead matching.
              </p>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">Product</div>
              <ul className="space-y-1.5 text-[11px] text-neutral-400">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#explainable-ai" className="hover:text-white transition-colors">AI Intelligence</a></li>
                <li><a href="#collaboration-score" className="hover:text-white transition-colors">Collaboration Score</a></li>
                <li><a href="#impact" className="hover:text-white transition-colors">Impact Analytics</a></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">Company</div>
              <ul className="space-y-1.5 text-[11px] text-neutral-400">
                <li><span className="hover:text-white cursor-pointer transition-colors">About Us</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">India Freight Network</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Careers</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Contact</span></li>
              </ul>
            </div>

            {/* Col 4: Legal */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">Legal</div>
              <ul className="space-y-1.5 text-[11px] text-neutral-400">
                <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Security</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Compliance</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
            <div>
              © 2026 COLLABFLEET. All rights reserved.
            </div>
            <div>
              Built with Leaflet, OpenStreetMap, React & FastAPI
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};