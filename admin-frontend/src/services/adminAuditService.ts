import { AuditLogEntry } from '../types/adminTypes';

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-508',
    actor: 'Admin (Nakul)',
    action: 'Approved user',
    target: 'USR-1024',
    timestamp: '10:32 AM',
    status: 'Completed',
    details: 'Verified commercial transport permit and identity dossier'
  },
  {
    id: 'AUD-507',
    actor: 'Admin (Nakul)',
    action: 'Flagged match',
    target: 'MT-2048',
    timestamp: '10:41 AM',
    status: 'Flagged',
    details: 'Flagged detour tolerance mismatch for re-calibration'
  },
  {
    id: 'AUD-506',
    actor: 'Admin (Operations)',
    action: 'Resolved dispute',
    target: 'DSP-104',
    timestamp: '11:05 AM',
    status: 'Completed',
    details: 'Reimbursed detention fee after verifying GPS toll timestamps'
  },
  {
    id: 'AUD-505',
    actor: 'Admin (Nakul)',
    action: 'Forced match',
    target: 'MT-1092',
    timestamp: '09:18 AM',
    status: 'Completed',
    details: 'Admin override: expedited urgent auto-component consignment'
  },
  {
    id: 'AUD-504',
    actor: 'Admin (Operations)',
    action: 'Updated dispatch threshold',
    target: 'PAR-882',
    timestamp: 'Yesterday, 17:45',
    status: 'Completed',
    details: 'Adjusted acceptance window from 20m to 15m on NH-48'
  },
  {
    id: 'AUD-503',
    actor: 'Admin (Nakul)',
    action: 'Rejected KYC',
    target: 'USR-1088',
    timestamp: 'Yesterday, 14:10',
    status: 'Completed',
    details: 'Expired commercial driver license; resubmission requested'
  }
];

export class AdminAuditService {
  private static storageKey = 'collabfleet_admin_audit_logs';

  private static getStoredLogs(): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [...INITIAL_AUDIT_LOGS];
  }

  public static async getLogs(): Promise<AuditLogEntry[]> {
    return this.getStoredLogs();
  }

  public static logAction(
    action: string,
    target: string,
    details?: string,
    status: 'Completed' | 'Pending Review' | 'Flagged' = 'Completed'
  ): AuditLogEntry {
    const logs = this.getStoredLogs();
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      actor: 'Admin (You)',
      action,
      target,
      timestamp: `Today, ${timeString}`,
      status,
      details
    };

    const updated = [newEntry, ...logs];
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch {}
    return newEntry;
  }
}
