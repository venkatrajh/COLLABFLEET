import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shipment, ShipmentStatus } from '../../types';
import { TrackingService } from '../../services/trackingService';
import { 
  Truck as TruckIcon, 
  User, 
  Phone, 
  MessageSquare, 
  Share2, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  RotateCw,
  Sparkles
} from 'lucide-react';

const STATUS_STEPS: { key: ShipmentStatus; label: string }[] = [
  { key: 'confirmed', label: 'Booking Confirmed' },
  { key: 'driver_assigned', label: 'Driver Assigned' },
  { key: 'going_to_pickup', label: 'Going to Pickup' },
  { key: 'picked_up', label: 'Shipment Picked Up' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' }
];

export const TrackingPanel: React.FC = () => {
  const { 
    activeTrackingShipment, 
    setActiveView, 
    showToast 
  } = useApp();

  const [progress, setProgress] = useState<number>(45); // Start mid-way for great visual demo
  const [isSimulating, setIsSimulating] = useState(true);

  const shipment = activeTrackingShipment;

  // Realistic simulated movement along corridor
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
      <div className="p-6 glass-panel rounded-2xl text-center space-y-3">
        <p className="text-sm text-slate-400">No active tracking shipment selected.</p>
        <button
          onClick={() => setActiveView('find_truck')}
          className="px-4 py-2 bg-brand-cyan text-dark-950 font-bold rounded-xl text-xs"
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
    showToast(`Calling driver ${shipment.truck?.driver.name || 'Rajesh Kumar'} (${shipment.truck?.driver.phone || '+91 98410 44291'})...`, 'info');
  };

  const handleMessage = () => {
    showToast(`Messaging channel opened with driver`, 'info');
  };

  const handleShare = () => {
    showToast(`Tracking link for ${shipment.trackingNumber} copied!`, 'info');
  };

  const handleResetSimulation = () => {
    setProgress(5);
    setIsSimulating(true);
    showToast('Simulation reset to origin', 'info');
  };

  return (
    <div className="w-full max-w-lg glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl space-y-4 pointer-events-auto">
      
      {/* Top Header: Back Button, Title & Status */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('my_shipments')}
            className="p-1.5 rounded-xl bg-dark-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Back to shipments"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {shipment.trackingNumber}
              </h2>
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            </div>
            <p className="text-[11px] text-slate-400">
              {shipment.fromLocation.name} → {shipment.toLocation.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetSimulation}
            className="p-1.5 rounded-xl bg-dark-900/80 border border-white/10 text-slate-400 hover:text-brand-cyan transition-colors"
            title="Replay simulated movement"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <span className="px-2.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan text-xs font-black">
            {trackingInfo.statusLabel}
          </span>
        </div>
      </div>

      {/* Main Status Headline: "Your shipment is on the way" */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-cyan/15 via-dark-900 to-dark-850 border border-brand-cyan/25 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider block">
            Live Telemetry
          </span>
          <h3 className="text-base font-black text-white mt-0.5">
            Your shipment is on the way
          </h3>
          <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
            <span>Speed: <strong className="text-white font-mono">{trackingInfo.speedKmph} km/h</strong></span>
            <span>·</span>
            <span>Corridor: <strong className="text-white">NH48 Express</strong></span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Arrival</span>
          <div className="text-2xl font-black text-brand-cyan">
            {trackingInfo.etaMinutes} min
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">On Time</span>
        </div>
      </div>

      {/* Status Timeline Progress */}
      <div className="p-4 rounded-2xl bg-dark-900/80 border border-white/5 space-y-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Milestone Timeline
        </span>

        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isUpcoming = idx > currentStepIndex;

            return (
              <div key={step.key} className="relative flex items-center justify-between text-xs">
                {/* Node icon */}
                <div className={`absolute -left-6 w-4 h-4 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-emerald-400 text-dark-950 ring-4 ring-dark-950' 
                    : isCurrent 
                    ? 'bg-brand-cyan text-dark-950 ring-4 ring-brand-cyan/30 animate-pulse' 
                    : 'bg-dark-800 border border-slate-700 text-slate-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                  ) : isCurrent ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-950" />
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                  )}
                </div>

                <span className={`font-semibold ${
                  isCompleted ? 'text-slate-300' : isCurrent ? 'text-brand-cyan font-bold text-sm' : 'text-slate-500'
                }`}>
                  {step.label}
                </span>

                {isCurrent && (
                  <span className="text-[10px] font-bold text-brand-cyan bg-brand-cyan/15 px-2 py-0.5 rounded-md border border-brand-cyan/30">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Card with Call, Message & Share */}
      <div className="p-3.5 rounded-2xl bg-dark-900/90 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={shipment.truck?.driver.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} 
            alt="Driver"
            className="w-11 h-11 rounded-xl object-cover border border-white/10"
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{shipment.truck?.driver.name || 'Rajesh Kumar'}</span>
              <span className="text-[10px] text-amber-400">⭐ {shipment.truck?.driver.rating || 4.8}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {shipment.truck?.name || 'Ashok Leyland 1618'} · {shipment.truck?.registrationNumber || 'TN 09 BX 4821'}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCall}
            className="w-8 h-8 rounded-xl bg-dark-800 border border-white/10 hover:border-emerald-500/40 text-emerald-400 flex items-center justify-center transition-colors shadow"
            title="Call Driver"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleMessage}
            className="w-8 h-8 rounded-xl bg-dark-800 border border-white/10 hover:border-brand-cyan text-brand-cyan flex items-center justify-center transition-colors shadow"
            title="Message Driver"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-xl bg-dark-800 border border-white/10 hover:border-white text-slate-300 flex items-center justify-center transition-colors shadow"
            title="Share Tracking"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
