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
    <div className="w-full h-full flex flex-col bg-[#07090d] text-slate-100 p-4 gap-4 overflow-y-auto custom-scrollbar font-sans">
      
      {/* Surveillance Control Header */}
      <div className="w-full p-4 rounded-xl bg-[#0b0e14] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">LIVE SURVEILLANCE CCTV MATRIX</h2>
            <p className="text-xs text-slate-400">32 Active High-Definition Feeds Synchronized • AI Object Identification Active</p>
          </div>
        </div>

        {/* Sector Filters & Grid Size Buttons */}
        <div className="flex items-center gap-3">
          {/* Sector Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['ALL', 'NORTH', 'MIDTOWN', 'DOCKYARD'].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setActiveSector(sec);
                  playClick();
                }}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  activeSector === sec ? 'bg-cyan-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Grid Size Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => {
                setGridSize(4);
                playBeep();
              }}
              className={`p-1.5 rounded flex items-center gap-1 font-bold ${
                gridSize === 4 ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
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
              className={`p-1.5 rounded flex items-center gap-1 font-bold ${
                gridSize === 9 ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
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
            className="relative rounded-xl border border-slate-800 bg-[#090c12] overflow-hidden group hover:border-cyan-500/60 transition-all shadow-xl flex flex-col"
          >
            {/* Feed Image Container */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black">
              <img 
                src={feed.image} 
                alt={feed.location}
                className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity"
              />

              {/* Bounding Box AI Tracking Overlay */}
              <div className="absolute top-1/4 left-1/3 w-28 h-28 border-2 border-red-500/80 rounded flex flex-col justify-between p-1 animate-pulse">
                <span className="text-[9px] font-mono bg-red-600 text-white font-bold px-1 py-0.5 rounded self-start">
                  AI TARGET {feed.confidence}%
                </span>
                <span className="text-[9px] font-mono text-red-300 bg-black/80 px-1 rounded self-end">
                  {feed.target}
                </span>
              </div>

              {/* Live Ticker & Camera Label */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/80 border border-slate-800 font-mono text-[10px] font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>REC • {feed.id.toUpperCase()}</span>
              </div>

              <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/80 border border-slate-800 font-mono text-[10px] font-bold text-cyan-400">
                {feed.location}
              </div>
            </div>

            {/* Footer Control Bar */}
            <div className="p-3 bg-[#0d1017] border-t border-slate-800 flex items-center justify-between font-mono text-xs">
              <div>
                <div className="text-white font-bold">{feed.target}</div>
                <div className="text-[10px] text-slate-400">Confidence: <span className="text-cyan-400 font-bold">{feed.confidence}%</span></div>
              </div>
              <button 
                onClick={() => {
                  if (onSelectFelon) onSelectFelon({ name: feed.target });
                  playClick();
                }}
                className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500 hover:text-black transition-all"
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
