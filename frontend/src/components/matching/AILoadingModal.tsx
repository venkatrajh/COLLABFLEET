import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Cpu, Route, ShieldCheck, ArrowLeftRight } from 'lucide-react';

export const AILoadingModal: React.FC = () => {
  const { isAiLoading, aiLoadingMessage } = useApp();

  if (!isAiLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm glass-modal rounded-3xl p-6 text-center border border-brand-cyan/30 shadow-2xl space-y-5 animate-scaleUp">
        
        {/* Animated AI Core Icon with double pulsing ring */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-cyan/20 animate-ping" />
          <div className="absolute -inset-2 rounded-full border border-brand-cyan/30 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-cyan via-blue-500 to-sky-600 flex items-center justify-center text-dark-950 shadow-glass-glow z-10">
            <Cpu className="w-8 h-8 stroke-[2.2]" />
          </div>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            <span>Finding the Best Trucks</span>
          </h3>
          <p className="text-xs text-brand-cyan font-bold tracking-wide mt-2 animate-pulse min-h-[20px]">
            {aiLoadingMessage}
          </p>
        </div>

        {/* Micro-indicators of matching calculations */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-lg bg-dark-900/80 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan text-xs">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] text-slate-400">Capacity</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-lg bg-dark-900/80 border border-brand-cyan/30 flex items-center justify-center text-blue-400 text-xs">
              <Route className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] text-slate-400">Corridor</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-lg bg-dark-900/80 border border-brand-cyan/30 flex items-center justify-center text-emerald-400 text-xs">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] text-slate-400">Backhaul</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-lg bg-dark-900/80 border border-brand-cyan/30 flex items-center justify-center text-amber-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] text-slate-400">Driver</span>
          </div>
        </div>

      </div>
    </div>
  );
};
