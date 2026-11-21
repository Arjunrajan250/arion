import React, { useState } from 'react';
import { Camera, Grid, ShieldAlert, Zap, Layers, Camera as CameraIcon } from 'lucide-react';
import { playClick, playBeep, playAlarm } from '../utils/soundEngine';

export default function SurveillanceView({ onSelectFelon, onNotify }) {
  const [viewMode, setViewMode] = useState('focus'); // 'focus' (full HUD) or 'grid' (2x2)
  const [activeCam, setActiveCam] = useState('cam-01');

  // Interactive HUD Layer Toggles
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showObjectTags, setShowObjectTags] = useState(true);
  const [showFaceInset, setShowFaceInset] = useState(true);
  const [showSilhouette, setShowSilhouette] = useState(true);
  const [isThermal, setIsThermal] = useState(false);
  const [showScanlines, setShowScanlines] = useState(true);
  const [isCaptured, setIsCaptured] = useState(false);

  // Cameras Dataset matching Reference Images 1, 2, 3, 4, 5
  const cameras = [
    {
      id: 'cam-01',
      name: 'SURVEILLANCE NODE 06 // CROSSWALK ALPHA',
      location: 'Main St & 5th Ave Crossing',
      target: 'Alnami (P-2204-02)',
      threat: 'CRITICAL ANOMALY',
      image: '/assets/cctv_crosswalk_woman.jpg',
      style: 'cyber-green', // Ref Image 1 & 2
      confidence: 98.4,
      fps: 60,
      iso: 'ISO 640, f/2.8, 1/320s, 35mm',
      socialSync: '1% CRITICAL!!!',
      interactionFreq: 'RARE',
      emotionalOutput: 'NO CONTROL'
    },
    {
      id: 'cam-02',
      name: 'PTZ-OPTIC DOME 04 // 4th ST & MAIN',
      location: '4th St & Main Junction Pedestrian Grid',
      target: 'Elena Rostova (4783-9A)',
      threat: 'CONFIRMED SUBJECT',
      image: '/assets/cctv_dome_junction.jpg',
      style: 'holographic-cyan', // Ref Image 4
      confidence: 96.8,
      fps: 60,
      iso: 'ISO 800, f/3.6, 1/250s, 35mm',
      socialSync: '43% NOMINAL',
      interactionFreq: 'LOW',
      emotionalOutput: 'CONTROLLED'
    },
    {
      id: 'cam-03',
      name: 'CAM#3 // METROPOLITAN CROSSWAY',
      location: 'Midtown Avenue Sector 2 Crosswalk',
      target: 'Multi-Target (Lina 95% • Tim 100%)',
      threat: 'STREET RECON',
      image: '/assets/cctv_street_targets.jpg',
      style: 'vintage-cctv', // Ref Image 3
      confidence: 97.5,
      fps: 30,
      iso: 'ANALOG CRT B&W // 720p',
      socialSync: '78% SYNCHRONIZED',
      interactionFreq: 'MODERATE',
      emotionalOutput: 'OBSERVED'
    },
    {
      id: 'cam-04',
      name: 'I4C SEC-NODE 01 // COMMAND DECK',
      location: 'National Cyber Crime Operations Facility',
      target: 'Syndicate "Phoenix-Net" Monitor',
      threat: 'NATIONAL SECURITY',
      image: '/assets/cyber_crime_command.jpg',
      style: 'command-crimson', // Ref Image 5
      confidence: 99.2,
      fps: 60,
      iso: 'INTERIOR FLIR SENSOR // 4K UHD',
      socialSync: '99% COMMAND SYNC',
      interactionFreq: 'CONTINUOUS',
      emotionalOutput: 'FOCUSED'
    }
  ];

  const currentCam = cameras.find(c => c.id === activeCam) || cameras[0];

  const handleCapture = async () => {
    playBeep();
    setIsCaptured(true);
    try {
      const image = new Image();
      image.src = currentCam.image;
      await image.decode();
      const scale = Math.min(1, 1600 / image.naturalWidth);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale) + 44;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height - 44);
      context.fillStyle = '#05080d';
      context.fillRect(0, canvas.height - 44, canvas.width, 44);
      context.font = '14px monospace';
      context.fillStyle = '#67e8f9';
      context.fillText(`ARION // ${currentCam.name} // ${new Date().toISOString()}`, 16, canvas.height - 17);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
      if (!blob) throw new Error('Snapshot encoding failed');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `arion-${activeCam}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      onNotify?.('Timestamped camera snapshot downloaded.');
    } catch {
      onNotify?.('The snapshot could not be created. Please try again.', 'warning');
    } finally {
      window.setTimeout(() => setIsCaptured(false), 500);
    }
  };

  const handleFlagTarget = () => {
    playAlarm();
    if (onSelectFelon) {
      onSelectFelon({
        name: currentCam.target,
        threat: currentCam.threat,
        location: currentCam.location,
        detectedAt: new Date().toLocaleTimeString(),
        mugshot: '/assets/suspect_face_scan.jpg',
        charges: ['Unauthorized Activity', 'Social Sync Desynchronization', 'High-Risk Profile']
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#05070c] text-slate-100 p-3 sm:p-5 gap-3.5 overflow-y-auto custom-scrollbar font-sans select-none relative">
      {/* Top Header & Tactical Controls */}
      <div className="tactical-corner w-full p-4 rounded-2xl bg-gradient-to-r from-[#070b14] via-[#091122] to-[#070b14] border border-white/[0.09] flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xl backdrop-blur-xl font-mono text-xs">
        {/* Camera Title & Status */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-tech text-base sm:text-lg font-black tracking-wide text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                BIOMETRIC CCTV SURVEILLANCE MATRIX
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 animate-pulse">
                AI POSE &amp; OBJECT TRACKING ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              4 Real-Time Optical Feeds • Automated Gait &amp; Skeleton Mesh Analytics · 3840×2160 UHD @ 60 FPS
            </p>
          </div>
        </div>

        {/* View Mode & Global Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => {
                setViewMode('focus');
                playClick();
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'focus'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Focus HUD
            </button>
            <button
              onClick={() => {
                setViewMode('grid');
                playClick();
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>4-Grid</span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <button
            onClick={handleCapture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-200 font-bold transition-all shadow-sm"
          >
            <CameraIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Snapshot</span>
          </button>

          <button
            onClick={handleFlagTarget}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black tracking-wide transition-all shadow-[0_0_15px_rgba(239,68,68,0.45)] animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>FLAG INCIDENT</span>
          </button>
        </div>
      </div>

      {/* Camera Selection Tab Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs no-scrollbar shrink-0">
        {cameras.map((cam) => {
          const isActive = activeCam === cam.id;
          return (
            <button
              key={cam.id}
              onClick={() => {
                setActiveCam(cam.id);
                playClick();
              }}
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition-all whitespace-nowrap shrink-0 shadow-md ${
                isActive
                  ? 'bg-[#0f1b33] border-cyan-400 text-white shadow-[0_0_18px_rgba(0,242,254,0.3)]'
                  : 'bg-[#080d16] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
              <span className="font-extrabold">{cam.id.toUpperCase()}</span>
              <span className="text-[11px] text-slate-400 font-sans">{cam.target}</span>
            </button>
          );
        })}
      </div>

      {/* Main View Area: Either Focus HUD (Detailed) or 4-Feed Grid */}
      {viewMode === 'focus' ? (
        <div className="flex-1 flex flex-col gap-3 min-h-0">

          {/* Interactive HUD Layer Toggles Toolbar */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#090e1a]/95 border border-slate-800 shrink-0 font-mono text-xs flex-wrap">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>HUD OVERLAY CONTROLS:</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setShowSkeleton(!showSkeleton);
                  playBeep();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  showSkeleton
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                🦴 Pose Skeleton
              </button>

              <button
                onClick={() => {
                  setShowObjectTags(!showObjectTags);
                  playBeep();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  showObjectTags
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                🎯 Object Tags
              </button>

              <button
                onClick={() => {
                  setShowFaceInset(!showFaceInset);
                  playBeep();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  showFaceInset
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                👤 Face Dossier
              </button>

              <button
                onClick={() => {
                  setShowSilhouette(!showSilhouette);
                  playBeep();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  showSilhouette
                    ? 'bg-purple-950 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                Enhanced contrast
              </button>

              <button
                onClick={() => {
                  setIsThermal(!isThermal);
                  playClick();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  isThermal
                    ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                🔥 Thermal FLIR
              </button>

              <button
                onClick={() => {
                  setShowScanlines(!showScanlines);
                  playBeep();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  showScanlines
                    ? 'bg-slate-800 border-slate-600 text-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                📺 Scanlines
              </button>
            </div>
          </div>

          {/* Master Video Display Canvas with High-Tech Overlays (Reference Images 1 & 2 & 4) */}
          <div className="relative flex-1 rounded-2xl overflow-hidden border-2 border-slate-800 bg-black shadow-2xl flex items-center justify-center min-h-[440px]">

            {/* The Real Security Camera Background */}
            <img
              src={currentCam.image}
              alt={currentCam.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isThermal ? 'hue-rotate-90 invert brightness-125 saturate-200 contrast-125' : showSilhouette ? 'contrast-125 saturate-150' : ''
              }`}
            />

            {/* Shutter Capture Flash Animation */}
            {isCaptured && (
              <div className="absolute inset-0 bg-white/80 z-50 pointer-events-none animate-ping" />
            )}

            {/* Subtle CCTV Scanline Lines Overlay */}
            {showScanlines && (
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)'
                }}
              />
            )}

            {/* ======================================================== */}
            {/* HUD OVERLAYS - SCENARIO 1: CAM-01 CROSSWALK ALPHA (IMAGES 1 & 2) */}
            {/* ======================================================== */}
            {activeCam === 'cam-01' && (
              <>
                {/* Top Cybernetic Status Bar (POST-LINE: 06 // SURVEILLANCE NODE: ACTIVE) */}
                <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-20 pointer-events-none font-mono text-xs">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/80 border border-emerald-500/50 text-emerald-400 font-bold backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>POST-LINE: 06 // surveillance node: active 2026.03.28</span>
                  </div>

                  {/* Circular Radar HUD Widget in Top Right (Image 1) */}
                  <div className="relative w-12 h-12 rounded-full border-2 border-emerald-500/60 flex items-center justify-center bg-black/70 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <div className="w-8 h-8 rounded-full border border-emerald-400/40" />
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20" />
                    <div className="absolute w-full h-[1.5px] bg-emerald-400/40 rotate-45" />
                    <div className="absolute w-full h-[1.5px] bg-emerald-400/40 -rotate-45" />
                    <div className="absolute inset-0 border-t-2 border-emerald-400 rounded-full animate-spin" />
                  </div>
                </div>

                {/* Biometric Mugshot Dossier Inset (Top Left - Reference Image 1) */}
                {showFaceInset && (
                  <div className="absolute top-14 left-4 z-20 flex flex-col gap-1.5 p-2 rounded-xl bg-black/85 border border-emerald-500/60 backdrop-blur-md shadow-[0_0_25px_rgba(16,185,129,0.25)] font-mono text-xs animate-in fade-in">
                    <div className="relative w-28 h-32 sm:w-32 sm:h-36 rounded-lg overflow-hidden border border-emerald-500/50 bg-slate-950">
                      <img
                        src="/assets/suspect_face_scan.jpg"
                        alt="Face Inset"
                        className="w-full h-full object-cover filter contrast-125"
                      />

                      {/* Targeting Reticle over Face */}
                      <div className="absolute top-[28%] left-[28%] w-14 h-14 border border-emerald-400/90 rounded flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 bg-emerald-400/40" />
                      </div>

                      {/* Continuous Scanline Sweep */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scanline" />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold px-1">
                      <span>BIOMETRIC SCAN</span>
                      <span>98.4% MATCH</span>
                    </div>
                  </div>
                )}

                {/* Floating Tactical Data Card (Reference Image 1: OFFLINE ACTIVITY DETECTED) */}
                <div className="absolute top-52 sm:top-56 left-4 z-20 p-3 sm:p-3.5 rounded-xl bg-black/90 border-2 border-emerald-500/70 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.3)] font-mono text-xs text-emerald-300 max-w-[240px] space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-black border-b border-emerald-500/40 pb-1 text-xs">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span>OFFLINE ACTIVITY DETECTED</span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div>
                      <span className="text-slate-400">ID: </span>
                      <span className="font-extrabold text-white">Alnami (P-2204-02)</span>
                    </div>
                    <div>
                      <span className="text-slate-400">SOCIAL SYNC RATE: </span>
                      <span className="font-black text-red-400 bg-red-950/80 px-1 py-0.2 rounded border border-red-600/50 animate-pulse">
                        1% CRITICAL!!!
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">INTERACTION FREQ: </span>
                      <span className="font-bold text-amber-300">RARE</span>
                    </div>
                    <div>
                      <span className="text-slate-400">EMOTIONAL OUTPUT: </span>
                      <span className="font-bold text-emerald-400">NO CONTROL</span>
                    </div>
                    <div>
                      <span className="text-slate-400">GAIT SPEED: </span>
                      <span className="font-bold text-cyan-300">1.42 m/s (114 bpm)</span>
                    </div>
                  </div>
                </div>

                {/* SVG Pose Estimation Skeleton Overlay (Reference Image 2) */}
                {showSkeleton && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                    {/* Skeleton Bone Connections */}
                    {/* Neck to Left Shoulder */}
                    <line x1="50.5%" y1="41%" x2="48%" y2="44%" stroke="#00ff66" strokeWidth="2.5" strokeOpacity="0.85" />
                    {/* Neck to Right Shoulder */}
                    <line x1="50.5%" y1="41%" x2="53%" y2="44%" stroke="#00ff66" strokeWidth="2.5" strokeOpacity="0.85" />
                    {/* Right Shoulder to Right Elbow */}
                    <line x1="53%" y1="44%" x2="55%" y2="52%" stroke="#00ff66" strokeWidth="2.5" strokeOpacity="0.85" />
                    {/* Right Elbow to Wrist (holding coffee cup) */}
                    <line x1="55%" y1="52%" x2="48%" y2="50%" stroke="#00ff66" strokeWidth="2.5" strokeOpacity="0.85" />
                    {/* Spine / Torso: Neck to Pelvis */}
                    <line x1="50.5%" y1="41%" x2="50.5%" y2="58%" stroke="#00ff66" strokeWidth="2.5" strokeOpacity="0.85" />
                    {/* Pelvis to Left Knee */}
                    <line x1="50.5%" y1="58%" x2="48.5%" y2="68%" stroke="#00ff66" strokeWidth="2.5" strokeOpacity="0.85" />
                    {/* Left Knee to Left Foot */}
                    <line x1="48.5%" y1="68%" x2="47%" y2="76%" stroke="#00ff66" strokeWidth="2.5" strokeOpacity="0.85" />
                    {/* Pelvis to Right Knee */}
                    <line x1="50.5%" y1="58%" x2="54%" y2="66%" stroke="#00ff66" strokeWidth="2.5" strokeOpacity="0.85" />
                    {/* Right Knee to Right Foot */}
                    <line x1="54%" y1="66%" x2="55.5%" y2="71%" stroke="#00ff66" strokeWidth="2.5" strokeOpacity="0.85" />

                    {/* Glowing Joint Keypoints */}
                    <circle cx="50.5%" cy="36%" r="5" fill="#00ff66" className="animate-pulse" filter="drop-shadow(0 0 6px #00ff66)" />
                    <circle cx="50.5%" cy="41%" r="4" fill="#a3e635" />
                    <circle cx="48%" cy="44%" r="4" fill="#00ff66" />
                    <circle cx="53%" cy="44%" r="4" fill="#00ff66" />
                    <circle cx="55%" cy="52%" r="4" fill="#00ff66" />
                    <circle cx="48%" cy="50%" r="5" fill="#facc15" filter="drop-shadow(0 0 6px #facc15)" />
                    <circle cx="50.5%" cy="58%" r="4" fill="#00ff66" />
                    <circle cx="48.5%" cy="68%" r="4" fill="#00ff66" />
                    <circle cx="47%" cy="76%" r="4" fill="#00ff66" />
                    <circle cx="54%" cy="66%" r="4" fill="#00ff66" />
                    <circle cx="55.5%" cy="71%" r="4" fill="#00ff66" />
                  </svg>
                )}

                {/* Object Detection Callout Brackets (Reference Image 1) */}
                {showObjectTags && (
                  <>
                    {/* Head / Face Target Box */}
                    <div className="absolute top-[33%] left-[47%] w-18 h-18 border-2 border-emerald-400 rounded-sm pointer-events-none z-15 flex flex-col justify-between p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                      <div className="flex justify-between">
                        <div className="w-2 h-2 border-t-2 border-l-2 border-emerald-300" />
                        <div className="w-2 h-2 border-t-2 border-r-2 border-emerald-300" />
                      </div>
                      <span className="text-[9px] font-mono font-black text-emerald-300 bg-black/80 px-1 rounded self-center">
                        + TARGET
                      </span>
                      <div className="flex justify-between">
                        <div className="w-2 h-2 border-b-2 border-l-2 border-emerald-300" />
                        <div className="w-2 h-2 border-b-2 border-r-2 border-emerald-300" />
                      </div>
                    </div>

                    {/* Object: Coffee Container */}
                    <div className="absolute top-[48%] left-[45%] z-20 pointer-events-none font-mono">
                      <div className="w-10 h-10 border-2 border-emerald-400 rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
                      <div className="absolute -top-5 left-10 whitespace-nowrap bg-black/90 border border-emerald-500/60 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 shadow-md">
                        [ object: coffee container ]
                      </div>
                    </div>

                    {/* Object: Dress */}
                    <div className="absolute top-[52%] right-[32%] z-20 pointer-events-none font-mono">
                      <div className="bg-black/90 border border-emerald-500/60 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 shadow-md">
                        [ object: casual dress ]
                      </div>
                    </div>

                    {/* Object: Footwear */}
                    <div className="absolute bottom-[20%] left-[42%] z-20 pointer-events-none font-mono">
                      <div className="w-16 h-10 border-2 border-emerald-400 rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                      <div className="absolute -bottom-5 left-16 whitespace-nowrap bg-black/90 border border-emerald-500/60 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 shadow-md">
                        [ object: footwear ]
                      </div>
                    </div>
                  </>
                )}

                {/* Bottom Cybernetic Telemetry Bar (Reference Image 1: signal strength: 92%) */}
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-between z-20 pointer-events-none font-mono text-[11px] text-emerald-400">
                  {/* Left Circular Gauge */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-black/80 border border-emerald-500/40 backdrop-blur-md">
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                    <span>SIGNAL STRENGTH: 94%</span>
                  </div>

                  {/* Center Telemetry Metrics */}
                  <div className="px-4 py-1.5 rounded-xl bg-black/90 border border-emerald-500/60 text-white font-bold backdrop-blur-md shadow-lg flex items-center gap-3">
                    <span>NOISE LEVEL: -84dB</span>
                    <span className="text-emerald-500">•</span>
                    <span>OUTPUT FILTER: ACTIVE</span>
                    <span className="text-emerald-500">•</span>
                    <span className="text-emerald-300">FPS: 60 (H.265)</span>
                  </div>

                  {/* Right Circular Gauge */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-black/80 border border-emerald-500/40 backdrop-blur-md">
                    <span>SENSOR CALIBRATED</span>
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-400" />
                  </div>
                </div>
              </>
            )}

            {/* ======================================================== */}
            {/* HUD OVERLAYS - SCENARIO 2: CAM-02 4th ST & MAIN (IMAGE 4) */}
            {/* ======================================================== */}
            {activeCam === 'cam-02' && (
              <>
                {/* Cyan Holographic Bracket Frame */}
                <div className="absolute inset-8 border border-cyan-400/40 pointer-events-none z-15 rounded-xl flex flex-col justify-between p-3">
                  <div className="flex justify-between items-start font-mono text-xs text-cyan-300">
                    <div className="bg-black/80 border border-cyan-500/50 px-3 py-1 rounded-lg backdrop-blur-md">
                      <span className="font-extrabold text-cyan-400">SUBJECT TRACKING // OPTIC-04</span>
                    </div>
                    <div className="bg-black/80 border border-cyan-500/50 px-3 py-1 rounded-lg backdrop-blur-md text-[11px]">
                      {currentCam.iso}
                    </div>
                  </div>

                  <div className="flex justify-between items-end font-mono text-xs text-cyan-300">
                    <div className="bg-black/80 border border-cyan-500/50 px-3 py-1 rounded-lg backdrop-blur-md text-[11px]">
                      ID: 4783-9A • LOCATION: 4th ST & MAIN • TIME: 16:32:05 UTC
                    </div>
                    <div className="bg-black/80 border border-cyan-500/50 px-3 py-1 rounded-lg backdrop-blur-md text-[11px] text-emerald-400">
                      SEC-STABLE • 100% LOCK
                    </div>
                  </div>
                </div>

                {/* Face Recognition Inset Box (Reference Image 4) */}
                {showFaceInset && (
                  <div className="absolute top-20 left-12 z-20 flex flex-col gap-1.5 p-2 rounded-xl bg-black/90 border border-cyan-400 shadow-[0_0_25px_rgba(0,242,254,0.3)] font-mono text-xs backdrop-blur-md animate-in fade-in">
                    <div className="w-28 h-32 rounded-lg overflow-hidden border border-cyan-500/60 bg-slate-950">
                      <img src="/assets/suspect_face_scan.jpg" alt="Confirmed Face" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[10px] font-black text-cyan-400 text-center tracking-wider">
                      FACE RECOGNITION: CONFIRMED
                    </div>
                  </div>
                )}

                {/* Pedestrian Tracking Box with Cyan Contour Silhouette */}
                <div className="absolute bottom-[20%] right-[35%] w-24 h-48 border-2 border-cyan-400 rounded-lg pointer-events-none z-15 flex flex-col justify-between p-1 shadow-[0_0_25px_rgba(0,242,254,0.5)] animate-pulse">
                  <span className="text-[9px] font-mono bg-cyan-600 text-black font-extrabold px-1.5 py-0.5 rounded self-start">
                    ID: 4783-9A
                  </span>
                  <span className="text-[9px] font-mono text-cyan-300 bg-black/80 px-1 rounded self-end">
                    Elena Rostova
                  </span>
                </div>
              </>
            )}

            {/* ======================================================== */}
            {/* HUD OVERLAYS - SCENARIO 3: CAM-03 STREET TARGETS (IMAGE 3) */}
            {/* ======================================================== */}
            {activeCam === 'cam-03' && (
              <>
                {/* CAM#3 Label */}
                <div className="absolute top-3 left-4 font-mono text-base font-black text-white bg-black/80 px-2 py-0.5 border border-slate-700 z-20">
                  CAM#3
                </div>

                {/* Lina Bounding Box (Green) */}
                <div className="absolute top-[28%] left-[40%] w-24 h-52 border-2 border-emerald-400 rounded pointer-events-none z-15 flex flex-col justify-between p-1 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  <span className="text-[9px] font-mono bg-emerald-500 text-black font-extrabold px-1 rounded self-start">
                    95% MATCH • LINA
                  </span>
                  <span className="text-[8px] font-mono text-emerald-300 bg-black/90 px-1 rounded self-end">
                    OVERSIZED HOODIE
                  </span>
                </div>

                {/* Tim Bounding Box (Blue) */}
                <div className="absolute top-[24%] left-[48%] w-24 h-56 border-2 border-blue-500 rounded pointer-events-none z-15 flex flex-col justify-between p-1 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <span className="text-[9px] font-mono bg-blue-600 text-white font-extrabold px-1 rounded self-start">
                    100% MATCH • TIM
                  </span>
                  <span className="text-[8px] font-mono text-blue-300 bg-black/90 px-1 rounded self-end">
                    GREY HOODIE / CARGO
                  </span>
                </div>

                {/* Floating Retro Dossier Card (Reference Image 3) */}
                <div className="absolute bottom-10 right-6 z-20 p-3 rounded-lg bg-blue-950/90 border border-blue-500/80 font-mono text-xs text-blue-200 max-w-[220px] shadow-2xl space-y-1">
                  <div className="font-extrabold text-blue-400 border-b border-blue-700/60 pb-1 text-[11px]">
                    ID: THEVINYLHOUSE / PROJECT: AGILE
                  </div>
                  <div className="text-[10px] space-y-0.5 text-blue-300">
                    <div>LIFESTYLE: 120</div>
                    <div>THE WAY ONE WALKS: 45</div>
                    <div>SPEED OF STEPS: 5</div>
                    <div className="text-emerald-400 font-bold">STATUS: MONITORED</div>
                  </div>
                </div>
              </>
            )}

            {/* ======================================================== */}
            {/* HUD OVERLAYS - SCENARIO 4: CAM-04 CYBER OPERATIONS (IMAGE 5) */}
            {/* ======================================================== */}
            {activeCam === 'cam-04' && (
              <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-20 font-mono">
                <div className="flex justify-between items-center bg-black/85 border border-red-500/60 p-3 rounded-xl backdrop-blur-md">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 animate-bounce" />
                    <span>NATIONAL CYBER CRIME COORDINATION COMMAND DECK</span>
                  </div>
                  <span className="text-amber-400 font-bold text-xs">DEFCON 1 ACTIVE</span>
                </div>

                <div className="self-center bg-black/90 border-2 border-red-600 px-6 py-2 rounded-xl text-center shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                  <div className="text-red-400 font-extrabold text-xs">I4C EMERGENCY MONITORING STREAM</div>
                  <div className="text-white font-bold text-sm">FINANCIAL THREAT INTERCEPT CORRIDOR</div>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Multi-Camera 4-Feed Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1 min-h-0">
          {cameras.map((cam) => (
            <button
              type="button"
              key={cam.id}
              onClick={() => {
                setActiveCam(cam.id);
                setViewMode('focus');
                playClick();
              }}
              className="relative text-left rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden group hover:border-cyan-400 transition-all shadow-xl flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={cam.image}
                  alt={cam.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />

                {/* Live Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-slate-800 font-mono text-[9px] font-bold text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{cam.id.toUpperCase()}</span>
                </div>

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[9px] text-cyan-300 font-bold border border-slate-800">
                  {cam.fps} FPS
                </div>

                {/* Target overlay indicator */}
                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/85 border border-slate-700/80 font-mono text-xs flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-white text-xs">{cam.target}</div>
                    <div className="text-[10px] text-slate-400 truncate">{cam.location}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-[10px] border border-cyan-700">
                    Inspect
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
