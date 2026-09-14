import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { StatCard } from '../components/common/StatCard';
import { DataTable, TableColumn } from '../components/common/DataTable';
import { DetailDrawer } from '../components/common/DetailDrawer';
import { AdminUserService } from '../services/adminUserService';
import { AdminAuditService } from '../services/adminAuditService';
import { ManagedUser } from '../types/adminTypes';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Clock, 
  Building, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  FileText,
  Eye,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { showToast } = useAdmin();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'shipper' | 'fleet_operator' | 'driver'>('all');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<'id' | 'permit'>('id');
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await AdminUserService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApproveUser = async (user: ManagedUser) => {
    try {
      const updated = await AdminUserService.updateUserStatus(user.id, 'verified');
      if (updated) {
        setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
        if (selectedUser?.id === user.id) setSelectedUser(updated);
        AdminAuditService.logAction(
          'Approved user',
          user.name,
          `KYC accreditation approved for ${user.company || user.role} (${user.email})`,
          'Completed'
        );
        showToast(`KYC Approved & Verified for ${user.name}`, 'success');
      }
    } catch (err) {
      showToast('Failed to approve user verification', 'error');
    }
  };

  const handleRejectUser = async (user: ManagedUser) => {
    try {
      const updated = await AdminUserService.updateUserStatus(user.id, 'suspended');
      if (updated) {
        setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
        if (selectedUser?.id === user.id) setSelectedUser(updated);
        AdminAuditService.logAction(
          'Rejected KYC',
          user.name,
          `KYC rejected for ${user.company || user.role} - Documentation discrepancy`,
          'Flagged'
        );
        showToast(`KYC Rejected: User ${user.name} marked as suspended`, 'warning');
      }
    } catch (err) {
      showToast('Failed to reject user verification', 'error');
    }
  };

  const handleToggleVerification = async (user: ManagedUser, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (user.status === 'verified') {
      await handleRejectUser(user);
    } else {
      await handleApproveUser(user);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'shipper':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Shipper</span>;
      case 'fleet_operator':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Fleet Operator</span>;
      case 'driver':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Driver</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{role}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            Pending KYC
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <XCircle className="w-3 h-3" />
            Suspended
          </span>
        );
    }
  };

  const columns: TableColumn<ManagedUser>[] = [
    {
      header: 'User & Role',
      accessor: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
            {u.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-[#111111]">{u.name}</div>
            <div className="pt-0.5">{getRoleLabel(u.role)}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Company / Organization',
      accessor: (u) => (
        <div>
          <div className="font-semibold text-neutral-900">{u.company || 'Independent'}</div>
          <div className="text-[11px] text-neutral-500">{u.location}</div>
        </div>
      )
    },
    {
      header: 'Contact Info',
      accessor: (u) => (
        <div className="space-y-0.5 text-[11px] text-neutral-600">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-neutral-400" />
            <span>{u.phone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-neutral-400" />
            <span className="truncate max-w-[150px]">{u.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Track Record',
      accessor: (u) => (
        <div>
          <div className="font-bold text-neutral-900">{u.tripsCount} Runs Completed</div>
          <div className="text-[11px] text-amber-600 font-bold font-mono">★ {u.rating.toFixed(2)} Rating</div>
        </div>
      )
    },
    {
      header: 'KYC Status',
      accessor: (u) => getStatusBadge(u.status)
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (u) => (
        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
          <button
            onClick={(e) => handleToggleVerification(u, e)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${
              u.status === 'verified'
                ? 'border-[#E5E4DE] bg-white text-neutral-600 hover:text-black hover:border-black'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {u.status === 'verified' ? 'Revoke' : 'Verify'}
          </button>
          <button
            onClick={() => setSelectedUser(u)}
            className="p-1.5 rounded-lg border border-[#E5E4DE] bg-white hover:border-black text-neutral-600 hover:text-black transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
            User Directory & Participant Verification
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Manage shippers, verified fleet operators, and commercial drivers across the collaborative freight grid
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered"
          value={users.length}
          subtext="Shippers & Carriers"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Verified Participants"
          value={users.filter(u => u.status === 'verified').length}
          subtext="GST / VAHAN Validated"
          icon={<ShieldCheck className="w-4 h-4" />}
          accent="green"
        />
        <StatCard
          label="Pending KYC"
          value={users.filter(u => u.status === 'pending').length}
          subtext="Awaiting review"
          icon={<Clock className="w-4 h-4" />}
          accent="amber"
        />
        <StatCard
          label="Fleet Operators"
          value={users.filter(u => u.role === 'fleet_operator').length}
          subtext="Commercial partners"
          icon={<Building className="w-4 h-4" />}
          accent="blue"
        />
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E4DE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by user name, company, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5E4DE] text-xs focus:outline-none focus:border-black bg-[#FAF9F6] font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-1 shrink-0">Role:</span>
          {[
            { key: 'all', label: 'All Roles' },
            { key: 'shipper', label: 'Shippers' },
            { key: 'fleet_operator', label: 'Fleet Operators' },
            { key: 'driver', label: 'Drivers' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                roleFilter === tab.key
                  ? 'bg-black text-white'
                  : 'bg-[#FAF9F6] border border-[#E5E4DE] text-neutral-600 hover:text-black hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        keyExtractor={(u) => u.id}
        onRowClick={(u) => setSelectedUser(u)}
        selectedId={selectedUser?.id}
        isLoading={isLoading}
        emptyMessage="No users found matching query."
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser ? selectedUser.name : 'User Dossier'}
        subtitle={selectedUser ? `${selectedUser.company || selectedUser.role.toUpperCase()} · ${selectedUser.email}` : ''}
      >
        {selectedUser && (
          <div className="space-y-6 text-xs">
            
            {/* KYC & Accreditation Dossier */}
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#111111] text-sm">KYC & Document Review</div>
                  <div className="text-[11px] text-neutral-500">Government identity & commercial carrier permits</div>
                </div>
                {getStatusBadge(selectedUser.status)}
              </div>

              {/* Document Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E5E4DE] rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveDocTab('id')}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    activeDocTab === 'id' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Identity Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDocTab('permit')}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    activeDocTab === 'permit' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Carrier Permit</span>
                </button>
              </div>

              {/* Document Preview Card */}
              <div className="p-4 rounded-xl border border-[#E5E4DE] bg-white space-y-2.5 shadow-2xs relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 text-[48px] font-black text-neutral-100 uppercase pointer-events-none select-none tracking-widest rotate-12">
                  DEMO
                </div>

                <div className="flex justify-between items-start border-b border-[#F2F1EC] pb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      {activeDocTab === 'id' ? 'Identity Document' : 'Commercial Carrier Permit'}
                    </span>
                    <h4 className="font-black text-[#111111] text-xs">
                      {activeDocTab === 'id' ? 'Government Issued ID Card' : 'All-India National Goods Permit'}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedUser.status === 'verified'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {selectedUser.status === 'verified' ? 'Verified' : 'Submitted'}
                  </span>
                </div>

                {activeDocTab === 'id' ? (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Document Holder:</span>
                      <span className="font-bold text-neutral-900">{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Masked ID Number:</span>
                      <span className="font-mono font-bold text-neutral-800">XXXX-XXXX-8921</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Registered State:</span>
                      <span className="font-medium text-neutral-800">{selectedUser.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Verification Source:</span>
                      <span className="font-mono text-neutral-600">e-KYC Specimen Format</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Carrier / Holder:</span>
                      <span className="font-bold text-neutral-900">{selectedUser.company || selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Permit Authorization:</span>
                      <span className="font-mono font-bold text-neutral-800">IN-COMM-2026-{selectedUser.id.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Permit Scope:</span>
                      <span className="font-medium text-neutral-800">Multi-Axle Heavy & Medium Commercial</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Validity Horizon:</span>
                      <span className="font-mono text-emerald-600 font-bold">Valid through Dec 2028</span>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-neutral-400 font-mono pt-1 border-t border-[#F2F1EC] flex justify-between">
                  <span>Simulated verification asset</span>
                  <span>No PII exposed</span>
                </div>
              </div>

              {/* Operational Verification Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {selectedUser.status !== 'verified' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApproveUser(selectedUser)}
                      className="py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Approve & Verify</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectUser(selectedUser)}
                      className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-rose-600" />
                      <span>Reject KYC</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Account Verified</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRejectUser(selectedUser)}
                      className="py-2 px-3 rounded-xl border border-[#E5E4DE] bg-white hover:border-rose-300 hover:text-rose-600 text-neutral-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Revoke Access</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Profile Credentials
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white divide-y divide-[#EBEAE5] space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Registered Name:</span>
                  <span className="font-bold text-[#111111]">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Role:</span>
                  <span className="font-bold text-[#111111] uppercase">{selectedUser.role.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Organization:</span>
                  <span className="font-bold text-[#111111]">{selectedUser.company || 'Self-Employed'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Base Location:</span>
                  <span className="font-bold text-[#111111]">{selectedUser.location}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Member Since:</span>
                  <span className="font-mono text-neutral-700">{selectedUser.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Network Operational History
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Runs Dispatched:</span>
                  <span className="font-bold text-[#111111]">{selectedUser.tripsCount} trips</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Quality / Rating Score:</span>
                  <span className="font-mono font-bold text-amber-600">★ {selectedUser.rating.toFixed(2)} / 5.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Active Units / Manifests:</span>
                  <span className="font-bold text-neutral-900">{selectedUser.activeShipmentsOrTrucks} currently active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
