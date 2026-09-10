import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { UserRole } from '../../types';
import { AuthService } from '../../services/authService';
import { 
  Truck as TruckIcon, 
  Package, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentRole, 
    setRole, 
    showToast,
    refreshUserProfile 
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      showToast('Please enter your email or phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await AuthService.login(emailOrPhone, selectedRole);
      setRole(selectedRole);
      refreshUserProfile();
      showToast(`Welcome to CollabFleet as ${selectedRole === 'shipper' ? 'Shipper' : 'Fleet Operator'}!`, 'success');
      setIsAuthModalOpen(false);
    } catch (err) {
      showToast('Login failed. Please verify your credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="max-w-md"
    >
      <div className="space-y-5 py-1">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-cyan to-blue-600 flex items-center justify-center text-dark-950 font-black mx-auto shadow-glass-glow">
            <TruckIcon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight pt-2">
            How will you use CollabFleet?
          </h2>
          <p className="text-xs text-slate-400">
            Select your account type to access tailored freight intelligence
          </p>
        </div>

        {/* Two Large Role Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Shipper */}
          <div
            onClick={() => setSelectedRole('shipper')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
              selectedRole === 'shipper'
                ? 'bg-brand-cyan/15 border-brand-cyan shadow-glass-glow ring-1 ring-brand-cyan/50'
                : 'bg-dark-900/80 border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              selectedRole === 'shipper' ? 'bg-brand-cyan text-dark-950 font-bold' : 'bg-dark-800 text-slate-300'
            }`}>
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">I need a truck</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Shipper & Business</div>
            </div>
          </div>

          {/* Fleet Operator */}
          <div
            onClick={() => setSelectedRole('fleet_operator')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
              selectedRole === 'fleet_operator'
                ? 'bg-brand-cyan/15 border-brand-cyan shadow-glass-glow ring-1 ring-brand-cyan/50'
                : 'bg-dark-900/80 border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              selectedRole === 'fleet_operator' ? 'bg-brand-cyan text-dark-950 font-bold' : 'bg-dark-800 text-slate-300'
            }`}>
              <TruckIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">I have trucks</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Fleet Operator & Owner</div>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Email or Mobile Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="name@company.com or +91 98401..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-cyan via-sky-500 to-blue-600 text-dark-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1 text-xs text-slate-400">
          Ready for FastAPI backend integration via <code className="text-brand-cyan text-[10px] font-mono">/api/v1/auth</code>
        </div>

      </div>
    </Modal>
  );
};
