import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LocationSearch } from '../map/LocationSearch';
import { TruckType, LocationHub } from '../../types';
import { INDIAN_LOCATION_HUBS } from '../../services/mockData';
import { PlusCircle, Calendar, Clock, ArrowRight, Package, Truck } from 'lucide-react';

const TRUCK_TYPES: TruckType[] = [
  'Mini Truck',
  'Light Truck',
  'Medium Truck',
  'Heavy Truck',
  'Container Truck'
];

export const PostShipmentView: React.FC = () => {
  const { startFreightSearch, setSearchQuery, showToast } = useApp();

  const [fromLocation, setFromLocation] = useState<LocationHub | null>(INDIAN_LOCATION_HUBS[0]);
  const [toLocation, setToLocation] = useState<LocationHub | null>(INDIAN_LOCATION_HUBS[4]);
  const [cargo, setCargo] = useState('Electronics Components');
  const [weight, setWeight] = useState(8);
  const [truckType, setTruckType] = useState<TruckType>('Heavy Truck');
  const [pickupDate, setPickupDate] = useState('2026-09-10');
  const [pickupTime, setPickupTime] = useState('17:30');
  const [specialRequirements, setSpecialRequirements] = useState('Requires weather-proof container and vibration dampeners');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromLocation || !toLocation) {
      showToast('Please select both pickup and destination locations', 'error');
      return;
    }

    const query = {
      fromLocation,
      toLocation,
      cargoType: cargo,
      weightTons: weight,
      truckType
    };

    setSearchQuery(query);
    showToast('Shipment posted! Matching collaborative trucks...', 'success');
    startFreightSearch(query);
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* Post Shipment Panel */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl shadow-xs overflow-hidden flex flex-col max-h-[720px] lg:max-h-[calc(100vh-140px)]">
        
        {/* Island Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EBEAE5] bg-white flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold shadow-sm">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#111111] tracking-tight">
              Post a Shipment
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              List freight needs to connect with return-journey trucks
            </p>
          </div>
        </div>

        {/* Scrollable Form Body with Connected Sections */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto divide-y divide-[#EBEAE5] bg-white scrollbar-thin flex-1">
            
            {/* Section 1: Route Corridor */}
            <div className="p-5 sm:p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                1. Corridor Route
              </span>
              <div className="space-y-3">
                <LocationSearch
                  label="Pickup Location"
                  selectedLocation={fromLocation}
                  onSelectLocation={(loc) => setFromLocation(loc)}
                  placeholder="Search pickup hub..."
                />

                <LocationSearch
                  label="Delivery Destination"
                  selectedLocation={toLocation}
                  onSelectLocation={(loc) => setToLocation(loc)}
                  placeholder="Search destination hub..."
                />
              </div>
            </div>

            {/* Section 2: Cargo & Weight */}
            <div className="p-5 sm:p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                2. Cargo Specifications
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Cargo Description
                  </label>
                  <input
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="e.g. Industrial Machinery, Electronics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-medium transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Weight (Tons)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-medium transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Truck Type Needed */}
            <div className="p-5 sm:p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                3. Vehicle Requirement
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TRUCK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTruckType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      truckType === type
                        ? 'bg-[#111111] text-white shadow-sm'
                        : 'bg-[#FAF9F6] hover:bg-[#F0EFEA] text-neutral-600 border border-[#DEDDD8]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Schedule */}
            <div className="p-5 sm:p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                4. Pickup Schedule
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-medium transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Time Window
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-medium transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Handling Notes */}
            <div className="p-5 sm:p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                5. Special Handling
              </span>
              <textarea
                rows={2}
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="e.g. Waterproof tarping, tail-lift required, temperature control..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-medium resize-none transition-all"
              />
            </div>

          </div>

          {/* Island Footer CTA Strip */}
          <div className="p-4 sm:p-5 bg-[#FAF9F6] border-t border-[#EBEAE5] shrink-0">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-2xl bg-[#111111] hover:bg-black text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>Find Available Matching Trucks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
