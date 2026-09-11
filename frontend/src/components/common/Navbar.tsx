import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import { 
  Truck, 
  Search, 
  PlusCircle, 
  Package, 
  Boxes, 
  Sparkles, 
  User, 
  Maximize2, 
  Minimize2, 
  LogOut 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    setRole, 
    activeView, 
    setActiveView, 
    userProfile,
    isMapExpanded,
    toggleMapExpanded,
    logoutUser
  } = useApp();

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
  };

  return (
    <header className="fixed top-3 left-3 right-3 sm:top-4 sm:left-6 sm:right-6 z-40 max-w-7xl mx-auto pointer-events-none">
      <div className="glass-panel rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between border shadow-lg pointer-events-auto">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick(currentRole === 'fleet_operator' ? 'find_freight' : 'home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black transition-transform group-hover:scale-105 shadow-sm">
            <Truck className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight font-sans text-neutral-900 dark:text-white">
              COLLABFLEET
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Strictly Role-Specific) */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900/80 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800">
          
          {currentRole === 'shipper' ? (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeView === 'home' || activeView === 'find_truck' || activeView === 'matching_results'
                    ? 'glass-selected font-black text-[#111111] dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-semibold'
                }`}
              >
                Find a Truck
              </button>

              <button
                onClick={() => handleNavClick('post_shipment')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeView === 'post_shipment'
                    ? 'glass-selected font-black text-[#111111] dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-semibold'
                }`}
              >
                Post a Shipment
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('find_freight')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeView === 'find_freight'
                    ? 'glass-selected font-black text-[#111111] dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-semibold'
                }`}
              >
                Find Freight
              </button>

              <button
                onClick={() => handleNavClick('my_trucks')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeView === 'my_trucks'
                    ? 'glass-selected font-black text-[#111111] dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-semibold'
                }`}
              >
                My Trucks
              </button>
            </>
          )}

          <button
            onClick={() => handleNavClick('my_shipments')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeView === 'my_shipments' || activeView === 'track_shipment'
                ? 'glass-selected font-black text-[#111111] dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-semibold'
            }`}
          >
            My Shipments
          </button>

          <button
            onClick={() => handleNavClick('smart_insights')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeView === 'smart_insights'
                ? 'glass-selected font-black text-[#111111] dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-semibold'
            }`}
          >
            Smart Insights
          </button>
        </nav>

        {/* Right Section: Expand Map, Role Segment, Theme Toggle, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Expand / Collapse Map Viewport */}
          <button
            onClick={toggleMapExpanded}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isMapExpanded 
                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md' 
                : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white'
            }`}
            title={isMapExpanded ? 'Restore UI panels' : 'Maximize Map View'}
          >
            {isMapExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Collapse</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Expand Map</span>
              </>
            )}
          </button>

          {/* Role Segment Toggle */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setRole('shipper')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'shipper'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Shipper
            </button>
            <button
              onClick={() => setRole('fleet_operator')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'fleet_operator'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Fleet
            </button>
          </div>

          {/* Profile Trigger */}
          <button
            onClick={() => handleNavClick('profile')}
            className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center text-xs font-extrabold border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors"
            title="Open Profile"
            aria-label="Profile"
          >
            {userProfile.name.charAt(0)}
          </button>

          {/* Logout Button */}
          <button
            onClick={logoutUser}
            className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-red-500 flex items-center justify-center transition-colors"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
