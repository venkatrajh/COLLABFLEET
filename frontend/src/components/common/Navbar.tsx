import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import { 
  Truck, 
  Search, 
  PlusCircle, 
  Package, 
  Boxes, 
  TrendingUp, 
  User, 
  Repeat, 
  Sparkles,
  MapPin
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    setRole, 
    activeView, 
    setActiveView, 
    userProfile,
    setIsAuthModalOpen
  } = useApp();

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-40 max-w-7xl mx-auto pointer-events-none">
      <div className="glass-panel rounded-2xl px-4 py-3 flex items-center justify-between border border-white/10 shadow-glass pointer-events-auto">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan via-brand-blue to-sky-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5 text-dark-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-white font-sans">
                COLLAB<span className="text-brand-cyan">FLEET</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan rounded-md">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Uber for Collaborative Freight
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-dark-900/60 p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'home'
                ? 'bg-brand-cyan/15 text-brand-cyan shadow-sm border border-brand-cyan/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>

          {currentRole === 'shipper' ? (
            <>
              <button
                onClick={() => handleNavClick('find_truck')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeView === 'find_truck' || activeView === 'matching_results'
                    ? 'bg-brand-cyan/15 text-brand-cyan shadow-sm border border-brand-cyan/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Find a Truck
              </button>

              <button
                onClick={() => handleNavClick('post_shipment')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeView === 'post_shipment'
                    ? 'bg-brand-cyan/15 text-brand-cyan shadow-sm border border-brand-cyan/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Post a Shipment
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('find_freight')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeView === 'find_freight'
                    ? 'bg-brand-cyan/15 text-brand-cyan shadow-sm border border-brand-cyan/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                Find Freight
              </button>

              <button
                onClick={() => handleNavClick('my_trucks')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeView === 'my_trucks'
                    ? 'bg-brand-cyan/15 text-brand-cyan shadow-sm border border-brand-cyan/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                My Trucks
              </button>
            </>
          )}

          <button
            onClick={() => handleNavClick('my_shipments')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'my_shipments' || activeView === 'track_shipment'
                ? 'bg-brand-cyan/15 text-brand-cyan shadow-sm border border-brand-cyan/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            My Shipments
          </button>

          <button
            onClick={() => handleNavClick('smart_insights')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'smart_insights'
                ? 'bg-brand-cyan/15 text-brand-cyan shadow-sm border border-brand-cyan/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            Smart Insights
          </button>
        </nav>

        {/* Right Controls: Role Switcher & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher */}
          <div className="flex items-center bg-dark-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setRole('shipper')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'shipper'
                  ? 'bg-brand-cyan text-dark-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Shipper Mode"
            >
              Shipper
            </button>
            <button
              onClick={() => setRole('fleet_operator')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'fleet_operator'
                  ? 'bg-brand-cyan text-dark-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Fleet Operator Mode"
            >
              Fleet Owner
            </button>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all ${
              activeView === 'profile'
                ? 'bg-brand-cyan/20 border-brand-cyan/50 text-white'
                : 'bg-dark-900/80 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-blue to-cyan-400 flex items-center justify-center text-xs font-bold text-dark-950">
              {userProfile.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold hidden sm:inline-block max-w-[100px] truncate">
              {userProfile.name}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
