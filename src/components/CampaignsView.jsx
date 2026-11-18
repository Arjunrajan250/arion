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
    <div className="relative flex h-full w-full flex-col gap-4 overflow-y-auto bg-[#06090e] p-3 font-sans text-slate-100 custom-scrollbar sm:p-5">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0b1018] p-4 shadow-lg sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-400">
            <Target className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-500">Joint operations</p>
            <h2 className="text-base font-semibold text-white sm:text-lg">Campaign timeline</h2>
            <p className="mt-1 text-xs text-slate-500">Coordinate deployments, teams, and mission readiness.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setShowLauncher(true); playClick(); }}
          className="flex min-h-10 items-center gap-2 rounded-lg bg-cyan-400 px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New campaign
        </button>
      </header>

      <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total campaigns', value: campaigns.length, icon: Target, color: 'text-cyan-300' },
          { label: 'Active operations', value: campaigns.filter((c) => c.status !== 'COMPLETED').length, icon: Clock3, color: 'text-amber-300' },
          { label: 'Completed', value: campaigns.filter((c) => c.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-emerald-300' },
          { label: 'Personnel deployment', value: 'Online', icon: Users, color: 'text-violet-300' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-[#0b1018] p-3.5">
              <div><p className="text-[10px] text-slate-500">{stat.label}</p><p className={`mt-1 text-lg font-semibold ${stat.color}`}>{stat.value}</p></div>
              <Icon className="h-4 w-4 text-slate-700" aria-hidden="true" />
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex rounded-lg border border-white/[0.07] bg-[#0b1018] p-1" aria-label="Filter campaigns">
          {['ALL', 'ACTIVE', 'COMPLETED'].map((filter) => (
            <button type="button" key={filter} onClick={() => { setStatusFilter(filter); playClick(); }} aria-pressed={statusFilter === filter} className={`rounded-md px-3 py-1.5 text-[10px] font-semibold transition-colors ${statusFilter === filter ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-500 hover:text-slate-200'}`}>
              {filter === 'ALL' ? 'All' : filter === 'ACTIVE' ? 'Active' : 'Completed'}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-slate-600">{filteredCampaigns.length} operations</span>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {filteredCampaigns.map((campaign) => (
          <article key={campaign.id} className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#090e16] p-4 shadow-lg transition-colors hover:border-cyan-400/20 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-mono text-[10px] font-semibold text-cyan-500">{campaign.id}</span>
                <h3 className="mt-1 text-sm font-semibold text-white sm:text-base">{campaign.title}</h3>
                <p className="mt-1 text-[11px] text-slate-500">{campaign.location}</p>
              </div>
              <span className={`rounded-md border px-2 py-1 text-[9px] font-semibold ${
                campaign.status === 'COMPLETED' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                  : campaign.status === 'IN PROGRESS' ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
                    : 'border-amber-400/20 bg-amber-400/10 text-amber-300'
              }`}>{campaign.status}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500"><span>Mission readiness</span><span className="font-mono font-semibold text-cyan-300">{campaign.progress}%</span></div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-label={`${campaign.title} mission readiness`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={campaign.progress}>
                <div className={`h-full rounded-full transition-[width] ${campaign.progress === 100 ? 'bg-emerald-400' : 'bg-cyan-400'}`} style={{ width: `${campaign.progress}` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 border-t border-white/[0.06] pt-3 text-[10px] sm:grid-cols-3">
              <div><span className="block text-slate-600">Commander</span><span className="mt-1 block font-medium text-slate-300">{campaign.commander}</span></div>
              <div><span className="block text-slate-600">Deployment</span><span className="mt-1 block font-medium text-slate-300">{campaign.units}</span></div>
              <div><span className="block text-slate-600">Threat level</span><span className="mt-1 block font-medium text-amber-300">{campaign.threat}</span></div>
            </div>
          </article>
        ))}
      </div>

      {showLauncher && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowLauncher(false); }}>
          <form onSubmit={handleLaunch} className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c121b] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="campaign-dialog-title">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400"><ShieldCheck className="h-4 w-4" /></span>
                <div><h2 id="campaign-dialog-title" className="text-sm font-semibold text-white">Launch a new campaign</h2><p className="mt-1 text-[10px] text-slate-500">Create a coordinated operations plan.</p></div>
              </div>
              <button type="button" onClick={() => setShowLauncher(false)} className="rounded-md p-1.5 text-slate-500 hover:bg-white/[0.05] hover:text-white" aria-label="Close campaign launcher"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-300 sm:col-span-2">Operation name<input autoFocus required value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="e.g. Operation Harbor Watch" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white placeholder:text-slate-700 focus:border-cyan-400/50 focus:outline-none" /></label>
              <label className="text-xs font-medium text-slate-300">Commander<input required value={form.commander} onChange={(event) => updateForm('commander', event.target.value)} placeholder="Assigned lead" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white placeholder:text-slate-700 focus:border-cyan-400/50 focus:outline-none" /></label>
              <label className="text-xs font-medium text-slate-300">Assigned units<input type="number" min="1" max="100" required value={form.units} onChange={(event) => updateForm('units', event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white focus:border-cyan-400/50 focus:outline-none" /></label>
              <label className="text-xs font-medium text-slate-300">Primary location<input required value={form.location} onChange={(event) => updateForm('location', event.target.value)} placeholder="Sector or facility" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white placeholder:text-slate-700 focus:border-cyan-400/50 focus:outline-none" /></label>
              <label className="text-xs font-medium text-slate-300">Threat level<select value={form.threat} onChange={(event) => updateForm('threat', event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#101722] px-3 py-2.5 text-xs text-white focus:border-cyan-400/50 focus:outline-none"><option>ELEVATED</option><option>HIGH</option><option>CRITICAL</option><option>SECURE</option></select></label>
              {error && <p className="rounded-lg border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-xs text-red-300 sm:col-span-2" role="alert">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 border-t border-white/[0.07] bg-black/10 px-5 py-4">
              <button type="button" onClick={() => setShowLauncher(false)} className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:bg-white/[0.05] hover:text-white">Cancel</button>
              <button type="submit" className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300"><Plus className="h-3.5 w-3.5" />Create campaign</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
