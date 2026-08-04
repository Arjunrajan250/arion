import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import TacticalMap from './components/TacticalMap';
import LiveFeedPanel from './components/LiveFeedPanel';
import FelonModal from './components/FelonModal';
import SurveillanceView from './components/SurveillanceView';
import AlertsView from './components/AlertsView';
import ReportingView from './components/ReportingView';
import CampaignsView from './components/CampaignsView';
import LiveFeedView from './components/LiveFeedView';
import CommandPalette from './components/CommandPalette';
import IntelligenceGraphModal from './components/IntelligenceGraphModal';
import AudioInterceptModal from './components/AudioInterceptModal';
import DispatchSimulatorModal from './components/DispatchSimulatorModal';
import CyberTerminal from './components/CyberTerminal';
import DossierPdfModal from './components/DossierPdfModal';
import { AlertTriangle } from 'lucide-react';
import { toggleMute, isMuted } from './utils/soundEngine';
import { initSpeechRecognition, speakText } from './utils/voiceAssistant';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('surveillance');
  const [theme, setTheme] = useState('midnight'); // midnight, amber, stealth, crimson
  const [mutedState, setMutedState] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);

  // New Feature Modals
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  // Modals state
  const [selectedFelon, setSelectedFelon] = useState(null);
  const [selectedAudioIntercept, setSelectedAudioIntercept] = useState({
    id: '1',
    flag: '🇵🇰',
    number: '555-234-9876',
    dest: '555-879-3456',
    type: 'Incoming',
    isAlert: true
  });
  const [selectedCamera, setSelectedCamera] = useState('CCTV-X5');

  // Voice Assistant Initialization
  const [recognition, setRecognition] = useState(null);

  const handleToggleVoice = () => {
    if (isVoiceActive) {
      if (recognition) recognition.stop();
      setIsVoiceActive(false);
      speakText('Voice Assistant Deactivated.');
    } else {
      const rec = initSpeechRecognition((command) => {
        handleVoiceCommand(command);
      }, (active) => setIsVoiceActive(active));

      if (rec) {
        rec.start();
        setRecognition(rec);
      }
    }
  };

  const handleVoiceCommand = (cmd) => {
    if (cmd.includes('dashboard')) {
      setActiveTab('dashboard');
      speakText('Switched to main dashboard.');
    } else if (cmd.includes('surveillance')) {
      setActiveTab('surveillance');
      speakText('Switched to live surveillance grid.');
    } else if (cmd.includes('alert')) {
      setActiveTab('alerts');
      speakText('Loading tactical alerts matrix.');
    } else if (cmd.includes('report')) {
      setActiveTab('reporting');
      speakText('Opening intelligence dossier reporting.');
    } else if (cmd.includes('campaign')) {
      setActiveTab('campaigns');
      speakText('Opening campaign operations.');
    } else if (cmd.includes('terminal') || cmd.includes('command line')) {
      setIsTerminalOpen(true);
      speakText('Cyber Terminal CLI online.');
    } else if (cmd.includes('dispatch')) {
      setIsDispatchOpen(true);
      speakText('Opening unit dispatch simulator.');
    } else if (cmd.includes('graph')) {
      setIsGraphOpen(true);
      speakText('Loading intelligence node network graph.');
    }
  };

  const handleToggleMute = () => {
    const nextMuted = toggleMute();
    setMutedState(nextMuted);
  };

  if (showSplash) {
    return <SplashScreen onLaunch={() => setShowSplash(false)} />;
  }

  // Theme Overlay Color Maps
  const themeStyles = {
    midnight: { bg: 'bg-[#050608]', border: 'border-slate-800/90', glow: 'rgba(12, 25, 40, 0.9)' },
    amber: { bg: 'bg-[#0c0a05]', border: 'border-amber-900/60', glow: 'rgba(40, 30, 10, 0.9)' },
    stealth: { bg: 'bg-[#040404]', border: 'border-slate-900', glow: 'rgba(20, 20, 20, 0.9)' },
    crimson: { bg: 'bg-[#0d0505]', border: 'border-red-900/70', glow: 'rgba(40, 10, 10, 0.9)' },
  }[theme] || { bg: 'bg-[#050608]', border: 'border-slate-800/90', glow: 'rgba(12, 25, 40, 0.9)' };

  return (
    <div className={`w-screen h-screen ${themeStyles.bg} text-slate-100 flex items-center justify-center p-2 font-sans select-none overflow-hidden relative transition-colors duration-500`}>
      
      {/* Dark Ambient Backdrop */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-60 transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${themeStyles.glow} 0%, #030406 100%)`
        }}
      />

      {/* Main Tactical Window Frame */}
      <div className={`relative z-10 w-full h-full rounded-2xl border ${themeStyles.border} bg-[#090b0e] shadow-[0_30px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden`}>
        
        {/* Main Header */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          alertCount={54} 
          onToggleSplash={() => setShowSplash(true)}
          onOpenCmdPalette={() => setIsCmdPaletteOpen(true)}
          isMuted={mutedState}
          onToggleMute={handleToggleMute}
          currentTheme={theme}
          setTheme={setTheme}
          isVoiceActive={isVoiceActive}
          onToggleVoice={handleToggleVoice}
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onOpenGraph={() => setIsGraphOpen(true)}
          onOpenDispatch={() => setIsDispatchOpen(true)}
          onOpenPdf={() => setIsPdfOpen(true)}
        />

        {/* Subheader / Status Bar Row */}
        <div className="w-full px-6 py-2 flex items-center justify-between z-20 shrink-0 border-b border-slate-800/80 gap-6 overflow-hidden bg-[#07090c]">
          
          {/* Location Title & Clock */}
          <div className="flex items-baseline gap-3 shrink-0">
            <h1 className="text-xl sm:text-2xl font-black italic tracking-tight text-white font-sans whitespace-nowrap">
              Gotham HJ 66,
            </h1>
            <span className="text-xs sm:text-sm font-mono font-semibold text-slate-300 whitespace-nowrap">
              Tue, Mar 25 2025, 09:56:23 PM
            </span>
          </div>

          {/* Warning Notification Banner */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-red-950/80 border border-red-700/80 text-xs sm:text-sm font-sans font-medium text-red-100 shadow-lg shrink min-w-0 overflow-hidden">
            <span className="truncate text-xs sm:text-sm font-medium">
              Individuals followed designated routes, and no suspicious activities or unauthorized entries were observed.
            </span>
            <div className="p-1 rounded bg-red-600 text-white font-extrabold shrink-0 shadow-sm">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* Dynamic View Rendering based on activeTab */}
        <main className="flex-1 w-full p-3 pt-2 flex gap-3 overflow-hidden relative min-h-0">
          
          {activeTab === 'dashboard' && (
            <>
              <MetricsOverview />
              <TacticalMap 
                selectedCamera={selectedCamera}
                onSelectCamera={setSelectedCamera}
                onSelectAudioIntercept={(audio) => {
                  setSelectedAudioIntercept(audio);
                  setIsAudioOpen(audio);
                }}
                activeAudioIntercept={selectedAudioIntercept}
                onCloseAudioIntercept={() => setSelectedAudioIntercept(null)}
                onSelectTarget={(target) => setSelectedFelon({ name: target.title || target.name })}
              />
              <LiveFeedPanel onSelectFelon={setSelectedFelon} />
            </>
          )}

          {activeTab === 'surveillance' && (
            <SurveillanceView onSelectFelon={setSelectedFelon} />
          )}

          {activeTab === 'alerts' && (
            <AlertsView />
          )}

          {activeTab === 'reporting' && (
            <ReportingView />
          )}

          {activeTab === 'campaigns' && (
            <CampaignsView />
          )}

          {activeTab === 'livefeed' && (
            <LiveFeedView onSelectFelon={setSelectedFelon} />
          )}

        </main>

        {/* Felon Dossier Modal Overlay */}
        {selectedFelon && (
          <FelonModal 
            felon={selectedFelon} 
            onClose={() => setSelectedFelon(null)} 
          />
        )}

        {/* Command Palette Modal Overlay */}
        <CommandPalette
          isOpen={isCmdPaletteOpen}
          onClose={setIsCmdPaletteOpen}
          setActiveTab={setActiveTab}
          setTheme={setTheme}
          isMuted={mutedState}
          onToggleMute={handleToggleMute}
          onSelectTarget={(target) => setSelectedFelon(target)}
        />

        {/* Intelligence Network Graph Modal */}
        <IntelligenceGraphModal
          isOpen={isGraphOpen}
          onClose={() => setIsGraphOpen(false)}
          onSelectTarget={(target) => setSelectedFelon(target)}
        />

        {/* Audio Intercept Waveform & Transcriber Modal */}
        {isAudioOpen && (
          <AudioInterceptModal
            intercept={isAudioOpen}
            onClose={() => setIsAudioOpen(null)}
          />
        )}

        {/* Dispatch Simulator Modal */}
        <DispatchSimulatorModal
          isOpen={isDispatchOpen}
          onClose={() => setIsDispatchOpen(false)}
        />

        {/* Cyber Terminal CLI */}
        <CyberTerminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          setActiveTab={setActiveTab}
          setTheme={setTheme}
          onSelectTarget={(target) => setSelectedFelon(target)}
          onOpenGraph={() => setIsGraphOpen(true)}
          onOpenDispatch={() => setIsDispatchOpen(true)}
        />

        {/* Printable Dossier PDF Modal */}
        <DossierPdfModal
          isOpen={isPdfOpen}
          onClose={() => setIsPdfOpen(false)}
        />

      </div>

    </div>
  );
}
