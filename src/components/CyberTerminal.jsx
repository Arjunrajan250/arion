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
  onOpenDispatch 
}) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'ARION Cyber Terminal CLI v4.8.2 Online. Type "help" for a list of tactical commands.' }
  ]);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const cmd = inputVal.trim();
    if (!cmd) return;

    playClick();

    const newHistory = [...history, { type: 'user', text: `$ ${cmd}` }];
    const parts = cmd.toLowerCase().split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help':
        newHistory.push({ 
          type: 'system', 
          text: 'Available Commands:\n - view <dashboard|surveillance|alerts|reporting|campaigns>\n - target <name>\n - theme <midnight|amber|stealth|crimson>\n - dispatch\n - graph\n - clear' 
        });
        break;

      case 'view':
        if (parts[1]) {
          setActiveTab(parts[1]);
          newHistory.push({ type: 'success', text: `Switched active view to: ${parts[1]}` });
        } else {
          newHistory.push({ type: 'error', text: 'Usage: view <tab_name>' });
        }
        break;

      case 'target':
        const targetName = parts.slice(1).join(' ');
        if (targetName) {
          onSelectTarget({ name: targetName });
          newHistory.push({ type: 'success', text: `Loaded dossier for target: ${targetName}` });
        } else {
          newHistory.push({ type: 'error', text: 'Usage: target <name>' });
        }
        break;

      case 'theme':
        if (parts[1]) {
          setTheme(parts[1]);
          newHistory.push({ type: 'success', text: `Changed HUD theme to: ${parts[1]}` });
        } else {
          newHistory.push({ type: 'error', text: 'Usage: theme <midnight|amber|stealth|crimson>' });
        }
        break;

      case 'dispatch':
        onOpenDispatch();
        newHistory.push({ type: 'success', text: 'Opened Tactical Unit Dispatch Console' });
        break;

      case 'graph':
        onOpenGraph();
        newHistory.push({ type: 'success', text: 'Loaded Intelligence Network Graph' });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({ type: 'error', text: `Unknown command: "${cmd}". Type "help" for options.` });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#07090d]/95 border-t-2 border-cyan-500/80 shadow-[0_-10px_30px_rgba(0,242,254,0.15)] font-mono text-xs text-slate-100 p-3 flex flex-col gap-2 max-h-64 overflow-hidden backdrop-blur-md">
      
      {/* CLI Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 shrink-0">
        <div className="flex items-center gap-2 text-cyan-400 font-extrabold">
          <Terminal className="w-4 h-4" />
          <span>ARION CYBER CLI TERMINAL MATRIX</span>
        </div>
        <button
          onClick={() => {
            playBeep();
            onClose();
          }}
          className="p-1 rounded text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Output Log Buffer */}
      <div className="flex-1 min-h-[100px] overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed ${
              item.type === 'user' ? 'text-cyan-300 font-bold' :
              item.type === 'success' ? 'text-emerald-400' :
              item.type === 'error' ? 'text-red-400' : 'text-slate-300'
            }`}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Input Prompt Row */}
      <div className="flex items-center gap-2 bg-[#0c0f16] border border-slate-800 rounded-lg px-3 py-1.5 shrink-0">
        <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleCommand}
          placeholder='Type a command (e.g., "help", "view surveillance", "theme amber")...'
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-xs"
        />
        <CornerDownLeft className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      </div>

    </div>
  );
}
