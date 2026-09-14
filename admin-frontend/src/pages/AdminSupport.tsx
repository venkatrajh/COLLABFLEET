import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { DetailDrawer } from '../components/common/DetailDrawer';
import { AdminSupportService } from '../services/adminSupportService';
import { DisputeTicket } from '../types/adminTypes';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Send, 
  User, 
  Truck, 
  Tag, 
  Filter,
  PlusCircle
} from 'lucide-react';

export const AdminSupport: React.FC = () => {
  const { showToast } = useAdmin();
  const [tickets, setTickets] = useState<DisputeTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<DisputeTicket | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newNote, setNewNote] = useState<string>('');
  const [isSubmittingNote, setIsSubmittingNote] = useState<boolean>(false);

  const loadTickets = async () => {
    const list = await AdminSupportService.getTickets();
    setTickets(list);
    if (selectedTicket) {
      const refreshed = list.find(t => t.id === selectedTicket.id);
      if (refreshed) setSelectedTicket(refreshed);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleStatusShift = async (ticketId: string, newStatus: 'open' | 'in_progress' | 'resolved') => {
    const updated = await AdminSupportService.updateTicketStatus(ticketId, newStatus);
    if (updated) {
      showToast(`Dispute ${ticketId} moved to ${newStatus.replace('_', ' ').toUpperCase()}`, 'success');
      loadTickets();
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newNote.trim() || isSubmittingNote) return;

    setIsSubmittingNote(true);
    try {
      const updated = await AdminSupportService.addInternalNote(selectedTicket.id, newNote.trim());
      if (updated) {
        setNewNote('');
        showToast('Internal note appended to dispute history', 'info');
        loadTickets();
      }
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (categoryFilter === 'all') return true;
    return t.category === categoryFilter;
  });

  const openTickets = filteredTickets.filter(t => t.status === 'open');
  const inProgressTickets = filteredTickets.filter(t => t.status === 'in_progress');
  const resolvedTickets = filteredTickets.filter(t => t.status === 'resolved');

  const getPriorityBadge = (priority: DisputeTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">Urgent</span>;
      case 'high':
        return <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">High</span>;
      case 'medium':
        return <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">Medium</span>;
      default:
        return <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              Support & Dispute Operations
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded">
              Kanban Desk
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium">
            Shipper-carrier dispute mitigation, consignment exceptions & triage resolution
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-bold border border-[#E5E4DE] bg-[#FAF9F6] text-neutral-800 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories ({tickets.length})</option>
            <option value="Booking issue">Booking issue</option>
            <option value="Payment issue">Payment issue</option>
            <option value="Vehicle issue">Vehicle issue</option>
            <option value="Delivery delay">Delivery delay</option>
            <option value="Matching issue">Matching issue</option>
          </select>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        
        {/* COLUMN 1: OPEN */}
        <div className="bg-[#FAF9F6] border border-[#E5E4DE] rounded-2xl p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBEAE5]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Open Requests
              </h2>
            </div>
            <span className="text-xs font-mono font-bold bg-white border border-[#E5E4DE] px-2 py-0.5 rounded-lg text-neutral-800">
              {openTickets.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {openTickets.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-400">No open disputes</div>
            ) : (
              openTickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="bg-white p-4 rounded-xl border border-[#E5E4DE] hover:border-black shadow-xs hover:shadow-sm cursor-pointer transition-all space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-neutral-900 group-hover:underline">
                      {t.id}
                    </span>
                    {getPriorityBadge(t.priority)}
                  </div>

                  <p className="text-xs text-neutral-700 font-medium line-clamp-2">
                    {t.shortDescription}
                  </p>

                  <div className="pt-1 text-[11px] text-neutral-500 space-y-0.5 border-t border-[#F2F1EC]">
                    <div className="flex justify-between">
                      <span>Booking:</span>
                      <span className="font-mono font-bold text-neutral-800">{t.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipper:</span>
                      <span className="font-semibold text-neutral-800 truncate max-w-[140px]">{t.customerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-neutral-500 bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#EBEAE5]">
                      <Tag className="w-2.5 h-2.5" />
                      {t.category}
                    </span>
                    <span>{t.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div className="bg-[#FAF9F6] border border-[#E5E4DE] rounded-2xl p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBEAE5]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                In Progress
              </h2>
            </div>
            <span className="text-xs font-mono font-bold bg-white border border-[#E5E4DE] px-2 py-0.5 rounded-lg text-neutral-800">
              {inProgressTickets.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {inProgressTickets.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-400">No active investigations</div>
            ) : (
              inProgressTickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="bg-white p-4 rounded-xl border border-[#E5E4DE] hover:border-black shadow-xs hover:shadow-sm cursor-pointer transition-all space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-neutral-900 group-hover:underline">
                      {t.id}
                    </span>
                    {getPriorityBadge(t.priority)}
                  </div>

                  <p className="text-xs text-neutral-700 font-medium line-clamp-2">
                    {t.shortDescription}
                  </p>

                  <div className="pt-1 text-[11px] text-neutral-500 space-y-0.5 border-t border-[#F2F1EC]">
                    <div className="flex justify-between">
                      <span>Booking:</span>
                      <span className="font-mono font-bold text-neutral-800">{t.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fleet:</span>
                      <span className="font-semibold text-neutral-800 truncate max-w-[140px]">{t.fleetOperator}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-neutral-500 bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#EBEAE5]">
                      <Tag className="w-2.5 h-2.5" />
                      {t.category}
                    </span>
                    <span className="text-blue-600 font-bold">{t.notes.length} notes</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: RESOLVED */}
        <div className="bg-[#FAF9F6] border border-[#E5E4DE] rounded-2xl p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBEAE5]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Resolved & Closed
              </h2>
            </div>
            <span className="text-xs font-mono font-bold bg-white border border-[#E5E4DE] px-2 py-0.5 rounded-lg text-neutral-800">
              {resolvedTickets.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {resolvedTickets.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-400">No resolved disputes</div>
            ) : (
              resolvedTickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="bg-white p-4 rounded-xl border border-[#E5E4DE] hover:border-black shadow-xs hover:shadow-sm cursor-pointer transition-all space-y-2.5 group opacity-85 hover:opacity-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-neutral-900 group-hover:underline">
                      {t.id}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Resolved
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {t.shortDescription}
                  </p>

                  <div className="pt-1 text-[11px] text-neutral-500 space-y-0.5 border-t border-[#F2F1EC]">
                    <div className="flex justify-between">
                      <span>Booking:</span>
                      <span className="font-mono text-neutral-700">{t.bookingId}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400">
                    <span className="font-mono text-neutral-500">{t.category}</span>
                    <span className="text-emerald-600 font-bold">Settled</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Ticket Slide-Over Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? `${selectedTicket.id} · ${selectedTicket.category}` : 'Dispute Dossier'}
        subtitle={selectedTicket ? `Booking Reference: ${selectedTicket.bookingId} · Filed ${selectedTicket.createdAt}` : ''}
      >
        {selectedTicket && (
          <div className="space-y-6 text-xs">
            
            {/* Status & Priority Overview */}
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#111111] text-sm">Dispute Status</div>
                  <div className="text-[11px] text-neutral-500">Current triage lifecycle stage</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedTicket.status === 'resolved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : selectedTicket.status === 'in_progress'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {selectedTicket.status.replace('_', ' ')}
                </span>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#EBEAE5]">
                {selectedTicket.status === 'open' && (
                  <button
                    onClick={() => handleStatusShift(selectedTicket.id, 'in_progress')}
                    className="flex-1 py-2 rounded-xl bg-black text-white font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Move to In Progress</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {selectedTicket.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusShift(selectedTicket.id, 'resolved')}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}

                {selectedTicket.status === 'resolved' && (
                  <button
                    onClick={() => handleStatusShift(selectedTicket.id, 'in_progress')}
                    className="flex-1 py-2 rounded-xl border border-[#E5E4DE] bg-white text-neutral-700 hover:text-black hover:border-black font-bold transition-colors"
                  >
                    Re-open for Investigation
                  </button>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Incident Summary
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white text-neutral-800 text-xs leading-relaxed font-medium">
                {selectedTicket.shortDescription}
              </div>
            </div>

            {/* Stakeholders Info */}
            <div className="space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Consignment Parties
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] divide-y divide-[#EBEAE5] space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Shipper / Customer:</span>
                  </span>
                  <span className="font-bold text-neutral-900">{selectedTicket.customerName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Assigned Fleet Operator:</span>
                  </span>
                  <span className="font-bold text-neutral-900">{selectedTicket.fleetOperator}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Booking ID:</span>
                  <span className="font-mono font-bold text-neutral-900">{selectedTicket.bookingId}</span>
                </div>
              </div>
            </div>

            {/* Internal Investigation Notes */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                  Internal Operational Notes ({selectedTicket.notes.length})
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedTicket.notes.length === 0 ? (
                  <div className="p-3 text-center text-neutral-400 border border-dashed border-[#E5E4DE] rounded-xl">
                    No notes recorded yet.
                  </div>
                ) : (
                  selectedTicket.notes.map(note => (
                    <div key={note.id} className="p-3 rounded-xl border border-[#EBEAE5] bg-white space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-neutral-900">{note.author}</span>
                        <span className="text-neutral-400 font-mono">{note.timestamp}</span>
                      </div>
                      <p className="text-neutral-700 text-xs">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Input */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add internal operational note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-[#E5E4DE] bg-[#FAF9F6] text-xs focus:outline-none focus:border-black font-medium"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim() || isSubmittingNote}
                  className="px-3.5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold transition-colors disabled:opacity-40 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
