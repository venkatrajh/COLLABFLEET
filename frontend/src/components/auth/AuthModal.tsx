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
  ArrowRight 
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
      showToast('Please enter email or phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await AuthService.login(emailOrPhone, selectedRole);
      setRole(selectedRole);
      refreshUserProfile();
      showToast(`Signed in as ${selectedRole === 'shipper' ? 'Shipper' : 'Fleet Owner'}`, 'success');
      setIsAuthModalOpen(false);
    } catch (err) {
      showToast('Login failed. Please verify credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="max-w-sm"
    >
      <div className="space-y-4 py-1 text-xs">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black mx-auto shadow">
            <TruckIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight pt-1">
            How will you use COLLABFLEET?
          </h2>
          <p className="text-[11px] text-neutral-500">
            Select your account type
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div
            onClick={() => setSelectedRole('shipper')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
              selectedRole === 'shipper'
                ? 'bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white shadow-sm ring-1 ring-black dark:ring-white'
                : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <Package className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
            <div>
              <div className="text-xs font-extrabold text-neutral-900 dark:text-white">I need a truck</div>
              <div className="text-[10px] text-neutral-500">Shipper</div>
            </div>
          </div>

          <div
            onClick={() => setSelectedRole('fleet_operator')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
              selectedRole === 'fleet_operator'
                ? 'bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white shadow-sm ring-1 ring-black dark:ring-white'
                : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <TruckIcon className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
            <div>
              <div className="text-xs font-extrabold text-neutral-900 dark:text-white">I have trucks</div>
              <div className="text-[10px] text-neutral-500">Fleet Owner</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="name@company.com or +91..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow hover:opacity-90 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </Modal>
  );
};
