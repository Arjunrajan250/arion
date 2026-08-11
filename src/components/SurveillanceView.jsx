import React, { useState } from 'react';
import { Camera, Grid, Maximize2, RefreshCw, Eye, ShieldAlert, Volume2, Radio, CheckCircle2 } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function SurveillanceView({ onSelectFelon }) {
  const [gridSize, setGridSize] = useState(4); // 4 or 9
  const [activeSector, setActiveSector] = useState('ALL');

  const cctvFeeds = [
    { id: 'cam-01', location: 'Gotham Substation 4', target: 'Marcus Thompson', status: 'ALERT', image: '/assets/crowd_cctv_feed.png', confidence: 94 },
    { id: 'cam-02', location: 'Sector 7 North Gate', target: 'David Richardson', status: 'ACTIVE', image: '/assets/city_wireframe.png', confidence: 88 },
    { id: 'cam-03', location: 'Midtown Financial Link', target: 'Dr. Aris Thorne', status: 'WARNING', image: '/assets/crowd_cctv_feed.png', confidence: 79 },
    { id: 'cam-04', location: 'East River Dockyard', target: 'Unidentified Unit', status: 'ONLINE', image: '/assets/city_wireframe.png', confidence: 65 },
    { id: 'cam-05', location: 'Central Express Way', target: 'Target Beta', status: 'ONLINE', image: '/assets/crowd_cctv_feed.png', confidence: 82 },
    { id: 'cam-06', location: 'Skyline Perimeter 9', target: 'Drone Transponder', status: 'ONLINE', image: '/assets/city_wireframe.png', confidence: 91 },
    { id: 'cam-07', location: 'Underground Tunnel 3', target: 'Unidentified convoy', status: 'ALERT', image: '/assets/crowd_cctv_feed.png', confidence: 85 },
    { id: 'cam-08', location: 'Port Terminal Bravo', target: 'Ship Freight 11', status: 'ONLINE', image: '/assets/city_wireframe.png', confidence: 73 },
    { id: 'cam-09', location: 'Radio Relay Array 2', target: 'Frequency Spike', status: 'ONLINE', image: '/assets/crowd_cctv_feed.png', confidence: 96 },
  ];

  const displayedFeeds = cctvFeeds.slice(0, gridSize);

  return (
    <div className="w-full h-full flex flex-col bg-[#06080c] text-slate-100 p-5 sm:p-6 gap-5 overflow-y-auto custom-scrollbar font-sans">
      
      {/* Surveillance Control Header */}
      <div className="w-full p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0b0e17] via-[#090c14] to-[#0b0e17] border border-slate-800/90 flex flex-wrap items-center justify-between gap-5 shrink-0 shadow-2xl backdrop-blur-md font-mono">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_18px_rgba(0,242,254,0.35)]">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-black tracking-wide text-white font-mono text-glow-cyan">
                LIVE SURVEILLANCE CCTV MATRIX
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-xs font-bold text-cyan-300">
                SYNCHRONIZED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">32 Active High-Definition Feeds Synchronized • AI Object Identification Active</p>
          </div>
        </div>

        {/* Sector Filters & Grid Size Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sector Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            {['ALL', 'NORTH', 'MIDTOWN', 'DOCKYARD'].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setActiveSector(sec);
                  playClick();
                }}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeSector === sec ? 'bg-cyan-500 text-slate-950 shadow-[0_0_14px_rgba(0,242,254,0.45)]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Grid Size Switcher */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setGridSize(4);
                playBeep();
              }}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-bold transition-all ${
                gridSize === 4 ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
              title="2x2 Grid View"
            >
              <Grid className="w-4 h-4" />
              <span>4 Feeds</span>
            </button>
            <button
              onClick={() => {
                setGridSize(9);
                playBeep();
              }}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-bold transition-all ${
                gridSize === 9 ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
              title="3x3 Grid View"
            >
              <Grid className="w-4 h-4" />
              <span>9 Feeds</span>
            </button>
          </div>
        </div>
      </div>

      {/* CCTV Camera Feeds Grid */}
      <div className={`grid gap-4 flex-1 ${gridSize === 4 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
        {displayedFeeds.map((feed) => (
          <div 
            key={feed.id}
            className="relative rounded-2xl border border-slate-800/90 bg-[#090c14]/90 overflow-hidden group hover:border-cyan-500/70 transition-all duration-300 shadow-2xl flex flex-col hover:shadow-[0_0_25px_rgba(0,242,254,0.15)]"
          >
            {/* Feed Image Container */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950 select-none">
              <img 
                src={feed.image} 
                alt={feed.location}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-all duration-300 group-hover:scale-105"
              />

              {/* Bounding Box AI Tracking Overlay */}
              <div className="absolute top-1/4 left-1/3 w-28 h-28 border-2 border-red-500/90 rounded-lg flex flex-col justify-between p-1 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <span className="text-[9px] font-mono bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded self-start shadow-sm">
                  AI TARGET {feed.confidence}%
                </span>
                <span className="text-[9px] font-mono text-red-200 bg-slate-950/90 border border-red-500/40 px-1.5 py-0.5 rounded self-end font-bold">
                  {feed.target}
                </span>
              </div>

              {/* Live Ticker & Camera Label */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-[10px] font-bold text-white flex items-center gap-1.5 backdrop-blur-md shadow-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>REC • {feed.id.toUpperCase()}</span>
              </div>

              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-[10px] font-bold text-cyan-400 backdrop-blur-md shadow-md">
                {feed.location}
              </div>
            </div>

            {/* Footer Control Bar */}
            <div className="p-3.5 bg-[#0b0e17] border-t border-slate-800/90 flex items-center justify-between font-mono text-xs">
              <div>
                <div className="text-white font-bold text-xs">{feed.target}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Confidence Match: <span className="text-cyan-400 font-extrabold">{feed.confidence}%</span></div>
              </div>
              <button 
                onClick={() => {
                  if (onSelectFelon) onSelectFelon({ name: feed.target });
                  playClick();
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all"
              >
                Inspect Target
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
