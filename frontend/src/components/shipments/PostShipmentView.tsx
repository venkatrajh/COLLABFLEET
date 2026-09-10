import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LocationSearch } from '../map/LocationSearch';
import { TruckType, LocationHub } from '../../types';
import { INDIAN_LOCATION_HUBS } from '../../services/mockData';
import { PlusCircle, Sparkles, Calendar, Clock, FileText, ArrowRight } from 'lucide-react';

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
    showToast('Shipment posted! AI matching engine initiated.', 'success');
    startFreightSearch(query);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 pb-20 pointer-events-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-glass">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Post a Shipment
            </h1>
            <p className="text-xs text-slate-400">
              List freight requirements to connect with underutilized return-journey trucks
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Pickup & Destination */}
          <div className="space-y-3">
            <LocationSearch
              label="Pickup Location"
              selectedLocation={fromLocation}
              onSelectLocation={(loc) => setFromLocation(loc)}
              placeholder="Search pickup city or hub..."
            />

            <LocationSearch
              label="Delivery Destination"
              selectedLocation={toLocation}
              onSelectLocation={(loc) => setToLocation(loc)}
              placeholder="Search delivery destination..."
              iconColor="text-emerald-400"
            />
          </div>

          {/* Cargo Type & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Cargo Description
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="e.g. Industrial Electronics"
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Weight (Tons)
              </label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
                required
              />
            </div>
          </div>

          {/* Truck Type Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Truck Type Needed
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TRUCK_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTruckType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    truckType === type
                      ? 'bg-brand-cyan text-dark-950 font-bold'
                      : 'bg-dark-900/80 text-slate-300 border border-white/5 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Pickup Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl glass-input text-xs font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Pickup Time
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl glass-input text-xs font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Special Handling / Instructions
            </label>
            <textarea
              rows={2}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="e.g. Fragile cargo, tail-lift required, cold chain..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-cyan via-sky-500 to-blue-600 text-dark-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find Available Trucks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
