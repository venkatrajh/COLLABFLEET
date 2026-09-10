import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { LocationSearch } from '../map/LocationSearch';
import { LocationHub, TruckType } from '../../types';
import { INDIAN_LOCATION_HUBS } from '../../services/mockData';
import { TruckService } from '../../services/truckService';
import { Truck as TruckIcon, PlusCircle, Check } from 'lucide-react';

const TRUCK_TYPES: TruckType[] = [
  'Mini Truck',
  'Light Truck',
  'Medium Truck',
  'Heavy Truck',
  'Container Truck'
];

interface AddTruckModalProps {
  onTruckAdded?: () => void;
}

export const AddTruckModal: React.FC<AddTruckModalProps> = ({ onTruckAdded }) => {
  const { isAddTruckOpen, setIsAddTruckOpen, showToast } = useApp();

  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [truckType, setTruckType] = useState<TruckType>('Heavy Truck');
  const [totalCapacity, setTotalCapacity] = useState(16);
  const [availableCapacity, setAvailableCapacity] = useState(8.5);
  const [currentLocation, setCurrentLocation] = useState<LocationHub | null>(INDIAN_LOCATION_HUBS[0]);
  const [currentDestination, setCurrentDestination] = useState<LocationHub | null>(INDIAN_LOCATION_HUBS[4]);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !plateNumber || !currentLocation) {
      showToast('Please fill all mandatory truck details', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await TruckService.addTruck({
        name,
        model: model || name,
        registrationNumber: plateNumber,
        truckType,
        totalCapacityTons: totalCapacity,
        currentLoadTons: totalCapacity - availableCapacity,
        availableCapacityTons: availableCapacity,
        currentLocation,
        currentDestination: currentDestination || undefined,
        company: 'Apex Express Fleet',
        pricePerKm: 24,
        isAvailable: true,
        driverName: driverName || 'Senthil Kumar',
        driverPhone: driverPhone || '+91 98401 98765'
      });

      showToast(`Truck ${name} (${plateNumber}) added to fleet!`, 'success');
      setIsAddTruckOpen(false);
      onTruckAdded?.();
      
      // Reset form
      setName('');
      setPlateNumber('');
    } catch (err) {
      showToast('Error saving truck. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isAddTruckOpen}
      onClose={() => setIsAddTruckOpen(false)}
      maxWidth="max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
            <TruckIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Add a Truck</h3>
            <p className="text-[11px] text-slate-400 font-normal">
              Register capacity to monetize return-trip corridors
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Truck Name & Plate Number */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Truck Name / Model
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ashok Leyland 1618"
              className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Vehicle Plate Number
            </label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="e.g. TN 09 BX 4821"
              className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium uppercase font-mono"
              required
            />
          </div>
        </div>

        {/* Truck Type */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Truck Type
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

        {/* Capacities */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Total Capacity (Tons)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(parseFloat(e.target.value) || 16)}
              className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Available Space (Tons)
            </label>
            <input
              type="number"
              min="0.5"
              max={totalCapacity}
              step="0.5"
              value={availableCapacity}
              onChange={(e) => setAvailableCapacity(parseFloat(e.target.value) || 8.5)}
              className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
              required
            />
          </div>
        </div>

        {/* Current Location & Target Destination */}
        <div className="space-y-3">
          <LocationSearch
            label="Current Location"
            selectedLocation={currentLocation}
            onSelectLocation={(loc) => setCurrentLocation(loc)}
            placeholder="Where is the truck currently stationed?"
          />

          <LocationSearch
            label="Returning Toward (Destination corridor)"
            selectedLocation={currentDestination}
            onSelectLocation={(loc) => setCurrentDestination(loc)}
            placeholder="Where is the return journey heading?"
            iconColor="text-emerald-400"
          />
        </div>

        {/* Driver Details */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Assigned Driver Name
            </label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Driver Phone Number
            </label>
            <input
              type="tel"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              placeholder="+91 98410 44291"
              className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium font-mono"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => setIsAddTruckOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 text-dark-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
          >
            {isSubmitting ? 'Saving...' : 'Save Truck'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
