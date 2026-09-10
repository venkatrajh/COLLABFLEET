import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shipment, ShipmentStatus } from '../../types';
import { TrackingService } from '../../services/trackingService';
import { 
  Phone, 
  MessageSquare, 
  Share2, 
  ArrowLeft,
  RotateCw,
  Check
} from 'lucide-react';

const STATUS_STEPS: { key: ShipmentStatus; label: string }[] = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'driver_assigned', label: 'Assigned' },
  { key: 'going_to_pickup', label: 'Pickup' },
  { key: 'picked_up', label: 'Loaded' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' }
];

export const TrackingPanel: React.FC = () => {
  const { 
    activeTrackingShipment, 
    setActiveView, 
    showToast,
    recenterMap
  } = useApp();

  const [progress, setProgress] = useState<number>(45);
  const [isSimulating, setIsSimulating] = useState(true);

  const shipment = activeTrackingShipment;

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) {
          setIsSimulating(false);
          return 100;
        }
        return prev + 1.2;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  if (!shipment) {
    return (
      <div className="p-4 glass-panel rounded-2xl text-center space-y-2 pointer-events-auto">
        <p className="text-xs text-neutral-500">No active tracking shipment.</p>
        <button
          onClick={() => setActiveView('find_truck')}
          className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl text-xs"
        >
          Find a Truck
        </button>
      </div>
    );
  }

  const trackingInfo = TrackingService.getInterpolatedPosition(
    progress,
    shipment.truck?.routePolyline
  );

  const getStepIndex = (status: ShipmentStatus) => {
    return STATUS_STEPS.findIndex(s => s.key === status);
  };

  const currentStepIndex = getStepIndex(trackingInfo.status);

  const handleCall = () => {
    showToast(`Calling driver ${shipment.truck?.driver.name || 'Rajesh Kumar'}...`, 'info');
  };

  const handleMessage = () => {
    showToast(`Chat opened with driver`, 'info');
  };

  const handleShare = () => {
    showToast(`Tracking link for ${shipment.trackingNumber} copied!`, 'info');
  };

  const handleReset = () => {
    setProgress(5);
    setIsSimulating(true);
    recenterMap(shipment.fromLocation.coordinates, 8);
    showToast('Simulation reset to origin', 'info');
  };

  return (
    <div className="w-full max-w-sm glass-panel rounded-3xl p-4 sm:p-5 border shadow-2xl space-y-3 pointer-events-auto transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('my_shipments')}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            title="Back to shipments"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-black text-neutral-900 dark:text-white font-mono">
              {shipment.trackingNumber}
            </div>
            <div className="text-[10px] text-neutral-500">
              {shipment.fromLocation.name} → {shipment.toLocation.name}
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white"
          title="Replay movement"
          aria-label="Replay"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Status */}
      <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">
            Status
          </span>
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mt-0.5">
            Your shipment is on the way
          </h3>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            {trackingInfo.speedKmph} km/h · NH48 Highway
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] uppercase font-bold text-neutral-400 block">ETA</span>
          <div className="text-xl font-black text-neutral-900 dark:text-white">
            {trackingInfo.etaMinutes} min
          </div>
        </div>
      </div>

      {/* Horizontal Mini Timeline */}
      <div className="py-1">
        <div className="flex items-center justify-between text-[10px] font-semibold text-neutral-400 mb-1 px-1">
          {STATUS_STEPS.map((step, idx) => (
            <span 
              key={step.key} 
              className={idx <= currentStepIndex ? 'text-neutral-900 dark:text-white font-bold' : ''}
            >
              {step.label}
            </span>
          ))}
        </div>
        <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black dark:bg-white rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(10, (currentStepIndex + 1) * 16.6))}%` }}
          />
        </div>
      </div>

      {/* Driver Card & Controls */}
      <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-900 dark:text-white">
            {(shipment.truck?.driver.name || 'R').charAt(0)}
          </div>
          <div>
            <div className="text-xs font-extrabold text-neutral-900 dark:text-white">
              {shipment.truck?.driver.name || 'Rajesh Kumar'}
            </div>
            <div className="text-[10px] text-neutral-500">
              {shipment.truck?.name || 'Ashok Leyland 1618'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCall}
            className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center transition-colors shadow-sm"
            title="Call Driver"
            aria-label="Call"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMessage}
            className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center transition-colors shadow-sm"
            title="Message Driver"
            aria-label="Message"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center transition-colors shadow-sm"
            title="Share Tracking"
            aria-label="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
