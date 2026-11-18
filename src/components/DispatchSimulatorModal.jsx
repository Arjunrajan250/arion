import React, { useEffect, useState } from 'react';
import { CheckCircle2, MapPin, RotateCcw, Send, ShieldAlert, X } from 'lucide-react';
import { playAlarm, playBeep, playClick } from '../utils/soundEngine';

const UNITS = [
  { id: 'u1', name: 'Patrol Alpha', type: 'Rapid response vehicle', etaMinutes: 3 },
  { id: 'u2', name: 'SWAT Tactical Team 2', type: 'Heavy armored unit', etaMinutes: 5 },
  { id: 'u3', name: 'Recon Drone Unit 4', type: 'Autonomous aerial drone', etaMinutes: 1 },
  { id: 'u4', name: 'Kilo Marine Interceptor', type: 'High-speed response craft', etaMinutes: 4 },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1018] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="dispatch-title">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-400"><ShieldAlert className="h-5 w-5" /></span>
            <div className="min-w-0"><h2 id="dispatch-title" className="truncate text-sm font-semibold text-white">Tactical unit dispatch</h2><p className="mt-1 truncate text-[10px] text-slate-500">Response coordination simulator</p></div>
          </div>
          <button type="button" onClick={() => { playBeep(); onClose(); }} className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.05] hover:text-white" aria-label="Close dispatch console"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex min-h-0 flex-col gap-5 overflow-y-auto p-4 custom-scrollbar sm:p-5">
          <fieldset disabled={Boolean(deployment)}>
            <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Response unit</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {UNITS.map((unit) => (
                <button
                  type="button"
                  key={unit.id}
                  onClick={() => { setSelectedUnit(unit); playClick(); }}
                  aria-pressed={selectedUnit.id === unit.id}
                  className={`rounded-xl border p-3 text-left transition-colors ${selectedUnit.id === unit.id ? 'border-cyan-400/40 bg-cyan-400/[0.08]' : 'border-white/[0.08] bg-black/10 hover:border-white/20'}`}
                >
                  <span className="block text-xs font-semibold text-slate-100">{unit.name}</span>
                  <span className="mt-1.5 block text-[10px] text-slate-500">{unit.type}</span>
                  <span className="mt-2 block text-[10px] font-medium text-cyan-400">Estimated arrival · {unit.etaMinutes} min</span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Target sector
            <select value={selectedSector} onChange={(event) => setSelectedSector(event.target.value)} disabled={Boolean(deployment)} className="mt-2 w-full rounded-lg border border-white/[0.08] bg-[#111925] px-3 py-2.5 text-xs font-normal normal-case tracking-normal text-slate-200 focus:border-cyan-400/40 focus:outline-none">
              {SECTORS.map((sector) => <option key={sector}>{sector}</option>)}
            </select>
          </label>

          {deployment ? (
            <div className={`rounded-xl border p-4 ${countdown === 0 ? 'border-emerald-400/25 bg-emerald-400/[0.07]' : 'border-cyan-400/20 bg-cyan-400/[0.06]'}`} role="status" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300"><CheckCircle2 className="h-4 w-4" />{deployment.unit.name}</div>
                <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${countdown === 0 ? 'bg-emerald-400/10 text-emerald-300' : 'bg-cyan-400/10 text-cyan-300'}`}>{countdown === 0 ? 'ARRIVED' : 'EN ROUTE'}</span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400"><MapPin className="h-3.5 w-3.5 text-slate-600" />{deployment.sector}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">
                <span className="text-[10px] text-slate-500">{countdown === 0 ? 'Unit ready for assignment' : 'Simulated arrival in'}</span>
                <span className="font-mono text-lg font-semibold tabular-nums text-white">{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</span>
              </div>
            </div>
          ) : (
            <button type="button" onClick={handleDispatch} className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 text-xs font-semibold text-slate-950 hover:bg-cyan-300"><Send className="h-4 w-4" />Confirm tactical dispatch</button>
          )}
          <p className="text-center text-[10px] text-slate-600">Simulation only · No real units are contacted</p>
        </div>

        {deployment && (
          <div className="flex shrink-0 justify-end border-t border-white/[0.07] bg-black/10 px-4 py-3 sm:px-5">
            <button type="button" onClick={handleReset} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"><RotateCcw className="h-3.5 w-3.5" />New dispatch</button>
          </div>
        )}
      </div>
    </div>
  );
}
