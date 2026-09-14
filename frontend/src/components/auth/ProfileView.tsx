import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  Leaf, 
  Bell, 
  Shield, 
  Navigation, 
  Edit3, 
  Crosshair, 
  ArrowRight,
  User,
  Sliders
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile,
    updateUserSettings,
    updateNotificationPreferences,
    currentRole, 
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

  // Selected Hub state
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
      role: userProfile.role
    });

    setIsEditModalOpen(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleOpenEditModal = () => {
    setEditName(userProfile.name);
    setEditCompany(userProfile.company);
    setEditEmail(userProfile.email);
    setEditPhone(userProfile.phone);
    setIsEditModalOpen(true);
  };

  // Safe Settings Getters
  const settings = userProfile.settings || {
    notifications: {
      shipmentUpdates: true,
      newTruckMatches: true,
      bookingUpdates: true,
      deliveryUpdates: true,
      returnTripOpportunities: true,
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

  const handleToggleNotification = (key: keyof typeof settings.notifications) => {
    updateNotificationPreferences({
      [key]: !settings.notifications[key]
    });
  };

  const handleTogglePrivacy = (key: keyof typeof settings.privacy) => {
    const updated = {
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key]
      }
    };
    updateUserSettings(updated);
  };

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
    <div className="w-full max-w-2xl mx-auto pb-20 pointer-events-auto">
      
      {/* Unified Floating Island */}
      <div className="bg-white/95 backdrop-blur-md border border-[#DEDDD8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-130px)]">
        
        {/* Island Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EBEAE5] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">
                  {userProfile.name}
                </h1>
                <span className="flex items-center text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                  ★ {userProfile.rating}
                </span>
              </div>
              <div className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>{userProfile.company}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenEditModal}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Section 1: Connected Impact Strip */}
        <div className="bg-[#FAF9F6] border-b border-[#EBEAE5] px-5 sm:px-6 py-3 grid grid-cols-3 divide-x divide-[#E5E4DE] text-center shrink-0">
          <div className="px-2">
            <div className="text-base sm:text-lg font-black text-[#111111]">
              {userProfile.stats.emptyKmSaved.toLocaleString('en-IN')} <span className="text-xs font-bold text-neutral-500">km</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-semibold mt-0.5">Empty miles saved</div>
          </div>

          <div className="px-2">
            <div className="text-base sm:text-lg font-black text-[#111111]">
              ₹{userProfile.stats.moneySaved.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-neutral-500 font-semibold mt-0.5">Freight savings</div>
          </div>

          <div className="px-2">
            <div className="text-base sm:text-lg font-black text-[#111111]">
              {userProfile.stats.co2ReductionKg} <span className="text-xs font-bold text-neutral-500">kg</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-semibold mt-0.5">CO₂ prevented</div>
          </div>
        </div>

        {/* Scrollable Connected Body */}
        <div className="overflow-y-auto divide-y divide-[#EBEAE5] bg-white scrollbar-thin flex-1">
          
          {/* Section 2: Contact Details & Saved Hubs */}
          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#EBEAE5] text-xs gap-y-4 sm:gap-y-0">
            {/* Contact Details */}
            <div className="sm:pr-5 space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Contact Details
              </h3>
              <div className="space-y-2 text-neutral-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="font-semibold text-[#111111]">{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="font-mono font-bold text-[#111111]">{userProfile.phone}</span>
                </div>
              </div>
            </div>

            {/* Saved Hubs */}
            <div className="pt-4 sm:pt-0 sm:pl-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Saved Freight Hubs
                </h3>
                <span className="text-[10px] text-neutral-400">click to center</span>
              </div>
              <div className="space-y-1.5">
                {userProfile.savedLocations.slice(0, 3).map((hub) => {
                  const isSelected = selectedHubId === hub.id;
                  return (
                    <div 
                      key={hub.id} 
                      onClick={() => handleSelectHub(hub)}
                      className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#111111] text-white shadow-sm' 
                          : 'bg-[#FAF9F6] hover:bg-[#F0EFEA] border border-[#EBEAE5]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-[#111111]'}`}>
                            {hub.name}
                          </div>
                          {isSelected && (
                            <div className="text-[10px] text-neutral-300">Centered on map</div>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {hub.city}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Active Operating Role */}
          <div className="p-5 sm:p-6 space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Operating Role
            </h3>
            <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#111111]">Active Operating Mode</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Currently operating as {currentRole === 'shipper' ? 'Shipper (Cargo Owner)' : 'Fleet Operator (Truck Owner)'}
                </div>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-[#111111] text-white text-xs font-bold shadow-xs">
                {currentRole === 'shipper' ? 'Shipper' : 'Fleet Owner'}
              </div>
            </div>
          </div>

          {/* Section 4: Notification Preferences */}
          <div className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Bell className="w-3 h-3 text-neutral-400" />
                <span>Notification Preferences</span>
              </h3>
              <button
                onClick={() => setActiveView('notifications')}
                className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1"
              >
                <span>Notification Center</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="rounded-2xl border border-[#EBEAE5] divide-y divide-[#EBEAE5] overflow-hidden text-xs">
              <div className="p-3.5 flex items-center justify-between bg-white hover:bg-[#FAF9F6] transition-colors">
                <div>
                  <div className="font-bold text-[#111111]">Shipment & Transit Updates</div>
                  <div className="text-[11px] text-neutral-500">Real-time status changes and arrival alerts</div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.notifications.shipmentUpdates}
                  onChange={() => handleToggleNotification('shipmentUpdates')}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between bg-white hover:bg-[#FAF9F6] transition-colors">
                <div>
                  <div className="font-bold text-[#111111]">Capacity Match Opportunities</div>
                  <div className="text-[11px] text-neutral-500">Alerts when collaborative capacity matches your corridor</div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.notifications.newTruckMatches}
                  onChange={() => handleToggleNotification('newTruckMatches')}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between bg-white hover:bg-[#FAF9F6] transition-colors">
                <div>
                  <div className="font-bold text-[#111111]">Booking & Driver Assignments</div>
                  <div className="text-[11px] text-neutral-500">Dispatch confirmations and printable receipts</div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.notifications.bookingUpdates}
                  onChange={() => handleToggleNotification('bookingUpdates')}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between bg-white hover:bg-[#FAF9F6] transition-colors">
                <div>
                  <div className="font-bold text-[#111111]">Return-Trip & Backhaul Alerts</div>
                  <div className="text-[11px] text-neutral-500">Backhaul discounts and deadhead reduction opportunities</div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.notifications.returnTripOpportunities}
                  onChange={() => handleToggleNotification('returnTripOpportunities')}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Privacy Settings */}
          <div className="p-5 sm:p-6 space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-neutral-400" />
              <span>Privacy & Visibility</span>
            </h3>

            <div className="rounded-2xl border border-[#EBEAE5] divide-y divide-[#EBEAE5] overflow-hidden text-xs">
              <div className="p-3.5 flex items-center justify-between bg-white hover:bg-[#FAF9F6] transition-colors">
                <div>
                  <div className="font-bold text-[#111111]">Public Rating Visibility</div>
                  <div className="text-[11px] text-neutral-500">Allow verified drivers and shippers to see your platform rating</div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.privacy.profileVisibility}
                  onChange={() => handleTogglePrivacy('profileVisibility')}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between bg-white hover:bg-[#FAF9F6] transition-colors">
                <div>
                  <div className="font-bold text-[#111111]">Enterprise Name on Postings</div>
                  <div className="text-[11px] text-neutral-500">Display company organization on corridor load postings</div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.privacy.showCompanyInfo}
                  onChange={() => handleTogglePrivacy('showCompanyInfo')}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Location Services & GPS Status */}
          <div className="p-5 sm:p-6 space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-neutral-400" />
              <span>Location Services & GPS Telemetry</span>
            </h3>

            <div className="rounded-2xl border border-[#EBEAE5] p-4 bg-[#FAF9F6] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#111111]">Location Services</div>
                  <div className="text-[11px] text-neutral-500">Use device coordinates for initial map positioning</div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.location.locationServicesEnabled}
                  onChange={handleToggleLocationServices}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-[#EBEAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-neutral-600 flex items-center gap-2">
                    <span>Permission:</span>
                    <span className={`inline-flex items-center gap-1 font-bold ${
                      locationPermissionState === 'granted' 
                        ? 'text-emerald-700' 
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
                      Location access is off. Enable to center the map around you.
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

          {/* Section 7: Sign Out Footer Row */}
          <div className="p-5 sm:px-6 py-4 bg-[#FAF9F6] flex items-center justify-between">
            <div className="text-xs text-neutral-500">
              COLLABFLEET Verified Account
            </div>
            <button
              onClick={logoutUser}
              className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 border border-[#DEDDD8] hover:border-red-200 text-neutral-600 text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          maxWidth="max-w-md"
          title="Edit User Profile"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-medium"
                placeholder="e.g. Nakul Venkatesh"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-medium"
                placeholder="e.g. Apex Freight Logistics"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-medium"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] focus:border-black focus:bg-white text-xs font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Account Role (Fixed for Session)
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] text-xs font-bold text-neutral-800 flex items-center justify-between">
                <span>{userProfile.role === 'shipper' ? 'Shipper (Cargo Owner)' : 'Fleet Operator (Truck Owner)'}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-600">Locked</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EBEAE5]">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#DEDDD8] text-xs font-bold hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-black shadow-sm"
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
