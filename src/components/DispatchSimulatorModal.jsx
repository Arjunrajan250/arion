import React, { useState, useEffect } from 'react';
import { X, Send, ShieldAlert, CheckCircle2, Clock, Navigation } from 'lucide-react';
import { playClick, playAlarm, playBeep } from '../utils/soundEngine';

export default function DispatchSimulatorModal({ isOpen, onClose }) {
  const [selectedUnit, setSelectedUnit] = useState('Patrol Alpha');
  const [selectedSector, setSelectedSector] = useState('Sector 4 Vault');
  const [isDispatched, setIsDispatched] = useState(false);
  const [countdown, setCountdown] = useState(180);

  const units = [
    { id: 'u1', name: 'Patrol Alpha', type: 'Rapid Response Vehicle', eta: '3 mins' },
    { id: 'u2', name: 'SWAT Tactical Team 2', type: 'Heavy Armored Unit', eta: '5 mins' },
    { id: 'u3', name: 'Recon Drone Unit 4', type: 'Autonomous Aerial Drone', eta: '1 min' },
    { id: 'u4', name: 'Kilo Marine Interceptor', type: 'High-Speed Craft', eta: '4 mins' },
  ];

  const sectors = ['Sector 4 Vault', 'Substation 4', 'Dockyard Pier 12', 'Midtown Express Link'];

  useEffect(() => {
    let timer;
    if (isDispatched && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isDispatched, countdown]);

  if (!isOpen) return null;

  const handleDispatch = () => {
    playAlarm();
    setIsDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#090b10] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.2)] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0b0e14] border-b border-slate-800 flex items-center justify-between font-mono shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950 border border-red-500/50 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">TACTICAL UNIT DISPATCH SIMULATOR</h2>
              <p className="text-xs text-slate-400">Deploy Tactical Response Teams & Recon Drones to Incidents</p>
            </div>
          </div>

          <button
            onClick={() => {
              playBeep();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispatch Options Form */}
        <div className="p-6 bg-[#06080c] flex flex-col gap-4 font-mono text-xs">
          
          {/* Select Unit */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold uppercase text-[10px]">Select Response Unit:</label>
            <div className="grid grid-cols-2 gap-2">
              {units.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSelectedUnit(u.name);
                    playClick();
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    selectedUnit === u.name 
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-extrabold text-sm text-white">{u.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{u.type} • ETA {u.eta}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Select Target Incident Sector */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold uppercase text-[10px]">Target Sector Location:</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-[#0d1017] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status Display or Dispatch Button */}
          {isDispatched ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 flex flex-col gap-2 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>UNIT DISPATCHED: {selectedUnit.toUpperCase()}</span>
                </div>
                <span className="text-xs bg-emerald-900 px-2 py-0.5 rounded text-white">EN ROUTE</span>
              </div>
              <div className="text-xs text-slate-300">
                Target Destination: <span className="font-bold text-white">{selectedSector}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-emerald-800/80">
                <span>ETA Countdown:</span>
                <span className="text-lg font-extrabold text-emerald-400">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleDispatch}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>CONFIRM TACTICAL DISPATCH</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
