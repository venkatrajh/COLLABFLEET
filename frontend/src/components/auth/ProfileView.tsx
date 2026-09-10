import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Mail, 
  Phone, 
  Star, 
  MapPin, 
  LogOut, 
  Leaf
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    userProfile, 
    currentRole, 
    setRole, 
    setIsAuthModalOpen, 
    showToast,
    setActiveView 
  } = useApp();

  const handleLogout = () => {
    showToast('Switched to demo session', 'info');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-20 pointer-events-auto">
      
      {/* Profile Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-xl shadow">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-neutral-900 dark:text-white">{userProfile.name}</h1>
              <span className="flex items-center text-xs font-bold text-amber-500">
                ★ {userProfile.rating}
              </span>
            </div>
            <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{userProfile.company}</span>
            </div>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setRole('shipper')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentRole === 'shipper'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Shipper
          </button>
          <button
            onClick={() => setRole('fleet_operator')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentRole === 'fleet_operator'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Fleet Owner
          </button>
        </div>
      </div>

      {/* Details & Saved Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="glass-card p-4 rounded-2xl border space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Contact
          </h3>
          <div className="space-y-1.5 text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-mono">{userProfile.phone}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Saved Hubs
          </h3>
          <div className="space-y-1">
            {userProfile.savedLocations.slice(0, 3).map((hub) => (
              <div key={hub.id} className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  <span>{hub.name}</span>
                </div>
                <span className="text-[10px] text-neutral-400">{hub.city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Card */}
      <div className="glass-card p-4 rounded-2xl border space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" />
            <span>Lifetime Collaborative Impact</span>
          </h3>
          <button
            onClick={() => setActiveView('smart_insights')}
            className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:underline"
          >
            Insights →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
            <div className="text-sm font-black text-neutral-900 dark:text-white">
              {userProfile.stats.emptyKmSaved.toLocaleString('en-IN')} km
            </div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Empty avoided</div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
            <div className="text-sm font-black text-neutral-900 dark:text-white">
              ₹{userProfile.stats.moneySaved.toLocaleString('en-IN')}
            </div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Money saved</div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
            <div className="text-sm font-black text-neutral-900 dark:text-white">
              {userProfile.stats.co2ReductionKg} kg
            </div>
            <div className="text-[9px] text-neutral-400 mt-0.5">CO₂ cut</div>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-1 flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>

    </div>
  );
};
