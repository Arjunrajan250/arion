import React from 'react';
import { X, ShieldAlert, AlertTriangle, MapPin, Calendar, User, Eye, Tag } from 'lucide-react';

export default function FelonModal({ felon, onClose }) {
  if (!felon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel glass-panel-glow border border-slate-700/80 p-6 shadow-2xl flex flex-col gap-5 overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-white tracking-tight">
              Felon Detection Details
            </span>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-red-950 text-red-400 border border-red-600/50">
              {felon.threat || 'HIGH THREAT'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Mugshot + Metadata */}
        <div className="flex gap-6">
          {/* Mugshot Image */}
          <div className="w-48 h-56 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-xl shrink-0">
            <img
              src={felon.mugshot}
              alt={felon.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dossier Info */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{felon.name}</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Detected: {felon.detectedAt}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {felon.location}
              </p>
            </div>

            {/* Badges Row */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-blue-600 text-white shadow">
                INTERPOL
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-red-600 text-white shadow">
                {felon.warrant || 'ACTIVE WARRANT'}
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40">
                {felon.matchPct || '97% Match'}
              </span>
            </div>

            {/* Personal Information Grid */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80 text-xs">
              <h3 className="text-xs font-semibold text-slate-300">Personal Information</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
                <div><span className="text-slate-500">Date of Birth:</span> {felon.dob}</div>
                <div><span className="text-slate-500">Height:</span> {felon.height}</div>
                <div><span className="text-slate-500">Weight:</span> {felon.weight}</div>
                <div><span className="text-slate-500">Eye Color:</span> {felon.eyes}</div>
                <div><span className="text-slate-500">Hair Color:</span> {felon.hair}</div>
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Last Known Address:</span> {felon.address}
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Distinguishing Marks:</span> {felon.marks}
              </div>
            </div>
          </div>
        </div>

        {/* Current Charges & Convictions */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800 text-xs">
          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-1.5">Current Charges</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {felon.currentCharges?.map((charge, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-red-950/80 text-red-300 border border-red-700/60 font-mono text-[11px]">
                  {charge}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-1.5">Prior Convictions</h3>
            <ul className="list-disc list-inside flex flex-col gap-1 text-slate-400 font-mono text-[11px]">
              {felon.convictions?.map((conv, i) => (
                <li key={i}>
                  <span className="text-slate-200">{conv.title}</span> - {conv.duration}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-1">Location Information</h3>
            <p className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              {felon.address}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
