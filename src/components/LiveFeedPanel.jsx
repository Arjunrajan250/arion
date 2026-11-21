import React, { useState } from 'react';
import { ChevronRight, Eye, Video } from 'lucide-react';
import { playClick } from '../utils/soundEngine';

export default function LiveFeedPanel({ onSelectFelon }) {
  const [selectedCam, setSelectedCam] = useState('NODE-01');

  const cameras = [
    { id: 'NODE-01', name: 'Crosswalk Alpha', image: '/assets/cctv_crosswalk_woman.jpg', target: 'Alnami (P-2204-02)', fps: '60 FPS', res: '4K UHD' },
    { id: 'NODE-02', name: '4th St Junction', image: '/assets/cctv_dome_junction.jpg', target: 'Elena Rostova (4783-9A)', fps: '60 FPS', res: '4K UHD' },
    { id: 'NODE-03', name: 'Street Crossway', image: '/assets/cctv_street_targets.jpg', target: 'Lina & Tim', fps: '30 FPS', res: '1080p' },
    { id: 'NODE-04', name: 'I4C Command Floor', image: '/assets/cyber_crime_command.jpg', target: 'Syndicate Phoenix', fps: '60 FPS', res: '4K UHD' },
  ];

  const currentCamData = cameras.find((c) => c.id === selectedCam) || cameras[0];

  const cameraEvents = [
    { time: '14:33:02', event: 'Biometric Alert: Alnami (98.4% Desync)', level: 'CRITICAL' },
    { time: '14:32:15', event: 'Optical Match: Elena Rostova Confirmed', level: 'HIGH' },
    { time: '14:31:02', event: 'Plate Match: DL-01-AB-9012 (Black SUV)', level: 'HIGH' },
    { time: '14:28:44', event: 'Pose Keypoints: 17 Joint Mesh Tracked', level: 'INFO' },
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
        { title: 'Cybernetics Tampering (2022)', duration: '18 months probation' },
      ],
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
        { title: 'Intelligence Breach (2021)', duration: 'Sentenced 4 years' },
      ],
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
        { title: 'Robbery (2016)', duration: '4 years served' },
      ],
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
        { title: 'Burglary (2015)', duration: '2 years served' },
      ],
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
        { title: 'Assault (2020)', duration: '2 years served' },
      ],
    },
  ];

  return (
    <aside className="flex h-auto min-h-[300px] w-full shrink-0 select-none flex-col gap-3 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#070b12] p-3 font-sans shadow-xl shadow-black/20 custom-scrollbar lg:h-full lg:w-[280px] xl:w-[310px]">
      {/* Camera Selection Switcher Bar */}
      <div className="flex shrink-0 items-center justify-between gap-1 rounded-xl border border-white/[0.07] bg-black/40 p-1 font-mono text-[9px]">
        {cameras.map((cam) => (
          <button
            key={cam.id}
            type="button"
            onClick={() => {
              setSelectedCam(cam.id);
              playClick();
            }}
            className={`flex-1 rounded-lg py-1 font-bold transition-all text-center ${
              selectedCam === cam.id
                ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 shadow-sm'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
            }`}
          >
            {cam.id.replace('NODE-', 'N-')}
          </button>
        ))}
      </div>

      {/* CCTV Video Feed Window with Real Image */}
      <div className="tactical-corner relative aspect-video shrink-0 overflow-hidden rounded-xl border border-white/[0.09] bg-slate-950 shadow-lg">
        <img
          src={currentCamData.image}
          alt={currentCamData.name}
          className="h-full w-full object-cover"
        />

        {/* Live Indicator Banner */}
        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-black/85 px-2 py-0.5 font-mono text-[9px] font-bold text-red-400 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span>REC ● {currentCamData.id}</span>
        </div>

        {/* Camera Resolution / Frame Rate Ticker */}
        <div className="absolute right-2 top-2 rounded border border-white/10 bg-black/80 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-cyan-300 backdrop-blur-sm">
          {currentCamData.res} · {currentCamData.fps}
        </div>

        {/* Real-time Facial Tracking Box */}
        <div className="pointer-events-none absolute left-[43%] top-[28%] flex h-16 w-14 flex-col justify-between rounded-sm border-2 border-cyan-400 p-0.5 shadow-[0_0_18px_rgba(0,242,254,0.7)] animate-pulse">
          <div className="flex justify-between">
            <div className="h-1.5 w-1.5 border-l-2 border-t-2 border-cyan-300" />
            <div className="h-1.5 w-1.5 border-r-2 border-t-2 border-cyan-300" />
          </div>
          <span className="self-center rounded bg-black/80 px-0.5 font-mono text-[7.5px] font-bold text-cyan-300">
            LOCK
          </span>
          <div className="flex justify-between">
            <div className="h-1.5 w-1.5 border-b-2 border-l-2 border-cyan-300" />
            <div className="h-1.5 w-1.5 border-b-2 border-r-2 border-cyan-300" />
          </div>
        </div>

        {/* Target Name Caption */}
        <div className="absolute inset-x-2 bottom-1.5 truncate rounded-lg border border-slate-800 bg-black/85 px-2 py-1 font-mono text-[9px] font-bold text-cyan-300 backdrop-blur-sm">
          Target: {currentCamData.target}
        </div>
      </div>

      {/* Real-Time Camera Event Ticker Log */}
      <div className="flex shrink-0 flex-col gap-1 rounded-xl border border-white/[0.07] bg-[#090d16] p-2.5 font-mono text-[10px]">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5 text-cyan-400 font-bold">
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            <span className="font-tech text-xs tracking-wider">BIOMETRIC OPTICAL LOG</span>
          </div>
          <span className="font-mono text-[8px] font-bold text-emerald-400">ACTIVE</span>
        </div>

        <div className="max-h-20 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
          {cameraEvents.map((ev, i) => (
            <div key={i} className="flex items-center justify-between text-[9px]">
              <span className="font-mono text-slate-500">{ev.time}</span>
              <span
                className={`truncate pl-1 font-semibold ${
                  ev.level === 'CRITICAL'
                    ? 'text-red-400'
                    : ev.level === 'HIGH'
                    ? 'text-amber-400'
                    : 'text-slate-300'
                }`}
              >
                {ev.event}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suspects & Felons List Container */}
      <div className="flex min-h-[260px] flex-1 flex-col gap-2 overflow-hidden rounded-xl border border-white/[0.07] bg-[#090d16] p-2.5">
        {/* Section Header */}
        <div className="flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/60 p-1 text-cyan-400 shrink-0">
              <Video className="h-3.5 w-3.5" />
            </div>
            <span className="font-tech text-xs font-bold uppercase tracking-wider text-slate-200">
              Sector Targets
            </span>
          </div>
          <span className="rounded-md border border-amber-500/30 bg-amber-950/50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
            {felons.length} PROFILES
          </span>
        </div>

        {/* Scrollable Felons List */}
        <div className="flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
          {felons.map((felon) => (
            <button
              type="button"
              key={felon.id}
              onClick={() => {
                playClick();
                onSelectFelon?.(felon);
              }}
              className="tactical-corner group flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-black/30 p-2 text-left transition-all hover:border-[var(--theme-accent)] hover:bg-black/60 shadow-sm"
            >
              {/* Mugshot Image */}
              <div className="relative h-12 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
                <img
                  src={felon.mugshot}
                  alt={felon.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              {/* Suspect Meta */}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 font-mono">
                <div className="flex items-center justify-between">
                  <span className="truncate font-tech text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {felon.name}
                  </span>
                  <span className="rounded bg-red-950/80 px-1 py-0.2 font-mono text-[8px] font-bold text-red-400 border border-red-700/50">
                    {felon.threat}
                  </span>
                </div>

                <div className="text-[9px] text-slate-500 truncate">
                  {felon.location}
                </div>

                {/* Offenses Pills */}
                <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                  <span className="rounded bg-cyan-950/80 px-1 py-0.2 text-[8px] font-bold text-cyan-300 border border-cyan-800/50">
                    {felon.matchPct}
                  </span>
                  {felon.charges.slice(0, 1).map((ch, idx) => (
                    <span
                      key={idx}
                      className="truncate max-w-[100px] rounded bg-white/5 px-1 py-0.2 text-[8px] font-medium text-slate-400 border border-white/5"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition-colors group-hover:text-[var(--theme-accent)]" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
