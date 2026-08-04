import React, { useState } from 'react';
import { Video, Eye, Maximize2, ShieldAlert, Zap, Camera, RefreshCw, ZoomIn, ZoomOut, Compass, Car, UserCheck, AlertTriangle } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function LiveFeedView({ onSelectFelon }) {
  const [activeCam, setActiveCam] = useState('CCTV-X5');
  const [isThermal, setIsThermal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const cameras = [
    { id: 'CCTV-X5', name: 'Downtown Shopping Center #A-12', status: 'LIVE', fps: 60, image: '/assets/cctv_feed.png' },
    { id: 'CCTV-X6', name: 'Substation 4 North Gate #B-04', status: 'LIVE', fps: 58, image: '/assets/crowd_cctv_feed.png' },
    { id: 'CCTV-X7', name: 'Midtown Financial Exchange #C-09', status: 'LIVE', fps: 60, image: '/assets/city_wireframe.png' },
    { id: 'CCTV-X8', name: 'Dockyard Pier 12 Harbor #D-02', status: 'LIVE', fps: 55, image: '/assets/crowd_cctv_feed.png' },
  ];

  const licensePlates = [
    { plate: 'GTH-8891', vehicle: 'Black SUV', status: 'HOTLIST MATCH', owner: 'Marcus Thompson', time: '14:32:15' },
    { plate: 'NY-4029', vehicle: 'Silver Sedan', status: 'CLEAR', owner: 'Civilian Transport', time: '14:31:02' },
    { plate: 'KLO-9912', vehicle: 'Armored Van', status: 'SUSPICIOUS', owner: 'Unregistered Courier', time: '14:28:44' },
    { plate: 'BRL-3301', vehicle: 'Red Pickup', status: 'CLEAR', owner: 'Civilian Vehicle', time: '14:20:10' },
  ];

  const facialScans = [
    { name: 'Robert Mitchell', match: '97%', threat: 'HIGH THREAT', time: '14:32:15', image: '/assets/robert_mitchell.png' },
    { name: 'Marcus Thompson', match: '95%', threat: 'CRITICAL', time: '14:29:08', image: '/assets/marcus_thompson.png' },
    { name: 'David Richardson', match: '92%', threat: 'HIGH THREAT', time: '14:15:30', image: '/assets/david_richardson.png' },
    { name: 'Dr. Aris Thorne', match: '99%', threat: 'ALPHA', time: '13:58:12', image: '/assets/robert_mitchell.png' },
  ];

  const activeCamData = cameras.find(c => c.id === activeCam) || cameras[0];

  return (
    <div className="w-full h-full flex flex-col bg-[#06080c] text-slate-100 p-3 gap-3 overflow-y-auto custom-scrollbar font-sans select-none">
      
      {/* Top Header Control Bar */}
      <div className="w-full p-3.5 rounded-xl bg-[#0b0e14] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">LIVE SURVEILLANCE & BIOMETRIC CONTROL COMMAND</h2>
            <p className="text-xs text-slate-400">4 Synchronized Optical Nodes • Real-Time ANPR & Facial AI Active</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsThermal(!isThermal);
              playClick();
            }}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
              isThermal 
                ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isThermal ? '🔥 THERMAL VISION ACTIVE' : '👁️ STANDARD OPTICS'}
          </button>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        
        {/* Left 8 Columns: Main CCTV Stream & PTZ Controller */}
        <div className="lg:col-span-8 flex flex-col gap-3 min-h-0">
          
          {/* Main Video Monitor */}
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl min-h-[360px]">
            <img
              src={activeCamData.image}
              alt={activeCamData.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${isThermal ? 'hue-rotate-90 invert brightness-125 saturate-200' : ''}`}
              style={{ transform: `scale(${zoomLevel / 100})` }}
            />

            {/* AI Bounding Box Tracking Overlay */}
            <div className="absolute top-[28%] left-[40%] w-36 h-36 border-2 border-cyan-400 rounded flex flex-col justify-between p-1 animate-pulse shadow-[0_0_20px_rgba(0,242,254,0.7)]">
              <span className="text-[9px] font-mono bg-cyan-600 text-black font-extrabold px-1.5 py-0.5 rounded self-start">
                TARGET LOCK 97%
              </span>
              <span className="text-[9px] font-mono text-cyan-300 bg-black/80 px-1 rounded self-end">
                Marcus Thompson
              </span>
            </div>

            {/* Top Left Live Banner */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/85 border border-slate-800 font-mono text-xs font-bold text-red-400 flex items-center gap-2 shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>REC • {activeCamData.id} ({activeCamData.fps} FPS)</span>
            </div>

            {/* Top Right Cam Title */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/85 border border-slate-800 font-mono text-xs font-bold text-cyan-300 shadow-md">
              {activeCamData.name}
            </div>
          </div>

          {/* 4 Auxiliary Camera Feeds Selector Row */}
          <div className="grid grid-cols-4 gap-2 shrink-0 font-mono text-xs">
            {cameras.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setActiveCam(c.id);
                  playClick();
                }}
                className={`relative aspect-video rounded-xl overflow-hidden border cursor-pointer group transition-all ${
                  activeCam === c.id 
                    ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.4)]' 
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-white">
                  {c.id}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right 4 Columns: ANPR Plate Reader & Facial Scanner Panels */}
        <div className="lg:col-span-4 flex flex-col gap-3 min-h-0">
          
          {/* ANPR License Plate Reader */}
          <div className="p-3 rounded-xl bg-[#0b0e14] border border-slate-800 flex flex-col gap-2 shadow-xl font-mono text-xs shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold">
                <Car className="w-4 h-4" />
                <span>ANPR LICENSE PLATE SCANNER</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
              {licensePlates.map((p, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-white text-xs">{p.plate} ({p.vehicle})</div>
                    <div className="text-[10px] text-slate-400">{p.owner} • {p.time}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                    p.status === 'HOTLIST MATCH' ? 'bg-red-600 text-white' :
                    p.status === 'SUSPICIOUS' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Biometric Facial Scanner Feed */}
          <div className="flex-1 p-3 rounded-xl bg-[#0b0e14] border border-slate-800 flex flex-col gap-2 shadow-xl font-mono text-xs min-h-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 shrink-0">
              <div className="flex items-center gap-2 text-cyan-400 font-extrabold">
                <UserCheck className="w-4 h-4" />
                <span>FACIAL RECOGNITION MATCH STREAM</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">99.2% ACCURACY</span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {facialScans.map((f, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    playClick();
                    if (onSelectFelon) onSelectFelon({ name: f.name });
                  }}
                  className="p-2.5 rounded-xl bg-[#10141d] border border-slate-800 flex items-center gap-3 hover:border-cyan-500 transition-all cursor-pointer group"
                >
                  <img src={f.image} alt={f.name} className="w-10 h-12 rounded object-cover border border-slate-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-white text-xs group-hover:text-cyan-300 truncate">{f.name}</div>
                    <div className="text-[10px] text-slate-400">Match Confidence: <span className="text-cyan-400 font-bold">{f.match}</span></div>
                    <div className="text-[9px] text-slate-500">{f.time}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-950 text-red-400 border border-red-700 shrink-0">
                    {f.threat}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
