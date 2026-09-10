import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shipment, ShipmentStatus } from '../../types';
import { ShipmentService } from '../../services/shipmentService';
import { 
  Package, 
  Clock, 
  ArrowRight, 
  Check, 
  Truck as TruckIcon
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-extrabold">
            In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold">
            <Check className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'confirmed':
      case 'driver_assigned':
      case 'going_to_pickup':
      case 'picked_up':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold">
            Confirmed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 text-[10px] font-bold">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-20 pointer-events-auto">
      
      {/* Header & Filter Pills */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>My Shipments</span>
            <span className="px-2 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold">
              {shipments.length}
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time tracking and delivery records
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          {(['all', 'active', 'completed', 'cancelled'] as FilterType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Shipment Cards List */}
      {isLoading ? (
        <div className="p-8 text-center glass-panel rounded-3xl text-neutral-400 text-xs">
          Loading shipments...
        </div>
      ) : shipments.length > 0 ? (
        <div className="space-y-3">
          {shipments.map((s) => (
            <div
              key={s.id}
              onClick={() => handleTrackShipment(s)}
              className="glass-card rounded-2xl p-4 border hover:border-black dark:hover:border-white transition-all cursor-pointer group space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-neutral-900 dark:text-white">
                      {s.trackingNumber}
                    </span>
                    <span className="text-[11px] text-neutral-400">· {s.pickupDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-extrabold text-neutral-900 dark:text-white mt-0.5">
                    <span>{s.fromLocation.name}</span>
                    <span className="text-neutral-400">→</span>
                    <span>{s.toLocation.name}</span>
                  </div>
                </div>

                <div>
                  {getStatusBadge(s.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                <div>
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Cargo</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{s.cargoType}</span>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Weight</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{s.weightTons} Tons</span>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Truck</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">
                    {s.truck?.name || 'Ashok Leyland 1618'}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Fare</span>
                  <span className="font-mono font-black text-neutral-900 dark:text-white">
                    ₹{s.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="text-[11px] text-neutral-500">
                  Est. Delivery: <strong className="text-neutral-800 dark:text-neutral-200">{s.estimatedDeliveryTime || 'Tonight'}</strong>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-neutral-900 dark:text-white group-hover:underline">
                  <span>Track</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-3 border">
          <div className="w-10 h-10 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-600 dark:text-neutral-300">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">No shipments found</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              No shipments matching the current filter.
            </p>
          </div>
          <button
            onClick={() => setActiveView('find_truck')}
            className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow"
          >
            Find a Truck
          </button>
        </div>
      )}

    </div>
  );
};
