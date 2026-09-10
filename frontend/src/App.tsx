import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Toast } from './components/common/Toast';
import { MapView } from './components/map/MapView';
import { SearchPanel } from './components/matching/SearchPanel';
import { TruckCard } from './components/matching/TruckCard';
import { AILoadingModal } from './components/matching/AILoadingModal';
import { WhyThisTruckModal } from './components/matching/WhyThisTruckModal';
import { TruckDetailModal } from './components/matching/TruckDetailModal';
import { BookingModal } from './components/booking/BookingModal';
import { BookingSuccess } from './components/booking/BookingSuccess';
import { TrackingPanel } from './components/tracking/TrackingPanel';
import { PostShipmentView } from './components/shipments/PostShipmentView';
import { MyShipmentsView } from './components/shipments/MyShipmentsView';
import { FindFreightView } from './components/fleet/FindFreightView';
import { MyTrucksView } from './components/fleet/MyTrucksView';
import { SmartInsightsView } from './components/insights/SmartInsightsView';
import { ProfileView } from './components/auth/ProfileView';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { ArrowLeft, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

export const App: React.FC = () => {
  const { 
    isAuthenticated,
    activeView, 
    setActiveView, 
    currentRole,
    matchingResults, 
    searchQuery,
    selectedMatch,
    isSearchPanelCollapsed,
    setIsSearchPanelCollapsed,
    isMapExpanded,
    toggleMapExpanded
  } = useApp();

  // Guard protected routes if unauthenticated
  useEffect(() => {
    if (!isAuthenticated && activeView !== 'landing' && activeView !== 'login') {
      setActiveView('landing');
    }
  }, [isAuthenticated, activeView, setActiveView]);

  // 1. Unauthenticated: Full Landing Page Experience
  if (!isAuthenticated && activeView === 'landing') {
    return (
      <div className="relative w-screen min-h-screen bg-neutral-50 dark:bg-black font-sans">
        <LandingPage />
        <Toast />
      </div>
    );
  }

  // 2. Authentication: Role-Selection + Login Page
  if (!isAuthenticated && activeView === 'login') {
    return (
      <div className="relative w-screen min-h-screen bg-neutral-50 dark:bg-black font-sans">
        <LoginPage />
        <Toast />
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen bg-neutral-100 dark:bg-black text-neutral-900 dark:text-neutral-100 overflow-x-hidden font-sans select-none">
      
      {/* 1. Core Real Leaflet Interactive Map — Full Screen Surface */}
      <MapView />

      {/* 2. Minimalist Floating Navbar */}
      <Navbar />

      {/* 3. Main Dynamic Content Overlay (pointer-events-none so map receives mouse & touch) */}
      <main className="relative z-10 pt-20 sm:pt-24 px-3 sm:px-6 pb-20 md:pb-8 max-w-7xl mx-auto min-h-screen flex flex-col justify-start pointer-events-none">
        
        {/* VIEW: HOME (Shipper Map-First View) */}
        {activeView === 'home' && !isMapExpanded && (
          <div className="space-y-4">
            {/* Top Row: Floating Search Card on Left, Real-Time Corridor Card on Right */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pt-1">
              <SearchPanel />

              {/* Minimal Live Corridor Indicator Card */}
              <div className="hidden lg:block max-w-xs pointer-events-auto">
                <div className="glass-panel p-3.5 rounded-2xl border shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                      Live Freight Corridor
                    </span>
                    <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Chennai → Bengaluru Corridor
                  </h3>
                  <p className="text-[11px] text-neutral-500 leading-snug">
                    Tap any truck pin on the map to view live capacity and backhaul score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: FIND A TRUCK */}
        {activeView === 'find_truck' && !isMapExpanded && (
          <div className="flex items-start justify-start pt-1">
            <SearchPanel />
          </div>
        )}

        {/* VIEW: MATCHING RESULTS (Uber/Ola-style Ride Selection) */}
        {activeView === 'matching_results' && (
          <div className="flex flex-col lg:flex-row items-start gap-4 pt-1 pointer-events-none">
            
            {/* Floating Ride Matches List */}
            <div className="w-full sm:w-[380px] space-y-2.5 pointer-events-auto">
              
              {/* Header */}
              <div className="glass-panel p-3.5 rounded-2xl border shadow-lg flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setActiveView('find_truck')}
                    className="flex items-center gap-1 text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-bold mb-0.5"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change route</span>
                  </button>
                  <h2 className="text-sm font-black text-neutral-900 dark:text-white">
                    Available Matches
                  </h2>
                  <p className="text-[10px] text-neutral-500">
                    {searchQuery.fromLocation?.name || 'Chennai'} → {searchQuery.toLocation?.name || 'Bengaluru'} ({searchQuery.weightTons} T)
                  </p>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-black">
                  {matchingResults.length}
                </span>
              </div>

              {/* Scrollable list of truck cards */}
              <div className="space-y-2.5 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
                {matchingResults.map((match) => (
                  <TruckCard key={match.truck.id} match={match} />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW: POST SHIPMENT */}
        {activeView === 'post_shipment' && <PostShipmentView />}

        {/* VIEW: MY SHIPMENTS */}
        {activeView === 'my_shipments' && <MyShipmentsView />}

        {/* VIEW: TRACK SHIPMENT */}
        {activeView === 'track_shipment' && (
          <div className="flex items-start justify-start pt-1">
            <TrackingPanel />
          </div>
        )}

        {/* VIEW: FIND FREIGHT (Fleet Operator) */}
        {activeView === 'find_freight' && <FindFreightView />}

        {/* VIEW: MY TRUCKS (Fleet Operator) */}
        {activeView === 'my_trucks' && <MyTrucksView />}

        {/* VIEW: SMART INSIGHTS */}
        {activeView === 'smart_insights' && <SmartInsightsView />}

        {/* VIEW: PROFILE */}
        {activeView === 'profile' && <ProfileView />}

      </main>

      {/* 4. Global Modals & Notifications */}
      <AILoadingModal />
      <WhyThisTruckModal />
      <TruckDetailModal />
      <BookingModal />
      <BookingSuccess />
      <AuthModal />
      <Toast />

      {/* 5. Mobile Bottom Navigation */}
      <MobileNav />

    </div>
  );
};

export default App;
