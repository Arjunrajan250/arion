import React, { useState } from 'react';
import { Video, Maximize2, Camera, ShieldAlert, AlertTriangle, Eye, CheckCircle2, ChevronRight } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function LiveFeedPanel({ onSelectFelon }) {
  const [activeFilter, setActiveFilter] = useState('felons');
  const [selectedCam, setSelectedCam] = useState('CCTV-X5');

  const cameras = ['CCTV-X5', 'CCTV-X6', 'CCTV-X7', 'CCTV-X8'];

  const cameraEvents = [
    { time: '14:32:15', event: 'Target Match: Robert Mitchell (97% Confidence)', level: 'CRITICAL' },
    { time: '14:31:02', event: 'License Plate Recognized: GTH-8891 (Black SUV)', level: 'HIGH' },
    { time: '14:28:44', event: 'Perimeter Motion Detected: Zone 4 Entryway', level: 'MEDIUM' },
    { time: '14:20:10', event: 'Facial Scanner Calibrated: 32 Subjects Processed', level: 'INFO' }
  ];

  const felons = [
    {
      id: '1',
      name: 'Robert Mitchell',
      mugshot: '/assets/robert_mitchell.png',
      detectedAt: 'March 31, 2025 - 14:32:15',
      location: 'Downtown Shopping Center, Camera #A-12',
      warrant: 'ACTIVE WARRANT',
      threat: 'HIGH THREAT',
      matchPct: '97% Match',
      hasInterpol: true,
      charges: ['Armed Robbery', 'Assault'],
      address: '247 Oak Street, Apt 3B, Springfield',
      dob: 'August 15, 1982',
      height: "6'2\"",
      weight: '210 lbs',
      eyes: 'Brown',
      hair: 'Black',
      marks: 'Scar on left cheek, tattoo on right forearm',
      currentCharges: ['Armed Robbery', 'Assault with Deadly Weapon', 'Grand Theft Auto'],
      convictions: [
        { title: 'Armed Robbery (2018)', duration: '5 years served' },
        { title: 'Burglary (2015)', duration: '2 years served' },
        { title: 'Assault (2012)', duration: '18 months probation' }
      ]
    },
    {
      id: '2',
      name: 'Marcus Thompson',
      mugshot: '/assets/marcus_thompson.png',
      detectedAt: 'March 31, 2025 - 14:29:08',
      location: 'Substation 4, Camera #B-04',
      warrant: 'ACTIVE WARRANT',
      threat: 'CRITICAL THREAT',
      matchPct: '95% Match',
      hasInterpol: false,
      charges: ['Armed Robbery', 'Assault', '+5'],
      address: '189 Pine Ridge Rd, Metro District',
      dob: 'November 22, 1986',
      height: "5'11\"",
      weight: '190 lbs',
      eyes: 'Brown',
      hair: 'Black',
      marks: 'Tattoo on left neck',
      currentCharges: ['Armed Robbery', 'Aggravated Assault'],
      convictions: [
        { title: 'Grand Theft Auto (2019)', duration: '3 years served' },
        { title: 'Robbery (2016)', duration: '4 years served' }
      ]
    },
    {
      id: '3',
      name: 'David Richardson',
      mugshot: '/assets/david_richardson.png',
      detectedAt: 'March 31, 2025 - 14:15:30',
      location: 'Midtown Exchange, Camera #C-09',
      warrant: 'ACTIVE WARRANT',
      threat: 'HIGH THREAT',
      matchPct: '92% Match',
      hasInterpol: true,
      charges: ['Cyber Infiltration', 'Extortion'],
      address: '502 Elm Boulevard, Gotham Sector 2',
      dob: 'March 14, 1990',
      height: "6'0\"",
      weight: '185 lbs',
      eyes: 'Hazel',
      hair: 'Brown',
      marks: 'Burn scar on right hand',
      currentCharges: ['Armed Robbery', 'Assault'],
      convictions: [
        { title: 'Assault (2020)', duration: '2 years served' }
      ]
    },
    {
      id: '4',
      name: 'Dr. Aris Thorne',
      mugshot: '/assets/robert_mitchell.png',
      detectedAt: 'March 31, 2025 - 13:58:12',
      location: 'Central Lab Array, Camera #D-02',
      warrant: 'INTERPOL NOTICE',
      threat: 'PRIORITY ALPHA',
      matchPct: '99% Match',
      hasInterpol: true,
      charges: ['Data Theft', 'Sabotage'],
      address: 'Unknown Facility Location',
      dob: 'June 04, 1978',
      height: "6'1\"",
      weight: '175 lbs',
      eyes: 'Grey',
      hair: 'Silver',
      marks: 'Ocular implant cyberware',
      currentCharges: ['Corporate Sabotage', 'Espionage'],
      convictions: [
        { title: 'Data Infiltration (2021)', duration: 'Sentenced 6 years' }
      ]
    },
    {
      id: '5',
      name: 'Helena Vance',
      mugshot: '/assets/marcus_thompson.png',
      detectedAt: 'March 31, 2025 - 13:42:00',
      location: 'Dockyard Pier 12, Camera #E-14',
      warrant: 'RED NOTICE',
      threat: 'ELEVATED',
      matchPct: '89% Match',
      hasInterpol: true,
      charges: ['Contraband', 'Smuggling'],
      address: '77 Harbor Point Quay',
      dob: 'September 12, 1991',
      height: "5'8\"",
      weight: '140 lbs',
      eyes: 'Green',
      hair: 'Blonde',
      marks: 'Dragon tattoo on shoulder',
      currentCharges: ['Maritime Smuggling', 'Tax Evasion'],
      convictions: [
        { title: 'Contraband Traffic (2017)', duration: '3 years served' }
      ]
    },
    {
      id: '6',
      name: 'Viktor Reznov',
      mugshot: '/assets/david_richardson.png',
      detectedAt: 'March 31, 2025 - 13:10:45',
      location: 'Expressway Exit 9, Camera #F-01',
      warrant: 'ACTIVE WARRANT',
      threat: 'CRITICAL THREAT',
      matchPct: '94% Match',
      hasInterpol: false,
      charges: ['Arms Trafficking', 'Conspiracy'],
      address: '104 Industrial Zone',
      dob: 'January 28, 1980',
      height: "6'3\"",
      weight: '230 lbs',
      eyes: 'Blue',
      hair: 'Shaved',
      marks: 'Surgical scar on jawline',
      currentCharges: ['Illegal Firearms Sales', 'Racket'],
      convictions: [
        { title: 'Trafficking (2014)', duration: '8 years served' }
      ]
    }
  ];

  return (
    <div className="w-full lg:w-[320px] xl:w-[350px] flex flex-col gap-2.5 shrink-0 h-auto lg:h-full overflow-y-auto custom-scrollbar select-none bg-[#080a0d] p-3 rounded-2xl border border-slate-800/80 shadow-2xl min-h-[300px] font-sans">
      
      {/* Camera Selection Switcher Bar */}
      <div className="flex items-center justify-between gap-1 p-1 bg-[#0b0d12] rounded-xl border border-slate-800 shrink-0 font-mono text-[10px]">
        {cameras.map((cam) => (
          <button
            key={cam}
            onClick={() => {
              setSelectedCam(cam);
              playClick();
            }}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              selectedCam === cam 
                ? 'bg-cyan-500 text-black shadow-sm' 
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            {cam}
          </button>
        ))}
      </div>

      {/* CCTV Video Feed Window */}
      <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl shrink-0">
        <img
          src="/assets/cctv_feed.png"
          alt="Live Surveillance Feed"
          className="w-full h-full object-cover opacity-85"
        />

        {/* Live Indicator */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-slate-800 font-mono text-[9px] font-bold text-red-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>LIVE • {selectedCam}</span>
        </div>

        {/* Real-time Facial Tracking Box */}
        <div className="absolute top-[25%] left-[42%] w-12 h-12 border-2 border-cyan-400 rounded-sm shadow-[0_0_15px_rgba(0,242,254,0.6)] animate-pulse flex flex-col justify-between p-0.5">
          <div className="flex justify-between">
            <div className="w-1.5 h-1.5 border-t-2 border-l-2 border-cyan-300" />
            <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-300" />
          </div>
          <div className="flex justify-between">
            <div className="w-1.5 h-1.5 border-b-2 border-l-2 border-cyan-300" />
            <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-cyan-300" />
          </div>
        </div>

        {/* Expand Button */}
        <button 
          onClick={() => playBeep()}
          className="absolute top-2 right-2 p-1 rounded-md bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>

      {/* Real-Time Camera Event Ticker Log */}
      <div className="p-2 rounded-xl bg-[#0b0e14] border border-slate-800/80 flex flex-col gap-1 shrink-0 shadow-inner font-mono text-[10px]">
        <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800/80 pb-1">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>REAL-TIME CAMERA LOGS</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold">SCANNING</span>
        </div>

        <div className="space-y-1 max-h-20 overflow-y-auto pr-1 custom-scrollbar">
          {cameraEvents.map((ev, i) => (
            <div key={i} className="flex items-center justify-between text-[9.5px]">
              <span className="text-slate-500 font-mono">{ev.time}</span>
              <span className={`font-bold truncate pl-1 ${
                ev.level === 'CRITICAL' ? 'text-red-400' :
                ev.level === 'HIGH' ? 'text-amber-400' : 'text-slate-300'
              }`}>
                {ev.event}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suspects & Felons List Container - Scrollable */}
      <div className="flex-1 min-h-[280px] bg-[#0b0d11] border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-2 overflow-hidden shadow-xl">
        
        {/* Section Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-600/40 shrink-0">
              <Video className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-200 tracking-tight font-sans">
              Detected Targets in <span className="text-cyan-400 italic font-mono">{selectedCam}</span>
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50">
            6 PROFILES
          </span>
        </div>

        {/* Event Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono shrink-0 no-scrollbar">
          {['felons', 'anomalies', 'accidents', 'all'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                playBeep();
              }}
              className={`px-2.5 py-0.5 rounded capitalize shrink-0 font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-[#14161c] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Scrollable Felons List */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
          {felons.map((felon) => (
            <div
              key={felon.id}
              onClick={() => {
                playClick();
                onSelectFelon(felon);
              }}
              className="p-2 rounded-lg bg-[#12141a] border border-slate-800/80 flex gap-2.5 items-center cursor-pointer hover:border-teal-500/60 hover:bg-slate-900/60 transition-all group shadow-sm"
            >
              {/* Mugshot Image */}
              <div className="w-12 h-14 rounded-md overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                <img
                  src={felon.mugshot}
                  alt={felon.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Suspect Meta */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                
                {/* Header Row: Name & Active Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-xs font-sans truncate group-hover:text-cyan-400 transition-colors">
                    {felon.name}
                  </span>
                  <span className="px-1.5 py-0.2 text-[8px] font-mono font-bold rounded bg-red-950 text-red-400 border border-red-700/50">
                    {felon.threat}
                  </span>
                </div>

                <div className="text-[9px] text-slate-400 font-mono">
                  {felon.detectedAt}
                </div>

                {/* Offenses Pills */}
                <div className="flex items-center gap-1 flex-wrap">
                  {felon.hasInterpol && (
                    <span className="px-1 py-0.2 text-[8px] font-mono font-bold rounded bg-blue-600 text-white">
                      INTERPOL
                    </span>
                  )}
                  {felon.charges.map((ch, idx) => (
                    <span
                      key={idx}
                      className="px-1 py-0.2 text-[8px] font-mono font-bold rounded bg-red-950 text-red-400 border border-red-800/40"
                    >
                      {ch}
                    </span>
                  ))}
                </div>

                <div className="text-[9px] text-slate-400 font-mono truncate pt-0.5">
                  {felon.location}
                </div>

              </div>

              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0" />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
