import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Modal } from '../common/Modal';
import { 
  Building2, 
  Mail, 
  Phone, 
  Star, 
  MapPin, 
  LogOut, 
  Leaf, 
  Bell, 
  Shield, 
  Navigation, 
  Check, 
  Edit3, 
  Crosshair, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile,
    updateUserSettings,
    currentRole, 
    setRole, 
    logoutUser,
    userLocation,
    locationPermissionState,
    requestUserLocation,
    recenterOnUserLocation,
    recenterMap,
    showToast,
    setActiveView 
  } = useApp();

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editCompany, setEditCompany] = useState(userProfile.company);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editPhone, setEditPhone] = useState(userProfile.phone);
  const [editRole, setEditRole] = useState<UserRole>(userProfile.role);

  // Selected Hub state with glassmorphism
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);

  // Handle Save Profile Edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    updateUserProfile({
      name: editName.trim(),
      company: editCompany.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      role: editRole
    });

    if (editRole !== currentRole) {
      setRole(editRole);
    }

    setIsEditModalOpen(false);
    showToast('Profile updated successfully!', 'success');
  };

  // Open Edit Modal with fresh data
  const handleOpenEditModal = () => {
    setEditName(userProfile.name);
    setEditCompany(userProfile.company);
    setEditEmail(userProfile.email);
    setEditPhone(userProfile.phone);
    setEditRole(userProfile.role);
    setIsEditModalOpen(true);
  };

  // Safe Settings Getters
  const settings = userProfile.settings || {
    notifications: {
      shipmentUpdates: true,
      newTruckMatches: true,
      bookingUpdates: true,
      fleetOpportunities: true
    },
    privacy: {
      profileVisibility: true,
      showCompanyInfo: true,
      shareTracking: false
    },
    location: {
      locationServicesEnabled: true,
      permissionStatus: locationPermissionState
    }
  };

  // Notification Toggles
  const handleToggleNotification = (key: keyof typeof settings.notifications) => {
    const updated = {
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    };
    updateUserSettings(updated);
  };

  // Privacy Toggles
  const handleTogglePrivacy = (key: keyof typeof settings.privacy) => {
    const updated = {
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key]
      }
    };
    updateUserSettings(updated);
  };

  // Location Toggle
  const handleToggleLocationServices = () => {
    const newState = !settings.location.locationServicesEnabled;
    updateUserSettings({
      location: {
        ...settings.location,
        locationServicesEnabled: newState
      }
    });
    if (newState && !userLocation) {
      requestUserLocation();
    }
  };

  const handleSelectHub = (hub: typeof userProfile.savedLocations[0]) => {
    setSelectedHubId(hub.id);
    recenterMap(hub.coordinates, 11);
    showToast(`Selected ${hub.name} · Map centered on hub`, 'info');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2.5 pb-24 pointer-events-auto">
      
      {/* 1. Profile Header Card */}
      <div className="bg-white border border-[#DEDDD8] p-5 sm:p-6 rounded-[22px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-[#111111] tracking-tight">{userProfile.name}</h1>
              <span className="flex items-center text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                ★ {userProfile.rating}
              </span>
            </div>
            <div className="text-xs text-[#666666] font-medium flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>{userProfile.company}</span>
            </div>
          </div>
        </div>

        {/* Edit Profile Action */}
        <button
          onClick={handleOpenEditModal}
          className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 2. Connected Card Group: Contact & Saved Hubs (Minimal 2px gap / Border-Collapse Layout) */}
      <div className="bg-white border border-[#DEDDD8] rounded-[22px] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E4DE] text-xs">
          
          {/* Contact Details */}
          <div className="pb-3 sm:pb-0 sm:pr-4 space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
              Contact Details
            </h3>
            <div className="space-y-2 text-[#333333]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-semibold">{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-mono font-bold">{userProfile.phone}</span>
              </div>
            </div>
          </div>

          {/* Saved Hubs (with Glassmorphic selected state) */}
          <div className="pt-3 sm:pt-0 sm:pl-4 space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777] flex items-center justify-between">
              <span>Saved Freight Hubs</span>
              <span className="text-[9px] lowercase font-normal text-neutral-400">click to view on map</span>
            </h3>
            <div className="space-y-1.5">
              {userProfile.savedLocations.slice(0, 3).map((hub) => {
                const isSelected = selectedHubId === hub.id;
                return (
                  <div 
                    key={hub.id} 
                    onClick={() => handleSelectHub(hub)}
                    className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      isSelected 
                        ? 'glass-selected' 
                        : 'bg-[#F7F6F2] hover:bg-[#EFEFEA] border border-[#EBEAE5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3 h-3 ${isSelected ? 'text-[#111111]' : 'text-neutral-400'}`} />
                      <div>
                        <div className="text-xs font-bold text-[#111111] leading-tight">
                          {hub.name}
                        </div>
                        {isSelected && (
                          <div className="text-[9px] text-[#666666] font-medium leading-tight">
                            Selected hub
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-500">{hub.city}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Lifetime Collaborative Impact (Unified border-collapse card, zero gaps) */}
      <div className="bg-white border border-[#DEDDD8] rounded-[22px] p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lifetime Collaborative Impact</span>
          </h3>
          <button
            onClick={() => setActiveView('smart_insights')}
            className="text-xs font-bold text-[#666666] hover:text-[#111111] hover:underline"
          >
            Insights →
          </button>
        </div>

        {/* Connected Metric Columns */}
        <div className="bg-[#F7F6F2] border border-[#EBEAE5] rounded-xl p-3 grid grid-cols-3 divide-x divide-[#E5E4DE] text-center">
          <div className="px-2">
            <div className="text-base sm:text-lg font-black text-[#111111]">
              {userProfile.stats.emptyKmSaved.toLocaleString('en-IN')} km
            </div>
            <div className="text-[10px] text-[#777777] font-semibold mt-0.5">Empty miles saved</div>
          </div>

          <div className="px-2">
            <div className="text-base sm:text-lg font-black text-[#111111]">
              ₹{userProfile.stats.moneySaved.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#777777] font-semibold mt-0.5">Freight savings</div>
          </div>

          <div className="px-2">
            <div className="text-base sm:text-lg font-black text-[#111111]">
              {userProfile.stats.co2ReductionKg} kg
            </div>
            <div className="text-[10px] text-[#777777] font-semibold mt-0.5">CO₂ prevented</div>
          </div>
        </div>
      </div>

      {/* 4. Settings Section (Clean Grouped Panels) */}
      <div className="bg-white border border-[#DEDDD8] rounded-[22px] p-4 sm:p-5 shadow-sm space-y-4">
        
        <h2 className="text-sm font-black text-[#111111] tracking-tight uppercase border-b border-[#E5E4DE] pb-2">
          Settings
        </h2>

        {/* A. Account Settings */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
            Account
          </h3>
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl divide-y divide-[#EBEAE5] text-xs">
            <div 
              onClick={handleOpenEditModal}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
            >
              <div>
                <div className="font-bold text-[#111111]">Edit Personal & Company Info</div>
                <div className="text-[10px] text-[#777777]">Update name, company, contact details</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#111111]">Active Operating Mode</div>
                <div className="text-[10px] text-[#777777]">Currently using as {currentRole === 'shipper' ? 'Shipper' : 'Fleet Owner'}</div>
              </div>
              <div className="flex items-center bg-[#EFEFEA] p-1 rounded-xl border border-[#DEDDD8]">
                <button
                  onClick={() => setRole('shipper')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    currentRole === 'shipper' ? 'bg-black text-white shadow-sm' : 'text-[#666666]'
                  }`}
                >
                  Shipper
                </button>
                <button
                  onClick={() => setRole('fleet_operator')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    currentRole === 'fleet_operator' ? 'bg-black text-white shadow-sm' : 'text-[#666666]'
                  }`}
                >
                  Fleet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* B. Notifications Settings */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
            <Bell className="w-3 h-3" />
            <span>Notifications</span>
          </h3>
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl divide-y divide-[#EBEAE5] text-xs">
            
            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#111111]">Shipment Updates</div>
                <div className="text-[10px] text-[#777777]">Real-time transit and arrival telemetry alerts</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.notifications.shipmentUpdates}
                onChange={() => handleToggleNotification('shipmentUpdates')}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#111111]">New Truck Matches</div>
                <div className="text-[10px] text-[#777777]">Instant alerts when collaborative backhaul capacity matches</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.notifications.newTruckMatches}
                onChange={() => handleToggleNotification('newTruckMatches')}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#111111]">Booking Updates</div>
                <div className="text-[10px] text-[#777777]">Confirmations, driver assignments, and receipts</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.notifications.bookingUpdates}
                onChange={() => handleToggleNotification('bookingUpdates')}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#111111]">Fleet Opportunities</div>
                <div className="text-[10px] text-[#777777]">Corridor fill notifications for fleet operators</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.notifications.fleetOpportunities}
                onChange={() => handleToggleNotification('fleetOpportunities')}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* C. Privacy Settings */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            <span>Privacy</span>
          </h3>
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl divide-y divide-[#EBEAE5] text-xs">
            
            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#111111]">Profile Visibility</div>
                <div className="text-[10px] text-[#777777]">Allow verified drivers and shippers to see your ratings</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.privacy.profileVisibility}
                onChange={() => handleTogglePrivacy('profileVisibility')}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#111111]">Show Company Information</div>
                <div className="text-[10px] text-[#777777]">Display enterprise name on load postings</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.privacy.showCompanyInfo}
                onChange={() => handleTogglePrivacy('showCompanyInfo')}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#111111]">Share Shipment Tracking</div>
                <div className="text-[10px] text-[#777777]">Generate public live tracking links for receivers</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.privacy.shareTracking}
                onChange={() => handleTogglePrivacy('shareTracking')}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* D. Location Services & Geolocation */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
            <Navigation className="w-3 h-3" />
            <span>Location</span>
          </h3>
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3.5 space-y-3 text-xs">
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#111111]">Location Services</div>
                <div className="text-[10px] text-[#777777]">Use actual device GPS for initial map positioning</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.location.locationServicesEnabled}
                onChange={handleToggleLocationServices}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-[#EBEAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="text-[11px] text-[#666666] flex items-center gap-1.5">
                  <span>Permission Status:</span>
                  <span className={`inline-flex items-center gap-1 font-bold ${
                    locationPermissionState === 'granted' 
                      ? 'text-emerald-700 font-extrabold' 
                      : locationPermissionState === 'denied' 
                        ? 'text-red-600' 
                        : 'text-amber-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      locationPermissionState === 'granted' ? 'bg-emerald-600' : 'bg-amber-500'
                    }`} />
                    {locationPermissionState === 'granted' ? 'Allowed' : locationPermissionState === 'denied' ? 'Blocked' : 'Not granted'}
                  </span>
                </div>

                {userLocation ? (
                  <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                    GPS: {userLocation[0].toFixed(4)}° N, {userLocation[1].toFixed(4)}° E
                  </div>
                ) : (
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    Location access is off. Enable it to center the map around you.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {locationPermissionState !== 'granted' && (
                  <button
                    onClick={() => requestUserLocation()}
                    className="px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Enable Location
                  </button>
                )}

                <button
                  onClick={() => recenterOnUserLocation()}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#DEDDD8] hover:bg-[#F0EFEA] text-[#111111] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Crosshair className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Recenter Map</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* E. Sign Out Action */}
        <div className="pt-2 border-t border-[#E5E4DE] flex justify-end">
          <button
            onClick={logoutUser}
            className="px-4 py-2.5 rounded-xl bg-[#F0EFEA] hover:bg-red-50 hover:text-red-600 border border-[#DEDDD8] hover:border-red-200 text-[#666666] text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

      {/* 5. Edit Profile Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          maxWidth="max-w-md"
          title="Edit User Profile"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
                placeholder="e.g. Nakul Venkatesh"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
                placeholder="e.g. Apex Technologies Freight Co."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
                  placeholder="name@company.in"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
                  placeholder="+91 98401 23456"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditRole('shipper')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    editRole === 'shipper' 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'bg-[#FAF9F6] border-[#DEDDD8] text-[#666666]'
                  }`}
                >
                  Shipper
                </button>
                <button
                  type="button"
                  onClick={() => setEditRole('fleet_operator')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    editRole === 'fleet_operator' 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'bg-[#FAF9F6] border-[#DEDDD8] text-[#666666]'
                  }`}
                >
                  Fleet Owner
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-[#666666] hover:text-[#111111] font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white font-extrabold shadow-md transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

