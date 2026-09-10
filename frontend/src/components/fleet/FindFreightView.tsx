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
    showToast(`Accepted freight ${freight.shipmentId}! Driver Kumar notified.`, 'success');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-20 pointer-events-auto">
      
      {/* Title Banner */}
      <div className="bg-white border border-[#DEDDD8] p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-[#111111] tracking-tight flex items-center gap-2">
            <span>Freight Looking for Trucks</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#111111] text-white text-xs font-mono font-bold">
              {opportunities.length} AVAILABLE
            </span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5 font-medium">
            Verified freight matching your return-trip corridors to eliminate deadhead miles
          </p>
        </div>
      </div>

      {/* Freight Cards Grid */}
      {isLoading ? (
        <div className="p-10 text-center bg-white border border-[#DEDDD8] rounded-[20px] text-[#777777] text-xs font-medium">
          Finding optimal freight loads for your return corridors...
        </div>
      ) : (
        <div className="space-y-3.5">
          {opportunities.map((freight) => (
            <div 
              key={freight.id}
              className="bg-white rounded-[20px] border border-[#DEDDD8] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 space-y-3.5"
            >
              {/* Header: Route, Shipper & Black Match Badge */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#111111] tracking-tight">
                    <span>{freight.fromLocation.name}</span>
                    <span className="text-[#888888] font-normal">→</span>
                    <span>{freight.toLocation.name}</span>
                  </div>
                  <div className="text-xs text-[#666666] mt-0.5 font-medium flex items-center gap-2">
                    <span>{freight.cargoType}</span>
                    <span className="text-[#CCCCCC]">•</span>
                    <span>Shipper: {freight.shipperName}</span>
                  </div>
                </div>

                <span className="bg-[#111111] text-white text-[11px] font-mono px-3 py-1 rounded-full font-bold shadow-sm shrink-0">
                  {freight.matchScore}% MATCH
                </span>
              </div>

              {/* Warm-Gray Information Strip (Weight | Pickup | Earnings) */}
              <div className="bg-[#F7F6F2] border border-[#EBEAE5] rounded-xl p-3 grid grid-cols-3 divide-x divide-[#E5E4DE] text-xs">
                <div className="pr-3">
                  <span className="text-[10px] uppercase font-bold text-[#777777] block tracking-wider">Weight</span>
                  <span className="font-extrabold text-[#111111] text-xs sm:text-sm">{freight.weightTons} Tons</span>
                </div>

                <div className="px-3">
                  <span className="text-[10px] uppercase font-bold text-[#777777] block tracking-wider">Pickup</span>
                  <span className="font-bold text-[#111111] text-xs sm:text-sm">{freight.pickupTime}</span>
                </div>

                <div className="pl-3 text-right">
                  <span className="text-[10px] uppercase font-bold text-[#777777] block tracking-wider">Est. Earnings</span>
                  <span className="font-black text-[#111111] text-xs sm:text-sm">
                    ₹{freight.estimatedEarnings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Efficiency & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-[#555555] font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{freight.emptyKmSaved} km deadhead eliminated · Matches return corridor</span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setSelectedFreight(freight)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#555555] hover:text-[#111111] hover:bg-[#F0EFEA] transition-all"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => handleAcceptFreight(freight)}
                    className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Accept Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#DEDDD8] space-y-2">
              <div className="text-sm font-black text-[#111111]">
                {selectedFreight.cargoType}
              </div>
              <div className="text-[#666666]">
                Route: <strong className="text-[#111111]">{selectedFreight.fromLocation.name} → {selectedFreight.toLocation.name}</strong>
              </div>
              <div className="text-[#666666]">
                Weight: <strong className="text-[#111111]">{selectedFreight.weightTons} Tons</strong>
              </div>
              <div className="text-[#666666]">
                Pickup Scheduled: <strong className="text-[#111111]">{selectedFreight.pickupTime}</strong>
              </div>
              <div className="text-[#666666]">
                Estimated Earnings: <strong className="text-sm font-black text-[#111111]">₹{selectedFreight.estimatedEarnings.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#EBEAE5] text-[#444444] font-medium leading-relaxed">
              This load connects directly with your return journey corridor, eliminating {selectedFreight.emptyKmSaved} km of empty deadhead travel and boosting per-kilometer earnings by up to 34%.
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSelectedFreight(null)}
                className="px-4 py-2 rounded-xl text-[#666666] hover:text-[#111111] font-bold"
              >
                Close
              </button>
              <button
                onClick={() => handleAcceptFreight(selectedFreight)}
                className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white font-extrabold shadow-md"
              >
                Accept Load Now
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
