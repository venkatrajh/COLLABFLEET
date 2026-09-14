import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { LocationSearch } from '../map/LocationSearch';
import { LocationHub, TruckType } from '../../types';
import { INDIAN_LOCATION_HUBS } from '../../services/mockData';
import { TruckService } from '../../services/truckService';
import { Truck as TruckIcon } from 'lucide-react';

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
  const { isAddTruckOpen, setIsAddTruckOpen, showToast, triggerNotification } = useApp();

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

      showToast(`Truck ${name} added to fleet!`, 'success');
      triggerNotification(
        'SYSTEM',
        'Truck Added to Fleet',
        `${name} (${plateNumber}) is now active and ready for collaborative matching.`,
        undefined,
        'my_trucks'
      );
      setIsAddTruckOpen(false);
      onTruckAdded?.();
      
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
      maxWidth="max-w-md"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
            <TruckIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Add a Truck</h3>
            <p className="text-[10px] text-neutral-500 font-normal">
              Register capacity for return-journey freight
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Truck Model
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ashok Leyland 1618"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Plate Number
            </label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="TN 09 BX 4821"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold uppercase font-mono"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Truck Type
          </label>
          <div className="flex flex-wrap gap-1">
            {TRUCK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTruckType(type)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
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

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Total Space (Tons)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(parseFloat(e.target.value) || 16)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Available (Tons)
            </label>
            <input
              type="number"
              min="0.5"
              max={totalCapacity}
              step="0.5"
              value={availableCapacity}
              onChange={(e) => setAvailableCapacity(parseFloat(e.target.value) || 8.5)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <LocationSearch
            label="Current Location"
            selectedLocation={currentLocation}
            onSelectLocation={(loc) => setCurrentLocation(loc)}
            placeholder="Where is the truck stationed?"
          />

          <LocationSearch
            label="Returning Toward"
            selectedLocation={currentDestination}
            onSelectLocation={(loc) => setCurrentDestination(loc)}
            placeholder="Where is the return journey heading?"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setIsAddTruckOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow hover:opacity-90 transition-all"
          >
            {isSubmitting ? 'Saving...' : 'Save Truck'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
