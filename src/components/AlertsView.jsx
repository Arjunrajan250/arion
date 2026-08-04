import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Search, Filter, ShieldCheck, Zap, Radio, Send, Volume2, VolumeX, Eye, Activity } from 'lucide-react';
import { playClick, playAlarm, playBeep } from '../utils/soundEngine';

export default function AlertsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [acknowledgedIds, setAcknowledgedIds] = useState([]);
  const [dispatchedIds, setDispatchedIds] = useState([]);
  const [isSirenActive, setIsSirenActive] = useState(false);

  const alerts = [
    { id: 'ALT-901', timestamp: '21:56:02', title: 'Unauthorized Perimeter Breach', location: 'Sector 4 Vault', severity: 'CRITICAL', target: 'Marcus Thompson', sector: 'Sector 4', risk: '98%' },
    { id: 'ALT-884', timestamp: '21:54:19', title: 'Encrypted Radio Frequency Spike', location: 'Grid HJ-66 Relays', severity: 'HIGH', target: 'Dr. Aris Thorne', sector: 'Sector 2', risk: '92%' },
    { id: 'ALT-872', timestamp: '21:50:44', title: 'Vehicle License Plate Match (GTH-8891)', location: 'East Expressway Exit 9', severity: 'MEDIUM', target: 'David Richardson', sector: 'Sector 1', risk: '78%' },
    { id: 'ALT-865', timestamp: '21:44:10', title: 'CCTV Camera Offline Warning', location: 'Dockyard Pier 12', severity: 'LOW', target: 'Unidentified Relay', sector: 'Sector 3', risk: '45%' },
    { id: 'ALT-859', timestamp: '21:38:05', title: 'Satellite Telemetry Desync', location: 'Orbital Node 04', severity: 'HIGH', target: 'System Transponder', sector: 'Sector 2', risk: '84%' },
    { id: 'ALT-840', timestamp: '21:30:12', title: 'Biometric Access Key Failure', location: 'Armory Level 2', severity: 'CRITICAL', target: 'Unauthorized User', sector: 'Sector 4', risk: '95%' },
    { id: 'ALT-822', timestamp: '21:22:40', title: 'High Frequency Microwave Jamming', location: 'Substation 4 West', severity: 'HIGH', target: 'Marcus Thompson', sector: 'Sector 4', risk: '89%' },
    { id: 'ALT-810', timestamp: '21:15:00', title: 'Unflagged Drone Flight Corridor Breach', location: 'Skyline Sector B', severity: 'MEDIUM', target: 'Recon Target', sector: 'Sector 3', risk: '68%' },
  ];

  const toggleAcknowledge = (id) => {
    playClick();
    if (acknowledgedIds.includes(id)) {
      setAcknowledgedIds(acknowledgedIds.filter(i => i !== id));
    } else {
      setAcknowledgedIds([...acknowledgedIds, id]);
    }
  };

  const handleDispatch = (id) => {
    playAlarm();
    if (!dispatchedIds.includes(id)) {
      setDispatchedIds([...dispatchedIds, id]);
    }
  };

  const handleToggleSiren = () => {
    if (!isSirenActive) playAlarm();
    else playBeep();
    setIsSirenActive(!isSirenActive);
  };

  const filteredAlerts = alerts.filter(item => {
    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col bg-[#06080c] text-slate-100 p-4 gap-4 overflow-y-auto custom-scrollbar font-sans">
      
      {/* Top Threat Telemetry Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0 font-mono">
        <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-red-900/60 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">CRITICAL INCIDENTS</div>
            <div className="text-2xl font-black text-red-400 mt-0.5">14 ACTIVE</div>
          </div>
          <div className="p-2 rounded-lg bg-red-950/80 border border-red-700 text-red-400 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">RESPONSE PROTOCOL</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">LEVEL 4 LOCKDOWN</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">AVG DISPATCH ETA</div>
            <div className="text-2xl font-black text-cyan-400 mt-0.5">1.4 MINS</div>
          </div>
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-700 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">SIREN BROADCAST</div>
            <button 
              onClick={handleToggleSiren}
              className={`mt-1 px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSirenActive ? 'bg-red-600 text-white animate-bounce' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isSirenActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isSirenActive ? 'SIREN PLAYING' : 'BROADCAST SIREN'}</span>
            </button>
          </div>
          <Radio className={`w-5 h-5 ${isSirenActive ? 'text-red-400 animate-spin' : 'text-slate-600'}`} />
        </div>
      </div>

      {/* Sector Threat Density Heatmap Summary Bar */}
      <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shrink-0 shadow-lg">
        <div className="flex items-center gap-2 text-cyan-400 font-extrabold">
          <Activity className="w-4 h-4" />
          <span>SECTOR RISK HEATMAP SUMMARY:</span>
        </div>
        <div className="flex items-center gap-3">
          {[
            { sector: 'Sector 1', risk: '22%', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
            { sector: 'Sector 2', risk: '64%', color: 'bg-amber-950 text-amber-400 border-amber-800' },
            { sector: 'Sector 3', risk: '48%', color: 'bg-cyan-950 text-cyan-400 border-cyan-800' },
            { sector: 'Sector 4', risk: '98%', color: 'bg-red-950 text-red-400 border-red-700 animate-pulse' },
          ].map((s) => (
            <div key={s.sector} className={`px-3 py-1 rounded-lg border font-bold ${s.color}`}>
              {s.sector}: <span className="font-extrabold">{s.risk} DENSITY</span>
            </div>
          ))}
        </div>
      </div>

      {/* Header Bar: Filter & Search */}
      <div className="w-full p-3.5 rounded-xl bg-[#0b0e14] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-950/80 border border-red-700 text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">INCIDENT ESCALATION MATRIX</h2>
            <p className="text-xs text-slate-400">Real-Time Threat Logs & Tactical Response Actions</p>
          </div>
        </div>

        {/* Search & Severity Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-52">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search incidents or targets..."
              className="w-full bg-[#11141a] border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => {
                  setSeverityFilter(sev);
                  playClick();
                }}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  severityFilter === sev ? 'bg-cyan-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Matrix Log Table */}
      <div className="w-full flex-1 rounded-xl bg-[#090c12] border border-slate-800 overflow-hidden shadow-xl flex flex-col font-mono text-xs">
        <div className="px-4 py-2.5 bg-[#0e121b] border-b border-slate-800 flex items-center justify-between font-bold text-slate-300 uppercase tracking-wider text-[11px] shrink-0">
          <div className="w-24">INCIDENT ID</div>
          <div className="w-20">TIME</div>
          <div className="flex-1">DESCRIPTION & LOCATION</div>
          <div className="w-28 text-center">SEVERITY</div>
          <div className="w-36 text-center">TARGET</div>
          <div className="w-48 text-right">TACTICAL ACTION</div>
        </div>

        <div className="divide-y divide-slate-800/60 overflow-y-auto flex-1 custom-scrollbar">
          {filteredAlerts.map((alert) => {
            const isAck = acknowledgedIds.includes(alert.id);
            const isDispatched = dispatchedIds.includes(alert.id);

            return (
              <div 
                key={alert.id}
                className={`px-4 py-3 flex items-center justify-between transition-colors ${
                  isAck ? 'bg-slate-900/40 text-slate-400' : 'hover:bg-slate-800/40 text-slate-100'
                }`}
              >
                <div className="w-24 font-bold text-cyan-400">{alert.id}</div>
                <div className="w-20 text-slate-400">{alert.timestamp}</div>
                <div className="flex-1 pr-4">
                  <div className="font-bold text-white text-xs">{alert.title}</div>
                  <div className="text-[10px] text-slate-400">{alert.location} • <span className="text-cyan-400">{alert.sector}</span></div>
                </div>
                <div className="w-28 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.severity === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                    alert.severity === 'HIGH' ? 'bg-amber-500 text-black' :
                    alert.severity === 'MEDIUM' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="w-36 text-center font-bold text-slate-300">{alert.target}</div>
                <div className="w-48 text-right flex items-center justify-end gap-2">
                  
                  {/* Dispatch Tactical Unit Button */}
                  <button
                    onClick={() => handleDispatch(alert.id)}
                    className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                      isDispatched 
                        ? 'bg-emerald-950 border border-emerald-500 text-emerald-400' 
                        : 'bg-red-950 hover:bg-red-900 border border-red-700 text-red-300'
                    }`}
                  >
                    <Send className="w-3 h-3" />
                    <span>{isDispatched ? 'DISPATCHED' : 'DISPATCH'}</span>
                  </button>

                  {/* Acknowledge Toggle */}
                  <button
                    onClick={() => toggleAcknowledge(alert.id)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                      isAck 
                        ? 'bg-slate-800 text-slate-400 border border-slate-700' 
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                    }`}
                  >
                    {isAck ? 'ACK' : 'ACKNOWLEDGE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
