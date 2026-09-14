import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { USER_APP_URL } from '../../services/adminApiConfig';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { signInWithEmail, signInWithGoogle } = useAdmin();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle logistics network canvas animation on the left side
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resize);

    // Nodes representing logistics network hubs
    const nodes = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 2,
      pulse: Math.random() * Math.PI
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.22;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and move nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.03;

        if (node.x < 10 || node.x > width - 10) node.vx *= -1;
        if (node.y < 10 || node.y > height - 10) node.vy *= -1;

        const currentRadius = node.radius + Math.sin(node.pulse) * 0.8;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1.5, currentRadius), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter an admin email.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail({
        email,
        password,
        rememberMe
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication encountered an error.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleReturnToPublic = () => {
    window.location.href = USER_APP_URL;
  };

  return (
    <div className="min-h-screen w-screen bg-[#F8F8F6] text-[#111111] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white border border-[#E5E4DE] rounded-[28px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* LEFT COLUMN: Black Operational Branding Canvas */}
        <div className="lg:col-span-5 bg-[#0D0D0D] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
          />

          {/* Top Brand */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm shadow-md">
                CF
              </div>
              <span className="text-base font-black tracking-wider text-white">
                COLLABFLEET
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-mono font-bold tracking-widest uppercase border border-white/10">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Operations Control</span>
            </div>
          </div>

          {/* Central Operational Statement */}
          <div className="relative z-10 my-10 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
              Manage the network with precision.
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              National freight capacity coordination, live carrier telemetry, corridor optimization, and settlement records.
            </p>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>Verified Admin Portal</span>
            <span className="text-emerald-400 font-bold">Port 5174</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Login Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
          
          {/* Top Exit link */}
          <div className="flex items-center justify-between pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono">
                ADMIN CONSOLE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight mt-0.5">
                Welcome back
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Sign in with authorized credentials to access network controls
              </p>
            </div>

            <button
              onClick={handleReturnToPublic}
              className="text-xs text-neutral-500 hover:text-black font-semibold flex items-center gap-1 transition-colors"
              title="Open User Platform (localhost:5173)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">User App (5173)</span>
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold animate-in fade-in duration-200">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@collabfleet.in"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] text-[#111111] text-xs font-semibold focus:border-black focus:bg-white focus:outline-none transition-all"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FAF9F6] border border-[#DEDDD8] text-[#111111] text-xs font-semibold focus:border-black focus:bg-white focus:outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
                <span>Remember session</span>
              </label>

              <span className="text-[11px] text-neutral-400">Demo PIN: Any (optional)</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#111111] hover:bg-black text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EBEAE5]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-neutral-400 font-mono">
              <span className="bg-white px-3">or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSubmit}
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#DEDDD8] hover:border-[#111111] text-neutral-800 font-bold text-xs shadow-sm transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 active:scale-[0.99]"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-neutral-700" />
                <span>Connecting Google Auth...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="pt-4 text-center text-[11px] text-neutral-400 font-mono">
            COLLABFLEET Network Operations Command · SSL Protected
          </div>

        </div>

      </div>
    </div>
  );
};
