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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md font-sans" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-3xl h-[min(760px,calc(100dvh-1rem))] sm:h-[min(760px,calc(100dvh-2rem))] rounded-2xl bg-[#090b10] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.2)] flex flex-col overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="pdf-preview-title">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0b0e14] border-b border-slate-800 flex items-center justify-between font-mono shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950 border border-purple-500/50 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="pdf-preview-title" className="text-sm sm:text-base font-extrabold text-white">INTELLIGENCE DOSSIER · PDF PREVIEW</h2>
              <p className="text-xs text-slate-400">Classification: TOP SECRET // NOFORN // LEVEL 5 CLEARANCE</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow-md"
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
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable PDF Preview Body */}
        <div id="printable-dossier" className="flex-1 p-4 sm:p-8 bg-slate-950 overflow-y-auto custom-scrollbar font-mono text-slate-100 text-xs flex flex-col gap-6 relative">
          
          {/* Watermark Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-30deg]">
            <span className="text-8xl font-black tracking-widest text-cyan-400 border-8 border-cyan-400 p-8 rounded-3xl">
              ARION TOP SECRET
            </span>
          </div>

          {/* Dossier Header Block */}
          <div className="flex items-start justify-between border-b-2 border-cyan-500/60 pb-4">
            <div>
              <h1 className="text-xl font-extrabold text-cyan-400 tracking-wider">ARION TACTICAL COMMAND</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">INTELLIGENCE BRIEFING & THREAT ANALYSIS REPORT</p>
              <p className="text-[10px] text-slate-500">Document ID: AR-2026-9902X • Sector Gotham HJ-66</p>
            </div>
            <div className="text-right border-l border-slate-800 pl-4">
              <span className="px-2.5 py-1 rounded bg-red-950 text-red-400 border border-red-700 font-bold text-xs">
                CLEARANCE LV.5
              </span>
              <p className="text-[10px] text-slate-400 mt-2">Date: {new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
            </div>
          </div>

          {/* Subject Dossier Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0e121a] border border-slate-800">
            <div className="col-span-1">
              <img
                src="/assets/marcus_thompson.png"
                alt="Marcus Thompson"
                className="w-full max-h-56 sm:h-40 object-cover rounded-lg border border-slate-700 shadow-md"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Target Name:</span>
                <span className="font-extrabold text-white">Marcus Thompson</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-red-400">ACTIVE INTERPOL WARRANT</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Threat Assessment:</span>
                <span className="font-bold text-amber-400">HIGH (96% Confidence)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Primary Sector:</span>
                <span className="font-bold text-cyan-400">Gotham Substation 4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Units:</span>
                <span className="font-bold text-emerald-400">Patrol Alpha, SWAT Team 2</span>
              </div>
            </div>
          </div>

          {/* Incident Timeline Log */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
              Incident Audit Timeline
            </h3>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span>21:54:19 — Perimeter Alarm Tripped at Substation 4</span>
                <span className="text-red-400 font-bold">VERIFIED</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span>21:40:05 — Encrypted Radio Burst (Freq 440.25 MHz Intercepted)</span>
                <span className="text-amber-400 font-bold">DECRYPTED</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span>21:10:00 — License Plate GTH-8891 Picked Up on CCTV-X5</span>
                <span className="text-cyan-400 font-bold">LOGGED</span>
              </div>
            </div>
          </div>

          {/* Footer Signature Box */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <div>Approved by: Commander Alpha (Clearance 5)</div>
            <div>ARION AUTOMATED TACTICAL ENGINE</div>
          </div>

        </div>

      </div>
    </div>
  );
}
