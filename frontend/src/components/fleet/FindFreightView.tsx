import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FreightOpportunity } from '../../types';
import { TruckService } from '../../services/truckService';
import { Modal } from '../common/Modal';
import { ArrowRight } from 'lucide-react';

export const FindFreightView: React.FC = () => {
  const { showToast } = useApp();
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
    showToast(`Accepted freight ${freight.shipmentId}! Driver notified.`, 'success');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-20 pointer-events-auto">
      
      {/* Title Banner */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Freight looking for trucks</span>
            <span className="px-2 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold">
              {opportunities.length}
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Verified freight matching your return-trip corridors
          </p>
        </div>
      </div>

      {/* Freight Cards Grid */}
      {isLoading ? (
        <div className="p-8 text-center glass-panel rounded-3xl text-neutral-400 text-xs">
          Loading available freight...
        </div>
      ) : (
        <div className="space-y-3">
          {opportunities.map((freight) => (
            <div 
              key={freight.id}
              className="glass-card rounded-2xl p-4 border hover:border-black dark:hover:border-white transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-extrabold text-neutral-900 dark:text-white">
                    <span>{freight.fromLocation.name}</span>
                    <span className="text-neutral-400">→</span>
                    <span>{freight.toLocation.name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    {freight.cargoType} · Shipper: {freight.shipperName}
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-extrabold">
                  {freight.matchScore}% Match
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Weight</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{freight.weightTons} Tons</span>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Pickup</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{freight.pickupTime}</span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Earnings</span>
                  <span className="font-black text-neutral-900 dark:text-white">
                    ₹{freight.estimatedEarnings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-neutral-500">
                  {freight.emptyKmSaved} km deadhead eliminated
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFreight(freight)}
                    className="text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => handleAcceptFreight(freight)}
                    className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow hover:opacity-90 transition-all flex items-center gap-1"
                  >
                    <span>Accept</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedFreight && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFreight(null)}
          maxWidth="max-w-md"
          title="Freight Load Details"
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
              <div className="text-sm font-bold text-neutral-900 dark:text-white">
                {selectedFreight.cargoType}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Route: <strong className="text-neutral-900 dark:text-white">{selectedFreight.fromLocation.name} → {selectedFreight.toLocation.name}</strong>
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Weight: <strong className="text-neutral-900 dark:text-white">{selectedFreight.weightTons} Tons</strong>
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Pickup Scheduled: <strong className="text-neutral-900 dark:text-white">{selectedFreight.pickupTime}</strong>
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Estimated Earnings: <strong className="text-sm font-black text-neutral-900 dark:text-white">₹{selectedFreight.estimatedEarnings.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
              Matches return corridor to eliminate {selectedFreight.emptyKmSaved} km of empty deadhead travel.
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSelectedFreight(null)}
                className="px-4 py-2 rounded-xl text-neutral-500 hover:text-black dark:hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => handleAcceptFreight(selectedFreight)}
                className="px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold"
              >
                Accept Freight
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
