import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Truck, 
  Package, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Mail,
  Lock,
  User,
  Sparkles,
  Loader2
} from 'lucide-react';

type AuthTab = 'signin' | 'signup' | 'role_select';

export const LoginPage: React.FC = () => {
  const { 
    currentRole, 
    setRole, 
    loginUser, 
    signUpUser, 
    signInWithGoogle, 
    setActiveView, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'shipper');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('demo@collabfleet.ai');
  const [signInPassword, setSignInPassword] = useState('password123');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // Inline Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Validate Sign In
  const validateSignIn = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!signInEmail.trim()) {
      newErrors.signInEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signInEmail)) {
      newErrors.signInEmail = 'Enter a valid email address';
    }
    if (!signInPassword) {
      newErrors.signInPassword = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Sign Up
  const validateSignUp = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!signUpName.trim()) {
      newErrors.signUpName = 'Full name is required';
    }
    if (!signUpEmail.trim()) {
      newErrors.signUpEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
      newErrors.signUpEmail = 'Enter a valid email address';
    }
    if (!signUpPassword) {
      newErrors.signUpPassword = 'Password is required';
    } else if (signUpPassword.length < 6) {
      newErrors.signUpPassword = 'Password must be at least 6 characters';
    }
    if (signUpPassword !== signUpConfirmPassword) {
      newErrors.signUpConfirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Sign In Submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    setIsSubmitting(true);
    try {
      await loginUser(signInEmail, selectedRole);
    } catch {
      showToast('Sign in failed. Please check credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setIsSubmitting(true);
    try {
      await signUpUser(signUpName, signUpEmail, signUpPassword);
      setActiveTab('role_select');
    } catch {
      showToast('Account creation failed. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Demo Sign In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const isNew = await signInWithGoogle();
      if (isNew) {
        setActiveTab('role_select');
      } else {
        if (currentRole === 'fleet_operator') {
          setActiveView('find_freight');
        } else {
          setActiveView('home');
        }
      }
    } catch {
      showToast('Google sign-in encounterd an issue.', 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Complete Role Selection & Enter Application
  const handleCompleteRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setRole(role);
    if (role === 'fleet_operator') {
      setActiveView('find_freight');
    } else {
      setActiveView('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-neutral-900 flex flex-col justify-between selection:bg-neutral-900 selection:text-white font-sans antialiased">
      
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-200/80 max-w-7xl mx-auto w-full">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        {/* Small Unobtrusive Demo Label */}
        <div className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-600 shadow-xs">
          DEMO MODE · Frontend Prototype
        </div>
      </header>

      {/* Main 2-Column Auth Layout */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Brand & Product Messaging (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[11px] font-bold text-neutral-800 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
              <span>COLLABFLEET SECURE ACCESS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-neutral-950">
              Freight moves better together.
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed">
              AI-powered matching for smarter trips, guaranteed freight verification, and seamless empty-capacity reduction across India.
            </p>

            {/* Value bullets */}
            <div className="space-y-3 pt-2 text-xs text-neutral-700">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero commission overhead on backhaul matches</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct contact with verified truck drivers across India</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live GPS & simulated telemetry on OpenStreetMap</span>
              </div>
            </div>

            {/* Demo Mode Hint */}
            <div className="pt-4 border-t border-neutral-200 text-[11px] text-neutral-500">
              Demo accounts pre-filled. Enter any email or use Google Demo to immediately test the platform.
            </div>

          </div>

          {/* Right Column: Role Selection + Auth Form (Cols 8-12) */}
          <div className="lg:col-span-5 text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-5">
              
              {/* If in Role Selection Step (after Sign Up or first Google login) */}
              {activeTab === 'role_select' ? (
                <div className="space-y-5 animate-text-transition">
                  <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold mx-auto mb-2 shadow-sm">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black text-neutral-950 tracking-tight">
                      How will you use COLLABFLEET?
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Select your primary role to launch the tailored map experience
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleCompleteRoleSelection('shipper')}
                      className="w-full p-4 rounded-2xl border border-neutral-200 hover:border-neutral-950 bg-neutral-50 hover:bg-white shadow-xs transition-all flex items-center gap-3 text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-black text-neutral-950 group-hover:text-neutral-950 transition-colors">
                          I need a truck
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Ship my freight with verified available capacity
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteRoleSelection('fleet_operator')}
                      className="w-full p-4 rounded-2xl border border-neutral-200 hover:border-neutral-950 bg-neutral-50 hover:bg-white shadow-xs transition-all flex items-center gap-3 text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-black text-neutral-950 group-hover:text-neutral-950 transition-colors">
                          I have trucks
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Find return-trip loads & maximize vehicle earnings
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Tabs: Sign In vs Create Account */}
                  <div className="flex items-center p-1 bg-neutral-100 rounded-2xl border border-neutral-200/80">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('signin'); setErrors({}); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'signin'
                          ? 'bg-white text-neutral-950 shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-950'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('signup'); setErrors({}); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'signup'
                          ? 'bg-white text-neutral-950 shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-950'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* SIGN IN FORM */}
                  {activeTab === 'signin' && (
                    <form onSubmit={handleSignInSubmit} className="space-y-3.5 animate-text-transition">
                      
                      {/* Email Field */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={signInEmail}
                            onChange={(e) => {
                              setSignInEmail(e.target.value);
                              if (errors.signInEmail) setErrors(prev => ({ ...prev, signInEmail: '' }));
                            }}
                            placeholder="demo@collabfleet.ai"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none text-xs font-semibold pl-9 transition-all ${
                              errors.signInEmail ? 'border-red-500 ring-1 ring-red-500' : ''
                            }`}
                          />
                          <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                        </div>
                        {errors.signInEmail && (
                          <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.signInEmail}</p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Password
                          </label>
                          <span className="text-[10px] text-neutral-500 hover:text-neutral-950 hover:underline cursor-pointer transition-colors">
                            Forgot?
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="password"
                            value={signInPassword}
                            onChange={(e) => {
                              setSignInPassword(e.target.value);
                              if (errors.signInPassword) setErrors(prev => ({ ...prev, signInPassword: '' }));
                            }}
                            placeholder="••••••••"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none text-xs font-semibold pl-9 transition-all ${
                              errors.signInPassword ? 'border-red-500 ring-1 ring-red-500' : ''
                            }`}
                          />
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                        </div>
                        {errors.signInPassword && (
                          <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.signInPassword}</p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-extrabold text-xs shadow-xs hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Divider */}
                      <div className="relative flex items-center justify-center py-2">
                        <div className="w-full border-t border-neutral-200" />
                        <span className="bg-white px-3 text-[10px] font-bold uppercase text-neutral-400 absolute">
                          OR
                        </span>
                      </div>

                      {/* Google Demo Login */}
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200/90 text-neutral-800 shadow-xs font-bold text-xs transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                      >
                        {isGoogleLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Connecting to Google...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/>
                              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/>
                              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14.7s.6 5.5 1.6 7.5l3.7-2.9z"/>
                              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16.4C3.5 20.2 7.4 23.5 12 23.5z"/>
                            </svg>
                            <span>Continue with Google</span>
                          </>
                        )}
                      </button>

                      <div className="pt-2 text-center text-[11px] text-neutral-500">
                        <span>Don't have an account? </span>
                        <span 
                          onClick={() => { setActiveTab('signup'); setErrors({}); }}
                          className="font-bold text-neutral-950 cursor-pointer hover:underline"
                        >
                          Create account
                        </span>
                      </div>
                    </form>
                  )}

                  {/* SIGN UP FORM */}
                  {activeTab === 'signup' && (
                    <form onSubmit={handleSignUpSubmit} className="space-y-3.5 animate-text-transition">
                      
                      {/* Full Name */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={signUpName}
                            onChange={(e) => {
                              setSignUpName(e.target.value);
                              if (errors.signUpName) setErrors(prev => ({ ...prev, signUpName: '' }));
                            }}
                            placeholder="Nakul Venkatesh"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none text-xs font-semibold pl-9 transition-all ${
                              errors.signUpName ? 'border-red-500 ring-1 ring-red-500' : ''
                            }`}
                          />
                          <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                        </div>
                        {errors.signUpName && (
                          <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.signUpName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={signUpEmail}
                            onChange={(e) => {
                              setSignUpEmail(e.target.value);
                              if (errors.signUpEmail) setErrors(prev => ({ ...prev, signUpEmail: '' }));
                            }}
                            placeholder="name@company.com"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none text-xs font-semibold pl-9 transition-all ${
                              errors.signUpEmail ? 'border-red-500 ring-1 ring-red-500' : ''
                            }`}
                          />
                          <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                        </div>
                        {errors.signUpEmail && (
                          <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.signUpEmail}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={signUpPassword}
                            onChange={(e) => {
                              setSignUpPassword(e.target.value);
                              if (errors.signUpPassword) setErrors(prev => ({ ...prev, signUpPassword: '' }));
                            }}
                            placeholder="At least 6 characters"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none text-xs font-semibold pl-9 transition-all ${
                              errors.signUpPassword ? 'border-red-500 ring-1 ring-red-500' : ''
                            }`}
                          />
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                        </div>
                        {errors.signUpPassword && (
                          <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.signUpPassword}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={signUpConfirmPassword}
                            onChange={(e) => {
                              setSignUpConfirmPassword(e.target.value);
                              if (errors.signUpConfirmPassword) setErrors(prev => ({ ...prev, signUpConfirmPassword: '' }));
                            }}
                            placeholder="Re-enter password"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none text-xs font-semibold pl-9 transition-all ${
                              errors.signUpConfirmPassword ? 'border-red-500 ring-1 ring-red-500' : ''
                            }`}
                          />
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                        </div>
                        {errors.signUpConfirmPassword && (
                          <p className="text-[10px] text-red-600 mt-1 font-medium">{errors.signUpConfirmPassword}</p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-extrabold text-xs shadow-xs hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="pt-2 text-center text-[11px] text-neutral-500">
                        <span>Already have an account? </span>
                        <span 
                          onClick={() => { setActiveTab('signin'); setErrors({}); }}
                          className="font-bold text-neutral-950 cursor-pointer hover:underline"
                        >
                          Sign in
                        </span>
                      </div>
                    </form>
                  )}
                </>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-neutral-200/80 text-[11px] text-neutral-500 text-center">
        COLLABFLEET · Protected Demo Authentication · OpenStreetMap Intelligence
      </footer>

    </div>
  );
};

