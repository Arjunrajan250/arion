import React, { useState } from 'react';
import { Bell, Target, Search, AlertTriangle, Newspaper, Radio, Cpu, Activity, Signal, Zap } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function MetricsOverview() {
  const [activeTab, setActiveTab] = useState('local');

  const metricsData = [
    { label: 'Total Alerts', value: '3,456', color: '#ff556e', icon: Bell, bg: 'bg-red-950/30' },
    { label: 'Felons Detections', value: '6,789', color: '#00f0ff', icon: Target, bg: 'bg-cyan-950/30' },
    { label: 'Anomaly Events', value: '1,789', color: '#a3e635', icon: Search, bg: 'bg-lime-950/30' },
    { label: 'Major Incidents', value: '3,456', color: '#ff3b5c', icon: AlertTriangle, bg: 'bg-red-950/30' },
    { label: 'Active Intercepts', value: '892', color: '#38bdf8', icon: Radio, bg: 'bg-sky-950/30' },
    { label: 'Drone Patrols', value: '14 Active', color: '#c084fc', icon: Cpu, bg: 'bg-purple-950/30' },
  ];

  const newsItems = [
    {
      id: '1',
      title: 'Quill Herald (QH)',
      location: 'New Bedford',
      time: '14:32:10',
      tag: 'CRITICAL',
      content: '"Stay informed with the latest updates from the Quill Herald. Delivering real-time news and in-depth analysis. 📰🌍 #QuillHerald"'
    },
    {
      id: '2',
      title: 'New Bedford Times (NBT)',
      location: 'New Bedford',
      time: '14:28:45',
      tag: 'LOCAL',
      content: '"Harbor surveillance grid reported increased marine traffic along western pier. Secondary patrols deployed."'
    },
    {
      id: '3',
      title: 'Breton Tribune (BT)',
      location: 'Sector 7 Midtown',
      time: '14:15:00',
      tag: 'INCIDENT',
      content: '"Power grid spike detected near Substation 4. Emergency tech response unit dispatched to site."'
    },
    {
      id: '4',
      title: 'New Port Gazette (NPG)',
      location: 'East Docks',
      time: '14:02:30',
      tag: 'NOTICE',
      content: '"Maritime grid reports normal traffic along western harbor line. Automated radar operating at 100% capacity."'
    },
    {
      id: '5',
      title: 'Gotham Chronicle (GC)',
      location: 'Central Plaza',
      time: '13:55:12',
      tag: 'LOCAL',
      content: '"City Council approves expanded automated camera coverage for downtown financial district."'
    },
    {
      id: '6',
      title: 'Metro Dispatch Log',
      location: 'Highway 9 Exit',
      time: '13:40:05',
      tag: 'ALERT',
      content: '"Vehicle telemetry mismatch flagged on black SUV heading northbound. Automated tracking engaged."'
    },
    {
      id: '7',
      title: 'Harbor Patrol Broadcast',
      location: 'Pier 12 Warehouses',
      time: '13:22:40',
      tag: 'INCIDENT',
      content: '"Unidentified frequency transmission intercepted from container vessel 44B. Decryption in progress."'
    },
    {
      id: '8',
      title: 'Cyber Telemetry Bulletin',
      location: 'Mainframe Array 02',
      time: '13:10:19',
      tag: 'SYSTEM',
      content: '"Orbital satellite sync completed with 0.02ms latency. All 32 regional camera feeds online."'
    }
  ];

  const radioIntercepts = [
    { freq: '440.25 MHz', source: 'Unit Alpha-1', text: 'Perimeter check clear at Gate 4. Proceeding to Sector 7.' },
    { freq: '890.10 MHz', source: 'Kilo Recon', text: 'Visual contact confirmed on target vehicle. Standby for intercept.' },
    { freq: '1240.5 MHz', source: 'VHF Encrypted', text: 'Encrypted burst received. Decrypting packet 88-B...' }
  ];

  return (
    <div className="w-[320px] h-full flex flex-col gap-2.5 shrink-0 overflow-y-auto custom-scrollbar select-none bg-[#080a0d] p-3 rounded-2xl border border-slate-800/80 shadow-2xl min-h-0 font-sans">
      
      {/* 2x3 Expanded Metrics Cards Grid */}
      <div className="grid grid-cols-2 gap-2 shrink-0 font-mono">
        {metricsData.map((m, idx) => {
          const IconComp = m.icon;
          return (
            <div 
              key={idx} 
              className="bg-[#0f1115] border border-slate-800/80 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-inner hover:border-slate-700 transition-all cursor-pointer"
              onClick={() => playClick()}
            >
              <div className={`mb-0.5 p-1 rounded-full ${m.bg}`} style={{ color: m.color }}>
                <IconComp className="w-3.5 h-3.5 opacity-90" />
              </div>
              <span className="text-[9px] text-slate-400 font-sans tracking-tight leading-tight">
                {m.label}
              </span>
              <span className="text-base font-extrabold font-mono tracking-tight mt-0.5" style={{ color: m.color }}>
                {m.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* System Telemetry & Signal Status Bar */}
      <div className="p-2 rounded-xl bg-[#0b0e14] border border-slate-800/80 flex flex-col gap-1.5 shrink-0 shadow-inner font-mono text-[10px]">
        <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-800/80 pb-1">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
            <span>TELEMETRY MATRIX</span>
          </div>
          <span className="text-emerald-400 font-extrabold">ONLINE</span>
        </div>

        <div className="space-y-1 pt-0.5">
          <div className="flex justify-between text-slate-300">
            <span>CPU Processing Load:</span>
            <span className="font-bold text-cyan-400">42% • 12 Cores</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div className="h-full bg-cyan-400 rounded-full w-[42%]" />
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Network Bandwidth:</span>
            <span className="font-bold text-emerald-400">1.44 Gbps</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-400 rounded-full w-[68%]" />
          </div>
        </div>
      </div>

      {/* Live Radio Intercepts Log */}
      <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-slate-800/80 flex flex-col gap-1.5 shrink-0 shadow-inner font-mono text-[10px]">
        <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800/80 pb-1">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>RADIO INTERCEPTS</span>
          </div>
          <span className="text-amber-500 font-bold animate-pulse">LIVE FEED</span>
        </div>

        <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 custom-scrollbar">
          {radioIntercepts.map((r, i) => (
            <div key={i} className="p-1.5 rounded bg-slate-900/80 border border-slate-800 flex flex-col gap-0.5">
              <div className="flex justify-between font-bold text-slate-300">
                <span className="text-cyan-400">{r.freq}</span>
                <span className="text-slate-400">{r.source}</span>
              </div>
              <p className="text-[9.5px] text-slate-300 italic font-sans">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable News Container */}
      <div className="flex-1 min-h-[260px] bg-[#0b0d11] border border-slate-800/80 rounded-xl flex flex-col overflow-hidden shadow-xl">
        
        {/* Overview Banner */}
        <div className="bg-gradient-to-r from-[#331a0e] to-[#251209] p-2.5 flex items-center justify-between border-b border-orange-900/40 shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#bd5325] flex items-center justify-center text-white shadow shrink-0">
              <Newspaper className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-sans font-medium text-white">
              Overview <span className="italic text-[#e26e38] font-bold">Gotham HJ 66</span>
            </div>
          </div>
          <span className="text-[9px] text-amber-400 font-bold">8 ARTICLES</span>
        </div>

        {/* News Filter Pills */}
        <div className="bg-[#0e1014] px-2.5 py-1.5 border-b border-slate-800/70 flex items-center gap-1 overflow-x-auto text-[10px] font-sans shrink-0 no-scrollbar">
          {['major', 'local', 'incidents', 'recent'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                playBeep();
              }}
              className={`px-2.5 py-0.5 rounded capitalize shrink-0 font-bold transition-all ${
                activeTab === tab
                  ? 'bg-[#963f1d] text-white shadow'
                  : 'bg-[#14161c] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable News Feed List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-2.5 flex flex-col gap-3 custom-scrollbar">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-1.5 pb-2.5 border-b border-slate-800/60 last:border-0 hover:bg-slate-900/40 p-1.5 rounded transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#18363a] text-[#2dd4bf] flex items-center justify-center shrink-0 border border-[#2dd4bf]/30">
                    <Newspaper className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span className="font-bold text-slate-100 text-xs font-sans">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-400 font-mono">
                      {item.location}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {item.time}
                </span>
              </div>

              <p className="text-[10px] text-slate-300 font-sans leading-relaxed pl-8 italic">
                {item.content}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
