import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { StatCard } from '../components/common/StatCard';
import { AdminMap } from '../components/common/AdminMap';
import { DetailDrawer } from '../components/common/DetailDrawer';
import { AdminFleetService } from '../services/adminFleetService';
import { AdminShipmentService } from '../services/adminShipmentService';
import { AdminOperationsService } from '../services/adminOperationsService';
import { AdminInsightsService, CorridorPerformance } from '../services/adminInsightsService';
import { AdminMetricsService } from '../services/adminMetrics';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { DateRangePeriod } from '../types/adminTypes';
import { Truck, Shipment } from '../types';
import { LiveOperationEvent } from '../types/adminTypes';
import { 
  Truck as TruckIcon, 
  Package, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Activity, 
  Fuel, 
  RefreshCw, 
  Clock, 
  MapPin, 
  Phone,
  AlertCircle
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { showToast, setActivePage } = useAdmin();
  const [period, setPeriod] = useState<DateRangePeriod>('30d');
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [events, setEvents] = useState<LiveOperationEvent[]>([]);
  const [corridors, setCorridors] = useState<CorridorPerformance[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const metrics = AdminMetricsService.getMetricsByPeriod(period);
  const alerts = AdminMetricsService.OPERATIONAL_ALERTS;

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [allTrucks, allShipments, recentEvents, topCorridors] = await Promise.all([
        AdminFleetService.getFleet(),
        AdminShipmentService.getAllShipments(),
        AdminOperationsService.getRecentEvents(),
        AdminInsightsService.getTopCorridors()
      ]);
      setTrucks(allTrucks);
      setShipments(allShipments);
      setEvents(recentEvents);
      setCorridors(topCorridors);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualRefresh = () => {
    loadData();
    showToast('Network telemetry and corridor streams updated', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / System Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E4DE] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
            <Activity className="w-5 h-5 animate-pulse text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#111111] tracking-tight">
              Network Command Center
            </h1>
            <p className="text-xs text-neutral-500 font-medium flex items-center gap-2">
              <span>National Freight Grid Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Operational · {metrics.activeCorridorsCount} Corridors Active
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <DateRangeFilter selectedPeriod={period} onPeriodChange={setPeriod} />

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E5E4DE] hover:border-black bg-[#FAF9F6] text-xs font-bold text-neutral-700 hover:text-black transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>
          <button
            onClick={() => setActivePage('live_ops')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <span>Live Dispatch Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Operational Alerts Section (Exceptions Triage) */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#111111]">
              Operational Alerts & Exceptions
            </h2>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 font-bold">
            Live Actionable Triggers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setActivePage('shipments')}
            className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] hover:border-black transition-colors flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <div className="text-lg font-black font-mono text-rose-600">{alerts.delayedShipments}</div>
              <div className="text-[11px] font-semibold text-neutral-700">Delayed shipments</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => setActivePage('fleet')}
            className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] hover:border-black transition-colors flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <div className="text-lg font-black font-mono text-amber-600">{alerts.lowUtilizationTrucks}</div>
              <div className="text-[11px] font-semibold text-neutral-700">Low-utilization trucks</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => setActivePage('support')}
            className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] hover:border-black transition-colors flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <div className="text-lg font-black font-mono text-blue-600">{alerts.openDisputes}</div>
              <div className="text-[11px] font-semibold text-neutral-700">Open disputes</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => setActivePage('users')}
            className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] hover:border-black transition-colors flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <div className="text-lg font-black font-mono text-neutral-900">{alerts.pendingKyc}</div>
              <div className="text-[11px] font-semibold text-neutral-700">KYC reviews pending</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => setActivePage('matching')}
            className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] hover:border-black transition-colors flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <div className="text-lg font-black font-mono text-purple-600">{alerts.flaggedMatches}</div>
              <div className="text-[11px] font-semibold text-neutral-700">Flagged matches</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Trucks"
          value={metrics.totalTrucks.toString()}
          subtext={`${metrics.activeTrucks} on-grid`}
          trend={{ value: "+12% MoM", isPositive: true }}
          icon={<TruckIcon className="w-4 h-4" />}
          accent="default"
        />
        <StatCard
          label="Active Shipments"
          value={metrics.totalShipments.toString()}
          subtext={`${metrics.inTransitShipments} in-transit`}
          trend={{ value: "+8 today", isPositive: true }}
          icon={<Package className="w-4 h-4" />}
          accent="blue"
        />
        <StatCard
          label="Deliveries Completed"
          value={metrics.completedShipments.toLocaleString()}
          subtext="On-schedule dispatch"
          trend={{ value: "+18% wk", isPositive: true }}
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent="green"
        />
        <StatCard
          label="Network Utilization"
          value={`${metrics.networkUtilization}%`}
          subtext="Capacity optimization"
          trend={{ value: "+3.2%", isPositive: true }}
          icon={<TrendingUp className="w-4 h-4" />}
          accent="amber"
        />
        <StatCard
          label="Empty KM Avoided"
          value={`${metrics.emptyKmAvoided.toLocaleString()} km`}
          subtext={`₹${(metrics.totalSavingsINR / 100000).toFixed(2)}L fuel saved`}
          trend={{ value: `${(metrics.co2MitigatedKg / 1000).toFixed(1)}T CO₂`, isPositive: true }}
          icon={<Fuel className="w-4 h-4" />}
          accent="green"
        />
      </div>

      {/* Main Map + Operational Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Section (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E4DE] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                Real-Time Corridor Nexus
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Live truck positions and active freight vectors across India
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#FAF9F6] border border-[#EBEAE5] px-2.5 py-1 rounded-lg text-neutral-600">
              {trucks.length} Units Plotted
            </span>
          </div>

          <AdminMap
            trucks={trucks}
            shipments={shipments}
            onSelectTruck={(t) => setSelectedTruck(t)}
            height="h-[460px]"
          />
        </div>

        {/* Live Operational Events (1 col) */}
        <div className="bg-white rounded-2xl border border-[#E5E4DE] p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEAE5]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                  Live Operations Stream
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">
                Real-Time Feed
              </span>
            </div>

            <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] hover:bg-[#F2F1EC] transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-[#EBEAE5]">
                      {evt.referenceId}
                    </span>
                    <span className="text-neutral-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {evt.timestamp}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#111111]">
                    {evt.title}
                  </div>

                  <p className="text-[11px] text-neutral-600 leading-snug">
                    {evt.description}
                  </p>

                  <div className="text-[10px] font-medium text-neutral-400 flex items-center gap-1 pt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActivePage('matching')}
            className="w-full mt-2 py-2.5 rounded-xl border border-[#E5E4DE] hover:border-black bg-white text-xs font-bold text-neutral-800 hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Multi-Factor Match Monitor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Top Corridors Performance Strip */}
      <div className="bg-white rounded-2xl border border-[#E5E4DE] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              Priority Freight Corridors
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Volume, capacity utilization, and Empty-KM Reduction by route
            </p>
          </div>
          <button
            onClick={() => setActivePage('insights')}
            className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1"
          >
            <span>Deep Network Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {corridors.slice(0, 3).map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#111111]">
                  {c.corridor}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +{c.growthPercent}% MoM
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#EBEAE5]">
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Volume</div>
                  <div className="text-xs font-black text-[#111111]">{c.volumeTons}T</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Utilization</div>
                  <div className="text-xs font-black text-[#111111]">{c.utilizationPercent}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Empty Saved</div>
                  <div className="text-xs font-black text-emerald-600">{c.emptyKmAvoided} km</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Truck Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedTruck}
        onClose={() => setSelectedTruck(null)}
        title={selectedTruck ? selectedTruck.name : 'Vehicle Telemetry'}
        subtitle={selectedTruck ? `${selectedTruck.registrationNumber} · ${selectedTruck.company}` : ''}
      >
        {selectedTruck && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Operating Status</span>
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  selectedTruck.isAvailable
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedTruck.isAvailable ? 'Available for Dispatch' : 'In Transit / Dispatched'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-500 font-medium">Vehicle Class</span>
                <span className="font-bold text-[#111111]">{selectedTruck.truckType}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Tonnage & Utilization
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white space-y-3">
                <div className="flex justify-between text-neutral-600">
                  <span>Current Payload:</span>
                  <span className="font-bold text-[#111111]">{selectedTruck.currentLoadTons}T / {selectedTruck.totalCapacityTons}T</span>
                </div>
                <div className="w-full bg-[#EBEAE5] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${Math.round((selectedTruck.currentLoadTons / selectedTruck.totalCapacityTons) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span>Available Space:</span>
                  <span className="font-bold text-emerald-600">{selectedTruck.availableCapacityTons} Tons Remaining</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Assigned Carrier & Driver
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#111111]">{selectedTruck.driver.name}</span>
                  <span className="font-mono text-xs font-bold text-amber-600">★ {selectedTruck.driver.rating.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedTruck.driver.phone}</span>
                </div>
                <div className="text-neutral-500">
                  <span>Total Trips Completed: </span>
                  <span className="font-bold text-[#111111]">{selectedTruck.driver.tripsCompleted} runs</span>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setSelectedTruck(null);
                  setActivePage('fleet');
                }}
                className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors"
              >
                Inspect in Fleet Manager
              </button>
            </div>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
