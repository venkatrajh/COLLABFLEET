import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shipment, ShipmentStatus } from '../../types';
import { ShipmentService } from '../../services/shipmentService';
import { 
  Package, 
  Search, 
  MapPin, 
  Navigation, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Truck as TruckIcon,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed' | 'cancelled';

export const MyShipmentsView: React.FC = () => {
  const { handleTrackShipment, setActiveView } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadShipments = async (f: FilterType) => {
    setIsLoading(true);
    try {
      const data = await ShipmentService.getShipments(f);
      setShipments(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShipments(filter);
  }, [filter]);

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan text-xs font-black animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
            In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'confirmed':
      case 'driver_assigned':
      case 'going_to_pickup':
      case 'picked_up':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 pointer-events-auto">
      
      {/* Header & Status Filter Pills */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>My Shipments</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan text-xs font-bold">
              {shipments.length}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking and delivery history for your freight bookings
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-dark-900/90 p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
          {(['all', 'active', 'completed', 'cancelled'] as FilterType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-brand-cyan text-dark-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Shipment Cards List */}
      {isLoading ? (
        <div className="p-10 text-center glass-panel rounded-3xl text-slate-400 text-xs">
          Loading shipment records...
        </div>
      ) : shipments.length > 0 ? (
        <div className="space-y-3.5">
          {shipments.map((s) => (
            <div
              key={s.id}
              onClick={() => handleTrackShipment(s)}
              className="glass-card rounded-2xl p-5 border border-white/10 hover:border-brand-cyan/40 transition-all cursor-pointer group space-y-3"
            >
              {/* Top Row: Tracking Number, Route & Status */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-brand-cyan">
                      {s.trackingNumber}
                    </span>
                    <span className="text-xs text-slate-500">· {s.pickupDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-extrabold text-white mt-1">
                    <span>{s.fromLocation.name}</span>
                    <span className="text-brand-cyan">→</span>
                    <span>{s.toLocation.name}</span>
                  </div>
                </div>

                <div>
                  {getStatusBadge(s.status)}
                </div>
              </div>

              {/* Middle Row: Cargo & Assigned Truck */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-dark-900/60 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cargo</span>
                  <span className="font-bold text-white">{s.cargoType}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
                  <span className="font-extrabold text-brand-cyan">{s.weightTons} Tons</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Truck</span>
                  <span className="font-semibold text-slate-200 truncate block">
                    {s.truck?.name || 'Ashok Leyland 1618'}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fare</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-sm">
                    ₹{s.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Bottom Row: ETA / Delivery info & Track Action */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Est. Arrival: <strong className="text-slate-200">{s.estimatedDeliveryTime || 'Tonight'}</strong></span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-brand-cyan group-hover:translate-x-1 transition-transform">
                  <span>Track Shipment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-10 rounded-3xl text-center space-y-4 border border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No shipments found</h3>
            <p className="text-xs text-slate-400 mt-1">
              You don't have any shipments matching the "{filter}" filter.
            </p>
          </div>
          <button
            onClick={() => setActiveView('find_truck')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 text-dark-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            Find a Truck
          </button>
        </div>
      )}

    </div>
  );
};
