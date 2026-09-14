import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shipment, ShipmentStatus } from '../../types';
import { ShipmentService } from '../../services/shipmentService';
import { TripReceiptModal } from './TripReceiptModal';
import { 
  Package, 
  ArrowRight, 
  Check, 
  Truck as TruckIcon, 
  FileText, 
  TrendingDown, 
  PlusCircle, 
  Search,
  MessageSquare,
  MessageCircle,
  Play,
  XCircle,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

type FilterType = 'all' | 'requests' | 'active' | 'completed';

export const MyShipmentsView: React.FC = () => {
  const { 
    handleTrackShipment, 
    setActiveView, 
    currentRole,
    openChatForShipment,
    handleAcceptBooking,
    handleDeclineBooking,
    handleStartTrip,
    handleCompleteTrip,
    activeBookingShipment
  } = useApp();

  const [filter, setFilter] = useState<FilterType>('active');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceiptShipment, setSelectedReceiptShipment] = useState<Shipment | null>(null);

  const loadShipments = async (f: FilterType) => {
    setIsLoading(true);
    try {
      const [filteredData, allData] = await Promise.all([
        ShipmentService.getShipments(f),
        ShipmentService.getShipments('all')
      ]);
      setShipments(filteredData || []);
      setAllShipments(allData || []);
    } catch {
      setShipments([]);
      setAllShipments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShipments(filter);
  }, [filter, activeBookingShipment]);

  const requestCount = allShipments.filter(s => s?.status === 'pending').length;
  const activeCount = allShipments.filter(s => 
    Boolean(s?.status && ['accepted', 'confirmed', 'driver_assigned', 'going_to_pickup', 'picked_up', 'in_transit'].includes(s.status))
  ).length;

  const completedCount = allShipments.filter(s => s?.status === 'delivered').length;
  const allCount = allShipments.length;

  const getStatusBadge = (status?: ShipmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Request Sent · Pending
          </span>
        );
      case 'accepted':
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300/60 text-[10px] font-extrabold">
            <Check className="w-3 h-3 stroke-[3]" />
            Booking Confirmed
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111111] text-white text-[10px] font-extrabold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Trip In Progress
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300/40">
            <Check className="w-3 h-3 stroke-[3]" />
            Delivered
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-extrabold">
            Request Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F0EFEA] text-neutral-600 text-[10px] font-bold">
            Active
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl xl:max-w-3xl pointer-events-auto self-start">
      
      {/* ONE PRIMARY FLOATING ISLAND */}
      <div className="bg-white/95 backdrop-blur-md border border-[#DEDDD8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-125px)] sm:max-h-[calc(100vh-135px)]">
        
        {/* Island Header & Segmented Tabs */}
        <div className="p-4 sm:p-5 border-b border-[#EBEAE5] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-[#111111] tracking-tight">
                {currentRole === 'fleet_operator' ? 'Fleet Bookings & Trips' : 'My Shipments'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#111111] text-white text-xs font-mono font-bold">
                {shipments.length}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5 font-medium">
              {currentRole === 'fleet_operator' 
                ? 'Manage incoming shipment requests, active trips, and driver dispatches'
                : 'Live tracking telemetry, trip requests, and official delivery receipts'}
            </p>
          </div>

          {/* Segmented Filter Tabs */}
          <div className="flex items-center bg-[#F4F3EF] p-1 rounded-2xl border border-[#E0DFD8] self-start sm:self-auto gap-1 overflow-x-auto max-w-full">
            {(requestCount > 0 || currentRole === 'fleet_operator') && (
              <button
                onClick={() => setFilter('requests')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  filter === 'requests'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <span>Requests</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  filter === 'requests' ? 'bg-amber-500 text-black' : 'bg-amber-200 text-amber-900'
                }`}>
                  {requestCount}
                </span>
              </button>
            )}

            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                filter === 'active'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <span>Active</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                filter === 'active' ? 'bg-neutral-800 text-white' : 'bg-[#E5E4DE] text-neutral-700'
              }`}>
                {activeCount}
              </span>
            </button>

            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                filter === 'completed'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <span>Trip History</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                filter === 'completed' ? 'bg-neutral-800 text-white' : 'bg-[#E5E4DE] text-neutral-700'
              }`}>
                {completedCount}
              </span>
            </button>

            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                filter === 'all'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <span>All</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                filter === 'all' ? 'bg-neutral-800 text-white' : 'bg-[#E5E4DE] text-neutral-700'
              }`}>
                {allCount}
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Connected Shipment Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EBEAE5] scrollbar-thin">
          {isLoading ? (
            <div className="p-10 text-center text-neutral-400 text-xs font-medium">
              Loading shipments...
            </div>
          ) : shipments.length > 0 ? (
            shipments.map((s) => {
              const isDelivered = s.status === 'delivered';
              const isPending = s.status === 'pending';
              const isAccepted = s.status === 'accepted' || s.status === 'confirmed';
              const isInTransit = s.status === 'in_transit';
              const isDeclined = s.status === 'declined';

              const originName = s?.fromLocation?.name || (typeof s?.fromLocation === 'string' ? s.fromLocation : 'Origin Hub');
              const destName = s?.toLocation?.name || (typeof s?.toLocation === 'string' ? s.toLocation : 'Destination Hub');
              const trackingCode = s?.trackingNumber || `CF-${s?.id?.slice(-5) || '48291'}`;
              const truckName = s?.truck?.name || (s?.truck?.registrationNumber ? `Truck ${s.truck.registrationNumber}` : 'Truck not assigned');
              const driverName = s?.truck?.driver?.name ? `Driver: ${s.truck.driver.name}` : 'Driver not assigned';
              const truckType = s?.truck?.truckType || s?.truckTypeNeeded || 'Vehicle type unassigned';
              const fare = typeof s?.price === 'number' ? s.price : 8400;

              return (
                <div
                  key={s.id}
                  className="p-4 sm:p-5 hover:bg-[#FAF9F6] transition-colors space-y-3"
                >
                  {/* Row Header: Tracking ID, Route, & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#111111]">
                          {trackingCode}
                        </span>
                        <span className="text-[11px] text-neutral-400">· {s.pickupDate || 'Today'}</span>
                        {s.isReturnTrip && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <TrendingDown className="w-2.5 h-2.5" />
                            Saved ₹{s.savingsAmount || 1850}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-black text-[#111111] mt-0.5">
                        <span>{originName}</span>
                        <span className="text-neutral-400 font-normal">→</span>
                        <span>{destName}</span>
                      </div>
                    </div>

                    <div>
                      {getStatusBadge(s.status)}
                    </div>
                  </div>

                  {/* Connected Inner Info Strip */}
                  <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-2xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-neutral-400 block">Cargo</span>
                      <span className="font-bold text-[#111111] truncate block">{s.cargoType || 'Industrial Cargo'}</span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-bold text-neutral-400 block">Weight</span>
                      <span className="font-bold text-[#111111]">{s.weightTons ? `${s.weightTons} Tons` : '8 Tons'}</span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-bold text-neutral-400 block">Assigned Truck</span>
                      <span className={`font-semibold truncate block ${s.truck?.name ? 'text-neutral-800' : 'text-neutral-500 italic'}`}>
                        {truckName}
                      </span>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[9px] uppercase font-bold text-neutral-400 block">Fare</span>
                      <span className="font-mono font-black text-[#111111]">
                        ₹{fare.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Contextual Status Guidance Banner */}
                  {isPending && (
                    <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200/90 text-[11px] text-amber-900 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          {currentRole === 'fleet_operator'
                            ? `Incoming request from ${s.shipperName || 'Shipper'} (${s.shipperCompany || 'Shipper Co.'})`
                            : 'Waiting for fleet owner confirmation. Carrier has been notified.'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 font-mono">
                        PENDING
                      </span>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {currentRole === 'fleet_operator'
                            ? 'Booking Accepted. Ready to commence dispatch.'
                            : 'Booking Confirmed! Carrier accepted this shipment. You can now message or call.'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                        ACCEPTED
                      </span>
                    </div>
                  )}

                  {isDeclined && (
                    <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-medium">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>
                          {currentRole === 'fleet_operator'
                            ? 'You declined this booking request.'
                            : 'Carrier was unable to accept this request. Please find another suitable truck.'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 font-mono">
                        DECLINED
                      </span>
                    </div>
                  )}

                  {/* Action Buttons Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-neutral-100 text-xs">
                    <div className="text-[11px] text-neutral-500 flex flex-wrap items-center gap-1.5">
                      <TruckIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{truckType}</span>
                      {s.truck?.registrationNumber && (
                        <span className="font-mono text-neutral-600 font-semibold">· {s.truck.registrationNumber}</span>
                      )}
                      <span className={s.truck?.driver?.name ? 'text-neutral-700' : 'text-neutral-400 italic'}>
                        · {driverName}
                      </span>
                    </div>

                    {/* Interactive Workflow Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                      
                      {/* PENDING: Fleet Owner Accept / Decline */}
                      {isPending && currentRole === 'fleet_operator' && (
                        <>
                          <button
                            type="button"
                            onClick={async () => {
                              await handleDeclineBooking(s.id);
                              loadShipments(filter);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-neutral-300 hover:border-rose-400 hover:bg-rose-50 text-neutral-700 hover:text-rose-700 font-bold text-xs transition-all"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await handleAcceptBooking(s.id);
                              loadShipments(filter);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-black text-white font-extrabold text-xs shadow-sm active:scale-98 transition-all flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        </>
                      )}

                      {/* PENDING: Shipper Messaging & Calling Locked */}
                      {isPending && currentRole === 'shipper' && (
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 italic">
                          <Clock className="w-3 h-3" />
                          <span>Messaging & Call unlock once accepted</span>
                        </div>
                      )}

                      {/* ACCEPTED: Message icon & plain phone number */}
                      {isAccepted && (
                        <>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openChatForShipment(s)}
                              className="relative p-2 rounded-xl bg-[#FAF9F6] hover:bg-neutral-200 border border-neutral-300 text-neutral-800 hover:text-black transition-colors shadow-2xs flex items-center justify-center shrink-0 cursor-pointer"
                              title="Message"
                              aria-label="Message"
                            >
                              <MessageCircle className="w-4 h-4 text-neutral-800" />
                              {ShipmentService.getUnreadCount(s, currentRole) > 0 && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                              )}
                            </button>

                            {(currentRole === 'shipper' ? (s.truck?.driver?.phone || '+91 98410 44291') : (s.shipperPhone || '+91 98401 23456')) && (
                              <a
                                href={`tel:${(currentRole === 'shipper' ? (s.truck?.driver?.phone || '+91 98410 44291') : (s.shipperPhone || '+91 98401 23456')).replace(/\s+/g, '')}`}
                                className="text-xs font-mono font-bold text-neutral-800 hover:text-black hover:underline transition-colors tracking-tight select-all py-1 px-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
                                title="Call contact"
                              >
                                {currentRole === 'shipper' ? (s.truck?.driver?.phone || '+91 98410 44291') : (s.shipperPhone || '+91 98401 23456')}
                              </a>
                            )}
                          </div>

                          {/* Fleet Owner ONLY: Start Trip */}
                          {currentRole === 'fleet_operator' && (
                            <button
                              type="button"
                              onClick={async () => {
                                await handleStartTrip(s.id);
                                loadShipments(filter);
                              }}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-950 hover:bg-black text-white font-extrabold text-xs shadow-sm active:scale-98 transition-all cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>Start Trip</span>
                            </button>
                          )}

                          {currentRole === 'shipper' && (
                            <span className="text-[11px] text-neutral-400 italic pl-1">
                              Waiting for driver to start trip
                            </span>
                          )}
                        </>
                      )}

                      {/* IN TRANSIT: Track, Message icon & plain phone number */}
                      {isInTransit && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleTrackShipment(s)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-black text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                          >
                            <span>Track Shipment</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openChatForShipment(s)}
                              className="relative p-2 rounded-xl bg-[#FAF9F6] hover:bg-neutral-200 border border-neutral-300 text-neutral-800 hover:text-black transition-colors shadow-2xs flex items-center justify-center shrink-0 cursor-pointer"
                              title="Message"
                              aria-label="Message"
                            >
                              <MessageCircle className="w-4 h-4 text-neutral-800" />
                              {ShipmentService.getUnreadCount(s, currentRole) > 0 && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                              )}
                            </button>

                            {(currentRole === 'shipper' ? (s.truck?.driver?.phone || '+91 98410 44291') : (s.shipperPhone || '+91 98401 23456')) && (
                              <a
                                href={`tel:${(currentRole === 'shipper' ? (s.truck?.driver?.phone || '+91 98410 44291') : (s.shipperPhone || '+91 98401 23456')).replace(/\s+/g, '')}`}
                                className="text-xs font-mono font-bold text-neutral-800 hover:text-black hover:underline transition-colors tracking-tight select-all py-1 px-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
                                title="Call contact"
                              >
                                {currentRole === 'shipper' ? (s.truck?.driver?.phone || '+91 98410 44291') : (s.shipperPhone || '+91 98401 23456')}
                              </a>
                            )}
                          </div>

                          {/* Fleet Owner ONLY: Complete Trip */}
                          {currentRole === 'fleet_operator' && (
                            <button
                              type="button"
                              onClick={async () => {
                                await handleCompleteTrip(s.id);
                                loadShipments(filter);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-400 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-extrabold text-xs transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Complete Trip</span>
                            </button>
                          )}
                        </>
                      )}

                      {/* DELIVERED: Receipt & Message History */}
                      {isDelivered && (
                        <>
                          <button
                            type="button"
                            onClick={() => openChatForShipment(s)}
                            className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-neutral-200 border border-neutral-300 text-neutral-800 hover:text-black transition-colors shadow-2xs flex items-center justify-center shrink-0"
                            title="Message History"
                            aria-label="Message History"
                          >
                            <MessageCircle className="w-4 h-4 text-neutral-800" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedReceiptShipment(s)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#111111] hover:text-white font-bold text-xs text-[#111111] transition-all border border-[#DEDDD8] shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </>
                      )}

                      {/* DECLINED: Shipper Search Again */}
                      {isDeclined && currentRole === 'shipper' && (
                        <button
                          type="button"
                          onClick={() => setActiveView('find_truck')}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-black text-white font-extrabold text-xs shadow-xs transition-all"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Find Another Truck</span>
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              );
            })
          ) : allShipments.length === 0 ? (
            /* Global Empty State: Zero shipments exist anywhere */
            <div className="p-10 sm:p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] flex items-center justify-center mx-auto text-neutral-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#111111]">
                  No shipments yet
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Once you book or post a shipment, it will appear here with live tracking telemetry and receipts.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setActiveView('find_truck')}
                  className="px-4 py-2 rounded-xl bg-[#111111] text-white font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Find a Truck</span>
                </button>
                <button
                  onClick={() => setActiveView('post_shipment')}
                  className="px-4 py-2 rounded-xl bg-white border border-[#DEDDD8] text-[#111111] font-bold text-xs shadow-sm hover:bg-[#FAF9F6] transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post a Shipment</span>
                </button>
              </div>
            </div>
          ) : (
            /* Tab-specific Empty State: Shipments exist, but none for this tab */
            <div className="p-10 text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] flex items-center justify-center mx-auto text-neutral-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111111]">
                  {filter === 'active' ? 'No active shipments' : 'No completed shipments in history'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {filter === 'active' 
                    ? 'All current shipments are delivered. View completed trips in Trip History.' 
                    : 'Delivered shipments and settlement receipts will appear here.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setFilter(filter === 'active' ? 'completed' : 'active')}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DEDDD8] text-[#111111] font-bold text-xs shadow-sm hover:bg-[#FAF9F6] transition-all"
                >
                  View {filter === 'active' ? 'Trip History' : 'Active Shipments'}
                </button>
                <button
                  onClick={() => setActiveView('find_truck')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#111111] text-white font-bold text-xs shadow-sm hover:opacity-90 transition-all"
                >
                  Find a Truck
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Official Trip Receipt Modal */}
      {selectedReceiptShipment && (
        <TripReceiptModal
          isOpen={true}
          onClose={() => setSelectedReceiptShipment(null)}
          shipment={selectedReceiptShipment}
          onBookSimilar={() => {
            setActiveView('find_truck');
          }}
        />
      )}

    </div>
  );
};
