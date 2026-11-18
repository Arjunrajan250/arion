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
} from 'lucide-react';
import { playBeep } from '../utils/soundEngine';

const METRICS = [
  { label: 'Open incidents', value: '08', detail: '2 critical', icon: BellRing, color: 'text-red-300', iconStyle: 'border-red-400/15 bg-red-400/[0.06] text-red-300' },
  { label: 'Tracked targets', value: '32', detail: '5 priority', icon: Crosshair, color: 'text-cyan-200', iconStyle: 'border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300' },
  { label: 'Active intercepts', value: '12', detail: '4 decoding', icon: Radio, color: 'text-amber-200', iconStyle: 'border-amber-400/15 bg-amber-400/[0.06] text-amber-300' },
  { label: 'Online nodes', value: '32/32', detail: '100% uptime', icon: Signal, color: 'text-emerald-200', iconStyle: 'border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300' },
  { label: 'Field units', value: '14', detail: '6 deployed', icon: ShieldAlert, color: 'text-slate-100', iconStyle: 'border-white/[0.08] bg-white/[0.04] text-slate-300' },
  { label: 'Drone patrols', value: '06', detail: '2 returning', icon: Cpu, color: 'text-violet-200', iconStyle: 'border-violet-400/15 bg-violet-400/[0.06] text-violet-300' },
];

const NEWS = [
  { id: '1', title: 'Quill Herald', location: 'New Bedford', time: '14:32', tag: 'CRITICAL', content: 'Perimeter movement flagged near the western approach. Local response channel is active.' },
  { id: '2', title: 'New Bedford Times', location: 'Harbor district', time: '14:28', tag: 'LOCAL', content: 'Harbor surveillance reported increased marine traffic along the western pier.' },
  { id: '3', title: 'Breton Tribune', location: 'Sector 7 Midtown', time: '14:15', tag: 'INCIDENT', content: 'Power grid spike detected near Substation 4. Technical response unit dispatched.' },
  { id: '4', title: 'New Port Gazette', location: 'East Docks', time: '14:02', tag: 'NOTICE', content: 'Maritime grid reports normal traffic. Automated radar operating at full capacity.' },
  { id: '5', title: 'Gotham Chronicle', location: 'Central Plaza', time: '13:55', tag: 'LOCAL', content: 'Expanded automated camera coverage is now active across the financial district.' },
  { id: '6', title: 'Metro Dispatch Log', location: 'Highway 9 Exit', time: '13:40', tag: 'ALERT', content: 'Vehicle telemetry mismatch flagged on black SUV heading northbound.' },
  { id: '7', title: 'Harbor Patrol', location: 'Pier 12', time: '13:22', tag: 'INCIDENT', content: 'Unidentified frequency intercepted from container vessel 44B. Decryption in progress.' },
];

const RADIO_INTERCEPTS = [
  { freq: '440.25', source: 'Alpha-1', text: 'Perimeter clear at Gate 4. Proceeding to Sector 7.' },
  { freq: '890.10', source: 'Kilo', text: 'Visual contact confirmed. Standing by for intercept.' },
  { freq: '1240.5', source: 'VHF', text: 'Encrypted burst received. Decrypting packet 88-B.' },
];

function PanelHeader({ icon: Icon, title, detail, action }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
        <h2 className="truncate text-[11px] font-semibold text-slate-200">{title}</h2>
      </div>
      {action || <span className="shrink-0 font-mono text-[8px] uppercase tracking-wider text-slate-600">{detail}</span>}
    </div>
  );
}

