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
import { BookingChatModal } from './components/booking/BookingChatModal';
import { TrackingPanel } from './components/tracking/TrackingPanel';
import { PostShipmentView } from './components/shipments/PostShipmentView';
import { MyShipmentsView } from './components/shipments/MyShipmentsView';
import { FindFreightView } from './components/fleet/FindFreightView';
import { MyTrucksView } from './components/fleet/MyTrucksView';
import { SmartInsightsView } from './components/insights/SmartInsightsView';
import { ProfileView } from './components/auth/ProfileView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { ArrowLeft, ChevronDown, ChevronUp, Eye, EyeOff, Minimize2 } from 'lucide-react';

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

  // Global Keyboard Navigation: ESC to collapse map when expanded
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMapExpanded) {
        toggleMapExpanded();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMapExpanded, toggleMapExpanded]);

  // 1. Unauthenticated: Full Landing Page Experience (Light Theme)
  if (!isAuthenticated && activeView === 'landing') {
    return (
      <div className="relative w-screen min-h-screen bg-[#FBFBFA] text-neutral-900 font-sans">
        <LandingPage />
        <Toast />
      </div>
    );
  }

  // 2. Authentication: Role-Selection + Login Page (Permanently Dark Mode)
  if (!isAuthenticated && activeView === 'login') {
    return (
      <div className="relative w-screen min-h-screen bg-black text-white font-sans">
        <LoginPage />
        <Toast />
      </div>
    );
  }

  const isMapCentricView = [
    'home',
    'find_truck',
    'matching_results',
    'track_shipment',
    'find_freight',
    'post_shipment'
  ].includes(activeView);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-neutral-900 overflow-x-hidden font-sans select-none flex flex-col">
      
      {/* 1. Full-Width Top Webpage Navbar (NOT inside or overlaid on the map) */}
      <Navbar />

      {/* 2. Main Centered Application Content */}
      <main className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col">
        
        {/* MAP-CENTRIC VIEWS: 2-Column Responsive Layout */}
        {isMapCentricView && (
          <section className="flex flex-col lg:flex-row items-stretch gap-6 w-full flex-1">
            
            {/* LEFT FUNCTIONAL PANEL (~28-30% on desktop) */}
            {!isMapExpanded && (
              <aside className="w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col gap-4">
                
                {/* VIEW: HOME (Shipper Map-First View) */}
                {activeView === 'home' && (
                  <div className="flex flex-col gap-4 w-full">
                    <SearchPanel />

                    {/* Minimal Live Corridor Indicator Card */}
                    <div className="bg-white rounded-3xl p-4 border border-neutral-200/90 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                          Live Freight Corridor
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <h3 className="text-xs font-bold text-neutral-900">
                        Chennai → Bengaluru Corridor
                      </h3>
                      <p className="text-[11px] text-neutral-500 leading-snug">
                        Tap any truck marker on the map to view live capacity and backhaul score.
                      </p>
                    </div>
                  </div>
                )}

                {/* VIEW: FIND A TRUCK */}
                {activeView === 'find_truck' && (
                  <div className="w-full">
                    <SearchPanel />
                  </div>
                )}

                {/* VIEW: MATCHING RESULTS (Available Trucks Feed) */}
                {activeView === 'matching_results' && (
                  <div className="w-full bg-white border border-neutral-200/90 rounded-3xl shadow-xs overflow-hidden flex flex-col max-h-[720px] lg:max-h-[calc(100vh-140px)]">
                    {/* Header */}
                    <div className="p-4 sm:p-5 border-b border-neutral-200 bg-white flex items-center justify-between shrink-0">
                      <div>
                        <button
                          onClick={() => setActiveView('find_truck')}
                          className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-950 font-bold mb-1 transition-colors"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Change Route / Search</span>
                        </button>
                        <h2 className="text-base font-black text-neutral-950 tracking-tight">
                          Available Matching Trucks
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {searchQuery.fromLocation?.name || 'Chennai'} → {searchQuery.toLocation?.name || 'Bengaluru'} ({searchQuery.weightTons || 8} Tons)
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-neutral-950 text-white text-xs font-mono font-bold shadow-xs">
                        {matchingResults.length} Matches
                      </span>
                    </div>

                    {/* Connected Results Feed */}
                    <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 scrollbar-thin p-1">
                      {matchingResults.map((match) => (
                        <TruckCard key={match.truck.id} match={match} />
                      ))}
                    </div>
                  </div>
                )}

                {/* VIEW: TRACK SHIPMENT */}
                {activeView === 'track_shipment' && (
                  <div className="w-full">
                    <TrackingPanel />
                  </div>
                )}

                {/* VIEW: FIND FREIGHT (Fleet Operator) */}
                {activeView === 'find_freight' && (
                  <div className="w-full">
                    <FindFreightView />
                  </div>
                )}

                {/* VIEW: POST SHIPMENT */}
                {activeView === 'post_shipment' && (
                  <div className="w-full">
                    <PostShipmentView />
                  </div>
                )}

              </aside>
            )}

            {/* RIGHT CONTAINED MAP (~70-72% on desktop, prominent contained card) */}
            <div 
              className="flex-1 w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[calc(100vh-140px)] flex flex-col relative isolate z-0"
              style={{ isolation: 'isolate' }}
            >
              <MapView />
            </div>

          </section>
        )}

        {/* DASHBOARD & MANAGEMENT VIEWS (Centered Webpage Content) */}
        {!isMapCentricView && (
          <div className="w-full max-w-5xl mx-auto py-2">
            {/* VIEW: MY SHIPMENTS */}
            {activeView === 'my_shipments' && <MyShipmentsView />}

            {/* VIEW: MY TRUCKS (Fleet Operator) */}
            {activeView === 'my_trucks' && <MyTrucksView />}

            {/* VIEW: SMART INSIGHTS */}
            {activeView === 'smart_insights' && <SmartInsightsView />}

            {/* VIEW: PROFILE */}
            {activeView === 'profile' && <ProfileView />}

            {/* VIEW: NOTIFICATIONS */}
            {activeView === 'notifications' && <NotificationsView />}
          </div>
        )}

      </main>

      {/* Floating Global Collapse Map Control when Expanded */}
      {isMapExpanded && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
          <button
            onClick={toggleMapExpanded}
            className="px-6 py-3 rounded-2xl bg-neutral-950 hover:bg-black text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/20"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Collapse Map</span>
          </button>
        </div>
      )}

      {/* 4. Global Modals & Notifications */}
      <AILoadingModal />
      <WhyThisTruckModal />
      <TruckDetailModal />
      <BookingModal />
      <BookingSuccess />
      <BookingChatModal />
      <AuthModal />
      <Toast />

      {/* 5. Mobile Bottom Navigation */}
      <MobileNav />

    </div>
  );
};

export default App;
