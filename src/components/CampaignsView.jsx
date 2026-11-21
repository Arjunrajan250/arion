import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, Plus, ShieldCheck, Target, Users, X } from 'lucide-react';
import { playBeep, playClick } from '../utils/soundEngine';

const DEFAULT_CAMPAIGNS = [
  { id: 'CMP-01', title: 'Operation Night Shield', status: 'IN PROGRESS', progress: 75, commander: 'Alpha Dog', units: '12 active units', threat: 'HIGH', location: 'Northern perimeter' },
  { id: 'CMP-02', title: 'Project Dark Star', status: 'SYNCHRONIZING', progress: 42, commander: 'Bravo Leader', units: '8 active units', threat: 'CRITICAL', location: 'Sector 4 relay' },
  { id: 'CMP-03', title: 'Grid HJ-66 perimeter sweep', status: 'COMPLETED', progress: 100, commander: 'Echo Squad', units: '4 units standby', threat: 'SECURE', location: 'Sector HJ-66' },
  { id: 'CMP-04', title: 'Substation intercept signal', status: 'DEPLOYING', progress: 20, commander: 'Kilo Recon', units: '6 units deploying', threat: 'ELEVATED', location: 'Substation 4' },
];

function loadCampaigns() {
  try {
    const saved = JSON.parse(window.localStorage.getItem('arion-campaigns'));
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_CAMPAIGNS;
  } catch {
    return DEFAULT_CAMPAIGNS;
  }
}

