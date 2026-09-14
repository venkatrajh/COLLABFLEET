import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  Package, 
  Truck
} from 'lucide-react';
import { HeroNetworkVisual } from './HeroNetworkVisual';
import { Hero3DLogisticsCanvas } from './Hero3DLogisticsCanvas';
import { CollaborativeTruckVisual } from './CollaborativeTruckVisual';
import logoMark from '../../assets/branding/collabfleet-logo-mark.png';

export const LandingPage: React.FC = () => {
  const { setActiveView, setRole } = useApp();

  // 1. Rotating Animated Value Proposition Headline (Preserved 100%)
  const HEADLINES = [
    { main: 'Move More.\nWaste Less.', sub: 'AI-powered freight matching connecting shipments with available truck capacity and smarter return journeys.' },
    { main: 'Smarter Freight\nMatching.', sub: 'Intelligent multi-factor scoring connecting shippers with verified carriers in seconds.' },
    { main: 'Better Return\nJourneys.', sub: 'Eliminating deadhead kilometers by converting empty return trips into profitable revenue.' },
    { main: 'Less Empty\nCapacity.', sub: 'Turn unused container space and wasted volume into collaborative backhaul freight.' },
    { main: 'Better Fleet\nUtilization.', sub: 'Maximizing truck trip earnings while reducing empty kilometers and emissions across India.' }
  ];

  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIdx(prev => (prev + 1) % HEADLINES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [HEADLINES.length]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStepIdx(prev => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(stepTimer);
  }, []);

  // Handler for Role-Based Start
  const handleSelectRoleAndProceed = (role: UserRole) => {
    setRole(role);
    setActiveView('login');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased">
      
      {/* 1. Dedicated Minimalist Landing Navbar — Light Visual Treatment */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src={logoMark} 
              alt="COLLABFLEET" 
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain transition-transform group-hover:scale-105" 
            />
            <span className="font-black text-xl sm:text-[22px] tracking-tight font-sans text-neutral-950 leading-none select-none">
              COLLABFLEET
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-neutral-600">
            <a href="#how-it-works" className="hover:text-neutral-950 transition-colors">
              How It Works
            </a>
            <a href="#explainable-ai" className="hover:text-neutral-950 transition-colors">
              AI Intelligence
            </a>
            <a href="#empty-miles" className="hover:text-neutral-950 transition-colors">
              Collaboration
            </a>
            <a href="#impact" className="hover:text-neutral-950 transition-colors">
              Impact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('login')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('role-selection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-neutral-950 text-white font-extrabold text-xs shadow-xs hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION — PREMIUM LIGHT CANVASS WITH REFERENCE 3D TRUCK & OBJECTS */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-neutral-200/80 bg-gradient-to-b from-[#FBFBFA] via-[#F8F8F7] to-white overflow-hidden">
        
        {/* Layer 1: Faint Engineering Grid */}
        <div className="absolute inset-0 bg-engineering-grid opacity-15 pointer-events-none" />

        {/* Layer 2: Subtle Atmospheric Radial Lighting */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-cyan-500/5 via-neutral-300/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-blue-500/5 via-neutral-300/10 to-transparent blur-[100px] pointer-events-none" />

        {/* Layer 3: Faint Architectural Route Lines in background */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="20%" x2="45%" y2="55%" stroke="#0284C7" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="45%" y1="55%" x2="85%" y2="35%" stroke="#A1A1AA" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="10%" cy="20%" r="3" fill="#0284C7" />
          <circle cx="45%" cy="55%" r="3" fill="#71717A" />
          <circle cx="85%" cy="35%" r="3" fill="#0284C7" />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content (Columns 1-7) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left relative">
              
              {/* Reference 3D Truck & Shipping Containers Canvas positioned naturally in background */}
              <div className="absolute -top-16 -left-10 sm:-left-16 w-[125%] h-[420px] pointer-events-none opacity-85 overflow-visible z-0">
                <Hero3DLogisticsCanvas className="w-full h-full" />
              </div>

              {/* Eyebrow Label */}
              <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-neutral-200 text-[11px] font-bold text-neutral-800 shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                <span>Next-Gen Freight Capacity Exchange</span>
              </div>

              {/* Animated Rotating Headline (Centered within the 3D orbit) */}
              <div className="relative z-10 min-h-[120px] sm:min-h-[150px] flex flex-col justify-start">
                <h1 
                  key={headlineIdx} 
                  className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] whitespace-pre-line animate-text-transition text-neutral-950"
                >
                  {HEADLINES[headlineIdx].main}
                </h1>
              </div>

              {/* Supporting Text */}
              <p className="relative z-10 text-sm sm:text-base text-neutral-600 font-normal max-w-xl leading-relaxed">
                AI-powered freight matching connecting shipments with available truck capacity and smarter return journeys.
              </p>

              {/* Direct CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    const el = document.getElementById('role-selection');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-neutral-950 text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-900 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Trust Information */}
              <div className="pt-4 border-t border-neutral-200/80 flex flex-wrap items-center gap-6 text-xs text-neutral-600 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
                  <span>Instant Return-Trip Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
                  <span>Explainable AI Reasoning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
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

      {/* 3. HOW COLLABFLEET WORKS (5 STEPS CONNECTED JOURNEY) */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              The Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              How COLLABFLEET Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Connecting available capacity to urgent freight in five seamless, automated steps. Click any step to inspect the live workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {[
              { step: '01', title: "Shipment Request", desc: 'Specify pickup, destination, cargo weight, and vehicle type.' },
              { step: '02', title: 'Available Capacity', desc: 'Scan active corridors for trucks already scheduled or returning nearby.' },
              { step: '03', title: 'Smart Matching', desc: 'Multi-factor weighted evaluation of capacity fit, detour, and driver rating.' },
              { step: '04', title: 'Collaboration & Book', desc: 'Review transparent scores and natural-language reasoning before booking.' },
              { step: '05', title: 'Live Tracking', desc: 'Real-time telemetry with simulated milestones from dispatch to delivery.' }
            ].map((s, idx) => {
              const isActive = activeStepIdx === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer text-left space-y-2.5 ${
                    isActive 
                      ? 'bg-neutral-950 text-white shadow-xl ring-2 ring-neutral-900/20 -translate-y-1' 
                      : 'bg-[#F8F8F7] border border-neutral-200/80 hover:border-neutral-400 text-neutral-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xl font-mono font-black ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`}>
                      {s.step}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <h3 className={`text-xs sm:text-sm font-extrabold leading-snug ${isActive ? 'text-white' : 'text-neutral-950'}`}>
                    {s.title}
                  </h3>
                  <p className={`text-[11px] leading-relaxed ${isActive ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Step Visual Showcase */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F7] border border-neutral-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
              <span className="text-neutral-500 font-medium">Step 0{activeStepIdx + 1} Active:</span>
              <span className="font-extrabold text-neutral-950">
                {activeStepIdx === 0 && "1. Shipment Entry: Route specified between Chennai Hub and Bengaluru Depot (8 Tons)"}
                {activeStepIdx === 1 && "2. Capacity Engine: 25 commercial carriers actively transmitting available return space"}
                {activeStepIdx === 2 && "3. AI Evaluation: Multi-factor algorithms assessing Capacity Fit (95%) and Deadhead Reduction"}
                {activeStepIdx === 3 && "4. Backhaul Booking: Instant match confirmed with driver Rajesh Kumar · CF-48291 generated"}
                {activeStepIdx === 4 && "5. Highway Telemetry: GPS tracking active at 58 km/h on NH48 with live milestone status"}
              </span>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('role-selection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-neutral-950 underline underline-offset-4 hover:opacity-80 shrink-0"
            >
              Try Experience →
            </button>
          </div>

        </div>
      </section>

      {/* 4. EXPLAINABLE AI SECTION */}
      <section id="explainable-ai" className="py-16 sm:py-24 border-b border-neutral-200/80 bg-[#FBFBFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Transparent Intelligence
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
                AI that explains itself.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Every match shows how truck capacity and collaborative co-loading are calculated in real time. Transparent, verifiable, and optimized for zero empty space.
              </p>

              {/* 2-3 short, concise points */}
              <div className="space-y-3 pt-2 text-xs text-neutral-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-neutral-950">50% Scheduled Base Load:</strong> Carrier booked on Chennai–Bengaluru corridor with 50% open capacity.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-cyan-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-neutral-950">30% + 20% Compatible Feeder Cargo:</strong> Algorithmic pairing fills residual volume from verified shippers on the route.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-neutral-950">100% Zero-Waste Journey:</strong> Eliminates deadhead return miles and maximizes earnings per kilometer.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card Showcase - Prominent Collaborative Truck Visual */}
            <div className="lg:col-span-7 text-left w-full">
              <CollaborativeTruckVisual />
            </div>

          </div>
        </div>
      </section>

      {/* 5. COLLABORATION SCORE SECTION */}
      <section id="collaboration-score" className="py-16 sm:py-24 border-b border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ecosystem Contribution Index</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
                Collaboration Score
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl">
                A proprietary metric measuring how effectively a fleet operator or shipper contributes to shared freight capacity, backhaul fulfillment, and deadhead elimination.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F8F8F7] border border-neutral-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Space Sharing</div>
                  <div className="font-extrabold text-neutral-950 text-sm">96%</div>
                  <div className="text-[10px] text-neutral-600">Shared volume utilization</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8F8F7] border border-neutral-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Backhaul Ratio</div>
                  <div className="font-extrabold text-neutral-950 text-sm">92%</div>
                  <div className="text-[10px] text-neutral-600">Return legs monetized</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8F8F7] border border-neutral-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Partner Trust</div>
                  <div className="font-extrabold text-neutral-950 text-sm">★ 4.95</div>
                  <div className="text-[10px] text-neutral-600">Zero default records</div>
                </div>
              </div>
            </div>

            {/* Right Circular Gauge */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 rounded-full bg-[#F8F8F7] border border-neutral-200/90 flex flex-col items-center justify-center p-6 shadow-sm">
                
                {/* Outer SVG Ring */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-neutral-200"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-neutral-950"
                    strokeWidth="6"
                    strokeDasharray={264}
                    strokeDashoffset={264 * (1 - 0.94)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center space-y-0.5">
                  <span className="text-4xl sm:text-5xl font-black text-neutral-950 font-mono tracking-tight">
                    94
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-700">
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
      <section id="empty-miles" className="py-16 sm:py-24 border-b border-neutral-200/80 bg-[#FBFBFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              The Economic Problem & Solution
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              Turn empty kilometres into productive journeys.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              In traditional freight, up to 40% of trucks return empty. COLLABFLEET pairs returning vehicles with waiting cargo to eliminate waste.
            </p>
          </div>

          {/* Side-by-Side: Before vs After COLLABFLEET */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Before Card */}
            <div className="p-6 rounded-3xl bg-white border border-red-200/80 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Before: Traditional Logistics
                </span>
                <span className="text-[11px] font-mono text-neutral-500 font-bold">40% Deadhead</span>
              </div>

              {/* Schematic */}
              <div className="py-6 px-4 rounded-2xl bg-[#FFF5F5] border border-red-100 space-y-6">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-neutral-950">Chennai Port</div>
                  <div className="flex-1 mx-4 flex items-center justify-center gap-1 text-[10px] text-neutral-600 border-b border-neutral-300 pb-1">
                    <span>Full Cargo Load (8 T)</span>
                    <span>→ 🚚 →</span>
                  </div>
                  <div className="font-bold text-neutral-950">Bengaluru</div>
                </div>

                <div className="flex items-center justify-between text-xs opacity-85">
                  <div className="font-bold text-neutral-600">Bengaluru</div>
                  <div className="flex-1 mx-4 flex items-center justify-center gap-1 text-[10px] text-red-600 border-b border-dashed border-red-300 pb-1 font-bold">
                    <span>← 🚚 EMPTY RETURN (Deadhead 346 km) ←</span>
                  </div>
                  <div className="font-bold text-neutral-600">Chennai Port</div>
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Truck delivers cargo and is forced to return completely empty, wasting fuel, driver wages, and emitting unnecessary CO₂.
              </p>
            </div>

            {/* After Card */}
            <div className="p-6 rounded-3xl bg-white border border-emerald-200/90 space-y-4 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  After: With COLLABFLEET
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold">0% Empty Miles</span>
              </div>

              {/* Schematic */}
              <div className="py-6 px-4 rounded-2xl bg-[#F0FDF4] border border-emerald-100 space-y-6">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-neutral-950">Chennai Port</div>
                  <div className="flex-1 mx-4 flex items-center justify-center gap-1 text-[10px] text-neutral-700 border-b border-neutral-300 pb-1">
                    <span>Primary Load</span>
                    <span>→ 🚚 →</span>
                  </div>
                  <div className="font-bold text-neutral-950">Bengaluru</div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-neutral-950">Bengaluru</div>
                  <div className="flex-1 mx-4 flex items-center justify-center gap-1 text-[10px] text-emerald-700 border-b border-emerald-400 pb-1 font-bold">
                    <span>← 🚚 AI RETURN LOAD (Electronics 8.5T) ←</span>
                  </div>
                  <div className="font-bold text-neutral-950">Chennai Port</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-700 pt-1">
                <span>Shipper savings: <strong className="text-emerald-700">Save ₹1,850</strong></span>
                <span>Fleet revenue: <strong className="text-neutral-950">+₹8,400 backhaul</strong></span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. IMPACT METRICS SECTION */}
      <section id="impact" className="py-16 sm:py-24 border-b border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Measurable Results
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              Real Impact in India Freight
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Live impact generated through collaborative freight pooling across South India freight corridors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#F8F8F7] border border-neutral-200/80 shadow-xs">
              <div className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight font-mono">
                1,240 km
              </div>
              <div className="text-xs text-neutral-600 font-semibold mt-2">
                Empty travel avoided
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-[#F8F8F7] border border-neutral-200/80 shadow-xs">
              <div className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight font-mono">
                ₹32,500
              </div>
              <div className="text-xs text-neutral-600 font-semibold mt-2">
                Estimated shipper savings
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-[#F8F8F7] border border-neutral-200/80 shadow-xs">
              <div className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight font-mono">
                420 kg
              </div>
              <div className="text-xs text-neutral-600 font-semibold mt-2">
                CO₂ reduction
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-[#F8F8F7] border border-neutral-200/80 shadow-xs">
              <div className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight font-mono">
                88.4%
              </div>
              <div className="text-xs text-neutral-600 font-semibold mt-2">
                Truck space utilization
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. ROLE-BASED GET STARTED CALL TO ACTION */}
      <section id="role-selection" className="py-20 sm:py-28 bg-[#FBFBFA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-left space-y-6">
          
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Account Onboarding
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              How will you use COLLABFLEET?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Choose your primary role to launch the tailored map-first workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* Option A: Shipper */}
            <div 
              onClick={() => handleSelectRoleAndProceed('shipper')}
              className="p-6 sm:p-8 rounded-3xl border-2 border-neutral-200 hover:border-neutral-950 transition-all cursor-pointer bg-white group shadow-xs hover:shadow-xl space-y-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold shadow-xs">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-950 group-hover:translate-x-0.5 transition-transform">
                  I need a truck
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Find the right truck for your cargo with instant return-trip capacity and verified drivers.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/80 flex items-center justify-between text-xs font-extrabold text-neutral-950">
                <span>Continue as Shipper</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Option B: Fleet Owner */}
            <div 
              onClick={() => handleSelectRoleAndProceed('fleet_operator')}
              className="p-6 sm:p-8 rounded-3xl border-2 border-neutral-200 hover:border-neutral-950 transition-all cursor-pointer bg-white group shadow-xs hover:shadow-xl space-y-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-950 group-hover:translate-x-0.5 transition-transform">
                  I have trucks
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Find high-paying freight for your available capacity and eliminate empty deadhead trips.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/80 flex items-center justify-between text-xs font-extrabold text-neutral-950">
                <span>Continue as Fleet Owner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Minimalist Premium Footer — Light Visual Treatment */}
      <footer className="py-14 border-t border-neutral-200/80 bg-white text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-neutral-100">
            
            {/* Col 1: Brand */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-black">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-sm text-neutral-950">COLLABFLEET</span>
              </div>
              <p className="text-[11px] text-neutral-800 font-medium">
                Move More. Waste Less.
              </p>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Next-generation freight capacity exchange connecting verified carriers and shippers with zero commission deadhead matching.
              </p>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">Product</div>
              <ul className="space-y-1.5 text-[11px] text-neutral-600">
                <li><a href="#how-it-works" className="hover:text-neutral-950 transition-colors">How It Works</a></li>
                <li><a href="#explainable-ai" className="hover:text-neutral-950 transition-colors">AI Intelligence</a></li>
                <li><a href="#collaboration-score" className="hover:text-neutral-950 transition-colors">Collaboration Score</a></li>
                <li><a href="#impact" className="hover:text-neutral-950 transition-colors">Impact Analytics</a></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">Company</div>
              <ul className="space-y-1.5 text-[11px] text-neutral-600">
                <li><span className="hover:text-neutral-950 cursor-pointer transition-colors">About Us</span></li>
                <li><span className="hover:text-neutral-950 cursor-pointer transition-colors">India Freight Network</span></li>
                <li><span className="hover:text-neutral-950 cursor-pointer transition-colors">Careers</span></li>
                <li><a href="http://localhost:5174" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 transition-colors text-neutral-900 font-semibold flex items-center gap-1">Admin Console (5174) <ArrowRight className="w-3 h-3" /></a></li>
              </ul>
            </div>

            {/* Col 4: Legal */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">Legal</div>
              <ul className="space-y-1.5 text-[11px] text-neutral-600">
                <li><span className="hover:text-neutral-950 cursor-pointer transition-colors">Privacy Policy</span></li>
                <li><span className="hover:text-neutral-950 cursor-pointer transition-colors">Terms of Service</span></li>
                <li><span className="hover:text-neutral-950 cursor-pointer transition-colors">Security</span></li>
                <li><span className="hover:text-neutral-950 cursor-pointer transition-colors">Compliance</span></li>
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