import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LocationSearch } from '../map/LocationSearch';
import { TruckType, LocationHub } from '../../types';
import { INDIAN_LOCATION_HUBS } from '../../services/mockData';
import { PlusCircle, Calendar, Clock, ArrowRight } from 'lucide-react';

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
    showToast('Shipment posted! Matching trucks now...', 'success');
    startFreightSearch(query);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-20 pointer-events-auto">
      
      {/* Header */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight">
              Post a Shipment
            </h1>
            <p className="text-xs text-neutral-500">
              List freight needs to connect with return-journey trucks
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-5 rounded-3xl border shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          <div className="space-y-2.5">
            <LocationSearch
              label="Pickup Location"
              selectedLocation={fromLocation}
              onSelectLocation={(loc) => setFromLocation(loc)}
              placeholder="Search pickup..."
            />

            <LocationSearch
              label="Delivery Destination"
              selectedLocation={toLocation}
              onSelectLocation={(loc) => setToLocation(loc)}
              placeholder="Search destination..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Cargo Description
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Electronics"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Weight (Tons)
              </label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Truck Needed
            </label>
            <div className="flex flex-wrap gap-1">
              {TRUCK_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTruckType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    truckType === type
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow'
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Special Handling
            </label>
            <textarea
              rows={2}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="e.g. Fragile cargo, tail-lift required..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span>Find Available Trucks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
