import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FreightOpportunity, Truck, Shipment } from '../../types';
import { TruckService } from '../../services/truckService';
import { MatchingService } from '../../services/matchingService';
import { ShipmentService } from '../../services/shipmentService';
import { WhyThisFreightModal } from '../matching/WhyThisFreightModal';
import { Modal } from '../common/Modal';
import { 
  ArrowRight, 
  Truck as TruckIcon, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Check, 
  ChevronDown, 
  TrendingDown, 
  MapPin, 
  ShieldCheck, 
  RefreshCw,
  MessageSquare,
  MessageCircle,
  Play
} from 'lucide-react';

interface AcceptedConfirmationData {
  bookingId: string;
  freight: FreightOpportunity;
  truck: Truck;
}

export const FindFreightView: React.FC = () => {
  const { 
    showToast, 
    triggerNotification, 
    userProfile, 
    updateUserProfile, 
    setActiveView, 
    recenterMap,
    handleTrackShipment,
    handleAcceptBooking,
    handleDeclineBooking,
    handleStartTrip,
    openChatForShipment,
    activeBookingShipment,
    currentRole
  } = useApp();

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [opportunities, setOpportunities] = useState<FreightOpportunity[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Shipment[]>([]);
  const [selectedFreightDetails, setSelectedFreightDetails] = useState<FreightOpportunity | null>(null);
  const [whyFreight, setWhyFreight] = useState<FreightOpportunity | null>(null);
  const [acceptedConfirmation, setAcceptedConfirmation] = useState<AcceptedConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const all = await ShipmentService.getShipments('all');
      const relevant = all.filter(s => s.status === 'pending' || s.status === 'accepted');
      setIncomingRequests(relevant);
    } catch {
      setIncomingRequests([]);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [activeBookingShipment]);

  // 1. Load fleet operator trucks
  useEffect(() => {
    const initFleet = async () => {
      setIsLoading(true);
      try {
        const fleet = await TruckService.getMyTrucks();
        setTrucks(fleet);
        if (fleet.length > 0) {
          setSelectedTruck(fleet[0]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    initFleet();
  }, []);

  // 2. When selected truck changes, dynamically rank freight matches
  useEffect(() => {
    if (!selectedTruck) return;

    const rankFreight = async () => {
      setIsLoading(true);
      try {
        const ranked = await MatchingService.findFreightForTruck(selectedTruck);
        setOpportunities(ranked);
      } catch (e) {
        console.error('Error ranking freight:', e);
      } finally {
        setIsLoading(false);
      }
    };

    rankFreight();
  }, [selectedTruck?.id, selectedTruck?.isAvailable]);

  // Handle truck selection
  const handleSelectTruck = (truck: Truck) => {
    setSelectedTruck(truck);
    recenterMap(truck.currentLocation.coordinates, 8);
    showToast(`Matching freight for ${truck.name} (${truck.currentLocation.city})`, 'info');
  };

  // Toggle truck availability
  const handleToggleAvailability = async (truck: Truck) => {
    const updated = await TruckService.toggleTruckAvailability(truck.id);
    if (updated) {
      setTrucks(prev => prev.map(t => t.id === truck.id ? { ...t, isAvailable: updated.isAvailable } : t));
      if (selectedTruck?.id === truck.id) {
        setSelectedTruck({ ...selectedTruck, isAvailable: updated.isAvailable });
      }
      showToast(`${truck.name} is now ${updated.isAvailable ? 'Available for matching' : 'Offline / In Transit'}`, 'info');
    }
  };

  // Handle Accept Freight
  const handleAcceptFreight = async (freight: FreightOpportunity) => {
    if (!selectedTruck) return;

    setSelectedFreightDetails(null);
    setWhyFreight(null);

    const generatedId = `CF-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create booking in service
    const newShipment = await ShipmentService.createBooking({
      fromLocation: freight.fromLocation,
      toLocation: freight.toLocation,
      cargoType: freight.cargoType,
      weightTons: freight.weightTons,
      truckTypeNeeded: selectedTruck.truckType,
      truck: selectedTruck,
      price: freight.estimatedEarnings,
      matchScore: freight.matchScore,
      isReturnTrip: freight.isReturnTrip,
      emptyKmSaved: freight.emptyKmSaved,
      savingsAmount: freight.savingsAmount,
      co2ReductionKg: freight.co2ReductionKg
    });

    // Update truck load state
    const updatedTruckLoad = Math.min(
      selectedTruck.totalCapacityTons,
      selectedTruck.currentLoadTons + freight.weightTons
    );
    const updatedTruckAvail = Math.max(0, selectedTruck.totalCapacityTons - updatedTruckLoad);
    const updatedTruck = {
      ...selectedTruck,
      currentLoadTons: updatedTruckLoad,
      availableCapacityTons: updatedTruckAvail
    };
    setSelectedTruck(updatedTruck);
    setTrucks(prev => prev.map(t => t.id === selectedTruck.id ? updatedTruck : t));

    // Update user profile impact stats dynamically
    const currentStats = userProfile.stats;
    updateUserProfile({
      stats: {
        ...currentStats,
        moneySaved: currentStats.moneySaved + (freight.savingsAmount || 1850),
        emptyKmSaved: currentStats.emptyKmSaved + (freight.emptyKmSaved || 67),
        co2ReductionKg: currentStats.co2ReductionKg + (freight.co2ReductionKg || 144),
        activeShipments: currentStats.activeShipments + 1,
        completedTrips: currentStats.completedTrips + 1
      }
    });

    // Trigger operational notifications
    triggerNotification(
      'BOOKING',
      'Freight Accepted',
      `You accepted ${freight.cargoType} on ${freight.fromLocation.name} → ${freight.toLocation.name} (Est. Earnings: ₹${freight.estimatedEarnings.toLocaleString('en-IN')}).`,
      newShipment.id,
      'my_shipments'
    );

    triggerNotification(
      'ACCOUNT',
      'Earnings Balance Updated',
      `₹${freight.estimatedEarnings.toLocaleString('en-IN')} pending payout on delivery for ${newShipment.trackingNumber}.`,
      newShipment.id,
      'smart_insights'
    );

    // Center map on route
    recenterMap(freight.fromLocation.coordinates, 7);

    // Show Confirmation modal
    setAcceptedConfirmation({
      bookingId: newShipment.trackingNumber || generatedId,
      freight,
      truck: selectedTruck
    });
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* FLEET CONTROLS PANEL */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl shadow-xs overflow-hidden flex flex-col max-h-[720px] lg:max-h-[calc(100vh-140px)]">
        
        {/* 1. Island Header: Truck Selector */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#EBEAE5] space-y-2.5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#777777] block">
                FLEET CAPACITY MATCHER
              </span>
              <h2 className="text-base font-black text-[#111111] tracking-tight">
                Select Your Truck
              </h2>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-[#111111] text-white text-[10px] font-mono font-bold shadow-sm">
              {trucks.length} Trucks
            </span>
          </div>

          {/* Compact Horizontal Scrollable Truck Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
            {trucks.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelectTruck(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                  selectedTruck?.id === t.id
                    ? 'bg-[#111111] text-white border-black shadow-sm'
                    : 'bg-[#FAF9F6] border-[#E0DFD8] text-[#555555] hover:border-black hover:text-black'
                }`}
              >
                <TruckIcon className="w-3.5 h-3.5" />
                <span>{t.registrationNumber}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  selectedTruck?.id === t.id ? 'bg-neutral-800 text-white' : 'bg-[#EAE9E4] text-neutral-700'
                }`}>
                  {t.truckType.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Selected Truck Summary (Connected inside the same island) */}
        {selectedTruck && (
          <div className="bg-[#FAF9F6] border-b border-[#EBEAE5] px-4 py-3 sm:px-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#777777] block tracking-wider">
                Truck & Model
              </span>
              <span className="font-extrabold text-[#111111] text-xs block truncate" title={selectedTruck.name}>
                {selectedTruck.name}
              </span>
              <span className="text-[10px] text-[#666666] font-mono">
                {selectedTruck.registrationNumber}
              </span>
            </div>

            <div>
              <span className="text-[9px] uppercase font-bold text-[#777777] block tracking-wider">
                Available Capacity
              </span>
              <span className="font-black text-[#111111] text-xs">
                {selectedTruck.availableCapacityTons} / {selectedTruck.totalCapacityTons} Tons
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                {Math.round((selectedTruck.availableCapacityTons / selectedTruck.totalCapacityTons) * 100)}% free space
              </span>
            </div>

            <div>
              <span className="text-[9px] uppercase font-bold text-[#777777] block tracking-wider">
                Current Location
              </span>
              <span className="font-extrabold text-[#111111] text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#111111] shrink-0" />
                <span className="truncate">{selectedTruck.currentLocation.name}</span>
              </span>
              <span className="text-[10px] text-[#666666] block truncate">
                Target: {selectedTruck.currentDestination?.city || 'Any Corridor'}
              </span>
            </div>

            <div className="flex flex-col justify-center items-start sm:items-end">
              <span className="text-[9px] uppercase font-bold text-[#777777] block tracking-wider mb-0.5">
                Operational Status
              </span>
              <button
                onClick={() => handleToggleAvailability(selectedTruck)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm ${
                  selectedTruck.isAvailable
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-neutral-200 text-neutral-700 border border-neutral-300 hover:bg-neutral-300'
                }`}
                title="Click to toggle Available / Offline"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${selectedTruck.isAvailable ? 'bg-emerald-600 animate-pulse' : 'bg-neutral-500'}`} />
                <span>{selectedTruck.isAvailable ? 'Available' : 'Offline'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2.5 Incoming Shipper Direct Requests (Pending / Accepted) */}
        {incomingRequests.length > 0 && (
          <div className="p-4 sm:p-5 bg-amber-50/60 border-b border-amber-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <h3 className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-tight">
                  Incoming Shipper Requests ({incomingRequests.length})
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                Action Required
              </span>
            </div>

            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div key={req.id} className="bg-white border border-amber-200 rounded-2xl p-3.5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-neutral-900 text-xs sm:text-sm">
                          {req.shipperName || 'Direct Shipper'}
                        </span>
                        {req.shipperCompany && (
                          <span className="text-[10px] text-neutral-500 font-medium">({req.shipperCompany})</span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-600 font-mono mt-0.5">
                        Ref: {req.trackingNumber} · {req.cargoType} ({req.weightTons} T)
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      req.status === 'pending'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {req.status === 'pending' ? 'Pending Approval' : 'Confirmed Booking'}
                    </span>
                  </div>

                  <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-neutral-800 truncate">{req.fromLocation.city}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="font-bold text-neutral-800 truncate">{req.toLocation.city}</span>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <span className="font-black text-neutral-900 text-xs">₹{req.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={async () => {
                            await handleDeclineBooking(req.id);
                            loadRequests();
                          }}
                          className="flex-1 py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={async () => {
                            await handleAcceptBooking(req.id);
                            loadRequests();
                          }}
                          className="flex-2 py-2 px-3 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Accept Booking</span>
                        </button>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openChatForShipment(req)}
                            className="relative p-2.5 rounded-xl border border-neutral-200 bg-[#FAF9F6] text-neutral-800 hover:text-black hover:bg-neutral-200 transition-colors flex items-center justify-center shrink-0 shadow-2xs cursor-pointer"
                            title="Message shipper"
                            aria-label="Message shipper"
                          >
                            <MessageCircle className="w-4 h-4 text-neutral-800" />
                            {ShipmentService.getUnreadCount(req, currentRole) > 0 && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                            )}
                          </button>
                          {(req.shipperPhone || '+91 98401 23456') && (
                            <a
                              href={`tel:${(req.shipperPhone || '+91 98401 23456').replace(/\s+/g, '')}`}
                              className="text-xs font-mono font-bold text-neutral-800 hover:text-black hover:underline transition-colors tracking-tight select-all py-1 px-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
                              title="Call shipper"
                            >
                              {req.shipperPhone || '+91 98401 23456'}
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            await handleStartTrip(req.id);
                            loadRequests();
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-neutral-950 text-white text-xs font-extrabold hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start Trip</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Freight Matching Section Header */}
        <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-white border-b border-[#EBEAE5] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-[#111111] tracking-tight uppercase">
                Freight Matching Your Truck
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-[#111111] text-white text-[10px] font-mono font-bold">
                {opportunities.length}
              </span>
            </div>
            <p className="text-[11px] text-[#666666]">
              6-factor optimization based on {selectedTruck?.registrationNumber || 'vehicle'} specs
            </p>
          </div>
        </div>

        {/* 4. Freight Opportunity Results (Scrollable connected list inside the island) */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EBEAE5] scrollbar-thin">
          {selectedTruck && !selectedTruck.isAvailable ? (
            <div className="p-8 sm:p-10 text-center space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto">
                <TruckIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-[#111111]">
                {selectedTruck.name} is Currently Offline
              </h3>
              <p className="text-xs text-[#666666] max-w-xs mx-auto">
                This truck is marked offline and cannot receive new matching opportunities. Switch it to Available to view live freight requests.
              </p>
              <button
                onClick={() => handleToggleAvailability(selectedTruck)}
                className="px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-black transition-all shadow"
              >
                Mark Truck Available
              </button>
            </div>
          ) : isLoading ? (
            <div className="p-10 text-center text-[#777777] text-xs font-medium space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-neutral-400" />
              <p>Calculating multi-factor freight compatibility for {selectedTruck?.name}...</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="p-8 text-center space-y-2 text-xs text-neutral-500">
              <p>No matching freight found within current capacity constraints.</p>
            </div>
          ) : (
            opportunities.map((freight) => (
              <div 
                key={freight.id}
                className="p-3.5 sm:p-4 hover:bg-[#FAF9F6]/80 transition-colors space-y-2.5 group"
              >
                {/* Route & Match % */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#111111]">
                      <span>{freight.fromLocation.name}</span>
                      <span className="text-[#888888] font-normal">→</span>
                      <span>{freight.toLocation.name}</span>
                    </div>
                    <div className="text-[11px] text-[#666666] mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-[#111111]">{freight.cargoType}</span>
                      <span className="text-[#CCCCCC]">•</span>
                      <span>Shipper: {freight.shipperName}</span>
                      <span className="text-amber-500 font-bold">★ {freight.shipperRating}</span>
                    </div>
                  </div>

                  <span className="bg-[#111111] text-white text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold shadow-sm shrink-0">
                    {freight.matchScore}% MATCH
                  </span>
                </div>

                {/* Metrics: Weight | Pickup | Earnings */}
                <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-2.5 grid grid-cols-3 divide-x divide-[#E5E4DE] text-[11px]">
                  <div className="pr-2">
                    <span className="text-[9px] uppercase font-bold text-[#777777] block tracking-wider">Weight</span>
                    <span className="font-extrabold text-[#111111] block">
                      {freight.weightTons} Tons
                    </span>
                    <span className="text-[9px] text-neutral-500 block truncate">
                      fits {selectedTruck?.availableCapacityTons}T capacity
                    </span>
                  </div>

                  <div className="px-2">
                    <span className="text-[9px] uppercase font-bold text-[#777777] block tracking-wider">Pickup</span>
                    <span className="font-bold text-[#111111] truncate block">
                      {freight.pickupTime}
                    </span>
                    <span className="text-[9px] text-neutral-500 block truncate">
                      {freight.fromLocation.city}
                    </span>
                  </div>

                  <div className="pl-2 text-right">
                    <span className="text-[9px] uppercase font-bold text-[#777777] block tracking-wider">Est. Earnings</span>
                    <span className="font-black text-[#111111] text-xs block">
                      ₹{freight.estimatedEarnings.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-emerald-700 font-bold block">
                      Guaranteed
                    </span>
                  </div>
                </div>

                {/* Return Trip Banner */}
                {freight.isReturnTrip && (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-1.5 text-[10px] text-emerald-900 font-medium">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold">RETURN TRIP:</span>
                    <span className="truncate">
                      {freight.emptyKmSaved} km deadhead avoided · ₹{(freight.savingsAmount || 1850).toLocaleString('en-IN')} savings · {freight.co2ReductionKg || 144} kg CO₂ reduced
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-0.5">
                  <button
                    onClick={() => setWhyFreight(freight)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#111111] hover:bg-[#F0EFEA] transition-all flex items-center gap-1 border border-[#DEDDD8]"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Why this freight?</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedFreightDetails(freight);
                        recenterMap(freight.fromLocation.coordinates, 7);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#666666] hover:text-[#111111] hover:bg-[#F0EFEA] transition-all"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleAcceptFreight(freight)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-white font-extrabold text-xs shadow hover:shadow-md transition-all flex items-center gap-1 active:scale-95"
                    >
                      <span>Accept Freight</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* 4. "Why this freight?" Explainability Modal */}
      {whyFreight && (
        <WhyThisFreightModal
          isOpen={true}
          onClose={() => setWhyFreight(null)}
          freight={whyFreight}
          truck={selectedTruck}
          onAccept={(f) => handleAcceptFreight(f)}
        />
      )}

      {/* 5. Details Modal */}
      {selectedFreightDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFreightDetails(null)}
          maxWidth="max-w-md"
          title="Freight Opportunity Specifications"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#DEDDD8] space-y-2">
              <div className="text-sm font-black text-[#111111]">
                {selectedFreightDetails.cargoType}
              </div>
              <div className="text-[#666666]">
                Route: <strong className="text-[#111111]">{selectedFreightDetails.fromLocation.name} → {selectedFreightDetails.toLocation.name}</strong>
              </div>
              <div className="text-[#666666]">
                Weight: <strong className="text-[#111111]">{selectedFreightDetails.weightTons} Tons</strong>
              </div>
              <div className="text-[#666666]">
                Pickup Scheduled: <strong className="text-[#111111]">{selectedFreightDetails.pickupTime}</strong>
              </div>
              <div className="text-[#666666]">
                Shipper: <strong className="text-[#111111]">{selectedFreightDetails.shipperName} ({selectedFreightDetails.shipperRating}★)</strong>
              </div>
              <div className="text-[#666666]">
                Estimated Earnings: <strong className="text-sm font-black text-[#111111]">₹{selectedFreightDetails.estimatedEarnings.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#EBEAE5] text-[#444444] font-medium leading-relaxed">
              This load connects directly with your vehicle's return journey corridor, eliminating {selectedFreightDetails.emptyKmSaved} km of empty deadhead travel and boosting per-kilometer earnings by up to 34%.
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSelectedFreightDetails(null)}
                className="px-4 py-2 rounded-xl text-[#666666] hover:text-[#111111] font-bold"
              >
                Close
              </button>
              <button
                onClick={() => handleAcceptFreight(selectedFreightDetails)}
                className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white font-extrabold shadow-md"
              >
                Accept Load Now
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 6. Professional Freight Accepted Confirmation Modal */}
      {acceptedConfirmation && (
        <Modal
          isOpen={true}
          onClose={() => setAcceptedConfirmation(null)}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 py-1 text-center text-xs">
            
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto shadow-xl">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Freight Dispatched
              </span>
              <h2 className="text-2xl font-black text-[#111111] mt-0.5 tracking-tight font-mono">
                {acceptedConfirmation.bookingId}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Load successfully assigned to {acceptedConfirmation.truck.name}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#DEDDD8] text-left space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-[#EBEAE5]">
                <span className="text-neutral-500 font-medium">Corridor Route</span>
                <span className="font-extrabold text-[#111111]">
                  {acceptedConfirmation.freight.fromLocation.name} → {acceptedConfirmation.freight.toLocation.name}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Cargo & Payload</span>
                <span className="font-bold text-[#111111]">
                  {acceptedConfirmation.freight.cargoType} ({acceptedConfirmation.freight.weightTons}T)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Assigned Vehicle</span>
                <span className="font-bold text-[#111111]">
                  {acceptedConfirmation.truck.registrationNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Expected Revenue</span>
                <span className="font-black text-emerald-700 text-sm">
                  ₹{acceptedConfirmation.freight.estimatedEarnings.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#EBEAE5] text-[11px]">
                <span className="text-neutral-500 font-medium">Backhaul Impact</span>
                <span className="font-bold text-neutral-900">
                  {acceptedConfirmation.freight.emptyKmSaved} km empty travel avoided
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setAcceptedConfirmation(null);
                  setActiveView('my_shipments');
                }}
                className="w-full py-3 rounded-2xl bg-black text-white font-extrabold text-xs tracking-wide shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span>View My Shipments</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAcceptedConfirmation(null)}
                className="w-full py-2.5 rounded-xl border border-neutral-300 hover:border-black text-xs font-bold text-neutral-700 transition-colors"
              >
                Find More Freight
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
