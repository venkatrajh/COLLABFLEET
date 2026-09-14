import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { DataTable, TableColumn } from '../components/common/DataTable';
import { AdminAuditService } from '../services/adminAuditService';
import { AuditLogEntry } from '../types/adminTypes';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const AdminAuditLog: React.FC = () => {
  const { showToast } = useAdmin();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Completed' | 'Flagged'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await AdminAuditService.getLogs();
      setLogs(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Actor,Action,Target,Timestamp,Status,Details"]
        .concat(logs.map(e => `"${e.id}","${e.actor}","${e.action}","${e.target}","${e.timestamp}","${e.status}","${e.details || ''}"`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `collabfleet_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit log trail exported as CSV', 'success');
  };

  const filteredLogs = logs.filter(entry => {
    const matchesSearch = 
      entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.details && entry.details.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && entry.status !== statusFilter) return false;
    return true;
  });

  const columns: TableColumn<AuditLogEntry>[] = [
    {
      header: 'Event ID',
      accessor: (e) => (
        <span className="font-mono font-bold text-neutral-900 text-xs">{e.id}</span>
      )
    },
    {
      header: 'Admin / Actor',
      accessor: (e) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-bold text-[10px]">
            {e.actor.charAt(0)}
          </div>
          <span className="font-semibold text-neutral-900 text-xs">{e.actor}</span>
        </div>
      )
    },
    {
      header: 'Operational Action',
      accessor: (e) => (
        <div>
          <div className="font-bold text-neutral-900 text-xs">{e.action}</div>
          {e.details && (
            <div className="text-[11px] text-neutral-500 line-clamp-1">{e.details}</div>
          )}
        </div>
      )
    },
    {
      header: 'Target Entity',
      accessor: (e) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-xs bg-[#FAF9F6] border border-[#EBEAE5] text-neutral-800">
          {e.target}
        </span>
      )
    },
    {
      header: 'Timestamp',
      accessor: (e) => (
        <span className="text-xs font-mono text-neutral-500">{e.timestamp}</span>
      )
    },
    {
      header: 'Status',
      className: 'text-right',
      accessor: (e) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          e.status === 'Completed'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : e.status === 'Flagged'
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {e.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
          {e.status === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
          <span>{e.status}</span>
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              Administrative Audit Trail
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded">
              Immutable Log
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium">
            Chronological register of administrative overrides, matching flags, KYC decisions & dispute resolutions
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors shadow-sm shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Trail (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E4DE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by ID, action, target (e.g. USR-1024, MT-2048)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5E4DE] bg-[#FAF9F6] text-xs font-medium focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#E5E4DE] p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'all' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setStatusFilter('Completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'Completed' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('Flagged')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'Flagged' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Flagged
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        keyExtractor={(e) => e.id}
        isLoading={isLoading}
        emptyMessage="No audit logs match current filter."
      />

      <div className="p-4 rounded-xl bg-white border border-[#E5E4DE] text-xs text-neutral-500 space-y-1">
        <div className="font-bold text-neutral-900">Audit Trail Notice</div>
        <div>
          Actions taken during this administrative session (such as Force Match, Flag Incorrect, Approve KYC, and Resolve Dispute) are recorded in local storage for demonstration review.
        </div>
      </div>

    </div>
  );
};
