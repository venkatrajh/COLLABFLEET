import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Search, Package, Truck, User, Sparkles } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentRole, activeView, setActiveView } = useApp();

  const isFindActive = activeView === 'find_truck' || activeView === 'matching_results' || activeView === 'find_freight';
  const isShipmentsActive = activeView === 'my_shipments' || activeView === 'track_shipment' || activeView === 'post_shipment';
  const isTrucksActive = activeView === 'my_trucks';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 px-2 py-2 safe-bottom pointer-events-auto">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeView === 'home' ? 'text-black dark:text-white font-bold' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Find (Truck or Freight) */}
        <button
          onClick={() => setActiveView(currentRole === 'shipper' ? 'find_truck' : 'find_freight')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isFindActive ? 'text-black dark:text-white font-bold' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px]">Find</span>
        </button>

        {/* Shipments */}
        <button
          onClick={() => setActiveView('my_shipments')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isShipmentsActive ? 'text-black dark:text-white font-bold' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span className="text-[10px]">Shipments</span>
        </button>

        {/* Trucks or Insights */}
        <button
          onClick={() => setActiveView(currentRole === 'fleet_operator' ? 'my_trucks' : 'smart_insights')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            (currentRole === 'fleet_operator' && isTrucksActive) || (currentRole === 'shipper' && activeView === 'smart_insights')
              ? 'text-black dark:text-white font-bold'
              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          {currentRole === 'fleet_operator' ? (
            <Truck className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span className="text-[10px]">
            {currentRole === 'fleet_operator' ? 'Trucks' : 'Insights'}
          </span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeView === 'profile' ? 'text-black dark:text-white font-bold' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </div>
  );
};
