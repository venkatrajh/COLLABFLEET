import { DisputeTicket } from '../types/adminTypes';
import { AdminAuditService } from './adminAuditService';

const INITIAL_DISPUTES: DisputeTicket[] = [
  {
    id: 'DSP-104',
    bookingId: 'CF-48291',
    customerName: 'Apex Technologies',
    fleetOperator: 'Swamy Inter-State Carriers',
    category: 'Delivery delay',
    shortDescription: 'Line-haul transit delayed by 3.5 hours due to highway lane closure on NH48.',
    priority: 'high',
    createdAt: 'Today, 09:30',
    status: 'open',
    notes: [
      {
        id: 'n1',
        author: 'Dispatch Officer',
        text: 'Driver confirmed detour around Ranipet. ETA updated on live map.',
        timestamp: 'Today, 09:45'
      }
    ]
  },
  {
    id: 'DSP-103',
    bookingId: 'CF-39120',
    customerName: 'Auto Components Assemblers',
    fleetOperator: 'VRL Collaborative Express',
    category: 'Payment issue',
    shortDescription: 'Discrepancy in toll reimbursement invoice on Sriperumbudur-Hosur run.',
    priority: 'medium',
    createdAt: 'Today, 08:15',
    status: 'open',
    notes: [
      {
        id: 'n2',
        author: 'Admin (Operations)',
        text: 'Requested FASTag transaction log from carrier for cross-validation.',
        timestamp: 'Today, 08:30'
      }
    ]
  },
  {
    id: 'DSP-102',
    bookingId: 'CF-28419',
    customerName: 'FMCG Packaged Goods Co.',
    fleetOperator: 'Western Corridor Carriers',
    category: 'Vehicle issue',
    shortDescription: 'Tailgate latch defect noted during intermediate dock unloading in Pune.',
    priority: 'high',
    createdAt: 'Yesterday, 15:20',
    status: 'in_progress',
    notes: [
      {
        id: 'n3',
        author: 'Maintenance Desk',
        text: 'Secondary hydraulic seal secured. Carrier cleared for final depot run.',
        timestamp: 'Yesterday, 16:40'
      }
    ]
  },
  {
    id: 'DSP-101',
    bookingId: 'CF-67104',
    customerName: 'Pharma Cold Chain',
    fleetOperator: 'Southern Express Logistics',
    category: 'Booking issue',
    shortDescription: 'Shipper requested temperature log verification before releasing escrow payout.',
    priority: 'low',
    createdAt: 'Sep 11, 14:00',
    status: 'resolved',
    notes: [
      {
        id: 'n4',
        author: 'Cold Chain Lead',
        text: 'IoT reefer telemetry validated steady 4°C throughout transit. Escrow cleared.',
        timestamp: 'Sep 11, 16:30'
      }
    ]
  },
  {
    id: 'DSP-100',
    bookingId: 'CF-55102',
    customerName: 'Precision Stampings Ltd',
    fleetOperator: 'Karnataka Bulk Logistics',
    category: 'Matching issue',
    shortDescription: 'Pallet dimensions exceeded standard trailer clearance by 8cm.',
    priority: 'medium',
    createdAt: 'Sep 10, 11:15',
    status: 'resolved',
    notes: [
      {
        id: 'n5',
        author: 'Dispatch Admin',
        text: 'Re-assigned to open-bed high-capacity 28T carrier.',
        timestamp: 'Sep 10, 12:00'
      }
    ]
  }
];

export class AdminSupportService {
  private static storageKey = 'collabfleet_admin_disputes';

  private static getStoredDisputes(): DisputeTicket[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [...INITIAL_DISPUTES];
  }

  public static async getTickets(): Promise<DisputeTicket[]> {
    return this.getStoredDisputes();
  }

  public static async updateTicketStatus(
    id: string,
    newStatus: 'open' | 'in_progress' | 'resolved'
  ): Promise<DisputeTicket | null> {
    const list = this.getStoredDisputes();
    const target = list.find(t => t.id === id);
    if (!target) return null;

    target.status = newStatus;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch {}

    AdminAuditService.logAction(
      `Updated dispute status to ${newStatus.replace('_', ' ').toUpperCase()}`,
      target.id,
      `Booking: ${target.bookingId} · Category: ${target.category}`
    );

    return { ...target };
  }

  public static async addInternalNote(id: string, noteText: string): Promise<DisputeTicket | null> {
    const list = this.getStoredDisputes();
    const target = list.find(t => t.id === id);
    if (!target || !noteText.trim()) return null;

    const newNote = {
      id: `n-${Date.now()}`,
      author: 'Admin (You)',
      text: noteText.trim(),
      timestamp: 'Just now'
    };

    target.notes.push(newNote);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch {}

    AdminAuditService.logAction(
      'Added note to dispute',
      target.id,
      `Note: "${noteText.slice(0, 40)}${noteText.length > 40 ? '...' : ''}"`
    );

    return { ...target };
  }
}
