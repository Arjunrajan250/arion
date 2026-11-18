import React, { useState } from 'react';
import { Video, ZoomIn, ZoomOut, Car, UserCheck } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function LiveFeedView({ onSelectFelon }) {
  const [activeCam, setActiveCam] = useState('NODE-01');
  const [isThermal, setIsThermal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const cameras = [
    {
      id: 'NODE-01',
      name: 'Crosswalk Alpha Optical Feed #A-12',
      status: 'LIVE',
      fps: 60,
      image: '/assets/cctv_crosswalk_woman.jpg',
      target: 'Alnami (P-2204-02)',
      threat: 'ANOMALY DETECTED'
    },
    {
      id: 'NODE-02',
      name: '4th St & Main PTZ Dome #B-04',
      status: 'LIVE',
      fps: 60,
      image: '/assets/cctv_dome_junction.jpg',
      target: 'Elena Rostova (4783-9A)',
      threat: 'SUBJECT CONFIRMED'
    },
    {
      id: 'NODE-03',
      name: 'Midtown Crossway Street Cam #C-09',
      status: 'LIVE',
      fps: 30,
      image: '/assets/cctv_street_targets.jpg',
      target: 'Multi-Target (Lina & Tim)',
      threat: 'TRACKING ACTIVE'
    },
    {
      id: 'NODE-04',
      name: 'I4C Cyber Command Ops Floor #D-02',
      status: 'LIVE',
      fps: 60,
      image: '/assets/cyber_crime_command.jpg',
      target: 'Syndicate Phoenix-Net',
      threat: 'ALPHA DEFENSE'
    },
  ];

  const licensePlates = [
    { plate: 'DL-01-AB-9012', vehicle: 'Black SUV', status: 'HOTLIST MATCH', owner: 'Syndicate Courier', time: '14:32:15', speed: '58 km/h' },
    { plate: 'MH-02-CP-4029', vehicle: 'Silver Sedan', status: 'CLEAR', owner: 'Civilian Transport', time: '14:31:02', speed: '42 km/h' },
    { plate: 'KA-04-EV-9912', vehicle: 'Armored Van', status: 'SUSPICIOUS', owner: 'Unregistered Carrier', time: '14:28:44', speed: '65 km/h' },
    { plate: 'WB-06-TR-3301', vehicle: 'Dark Delivery Truck', status: 'CLEAR', owner: 'Logistics Fleet', time: '14:20:10', speed: '38 km/h' },
  ];

  const facialScans = [
    { name: 'Alnami (P-2204-02)', match: '98.4%', threat: 'CRITICAL ANOMALY', time: '14:33:02', image: '/assets/suspect_face_scan.jpg' },
    { name: 'Elena Rostova (4783-9A)', match: '96.8%', threat: 'CONFIRMED SUBJECT', time: '14:32:15', image: '/assets/suspect_face_scan.jpg' },
    { name: 'Robert Mitchell', match: '97.1%', threat: 'HIGH THREAT', time: '14:29:08', image: '/assets/robert_mitchell.png' },
    { name: 'Marcus Thompson', match: '95.4%', threat: 'CRITICAL', time: '14:15:30', image: '/assets/marcus_thompson.png' },
  ];

  const activeCamData = cameras.find(c => c.id === activeCam) || cameras[0];

  return (
    <div className="w-full h-full flex flex-col bg-[#05070c] text-slate-100 p-3 sm:p-4 gap-3.5 overflow-y-auto custom-scrollbar font-sans select-none">

      {/* Top Header Control Bar */}
      <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#080d18] via-[#091122] to-[#080d18] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xl backdrop-blur-md font-mono text-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white font-mono text-glow-cyan">
                LIVE OPTICAL BIOMETRICS & ANPR FEED
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/50 text-[10px] font-bold text-emerald-400">
                ACTIVE 4K STREAM
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated Plate Recognition (ANPR) • Multi-Point Facial Geometry Matcher
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsThermal(!isThermal);
              playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl border font-bold transition-all ${
              isThermal
                ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {isThermal ? '🔥 FLIR THERMAL ACTIVE' : '👁️ OPTICAL RGB'}
          </button>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              aria-label="Zoom out"
              disabled={zoomLevel === 100}
              onClick={() => {
                setZoomLevel(prev => Math.max(100, prev - 25));
                playBeep();
              }}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-bold text-cyan-400">{zoomLevel}%</span>
            <button
              type="button"
              aria-label="Zoom in"
              disabled={zoomLevel === 200}
              onClick={() => {
                setZoomLevel(prev => Math.min(200, prev + 25));
                playBeep();
              }}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0">

        {/* Left 8 Columns: Main CCTV Stream */}
        <div className="lg:col-span-8 flex flex-col gap-3 min-h-0">

          {/* Main Video Monitor */}
          <div className="relative flex-1 rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl min-h-[380px] flex items-center justify-center">
            <div className="absolute inset-0 transition-transform duration-300" style={{ transform: `scale(${zoomLevel / 100})` }}>
              <img
                src={activeCamData.image}
                alt={activeCamData.name}
                className={`h-full w-full object-cover ${isThermal ? 'hue-rotate-90 invert brightness-125 saturate-200' : ''}`}
                draggable="false"
              />

              {/* Target overlay scales with its source image to preserve alignment. */}
              <div className="absolute left-[42%] top-[35%] flex h-44 w-32 flex-col justify-between rounded-lg border-2 border-cyan-400 p-1.5 shadow-[0_0_25px_rgba(0,242,254,0.7)] pointer-events-none">
                <span className="self-start rounded bg-cyan-600 px-1.5 py-0.5 font-mono text-[9px] font-extrabold text-black">TARGET LOCK 98.4%</span>
                <span className="self-end rounded border border-cyan-500/50 bg-black/85 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-300">{activeCamData.target}</span>
              </div>
            </div>

            {/* Top Left Live Banner */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/90 border border-slate-800 font-mono text-xs font-bold text-red-400 flex items-center gap-2 shadow-lg backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>REC • {activeCamData.id} ({activeCamData.fps} FPS)</span>
            </div>

            {/* Top Right Cam Title */}
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/90 border border-slate-800 font-mono text-xs font-bold text-cyan-300 shadow-lg backdrop-blur-md">
              {activeCamData.name}
            </div>

            {/* Bottom Target Meta Bar */}
            <div className="absolute bottom-3 inset-x-3 px-3 py-1.5 rounded-xl bg-black/90 border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between backdrop-blur-md shadow-md">
              <span className="text-cyan-400 font-bold">{activeCamData.target}</span>
              <span className="text-amber-400 font-extrabold">{activeCamData.threat}</span>
            </div>
          </div>

          {/* 4 Auxiliary Camera Feeds Selector Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 font-mono text-xs">
            {cameras.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => {
                  setActiveCam(c.id);
                  playClick();
                }}
                aria-pressed={activeCam === c.id}
                aria-label={`View ${c.name}`}
                className={`relative aspect-video rounded-xl overflow-hidden border-2 group transition-all shadow-md ${
                  activeCam === c.id
                    ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.4)] scale-102'
                    : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
                }`}
              >
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/85 text-[9px] font-bold text-white border border-slate-800">
                  {c.id}
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Right 4 Columns: ANPR Plate Reader & Facial Scanner Panels */}
        <div className="lg:col-span-4 flex flex-col gap-3 min-h-0">

          {/* ANPR License Plate Reader */}
          <div className="p-3.5 rounded-2xl bg-[#080d18] border border-slate-800 flex flex-col gap-2 shadow-xl font-mono text-xs shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-amber-400 font-black">
                <Car className="w-4 h-4" />
                <span>ANPR LICENSE PLATE RECOGNITION</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">RADAR SYNC</span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
              {licensePlates.map((p, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="font-extrabold text-white text-xs">{p.plate}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {p.vehicle} • {p.speed} • {p.time}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                    p.status === 'HOTLIST MATCH' ? 'bg-red-600 text-white animate-pulse' :
                    p.status === 'SUSPICIOUS' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Biometric Facial Scanner Feed */}
          <div className="flex-1 p-3.5 rounded-2xl bg-[#080d18] border border-slate-800 flex flex-col gap-2 shadow-xl font-mono text-xs min-h-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
              <div className="flex items-center gap-2 text-cyan-400 font-black">
                <UserCheck className="w-4 h-4" />
                <span>BIOMETRIC GEOMETRY MATCH STREAM</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">99.1% CONFIDENCE</span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {facialScans.map((f) => (
                <button
                  type="button"
                  key={f.name}
                  onClick={() => {
                    playClick();
                    if (onSelectFelon) onSelectFelon({ name: f.name, threat: f.threat, mugshot: f.image });
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center gap-3 hover:border-cyan-500 transition-all group shadow-sm"
                >
                  <img src={f.image} alt={f.name} className="w-11 h-13 rounded-lg object-cover border border-slate-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-white text-xs group-hover:text-cyan-300 truncate">{f.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Match: <span className="text-cyan-400 font-bold">{f.match}</span></div>
                    <div className="text-[9px] text-slate-500">{f.time}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-red-950 text-red-400 border border-red-700/60 shrink-0">
                    {f.threat}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
