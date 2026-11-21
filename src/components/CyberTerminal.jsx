import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, ChevronRight, CornerDownLeft } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function CyberTerminal({
  isOpen,
  onClose,
  setActiveTab,
  setTheme,
  onSelectTarget,
  onOpenGraph,
  onOpenDispatch,
}) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'ARION CYBER CLI // v4.8.2 Defense Matrix Kernel Online.\nType "help" for tactical commands or click quick actions below.' },
  ]);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const runCommand = (cmdText) => {
    const cmd = cmdText.trim();
    if (!cmd) return;

    playClick();

    const newHistory = [...history, { type: 'user', text: `$ ${cmd}` }];
    const parts = cmd.toLowerCase().split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help':
        newHistory.push({
          type: 'system',
          text: [
            'AVAILABLE TACTICAL DIRECTIVES:',
            ' • view <dashboard|surveillance|cybercommand|livefeed|alerts|reporting|campaigns>',
            ' • target <alnami|elena|marcus|david|makarov>',
            ' • theme <cyberhud|cybercrime|cyan|vintage|amber|midnight|stealth>',
            ' • status (Display Core CPU, Memory, Node Uplinks, DEFCON)',
            ' • defcon <1|2|3|4|5> (Set Defense Threat Readiness)',
            ' • dispatch (Open Tactical Unit Deployment Simulator)',
            ' • graph (Load Intelligence Link Analysis)',
            ' • clear (Wipe Terminal Buffer)',
          ].join('\n'),
        });
        break;

      case 'status':
        newHistory.push({
          type: 'success',
          text: [
            'SYSTEM STATUS: ALL ENGINES OPERATIONAL (12/12)',
            '  UPLINK: 4/4 SATELLITE NODES SYNCHRONIZED [1.44 Gbps]',
            '  DEFCON: LEVEL 2 (ARMED FOR PRIORITY INTERCEPT)',
            '  NEURAL MESH: 17 JOINT KEYPOINTS TRACKING ACTIVE (60 FPS)',
            '  ENCRYPTION: QUANTUM AES-GCM-256 [ZULU TIME VALIDATED]',
          ].join('\n'),
        });
        break;

      case 'defcon':
        const lvl = parts[1];
        if (['1', '2', '3', '4', '5'].includes(lvl)) {
          newHistory.push({ type: 'success', text: `DEFCON threat posture updated to LEVEL ${lvl}.` });
        } else {
          newHistory.push({ type: 'error', text: 'Usage: defcon <1-5>' });
        }
        break;

      case 'view':
        const validViews = ['dashboard', 'surveillance', 'cybercommand', 'livefeed', 'alerts', 'reporting', 'campaigns'];
        if (parts[1]) {
          const tab = parts[1] === 'i4c' || parts[1] === 'cyber' ? 'cybercommand' : parts[1];
          if (validViews.includes(tab)) {
            setActiveTab(tab);
            newHistory.push({ type: 'success', text: `Switched active command view to: ${tab}` });
          } else {
            newHistory.push({ type: 'error', text: `Unknown view: ${tab}. Available: ${validViews.join(', ')}` });
          }
        } else {
          newHistory.push({ type: 'error', text: 'Usage: view <tab_name>' });
        }
        break;

      case 'target':
        const targetName = parts.slice(1).join(' ');
        if (targetName) {
          onSelectTarget({ name: targetName });
          newHistory.push({ type: 'success', text: `Loaded classified dossier for: ${targetName}` });
        } else {
          newHistory.push({ type: 'error', text: 'Usage: target <alnami|elena|marcus|david>' });
        }
        break;

      case 'theme':
        if (['cyberhud', 'cybercrime', 'cyan', 'vintage', 'amber', 'midnight', 'stealth'].includes(parts[1])) {
          setTheme(parts[1]);
          newHistory.push({ type: 'success', text: `HUD colorway reconfigured: ${parts[1]}` });
        } else if (parts[1]) {
          newHistory.push({ type: 'error', text: `Unknown theme: ${parts[1]}. Try: cyan, cyberhud, cybercrime, amber, vintage.` });
        } else {
          newHistory.push({ type: 'error', text: 'Usage: theme <cyberhud|cybercrime|cyan|vintage|amber>' });
        }
        break;

      case 'dispatch':
        onOpenDispatch();
        newHistory.push({ type: 'success', text: 'Opened Tactical Unit Dispatch Console' });
        break;

      case 'graph':
        onOpenGraph();
        newHistory.push({ type: 'success', text: 'Loaded Intelligence Relationship Graph' });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        onClose();
        return;

      default:
        newHistory.push({ type: 'error', text: `Unknown directive: "${cmd}". Type "help" for options.` });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    runCommand(inputVal);
  };

  const quickPills = [
    { label: 'help', cmd: 'help' },
    { label: 'status', cmd: 'status' },
    { label: 'view surveillance', cmd: 'view surveillance' },
    { label: 'view cybercommand', cmd: 'view cybercommand' },
    { label: 'target alnami', cmd: 'target alnami' },
    { label: 'theme amber', cmd: 'theme amber' },
    { label: 'dispatch', cmd: 'dispatch' },
    { label: 'clear', cmd: 'clear' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-2 border-t-2 border-cyan-400/80 bg-[#06090e]/95 p-3.5 font-mono text-xs text-slate-100 shadow-[0_-15px_40px_rgba(0,242,254,0.2)] backdrop-blur-xl max-h-80 overflow-hidden">
      {/* CLI Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] pb-2">
        <div className="flex items-center gap-2 font-bold text-cyan-300">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="font-tech tracking-wider text-white">ARION DEFENSE CYBER TERMINAL // CLI MATRIX</span>
          <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[8px] font-bold text-emerald-400">READY</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[10px] text-slate-500 sm:inline">Type "help" or click quick directives</span>
          <button
            type="button"
            onClick={() => {
              playBeep();
              onClose();
            }}
            className="rounded p-1 text-slate-400 hover:text-white"
            aria-label="Close terminal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output Log Buffer */}
      <div className="flex min-h-[110px] flex-1 flex-col gap-1 overflow-y-auto pr-1 custom-scrollbar">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed font-mono ${
              item.type === 'user'
                ? 'font-bold text-cyan-300'
                : item.type === 'success'
                ? 'text-emerald-400'
                : item.type === 'error'
                ? 'text-red-400'
                : 'text-slate-300'
            }`}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Quick Directives Row */}
      <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold shrink-0">DIRECTIVES:</span>
        {quickPills.map((pill) => (
          <button
            key={pill.label}
            type="button"
            onClick={() => runCommand(pill.cmd)}
            className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-slate-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Input Prompt Row */}
      <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.1] bg-black/50 px-3 py-2">
        <ChevronRight className="h-4 w-4 shrink-0 text-cyan-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleCommand}
          placeholder='Type a command (e.g., "help", "status", "view surveillance", "theme cyberhud")...'
          className="w-full bg-transparent font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
        />
        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-slate-600" />
      </div>
    </div>
  );
}
