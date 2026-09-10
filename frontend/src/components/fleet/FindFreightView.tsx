import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FreightOpportunity } from '../../types';
import { TruckService } from '../../services/truckService';
import { Modal } from '../common/Modal';
import { 
  Boxes, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  ArrowRight, 
  CheckCircle2, 
  ArrowLeftRight 
} from 'lucide-react';

export const FindFreightView: React.FC = () => {
  const { showToast, setActiveView } = useApp();
  const [opportunities, setOpportunities] = useState<FreightOpportunity[]>([]);
  const [selectedFreight, setSelectedFreight] = useState<FreightOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFreight = async () => {
      setIsLoading(true);
      try {
        const data = await TruckService.getFreightOpportunities();
        setOpportunities(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadFreight();
  }, []);

  const handleAcceptFreight = (freight: FreightOpportunity) => {
    setSelectedFreight(null);
    showToast(`Accepted freight ${freight.shipmentId} (${freight.cargoType})! Driver notified.`, 'success');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 pointer-events-auto">
      
      {/* Title Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-glass flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Freight looking for trucks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              {opportunities.length} Loads Available
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified cargo postings matching your return routes with minimum deadhead
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-dark-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Total empty km avoid: <strong className="text-emerald-400 font-mono">211 km</strong></span>
        </div>
      </div>

      {/* Freight Cards Grid */}
      {isLoading ? (
        <div className="p-8 text-center glass-panel rounded-3xl text-slate-400 text-xs">
          Searching available freight matching your corridors...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((freight) => (
            <div 
              key={freight.id}
              className="glass-card rounded-2xl p-5 border border-white/10 hover:border-emerald-500/40 transition-all space-y-3.5 group"
            >
              {/* Route & AI Match Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                    <span>{freight.fromLocation.name}</span>
                    <span className="text-emerald-400">→</span>
                    <span>{freight.toLocation.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    Shipper: {freight.shipperName} (⭐ {freight.shipperRating})
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan text-xs font-black flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-cyan" />
                  <span>{freight.matchScore}% AI Match</span>
                </div>
              </div>

              {/* Cargo Specs & Pickup Time */}
              <div className="grid grid-cols-3 gap-2 bg-dark-900/60 p-3 rounded-xl border border-white/5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Weight</span>
                  <span className="font-extrabold text-white">{freight.weightTons} Tons</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pickup</span>
                  <span className="font-semibold text-slate-200">{freight.pickupTime}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Earnings</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    ₹{freight.estimatedEarnings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Backhaul Savings Metric */}
              <div className="flex items-center justify-between text-xs bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-500/20">
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                  Empty distance avoided:
                </span>
                <span className="font-black text-emerald-400 font-mono">
                  {freight.emptyKmSaved} km deadhead eliminated
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <button
                  onClick={() => setSelectedFreight(freight)}
                  className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  View Freight Details
                </button>

                <button
                  onClick={() => handleAcceptFreight(freight)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-dark-950 font-black text-xs shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <span>Accept Cargo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Freight Details Modal */}
      {selectedFreight && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFreight(null)}
          maxWidth="max-w-md"
          title="Freight Opportunity Dossier"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-dark-900 border border-white/10 space-y-2">
              <div className="text-sm font-bold text-white">
                {selectedFreight.cargoType}
              </div>
              <div className="text-slate-300">
                Route: <strong className="text-white">{selectedFreight.fromLocation.name}</strong> → <strong className="text-white">{selectedFreight.toLocation.name}</strong>
              </div>
              <div className="text-slate-300">
                Weight: <strong className="text-brand-cyan">{selectedFreight.weightTons} Tons</strong>
              </div>
              <div className="text-slate-300">
                Pickup Scheduled: <strong className="text-white">{selectedFreight.pickupTime}</strong>
              </div>
              <div className="text-slate-300">
                Estimated Payout: <strong className="text-emerald-400 text-sm">₹{selectedFreight.estimatedEarnings.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200">
              ✓ Matches return journey to eliminate {selectedFreight.emptyKmSaved} km of empty deadhead travel.
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSelectedFreight(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => handleAcceptFreight(selectedFreight)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-dark-950 font-black"
              >
                Confirm & Accept Cargo
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
