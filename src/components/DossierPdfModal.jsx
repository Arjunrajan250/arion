import React from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function DossierPdfModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    playClick();
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md font-sans select-none"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        className="tactical-corner relative w-full max-w-3xl h-[min(780px,calc(100dvh-1rem))] sm:h-[min(780px,calc(100dvh-2rem))] rounded-2xl bg-[#070b14] border border-cyan-400/30 shadow-[0_0_60px_rgba(0,242,254,0.2)] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-preview-title"
      >
        {/* Modal Top Control Bar */}
        <div className="px-5 py-3.5 bg-[#0a0f1d] border-b border-white/[0.08] flex items-center justify-between font-mono shrink-0 print:hidden text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="pdf-preview-title" className="font-tech text-sm sm:text-base font-bold text-white uppercase">
                INTELLIGENCE DOSSIER // PDF PREVIEW
              </h2>
              <p className="text-[10px] text-slate-400">Classification: TOP SECRET // NOFORN // LEVEL 5 SECURITY CLEARANCE</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tech font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => {
                playBeep();
                onClose();
              }}
              aria-label="Close dossier preview"
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable PDF Preview Body */}
        <div id="printable-dossier" className="flex-1 p-5 sm:p-8 bg-[#040810] overflow-y-auto custom-scrollbar font-mono text-slate-100 text-xs flex flex-col gap-6 relative select-text">
          {/* Watermark Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] rotate-[-30deg]">
            <span className="text-8xl font-black tracking-widest text-cyan-400 border-8 border-cyan-400 p-8 rounded-3xl">
              ARION TOP SECRET
            </span>
          </div>

          {/* Dossier Header Block */}
          <div className="flex items-start justify-between border-b-2 border-cyan-400/50 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-bold text-cyan-400 tracking-widest uppercase">
                  DEFENSE INTELLIGENCE AGENCY
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-[9px] text-red-400 font-bold">ORCON / NOFORN</span>
              </div>
              <h1 className="font-tech text-2xl font-black text-white tracking-wider mt-1">
                ARION TACTICAL COMMAND MATRIX
              </h1>
              <p className="text-[11px] text-slate-400">INTELLIGENCE BRIEFING &amp; HIGH-PRIORITY THREAT PROFILE</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Document ID: AR-2026-9902X • Sector Gotham HJ-66</p>
            </div>

            <div className="text-right border-l border-white/[0.08] pl-4">
              <span className="px-2.5 py-1 rounded bg-red-950 text-red-400 border border-red-700 font-bold text-xs uppercase">
                CLEARANCE LV.5
              </span>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">Date: {new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
            </div>
          </div>

          {/* Subject Dossier Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#090e18] border border-white/[0.08]">
            <div className="col-span-1">
              <img
                src="/assets/marcus_thompson.png"
                alt="Marcus Thompson"
                className="w-full max-h-56 sm:h-44 object-cover rounded-xl border border-slate-700 shadow-md"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Target Name:</span>
                <span className="font-tech text-sm font-bold text-white">Marcus Thompson</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Interpol Status:</span>
                <span className="font-bold text-red-400 bg-red-950/80 px-2 py-0.2 rounded border border-red-700/50">
                  ACTIVE RED NOTICE
                </span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Biometric Confidence:</span>
                <span className="font-bold text-emerald-400">96.4% MATCH (17 JOINTS TRACKED)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Primary Sector of Interest:</span>
                <span className="font-bold text-cyan-300">Sector 4 Vault / Substation 4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Response:</span>
                <span className="font-bold text-slate-200">Patrol Alpha · SWAT Team 2</span>
              </div>
            </div>
          </div>

          {/* Incident Timeline Audit Log */}
          <div className="space-y-2">
            <h3 className="text-xs font-tech font-bold text-cyan-300 uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center justify-between">
              <span>Incident Forensic Timeline</span>
              <span className="text-[10px] text-slate-500">3 VERIFIED LOGS</span>
            </h3>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] flex justify-between items-center">
                <span>21:54:19 — Perimeter Alarm Tripped at Substation 4</span>
                <span className="text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">VERIFIED</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] flex justify-between items-center">
                <span>21:40:05 — Encrypted Radio Burst (Freq 440.25 MHz Intercepted)</span>
                <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">DECRYPTED</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] flex justify-between items-center">
                <span>21:10:00 — Vehicle License Plate GTH-8891 Picked Up on CCTV-X5</span>
                <span className="text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">MATCHED</span>
              </div>
            </div>
          </div>

          {/* Simulated Barcode & Official Footer */}
          <div className="mt-auto pt-4 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-slate-500">
            <div>
              <div className="font-bold text-slate-400">AUTHORIZED BY: DEPUTY COMMANDER MITCHELL, R.</div>
              <div>ARION AUTOMATED TACTICAL OS • ALL RIGHTS RESERVED</div>
            </div>
            {/* SVG Barcode Graphic */}
            <div className="flex flex-col items-end">
              <svg className="w-32 h-7 fill-slate-400" viewBox="0 0 100 20">
                <rect x="0" y="0" width="2" height="20" />
                <rect x="4" y="0" width="1" height="20" />
                <rect x="7" y="0" width="3" height="20" />
                <rect x="12" y="0" width="1" height="20" />
                <rect x="15" y="0" width="4" height="20" />
                <rect x="21" y="0" width="2" height="20" />
                <rect x="25" y="0" width="1" height="20" />
                <rect x="28" y="0" width="3" height="20" />
                <rect x="33" y="0" width="2" height="20" />
                <rect x="37" y="0" width="4" height="20" />
                <rect x="43" y="0" width="1" height="20" />
                <rect x="46" y="0" width="2" height="20" />
                <rect x="50" y="0" width="3" height="20" />
                <rect x="55" y="0" width="1" height="20" />
                <rect x="58" y="0" width="4" height="20" />
                <rect x="64" y="0" width="2" height="20" />
                <rect x="68" y="0" width="1" height="20" />
                <rect x="71" y="0" width="3" height="20" />
                <rect x="76" y="0" width="2" height="20" />
                <rect x="80" y="0" width="4" height="20" />
                <rect x="86" y="0" width="2" height="20" />
                <rect x="90" y="0" width="3" height="20" />
                <rect x="95" y="0" width="2" height="20" />
                <rect x="98" y="0" width="2" height="20" />
              </svg>
              <span className="text-[8px] font-mono tracking-widest mt-0.5 text-slate-500">*AR-9021-99X*</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
