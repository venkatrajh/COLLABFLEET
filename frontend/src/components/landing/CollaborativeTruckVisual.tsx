import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Play, Pause, Navigation, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * CollaborativeTruckVisual
 * Transferred & adapted directly from the reference project C:\Studies\COLLABFLEET-AI (HeroTruckAnimation.jsx)
 *
 * Implements:
 * 1. Two-Truck / Two-Cargo collaborative concept (Primary carrier + Collaborative feeder)
 * 2. Highway motion blur streaks and spinning wheel spokes
 * 3. 50% Existing Load + 30% Shared Load + 20% Shared Load = 100% Utilized
 * 4. Cutaway cargo bay with dynamic load allocation
 * 5. Animated hydraulic shutter and live telemetry HUD
 */
export const CollaborativeTruckVisual: React.FC = () => {
  // Stages:
  // 0: 50% Base Load (50% Unused Capacity)
  // 1: Feeder truck aligns, 30% Shared Load docks in (80% Capacity)
  // 2: 20% Shared Load docks in, Shutter locks (100% Fully Utilized)
  const [stage, setStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [shutterOpen, setShutterOpen] = useState<boolean>(true);

  // Auto-cycle through the 3 collaborative states
  useEffect(() => {
    if (!isPlaying) return;
    const timeouts = [3500, 3500, 4200];
    const timer = setTimeout(() => {
      setStage((prev) => (prev + 1) % 3);
    }, timeouts[stage]);

    return () => clearTimeout(timer);
  }, [stage, isPlaying]);

  const capacityPct = stage === 0 ? 50 : stage === 1 ? 80 : 100;

  return (
    <div className="relative w-full rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-[0_16px_50px_rgba(0,0,0,0.06)] overflow-hidden select-none">
      
      {/* Background Highway Motion Blur Streaks (from reference project) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <motion.div
          className="absolute top-1/4 -left-20 w-80 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          animate={{ x: ['130%', '-40%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 -left-32 w-96 h-0.5 bg-gradient-to-r from-transparent via-neutral-400 to-transparent opacity-60"
          animate={{ x: ['140%', '-50%'] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear', delay: 0.3 }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-28 w-72 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"
          animate={{ x: ['120%', '-30%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.6 }}
        />
      </div>

      {/* Top Telemetry HUD Strip */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-neutral-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-[11px] font-mono flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>NH-48 CORRIDOR: CHENNAI → BENGALURU</span>
            <span className="text-neutral-500">|</span>
            <span className="font-bold text-neutral-300">72 KM/H</span>
          </div>

          <button
            onClick={() => setShutterOpen(!shutterOpen)}
            className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 text-[11px] font-bold transition border border-neutral-200"
          >
            {shutterOpen ? 'Inspect Bay Shutter' : 'Open Cargo Bay'}
          </button>
        </div>

        {/* Live Capacity Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 font-mono">Payload:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all duration-300 ${
              stage === 2
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                : stage === 1
                ? 'bg-blue-50 text-blue-700 border border-blue-300'
                : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
            }`}
          >
            {capacityPct}% {stage === 2 ? 'FULLY UTILIZED' : 'LOADED'}
          </span>
        </div>
      </div>

      {/* Real-Time Capacity Allocation Progress Bar */}
      <div className="relative z-20 mt-3.5">
        <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden flex border border-neutral-200/80">
          {/* 50% Existing Load */}
          <div className="h-full bg-neutral-900 transition-all duration-500" style={{ width: '50%' }} />
          {/* 30% Shared Load */}
          <div
            className={`h-full bg-blue-600 transition-all duration-700 ${
              stage >= 1 ? 'w-[30%] opacity-100' : 'w-0 opacity-0'
            }`}
          />
          {/* 20% Shared Load */}
          <div
            className={`h-full bg-emerald-600 transition-all duration-700 ${
              stage === 2 ? 'w-[20%] opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1.5">
          <span>0%</span>
          <span className="text-neutral-800 font-semibold">50% Existing Cargo</span>
          <span className={stage >= 1 ? 'text-blue-600 font-semibold' : 'text-neutral-400'}>
            80% (+30% Shared Load)
          </span>
          <span className={stage === 2 ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>
            100% Fully Utilized
          </span>
        </div>
      </div>

      {/* Main Layered Animated Graphical Truck Visualization (from reference) */}
      <div className="relative z-10 w-full mt-4 aspect-[16/9] sm:aspect-[16/8.2] max-h-[390px] flex items-center justify-center select-none">
        <motion.svg
          viewBox="0 0 860 430"
          className="w-full h-full object-contain filter drop-shadow-md"
          initial={{ scale: 0.98, y: 3 }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <defs>
            <linearGradient id="mono-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#27272A" />
              <stop offset="50%" stopColor="#18181B" />
              <stop offset="100%" stopColor="#09090B" />
            </linearGradient>
            <linearGradient id="mono-metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F4F4F5" />
              <stop offset="100%" stopColor="#D4D4D8" />
            </linearGradient>
            <linearGradient id="cargo-interior" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F8F8F7" />
              <stop offset="100%" stopColor="#E4E4E7" />
            </linearGradient>
            <linearGradient id="laser-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="shared-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="shared-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          {/* Road Surface & Flowing Dashes */}
          <line x1="40" y1="365" x2="820" y2="365" stroke="#E4E4E7" strokeWidth="3" />
          <motion.line
            x1="80" y1="365" x2="780" y2="365"
            stroke="#A1A1AA"
            strokeWidth="3"
            strokeDasharray="20 20"
            animate={{ strokeDashoffset: [0, 80] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />

          {/* Headlight Projecting Beam */}
          <polygon
            points="700,285 830,298 830,360 700,320"
            fill="url(#laser-line-grad)"
            opacity="0.35"
          />

          {/* ======================================================== */}
          {/* ELEMENT 2: SECONDARY / FEEDER CARRIER (TOP-RIGHT INFLOW) */}
          {/* Demonstrating the collaborative inflow of compatible cargo */}
          {/* ======================================================== */}
          <g id="secondary-feeder-carrier" opacity="0.88">
            {/* Feeder Truck Chassis */}
            <rect x="520" y="80" width="220" height="8" rx="2" fill="#3F3F46" />
            {/* Feeder Cabin */}
            <path
              d="M 680,45 L 720,45 Q 735,45 742,60 L 748,80 L 680,80 Z"
              fill="#27272A"
              stroke="#52525B"
              strokeWidth="1"
            />
            {/* Feeder Cargo Bay showing incoming collaborative parcels */}
            <rect x="520" y="32" width="155" height="48" rx="4" fill="#F4F4F5" stroke="#A1A1AA" strokeWidth="1.5" />
            
            {/* Incoming 30% User A parcel */}
            <rect x="526" y="38" width="76" height="36" rx="3" fill="url(#shared-blue-grad)" />
            <text x="564" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">
              USER A · 30%
            </text>
            <text x="564" y="66" textAnchor="middle" fill="#BFDBFE" fontSize="7" fontWeight="bold" fontFamily="monospace">
              COMPATIBLE
            </text>

            {/* Incoming 20% User B parcel */}
            <rect x="608" y="38" width="60" height="36" rx="3" fill="url(#shared-green-grad)" />
            <text x="638" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">
              USER B · 20%
            </text>
            <text x="638" y="66" textAnchor="middle" fill="#A7F3D0" fontSize="7" fontWeight="bold" fontFamily="monospace">
              COMPATIBLE
            </text>

            {/* Wheels on Feeder */}
            {[550, 600, 715].map((x, idx) => (
              <circle key={idx} cx={x} cy={92} r="10" fill="#18181B" stroke="#52525B" strokeWidth="2" />
            ))}

            {/* Collaborative Connection Conduit Flow */}
            <path
              d="M 564,74 Q 564,115 410,148"
              fill="none"
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
            <path
              d="M 638,74 Q 638,125 500,148"
              fill="none"
              stroke="#059669"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
          </g>

          {/* ======================================================== */}
          {/* ELEMENT 1: PRIMARY SCHEDULED CARRIER (TRUCK 1) */}
          {/* ======================================================== */}
          
          {/* Heavy Truck Chassis Frame */}
          <rect x="150" y="325" width="560" height="14" rx="4" fill="#18181B" stroke="#3F3F46" strokeWidth="1" />

          {/* Tandem Wheels with Spinning Motion (from reference project) */}
          {[210, 280, 620].map((x, idx) => (
            <g key={idx} transform={`translate(${x}, 345)`}>
              <circle cx="0" cy="0" r="28" fill="#111111" stroke="#3F3F46" strokeWidth="4" />
              <circle cx="0" cy="0" r="14" fill="#27272A" />
              <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
              {/* Wheel spokes */}
              <motion.line
                x1="-14" y1="0" x2="14" y2="0"
                stroke="#71717A" strokeWidth="2"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              />
              <motion.line
                x1="0" y1="-14" x2="0" y2="14"
                stroke="#71717A" strokeWidth="2"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              />
            </g>
          ))}

          {/* Aerodynamic Cabin Unit */}
          <path
            d="M 550,175 L 630,175 Q 670,175 685,210 L 705,275 Q 710,300 708,335 L 550,335 Z"
            fill="url(#mono-body-grad)"
            stroke="#3F3F46"
            strokeWidth="2"
          />
          {/* Windshield with Gradient Reflection */}
          <path
            d="M 620,185 L 660,185 Q 672,185 680,210 L 692,255 L 620,255 Z"
            fill="#D4D4D8"
            fillOpacity="0.8"
          />
          <path
            d="M 632,190 L 668,230 L 660,235 L 626,192 Z"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />

          {/* Headlight LED Cluster */}
          <rect x="700" y="285" width="10" height="20" rx="3" fill="#FFFFFF" />
          <line x1="702" y1="288" x2="708" y2="288" stroke="#38BDF8" strokeWidth="2" />

          {/* Trailer Outer Container Body */}
          <rect
            x="140"
            y="135"
            width="410"
            height="195"
            rx="8"
            fill="#F4F4F5"
            stroke="#27272A"
            strokeWidth="2.5"
          />

          {/* Cargo Bay Interior Cutaway */}
          <rect
            x="148"
            y="145"
            width="394"
            height="175"
            rx="6"
            fill="url(#cargo-interior)"
            stroke="#D4D4D8"
            strokeWidth="1.5"
          />

          {/* --- CARGO SECTION 1: 50% EXISTING LOAD (LEFT HALF) --- */}
          <g id="cargo-section-existing">
            {/* 50% Pallet Base & Crates */}
            <rect
              x="156"
              y="155"
              width="186"
              height="155"
              rx="4"
              fill="#27272A"
              stroke="#18181B"
              strokeWidth="1.5"
            />
            {/* Internal Pallet Texture Ribs */}
            <line x1="202" y1="155" x2="202" y2="310" stroke="#3F3F46" strokeWidth="2" />
            <line x1="248" y1="155" x2="248" y2="310" stroke="#3F3F46" strokeWidth="2" />
            <line x1="294" y1="155" x2="294" y2="310" stroke="#3F3F46" strokeWidth="2" />
            {/* Securing Straps */}
            <line x1="156" y1="195" x2="342" y2="195" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 3" />
            <line x1="156" y1="255" x2="342" y2="255" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 3" />

            {/* Label Badge */}
            <g transform="translate(166, 168)">
              <rect x="0" y="0" width="132" height="32" rx="4" fill="#09090B" fillOpacity="0.9" />
              <circle cx="12" cy="16" r="3.5" fill="#9CA3AF" />
              <text x="22" y="14" fill="#E5E7EB" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                EXISTING CARGO
              </text>
              <text x="22" y="25" fill="#9CA3AF" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                50% LOAD (CHENNAI)
              </text>
            </g>
          </g>

          {/* --- CARGO SECTION 2: 30% SHARED LOAD (MIDDLE) --- */}
          <AnimatePresence>
            {stage >= 1 && (
              <motion.g
                id="cargo-section-shared-a"
                initial={{ opacity: 0, y: -60, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ type: 'spring', damping: 20, stiffness: 140 }}
              >
                <rect
                  x="346"
                  y="155"
                  width="112"
                  height="155"
                  rx="4"
                  fill="url(#shared-blue-grad)"
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                />
                <line x1="384" y1="155" x2="384" y2="310" stroke="#3B82F6" strokeWidth="2" />
                <line x1="422" y1="155" x2="422" y2="310" stroke="#3B82F6" strokeWidth="2" />
                <line x1="346" y1="210" x2="458" y2="210" stroke="#93C5FD" strokeWidth="2" strokeDasharray="6 3" />

                <g transform="translate(352, 168)">
                  <rect x="0" y="0" width="100" height="32" rx="4" fill="#0F172A" fillOpacity="0.9" />
                  <circle cx="10" cy="16" r="3.5" fill="#60A5FA" />
                  <text x="18" y="14" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
                    SHARED LOAD
                  </text>
                  <text x="18" y="25" fill="#BFDBFE" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    +30% USER A
                  </text>
                </g>
              </motion.g>
            )}
          </AnimatePresence>

          {/* --- CARGO SECTION 3: 20% SHARED LOAD (RIGHT) --- */}
          <AnimatePresence>
            {stage === 2 && (
              <motion.g
                id="cargo-section-shared-b"
                initial={{ opacity: 0, y: -60, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ type: 'spring', damping: 20, stiffness: 140, delay: 0.08 }}
              >
                <rect
                  x="462"
                  y="155"
                  width="74"
                  height="155"
                  rx="4"
                  fill="url(#shared-green-grad)"
                  stroke="#047857"
                  strokeWidth="1.5"
                />
                <line x1="499" y1="155" x2="499" y2="310" stroke="#10B981" strokeWidth="2" />
                <line x1="462" y1="210" x2="536" y2="210" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="5 3" />

                <g transform="translate(466, 168)">
                  <rect x="0" y="0" width="66" height="32" rx="4" fill="#064E3B" fillOpacity="0.9" />
                  <circle cx="8" cy="16" r="3" fill="#34D399" />
                  <text x="15" y="14" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">
                    SHARED
                  </text>
                  <text x="15" y="25" fill="#A7F3D0" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    +20% B
                  </text>
                </g>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Empty Available Space Indicators when slots are unbooked */}
          {stage === 0 && (
            <g id="empty-available-50-pct">
              <rect
                x="346"
                y="155"
                width="190"
                height="155"
                rx="4"
                fill="#FFFFFF"
                fillOpacity="0.6"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="8 6"
              />
              <g transform="translate(366, 218)">
                <rect x="0" y="0" width="150" height="42" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                <text x="75" y="18" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  UNUSED CAPACITY
                </text>
                <text x="75" y="32" textAnchor="middle" fill="#EF4444" fontSize="10.5" fontWeight="bold" fontFamily="monospace">
                  50% WASTED SPACE
                </text>
              </g>
            </g>
          )}

          {stage === 1 && (
            <g id="empty-available-20-pct">
              <rect
                x="462"
                y="155"
                width="74"
                height="155"
                rx="4"
                fill="#FFFFFF"
                fillOpacity="0.6"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="7 5"
              />
              <g transform="translate(466, 222)">
                <rect x="0" y="0" width="66" height="34" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                <text x="33" y="15" textAnchor="middle" fill="#64748B" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">
                  20% EMPTY
                </text>
                <text x="33" y="27" textAnchor="middle" fill="#D97706" fontSize="8" fontWeight="bold" fontFamily="monospace">
                  AWAITING
                </text>
              </g>
            </g>
          )}

          {/* Hydraulic Rear Shutter Door (Adapted from reference) */}
          <motion.g
            animate={{
              y: shutterOpen ? -145 : 0,
              opacity: shutterOpen ? 0.3 : 0.95,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <rect
              x="146"
              y="145"
              width="398"
              height="175"
              rx="4"
              fill="url(#mono-metal-grad)"
              stroke="#27272A"
              strokeWidth="2"
            />
            {[165, 185, 205, 225, 245, 265, 285, 305].map((y, idx) => (
              <line key={idx} x1="150" y1={y} x2="540" y2={y} stroke="#71717A" strokeWidth="1.5" />
            ))}
            <text x="345" y="240" textAnchor="middle" fill="#18181B" fontSize="14" fontWeight="900" fontFamily="sans-serif" letterSpacing="3">
              COLLABFLEET CAPACITY
            </text>
          </motion.g>
        </motion.svg>
      </div>

      {/* Interactive Phase Buttons & Controls Strip */}
      <div className="relative z-20 mt-3 pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setStage(0);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              stage === 0
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            1. 50% Existing Load
          </button>
          <button
            onClick={() => {
              setStage(1);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              stage === 1
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            2. +30% Shared Match
          </button>
          <button
            onClick={() => {
              setStage(2);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              stage === 2
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            3. 100% Fully Utilized
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Auto Playing' : 'Paused'}</span>
          </button>

          {stage === 2 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Empty Space</span>
            </span>
          )}
        </div>
      </div>

      {/* Mathematical Allocation Formula */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200/80">
          50% Existing Load
        </span>
        <span className="text-neutral-400 font-bold">+</span>
        <span
          className={`px-2.5 py-1 rounded-md transition-colors duration-300 font-semibold border ${
            stage >= 1
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-neutral-50 text-neutral-400 border-dashed border-neutral-200'
          }`}
        >
          30% Shared Load
        </span>
        <span className="text-neutral-400 font-bold">+</span>
        <span
          className={`px-2.5 py-1 rounded-md transition-colors duration-300 font-semibold border ${
            stage === 2
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-neutral-50 text-neutral-400 border-dashed border-neutral-200'
          }`}
        >
          20% Shared Load
        </span>
        <span className="text-neutral-400 font-bold">=</span>
        <span
          className={`px-3 py-1 rounded-md font-bold transition-all duration-300 ${
            stage === 2
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-neutral-200 text-neutral-800'
          }`}
        >
          {capacityPct}% Fully Utilized
        </span>
      </div>
    </div>
  );
};
