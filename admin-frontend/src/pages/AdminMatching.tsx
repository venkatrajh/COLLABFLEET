import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { StatCard } from '../components/common/StatCard';
import { DataTable, TableColumn } from '../components/common/DataTable';
import { DetailDrawer } from '../components/common/DetailDrawer';
import { AdminMatchingService } from '../services/adminMatchingService';
import { AdminMatchingRecord } from '../types/adminTypes';
import { 
  GitMerge, 
  CheckCircle2, 
  TrendingUp, 
  Compass, 
  ArrowRight, 
  ChevronRight, 
  Cpu,
  Zap,
  Flag
} from 'lucide-react';

export const AdminMatching: React.FC = () => {
  const { showToast } = useAdmin();
  const [matches, setMatches] = useState<AdminMatchingRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedMatch, setSelectedMatch] = useState<AdminMatchingRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const weights = AdminMatchingService.getMatchingWeights();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [records, matchStats] = await Promise.all([
        AdminMatchingService.getMatchRecords(),
        AdminMatchingService.getMatchingStats()
      ]);
      setMatches(records);
      setStats(matchStats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleForceMatch = async (match: AdminMatchingRecord) => {
    const updated = await AdminMatchingService.updateMatchStatus(match.id, 'forced');
    if (updated) {
      setSelectedMatch(updated);
      showToast(`Force Match confirmed for ${match.matchId}. Pair locked for dispatch.`, 'success');
      loadData();
    }
  };

  const handleFlagIncorrect = async (match: AdminMatchingRecord) => {
    const updated = await AdminMatchingService.updateMatchStatus(match.id, 'flagged');
    if (updated) {
      setSelectedMatch(updated);
      showToast(`Match ${match.matchId} flagged for algorithm calibration.`, 'warning');
      loadData();
    }
  };

  const columns: TableColumn<AdminMatchingRecord>[] = [
    {
      header: 'Match ID & Vehicle',
      accessor: (m) => (
        <div>
          <div className="font-mono text-xs font-black text-[#111111]">{m.matchId}</div>
          <div className="text-[11px] text-neutral-600 font-semibold">{m.truckName}</div>
          <div className="font-mono text-[10px] text-neutral-400">{m.registrationNumber}</div>
        </div>
      )
    },
    {
      header: 'Consignment & Route',
      accessor: (m) => (
        <div>
          <div className="font-bold text-neutral-900 truncate max-w-[160px]">{m.cargoType}</div>
          <div className="text-[11px] text-neutral-500 font-medium">{m.weightTons} Tons Payload</div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 pt-0.5">
            <span>{m.origin.city}</span>
            <ArrowRight className="w-2.5 h-2.5" />
            <span>{m.destination.city}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Scores',
      accessor: (m) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-[#111111] bg-[#FAF9F6] border border-[#E5E4DE] px-2 py-0.5 rounded-lg">
              {m.matchScore}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Collab: {m.collaborationScore}%
            </span>
          </div>
        </div>
      )
    },
    {
      header: '6-Factor Breakdown',
      accessor: (m) => (
        <div className="grid grid-cols-3 gap-1.5 text-[10px] w-48 font-mono">
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] p-1 rounded">
            <span className="text-neutral-400">Cap:</span> <strong className="text-black">{m.factors.capacityFitScore}%</strong>
          </div>
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] p-1 rounded">
            <span className="text-neutral-400">Rte:</span> <strong className="text-black">{m.factors.routeMatchScore}%</strong>
          </div>
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] p-1 rounded">
            <span className="text-neutral-400">Prx:</span> <strong className="text-black">{m.factors.proximityScore}%</strong>
          </div>
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] p-1 rounded">
            <span className="text-neutral-400">Ern:</span> <strong className="text-black">{m.factors.earningsScore}%</strong>
          </div>
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] p-1 rounded">
            <span className="text-neutral-400">Rel:</span> <strong className="text-black">{m.factors.reliabilityScore}%</strong>
          </div>
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] p-1 rounded">
            <span className="text-neutral-400">Bkh:</span> <strong className="text-black">{m.factors.returnTripScore}%</strong>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (m) => {
        if (m.status === 'forced') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
              Forced Match
            </span>
          );
        }
        if (m.status === 'flagged') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              Flagged
            </span>
          );
        }
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            m.status === 'accepted'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {m.status === 'accepted' ? 'Accepted' : 'Active Match'}
          </span>
        );
      }
    },
    {
      header: 'Inspection',
      className: 'text-right',
      accessor: (m) => (
        <button
          onClick={() => setSelectedMatch(m)}
          className="p-1.5 rounded-lg border border-[#E5E4DE] bg-white hover:border-black text-neutral-600 hover:text-black transition-colors"
          title="Inspect Match"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
            Matching Monitor & Scoring Rules
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Real-time automated matching engine calculating shipment and truck compatibility across 6 core weights
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Active Pairs Evaluated"
          value={stats?.activeMatchesCount || 42}
          subtext="Fast automated pairing"
          icon={<GitMerge className="w-4 h-4" />}
        />
        <StatCard
          label="Match Success Rate"
          value={`${stats?.successRatePercent || 94.8}%`}
          subtext="Carrier accept rate"
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent="green"
        />
        <StatCard
          label="Mean Match Score"
          value={`${stats?.averageMatchScore || 92.6}%`}
          subtext="Target: >90% precision"
          icon={<TrendingUp className="w-4 h-4" />}
          accent="blue"
        />
        <StatCard
          label="Return Trip Matches"
          value={`${stats?.backhaulMatchesPercent || 78.4}%`}
          subtext="Empty-KM Reduction"
          icon={<Compass className="w-4 h-4" />}
          accent="green"
        />
      </div>

      {/* 6-Factor Algorithm Architecture Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EBEAE5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#111111] uppercase tracking-wider">
                6-Factor Matching Weights (100% Total)
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Automated scoring weights balancing cargo capacity, Route Alignment, Empty-KM Reduction, and carrier earnings
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-600 bg-[#FAF9F6] border border-[#EBEAE5] px-3 py-1 rounded-xl">
            Live Matching Active
          </span>
        </div>

        {/* The 6 Weights Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. Capacity Fit (25%) */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#111111]">1. {weights.capacityFit.label}</span>
              <span className="text-xs font-mono font-black text-neutral-900 bg-white border border-[#E5E4DE] px-2 py-0.5 rounded">
                {weights.capacityFit.weight}%
              </span>
            </div>
            <div className="w-full bg-[#E5E4DE] rounded-full h-2 overflow-hidden">
              <div className="bg-black h-2 rounded-full" style={{ width: `${weights.capacityFit.weight * 4}%` }} />
            </div>
            <p className="text-[11px] text-neutral-500">{weights.capacityFit.description}</p>
          </div>

          {/* 2. Route Match (25%) */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#111111]">2. {weights.routeMatch.label}</span>
              <span className="text-xs font-mono font-black text-neutral-900 bg-white border border-[#E5E4DE] px-2 py-0.5 rounded">
                {weights.routeMatch.weight}%
              </span>
            </div>
            <div className="w-full bg-[#E5E4DE] rounded-full h-2 overflow-hidden">
              <div className="bg-black h-2 rounded-full" style={{ width: `${weights.routeMatch.weight * 4}%` }} />
            </div>
            <p className="text-[11px] text-neutral-500">{weights.routeMatch.description}</p>
          </div>

          {/* 3. Proximity (15%) */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#111111]">3. {weights.proximity.label}</span>
              <span className="text-xs font-mono font-black text-neutral-900 bg-white border border-[#E5E4DE] px-2 py-0.5 rounded">
                {weights.proximity.weight}%
              </span>
            </div>
            <div className="w-full bg-[#E5E4DE] rounded-full h-2 overflow-hidden">
              <div className="bg-black h-2 rounded-full" style={{ width: `${weights.proximity.weight * 4}%` }} />
            </div>
            <p className="text-[11px] text-neutral-500">{weights.proximity.description}</p>
          </div>

          {/* 4. Earnings Yield (10%) */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#111111]">4. {weights.earnings.label}</span>
              <span className="text-xs font-mono font-black text-neutral-900 bg-white border border-[#E5E4DE] px-2 py-0.5 rounded">
                {weights.earnings.weight}%
              </span>
            </div>
            <div className="w-full bg-[#E5E4DE] rounded-full h-2 overflow-hidden">
              <div className="bg-black h-2 rounded-full" style={{ width: `${weights.earnings.weight * 4}%` }} />
            </div>
            <p className="text-[11px] text-neutral-500">{weights.earnings.description}</p>
          </div>

          {/* 5. Reliability (10%) */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#111111]">5. {weights.reliability.label}</span>
              <span className="text-xs font-mono font-black text-neutral-900 bg-white border border-[#E5E4DE] px-2 py-0.5 rounded">
                {weights.reliability.weight}%
              </span>
            </div>
            <div className="w-full bg-[#E5E4DE] rounded-full h-2 overflow-hidden">
              <div className="bg-black h-2 rounded-full" style={{ width: `${weights.reliability.weight * 4}%` }} />
            </div>
            <p className="text-[11px] text-neutral-500">{weights.reliability.description}</p>
          </div>

          {/* 6. Return Trip (15%) */}
          <div className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#111111]">6. {weights.returnTrip.label}</span>
              <span className="text-xs font-mono font-black text-neutral-900 bg-white border border-[#E5E4DE] px-2 py-0.5 rounded">
                {weights.returnTrip.weight}%
              </span>
            </div>
            <div className="w-full bg-[#E5E4DE] rounded-full h-2 overflow-hidden">
              <div className="bg-black h-2 rounded-full" style={{ width: `${weights.returnTrip.weight * 4}%` }} />
            </div>
            <p className="text-[11px] text-neutral-500">{weights.returnTrip.description}</p>
          </div>

        </div>
      </div>

      {/* Live Match Records Table */}
      <DataTable
        columns={columns}
        data={matches}
        keyExtractor={(m) => m.id}
        onRowClick={(m) => setSelectedMatch(m)}
        selectedId={selectedMatch?.id}
        isLoading={isLoading}
        emptyMessage="No match records available."
      />

      {/* Detail Drawer for Match Inspection */}
      <DetailDrawer
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title={selectedMatch ? `Match ${selectedMatch.matchId}` : 'Match Diagnostics'}
        subtitle={selectedMatch ? `${selectedMatch.truckName} ↔ ${selectedMatch.cargoType}` : ''}
      >
        {selectedMatch && (
          <div className="space-y-6 text-xs">
            <div className="p-5 rounded-xl bg-black text-white space-y-3 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 uppercase text-[10px] font-mono tracking-widest font-bold">
                  Composite Match Score
                </span>
                <span className={`font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded ${
                  selectedMatch.status === 'forced'
                    ? 'text-purple-300 bg-purple-900/50'
                    : selectedMatch.status === 'flagged'
                    ? 'text-rose-300 bg-rose-900/50'
                    : selectedMatch.status === 'accepted'
                    ? 'text-emerald-400 bg-emerald-900/30'
                    : 'text-neutral-300 bg-neutral-800'
                }`}>
                  {selectedMatch.status.toUpperCase()}
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {selectedMatch.matchScore}%
              </div>
              <div className="text-xs text-neutral-300 font-medium">
                Collaboration index: <strong>{selectedMatch.collaborationScore}%</strong> · Generated {selectedMatch.createdAt}
              </div>
            </div>

            {/* Operational Override Actions */}
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#111111] text-xs">Administrative Actions</div>
                  <div className="text-[11px] text-neutral-500">Dispatch override or algorithm recalibration</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleForceMatch(selectedMatch)}
                  className="py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>Force Match</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFlagIncorrect(selectedMatch)}
                  className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5 text-rose-600" />
                  <span>Flag Incorrect</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Detailed Factor Analysis
              </div>
              
              <div className="space-y-2.5">
                {[
                  { label: 'Capacity Fit (25% weight)', score: selectedMatch.factors.capacityFitScore },
                  { label: 'Route Match (25% weight)', score: selectedMatch.factors.routeMatchScore },
                  { label: 'Hub Proximity (15% weight)', score: selectedMatch.factors.proximityScore },
                  { label: 'Earnings Yield (10% weight)', score: selectedMatch.factors.earningsScore },
                  { label: 'Carrier Reliability (10% weight)', score: selectedMatch.factors.reliabilityScore },
                  { label: 'Return Trip / Backhaul (15% weight)', score: selectedMatch.factors.returnTripScore }
                ].map((f, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] space-y-1.5">
                    <div className="flex justify-between font-semibold text-neutral-800">
                      <span>{f.label}</span>
                      <span className="font-mono font-black">{f.score}%</span>
                    </div>
                    <div className="w-full bg-[#E5E4DE] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-black h-1.5 rounded-full" style={{ width: `${f.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                Freight Pair Vector
              </div>
              <div className="p-4 rounded-xl border border-[#EBEAE5] bg-white divide-y divide-[#EBEAE5] space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Vehicle Unit:</span>
                  <span className="font-bold text-[#111111]">{selectedMatch.truckName} ({selectedMatch.registrationNumber})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Consignment:</span>
                  <span className="font-bold text-[#111111]">{selectedMatch.cargoType} ({selectedMatch.weightTons}T)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Origin Hub:</span>
                  <span className="font-bold text-[#111111]">{selectedMatch.origin.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Destination Hub:</span>
                  <span className="font-bold text-[#111111]">{selectedMatch.destination.name}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
