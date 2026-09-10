import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Truck, 
  Package, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Mail,
  Lock
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { currentRole, setRole, loginUser, setActiveView, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'shipper');
  const [emailOrPhone, setEmailOrPhone] = useState('demo.shipper@collabfleet.in');
  const [password, setPassword] = useState('••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setRole(role);
    if (role === 'fleet_operator' && emailOrPhone.includes('shipper')) {
      setEmailOrPhone('driver.kumar@tnlogistics.in');
    } else if (role === 'shipper' && emailOrPhone.includes('driver')) {
      setEmailOrPhone('demo.shipper@collabfleet.in');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      showToast('Please enter an email or phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginUser(emailOrPhone, selectedRole);
    } catch (err) {
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col justify-between selection:bg-white selection:text-black">
      
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-900 max-w-7xl mx-auto w-full">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>
      </header>

      {/* Main 2-Column Auth Layout (Left-Aligned Desktop) */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand & Product Messaging (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
              <Truck className="w-3.5 h-3.5" />
              <span>COLLABFLEET AI SECURE ACCESS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-neutral-900 dark:text-white">
              Freight moves better together.
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed">
              AI-powered matching for smarter trips, guaranteed freight verification, and seamless empty-capacity reduction.
            </p>

            {/* Value bullets */}
            <div className="space-y-3 pt-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0" />
                <span>Zero commission overhead on backhaul matches</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0" />
                <span>Direct contact with verified truck drivers across India</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0" />
                <span>Live GPS & simulated telemetry on OpenStreetMap</span>
              </div>
            </div>

            {/* Quick Demo Switch Hint */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
              Demo credentials pre-filled. Select role and click <strong>Sign In</strong> to enter the map-first interface.
            </div>

          </div>

          {/* Right Column: Role Selection + Login Form (Cols 8-12) */}
          <div className="lg:col-span-5 text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6">
              
              <div>
                <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                  Welcome back
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Choose your account type to proceed
                </p>
              </div>

              {/* Role Toggle Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Continue as
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('shipper')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                      selectedRole === 'shipper'
                        ? 'bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white shadow-sm ring-1 ring-black dark:ring-white'
                        : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <Package className="w-4 h-4 text-neutral-900 dark:text-white" />
                    <div>
                      <div className="text-xs font-black text-neutral-900 dark:text-white">I need a truck</div>
                      <div className="text-[10px] text-neutral-500">Shipper</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('fleet_operator')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                      selectedRole === 'fleet_operator'
                        ? 'bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white shadow-sm ring-1 ring-black dark:ring-white'
                        : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-neutral-900 dark:text-white" />
                    <div>
                      <div className="text-xs font-black text-neutral-900 dark:text-white">I have trucks</div>
                      <div className="text-[10px] text-neutral-500">Fleet Owner</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="name@company.in or +91..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold pl-9"
                      required
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Password
                    </label>
                    <span className="text-[10px] text-neutral-500 hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold pl-9"
                      required
                    />
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-lg hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Authenticating...' : `Enter as ${selectedRole === 'shipper' ? 'Shipper' : 'Fleet Owner'}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>

              <div className="pt-2 text-center text-[11px] text-neutral-500">
                <span>Don't have an account? </span>
                <span 
                  onClick={() => showToast('Demo accounts ready. Click Sign In above.', 'info')} 
                  className="font-bold text-neutral-900 dark:text-white cursor-pointer hover:underline"
                >
                  Create free account
                </span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-neutral-200 dark:border-neutral-900 text-[11px] text-neutral-500 text-center">
        COLLABFLEET AI · Protected Authentication · OpenStreetMap Intelligence
      </footer>

    </div>
  );
};
