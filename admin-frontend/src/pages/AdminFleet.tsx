import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { StatCard } from '../components/common/StatCard';
import { DataTable, TableColumn } from '../components/common/DataTable';
import { DetailDrawer } from '../components/common/DetailDrawer';
import { AdminFleetService, FleetStats } from '../services/adminFleetService';
import { AdminMetricsService } from '../services/adminMetrics';
import { AdminAuditService } from '../services/adminAuditService';
import { Truck } from '../types';
import { 
  Truck as TruckIcon, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';

export const AdminFleet: React.FC = () => {
  const { showToast } = useAdmin();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [stats, setStats] = useState<FleetStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'transit' | 'offline'>('all');
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadFleet = async () => {
    setIsLoading(true);
    try {
      const [data, fleetStats] = await Promise.all([
        AdminFleetService.getFleet(),
        AdminFleetService.getFleetStats()
      ]);
      setTrucks(data);
      setStats(fleetStats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFleet();
  }, []);

  const handleToggleStatus = async (truck: Truck, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const updated = await AdminFleetService.toggleTruckStatus(truck.id);
      if (updated) {
        setTrucks(prev => prev.map(t => t.id === truck.id ? updated : t));
        if (selectedTruck?.id === truck.id) {
          setSelectedTruck(updated);
        }
        showToast(
          `${truck.registrationNumber} status shifted to ${updated.isAvailable ? 'Available' : 'Offline / In Transit'}`,
          'success'
        );
        AdminAuditService.logAction(
          'Updated truck status',
          truck.registrationNumber,
          `Changed operational status to ${updated.isAvailable ? 'Available' : 'Offline / In Transit'}`
        );
      }
    } catch (err) {
      showToast('Failed to update truck status', 'error');
    }
  };

  const filteredTrucks = trucks.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.currentLocation.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'available') return t.isAvailable;
    if (statusFilter === 'transit') return !t.isAvailable && t.currentLoadTons > 0;
    if (statusFilter === 'offline') return !t.isAvailable && t.currentLoadTons === 0;
    return true;
  });

  const columns: TableColumn<Truck>[] = [
    {
      header: 'Vehicle & Reg #',
      accessor: (t) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FAF9F6] border border-[#E5E4DE] flex items-center justify-center text-neutral-800 shrink-0">
            <TruckIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-[#111111]">{t.name}</div>
            <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{t.registrationNumber}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Carrier & Driver',
      accessor: (t) => (
        <div>
          <div className="font-semibold text-neutral-900">{t.company}</div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
            <span>{t.driver.name}</span>
            <span className="text-amber-600 font-bold">★ {t.driver.rating.toFixed(1)}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Capacity & Payload',
      accessor: (t) => {
        const pct = Math.round((t.currentLoadTons / t.totalCapacityTons) * 100);
        return (
          <div className="w-36 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-bold text-neutral-800">{t.currentLoadTons}T / {t.totalCapacityTons}T</span>
              <span className="text-neutral-500 font-mono">{pct}%</span>
            </div>
            <div className="w-full bg-[#EBEAE5] rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${pct > 80 ? 'bg-amber-600' : 'bg-neutral-900'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">
              {t.availableCapacityTons}T open
            </div>
          </div>
        );
      }
    },
    {
      header: 'Hub & Corridor',
      accessor: (t) => (
        <div>
          <div className="font-semibold text-neutral-800 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-400" />
            <span>{t.currentLocation.name}</span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            {t.currentDestination ? `${t.currentLocation.city} ⇄ ${t.currentDestination.city}` : 'Regional Inter-City'}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (t) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          t.isAvailable
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : t.currentLoadTons > 0
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${t.isAvailable ? 'bg-emerald-500' : 'bg-blue-500'}`} />
          {t.isAvailable ? 'Available' : t.currentLoadTons > 0 ? 'In Transit' : 'Standby'}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (t) => (
        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
          <button
            onClick={(e) => handleToggleStatus(t, e)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border ${
              t.isAvailable
                ? 'border-[#E5E4DE] bg-white text-neutral-600 hover:text-black hover:border-black'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
            title="Toggle vehicle availability"
          >
            {t.isAvailable ? 'Mark Offline' : 'Mark Available'}
          </button>
          <button
            onClick={() => setSelectedTruck(t)}
            className="p-1.5 rounded-lg border border-[#E5E4DE] bg-white hover:border-black text-neutral-600 hover:text-black transition-colors"
            title="View Details"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
            Fleet Operations & Vehicle Registry
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Monitor real-time payload capacities, driver assignments, and vehicle statuses across all carriers
          </p>
        </div>
      </div>

      {/* Fleet Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Vehicles"
          value={AdminMetricsService.BASE_METRICS.totalTrucks}
          subtext="Verified commercial trucks"
          icon={<TruckIcon className="w-4 h-4" />}
        />
        <StatCard
          label="Available For Dispatch"
          value={AdminMetricsService.BASE_METRICS.activeTrucks}
          subtext="Ready for load matching"
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent="green"
        />
        <StatCard
          label="In Transit / Loaded"
          value={AdminMetricsService.BASE_METRICS.inTransitShipments}
          subtext="Active line-haul trips"
          icon={<Clock className="w-4 h-4" />}
          accent="blue"
        />
        <StatCard
          label="Avg Fleet Utilization"
          value={`${AdminMetricsService.BASE_METRICS.networkUtilization}%`}
          subtext="Active load factor"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E4DE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by registration, model, carrier, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5E4DE] text-xs focus:outline-none focus:border-black bg-[#FAF9F6] font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-1 shrink-0">Filter:</span>
          {(['all', 'available', 'transit', 'offline'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors shrink-0 ${
                statusFilter === filterKey
                  ? 'bg-black text-white'
                  : 'bg-[#FAF9F6] border border-[#E5E4DE] text-neutral-600 hover:text-black hover:border-black'
              }`}
            >
              {filterKey === 'all' ? 'All Vehicles' : filterKey === 'transit' ? 'In Transit' : filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Operational DataTable */}
      <DataTable
        columns={columns}
        data={filteredTrucks}
        keyExtractor={(t) => t.id}
        onRowClick={(t) => setSelectedTruck(t)}
        selectedId={selectedTruck?.id}
        isLoading={isLoading}
        emptyMessage="No vehicles match the selected filter criteria."
      />

      {/* Deep Inspection Drawer */}
      <DetailDrawer
        isOpen={!!selectedTruck}
        onClose={() => setSelectedTruck(null)}
        title={selectedTruck ? selectedTruck.name : 'Vehicle Registry'}
        subtitle={selectedTruck ? `${selectedTruck.registrationNumber} · ${selectedTruck.company}` : ''}
      >
        {selectedTruck && (
          <div className="space-y-6 text-xs">
            
            {/* Status & Availability Switch */}
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#111111]">Operating Status</div>
                  <div className="text-[11px] text-neutral-500">Fleet operator control state</div>
                </div>
                <button
                  onClick={() => handleToggleStatus(selectedTruck)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    selectedTruck.isAvailable
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-neutral-800 hover:bg-black text-white'
                  }`}
                >
                  {selectedTruck.isAvailable ? 'Active · Available' : 'Offline / Standby'}
                </button>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Vehicle Specifications
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white divide-y divide-[#EBEAE5] space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Model / Type:</span>
                  <span className="font-bold text-[#111111]">{selectedTruck.name} ({selectedTruck.truckType})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Gross Capacity:</span>
                  <span className="font-bold text-[#111111]">{selectedTruck.totalCapacityTons} Metric Tons</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Current Payload:</span>
                  <span className="font-bold text-neutral-900">{selectedTruck.currentLoadTons} Tons</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Available Space:</span>
                  <span className="font-bold text-emerald-600">{selectedTruck.availableCapacityTons} Tons</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Home Hub:</span>
                  <span className="font-bold text-[#111111]">{selectedTruck.currentLocation.name}</span>
                </div>
              </div>
            </div>

            {/* Carrier & Driver Bio */}
            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Carrier & Driver Record
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white space-y-2.5">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-black text-sm text-[#111111]">{selectedTruck.driver.name}</div>
                    <div className="text-[11px] text-neutral-500 font-medium">{selectedTruck.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-amber-600">★ {selectedTruck.driver.rating.toFixed(2)}</div>
                    <div className="text-[10px] text-neutral-400">Carrier Rating</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EBEAE5] flex items-center justify-between text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{selectedTruck.driver.phone}</span>
                  </span>
                  <span className="font-semibold text-[#111111]">{selectedTruck.driver.tripsCompleted} Completed Trips</span>
                </div>
              </div>
            </div>

            {/* Highway Route Corridors */}
            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Authorized Corridors
              </div>
              <div className="p-3.5 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] text-neutral-700 font-mono text-[11px]">
                {selectedTruck.currentDestination 
                  ? `${selectedTruck.currentLocation.name} (${selectedTruck.currentLocation.city}) ⇄ ${selectedTruck.currentDestination.name} (${selectedTruck.currentDestination.city})`
                  : 'Regional Intra-State Corridor'}
              </div>
            </div>

          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
