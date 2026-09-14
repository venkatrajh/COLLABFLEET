import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import { NotificationBell } from '../notifications/NotificationBell';
import logoMark from '../../assets/branding/collabfleet-logo-mark.png';
import { 
  Maximize2, 
  Minimize2, 
  LogOut 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
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
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-neutral-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick(currentRole === 'fleet_operator' ? 'find_freight' : 'home')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
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

        {/* Desktop Navigation Tabs (Strictly Role-Specific) */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
          
          {currentRole === 'shipper' ? (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeView === 'home'
                    ? 'bg-white font-black text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950 font-semibold'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick('find_truck')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeView === 'find_truck' || activeView === 'matching_results'
                    ? 'bg-white font-black text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950 font-semibold'
                }`}
              >
                Find a Truck
              </button>

              <button
                onClick={() => handleNavClick('post_shipment')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeView === 'post_shipment'
                    ? 'bg-white font-black text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950 font-semibold'
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
                    ? 'bg-white font-black text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950 font-semibold'
                }`}
              >
                Find Freight
              </button>

              <button
                onClick={() => handleNavClick('my_trucks')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeView === 'my_trucks'
                    ? 'bg-white font-black text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950 font-semibold'
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
                ? 'bg-white font-black text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 font-semibold'
            }`}
          >
            My Shipments
          </button>

          <button
            onClick={() => handleNavClick('smart_insights')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeView === 'smart_insights'
                ? 'bg-white font-black text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 font-semibold'
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
                ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs' 
                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/60'
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

          {/* Notifications Center */}
          <NotificationBell />

          {/* Profile Trigger */}
          <button
            onClick={() => handleNavClick('profile')}
            className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center text-xs font-extrabold border border-neutral-200 hover:border-neutral-950 transition-colors"
            title="Open Profile"
            aria-label="Profile"
          >
            {userProfile.name.charAt(0)}
          </button>

          {/* Logout Button */}
          <button
            onClick={logoutUser}
            className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-red-600 flex items-center justify-center transition-colors"
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
