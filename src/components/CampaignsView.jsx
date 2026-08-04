import React from 'react';
import { Target, Shield, CheckCircle2, Clock, Zap, AlertTriangle } from 'lucide-react';
import { playClick } from '../utils/soundEngine';

export default function CampaignsView() {
  const campaigns = [
    { id: 'CMP-01', title: 'Operation Night Shield', status: 'IN PROGRESS', progress: 75, commander: 'Alpha Dog', units: '12 Active Units', threat: 'HIGH' },
    { id: 'CMP-02', title: 'Project Dark Star', status: 'SYNCHRONIZING', progress: 42, commander: 'Bravo Leader', units: '8 Active Units', threat: 'CRITICAL' },
    { id: 'CMP-03', title: 'Grid HJ-66 Perimeter Sweep', status: 'COMPLETED', progress: 100, commander: 'Echo Squad', units: '4 Units Standby', threat: 'SECURE' },
    { id: 'CMP-04', title: 'Substation Intercept Signal', status: 'DEPLOYING', progress: 20, commander: 'Kilo Recon', units: '6 Units Deploying', threat: 'ELEVATED' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#07090d] text-slate-100 p-4 gap-4 overflow-y-auto custom-scrollbar font-sans">
      
      {/* Header */}
      <div className="w-full p-4 rounded-xl bg-[#0b0e14] border border-slate-800 flex items-center justify-between gap-4 shrink-0 shadow-lg font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">ACTIVE OPERATIONS & CAMPAIGNS TIMELINE</h2>
            <p className="text-xs text-slate-400">Tactical Deployments • Unit Telemetry & Mission Milestones</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => playClick()}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow-md font-mono"
          >
            + Launch New Campaign
          </button>
        </div>
      </div>

      {/* Campaigns Timeline List */}
      <div className="grid grid-cols-1 gap-4 font-mono">
        {campaigns.map((cmp) => (
          <div 
            key={cmp.id}
            className="p-4 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col gap-3 shadow-xl hover:border-cyan-500/50 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-cyan-400">{cmp.id}</span>
                <h3 className="text-base font-extrabold text-white">{cmp.title}</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                cmp.status === 'COMPLETED' ? 'bg-emerald-950 border border-emerald-600 text-emerald-300' :
                cmp.status === 'IN PROGRESS' ? 'bg-cyan-950 border border-cyan-500 text-cyan-300' : 'bg-amber-950 border border-amber-500 text-amber-300'
              }`}>
                {cmp.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Mission Completion:</span>
                <span className="font-bold text-cyan-400">{cmp.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#00f2fe] transition-all duration-500" 
                  style={{ width: `${cmp.progress}%` }} 
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
              <div>Commander: <span className="text-slate-200 font-bold">{cmp.commander}</span></div>
              <div>Status: <span className="text-cyan-400 font-bold">{cmp.units}</span></div>
              <div>Threat Level: <span className="text-amber-400 font-bold">{cmp.threat}</span></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
