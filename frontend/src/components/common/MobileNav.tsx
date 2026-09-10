import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import { Home, Search, Package, Truck, User, Sparkles } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentRole, activeView, setActiveView } = useApp();

  const isFindActive = activeView === 'find_truck' || activeView === 'matching_results' || activeView === 'find_freight';
  const isShipmentsActive = activeView === 'my_shipments' || activeView === 'track_shipment' || activeView === 'post_shipment';
  const isTrucksActive = activeView === 'my_trucks';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-950/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 safe-bottom">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeView === 'home' ? 'text-brand-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        {/* Find (Truck or Freight) */}
        <button
          onClick={() => setActiveView(currentRole === 'shipper' ? 'find_truck' : 'find_freight')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isFindActive ? 'text-brand-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Find</span>
        </button>

        {/* Shipments */}
        <button
          onClick={() => setActiveView('my_shipments')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isShipmentsActive ? 'text-brand-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Shipments</span>
        </button>

        {/* Trucks (or Insights) */}
        <button
          onClick={() => setActiveView(currentRole === 'fleet_operator' ? 'my_trucks' : 'smart_insights')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            (currentRole === 'fleet_operator' && isTrucksActive) || (currentRole === 'shipper' && activeView === 'smart_insights')
              ? 'text-brand-cyan'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {currentRole === 'fleet_operator' ? (
            <Truck className="w-5 h-5" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <span className="text-[10px] font-semibold">
            {currentRole === 'fleet_operator' ? 'Trucks' : 'Insights'}
          </span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeView === 'profile' ? 'text-brand-cyan' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </div>
    </div>
  );
};
