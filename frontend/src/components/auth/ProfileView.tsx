import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Star, 
  MapPin, 
  ShieldCheck, 
  LogOut, 
  RotateCw,
  Sparkles,
  TrendingDown,
  IndianRupee,
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
    showToast('Logged out of session. Switched to demo mode.', 'info');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-20 pointer-events-auto">
      
      {/* Profile Header Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-cyan via-blue-500 to-sky-600 flex items-center justify-center text-dark-950 font-black text-2xl shadow-glass-glow">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{userProfile.name}</h1>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Star className="w-3 h-3 fill-amber-400" />
                {userProfile.rating}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-brand-cyan" />
              <span>{userProfile.company}</span>
            </div>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400">Account Type</span>
          <div className="flex items-center bg-dark-900/90 p-1 rounded-xl border border-white/10 w-full sm:w-auto justify-center">
            <button
              onClick={() => setRole('shipper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'shipper'
                  ? 'bg-brand-cyan text-dark-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Shipper
            </button>
            <button
              onClick={() => setRole('fleet_operator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'fleet_operator'
                  ? 'bg-brand-cyan text-dark-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fleet Operator
            </button>
          </div>
        </div>
      </div>

      {/* Account Details & Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Contact Information
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-brand-cyan" />
              <span>{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-brand-cyan" />
              <span className="font-mono">{userProfile.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Verified Logistics Partner</span>
            </div>
          </div>
        </div>

        {/* Saved Hubs */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Saved Transport Hubs
          </h3>
          <div className="space-y-1.5">
            {userProfile.savedLocations.map((hub) => (
              <div key={hub.id} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{hub.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">{hub.city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ESG Impact Snapshot */}
      <div className="glass-card p-5 rounded-2xl border border-emerald-500/25 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Leaf className="w-4 h-4" />
            <span>Lifetime Collaborative Impact</span>
          </h3>
          <button
            onClick={() => setActiveView('smart_insights')}
            className="text-xs font-bold text-brand-cyan hover:underline"
          >
            View Smart Insights
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center pt-2">
          <div className="bg-dark-900/60 p-3 rounded-xl border border-white/5">
            <div className="text-base sm:text-lg font-black text-white">
              {userProfile.stats.emptyKmSaved.toLocaleString('en-IN')} km
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Empty travel avoided</div>
          </div>

          <div className="bg-dark-900/60 p-3 rounded-xl border border-white/5">
            <div className="text-base sm:text-lg font-black text-emerald-400">
              ₹{userProfile.stats.moneySaved.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Total money saved</div>
          </div>

          <div className="bg-dark-900/60 p-3 rounded-xl border border-white/5">
            <div className="text-base sm:text-lg font-black text-teal-300">
              {userProfile.stats.co2ReductionKg} kg
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">CO₂ emissions cut</div>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-xl bg-dark-900 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>

    </div>
  );
};
