import React, { useState } from 'react';
import {
  Activity,
  BellRing,
  ChevronRight,
  Cpu,
  Crosshair,
  Newspaper,
  Radio,
  ShieldAlert,
  Signal,
  Volume2,
} from 'lucide-react';
import { playBeep } from '../utils/soundEngine';

const METRICS = [
  { label: 'Open incidents', value: '08', detail: '2 critical', trend: '+2 new', icon: BellRing, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' },
  { label: 'Tracked targets', value: '32', detail: '5 priority', trend: 'ACTIVE', icon: Crosshair, color: 'text-cyan-300', border: 'border-cyan-500/20', bg: 'bg-cyan-500/5' },
  { label: 'Active intercepts', value: '12', detail: '4 decoding', trend: 'BURST', icon: Radio, color: 'text-amber-300', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
  { label: 'Online nodes', value: '32/32', detail: '100% uptime', trend: 'NOMINAL', icon: Signal, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
  { label: 'Field units', value: '14', detail: '6 deployed', trend: 'ARMED', icon: ShieldAlert, color: 'text-slate-100', border: 'border-white/10', bg: 'bg-white/5' },
  { label: 'Drone patrols', value: '06', detail: '2 returning', trend: 'AIRBORNE', icon: Cpu, color: 'text-violet-300', border: 'border-violet-500/20', bg: 'bg-violet-500/5' },
];

const NEWS = [
  { id: '1', title: 'Quill Herald', location: 'New Bedford', time: '14:32', tag: 'CRITICAL', content: 'Perimeter movement flagged near western approach. Tactical response dispatched.' },
  { id: '2', title: 'New Bedford Times', location: 'Harbor district', time: '14:28', tag: 'LOCAL', content: 'Harbor surveillance reported increased marine traffic along the western pier.' },
  { id: '3', title: 'Breton Tribune', location: 'Sector 7 Midtown', time: '14:15', tag: 'INCIDENT', content: 'Power grid spike detected near Substation 4. Technical unit analyzing telemetry.' },
  { id: '4', title: 'New Port Gazette', location: 'East Docks', time: '14:02', tag: 'NOTICE', content: 'Maritime radar grid reports normal traffic. Automated sweeps active.' },
  { id: '5', title: 'Gotham Chronicle', location: 'Central Plaza', time: '13:55', tag: 'LOCAL', content: 'Expanded optical camera coverage is now active across financial district.' },
  { id: '6', title: 'Metro Dispatch Log', location: 'Highway 9 Exit', time: '13:40', tag: 'ALERT', content: 'Vehicle telemetry mismatch flagged on black SUV heading northbound.' },
  { id: '7', title: 'Harbor Patrol', location: 'Pier 12', time: '13:22', tag: 'INCIDENT', content: 'Unidentified frequency intercepted from container vessel 44B. Decryption underway.' },
];

const RADIO_INTERCEPTS = [
  { freq: '440.25', source: 'Alpha-1', text: 'Perimeter clear at Gate 4. Proceeding to Sector 7.' },
  { freq: '890.10', source: 'Kilo', text: 'Visual contact confirmed. Standing by for intercept.' },
  { freq: '1240.5', source: 'VHF', text: 'Encrypted burst received. Decrypting packet 88-B.' },
];

function PanelHeader({ icon: Icon, title, detail, action }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-2 font-mono">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--theme-accent)]" aria-hidden="true" />
        <h2 className="truncate font-tech text-xs font-bold uppercase tracking-wider text-slate-200">{title}</h2>
      </div>
      {action || <span className="shrink-0 text-[9px] uppercase tracking-wider text-slate-500 font-bold">{detail}</span>}
    </div>
  );
}

export default function MetricsOverview() {
  const [activeTab, setActiveTab] = useState('recent');
  const [playingFreq, setPlayingFreq] = useState(null);

  const filteredNews = NEWS.filter((item) => {
    if (activeTab === 'recent') return true;
    if (activeTab === 'major') return ['CRITICAL', 'ALERT'].includes(item.tag);
    if (activeTab === 'incidents') return item.tag === 'INCIDENT';
    return item.tag === 'LOCAL';
  });

  const handlePlayIntercept = (freq) => {
    playBeep();
    setPlayingFreq((curr) => (curr === freq ? null : freq));
  };

  return (
    <aside
      className="flex h-auto w-full shrink-0 flex-col gap-3 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#070b12] p-3 shadow-xl shadow-black/20 custom-scrollbar lg:h-full lg:w-[280px] xl:w-[310px]"
      aria-label="Operational intelligence summary"
    >
      {/* Overview Pulse Header */}
      <div className="flex shrink-0 items-center justify-between px-0.5 border-b border-white/[0.06] pb-2.5">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">OPERATIONS PULSE</p>
          <h2 className="mt-0.5 font-tech text-sm font-extrabold uppercase tracking-wide text-white">TELEMETRY MATRIX</h2>
        </div>
        <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE SYNC
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid shrink-0 grid-cols-2 gap-2">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <article
              key={metric.label}
              className={`tactical-corner group rounded-xl border ${metric.border} ${metric.bg} p-2.5 transition-all hover:border-white/20 hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-slate-300">
                  <Icon className={`h-3.5 w-3.5 ${metric.color}`} aria-hidden="true" />
                </span>
                <span className="rounded bg-black/40 px-1 py-0.2 font-mono text-[8px] font-bold text-slate-400">
                  {metric.trend}
                </span>
              </div>
              <p className={`mt-2 font-tech text-xl font-black tracking-tight ${metric.color}`}>{metric.value}</p>
              <p className="mt-0.5 truncate font-mono text-[9px] text-slate-400">{metric.label}</p>
            </article>
          );
        })}
      </div>

      {/* System Telemetry Progress Bars */}
      <section className="shrink-0 rounded-xl border border-white/[0.07] bg-[#090d16] p-3 font-mono" aria-label="System telemetry">
        <PanelHeader icon={Activity} title="CORE SYSTEM LOAD" detail="ALL NOMINAL" />
        <div className="mt-2.5 space-y-2.5">
          {[
            { label: 'Neural Processing Load', value: '42%', width: '42%', color: 'bg-cyan-400' },
            { label: 'Network Satellite Bandwidth', value: '68%', width: '68%', color: 'bg-emerald-400' },
            { label: 'Optical Node Buffer', value: '29%', width: '29%', color: 'bg-amber-400' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-slate-400">{item.label}</span>
                <span className="font-bold text-slate-200">{item.value}</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div className={`h-full rounded-full ${item.color} shadow-sm`} style={{ width: item.width }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Radio Intercepts Ticker */}
      <section className="shrink-0 rounded-xl border border-white/[0.07] bg-[#090d16] p-3 font-mono" aria-label="Radio intercepts">
        <PanelHeader icon={Radio} title="RADIO INTERCEPTS" detail="SIMULATED" />
        <div className="mt-2 divide-y divide-white/[0.06]">
          {RADIO_INTERCEPTS.map((intercept) => {
            const isPlaying = playingFreq === intercept.freq;
            return (
              <div key={intercept.freq} className="py-2 first:pt-1 last:pb-0">
                <div className="flex items-center justify-between gap-2 text-[9px]">
                  <button
                    type="button"
                    onClick={() => handlePlayIntercept(intercept.freq)}
                    className="flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200"
                  >
                    <Volume2 className={`h-3 w-3 ${isPlaying ? 'animate-pulse text-cyan-400' : 'text-slate-500'}`} />
                    <span>{intercept.freq} MHz</span>
                  </button>
                  <span className="rounded bg-black/40 px-1 py-0.2 text-[8px] font-semibold text-slate-400">{intercept.source}</span>
                </div>
                <p className="mt-1 line-clamp-2 font-mono text-[9px] leading-relaxed text-slate-400">{intercept.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Field Intelligence News Feed */}
      <section className="flex min-h-[280px] flex-1 flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#090d16]" aria-label="Field intelligence feed">
        <div className="shrink-0 p-3 pb-2">
          <PanelHeader icon={Newspaper} title="FIELD INTEL WIRE" detail={`${filteredNews.length} reports`} />
        </div>
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/[0.06] px-3 pb-2 no-scrollbar font-mono text-[9px]" aria-label="Filter intelligence updates">
          {['recent', 'major', 'incidents', 'local'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); playBeep(); }}
              aria-pressed={activeTab === tab}
              className={`shrink-0 rounded-lg px-2.5 py-1 font-bold uppercase transition-all ${
                activeTab === tab
                  ? 'bg-[var(--theme-glow)] text-[var(--theme-accent)] border border-[var(--theme-accent)]/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="group rounded-lg border border-white/[0.04] bg-black/20 p-2.5 transition-all hover:border-[var(--theme-accent)]/30 hover:bg-black/40"
            >
              <div className="flex items-center justify-between gap-2 font-mono text-[9px]">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    item.tag === 'CRITICAL' || item.tag === 'ALERT' ? 'bg-red-400 animate-pulse' : item.tag === 'INCIDENT' ? 'bg-amber-400' : 'bg-cyan-400'
                  }`} />
                  <h3 className="truncate font-bold text-slate-200 group-hover:text-white">{item.title}</h3>
                </div>
                <time className="shrink-0 text-slate-500">{item.time}</time>
              </div>
              <p className="mt-1 line-clamp-2 font-mono text-[9px] leading-relaxed text-slate-400">{item.content}</p>
              <div className="mt-1.5 flex items-center justify-between font-mono text-[8px] text-slate-500">
                <span>{item.location}</span>
                <span className="flex items-center gap-0.5 text-[var(--theme-accent)] group-hover:translate-x-0.5 transition-transform">
                  READ <ChevronRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
