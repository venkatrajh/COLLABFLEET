import React, { useState, useRef, useEffect } from 'react';
import { Truck, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';

export const HeroNetworkVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [truckProgress, setTruckProgress] = useState(0.28);
  const [activeHub, setActiveHub] = useState<string>('Chennai');

  // Interactive subtle mouse parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Continuous smooth truck movement along the Chennai -> Bengaluru corridor
  useEffect(() => {
    const interval = setInterval(() => {
      setTruckProgress((prev) => (prev >= 0.92 ? 0.12 : prev + 0.005));
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // Hubs positioned on miniature schematic map
  const HUBS = [
    { name: 'Chennai', x: 340, y: 80, role: 'Port Origin', tag: '346 km corridor' },
    { name: 'Sriperumbudur', x: 260, y: 110, role: 'Industrial Auto Hub', tag: 'Detour 12 km' },
    { name: 'Hosur', x: 190, y: 160, role: 'Electronics Hub', tag: 'Active load' },
    { name: 'Bengaluru', x: 130, y: 190, role: 'Inland Depot', tag: 'Destination' },
    { name: 'Coimbatore', x: 80, y: 270, role: 'Return Corridor', tag: 'Backhaul Available' }
  ];

  // Calculate truck position along primary corridor (Chennai -> Bengaluru)
  // Linear interpolation along (340, 80) -> (260, 110) -> (190, 160) -> (130, 190)
  const getTruckCoordinates = (t: number) => {
    if (t < 0.35) {
      const subT = t / 0.35;
      return {
        x: 340 + (260 - 340) * subT,
        y: 80 + (110 - 80) * subT
      };
    } else if (t < 0.7) {
      const subT = (t - 0.35) / 0.35;
      return {
        x: 260 + (190 - 260) * subT,
        y: 110 + (160 - 110) * subT
      };
    } else {
      const subT = (t - 0.7) / 0.3;
      return {
        x: 190 + (130 - 190) * subT,
        y: 160 + (190 - 160) * subT
      };
    }
  };

  const truckPos = getTruckCoordinates(truckProgress);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 shadow-2xl overflow-hidden group select-none cursor-default"
      style={{
        transform: `perspective(1000px) rotateX(${-mouseOffset.y * 0.4}deg) rotateY(${mouseOffset.x * 0.4}deg)`,
        transition: 'transform 0.15s ease-out'
      }}
    >
      {/* Background Engineering Grid Pattern */}
      <div className="absolute inset-0 bg-engineering-grid opacity-30 pointer-events-none" />

      {/* Subtle Controlled Glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Corridor Header */}
      <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-neutral-800 mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </span>
          <span className="text-xs font-bold text-white tracking-tight">
            COLLABFLEET Network · Corridor 04
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-extrabold text-white">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>94% Match</span>
        </div>
      </div>

      {/* SVG Interactive Map Network */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-[#080808] border border-neutral-900 overflow-hidden flex items-center justify-center">
        
        <svg
          viewBox="0 0 420 310"
          className="w-full h-full"
          style={{
            transform: `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Secondary return corridor routes (thin gray) */}
          <path
            d="M 130 190 Q 100 230 80 270"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 80 270 Q 210 200 340 80"
            fill="none"
            stroke="rgba(16, 185, 129, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Primary Corridor Route Line with subtle cyan pulse */}
          <path
            d="M 340 80 L 260 110 L 190 160 L 130 190"
            fill="none"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Flowing animated traffic dashline */}
          <path
            d="M 340 80 L 260 110 L 190 160 L 130 190"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2"
            className="animate-route-flow"
            strokeLinecap="round"
          />

          {/* Moving Truck on Route */}
          <g
            transform={`translate(${truckPos.x}, ${truckPos.y})`}
            className="cursor-pointer transition-transform duration-75"
          >
            {/* Soft truck radar aura */}
            <circle r="12" fill="rgba(56, 189, 248, 0.2)" className="animate-ping" />
            <circle r="9" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" />
            <text
              x="0"
              y="3.5"
              textAnchor="middle"
              fontSize="8"
              fill="#FFFFFF"
              fontWeight="bold"
            >
              🚚
            </text>
          </g>

          {/* Hub Nodes */}
          {HUBS.map((hub) => {
            const isHovered = activeHub === hub.name;
            return (
              <g
                key={hub.name}
                className="cursor-pointer group/node"
                onMouseEnter={() => setActiveHub(hub.name)}
              >
                {/* Outer halo */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={isHovered ? 8 : 5}
                  fill={isHovered ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)'}
                  className="transition-all duration-200"
                />
                {/* Core Dot */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={isHovered ? 4 : 3}
                  fill={isHovered ? '#38BDF8' : '#FFFFFF'}
                  stroke="#000000"
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />
                {/* Node Label */}
                <text
                  cx={hub.x}
                  cy={hub.y}
                  x={hub.x + 10}
                  y={hub.y + 3}
                  fontSize="9"
                  fontWeight="bold"
                  fill={isHovered ? '#FFFFFF' : '#A3A3A3'}
                  className="transition-colors duration-200"
                >
                  {hub.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Active Corridor Overlay Tag */}
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] text-neutral-300 flex items-center gap-1.5">
          <Navigation className="w-3 h-3 text-cyan-400" />
          <span>Active Hub: <strong className="text-white">{activeHub}</strong></span>
        </div>
      </div>

      {/* Matched Truck Live Information Card */}
      <div className="relative z-10 mt-3 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-sm">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <span>Ashok Leyland 1618</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] text-neutral-400">
              8.5 T available · 12 min away · Backhaul
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-black text-white font-mono">₹8,400</div>
          <div className="text-[9px] font-bold text-emerald-400">Save ₹1,850 (22%)</div>
        </div>
      </div>

      {/* Three Sub-Metrics */}
      <div className="relative z-10 grid grid-cols-3 gap-2 text-center pt-3 mt-1 border-t border-neutral-900">
        <div>
          <div className="text-[9px] text-neutral-500 uppercase font-semibold">Deadhead Saved</div>
          <div className="text-xs font-black text-white font-mono">67 km</div>
        </div>
        <div>
          <div className="text-[9px] text-neutral-500 uppercase font-semibold">CO₂ Offset</div>
          <div className="text-xs font-black text-emerald-400 font-mono">38 kg</div>
        </div>
        <div>
          <div className="text-[9px] text-neutral-500 uppercase font-semibold">Match Score</div>
          <div className="text-xs font-black text-cyan-400 font-mono">94%</div>
        </div>
      </div>

    </div>
  );
};
