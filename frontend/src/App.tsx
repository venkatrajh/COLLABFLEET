import React from 'react';
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
import { LandingOverlay } from './components/landing/LandingOverlay';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const App: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    matchingResults, 
    searchQuery,
    selectedMatch
  } = useApp();

  return (
    <div className="relative w-screen min-h-screen bg-dark-950 text-slate-100 overflow-x-hidden font-sans">
      
      {/* 1. Core Real Leaflet Interactive Map — Never unmounted */}
      <MapView />

      {/* 2. Top Navigation Bar */}
      <Navbar />

      {/* 3. Main Dynamic Content Overlay */}
      <main className="relative z-10 pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto min-h-screen flex flex-col justify-start">
        
        {/* VIEW: HOME */}
        {activeView === 'home' && (
          <div className="space-y-12">
            {/* Floating Search card over map hero */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pt-2">
              <SearchPanel />
              <div className="hidden lg:block max-w-md pointer-events-auto">
                <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-brand-cyan text-xs font-black uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Real-Time Logistics Corridors</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">
                    Live trucks detected across Chennai – Bengaluru – Hyderabad
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Click truck markers on the map to explore spare axle capacities and return journey savings.
                  </p>
                </div>
              </div>
            </div>

            {/* Landing page informative sections */}
            <LandingOverlay />
          </div>
        )}

        {/* VIEW: FIND A TRUCK (Search view) */}
        {activeView === 'find_truck' && (
          <div className="flex items-start justify-start pt-2">
            <SearchPanel />
          </div>
        )}

        {/* VIEW: MATCHING RESULTS */}
        {activeView === 'matching_results' && (
          <div className="flex flex-col lg:flex-row items-start gap-6 pt-2 pointer-events-auto">
            
            {/* Left Results Column */}
            <div className="w-full lg:w-[440px] space-y-3.5">
              <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-glass">
                <div>
                  <button
                    onClick={() => setActiveView('find_truck')}
                    className="flex items-center gap-1.5 text-xs text-brand-cyan hover:underline font-bold mb-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Modify Search</span>
                  </button>
                  <h2 className="text-base font-black text-white">
                    Best trucks for your shipment
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {searchQuery.fromLocation?.name || 'Chennai'} → {searchQuery.toLocation?.name || 'Bengaluru'} ({searchQuery.weightTons} T)
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan text-xs font-black border border-brand-cyan/40">
                  {matchingResults.length} Matches
                </span>
              </div>

              {/* Scrollable List of Matched Trucks */}
              <div className="space-y-3 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
                {matchingResults.map((match) => (
                  <TruckCard key={match.truck.id} match={match} />
                ))}
              </div>
            </div>

            {/* Right Map is visible behind, with route and truck pins */}
          </div>
        )}

        {/* VIEW: POST SHIPMENT */}
        {activeView === 'post_shipment' && <PostShipmentView />}

        {/* VIEW: MY SHIPMENTS */}
        {activeView === 'my_shipments' && <MyShipmentsView />}

        {/* VIEW: TRACK SHIPMENT */}
        {activeView === 'track_shipment' && (
          <div className="flex items-start justify-start pt-2">
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
