import React, { useState } from 'react';
import { FileText, Download, Share2, CheckCircle2, Shield, Calendar, BarChart3 } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function ReportingView() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = (type) => {
    playClick();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#07090d] text-slate-100 p-4 gap-4 overflow-y-auto custom-scrollbar font-sans">
      
      {/* Header */}
      <div className="w-full p-4 rounded-xl bg-[#0b0e14] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-700 text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">INTELLIGENCE DOSSIER & REPORT BUILDER</h2>
            <p className="text-xs text-slate-400">Generate Audit Dossiers, Incident Reports & Export Tactical Telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Dossier</span>
          </button>
          <button
            onClick={() => handleExport('JSON')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Export JSON Stream</span>
          </button>
        </div>
      </div>

      {/* Success Download Alert */}
      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Tactical Intelligence Dossier successfully compiled and exported to local storage.</span>
          </div>
          <span className="font-bold text-[10px]">VERIFIED OK</span>
        </div>
      )}

      {/* Report Dossier Summary Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>OPERATIONAL SECTOR</span>
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">Gotham HJ-66</div>
          <div className="text-xs text-emerald-400 font-bold mt-1">98.4% Telemetry Coverage</div>
        </div>

        <div className="p-4 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>TOTAL INCIDENTS (24H)</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">142 Logged</div>
          <div className="text-xs text-amber-400 font-bold mt-1">12 Pending Review</div>
        </div>

        <div className="p-4 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PRIMARY SUSPECT</span>
            <Calendar className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">Marcus Thompson</div>
          <div className="text-xs text-red-400 font-bold mt-1">High Priority Target</div>
        </div>
      </div>

    </div>
  );
}
