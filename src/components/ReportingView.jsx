import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, Crosshair } from 'lucide-react';
import { playClick } from '../utils/soundEngine';

export default function ReportingView() {
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [selectedCase, setSelectedCase] = useState('case-kingfish');

  const classifiedCases = [
    {
      id: 'case-kingfish',
      title: 'OPERATION KINGFISH // MAKAROV, V. A',
      code: 'FILE #SY3053',
      classification: 'TOP SECRET // CIA MOST WANTED',
      target: 'Makarov, Vladimir A.',
      status: 'CONSIDERED ARMED & EXTREMELY DANGEROUS',
      portrait: '/assets/target_kingfish_portrait.jpg',
      incidentImg: '/assets/cctv_incident_frame.jpg',
      threatScore: 99.8,
      revenueEst: '$250M P.A.',
      lastKnown: 'Unknown Corridor (Red Notice)',
      summary: 'High-value covert syndicate leader orchestrating coordinated mass-transit strikes, bullion seizures, and illegal arms logistics across international waters.'
    },
    {
      id: 'case-alnami',
      title: 'PROJECT SPECTRE // ALNAMI (P-2204-02)',
      code: 'FILE #CY9820',
      classification: 'CRITICAL BIOMETRIC ANOMALY',
      target: 'Alnami (P-2204-02)',
      status: 'SOCIAL SYNC: 1% CRITICAL DESYNC',
      portrait: '/assets/suspect_face_scan.jpg',
      incidentImg: '/assets/cctv_crosswalk_woman.jpg',
      threatScore: 96.4,
      revenueEst: '$14M P.A.',
      lastKnown: 'Crosswalk Alpha // Sector 6',
      summary: 'Optical HUD anomaly subject detected moving across marked intersections with severed biometric sync mesh. Automated pose reconstruction active at 60 FPS.'
    },
    {
      id: 'case-i4c',
      title: 'SYNDICATE PHOENIX // I4C MULE CORRIDOR',
      code: 'INCIDENT #CY-2026-9812',
      classification: 'NATIONAL CYBER FINANCIAL FRAUD',
      target: 'Mule Syndicate Nexus',
      status: '5 DOMESTIC MULE ACCOUNTS FLAGGED',
      portrait: '/assets/suspect_face_scan.jpg',
      incidentImg: '/assets/cyber_crime_command.jpg',
      threatScore: 98.9,
      revenueEst: '₹50,000 CONCURRENT BURSTS',
      lastKnown: 'Offshore TOR Proxy (185.220.101.42)',
      summary: 'Synchronized micro-burst smurfing campaign targeting domestic Indian bank gateways and siphoning funds to US, UK, Singapore, UAE, and HK nodes.'
    }
  ];

  const currentCaseData = classifiedCases.find(c => c.id === selectedCase) || classifiedCases[0];

  const showSuccess = (message) => {
    setDownloadSuccess(message);
    window.setTimeout(() => setDownloadSuccess(''), 4000);
  };

  const handleJsonExport = () => {
    playClick();
    const exportData = {
      ...currentCaseData,
      exportedAt: new Date().toISOString(),
      source: 'ARION Intelligence OS',
      formatVersion: '1.0',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCaseData.id}-intelligence-report.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showSuccess('JSON intelligence report downloaded successfully.');
  };

  const handlePrintExport = () => {
    playClick();
    const reportWindow = window.open('', '_blank', 'width=960,height=720');
    if (!reportWindow) {
      showSuccess('Allow pop-ups to open the printable dossier.');
      return;
    }
    reportWindow.opener = null;
    reportWindow.document.write(`<!doctype html><html><head><title>${currentCaseData.code} — ARION Dossier</title><style>
      body{font-family:Arial,sans-serif;max-width:860px;margin:40px auto;color:#172033;line-height:1.5}header{border-bottom:3px solid #0e7490;padding-bottom:20px;margin-bottom:24px}small{letter-spacing:2px;color:#0e7490}h1{font-size:25px;margin:8px 0}h2{font-size:14px;text-transform:uppercase;letter-spacing:1px;margin-top:28px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px}.meta div,.summary{border:1px solid #dbe2ea;padding:14px;border-radius:6px}.label{font-size:11px;color:#64748b;text-transform:uppercase}.warning{padding:12px;background:#fff1f2;color:#be123c;font-weight:bold}.evidence{max-width:100%;max-height:320px;object-fit:cover;width:100%}footer{margin-top:32px;border-top:1px solid #dbe2ea;padding-top:12px;font-size:11px;color:#64748b}@media print{body{margin:16px}.no-print{display:none}}</style></head><body>
      <header><small>ARION // CLASSIFIED INTELLIGENCE REPORT</small><h1>${currentCaseData.title}</h1><strong>${currentCaseData.code}</strong></header>
      <div class="meta"><div><span class="label">Primary subject</span><br><strong>${currentCaseData.target}</strong></div><div><span class="label">Threat confidence</span><br><strong>${currentCaseData.threatScore}%</strong></div><div><span class="label">Classification</span><br>${currentCaseData.classification}</div><div><span class="label">Estimated revenue</span><br>${currentCaseData.revenueEst}</div></div>
      <p class="warning">${currentCaseData.status}</p><h2>Surveillance evidence</h2><img class="evidence" src="${window.location.origin}${currentCaseData.incidentImg}" alt="Surveillance evidence"><p>${currentCaseData.lastKnown}</p><h2>Intelligence synopsis</h2><p class="summary">${currentCaseData.summary}</p>
      <footer>Generated ${new Date().toLocaleString()} · ARION Intelligence OS · Demonstration data</footer><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),300))</script></body></html>`);
    reportWindow.document.close();
    showSuccess('Print preview opened. Choose “Save as PDF” to export the dossier.');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#05070c] text-slate-100 p-3 sm:p-5 gap-4 overflow-y-auto custom-scrollbar font-sans relative">

      {/* Subtle Warm Amber Glow Arc Backdrop (Reference Image 3) */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[350px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(245, 158, 11, 0.08) 0%, rgba(0, 242, 254, 0.04) 50%, transparent 80%)',
          filter: 'blur(60px)'
        }}
      />

      {/* Header */}
      <div className="tactical-corner w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#070e1a] via-[#091322] to-[#070e1a] border border-white/[0.09] flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xl backdrop-blur-xl font-mono text-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 shadow-[0_0_18px_rgba(0,242,254,0.35)]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-tech text-base sm:text-xl font-black uppercase tracking-wider text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                INTELLIGENCE DOSSIER &amp; AUDIT MATRIX
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-500/50 text-[10px] font-bold text-cyan-300">
                CIA • I4C • INTERPOL RECON
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Automated Forensic Case Compilation • Evidence Telemetry &amp; High-Resolution Reports
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePrintExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tech font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)] cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Print / save PDF</span>
          </button>

          <button
            onClick={handleJsonExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-200 font-bold text-xs transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center justify-between shadow-xl animate-in fade-in shrink-0">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-extrabold text-[10px]">
            EXPORT READY
          </span>
        </div>
      )}

      {/* High-Impact Stat Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 shrink-0 font-mono">
        <div className="tactical-corner p-4 rounded-2xl bg-[#080d18]/90 border border-slate-800 flex flex-col justify-between shadow-xl backdrop-blur-md">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">TOTAL SUSPECT DOSSIERS</div>
          <div className="font-tech text-2xl sm:text-3xl font-black text-white mt-1">32 PROFILES</div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1 font-bold">
            <Crosshair className="w-3 h-3" />
            <span>3 Active Red Notices</span>
          </div>
        </div>

        <div className="tactical-corner p-4 rounded-2xl bg-[#080d18]/90 border border-slate-800 flex flex-col justify-between shadow-xl backdrop-blur-md">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">FACIAL GEOMETRY CONFIDENCE</div>
          <div className="font-tech text-2xl sm:text-3xl font-black text-emerald-400 mt-1">99.2%</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-bold">Zero False Positives</div>
        </div>

        <div className="tactical-corner p-4 rounded-2xl bg-[#080d18]/90 border border-slate-800 flex flex-col justify-between shadow-xl backdrop-blur-md">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">I4C FINANCIAL FRAUD FROZEN</div>
          <div className="font-tech text-2xl sm:text-3xl font-black text-amber-400 mt-1">₹42.8 LAKHS</div>
          <div className="text-[11px] text-amber-400 mt-1 font-bold">5 Mule Chains Severed</div>
        </div>

        <div className="tactical-corner p-4 rounded-2xl bg-[#080d18]/90 border border-slate-800 flex flex-col justify-between shadow-xl backdrop-blur-md">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">AI POSE TELEMETRY NODES</div>
          <div className="font-tech text-2xl sm:text-3xl font-black text-purple-400 mt-1">17 JOINTS</div>
          <div className="text-[11px] text-purple-400 mt-1 font-bold">60 FPS Real-Time Mesh</div>
        </div>
      </div>

      {/* Main Dossier Explorer: Master CIA Most Wanted Dossier View (Reference Images 1, 2, 3) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">

        {/* Left 4 Cols: Case Navigation Cards (Glassmorphism layout like Image 3) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 min-h-0">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800 flex items-center justify-between">
            <span>PRIORITY CLASSIFIED CASES</span>
            <span className="text-[10px] text-cyan-400">LEVEL 5 ACCESS</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
            {classifiedCases.map((c) => {
              const isSelected = selectedCase === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    setSelectedCase(c.id);
                    playClick();
                  }}
                  aria-pressed={isSelected}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all shadow-lg flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#0c1830] to-[#080f1e] border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.25)]'
                      : 'bg-[#080d18] border-slate-800 hover:border-slate-700 hover:bg-[#0c1424]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-extrabold text-amber-400">{c.code}</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-cyan-950 text-cyan-300 border border-cyan-600' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {c.classification}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={c.portrait}
                      alt={c.target}
                      className="w-12 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-white text-xs font-sans truncate">{c.title}</h3>
                      <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">{c.target}</div>
                      <div className="text-[9.5px] text-red-400 font-mono font-bold mt-0.5 truncate">{c.status}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Detailed CIA Case Dossier Viewport (Reference Images 1 & 2 & 4) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#080e1c] border border-slate-800 p-4 sm:p-5 flex flex-col gap-4 shadow-2xl min-h-[420px] overflow-y-auto custom-scrollbar">

          {/* Case Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">{currentCaseData.code}</span>
                <span className="text-slate-500">•</span>
                <span className="text-red-400 font-extrabold">{currentCaseData.classification}</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white font-sans mt-0.5">
                {currentCaseData.title}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400">THREAT CONFIDENCE:</span>
              <div className="text-lg font-black text-cyan-400">{currentCaseData.threatScore}%</div>
            </div>
          </div>

          {/* Dual Inset Display: CCTV Incident Still + Master Portrait */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">

            {/* Surveillance Incident Still */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-md">
              <img
                src={currentCaseData.incidentImg}
                alt="Incident Still"
                className="w-full h-full object-cover filter contrast-125 brightness-95"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 font-mono text-[9px] font-bold text-red-400 border border-slate-800">
                SURVEILLANCE EVIDENCE STILL
              </div>
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/85 font-mono text-[10px] text-slate-200 border border-slate-800 truncate">
                Location: {currentCaseData.lastKnown}
              </div>
            </div>

            {/* Target Profile Dossier Card (Images 1 & 3 Glassmorphism Style) */}
            <div className="p-3.5 rounded-xl bg-[#0b1224] border border-slate-800 font-mono text-xs flex flex-col justify-between shadow-inner">
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Primary Subject:</span>
                  <span className="font-extrabold text-white">{currentCaseData.target}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Estimated Revenue:</span>
                  <span className="font-extrabold text-amber-400">{currentCaseData.revenueEst}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Incident Registry:</span>
                  <span className="font-mono text-slate-200">{currentCaseData.code}</span>
                </div>
              </div>

              {/* Red Hazard Banner */}
              <div className="mt-3 p-2 rounded-lg bg-red-950/80 border border-red-600 text-red-300 font-black text-center text-[10px] tracking-wide uppercase">
                {currentCaseData.status}
              </div>
            </div>

          </div>

          {/* Intelligence Synopsis Narrative */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 font-sans text-xs text-slate-300 space-y-1">
            <span className="font-mono font-bold text-cyan-400 text-[10px] uppercase tracking-wider block">
              TACTICAL INTELLIGENCE SYNOPSIS:
            </span>
            <p className="leading-relaxed">
              {currentCaseData.summary}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