export default function MetricsOverview() {
  const [activeTab, setActiveTab] = useState('recent');
  const filteredNews = NEWS.filter((item) => {
    if (activeTab === 'recent') return true;
    if (activeTab === 'major') return ['CRITICAL', 'ALERT'].includes(item.tag);
    if (activeTab === 'incidents') return item.tag === 'INCIDENT';
    return item.tag === 'LOCAL';
  });

  return (
    <aside className="flex h-auto w-full shrink-0 flex-col gap-3 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#080c12] p-3 shadow-xl shadow-black/10 custom-scrollbar lg:h-full lg:w-[272px] xl:w-[292px]" aria-label="Operational intelligence summary">
      <div className="flex shrink-0 items-center justify-between px-0.5">
        <div><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">Operations</p><h2 className="mt-1 text-sm font-semibold text-slate-100">Operational pulse</h2></div>
        <span className="flex items-center gap-1.5 rounded-md border border-emerald-400/15 bg-emerald-400/[0.05] px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Live</span>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="group rounded-lg border border-white/[0.07] bg-[#0b1119] p-2.5 transition-colors hover:border-white/[0.13] hover:bg-[#0d141e]">
              <div className="flex items-start justify-between gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-md border ${metric.iconStyle}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" /></span>
                <span className="font-mono text-[8px] text-slate-600">{metric.detail}</span>
              </div>
              <p className={`mt-2.5 font-mono text-lg font-semibold tracking-tight ${metric.color}`}>{metric.value}</p>
              <p className="mt-0.5 text-[9px] text-slate-500">{metric.label}</p>
            </article>
          );
        })}
      </div>

      <section className="shrink-0 rounded-lg border border-white/[0.07] bg-[#0b1119] p-3" aria-label="System telemetry">
        <PanelHeader icon={Activity} title="System telemetry" detail="All systems nominal" />
        <div className="mt-3 space-y-3">
          {[
            { label: 'Processing load', value: '42%', width: '42%', color: 'bg-cyan-400' },
            { label: 'Network capacity', value: '68%', width: '68%', color: 'bg-emerald-400' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-[9px]"><span className="text-slate-500">{item.label}</span><span className="font-mono text-slate-300">{item.value}</span></div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.05]" role="progressbar" aria-label={item.label} aria-valuemin="0" aria-valuemax="100" aria-valuenow={item.value.replace('%', '')}><div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="shrink-0 rounded-lg border border-white/[0.07] bg-[#0b1119] p-3" aria-label="Radio intercepts">
        <PanelHeader icon={Radio} title="Radio intercepts" detail="MHz · Simulated" />
        <div className="mt-2 divide-y divide-white/[0.05]">
          {RADIO_INTERCEPTS.map((intercept) => (
            <div key={intercept.freq} className="py-2 first:pt-1 last:pb-0">
              <div className="flex items-center justify-between gap-2 font-mono text-[8px]"><span className="font-semibold text-amber-300">{intercept.freq} MHz</span><span className="text-slate-600">{intercept.source}</span></div>
              <p className="mt-1 line-clamp-2 text-[9px] leading-relaxed text-slate-400">{intercept.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-[280px] flex-1 flex-col overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b1119]" aria-label="Field intelligence feed">
        <div className="shrink-0 p-3 pb-2"><PanelHeader icon={Newspaper} title="Field intelligence" detail={`${filteredNews.length} updates`} /></div>
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/[0.06] px-3 pb-2.5 no-scrollbar" aria-label="Filter intelligence updates">
          {['recent', 'major', 'incidents', 'local'].map((tab) => (
            <button key={tab} type="button" onClick={() => { setActiveTab(tab); playBeep(); }} aria-pressed={activeTab === tab} className={`shrink-0 rounded-md px-2 py-1 text-[8px] font-medium capitalize transition-colors ${activeTab === tab ? 'bg-white/[0.09] text-slate-200' : 'text-slate-600 hover:text-slate-300'}`}>{tab}</button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 custom-scrollbar">
          {filteredNews.map((item) => (
            <article key={item.id} className="group border-b border-white/[0.05] py-3 last:border-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.tag === 'CRITICAL' || item.tag === 'ALERT' ? 'bg-red-400' : item.tag === 'INCIDENT' ? 'bg-amber-400' : 'bg-cyan-500'}`} /><h3 className="truncate text-[10px] font-medium text-slate-300 group-hover:text-slate-100">{item.title}</h3></div>
                <time className="shrink-0 font-mono text-[8px] text-slate-600">{item.time}</time>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[9px] leading-relaxed text-slate-500">{item.content}</p>
              <div className="mt-1.5 flex items-center justify-between"><span className="text-[8px] text-slate-600">{item.location}</span><ChevronRight className="h-3 w-3 text-slate-700 transition-colors group-hover:text-cyan-500" /></div>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
