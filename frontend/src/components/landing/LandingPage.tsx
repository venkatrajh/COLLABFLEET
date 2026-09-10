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

export const LandingPage: React.FC = () => {
  const { setActiveView, setRole } = useApp();

  // 1. Rotating Value Proposition Headline
  const HEADLINES = [
    { main: 'Move More.\nWaste Less.', sub: 'AI-powered freight matching that connects shipments with available truck capacity and smarter return journeys.' },
    { main: 'Turn Empty Miles\nInto Value.', sub: 'Eliminate deadhead kilometers with intelligent multi-factor matching for shippers and fleet operators.' },
    { main: 'Smarter Freight.\nBetter Trips.', sub: 'Real-time collaborative capacity pooling that reduces logistics spend and lowers carbon emissions.' }
  ];

  const [headlineIdx, setHeadlineIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIdx(prev => (prev + 1) % HEADLINES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

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
              <span className="px-1.5 py-0.5 text-[9px] font-black tracking-widest uppercase bg-neutral-800 text-neutral-200 rounded">
                AI
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

      {/* 2. HERO SECTION — LEFT-ALIGNED COMPACT GRID */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-neutral-200/80 dark:border-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content (Columns 1-7) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              
              {/* Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-bold text-neutral-800 dark:text-neutral-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                <span>Next-Gen Freight Capacity Exchange</span>
              </div>

              {/* Animated Rotating Headline */}
              <div className="min-h-[120px] sm:min-h-[150px] flex flex-col justify-start">
                <h1 
                  key={headlineIdx} 
                  className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] whitespace-pre-line animate-text-transition text-neutral-900 dark:text-white"
                >
                  {HEADLINES[headlineIdx].main}
                </h1>
              </div>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal max-w-xl leading-relaxed">
                {HEADLINES[headlineIdx].sub}
              </p>

              {/* Direct CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    const el = document.getElementById('role-selection');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs sm:text-sm shadow-lg hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-5 py-3 rounded-2xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Trust Information */}
              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-wrap items-center gap-6 text-xs text-neutral-500 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-black dark:text-white" />
                  <span>Instant Return-Trip Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-black dark:text-white" />
                  <span>Explainable AI Reasoning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-black dark:text-white" />
                  <span>Live Map Telemetry</span>
                </div>
              </div>

            </div>

            {/* Right Visual Element (Columns 8-12) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-2xl overflow-hidden animate-float">
                
                {/* Live Corridor Status Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white animate-ping" />
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">Active Corridor Match</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-black text-white dark:bg-white dark:text-black text-[10px] font-extrabold">
                    94% AI Fit
                  </span>
                </div>

                {/* Simulated Graphic of India Route */}
                <div className="relative h-64 rounded-2xl bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 p-4 flex flex-col justify-between overflow-hidden">
                  
                  {/* Background grid */}
                  <div className="absolute inset-0 opacity-15 dark:opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Route Nodes */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-neutral-400 block">Pickup Hub</span>
                      <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">Chennai Port</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono font-bold text-neutral-500">346 km</span>
                      <div className="w-24 h-0.5 bg-neutral-300 dark:bg-neutral-700 relative my-1">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black dark:bg-white flex items-center justify-center text-[7px] text-white dark:text-black shadow">
                          ▶
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold text-neutral-700 dark:text-neutral-300">Return Corridor</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-neutral-400 block">Destination</span>
                      <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">Bengaluru Inland</span>
                    </div>
                  </div>

                  {/* Live Matched Truck Badge */}
                  <div className="relative z-10 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-black shadow-sm">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-neutral-900 dark:text-white">Ashok Leyland 1618</div>
                        <div className="text-[10px] text-neutral-500">8.5 T available · 12 min away</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-neutral-900 dark:text-white">₹8,400</div>
                      <div className="text-[9px] font-bold text-neutral-500">Save ₹1,850</div>
                    </div>
                  </div>

                  {/* Metric Ribbon */}
                  <div className="relative z-10 grid grid-cols-3 gap-2 text-center pt-2 border-t border-neutral-200/60 dark:border-neutral-900">
                    <div>
                      <div className="text-[9px] text-neutral-400 font-semibold uppercase">Deadhead Saved</div>
                      <div className="text-xs font-black text-neutral-900 dark:text-white">67 km</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-neutral-400 font-semibold uppercase">CO₂ Avoided</div>
                      <div className="text-xs font-black text-neutral-900 dark:text-white">38 kg</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-neutral-400 font-semibold uppercase">Driver Score</div>
                      <div className="text-xs font-black text-neutral-900 dark:text-white">★ 4.9</div>
                    </div>
                  </div>

                </div>

                <div className="text-[10px] text-neutral-500 text-center mt-2.5 font-medium">
                  Interactive real-time map active upon application launch
                </div>

              </div>
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

      {/* 5. COLLABORATION / EMPTY MILES SECTION */}
      <section id="empty-miles" className="py-16 sm:py-24 border-b border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              The Economic Problem
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              Turn empty miles into opportunity.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              When trucks return with unused capacity, CollabFleet connects them with nearby freight instead of letting that capacity go to waste.
            </p>
          </div>

          {/* Visual Transformation Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 items-center">
            
            <div className="p-5 rounded-2xl bg-[#F7F7F5] dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] font-bold uppercase text-neutral-400 block">Stage 1</span>
              <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">Empty Return Trip</h4>
              <p className="text-[11px] text-neutral-500">
                Truck unloads at destination and faces empty kilometers heading back home.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F7F5] dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] font-bold uppercase text-neutral-400 block">Stage 2</span>
              <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">AI Discovers Freight</h4>
              <p className="text-[11px] text-neutral-500">
                CollabFleet algorithms find compatible shipments along that exact return path.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F7F5] dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] font-bold uppercase text-neutral-400 block">Stage 3</span>
              <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">Shared Capacity</h4>
              <p className="text-[11px] text-neutral-500">
                Multiple shippers or return freight seamlessly book the unutilized space.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white space-y-1.5 shadow-md">
              <span className="text-[9px] font-bold uppercase opacity-75 block">Outcome</span>
              <h4 className="text-xs sm:text-sm font-black">Lower Waste & High Profit</h4>
              <p className="text-[11px] opacity-90">
                Shippers save up to 25% on freight, and fleet owners double their trip revenue.
              </p>
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

      {/* 8. Minimalist Monochrome Footer */}
      <footer className="py-10 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-white">COLLABFLEET AI</span>
            <span>· Collaborative Logistics Intelligence</span>
          </div>
          <div>
            Built with Leaflet, OpenStreetMap, React & FastAPI
          </div>
        </div>
      </footer>

    </div>
  );
};