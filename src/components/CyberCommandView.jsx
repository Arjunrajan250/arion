import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Globe, Landmark, Ban, FileText, ArrowRight, Terminal, Lock, Activity
} from 'lucide-react';
import { playClick, playAlarm, playBeep } from '../utils/soundEngine';

const TRACE_STEPS = [
  'Initiating CFCFRMS / 1930 cyber fraud reporting cross-check…',
  'Matching transaction hash e8f4…b901 across five banking APIs…',
  'Offshore proxy host identified at TOR exit 185.220.101.42…',
  'UPI handle linked to simulated syndicate communication channel…',
  'Trace complete. Evidence package synchronized.',
];

export default function CyberCommandView({ onNotify }) {
  const [frozenAccounts, setFrozenAccounts] = useState([]);
  const [selectedMule, setSelectedMule] = useState(null);
  const [isTracing, setIsTracing] = useState(false);
  const [traceLog, setTraceLog] = useState([]);

  // Mule Accounts Dataset from Reference Image 5
  const initialMuleAccounts = [
    { 
      id: 'mule-1', 
      accountNumber: 'A/C-2314 5678 9012', 
      bank: 'State Bank of India', 
      branch: 'Connaught Place, New Delhi',
      holder: 'Karan Sharma', 
      amount: '₹50,000', 
      kyc: 'DUMMY AADHAAR FLAG', 
      phone: '+91 98112-XXXXX',
      registeredIp: '103.21.144.12',
      riskScore: 98
    },
    { 
      id: 'mule-2', 
      accountNumber: 'A/C-8765 4321 0987', 
      bank: 'HDFC Bank', 
      branch: 'Bandra Kurla Complex, Mumbai',
      holder: 'Rameshwar Verma', 
      amount: '₹50,000', 
      kyc: 'SYNTHETIC ID DETECTED', 
      phone: '+91 99201-XXXXX',
      registeredIp: '103.21.144.12',
      riskScore: 96
    },
    { 
      id: 'mule-3', 
      accountNumber: 'A/C-1122 3344 5566', 
      bank: 'ICICI Bank', 
      branch: 'Indiranagar, Bengaluru',
      holder: 'Deepak Patel', 
      amount: '₹50,000', 
      kyc: 'MULE RECRUIT (TELEGRAM)', 
      phone: '+91 94480-XXXXX',
      registeredIp: '103.21.144.12',
      riskScore: 94
    },
    { 
      id: 'mule-4', 
      accountNumber: 'A/C-6677 8899 0011', 
      bank: 'Punjab National Bank', 
      branch: 'Salt Lake Sector V, Kolkata',
      holder: 'Anil Kumar Bose', 
      amount: '₹50,000', 
      kyc: 'COMPROMISED KYC', 
      phone: '+91 98300-XXXXX',
      registeredIp: '103.21.144.12',
      riskScore: 97
    },
    { 
      id: 'mule-5', 
      accountNumber: 'A/C-9988 7766 5544', 
      bank: 'Axis Bank', 
      branch: 'Hitech City, Hyderabad',
      holder: 'Mohammed Farooq', 
      amount: '₹50,000', 
      kyc: 'SUSPICIOUS REPEAT BURST', 
      phone: '+91 98490-XXXXX',
      registeredIp: '103.21.144.12',
      riskScore: 99
    },
  ];

  // International Outflow Corridors from Reference Image 5
  const internationalHubs = [
    { id: 'hub-1', country: 'UNITED STATES', flag: '🇺🇸', amount: '$600', gateway: 'ACH / Fedwire Swift', status: 'INTERCEPT PENDING' },
    { id: 'hub-2', country: 'UNITED KINGDOM', flag: '🇬🇧', amount: '£450', gateway: 'CHAPS / Faster Payments', status: 'MONITORED' },
    { id: 'hub-3', country: 'SINGAPORE', flag: '🇸🇬', amount: '$800', gateway: 'FAST / PayNow Gateway', status: 'BLOCKED' },
    { id: 'hub-4', country: 'UNITED ARAB EMIRATES', flag: '🇦🇪', amount: '$700', gateway: 'UAE CBUAE IPI', status: 'INTERCEPT PENDING' },
    { id: 'hub-5', country: 'HONG KONG', flag: '🇭🇰', amount: '$550', gateway: 'FPS HKMA Tunnel', status: 'TRACED' },
  ];

  // Live Micro-Transactions Stream
  const [transactions, setTransactions] = useState([
    { id: 'TXN-9021', time: '14:03:21', source: 'UPI/SBI-2314', dest: 'Int. Wire (US)', amount: '₹50,000', status: 'FROZEN', anomaly: '99.4%' },
    { id: 'TXN-9020', time: '14:03:19', source: 'IMPS/HDFC-8765', dest: 'Int. Wire (UK)', amount: '₹50,000', status: 'FROZEN', anomaly: '98.9%' },
    { id: 'TXN-9019', time: '14:03:17', source: 'UPI/ICICI-1122', dest: 'Int. Wire (SG)', amount: '₹50,000', status: 'BLOCKED', anomaly: '97.2%' },
    { id: 'TXN-9018', time: '14:03:15', source: 'IMPS/PNB-6677', dest: 'Int. Wire (UAE)', amount: '₹50,000', status: 'INTERCEPTED', anomaly: '99.1%' },
    { id: 'TXN-9017', time: '14:03:14', source: 'UPI/AXIS-9988', dest: 'Int. Wire (HK)', amount: '₹50,000', status: 'FLAGGED', anomaly: '98.5%' },
    { id: 'TXN-9016', time: '14:03:08', source: 'RTGS/MULE-CORR', dest: 'Crypto Ramp', amount: '₹1,20,000', status: 'ISOLATED', anomaly: '99.8%' },
  ]);

  const allFrozen = initialMuleAccounts.every((account) => frozenAccounts.includes(account.id));

  const handleFreezeAccount = (accountId) => {
    if (frozenAccounts.includes(accountId)) return;
    playAlarm();
    const bankCode = { 'mule-1': 'SBI', 'mule-2': 'HDFC', 'mule-3': 'ICICI', 'mule-4': 'PNB', 'mule-5': 'AXIS' }[accountId];
    setFrozenAccounts((current) => [...current, accountId]);
    setTransactions((current) => current.map((transaction) => transaction.source.includes(bankCode) ? { ...transaction, status: 'FROZEN' } : transaction));
    onNotify?.('Account freeze recorded and linked transactions updated.');
  };

  const handleFreezeAll = () => {
    if (allFrozen) return;
    playAlarm();
    setFrozenAccounts(initialMuleAccounts.map((account) => account.id));
    setTransactions((current) => current.map((transaction) => ({ ...transaction, status: 'FROZEN' })));
    onNotify?.('All five flagged accounts have been frozen in this simulation.');
  };

  useEffect(() => {
    if (!isTracing) return undefined;
    let stepIndex = 0;
    const timer = window.setInterval(() => {
      const text = TRACE_STEPS[stepIndex];
      setTraceLog((current) => [...current, { text, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) }]);
      stepIndex += 1;
      if (stepIndex === TRACE_STEPS.length) {
        window.clearInterval(timer);
        setIsTracing(false);
      }
    }, 650);
    return () => window.clearInterval(timer);
  }, [isTracing]);

  const handleStartTrace = () => {
    playBeep();
    setTraceLog([]);
    setIsTracing(true);
  };

  const handleGenerateNotice = () => {
    if (!selectedMule) return;
    playBeep();
    const notice = [
      'ARION — SECTION 91 INFORMATION REQUEST (DEMONSTRATION)',
      `Generated: ${new Date().toISOString()}`,
      `Bank: ${selectedMule.bank}`,
      `Branch: ${selectedMule.branch}`,
      `Account: ${selectedMule.accountNumber}`,
      `Registered holder: ${selectedMule.holder}`,
      'Please preserve relevant transaction and KYC records for incident #I4C-MULE-2026-0981.',
      'This file was generated locally with demonstration data.',
    ].join('\n\n');
    const url = URL.createObjectURL(new Blob([notice], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedMule.id}-section-91-notice.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    onNotify?.('Section 91 information request downloaded.');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050913] text-slate-100 p-3 sm:p-5 gap-4 overflow-y-auto custom-scrollbar font-sans relative">
      
      {/* Background Command Center Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 bg-cover bg-center mix-blend-screen"
        style={{ backgroundImage: 'url("/assets/cyber_crime_command.jpg")' }}
      />

      {/* Official Government Command Header (Reference Image 5) */}
      <div className="relative z-10 w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#070e1e] via-[#091428] to-[#070e1e] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        
        {/* State Emblem & Organization Title */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="relative p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center shrink-0">
            <Landmark className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-mono font-black tracking-widest text-amber-400 uppercase">
                सत्यमेव जयते • GOVERNMENT OF INDIA
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-950/90 border border-red-500/50 text-[10px] font-mono font-bold text-red-300 animate-pulse">
                I4C LIVE MATRIX
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black font-sans tracking-wide text-white drop-shadow-md">
              INDIAN CYBER CRIME COORDINATION CENTRE
            </h1>
            <p className="text-xs text-slate-300 font-mono">
              MINISTRY OF HOME AFFAIRS • FINANCIAL FRAUD RISK MITIGATION DIVISION
            </p>
          </div>
        </div>

        {/* Action Controls & Emergency Freeze Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleStartTrace}
            disabled={isTracing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40 shadow-sm transition-all"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>{isTracing ? 'Tracing syndicate…' : traceLog.length ? 'Run trace again' : 'Trace syndicate IP'}</span>
          </button>

          <button
            onClick={handleFreezeAll}
            disabled={allFrozen}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-black tracking-wider uppercase transition-all shadow-xl ${
              allFrozen 
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                : 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white hover:brightness-110 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>{allFrozen ? 'ALL 5 MULE ACCOUNTS FROZEN' : 'FREEZE ALL MULE ACCOUNTS'}</span>
          </button>
        </div>
      </div>

      {/* Iconic High-Priority Alert Banner (Directly from Reference Image 5) */}
      <div className="relative z-10 w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/95 via-[#1a080c] to-red-950/95 border-2 border-red-600/80 shadow-[0_0_35px_rgba(239,68,68,0.35)] flex flex-col items-center justify-center text-center gap-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-red-400 font-black font-mono text-sm sm:text-base tracking-widest uppercase">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-bounce" />
          <span>SUSPICIOUS ACTIVITY DETECTED</span>
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-bounce" />
        </div>

        <h2 className="text-base sm:text-xl font-extrabold text-white tracking-wide font-sans">
          MULTIPLE ACCOUNTS RECEIVING SAME AMOUNT
        </h2>

        <div className="text-3xl sm:text-5xl font-black font-mono text-red-400 tracking-wider text-glow-red my-1 animate-pulse">
          ₹50,000
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-red-200/90 flex-wrap justify-center mt-1">
          <span className="px-2.5 py-0.5 rounded bg-black/60 border border-red-500/50">
            INCIDENT ID: #I4C-MULE-2026-0981
          </span>
          <span className="px-2.5 py-0.5 rounded bg-black/60 border border-red-500/50 text-amber-300">
            BURST VELOCITY: 5 TRANSFERS IN 7 SECONDS
          </span>
          <span className="px-2.5 py-0.5 rounded bg-black/60 border border-red-500/50 text-emerald-400">
            CFCFRMS DISPATCH: ACTIVE
          </span>
        </div>
      </div>

      {/* Main Forensic Grid: Mule Network Flow Graph + Live Ticker */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* Left 8 Cols: Interactive Mule Network Flow Diagram (Reference Image 5 Visual) */}
        <div className="xl:col-span-8 flex flex-col gap-3 rounded-2xl bg-[#070d1a]/95 border border-slate-800 p-4 shadow-2xl overflow-hidden min-h-[480px]">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Activity className="w-4 h-4" />
              <span>LIVE MULE NETWORK CORRIDOR TOPOLOGY</span>
            </div>
            <span className="text-slate-400">
              5 Domestic Nodes ➔ 1 Central Threat Nexus ➔ 5 Offshore Gateways
            </span>
          </div>

          {/* Interactive Network Diagram */}
          <div className="relative flex-1 w-full bg-[#040812] rounded-xl border border-slate-800/80 p-4 flex flex-col justify-between overflow-x-auto min-h-[380px]">
            
            <div className="grid grid-cols-3 gap-2 sm:gap-6 items-center h-full min-w-[650px]">
              
              {/* Column 1: Domestic Indian Bank Accounts (Left Side) */}
              <div className="flex flex-col justify-around gap-2.5 h-full">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800">
                  <Landmark className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MULE ACCOUNTS (₹50,000 EACH)</span>
                </div>

                {initialMuleAccounts.map((mule) => {
                  const isFrozen = frozenAccounts.includes(mule.id);
                  const isSelected = selectedMule?.id === mule.id;

                  return (
                    <button
                      type="button"
                      key={mule.id}
                      onClick={() => {
                        setSelectedMule(mule);
                        playClick();
                      }}
                      aria-pressed={isSelected}
                      className={`w-full text-left p-2 sm:p-2.5 rounded-xl border transition-all font-mono text-xs flex items-center justify-between gap-2 shadow-md ${
                        isFrozen 
                          ? 'bg-slate-900/90 border-slate-700 opacity-60' 
                          : isSelected
                          ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                          : 'bg-[#091122] border-slate-800 hover:border-red-500/70 hover:bg-[#0c162e]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg shrink-0 ${isFrozen ? 'bg-slate-800 text-slate-400' : 'bg-red-950 text-red-400 border border-red-800/60'}`}>
                          <Landmark className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-white text-[11px] truncate">{mule.accountNumber}</div>
                          <div className="text-[9.5px] text-slate-400 truncate">{mule.bank}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-black text-xs ${isFrozen ? 'text-slate-400 line-through' : 'text-red-400 font-mono'}`}>
                          {mule.amount}
                        </div>
                        <span className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded ${
                          isFrozen ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-300 border border-red-700/50'
                        }`}>
                          {isFrozen ? 'FROZEN' : 'ACTIVE MULE'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Column 2: Central Criminal Threat Node (Middle) */}
              <div className="flex flex-col items-center justify-center text-center p-4">
                
                {/* Visual Connection Waveguides */}
                <div className="relative flex flex-col items-center">
                  
                  {/* Outer Pulsing Threat Rings */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-red-950/40 border-2 border-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/90 border border-red-500/60 flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-8 h-8 rounded-full bg-red-600/30 flex items-center justify-center text-red-400 mb-1">
                        <Lock className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-[10px] font-mono font-black text-red-300 uppercase leading-tight">
                        SYNDICATE PHOENIX
                      </span>
                    </div>

                    {/* Orbiting Sensor Indicators */}
                    <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                    <div className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  </div>

                  {/* Threat Nexus Details Badge */}
                  <div className="mt-3 p-2 rounded-xl bg-slate-950/90 border border-red-500/40 font-mono text-[10px] text-slate-300 space-y-0.5 shadow-lg max-w-[210px]">
                    <div className="text-red-400 font-bold">TOR EXIT: 185.220.101.42</div>
                    <div className="text-slate-400">Smurfing Split: 5 Streams</div>
                    <div className="text-amber-400 font-bold">TOTAL: ₹2,50,000 (INR)</div>
                  </div>

                </div>

              </div>

              {/* Column 3: International Siphoning Outflows (Right Side) */}
              <div className="flex flex-col justify-around gap-2.5 h-full">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>INTERNATIONAL OUTFLOW HUBS</span>
                </div>

                {internationalHubs.map((hub) => (
                  <div
                    key={hub.id}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#091122] border border-slate-800 font-mono text-xs flex items-center justify-between gap-2 shadow-md hover:border-amber-500/50 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{hub.flag}</span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-white text-[11px] truncate">{hub.country}</div>
                        <div className="text-[9.5px] text-slate-400 truncate">{hub.gateway}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-amber-400 text-xs">{hub.amount}</div>
                      <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded ${
                        hub.status === 'BLOCKED' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {hub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Forensics Log Stream (Appears when Trace is clicked) */}
          {(isTracing || traceLog.length > 0) && (
            <div className="p-3 rounded-xl bg-black/90 border border-cyan-500/50 font-mono text-xs text-cyan-300 space-y-1 animate-in fade-in">
              <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-cyan-900/50 pb-1">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CFCFRMS / I4C INCIDENT FORENSIC TRACE LOG</span>
                </span>
                <span className="text-[10px] text-emerald-400 animate-pulse">STREAM SYNCHRONIZED</span>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar text-[10px]">
                {traceLog.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-cyan-500">[{log.time}]</span>
                    <span className="text-slate-200">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 4 Cols: Account Inspector & Real-Time Transaction Stream */}
        <div className="xl:col-span-4 flex flex-col gap-3 min-h-0">
          
          {/* Selected Mule Account Dossier Card */}
          <div className="p-3.5 rounded-2xl bg-[#080e1c] border border-slate-800 flex flex-col gap-2.5 shadow-xl font-mono text-xs shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-amber-400 font-black">
                <Landmark className="w-4 h-4" />
                <span>MULE ACCOUNT FORENSICS</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">NPCI FAST-TRACK</span>
            </div>

            {selectedMule ? (
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Account:</span>
                  <span className="font-bold text-white">{selectedMule.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank & Branch:</span>
                  <span className="font-bold text-slate-200">{selectedMule.bank} ({selectedMule.branch})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Beneficiary Holder:</span>
                  <span className="font-bold text-red-300">{selectedMule.holder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">KYC Anomaly:</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">
                    {selectedMule.kyc}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered Mobile:</span>
                  <span className="font-mono text-slate-300">{selectedMule.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Severity:</span>
                  <span className="font-bold text-red-400">{selectedMule.riskScore}% CRITICAL</span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleFreezeAccount(selectedMule.id)}
                    disabled={frozenAccounts.includes(selectedMule.id)}
                    className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 disabled:bg-emerald-800"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>{frozenAccounts.includes(selectedMule.id) ? 'Account frozen' : 'Freeze Account'}</span>
                  </button>
                  <button
                    onClick={handleGenerateNotice}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Notice</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                Select any domestic bank account on the left to inspect KYC credentials and trigger bank freeze notices.
              </div>
            )}
          </div>

          {/* Real-time Incident Live Transaction Stream Table */}
          <div className="flex-1 rounded-2xl bg-[#080e1c] border border-slate-800 p-3 flex flex-col gap-2 shadow-xl font-mono text-xs min-h-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 shrink-0">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Activity className="w-4 h-4" />
                <span>LIVE FRAUD TRANSACTIONS</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">60 SEC BUFFER</span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {transactions.map((txn) => (
                <div 
                  key={txn.id}
                  className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-cyan-500/50 transition-all"
                >
                  <div>
                    <div className="font-extrabold text-white text-[11px] flex items-center gap-1.5">
                      <span>{txn.source}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-300">{txn.dest}</span>
                    </div>
                    <div className="text-[9.5px] text-slate-400 mt-0.5">
                      {txn.id} • {txn.time} • Risk: <span className="text-red-400 font-bold">{txn.anomaly}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-red-400 text-xs">{txn.amount}</div>
                    <span className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded ${
                      txn.status === 'FROZEN' ? 'bg-emerald-950 text-emerald-400' :
                      txn.status === 'BLOCKED' ? 'bg-cyan-950 text-cyan-300' : 'bg-red-950 text-red-300'
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
