import React, { useEffect, useState } from 'react';
import {
  X, ShieldAlert, AlertTriangle, Download, Radio, Crosshair, Zap, FileText
} from 'lucide-react';
import { playClick, playBeep, playAlarm } from '../utils/soundEngine';

export default function FelonModal({ felon, onClose }) {
  const [activeTargetId, setActiveTargetId] = useState(felon?.id || 'target-makarov');
  const [actionNotice, setActionNotice] = useState(null);

  // CIA Most Wanted / Modern Warfare Dossier Targets Dataset
  const targets = {
    'target-makarov': {
      id: 'target-makarov',
      codename: 'KINGFISH',
      name: 'MAKAROV, VLADIMIR A.',
      fileNumber: 'FILE #SY3053',
      portrait: '/assets/target_kingfish_portrait.jpg',
      cctvIncident: '/assets/cctv_incident_frame.jpg',
      cctvCamName: 'CCTV_AIRPORT_CAM_7a',
      watermark: 'KF1',
      location: 'UNKNOWN // RED NOTICE',
      hazardWarning: 'CONSIDERED TO BE ARMED AND EXTREMELY DANGEROUS',
      age: '46',
      pob: 'IVANOVO, RUSSIA',
      sex: 'MALE',
      height: "5'8\"",
      weight: '182 POUNDS',
      build: 'STOCKY / ATHLETIC',
      scars: 'NUMEROUS FACIAL / RIGHT JAWLINE SCAR',
      hair: 'DARK BROWN',
      eyes: 'BLUE / GREEN',
      complexion: 'PALE',
      race: 'CAUCASIAN',
      nationality: 'RUSSIAN FEDERATION',
      occupation: 'SYNDICATE COMMANDER',
      ops: {
        trafficking: 'HUMAN • ARMS • DRUG • CYBER',
        revenue: '$250MIL P.A.',
        extortion: '$53 MIL RANSOMS',
        crimes: [
          { title: 'ROB ARMED: MOSCOW BULLION', value: '$1.3M' },
          { title: 'TERMINAL MASS TRANSIT BREACH', value: 'ALPHA PRIORITY' },
          { title: 'HIJACKING: BALTIC SEA FREIGHT', value: '$8.4M CARGO' },
        ]
      }
    },
    'target-alnami': {
      id: 'target-alnami',
      codename: 'SPECTRE-02',
      name: 'ALNAMI (P-2204-02)',
      fileNumber: 'FILE #CY9820',
      portrait: '/assets/suspect_face_scan.jpg',
      cctvIncident: '/assets/cctv_crosswalk_woman.jpg',
      cctvCamName: 'SURVEILLANCE_NODE_06',
      watermark: 'POST-06',
      location: 'CROSSWALK ALPHA // METROPOLITAN SECTOR',
      hazardWarning: 'BIOMETRIC ANOMALY // SOCIAL SYNC DESYNCHRONIZED',
      age: '31',
      pob: 'NEW METROPOLIS',
      sex: 'FEMALE',
      height: "5'7\"",
      weight: '128 POUNDS',
      build: 'SLENDER',
      scars: 'NEURAL INTERFACE TATTOO ON LEFT SHOULDER',
      hair: 'AUBURN / BROWN',
      eyes: 'DARK BROWN',
      complexion: 'FAIR',
      race: 'EAST ASIAN / MIXED',
      nationality: 'METRO CITIZEN',
      occupation: 'UNAUTHORIZED SYNTH OPERATOR',
      ops: {
        trafficking: 'ENCRYPTED DATA • NEURAL MEMORY CHIPS',
        revenue: '$14MIL P.A.',
        extortion: 'ZERO SOCIAL SYNC RATE (1% CRITICAL)',
        crimes: [
          { title: 'SURVEILLANCE EVASION MESH', value: 'FLAGGED' },
          { title: 'UNAUTHORIZED CROSSWALK DESYNC', value: 'INTERCEPT' },
          { title: 'OPTICAL HUD IDENTITY SPOOF', value: 'CONFIRMED' },
        ]
      }
    },
    'target-elena': {
      id: 'target-elena',
      codename: 'VIPER-9A',
      name: 'ELENA ROSTOVA',
      fileNumber: 'FILE #INT-4783',
      portrait: '/assets/suspect_face_scan.jpg',
      cctvIncident: '/assets/cctv_dome_junction.jpg',
      cctvCamName: 'PTZ_DOME_4th_MAIN',
      watermark: '4783-9A',
      location: '4th ST & MAIN JUNCTION',
      hazardWarning: 'ACTIVE CORPORATE SABOTAGE & INFILTRATION',
      age: '38',
      pob: 'ST. PETERSBURG',
      sex: 'FEMALE',
      height: "5'9\"",
      weight: '142 POUNDS',
      build: 'ATHLETIC',
      scars: 'SURGICAL MARK BELOW COLLARBONE',
      hair: 'DARK BROWN',
      eyes: 'HAZEL',
      complexion: 'MEDIUM PALE',
      race: 'CAUCASIAN',
      nationality: 'INTERPOL RED NOTICE',
      occupation: 'COVERT DATA COURIER',
      ops: {
        trafficking: 'CORPORATE SECRETS • ZERO-DAY EXPLOITS',
        revenue: '$85MIL P.A.',
        extortion: 'DEFENSE MAINFRAME COMPROMISE',
        crimes: [
          { title: 'SUBSTATION TELEMETRY EXFILTRATION', value: 'SECTOR 4' },
          { title: 'DOME CAMERA PTZ JAMMING', value: 'INTERCEPT' },
          { title: 'COMMUNICATION INTERCEPT BREACH', value: 'RESOLVED' },
        ]
      }
    }
  };

  const aliases = {
    'target-0': 'target-alnami',
    'target-1': 'target-elena',
  };
  const normalizedName = felon?.name?.toLowerCase() || '';
  const inferredId = targets[felon?.id] ? felon.id
    : aliases[felon?.id] || (normalizedName.includes('alnami') ? 'target-alnami'
      : normalizedName.includes('elena') ? 'target-elena'
        : normalizedName.includes('makarov') ? 'target-makarov' : 'target-custom');

  useEffect(() => {
    setActiveTargetId(inferredId);
    setActionNotice(null);
  }, [inferredId]);

  if (!felon) return null;

  const customTarget = {
    id: 'target-custom',
    codename: felon.category || (felon.id === 'operator-mitchell' ? 'DUTY COMMANDER' : 'PERSON OF INTEREST'),
    name: felon.name || 'UNIDENTIFIED SUBJECT',
    fileNumber: felon.fileNumber || `FILE #${String(felon.id || 'UNREGISTERED').toUpperCase()}`,
    portrait: felon.mugshot || null,
    cctvIncident: felon.cctvIncident || '/assets/city_wireframe.png',
    cctvCamName: felon.cctvCamName || 'SECTOR OVERVIEW',
    watermark: felon.id?.toUpperCase() || 'NO-ID',
    location: felon.location || 'LOCATION NOT RECORDED',
    hazardWarning: felon.hazardWarning || felon.warrant || felon.threat || 'INTELLIGENCE REVIEW REQUIRED',
    age: felon.age || '—',
    pob: felon.pob || '—',
    sex: felon.sex || '—',
    height: felon.height || '—',
    weight: felon.weight || '—',
    build: felon.build || '—',
    scars: felon.marks || '—',
    hair: felon.hair || '—',
    eyes: felon.eyes || '—',
    complexion: felon.complexion || '—',
    race: felon.race || '—',
    nationality: felon.nationality || '—',
    occupation: felon.occupation || (felon.id === 'operator-mitchell' ? 'CHIEF TACTICAL OFFICER' : 'UNDER REVIEW'),
    ops: {
      trafficking: felon.ops?.trafficking || 'NO VERIFIED RECORD',
      revenue: felon.ops?.revenue || '—',
      extortion: felon.ops?.extortion || 'NO VERIFIED RECORD',
      crimes: felon.currentCharges?.map((charge) => ({ title: charge, value: 'REVIEW' }))
        || felon.charges?.map((charge) => ({ title: charge, value: 'FLAGGED' }))
        || [{ title: 'NO VERIFIED INCIDENTS IN THIS RECORD', value: '—' }],
    },
  };

  const activeTarget = activeTargetId === 'target-custom' ? customTarget : targets[activeTargetId] || customTarget;

  const triggerDispatchAction = (actionName) => {
    playAlarm();
    setActionNotice(`Executing: ${actionName} for ${activeTarget.name}. Priority units deployed.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleExport = () => {
    playBeep();
    const blob = new Blob([JSON.stringify(activeTarget, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTarget.id}-dossier.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionNotice(`Encrypted dossier data for ${activeTarget.name} downloaded.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in font-sans" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>

      {/* Main CIA Most Wanted Window Frame */}
      <div className="tactical-corner relative w-full max-w-5xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] rounded-2xl bg-[#070b14]/98 border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.98)] flex flex-col overflow-hidden text-slate-200" role="dialog" aria-modal="true" aria-labelledby="dossier-title">

        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

        {/* Top Header: CIA Most Wanted / Dossier Classified */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#0a0f1d] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 font-mono text-xs">

          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-600/60 text-amber-400 font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-tech text-xs tracking-wider">CIA MOST WANTED</span>
            </div>

            <div className="flex items-center gap-2">
              <span id="dossier-title" className="font-tech font-bold text-white text-xs sm:text-sm">
                {activeTarget.name}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-700 font-extrabold text-[10px]">
                {activeTarget.fileNumber}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-slate-400 text-[9px] uppercase tracking-widest font-mono">
                TOP SECRET // NOFORN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Clearance Status Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
              <span className="text-[10px] text-slate-400 uppercase">CIA MAINFRAME:</span>
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              aria-label="Close dossier"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target Profile Switcher Ribbon */}
        <div className="px-4 sm:px-6 py-2 bg-[#060912] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs shrink-0">
          <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider shrink-0 mr-1">
            DOSSIER PROFILES:
          </span>
          {Object.values(targets).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTargetId(t.id);
                playClick();
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 text-xs ${
                activeTarget.id === t.id
                  ? 'bg-red-950/90 border border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeTarget.id === t.id ? 'bg-red-400 animate-ping' : 'bg-slate-600'}`} />
              <span className="font-tech text-xs">{t.name}</span>
            </button>
          ))}
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="mx-3 sm:mx-6 mt-3 p-2.5 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs font-mono flex items-center justify-between animate-in fade-in shrink-0" role="status" aria-live="polite">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
              <span>{actionNotice}</span>
            </div>
            <span className="text-[10px] font-bold text-amber-400">DISPATCH CONFIRMED</span>
          </div>
        )}

        {/* Content Body: 3-Column Tactical Dossier Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">

          {/* Column 1: Video Surveillance Inset, Portrait & Hazard Warning (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">

            {/* Split Media Box: CCTV Footage Inset + Main Biometric Portrait */}
            <div className="grid grid-cols-2 gap-2.5">

              {/* CCTV Incident Playback Inset */}
              <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-black shadow-lg">
                <img
                  src={activeTarget.cctvIncident}
                  alt="CCTV Incident"
                  className="w-full h-full object-cover filter contrast-125 brightness-90"
                />

                {/* CCTV Watermark & Rec Stamp */}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/85 font-mono text-[8.5px] font-bold text-red-400 flex items-center gap-1 border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>{activeTarget.cctvCamName}</span>
                </div>

                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 font-mono text-[8.5px] font-bold text-white border border-slate-800">
                  {activeTarget.watermark}
                </div>
              </div>

              {/* Main Biometric Mugshot Portrait */}
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-xl">
                {activeTarget.portrait ? (
                  <img
                    src={activeTarget.portrait}
                    alt={activeTarget.name}
                    className="w-full h-full object-cover filter contrast-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-[10px] text-slate-500">
                    NO VERIFIED<br />PORTRAIT
                  </div>
                )}

                {/* Biometric Target Face Crosshair Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-16 h-16 border border-red-500/60 rounded flex items-center justify-center">
                    <Crosshair className="w-6 h-6 text-red-400/80 animate-pulse" />
                  </div>
                </div>

                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/85 font-mono text-[8.5px] font-bold text-cyan-300 border border-slate-800">
                  MAIN PROFILE
                </div>
              </div>

            </div>

            {/* Identification Meta Block */}
            <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 font-mono text-xs space-y-2 shadow-md">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400 text-[11px]">CODENAME:</span>
                <span className="font-tech font-black text-amber-400 tracking-wider text-xs">{activeTarget.codename}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400 text-[11px]">NAME:</span>
                <span className="font-tech font-extrabold text-white text-xs">{activeTarget.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">LOCATION:</span>
                <span className="font-mono font-bold text-red-400 text-[11px]">{activeTarget.location}</span>
              </div>
            </div>

            {/* Glowing Crimson Hazard Box */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-mono font-black text-center text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400 animate-pulse">
              {activeTarget.hazardWarning}
            </div>

          </div>

          {/* Column 2: Classified Physical Spec Sheet (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-red-400 font-black">
                <FileText className="w-4 h-4" />
                <span className="font-tech text-xs tracking-wider">CLASSIFIED PHYSICAL SPECS</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">SEC-5 DEPT</span>
            </div>

            {/* Physical Specs Tabular Grid */}
            <div className="space-y-1 font-mono text-[11px]">
              {[
                { label: 'AGE', value: activeTarget.age },
                { label: 'PLACE OF BIRTH', value: activeTarget.pob },
                { label: 'SEX', value: activeTarget.sex },
                { label: 'HEIGHT', value: activeTarget.height },
                { label: 'WEIGHT', value: activeTarget.weight },
                { label: 'BUILD', value: activeTarget.build },
                { label: 'SCARS & MARKS', value: activeTarget.scars },
                { label: 'HAIR', value: activeTarget.hair },
                { label: 'EYES', value: activeTarget.eyes },
                { label: 'COMPLEXION', value: activeTarget.complexion },
                { label: 'RACE', value: activeTarget.race },
                { label: 'NATIONALITY', value: activeTarget.nationality },
                { label: 'OCCUPATION', value: activeTarget.occupation },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-[#0a1020] border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <span className="text-slate-400 text-[10.5px]">{item.label}</span>
                  <span className="font-extrabold text-white text-[11px] text-right truncate max-w-[160px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Column 3: Criminal Operations Widget & Actions (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3 font-mono text-xs">

            {/* Criminal Ops Floating Card */}
            <div className="tactical-corner p-3.5 rounded-xl bg-[#090e1c] border border-amber-600/50 shadow-xl flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-black border-b border-amber-800/50 pb-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="font-tech text-xs tracking-wider">CRIMINAL OPERATIONS</span>
              </div>

              <div className="space-y-1 text-[10.5px]">
                <div>
                  <span className="text-slate-400">TRAFFICKING: </span>
                  <span className="text-slate-200 font-bold">{activeTarget.ops.trafficking}</span>
                </div>
                <div>
                  <span className="text-slate-400">EST. REVENUE: </span>
                  <span className="text-amber-300 font-black">{activeTarget.ops.revenue}</span>
                </div>
                <div>
                  <span className="text-slate-400">EXTORTION: </span>
                  <span className="text-red-400 font-bold">{activeTarget.ops.extortion}</span>
                </div>
              </div>

              {/* Sparkline Threat Trend SVG */}
              <div className="w-full h-8 pt-1">
                <svg className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    points="0,20 25,12 50,18 75,5 100,14 125,8 150,2 180,10"
                  />
                </svg>
              </div>

              {/* Major Crimes Record */}
              <div className="space-y-1 border-t border-slate-800/80 pt-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">MAJOR RECORD:</span>
                {activeTarget.ops.crimes.map((c, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300 truncate pr-1">{c.title}</span>
                    <span className="font-extrabold text-red-400">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Command Actions */}
            <div className="space-y-2 mt-auto">
              <button
                onClick={() => triggerDispatchAction('Task Force 141 Intercept')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="font-tech text-xs tracking-wider">DISPATCH STRIKE TASK FORCE</span>
              </button>

              <button
                onClick={() => triggerDispatchAction('Interpol Red Notice Broadcast')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-tech text-xs tracking-wider">ISSUE RED NOTICE</span>
              </button>

              <button
                onClick={handleExport}
                className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download dossier JSON</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
