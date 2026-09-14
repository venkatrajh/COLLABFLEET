import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { StatCard } from '../components/common/StatCard';
import { DataTable, TableColumn } from '../components/common/DataTable';
import { DetailDrawer } from '../components/common/DetailDrawer';
import { AdminShipmentService, ShipmentOverviewStats } from '../services/adminShipmentService';
import { Shipment, ShipmentStatus } from '../types';
import { 
  Package, 
  Search, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  ChevronRight 
} from 'lucide-react';

export const AdminShipments: React.FC = () => {
  const { showToast } = useAdmin();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<ShipmentOverviewStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadShipments = async () => {
    setIsLoading(true);
    try {
      const [allShipments, shipmentStats] = await Promise.all([
        AdminShipmentService.getAllShipments(),
        AdminShipmentService.getShipmentStats()
      ]);
      setShipments(allShipments);
      setStats(shipmentStats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const handleUpdateStatus = (shipment: Shipment, newStatus: ShipmentStatus, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      AdminShipmentService.updateStatus(shipment.id, newStatus);
      const updatedList = shipments.map(s => s.id === shipment.id ? { ...s, status: newStatus } : s);
      setShipments(updatedList);
      if (selectedShipment?.id === shipment.id) {
        setSelectedShipment({ ...selectedShipment, status: newStatus });
      }
      showToast(`Shipment ${shipment.id} transitioned to ${newStatus.replace('_', ' ').toUpperCase()}`, 'success');
    } catch (err) {
      showToast('Failed to update shipment status', 'error');
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = 
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.trackingNumber && s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.cargoType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.fromLocation && s.fromLocation.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.toLocation && s.toLocation.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ((s as any).shipperName && (s as any).shipperName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'in_transit') {
      return ['in_transit', 'picked_up', 'going_to_pickup'].includes(s.status);
    }
    if (statusFilter === 'pending') {
      return ['confirmed', 'driver_assigned'].includes(s.status);
    }
    if (statusFilter === 'delivered') {
      return s.status === 'delivered';
    }
    return true;
  });

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'in_transit':
      case 'picked_up':
      case 'going_to_pickup':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            In Transit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending Dispatch
          </span>
        );
    }
  };

  const columns: TableColumn<Shipment>[] = [
    {
      header: 'Shipment ID & Cargo',
      accessor: (s) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FAF9F6] border border-[#E5E4DE] flex items-center justify-center text-neutral-800 shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono text-xs font-black text-[#111111]">{s.id}</div>
            <div className="text-[11px] text-neutral-600 font-medium truncate max-w-[150px]">{s.cargoType}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Weight & Value',
      accessor: (s) => (
        <div>
          <div className="font-bold text-neutral-900">{s.weightTons} Metric Tons</div>
          <div className="text-[11px] font-mono font-semibold text-emerald-700">₹{(s.price || 24000).toLocaleString('en-IN')}</div>
        </div>
      )
    },
    {
      header: 'Origin ➔ Destination',
      accessor: (s) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-neutral-800 font-semibold text-[11px]">
            <span>{s.fromLocation?.city || 'Origin'}</span>
            <ArrowRight className="w-3 h-3 text-neutral-400" />
            <span>{s.toLocation?.city || 'Destination'}</span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            {(s as any).distanceKm || 340} km · Approx. {(s as any).estimatedHours || 7}h
          </div>
        </div>
      )
    },
    {
      header: 'Assigned Vehicle',
      accessor: (s) => (
        <div>
          {s.truck ? (
            <div>
              <div className="font-semibold text-neutral-900">{s.truck.name}</div>
              <div className="font-mono text-[10px] text-neutral-400">{s.truck.registrationNumber}</div>
            </div>
          ) : (
            <span className="text-neutral-400 italic text-[11px]">Awaiting Carrier Match</span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (s) => getStatusBadge(s.status)
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (s) => (
        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
          {s.status !== 'delivered' && (
            <button
              onClick={(e) => handleUpdateStatus(s, s.status === 'in_transit' ? 'delivered' : 'in_transit', e)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[#E5E4DE] bg-white text-neutral-700 hover:text-black hover:border-black transition-colors"
            >
              {s.status === 'in_transit' ? 'Mark Delivered' : 'Dispatch'}
            </button>
          )}
          <button
            onClick={() => setSelectedShipment(s)}
            className="p-1.5 rounded-lg border border-[#E5E4DE] bg-white hover:border-black text-neutral-600 hover:text-black transition-colors"
            title="Inspect Shipment"
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
            Shipment Manifest & Logistics Oversight
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Live tracking of shipper freight bookings, corridor transit milestones, and proof of delivery
          </p>
        </div>
      </div>

      {/* Shipment Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Manifests"
          value={stats?.totalShipments || shipments.length}
          subtext="Active in network"
          icon={<Package className="w-4 h-4" />}
        />
        <StatCard
          label="In Transit"
          value={stats?.inTransitCount || 0}
          subtext="Line-haul en-route"
          icon={<Clock className="w-4 h-4" />}
          accent="blue"
        />
        <StatCard
          label="Pending Dispatch"
          value={stats?.pendingCount || 0}
          subtext="Assigned / staging"
          icon={<AlertCircle className="w-4 h-4" />}
          accent="amber"
        />
        <StatCard
          label="Delivered / Cleared"
          value={stats?.deliveredCount || 0}
          subtext="Successful drop-offs"
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent="green"
        />
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E4DE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by ID, cargo type, origin or destination city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5E4DE] text-xs focus:outline-none focus:border-black bg-[#FAF9F6] font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-1 shrink-0">Status:</span>
          {[
            { key: 'all', label: 'All Manifests' },
            { key: 'in_transit', label: 'In Transit' },
            { key: 'pending', label: 'Pending Dispatch' },
            { key: 'delivered', label: 'Delivered' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                statusFilter === tab.key
                  ? 'bg-black text-white'
                  : 'bg-[#FAF9F6] border border-[#E5E4DE] text-neutral-600 hover:text-black hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Operational Table */}
      <DataTable
        columns={columns}
        data={filteredShipments}
        keyExtractor={(s) => s.id}
        onRowClick={(s) => setSelectedShipment(s)}
        selectedId={selectedShipment?.id}
        isLoading={isLoading}
        emptyMessage="No shipments found matching criteria."
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedShipment}
        onClose={() => setSelectedShipment(null)}
        title={selectedShipment ? `Manifest ${selectedShipment.id}` : 'Shipment Manifest'}
        subtitle={selectedShipment ? `${selectedShipment.cargoType} · ${selectedShipment.weightTons} Tons` : ''}
      >
        {selectedShipment && (
          <div className="space-y-6 text-xs">
            
            {/* Status & Lifecycle Action */}
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#111111]">Current Status</div>
                  <div className="text-[11px] text-neutral-500">Logistics lifecycle progression</div>
                </div>
                {getStatusBadge(selectedShipment.status)}
              </div>

              <div className="pt-2 border-t border-[#EBEAE5] flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedShipment, 'in_transit')}
                  disabled={selectedShipment.status === 'in_transit' || selectedShipment.status === 'delivered'}
                  className="flex-1 py-2 rounded-xl border border-[#E5E4DE] bg-white font-bold hover:bg-neutral-100 disabled:opacity-40"
                >
                  Mark In Transit
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedShipment, 'delivered')}
                  disabled={selectedShipment.status === 'delivered'}
                  className="flex-1 py-2 rounded-xl bg-black text-white font-bold hover:bg-neutral-800 disabled:opacity-40"
                >
                  Mark Delivered
                </button>
              </div>
            </div>

            {/* Route & Consignment Details */}
            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Freight Routing & Milestones
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-black mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-[#111111]">Pickup Hub</div>
                    <div className="text-neutral-600">{selectedShipment.fromLocation?.name || 'Hub'}, {selectedShipment.fromLocation?.city}</div>
                  </div>
                </div>
                <div className="border-l-2 border-dashed border-neutral-300 ml-1 pl-4 py-1 text-neutral-400 font-mono text-[11px]">
                  {(selectedShipment as any).distanceKm || 340} km corridor
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-[#111111]">Delivery Destination</div>
                    <div className="text-neutral-600">{selectedShipment.toLocation?.name || 'Hub'}, {selectedShipment.toLocation?.city}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Commercial Terms */}
            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Commercial Terms
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Agreed Freight Charge:</span>
                  <span className="font-mono font-bold text-[#111111]">₹{(selectedShipment.price || 28000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Consignment Weight:</span>
                  <span className="font-bold text-[#111111]">{selectedShipment.weightTons} Tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimated Duration:</span>
                  <span className="font-bold text-[#111111]">{(selectedShipment as any).estimatedHours || 8} Hours</span>
                </div>
              </div>
            </div>

            {/* Assigned Carrier info */}
            {selectedShipment.truck && (
              <div className="space-y-2">
                <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                  Assigned Vehicle & Driver
                </div>
                <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#111111]">{selectedShipment.truck.name}</span>
                    <span className="font-mono text-neutral-500">{selectedShipment.truck.registrationNumber}</span>
                  </div>
                  <div className="text-neutral-600">
                    Carrier: <strong className="text-black">{selectedShipment.truck.company}</strong>
                  </div>
                  <div className="text-neutral-600">
                    Driver: <strong className="text-black">{selectedShipment.truck.driver.name}</strong> ({selectedShipment.truck.driver.phone})
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
