import React, { useEffect, useState } from 'react';
import { CheckCircle2, MapPin, RotateCcw, Send, ShieldAlert, X } from 'lucide-react';
import { playAlarm, playBeep, playClick } from '../utils/soundEngine';

const UNITS = [
  { id: 'u1', name: 'Patrol Alpha', type: 'Rapid response vehicle', etaMinutes: 3, badge: 'RAPID' },
  { id: 'u2', name: 'SWAT Tactical Team 2', type: 'Heavy armored assault unit', etaMinutes: 5, badge: 'ASSAULT' },
  { id: 'u3', name: 'Recon Drone Unit 4', type: 'Autonomous aerial drone', etaMinutes: 1, badge: 'AERIAL' },
  { id: 'u4', name: 'Kilo Marine Interceptor', type: 'High-speed intercept craft', etaMinutes: 4, badge: 'MARITIME' },
];
const SECTORS = ['Sector 4 Vault', 'Substation 4', 'Dockyard Pier 12', 'Midtown Express Link'];

export default function DispatchSimulatorModal({ isOpen, onClose }) {
  const [selectedUnit, setSelectedUnit] = useState(UNITS[0]);
  const [selectedSector, setSelectedSector] = useState(SECTORS[0]);
  const [deployment, setDeployment] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!isOpen || !deployment || countdown <= 0) return undefined;
    const timer = window.setInterval(() => setCountdown((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, deployment, countdown]);

  if (!isOpen) return null;

  const handleDispatch = () => {
    playAlarm();
    setDeployment({ unit: selectedUnit, sector: selectedSector });
    setCountdown(selectedUnit.etaMinutes * 60);
  };

  const handleReset = () => {
    playClick();
    setDeployment(null);
    setCountdown(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-4 select-none"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        className="tactical-corner relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#070b14] shadow-2xl font-mono text-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dispatch-title"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 id="dispatch-title" className="font-tech text-base font-bold uppercase tracking-wider text-white">
                TACTICAL UNIT DISPATCH
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-400">Response Coordination &amp; Asset Deployment Console</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { playBeep(); onClose(); }}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white"
            aria-label="Close dispatch console"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-5 custom-scrollbar">
          <fieldset disabled={Boolean(deployment)}>
            <legend className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              SELECT TACTICAL RESPONSE ASSET
            </legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {UNITS.map((unit) => (
                <button
                  type="button"
                  key={unit.id}
                  onClick={() => { setSelectedUnit(unit); playClick(); }}
                  aria-pressed={selectedUnit.id === unit.id}
                  className={`rounded-xl border p-3.5 text-left transition-all ${
                    selectedUnit.id === unit.id
                      ? 'border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'border-white/[0.08] bg-black/30 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tech text-xs font-bold text-white">{unit.name}</span>
                    <span className="rounded bg-black/40 px-1.5 py-0.2 text-[8px] font-bold text-cyan-300 border border-cyan-800/40">
                      {unit.badge}
                    </span>
                  </div>
                  <span className="mt-1 block text-[10px] text-slate-400">{unit.type}</span>
                  <span className="mt-2 block text-[10px] font-bold text-cyan-300">
                    EST. ARRIVAL: {unit.etaMinutes} MIN
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            TARGET SECTOR
            <select
              value={selectedSector}
              onChange={(event) => setSelectedSector(event.target.value)}
              disabled={Boolean(deployment)}
              className="mt-1.5 w-full rounded-xl border border-white/[0.09] bg-[#0c121e] px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              {SECTORS.map((sector) => (
                <option key={sector}>{sector}</option>
              ))}
            </select>
          </label>

          {deployment ? (
            <div
              className={`rounded-xl border p-4 shadow-lg ${
                countdown === 0
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'border-cyan-500/30 bg-cyan-500/10 animate-pulse'
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className={`h-4 w-4 ${countdown === 0 ? 'text-emerald-400' : 'text-cyan-400'}`} />
                  <span>{deployment.unit.name} DEPLOYED</span>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                    countdown === 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-cyan-950 text-cyan-300'
                  }`}
                >
                  {countdown === 0 ? 'ON-SCENE' : 'EN ROUTE'}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-slate-300 text-[11px]">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                <span>Target: {deployment.sector}</span>
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5">
                <span className="text-slate-400 text-[10px]">
                  {countdown === 0 ? 'Unit active on perimeter' : 'Countdown to intercept'}
                </span>
                <span className="font-tech text-2xl font-black tabular-nums text-white">
                  {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDispatch}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 font-tech text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all hover:bg-cyan-300 active:scale-95"
            >
              <Send className="h-4 w-4" />
              <span>CONFIRM TACTICAL DISPATCH</span>
            </button>
          )}

          <p className="text-center text-[10px] text-slate-500">
            Simulated Tactical Engine · Demonstrator Mode
          </p>
        </div>

        {deployment && (
          <div className="flex shrink-0 justify-end border-t border-white/[0.08] bg-black/30 px-5 py-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>New Dispatch</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
