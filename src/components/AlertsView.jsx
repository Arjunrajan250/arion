import React, { useEffect, useState } from 'react';
import { Activity, BellRing, Check, CheckCircle2, Clock3, Search, Send, ShieldAlert, Siren, Volume2, VolumeX, X } from 'lucide-react';
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
      // Incident state remains available for the current session.
    }
  }, [acknowledgedIds, dispatchedIds]);

  useEffect(() => {
    if (!isSirenActive) return undefined;
    playAlarm();
    const timer = window.setInterval(playAlarm, 900);
    return () => window.clearInterval(timer);
  }, [isSirenActive]);

  const filteredAlerts = ALERTS.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL'
      || (statusFilter === 'OPEN' && !acknowledgedIds.includes(item.id))
      || (statusFilter === 'ACKNOWLEDGED' && acknowledgedIds.includes(item.id));
    const matchesSearch = !query || [item.title, item.location, item.target, item.id].some((value) => value.toLowerCase().includes(query));
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
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto bg-[#06090e] p-3 font-sans text-slate-100 custom-scrollbar sm:p-5">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0b1018] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/[0.08] text-red-400"><ShieldAlert className="h-5 w-5" /></span>
          <div><p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-red-400">Response coordination</p><h2 className="text-base font-semibold text-white sm:text-lg">Incident escalation queue</h2><p className="mt-1 text-xs text-slate-500">Prioritize, acknowledge, and dispatch incoming incidents.</p></div>
        </div>
        <button type="button" onClick={() => { setIsSirenActive(!isSirenActive); playBeep(); }} aria-pressed={isSirenActive} className={`flex min-h-10 items-center gap-2 rounded-lg border px-3.5 text-xs font-semibold transition-colors ${isSirenActive ? 'border-red-400/30 bg-red-400/10 text-red-300' : 'border-white/[0.08] text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}>
          {isSirenActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {isSirenActive ? 'Disable alert tone' : 'Enable alert tone'}
        </button>
      </header>

      <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: 'Critical · unacknowledged', value: criticalOpen, detail: 'Immediate response required', icon: Siren, color: 'text-red-300' },
          { label: 'Open incidents', value: openCount, detail: `${acknowledgedIds.length} acknowledged`, icon: BellRing, color: 'text-amber-300' },
          { label: 'Units dispatched', value: dispatchedIds.length, detail: 'Across regional sectors', icon: Send, color: 'text-cyan-300' },
          { label: 'Average response', value: '1.4 min', detail: 'Within 2 min target', icon: Clock3, color: 'text-emerald-300' },
        ].map((stat) => {
          const Icon = stat.icon;
          return <div key={stat.label} className="rounded-xl border border-white/[0.07] bg-[#0b1018] p-3.5 sm:p-4"><div className="flex items-start justify-between gap-2"><p className="text-[10px] text-slate-500">{stat.label}</p><Icon className="h-4 w-4 shrink-0 text-slate-700" /></div><p className={`mt-2 text-xl font-semibold ${stat.color}`}>{stat.value}</p><p className="mt-1 hidden text-[10px] text-slate-600 sm:block">{stat.detail}</p></div>;
        })}
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#090e16]" aria-label="Incident list">
        <div className="flex shrink-0 flex-col gap-3 border-b border-white/[0.07] p-3 sm:p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" aria-hidden="true" />
            <label htmlFor="incident-search" className="sr-only">Search incidents</label>
            <input id="incident-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search ID, incident, location, or target…" className="w-full rounded-lg border border-white/[0.08] bg-black/20 py-2.5 pl-9 pr-9 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white" aria-label="Clear incident search"><X className="h-3.5 w-3.5" /></button>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-white/[0.07] bg-black/10 p-1" aria-label="Filter incident status">
              {['OPEN', 'ACKNOWLEDGED', 'ALL'].map((status) => (
                <button type="button" key={status} onClick={() => { setStatusFilter(status); playClick(); }} aria-pressed={statusFilter === status} className={`rounded-md px-2.5 py-1.5 text-[9px] font-semibold sm:px-3 ${statusFilter === status ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-500 hover:text-white'}`}>{status === 'ACKNOWLEDGED' ? 'Ack’d' : status.charAt(0) + status.slice(1).toLowerCase()}</button>
              ))}
            </div>
            <label className="sr-only" htmlFor="severity-filter">Filter by severity</label>
            <select id="severity-filter" value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)} className="rounded-lg border border-white/[0.08] bg-[#101722] px-3 py-2 text-[10px] font-medium text-slate-300 focus:border-cyan-400/40 focus:outline-none">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => <option key={severity} value={severity}>{severity === 'ALL' ? 'All severities' : severity}</option>)}
            </select>
          </div>
        </div>

        <div className="hidden shrink-0 grid-cols-[85px_70px_minmax(260px,1fr)_100px_150px_230px] items-center gap-3 border-b border-white/[0.06] bg-black/10 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600 xl:grid">
          <span>Incident</span><span>Time</span><span>Description</span><span>Severity</span><span>Target</span><span className="text-right">Response</span>
        </div>

        <div className="min-h-0 flex-1 divide-y divide-white/[0.06] overflow-y-auto custom-scrollbar">
          {filteredAlerts.length === 0 ? (
            <div className="flex h-full min-h-56 flex-col items-center justify-center p-6 text-center"><CheckCircle2 className="mb-3 h-8 w-8 text-emerald-500/50" /><h3 className="text-sm font-medium text-slate-300">No incidents match this view</h3><p className="mt-1 text-xs text-slate-600">Adjust your filters or return to the complete queue.</p><button type="button" onClick={clearFilters} className="mt-4 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05]">Clear filters</button></div>
          ) : filteredAlerts.map((alert) => {
            const isAcknowledged = acknowledgedIds.includes(alert.id);
            const isDispatched = dispatchedIds.includes(alert.id);
            return (
              <article key={alert.id} className={`grid grid-cols-[1fr_auto] gap-3 p-4 transition-colors xl:grid-cols-[85px_70px_minmax(260px,1fr)_100px_150px_230px] xl:items-center ${isAcknowledged ? 'bg-black/10 opacity-65' : 'hover:bg-white/[0.02]'}`}>
                <div className="flex items-center gap-2"><span className="font-mono text-xs font-semibold text-cyan-400">{alert.id}</span><span className="font-mono text-[10px] text-slate-600 xl:hidden">{alert.timestamp}</span></div>
                <span className={`justify-self-end rounded-md px-2 py-1 text-[9px] font-semibold xl:order-4 xl:justify-self-start ${alert.severity === 'CRITICAL' ? 'bg-red-400/10 text-red-300' : alert.severity === 'HIGH' ? 'bg-amber-400/10 text-amber-300' : alert.severity === 'MEDIUM' ? 'bg-cyan-400/10 text-cyan-300' : 'bg-white/[0.05] text-slate-400'}`}>{alert.severity}</span>
                <time className="hidden font-mono text-[10px] text-slate-500 xl:block">{alert.timestamp}</time>
                <div className="col-span-2 min-w-0 xl:col-span-1 xl:order-3"><h3 className="text-xs font-medium text-slate-100">{alert.title}</h3><p className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500"><Activity className="h-3 w-3" />{alert.location}<span className="text-slate-700">·</span>{alert.sector}<span className="text-slate-700">·</span>Risk {alert.risk}</p></div>
                <p className="col-span-2 truncate text-[11px] text-slate-400 xl:col-span-1 xl:order-5"><span className="mr-2 text-slate-600 xl:hidden">Target:</span>{alert.target}</p>
                <div className="col-span-2 flex items-center gap-2 xl:col-span-1 xl:order-6 xl:justify-end">
                  <button type="button" onClick={() => dispatch(alert.id)} disabled={isDispatched} className={`flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 text-[10px] font-semibold transition-colors xl:flex-none ${isDispatched ? 'border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300' : 'border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300 hover:bg-cyan-400/10'}`}><Send className="h-3 w-3" />{isDispatched ? 'Dispatched' : 'Dispatch'}</button>
                  <button type="button" onClick={() => acknowledge(alert.id)} aria-pressed={isAcknowledged} className={`flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 text-[10px] font-medium transition-colors xl:flex-none ${isAcknowledged ? 'border-white/[0.07] text-slate-500' : 'border-white/10 text-slate-300 hover:bg-white/[0.05]'}`}><Check className="h-3 w-3" />{isAcknowledged ? 'Acknowledged' : 'Acknowledge'}</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
