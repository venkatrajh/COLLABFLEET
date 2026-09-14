import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  User, 
  Sliders, 
  Save, 
  FileText, 
  Lock
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { adminUser, showToast, setActivePage } = useAdmin();

  // Settings State
  const [dispatchTimeout, setDispatchTimeout] = useState<number>(15);
  const [minMatchThreshold, setMinMatchThreshold] = useState<number>(75);
  const [autoAssignBackhaul, setAutoAssignBackhaul] = useState<boolean>(true);
  const [maxDetourKm, setMaxDetourKm] = useState<number>(25);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Logistics engine and dispatch thresholds successfully updated', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
            System Preferences & Operational Control
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Configure matching rules, dispatch thresholds, and system API connections
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Admin Profile Dossier */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#EBEAE5]">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#111111] uppercase tracking-wider">
              Administrator Profile
            </h2>
            <p className="text-xs text-neutral-500 font-medium">Authenticated operations session</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Name</label>
            <input
              type="text"
              readOnly
              value={adminUser?.name || 'Nakul Venkatesh'}
              className="w-full p-2.5 rounded-xl border border-[#E5E4DE] bg-[#FAF9F6] font-bold text-neutral-800 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Email</label>
            <input
              type="email"
              readOnly
              value={adminUser?.email || 'admin@collabfleet.in'}
              className="w-full p-2.5 rounded-xl border border-[#E5E4DE] bg-[#FAF9F6] font-mono text-neutral-800 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Designated Role</label>
            <input
              type="text"
              readOnly
              value="Super Admin · Chief Operations Officer"
              className="w-full p-2.5 rounded-xl border border-[#E5E4DE] bg-[#FAF9F6] font-semibold text-neutral-800 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Access Scope</label>
            <input
              type="text"
              readOnly
              value="Full National Grid Access (Port 5174)"
              className="w-full p-2.5 rounded-xl border border-[#E5E4DE] bg-[#FAF9F6] font-semibold text-emerald-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Heuristic & Dispatch Engine Thresholds */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#EBEAE5]">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#111111] uppercase tracking-wider">
              Dispatch Engine Parameters
            </h2>
            <p className="text-xs text-neutral-500 font-medium">Fine-tune automated carrier pairing tolerances</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Dispatch Timeout */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-[#111111]">Auto-Dispatch Acceptance Window</div>
                <div className="text-[11px] text-neutral-500">Duration carrier has to accept prior to re-routing match</div>
              </div>
              <span className="font-mono font-bold text-sm bg-white border border-[#E5E4DE] px-3 py-1 rounded-xl">
                {dispatchTimeout} minutes
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={dispatchTimeout}
              onChange={(e) => setDispatchTimeout(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Min Match Score */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-[#111111]">Minimum Composite Match Threshold</div>
                <div className="text-[11px] text-neutral-500">Pairs below this score are withheld from auto-pairing recommendations</div>
              </div>
              <span className="font-mono font-bold text-sm bg-white border border-[#E5E4DE] px-3 py-1 rounded-xl">
                {minMatchThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={minMatchThreshold}
              onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Max Detour */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-[#111111]">Max Highway Detour Allowance</div>
                <div className="text-[11px] text-neutral-500">Tolerance limit for picking up collaborative partial loads</div>
              </div>
              <span className="font-mono font-bold text-sm bg-white border border-[#E5E4DE] px-3 py-1 rounded-xl">
                {maxDetourKm} km
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={maxDetourKm}
              onChange={(e) => setMaxDetourKm(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Backhaul Auto-Match Toggle */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#111111]">Autonomous Return Backhaul Matching</div>
              <div className="text-[11px] text-neutral-500">Search return corridor consignments immediately upon truck dispatch</div>
            </div>
            <button
              onClick={() => setAutoAssignBackhaul(!autoAssignBackhaul)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                autoAssignBackhaul ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoAssignBackhaul ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Operations & Session Tracking */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEAE5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#111111] uppercase tracking-wider">
                Session Tracking & Local Governance
              </h2>
              <p className="text-xs text-neutral-500 font-medium">Administrative activity logs and session configuration</p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('audit')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E4DE] hover:border-black bg-white text-xs font-bold text-neutral-800 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Audit Log</span>
          </button>
        </div>

        <div className="text-xs text-neutral-500 space-y-1">
          <p>• Administrative overrides, KYC approvals, and dispatch threshold adjustments are logged to the Audit Log for operations tracking.</p>
          <p>• System dispatch engine is operating in demonstration mode with localized state persistence.</p>
        </div>
      </div>

    </div>
  );
};