export default function CampaignsView({ onNotify }) {
  const [campaigns, setCampaigns] = useState(loadCampaigns);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showLauncher, setShowLauncher] = useState(false);
  const [form, setForm] = useState({ title: '', commander: '', units: '4', threat: 'ELEVATED', location: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem('arion-campaigns', JSON.stringify(campaigns));
    } catch {
      // Campaigns remain available for the current session.
    }
  }, [campaigns]);

  useEffect(() => {
    if (!showLauncher) return undefined;
    const dialog = document.querySelector('form[role="dialog"]');
    const previousFocus = document.activeElement;
    const selector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowLauncher(false);
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = [...dialog.querySelectorAll(selector)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [showLauncher]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return campaign.status !== 'COMPLETED';
    return campaign.status === 'COMPLETED';
  });

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const handleLaunch = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.commander.trim() || !form.location.trim()) {
      setError('Complete the operation name, commander, and location.');
      return;
    }
    const campaign = {
      id: `CMP-${String(Date.now()).slice(-6)}`,
      title: form.title.trim(),
      commander: form.commander.trim(),
      location: form.location.trim(),
      units: `${form.units} units assigned`,
      threat: form.threat,
      status: 'PLANNING',
      progress: 0,
    };
    setCampaigns((current) => [campaign, ...current]);
    setStatusFilter('ALL');
    setShowLauncher(false);
    setForm({ title: '', commander: '', units: '4', threat: 'ELEVATED', location: '' });
    playBeep();
    onNotify?.(`${campaign.title} was added to the operations timeline.`);
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-4 overflow-y-auto bg-[#05070c] p-3 font-sans text-slate-100 custom-scrollbar sm:p-5 select-none">
      {/* Header Bar */}
      <header className="tactical-corner flex shrink-0 flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.09] bg-gradient-to-r from-[#070e1a] via-[#091322] to-[#070e1a] p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
            <Target className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                JOINT OPERATIONS COMMAND
              </span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-400">
                ACTIVE THEATER
              </span>
            </div>
            <h2 className="font-tech text-base sm:text-xl font-black uppercase tracking-wider text-white">
              TACTICAL CAMPAIGN TIMELINE
            </h2>
            <p className="mt-0.5 font-mono text-xs text-slate-400">
              Coordinate field deployments, tactical squad leads, and real-time operational readiness.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setShowLauncher(true); playClick(); }}
          className="flex min-h-10 items-center gap-2 rounded-xl bg-[var(--theme-accent)] px-4 font-tech text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_var(--theme-glow)] transition-all hover:brightness-110 active:scale-95"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Launch Campaign</span>
        </button>
      </header>

      {/* Stats Summary Grid */}
      <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4 font-mono">
        {[
          { label: 'Total Operations', value: campaigns.length, icon: Target, color: 'text-cyan-300', border: 'border-cyan-500/20', bg: 'bg-cyan-500/5' },
          { label: 'Active Deployments', value: campaigns.filter((c) => c.status !== 'COMPLETED').length, icon: Clock3, color: 'text-amber-300', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
          { label: 'Completed Missions', value: campaigns.filter((c) => c.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
          { label: 'Personnel Readiness', value: '100% ONLINE', icon: Users, color: 'text-violet-300', border: 'border-violet-500/20', bg: 'bg-violet-500/5' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`tactical-corner flex items-center justify-between gap-2 rounded-2xl border ${stat.border} ${stat.bg} p-4 shadow-xl backdrop-blur-md`}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{stat.label}</p>
                <p className={`mt-1 font-tech text-xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
              <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-3 font-mono">
        <div className="flex rounded-xl border border-white/[0.08] bg-[#070b14] p-1" aria-label="Filter campaigns">
          {['ALL', 'ACTIVE', 'COMPLETED'].map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => { setStatusFilter(filter); playClick(); }}
              aria-pressed={statusFilter === filter}
              className={`rounded-lg px-3.5 py-1.5 text-[9px] font-bold uppercase transition-all ${
                statusFilter === filter
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-slate-500 font-semibold">{filteredCampaigns.length} OPERATIONS CATALOGED</span>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        {filteredCampaigns.map((campaign) => (
          <article
            key={campaign.id}
            className="tactical-corner flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#070b14] p-4 sm:p-5 shadow-xl transition-all hover:border-[var(--theme-accent)]/40 hover:bg-[#0a0f1d]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-mono text-[10px] font-bold text-cyan-400">{campaign.id} // CAMPAIGN FILE</span>
                <h3 className="mt-1 font-tech text-base sm:text-lg font-bold text-white">{campaign.title}</h3>
                <p className="mt-0.5 font-mono text-xs text-slate-400">{campaign.location}</p>
              </div>
              <span
                className={`rounded-md border px-2.5 py-1 font-mono text-[9px] font-bold uppercase ${
                  campaign.status === 'COMPLETED'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : campaign.status === 'IN PROGRESS'
                    ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 animate-pulse'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                }`}
              >
                {campaign.status}
              </span>
            </div>

            {/* Mission Readiness Progress Bar */}
            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">MISSION EXECUTION READINESS</span>
                <span className="font-bold text-cyan-300">{campaign.progress}%</span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-white/[0.06]"
                role="progressbar"
                aria-label={`${campaign.title} mission readiness`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={campaign.progress}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    campaign.progress === 100
                      ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                      : 'bg-gradient-to-r from-cyan-500 to-teal-400 shadow-[0_0_10px_#22d3ee]'
                  }`}
                  style={{ width: `${campaign.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 border-t border-white/[0.06] pt-3 font-mono text-[10px] sm:grid-cols-3">
              <div>
                <span className="block text-slate-500 font-semibold">TACTICAL COMMANDER</span>
                <span className="mt-0.5 block font-bold text-slate-200">{campaign.commander}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-semibold">DEPLOYED UNITS</span>
                <span className="mt-0.5 block font-bold text-slate-200">{campaign.units}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-semibold">THREAT LEVEL</span>
                <span className="mt-0.5 block font-bold text-amber-300">{campaign.threat}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Launch Campaign Modal */}
      {showLauncher && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setShowLauncher(false); }}
        >
          <form
            onSubmit={handleLaunch}
            className="tactical-corner w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#090e18] shadow-2xl font-mono text-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="campaign-dialog-title"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/30">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="campaign-dialog-title" className="font-tech text-base font-bold text-white uppercase">
                    LAUNCH TACTICAL CAMPAIGN
                  </h2>
                  <p className="text-[10px] text-slate-400">Configure mission parameters and deploy units.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLauncher(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3.5 p-5 sm:grid-cols-2">
              <label className="text-[11px] font-semibold text-slate-300 sm:col-span-2">
                Operation Name
                <input
                  autoFocus
                  required
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                  placeholder="e.g. Operation Harbor Sentinel"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                />
              </label>

              <label className="text-[11px] font-semibold text-slate-300">
                Squad Commander
                <input
                  required
                  value={form.commander}
                  onChange={(event) => updateForm('commander', event.target.value)}
                  placeholder="e.g. Alpha Lead"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                />
              </label>

              <label className="text-[11px] font-semibold text-slate-300">
                Assigned Units
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={form.units}
                  onChange={(event) => updateForm('units', event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </label>

              <label className="text-[11px] font-semibold text-slate-300">
                Primary Target Sector
                <input
                  required
                  value={form.location}
                  onChange={(event) => updateForm('location', event.target.value)}
                  placeholder="e.g. Sector 4 Vault"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                />
              </label>

              <label className="text-[11px] font-semibold text-slate-300">
                Threat Rating
                <select
                  value={form.threat}
                  onChange={(event) => updateForm('threat', event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0c121e] px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option>ELEVATED</option>
                  <option>HIGH</option>
                  <option>CRITICAL</option>
                  <option>SECURE</option>
                </select>
              </label>

              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300 sm:col-span-2" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-white/[0.08] bg-black/30 px-5 py-3.5">
              <button
                type="button"
                onClick={() => setShowLauncher(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-tech text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Authorize & Deploy</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
