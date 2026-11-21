import React, { useEffect, useState } from 'react';
import {
  Activity,
  BellRing,
  Check,
  CheckCircle2,
  Clock3,
  Search,
  Send,
  ShieldAlert,
  Siren,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { playAlarm, playBeep, playClick } from '../utils/soundEngine';

const ALERTS = [
  { id: 'ALT-901', timestamp: '21:56:02', title: 'Unauthorized security perimeter breach', location: 'Sector 4 Vault', severity: 'CRITICAL', target: 'Marcus Thompson', sector: 'Sector 4', risk: '98%' },
  { id: 'ALT-884', timestamp: '21:54:19', title: 'Encrypted radio frequency spike', location: 'Grid HJ-66 relays', severity: 'HIGH', target: 'Dr. Aris Thorne', sector: 'Sector 2', risk: '92%' },
  { id: 'ALT-872', timestamp: '21:50:44', title: 'Vehicle license plate match · GTH-8891', location: 'East Expressway exit 9', severity: 'MEDIUM', target: 'David Richardson', sector: 'Sector 1', risk: '78%' },
  { id: 'ALT-865', timestamp: '21:44:10', title: 'CCTV camera offline warning', location: 'Dockyard pier 12', severity: 'LOW', target: 'Unidentified relay', sector: 'Sector 3', risk: '45%' },
  { id: 'ALT-859', timestamp: '21:38:05', title: 'Satellite telemetry desynchronization', location: 'Orbital node 04', severity: 'HIGH', target: 'System transponder', sector: 'Sector 2', risk: '84%' },
  { id: 'ALT-840', timestamp: '21:30:12', title: 'Biometric access key failure', location: 'Armory level 2', severity: 'CRITICAL', target: 'Unauthorized user', sector: 'Sector 4', risk: '95%' },
  { id: 'ALT-822', timestamp: '21:22:40', title: 'High-frequency microwave jamming', location: 'Substation 4 west', severity: 'HIGH', target: 'Marcus Thompson', sector: 'Sector 4', risk: '89%' },
  { id: 'ALT-810', timestamp: '21:15:00', title: 'Unauthorized drone flight corridor breach', location: 'Skyline sector B', severity: 'MEDIUM', target: 'Recon target', sector: 'Sector 3', risk: '68%' },
];

function loadIncidentState() {
  try {
    const state = JSON.parse(window.localStorage.getItem('arion-incident-state'));
    const validIds = new Set(ALERTS.map((alert) => alert.id));
    return {
      acknowledgedIds: Array.isArray(state?.acknowledgedIds) ? state.acknowledgedIds.filter((id) => validIds.has(id)) : [],
      dispatchedIds: Array.isArray(state?.dispatchedIds) ? state.dispatchedIds.filter((id) => validIds.has(id)) : [],
    };
  } catch {
    return { acknowledgedIds: [], dispatchedIds: [] };
  }
}

export default function AlertsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [{ acknowledgedIds, dispatchedIds }, setIncidentState] = useState(loadIncidentState);
  const [isSirenActive, setIsSirenActive] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem('arion-incident-state', JSON.stringify({ acknowledgedIds, dispatchedIds }));
    } catch {
      // Incident state remains available for current session.
    }
  }, [acknowledgedIds, dispatchedIds]);

  useEffect(() => {
    if (!isSirenActive) return undefined;
    playAlarm();
    const timer = window.setInterval(playAlarm, 1000);
    return () => window.clearInterval(timer);
  }, [isSirenActive]);

  const filteredAlerts = ALERTS.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OPEN' && !acknowledgedIds.includes(item.id)) ||
      (statusFilter === 'ACKNOWLEDGED' && acknowledgedIds.includes(item.id));
    const matchesSearch =
      !query ||
      [item.title, item.location, item.target, item.id].some((value) => value.toLowerCase().includes(query));
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('ALL');
    setStatusFilter('ALL');
  };

  const acknowledge = (id) => {
    playClick();
    setIncidentState((current) => ({
      ...current,
      acknowledgedIds: current.acknowledgedIds.includes(id)
        ? current.acknowledgedIds.filter((item) => item !== id)
        : [...current.acknowledgedIds, id],
    }));
  };

  const dispatch = (id) => {
    playAlarm();
    setIncidentState((current) => ({
      ...current,
      dispatchedIds: current.dispatchedIds.includes(id) ? current.dispatchedIds : [...current.dispatchedIds, id],
    }));
  };

  const criticalOpen = ALERTS.filter((alert) => alert.severity === 'CRITICAL' && !acknowledgedIds.includes(alert.id)).length;
  const openCount = ALERTS.length - acknowledgedIds.length;

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto bg-[#05070c] p-3 font-sans text-slate-100 custom-scrollbar sm:p-5 select-none">
      {/* Header Bar */}
      <header
        className={`tactical-corner flex shrink-0 flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 shadow-2xl backdrop-blur-xl transition-all ${
          isSirenActive
            ? 'border-red-500/60 bg-gradient-to-r from-red-950/40 via-[#0a0f1d] to-red-950/40 shadow-[0_0_35px_rgba(239,68,68,0.3)] animate-pulse'
            : 'border-white/[0.09] bg-gradient-to-r from-[#070e1a] via-[#091322] to-[#070e1a]'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-red-400">
                RESPONSE COORDINATION MATRIX
              </span>
              <span className="rounded bg-red-950 px-1.5 py-0.2 font-mono text-[9px] font-bold text-red-300 border border-red-700">
                DEFCON 2
              </span>
            </div>
            <h2 className="font-tech text-base sm:text-xl font-black uppercase tracking-wider text-white">
              INCIDENT ESCALATION QUEUE
            </h2>
            <p className="mt-0.5 font-mono text-xs text-slate-400">
              Prioritize, acknowledge, and deploy tactical field responses in real time.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsSirenActive(!isSirenActive);
            playBeep();
          }}
          aria-pressed={isSirenActive}
          className={`flex min-h-10 items-center gap-2 rounded-xl border px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
            isSirenActive
              ? 'border-red-500 bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
              : 'border-white/[0.09] bg-white/[0.03] text-slate-300 hover:border-red-400/40 hover:bg-red-400/10 hover:text-white'
          }`}
        >
          {isSirenActive ? <Volume2 className="h-4 w-4 animate-bounce" /> : <VolumeX className="h-4 w-4" />}
          <span>{isSirenActive ? 'DISABLE AUDIO SIREN' : 'ARM AUDIO SIREN'}</span>
        </button>
      </header>

      {/* Incident Metrics Grid */}
      <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4 font-mono">
        {[
          { label: 'Critical · Unacknowledged', value: criticalOpen, detail: 'Immediate deployment needed', icon: Siren, color: 'text-red-400', border: 'border-red-500/25', bg: 'bg-red-500/5' },
          { label: 'Open Incidents in Queue', value: openCount, detail: `${acknowledgedIds.length} acknowledged`, icon: BellRing, color: 'text-amber-300', border: 'border-amber-500/25', bg: 'bg-amber-500/5' },
          { label: 'Tactical Units Dispatched', value: dispatchedIds.length, detail: 'Across regional sectors', icon: Send, color: 'text-cyan-300', border: 'border-cyan-500/25', bg: 'bg-cyan-500/5' },
          { label: 'Average Response Time', value: '1.4 MIN', detail: 'Within 2 min benchmark', icon: Clock3, color: 'text-emerald-400', border: 'border-emerald-500/25', bg: 'bg-emerald-500/5' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`tactical-corner rounded-2xl border ${stat.border} ${stat.bg} p-4 shadow-xl backdrop-blur-md`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{stat.label}</p>
                <Icon className="h-4 w-4 shrink-0 text-slate-500" />
              </div>
              <p className={`mt-2 font-tech text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 hidden text-[10px] text-slate-500 sm:block">{stat.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Incident Search & List Section */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070b14] shadow-2xl" aria-label="Incident list">
        {/* Search & Filter Toolbar */}
        <div className="flex shrink-0 flex-col gap-3 border-b border-white/[0.07] p-3 sm:p-4 xl:flex-row xl:items-center xl:justify-between font-mono">
          <div className="relative w-full xl:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="incident-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search ID, incident, location, or suspect…"
              className="w-full rounded-xl border border-white/[0.09] bg-black/40 py-2.5 pl-9 pr-9 text-xs text-slate-100 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                aria-label="Clear incident search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-white/[0.08] bg-black/40 p-1" aria-label="Filter status">
              {['OPEN', 'ACKNOWLEDGED', 'ALL'].map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => { setStatusFilter(status); playClick(); }}
                  aria-pressed={statusFilter === status}
                  className={`rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all ${
                    statusFilter === status
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status === 'ACKNOWLEDGED' ? 'Acknowledged' : status}
                </button>
              ))}
            </div>

            <select
              id="severity-filter"
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
              className="rounded-xl border border-white/[0.08] bg-[#0c121e] px-3 py-2 text-[10px] font-bold text-slate-300 focus:border-cyan-400 focus:outline-none"
            >
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                <option key={sev} value={sev}>
                  {sev === 'ALL' ? 'ALL SEVERITIES' : sev}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Column Headers (Desktop) */}
        <div className="hidden shrink-0 grid-cols-[90px_80px_minmax(260px,1fr)_100px_160px_220px] items-center gap-3 border-b border-white/[0.06] bg-black/40 px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500 xl:grid">
          <span>INCIDENT ID</span>
          <span>TIME</span>
          <span>DESCRIPTION</span>
          <span>SEVERITY</span>
          <span>SUSPECT</span>
          <span className="text-right">TACTICAL RESPONSE</span>
        </div>

        {/* Incidents Row Items */}
        <div className="min-h-0 flex-1 divide-y divide-white/[0.05] overflow-y-auto custom-scrollbar">
          {filteredAlerts.length === 0 ? (
            <div className="flex h-full min-h-56 flex-col items-center justify-center p-6 text-center font-mono">
              <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-400" />
              <h3 className="font-tech text-base font-bold text-white">NO ACTIVE INCIDENTS MATCH CRITERIA</h3>
              <p className="mt-1 text-xs text-slate-500">All alerts in this view have been resolved or filtered.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isAcknowledged = acknowledgedIds.includes(alert.id);
              const isDispatched = dispatchedIds.includes(alert.id);
              return (
                <article
                  key={alert.id}
                  className={`grid grid-cols-[1fr_auto] gap-3 p-4 transition-all xl:grid-cols-[90px_80px_minmax(260px,1fr)_100px_160px_220px] xl:items-center ${
                    isAcknowledged ? 'bg-black/20 opacity-60' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{alert.id}</span>
                    <span className="font-mono text-[10px] text-slate-500 xl:hidden">{alert.timestamp}</span>
                  </div>

                  <span
                    className={`justify-self-end rounded-md px-2.5 py-1 font-mono text-[9px] font-bold xl:order-4 xl:justify-self-start ${
                      alert.severity === 'CRITICAL'
                        ? 'border border-red-500/40 bg-red-500/15 text-red-300'
                        : alert.severity === 'HIGH'
                        ? 'border border-amber-500/40 bg-amber-500/15 text-amber-300'
                        : alert.severity === 'MEDIUM'
                        ? 'border border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                        : 'border border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    {alert.severity}
                  </span>

                  <time className="hidden font-mono text-[10px] text-slate-400 xl:block">{alert.timestamp}</time>

                  <div className="col-span-2 min-w-0 xl:col-span-1 xl:order-3">
                    <h3 className="font-sans text-xs sm:text-sm font-semibold text-white">{alert.title}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-slate-400">
                      <Activity className="h-3 w-3 text-cyan-400" />
                      <span>{alert.location}</span>
                      <span className="text-slate-600">·</span>
                      <span>{alert.sector}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-amber-400 font-bold">Risk {alert.risk}</span>
                    </p>
                  </div>

                  <p className="col-span-2 truncate font-mono text-xs text-slate-300 xl:col-span-1 xl:order-5">
                    <span className="mr-2 text-slate-500 xl:hidden">Target:</span>
                    <span className="font-semibold">{alert.target}</span>
                  </p>

                  <div className="col-span-2 flex items-center gap-2 xl:col-span-1 xl:order-6 xl:justify-end">
                    <button
                      type="button"
                      onClick={() => dispatch(alert.id)}
                      disabled={isDispatched}
                      className={`flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 font-mono text-[10px] font-bold uppercase transition-all xl:flex-none ${
                        isDispatched
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                      }`}
                    >
                      <Send className="h-3 w-3" />
                      {isDispatched ? 'Dispatched' : 'Dispatch Unit'}
                    </button>

                    <button
                      type="button"
                      onClick={() => acknowledge(alert.id)}
                      aria-pressed={isAcknowledged}
                      className={`flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 font-mono text-[10px] font-semibold transition-all xl:flex-none ${
                        isAcknowledged
                          ? 'border-white/[0.08] text-slate-500'
                          : 'border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      {isAcknowledged ? 'Acknowledged' : 'Acknowledge'}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
