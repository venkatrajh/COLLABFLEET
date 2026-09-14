import React, { useState } from 'react';
import { DateRangePeriod } from '../types/adminTypes';
import { AdminMetricsService } from '../services/adminMetrics';
import { StatCard } from '../components/common/StatCard';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  Wallet, 
  CreditCard, 
  Fuel, 
  Truck, 
  Wrench, 
  ShieldCheck,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const AdminFinance: React.FC = () => {
  const [period, setPeriod] = useState<DateRangePeriod>('30d');
  const metrics = AdminMetricsService.getMetricsByPeriod(period);
  const trendData = AdminMetricsService.getFinancialTrend(period);
  const corridors = AdminMetricsService.getTopEarningCorridors(period);
  const transactions = AdminMetricsService.getRecentFinancialActivity();

  const formatINR = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              Financial Operations & Clearinghouse
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded">
              Demo Clearing
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium">
            Platform freight settlement, carrier payouts, and corridor gross margins
          </p>
        </div>

        <DateRangeFilter selectedPeriod={period} onPeriodChange={setPeriod} />
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Gross Freight Revenue"
          value={formatINR(metrics.revenueINR)}
          subtext="Total shipper billed value"
          trend={{ value: "+14.2% YoY", isPositive: true }}
          icon={<IndianRupee className="w-4 h-4" />}
          accent="default"
        />
        <StatCard
          label="Operating Costs"
          value={formatINR(metrics.operatingCostsINR)}
          subtext="Fuel, tolls & terminal fees"
          trend={{ value: "-3.1% optimized", isPositive: true }}
          icon={<CreditCard className="w-4 h-4" />}
          accent="amber"
        />
        <StatCard
          label="Fleet Carrier Earnings"
          value={formatINR(metrics.fleetEarningsINR)}
          subtext="Net disbursed to operators"
          trend={{ value: "98.8% settled", isPositive: true }}
          icon={<Truck className="w-4 h-4" />}
          accent="blue"
        />
        <StatCard
          label="Net Platform Margin"
          value={formatINR(metrics.netProfitINR)}
          subtext="CollabFleet network yield"
          trend={{ value: "7.5% take rate", isPositive: true }}
          icon={<TrendingUp className="w-4 h-4" />}
          accent="green"
        />
      </div>

      {/* Revenue / Profit Trend Chart & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue & Profit Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E4DE] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEAE5]">
            <div>
              <h2 className="text-sm font-black text-[#111111] uppercase tracking-wider">
                Revenue & Profit Trajectory
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Gross shipper billing vs operational overheads across the active window
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-black" />
                <span className="text-neutral-700">Gross Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-neutral-700">Platform Margin</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#111111" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.24}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEAE5" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: '#737373', fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: '#E5E4DE' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#737373', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v >= 100000 ? (v / 100000).toFixed(0) + 'L' : (v / 1000).toFixed(0) + 'k'}`}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#111111] text-white p-3 rounded-xl border border-neutral-800 shadow-xl text-xs space-y-1">
                          <div className="font-bold text-neutral-400">{label}</div>
                          <div className="flex justify-between gap-4">
                            <span>Revenue:</span>
                            <span className="font-mono font-bold">₹{Number(payload[0]?.value || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-emerald-400">
                            <span>Margin:</span>
                            <span className="font-mono font-bold">₹{Number(payload[1]?.value || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#111111" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#revenueGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#profitGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-3 border-t border-[#EBEAE5]">
            <span>Platform Take Rate: 7.5% average</span>
            <span>Clearing Cycle: T+1 Automated Escrow</span>
          </div>
        </div>

        {/* Operational Cost Breakdown (1 col) */}
        <div className="bg-white rounded-2xl border border-[#E5E4DE] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[#EBEAE5]">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-wider">
                  Cost Architecture
                </h3>
                <p className="text-[11px] text-neutral-500">Operating overhead distribution</p>
              </div>
            </div>

            <div className="space-y-3.5 pt-4">
              {[
                { label: 'Line-Haul Diesel & Fuel', pct: 42, amount: metrics.operatingCostsINR * 0.42, icon: <Fuel className="w-3.5 h-3.5" /> },
                { label: 'Carrier Driver Payouts', pct: 35, amount: metrics.operatingCostsINR * 0.35, icon: <Truck className="w-3.5 h-3.5" /> },
                { label: 'Preventative Fleet Maintenance', pct: 12, amount: metrics.operatingCostsINR * 0.12, icon: <Wrench className="w-3.5 h-3.5" /> },
                { label: 'Terminal Dock & Ops Overheads', pct: 7, amount: metrics.operatingCostsINR * 0.07, icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                { label: 'FASTag Tolls & Transit Charges', pct: 4, amount: metrics.operatingCostsINR * 0.04, icon: <CreditCard className="w-3.5 h-3.5" /> }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-neutral-800">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono text-neutral-900">{item.pct}% ({formatINR(item.amount)})</span>
                  </div>
                  <div className="w-full bg-[#EBEAE5] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-neutral-900 h-1.5 rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] text-[11px] text-neutral-600 space-y-0.5">
            <div className="font-bold text-neutral-900">Backhaul Savings Offset</div>
            <div>Optimized return legs saved an estimated {formatINR(metrics.totalSavingsINR)} in empty-mile fuel over this window.</div>
          </div>
        </div>

      </div>

      {/* Top Earning Corridors */}
      <div className="bg-white rounded-2xl border border-[#E5E4DE] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEAE5]">
          <div>
            <h2 className="text-sm font-black text-[#111111] uppercase tracking-wider">
              Top Earning Corridors
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Gross freight billing, operating costs, and net margin yield by route
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-400">
            5 Strategic Corridors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#EBEAE5] text-neutral-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4 font-bold text-[11px]">Freight Corridor</th>
                <th className="py-3 px-4 font-bold text-[11px]">Shipments</th>
                <th className="py-3 px-4 font-bold text-[11px]">Gross Revenue</th>
                <th className="py-3 px-4 font-bold text-[11px]">Operating Cost</th>
                <th className="py-3 px-4 font-bold text-[11px]">Net Margin</th>
                <th className="py-3 px-4 font-bold text-[11px] text-right">Take Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEAE5]">
              {corridors.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#111111]">{c.corridor}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-neutral-700">{c.shipments} runs</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">{formatINR(c.revenue)}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-600">{formatINR(c.cost)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{formatINR(c.profit)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      {c.marginPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Financial Activity / Settlements Table */}
      <div className="bg-white rounded-2xl border border-[#E5E4DE] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEAE5]">
          <div>
            <h2 className="text-sm font-black text-[#111111] uppercase tracking-wider">
              Recent Clearinghouse Activity
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Real-time escrow releases, carrier disbursements, and freight fee deductions
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-neutral-400">
            Last 5 Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#EBEAE5] text-neutral-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4 font-bold text-[11px]">Txn ID</th>
                <th className="py-3 px-4 font-bold text-[11px]">Booking</th>
                <th className="py-3 px-4 font-bold text-[11px]">Corridor</th>
                <th className="py-3 px-4 font-bold text-[11px]">Shipper / Carrier</th>
                <th className="py-3 px-4 font-bold text-[11px]">Gross Amount</th>
                <th className="py-3 px-4 font-bold text-[11px]">Platform Fee</th>
                <th className="py-3 px-4 font-bold text-[11px]">Carrier Payout</th>
                <th className="py-3 px-4 font-bold text-[11px] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEAE5]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">{tx.id}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500">{tx.bookingId}</td>
                  <td className="py-3.5 px-4 font-medium text-neutral-800">{tx.corridor}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-neutral-900">{tx.shipper}</div>
                    <div className="text-[10px] text-neutral-500">{tx.carrier}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">₹{tx.grossAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600">+₹{tx.platformFee.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-700">₹{tx.carrierPayout.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      tx.status === 'Settled'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : tx.status === 'Disbursed'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {tx.status}
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
