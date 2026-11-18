import React, { useState } from 'react';
import { Video, Eye, ChevronRight } from 'lucide-react';
import { playClick } from '../utils/soundEngine';

export default function LiveFeedPanel({ onSelectFelon }) {
  const [selectedCam, setSelectedCam] = useState('NODE-01');

  const cameras = [
    { id: 'NODE-01', name: 'Crosswalk Alpha', image: '/assets/cctv_crosswalk_woman.jpg', target: 'Alnami (P-2204-02)' },
    { id: 'NODE-02', name: '4th St Junction', image: '/assets/cctv_dome_junction.jpg', target: 'Elena Rostova (4783-9A)' },
    { id: 'NODE-03', name: 'Street Crossway', image: '/assets/cctv_street_targets.jpg', target: 'Lina & Tim' },
    { id: 'NODE-04', name: 'I4C Command Floor', image: '/assets/cyber_crime_command.jpg', target: 'Syndicate Phoenix' }
  ];

  const currentCamData = cameras.find(c => c.id === selectedCam) || cameras[0];

  const cameraEvents = [
    { time: '14:33:02', event: 'Biometric Alert: Alnami (98.4% Sync Desync)', level: 'CRITICAL' },
    { time: '14:32:15', event: 'Optical Match: Elena Rostova (4783-9A Confirmed)', level: 'HIGH' },
    { time: '14:31:02', event: 'Plate Recognized: DL-01-AB-9012 (Black SUV)', level: 'HIGH' },
    { time: '14:28:44', event: 'Pose Keypoints Estimated: 17 Joint Mesh Tracked', level: 'INFO' },
  ];

  const felons = [
    {
      id: 'target-0',
      name: 'Alnami (P-2204-02)',
      mugshot: '/assets/suspect_face_scan.jpg',
      detectedAt: 'March 28, 2026 - 14:33:02',
      location: 'Crosswalk Alpha, Node #06',
      warrant: 'CRITICAL ANOMALY',
      threat: 'PRIORITY 1',
      matchPct: '98.4% Match',
      hasInterpol: true,
      charges: ['Offline Activity Flag', 'Social Sync Failure (1%)', 'Restricted Corridor'],
      address: 'Metropolitan Sector 6 Crossing',
      dob: 'April 19, 1995',
      height: "5'7\"",
      weight: '128 lbs',
      eyes: 'Brown',
      hair: 'Auburn / Brown',
      marks: 'Neural interface tattoo on left shoulder',
      currentCharges: ['Biometric Desynchronization', 'Unauthorized Movement In Crosswalk'],
      convictions: [
        { title: 'Surveillance Evasion (2024)', duration: 'Parole Active' },
        { title: 'Cybernetics Tampering (2022)', duration: '18 months probation' }
      ]
    },
    {
      id: 'target-1',
      name: 'Elena Rostova (4783-9A)',
      mugshot: '/assets/suspect_face_scan.jpg',
      detectedAt: 'March 28, 2026 - 14:32:15',
      location: '4th St & Main Junction Pedestrian Grid',
      warrant: 'SUBJECT CONFIRMED',
      threat: 'ELEVATED',
      matchPct: '96.8% Match',
      hasInterpol: true,
      charges: ['Espionage', 'Data Infiltration'],
      address: '4th St Corridor, Sector 4',
      dob: 'January 12, 1988',
      height: "5'9\"",
      weight: '142 lbs',
      eyes: 'Hazel',
      hair: 'Brown',
      marks: 'Scar below right collarbone',
      currentCharges: ['Corporate Espionage', 'Encrypted Comm Breach'],
      convictions: [
        { title: 'Intelligence Breach (2021)', duration: 'Sentenced 4 years' }
      ]
    },
    {
      id: 'target-2',
      name: 'Marcus Thompson',
      mugshot: '/assets/marcus_thompson.png',
      detectedAt: 'March 28, 2026 - 14:29:08',
      location: 'Substation 4, Camera #B-04',
      warrant: 'ACTIVE WARRANT',
      threat: 'CRITICAL THREAT',
      matchPct: '95.4% Match',
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
      id: 'target-3',
      name: 'Robert Mitchell',
      mugshot: '/assets/robert_mitchell.png',
      detectedAt: 'March 28, 2026 - 14:25:10',
      location: 'Downtown Shopping Center, Node #A-12',
      warrant: 'ACTIVE WARRANT',
      threat: 'HIGH THREAT',
      matchPct: '97.1% Match',
      hasInterpol: true,
      charges: ['Armed Robbery', 'Assault'],
      address: '247 Oak Street, Apt 3B, Springfield',
      dob: 'August 15, 1982',
      height: "6'2\"",
      weight: '210 lbs',
      eyes: 'Brown',
      hair: 'Black',
      marks: 'Scar on left cheek, tattoo on right forearm',
      currentCharges: ['Armed Robbery', 'Assault with Deadly Weapon'],
      convictions: [
        { title: 'Armed Robbery (2018)', duration: '5 years served' },
        { title: 'Burglary (2015)', duration: '2 years served' }
      ]
    },
    {
      id: 'target-4',
      name: 'David Richardson',
      mugshot: '/assets/david_richardson.png',
      detectedAt: 'March 28, 2026 - 14:15:30',
      location: 'Midtown Exchange, Camera #C-09',
      warrant: 'ACTIVE WARRANT',
      threat: 'HIGH THREAT',
      matchPct: '92.3% Match',
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
    }
  ];

  return (
    <div className="flex h-auto min-h-[300px] w-full shrink-0 select-none flex-col gap-3 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#080c12] p-3 font-sans shadow-xl shadow-black/10 custom-scrollbar lg:h-full lg:w-[272px] xl:w-[300px]">

      {/* Camera Selection Switcher Bar */}
      <div className="flex shrink-0 items-center justify-between gap-1 rounded-lg border border-white/[0.07] bg-black/20 p-1 font-mono text-[9px]">
        {cameras.map((cam) => (
          <button
            key={cam.id}
            onClick={() => {
              setSelectedCam(cam.id);
              playClick();
            }}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              selectedCam === cam.id
                ? 'bg-cyan-400/[0.13] text-cyan-200'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
            }`}
          >
            {cam.id}
          </button>
        ))}
      </div>

      {/* CCTV Video Feed Window with Real Image */}
      <div className="relative aspect-video shrink-0 overflow-hidden rounded-lg border border-white/[0.09] bg-slate-950 shadow-lg">
        <img
          src={currentCamData.image}
          alt={currentCamData.name}
          className="w-full h-full object-cover"
        />

        {/* Live Indicator */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/85 border border-slate-800 font-mono text-[9px] font-bold text-red-400 flex items-center gap-1.5 shadow">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>LIVE • {currentCamData.id}</span>
        </div>

        {/* Real-time Facial Tracking Box */}
        <div className="absolute top-[28%] left-[43%] w-14 h-16 border-2 border-cyan-400 rounded-sm shadow-[0_0_18px_rgba(0,242,254,0.7)] animate-pulse flex flex-col justify-between p-0.5 pointer-events-none">
          <div className="flex justify-between">
            <div className="w-1.5 h-1.5 border-t-2 border-l-2 border-cyan-300" />
            <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-300" />
          </div>
          <span className="text-[7.5px] font-mono text-cyan-300 bg-black/80 px-0.5 rounded self-center">
            LOCK
          </span>
          <div className="flex justify-between">
            <div className="w-1.5 h-1.5 border-b-2 border-l-2 border-cyan-300" />
            <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-cyan-300" />
          </div>
        </div>

        {/* Target name caption */}
        <div className="absolute bottom-1.5 inset-x-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[9.5px] text-cyan-300 font-bold truncate border border-slate-800">
          Target: {currentCamData.target}
        </div>
      </div>

      {/* Real-Time Camera Event Ticker Log */}
      <div className="flex shrink-0 flex-col gap-1 rounded-lg border border-white/[0.07] bg-[#0b1119] p-3 font-mono text-[10px]">
        <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-1">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>REAL-TIME BIOMETRIC LOGS</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold">RADAR-SYNC</span>
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
      <div className="flex min-h-[260px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b1119] p-3">

        {/* Section Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 shrink-0">
              <Video className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-200 tracking-tight font-sans">
              Detected Targets in Sector
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50">
            {felons.length} PROFILES
          </span>
        </div>

        {/* Scrollable Felons List */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
          {felons.map((felon) => (
            <button
              type="button"
              key={felon.id}
              onClick={() => {
                playClick();
                if (onSelectFelon) onSelectFelon(felon);
              }}
              className="w-full text-left p-2 rounded-xl bg-[#0b101e] border border-slate-800 flex gap-2.5 items-center hover:border-cyan-400 hover:bg-[#0e162a] transition-all group shadow-sm"
            >
              {/* Mugshot Image */}
              <div className="w-12 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                <img
                  src={felon.mugshot}
                  alt={felon.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Suspect Meta */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-100 text-xs truncate group-hover:text-cyan-300 transition-colors">
                    {felon.name}
                  </span>
                  <span className="px-1.5 py-0.2 text-[8px] font-bold rounded bg-red-950 text-red-400 border border-red-700/50">
                    {felon.threat}
                  </span>
                </div>

                <div className="text-[9px] text-slate-400">
                  {felon.detectedAt}
                </div>

                {/* Offenses Pills */}
                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                  <span className="px-1 py-0.2 text-[8px] font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                    {felon.matchPct}
                  </span>
                  {felon.charges.slice(0, 2).map((ch, idx) => (
                    <span
                      key={idx}
                      className="px-1 py-0.2 text-[8px] font-bold rounded bg-red-950/80 text-red-300 border border-red-800/40 truncate max-w-[120px]"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0" />
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
