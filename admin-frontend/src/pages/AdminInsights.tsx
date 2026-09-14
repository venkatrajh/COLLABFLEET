import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/common/StatCard';
import { AdminInsightsService, CorridorPerformance, VolumeTrendPoint } from '../services/adminInsightsService';
import { AdminNetworkMetrics } from '../types/adminTypes';
import { 
  TrendingUp, 
  Fuel, 
  Leaf, 
  IndianRupee, 
  ArrowUpRight 
} from 'lucide-react';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { DateRangePeriod } from '../types/adminTypes';
import { AdminMetricsService } from '../services/adminMetrics';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const AdminInsights: React.FC = () => {
  const [period, setPeriod] = useState<DateRangePeriod>('30d');
  const [corridors, setCorridors] = useState<CorridorPerformance[]>([]);
  const [rawTrends, setRawTrends] = useState<VolumeTrendPoint[]>([]);
  const [activeMetricView, setActiveMetricView] = useState<'shipments' | 'trucks' | 'utilization'>('shipments');

  const metrics = AdminMetricsService.getMetricsByPeriod(period);

  useEffect(() => {
    const loadInsights = async () => {
      const [topCorridors, volumeTrends] = await Promise.all([
        AdminInsightsService.getTopCorridors(),
        AdminInsightsService.getVolumeTrends()
      ]);
      setCorridors(topCorridors);
      setRawTrends(volumeTrends);
    };
    loadInsights();
  }, []);

  // Scale trends based on selected period
  const trendMultiplier = period === 'today' ? 0.35 : period === '7d' ? 0.8 : period === 'custom' ? 0.9 : 1.0;
  const trends: VolumeTrendPoint[] = rawTrends.map(t => ({
    ...t,
    shipments: Math.round(t.shipments * trendMultiplier),
    trucks: Math.round(t.trucks * trendMultiplier),
    utilization: Math.min(95, Math.round(t.utilization * (period === 'today' ? 1.02 : 1)))
  }));

  // Dynamically compute peak activity from current trend dataset
  const peakPoint = trends.length > 0
    ? trends.reduce((max, cur) => cur.shipments > (max?.shipments || 0) ? cur : max, trends[0])
    : null;

  const peakCaption = peakPoint
    ? `Peak Activity: ${peakPoint.day} (${peakPoint.shipments} shipments, ${peakPoint.utilization}% capacity utilization)`
    : 'Peak activity is based on the selected date range.';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
            Network Performance & Insights
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            System-wide capacity efficiency, Empty-KM Reduction, and environmental impact
          </p>
        </div>

        <DateRangeFilter selectedPeriod={period} onPeriodChange={setPeriod} />
      </div>

      {/* 4 Macro Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Empty Distance Abatement"
          value={`${metrics.emptyKmAvoided.toLocaleString()} km`}
          subtext="Saved via return backhauls"
          trend={{ value: "+22% MoM", isPositive: true }}
          icon={<Fuel className="w-4 h-4" />}
          accent="green"
        />
        <StatCard
          label="Carrier Diesel Savings"
          value={`₹${(metrics.totalSavingsINR / 100000).toFixed(2)} Lakhs`}
          subtext="Direct bottom-line efficiency"
          trend={{ value: `₹${(metrics.totalSavingsINR / 100000).toFixed(2)}L total`, isPositive: true }}
          icon={<IndianRupee className="w-4 h-4" />}
          accent="blue"
        />
        <StatCard
          label="Carbon Emissions Mitigated"
          value={`${(metrics.co2MitigatedKg / 1000).toFixed(1)} Tons CO₂`}
          subtext="Calculated from empty-km reduction"
          trend={{ value: `-${(metrics.co2MitigatedKg / 1000).toFixed(1)}T CO₂`, isPositive: true }}
          icon={<Leaf className="w-4 h-4" />}
          accent="green"
        />
        <StatCard
          label="Network Fleet Utilization"
          value={`${metrics.networkUtilization}%`}
          subtext="Average truck space used"
          trend={{ value: "+3.4% this qtr", isPositive: true }}
          icon={<TrendingUp className="w-4 h-4" />}
          accent="amber"
        />
      </div>

      {/* Volume Trends Chart & Corridor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E4DE] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEAE5]">
            <div>
              <h2 className="text-sm font-black text-[#111111] uppercase tracking-wider">
                Weekly Volume & Fleet Activity
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Day-by-day load volume and vehicle availability
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#E5E4DE] p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveMetricView('shipments')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeMetricView === 'shipments' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Shipments
              </button>
              <button
                onClick={() => setActiveMetricView('trucks')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeMetricView === 'trucks' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Trucks
              </button>
              <button
                onClick={() => setActiveMetricView('utilization')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeMetricView === 'utilization' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Utilization %
              </button>
            </div>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#F0EFEA" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={{ stroke: '#E5E4DE' }}
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                  domain={activeMetricView === 'utilization' ? [0, 100] : [0, 'auto']}
                />
                <Tooltip 
                  cursor={{ fill: '#FAF9F6' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value;
                      const labelText = activeMetricView === 'shipments' 
                        ? 'Shipments' 
                        : activeMetricView === 'trucks' 
                        ? 'Available Trucks' 
                        : 'Avg Utilization';
                      return (
                        <div className="bg-white border border-[#E5E4DE] px-3 py-2 rounded-xl shadow-md text-xs">
                          <span className="font-bold text-[#111111]">{label}</span>
                          <div className="text-neutral-600 mt-0.5">
                            {labelText}: <span className="font-bold text-[#111111]">{val}{activeMetricView === 'utilization' ? '%' : ''}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey={activeMetricView} 
                  fill="#111111" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-3 border-t border-[#EBEAE5]">
            <span>{peakCaption}</span>
            <span>Refreshed: Real-Time</span>
          </div>
        </div>

        {/* Deadhead Reduction Card (1 col) */}
        <div className="bg-white rounded-2xl border border-[#E5E4DE] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[#EBEAE5]">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-wider">
                  ESG & Return Tripping
                </h3>
                <span className="text-[11px] text-neutral-500 font-medium">Sustainable Collaborative Logistics</span>
              </div>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-1">
                <div className="text-neutral-500 font-medium">Backhaul Conversion Rate</div>
                <div className="text-xl font-black text-[#111111]">78.4%</div>
                <p className="text-[11px] text-neutral-500">
                  4 out of 5 long-haul runs secured return cargo before departing origin.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-1">
                <div className="text-neutral-500 font-medium">Average Detour Margin</div>
                <div className="text-xl font-black text-emerald-700">14.2 km</div>
                <p className="text-[11px] text-neutral-500">
                  Minimal route detour tolerance keeps line-haul fuel consumption optimal.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-1">
                <div className="text-neutral-500 font-medium">Annualized Carbon Projection</div>
                <div className="text-xl font-black text-neutral-900">295 Tons CO₂</div>
                <p className="text-[11px] text-neutral-500">
                  Estimated annual greenhouse gas mitigation across 14 major corridors.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black text-white text-[11px] flex items-center justify-between">
            <span className="font-semibold">ESG Modeling</span>
            <span className="text-neutral-300 font-bold">Designed for ISO 14064 alignment</span>
          </div>
        </div>

      </div>

      {/* Corridor Benchmark Table */}
      <div className="bg-white rounded-2xl border border-[#E5E4DE] p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-black text-[#111111] uppercase tracking-wider">
            Inter-City Freight Corridor Benchmarks
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Tonnage density, trip frequencies, and empty running mitigation across strategic national highways
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#EBEAE5] text-neutral-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4 font-bold text-[11px]">Corridor Route</th>
                <th className="py-3 px-4 font-bold text-[11px]">Tonnage Moved</th>
                <th className="py-3 px-4 font-bold text-[11px]">Trips Logged</th>
                <th className="py-3 px-4 font-bold text-[11px]">Utilization</th>
                <th className="py-3 px-4 font-bold text-[11px]">Empty KM Saved</th>
                <th className="py-3 px-4 font-bold text-[11px] text-right">Growth Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEAE5]">
              {corridors.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-4 font-black text-[#111111]">
                    {c.corridor}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-800">
                    {c.volumeTons} Tons
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 font-mono">
                    {c.tripsCount} runs
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">{c.utilizationPercent}%</span>
                      <div className="w-16 bg-[#EBEAE5] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-black h-1.5 rounded-full" style={{ width: `${c.utilizationPercent}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                    {c.emptyKmAvoided} km
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ArrowUpRight className="w-3 h-3" />
                      +{c.growthPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
