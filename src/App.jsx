import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, Clock3, MapPin } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MetricsOverview from './components/MetricsOverview';
import LiveFeedPanel from './components/LiveFeedPanel';
import FelonModal from './components/FelonModal';
import SurveillanceView from './components/SurveillanceView';
import CyberCommandView from './components/CyberCommandView';
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
import { isMuted, setMuted, toggleMute } from './utils/soundEngine';
import { initSpeechRecognition, speakText } from './utils/voiceAssistant';

const TacticalMap = lazy(() => import('./components/TacticalMap'));

const viewDetails = {
  dashboard: { title: 'Operations overview', eyebrow: 'Intelligence', location: 'Gotham · Sector HJ-66' },
  surveillance: { title: 'Surveillance matrix', eyebrow: 'Intelligence', location: 'Node 06 · Crosswalk Alpha' },
  cybercommand: { title: 'Cyber command', eyebrow: 'Intelligence', location: 'National cyber grid' },
  livefeed: { title: 'Live camera network', eyebrow: 'Intelligence', location: '4 optical nodes connected' },
  alerts: { title: 'Incident response', eyebrow: 'Operations', location: 'Regional incident queue' },
  campaigns: { title: 'Active campaigns', eyebrow: 'Operations', location: 'Joint operations network' },
  reporting: { title: 'Intelligence reports', eyebrow: 'Operations', location: 'Secure records archive' },
};

const themeOptions = {
  cyberhud: { background: '#050907', border: 'rgba(52, 211, 153, 0.20)', accent: '#34d399', glow: 'rgba(16, 185, 129, 0.07)' },
  cybercrime: { background: '#080609', border: 'rgba(248, 113, 113, 0.22)', accent: '#f87171', glow: 'rgba(239, 68, 68, 0.08)' },
  cyan: { background: '#05080c', border: 'rgba(34, 211, 238, 0.18)', accent: '#22d3ee', glow: 'rgba(6, 182, 212, 0.07)' },
  vintage: { background: '#06080d', border: 'rgba(96, 165, 250, 0.18)', accent: '#60a5fa', glow: 'rgba(59, 130, 246, 0.07)' },
  amber: { background: '#0b0905', border: 'rgba(251, 191, 36, 0.20)', accent: '#fbbf24', glow: 'rgba(245, 158, 11, 0.07)' },
  midnight: { background: '#05080c', border: 'rgba(34, 211, 238, 0.18)', accent: '#22d3ee', glow: 'rgba(6, 182, 212, 0.07)' },
  stealth: { background: '#060708', border: 'rgba(148, 163, 184, 0.15)', accent: '#94a3b8', glow: 'rgba(148, 163, 184, 0.05)' },
  crimson: { background: '#0b0608', border: 'rgba(248, 113, 113, 0.20)', accent: '#f87171', glow: 'rgba(239, 68, 68, 0.07)' },
};

function readPreference(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    const storedView = readPreference('arion-active-view', 'surveillance');
    return viewDetails[storedView] ? storedView : 'surveillance';
  });
  const [theme, setTheme] = useState(() => readPreference('arion-theme', 'cyan'));
  const [mutedState, setMutedState] = useState(() => {
    const preference = readPreference('arion-muted', null);
    const initialMuted = preference === null ? isMuted() : preference === 'true';
    setMuted(initialMuted);
    return initialMuted;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readPreference('arion-sidebar', 'false') === 'true');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedFelon, setSelectedFelon] = useState(null);
  const [selectedAudioIntercept, setSelectedAudioIntercept] = useState({
    id: '1',
    flag: '🇵🇰',
    number: '555-234-9876',
    dest: '555-879-3456',
    type: 'Incoming',
    isAlert: true,
  });
  const [selectedCamera, setSelectedCamera] = useState('CCTV-X5');
  const recognitionRef = useRef(null);

  const notify = (message, type = 'success') => {
    window.clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('arion-active-view', activeTab);
      window.localStorage.setItem('arion-theme', theme);
      window.localStorage.setItem('arion-sidebar', String(sidebarCollapsed));
    } catch {
      // The console still works when storage is unavailable.
    }
  }, [activeTab, theme, sidebarCollapsed]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.clearTimeout(toastTimerRef.current);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      setSelectedFelon(null);
      setIsGraphOpen(false);
      setIsAudioOpen(null);
      setIsDispatchOpen(false);
      setIsTerminalOpen(false);
      setIsPdfOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
    const dialog = dialogs[dialogs.length - 1];
    if (!dialog) return undefined;

    const previousFocus = document.activeElement;
    const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
    const frame = window.requestAnimationFrame(() => {
      if (!dialog.contains(document.activeElement)) dialog.querySelector(focusableSelector)?.focus();
    });
    const trapFocus = (event) => {
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll(focusableSelector)].filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', trapFocus);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [selectedFelon, isCmdPaletteOpen, isGraphOpen, isAudioOpen, isDispatchOpen, isTerminalOpen, isPdfOpen]);

  const handleVoiceCommand = (command) => {
    const destinations = [
      { keywords: ['dashboard', 'overview'], tab: 'dashboard', feedback: 'Opening operations overview.' },
      { keywords: ['surveillance'], tab: 'surveillance', feedback: 'Opening surveillance matrix.' },
      { keywords: ['alert'], tab: 'alerts', feedback: 'Opening incident response.' },
      { keywords: ['report'], tab: 'reporting', feedback: 'Opening intelligence reports.' },
      { keywords: ['campaign'], tab: 'campaigns', feedback: 'Opening active campaigns.' },
      { keywords: ['live feed', 'camera'], tab: 'livefeed', feedback: 'Opening live camera network.' },
      { keywords: ['cyber', 'i4c', 'crime', 'fraud'], tab: 'cybercommand', feedback: 'Opening cyber command.' },
    ];
    const destination = destinations.find((item) => item.keywords.some((keyword) => command.includes(keyword)));
    if (destination) {
      setActiveTab(destination.tab);
      speakText(destination.feedback);
    } else if (command.includes('terminal') || command.includes('command line')) {
      setIsTerminalOpen(true);
      speakText('Opening cyber terminal.');
    } else if (command.includes('dispatch')) {
      setIsDispatchOpen(true);
      speakText('Opening unit dispatch.');
    } else if (command.includes('graph')) {
      setIsGraphOpen(true);
      speakText('Opening intelligence graph.');
    }
  };

  const handleToggleVoice = () => {
    if (isVoiceActive) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setIsVoiceActive(false);
      speakText('Voice control deactivated.');
      return;
    }

    const recognition = initSpeechRecognition(handleVoiceCommand, setIsVoiceActive);
    if (!recognition) {
      notify('Voice recognition is not supported in this browser.', 'warning');
      return;
    }
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      notify('Voice recognition is already starting. Please wait a moment.', 'warning');
    }
  };

  const handleToggleMute = () => {
    const nextMuted = toggleMute();
    setMutedState(nextMuted);
    try {
      window.localStorage.setItem('arion-muted', String(nextMuted));
    } catch {
      // Ignore unavailable storage.
    }
  };

  if (showSplash) {
    return <SplashScreen onLaunch={() => setShowSplash(false)} />;
  }

  const currentView = viewDetails[activeTab] || viewDetails.dashboard;
  const currentTheme = themeOptions[theme] || themeOptions.cyan;

  return (
    <div
      className="app-shell h-dvh w-full overflow-hidden bg-[#04070b] p-0 text-slate-100 sm:p-2"
      data-theme={theme}
      style={{ '--theme-accent': currentTheme.accent, background: `radial-gradient(circle at 50% 0%, ${currentTheme.glow}, transparent 55%), ${currentTheme.background}` }}
    >
      <div className="flex h-full w-full flex-col overflow-hidden border-white/[0.08] bg-[#070a10] shadow-2xl shadow-black/60 sm:rounded-xl sm:border" style={{ borderColor: currentTheme.border }}>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          alertCount={8}
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
          onOpenAudio={() => setIsAudioOpen(selectedAudioIntercept)}
          onOpenPdf={() => setIsPdfOpen(true)}
          onOpenProfile={() => setSelectedFelon({ id: 'operator-mitchell', name: 'Robert Mitchell', mugshot: '/assets/robert_mitchell.png', threat: 'AUTHORIZED OPERATOR', location: 'City Operations Center', warrant: 'LEVEL 5 CLEARANCE' })}
        />

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            onOpenCommand={() => setIsCmdPaletteOpen(true)}
          />

          <section className="flex min-w-0 flex-1 flex-col" aria-label="Command workspace">
            <div className="flex min-h-[64px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-[#080c12] px-4 py-3 sm:px-5 lg:px-6">
              <div className="min-w-0">
                <div className="mb-1 hidden items-center gap-1.5 text-[10px] text-slate-600 sm:flex">
                  <span>{currentView.eyebrow}</span>
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                  <span className="text-slate-500">{currentView.title}</span>
                </div>
                <h1 className="truncate text-[15px] font-semibold tracking-tight text-slate-100 sm:text-base">{currentView.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 truncate text-[10px] text-slate-600">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {currentView.location}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-2 text-right md:flex">
                  <Clock3 className="h-4 w-4 text-slate-600" aria-hidden="true" />
                  <div>
                    <time className="block font-mono text-xs font-medium tabular-nums text-slate-300" dateTime={currentTime.toISOString()}>
                      {currentTime.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'UTC' })} <span className="text-slate-600">UTC</span>
                    </time>
                    <span className="mt-0.5 block text-[9px] text-slate-600">{currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('alerts')}
                  className="flex h-9 items-center gap-2 rounded-lg border border-red-400/15 bg-red-400/[0.06] px-2.5 text-[10px] font-medium text-red-300 transition-colors hover:border-red-400/30 hover:bg-red-400/10 sm:px-3"
                >
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span><span className="hidden sm:inline">2 </span>Critical</span>
                </button>
              </div>
            </div>

            <main key={activeTab} className={`view-enter min-h-0 w-full flex-1 overflow-y-auto lg:flex lg:flex-row lg:gap-3 lg:overflow-hidden lg:p-3 ${activeTab === 'dashboard' ? 'flex flex-col gap-3 p-2 sm:p-3' : ''}`}>
              {activeTab === 'dashboard' && (
                <>
                  <MetricsOverview />
                  <Suspense fallback={<div className="flex h-[430px] w-full items-center justify-center rounded-xl border border-white/[0.08] bg-[#070b11] text-xs text-slate-500 lg:h-full" role="status">Loading global radar…</div>}>
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
                  </Suspense>
                  <LiveFeedPanel onSelectFelon={setSelectedFelon} />
                </>
              )}
              {activeTab === 'surveillance' && <SurveillanceView onSelectFelon={setSelectedFelon} onNotify={notify} />}
              {activeTab === 'cybercommand' && <CyberCommandView onNotify={notify} />}
              {activeTab === 'alerts' && <AlertsView />}
              {activeTab === 'reporting' && <ReportingView />}
              {activeTab === 'campaigns' && <CampaignsView onNotify={notify} />}
              {activeTab === 'livefeed' && <LiveFeedView onSelectFelon={setSelectedFelon} />}
            </main>
          </section>
        </div>

        {selectedFelon && <FelonModal felon={selectedFelon} onClose={() => setSelectedFelon(null)} />}
        <CommandPalette
          isOpen={isCmdPaletteOpen}
          onClose={setIsCmdPaletteOpen}
          setActiveTab={setActiveTab}
          setTheme={setTheme}
          isMuted={mutedState}
          onToggleMute={handleToggleMute}
          onSelectTarget={setSelectedFelon}
        />
        <IntelligenceGraphModal isOpen={isGraphOpen} onClose={() => setIsGraphOpen(false)} onSelectTarget={setSelectedFelon} />
        {isAudioOpen && <AudioInterceptModal intercept={isAudioOpen} onClose={() => setIsAudioOpen(null)} />}
        <DispatchSimulatorModal isOpen={isDispatchOpen} onClose={() => setIsDispatchOpen(false)} />
        <CyberTerminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          setActiveTab={setActiveTab}
          setTheme={setTheme}
          onSelectTarget={setSelectedFelon}
          onOpenGraph={() => setIsGraphOpen(true)}
          onOpenDispatch={() => setIsDispatchOpen(true)}
        />
        <DossierPdfModal isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} />

        {toast && (
          <div className={`fixed bottom-5 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border bg-[#0d131c] px-4 py-3 text-xs shadow-2xl ${toast.type === 'warning' ? 'border-amber-400/30 text-amber-200' : 'border-emerald-400/25 text-emerald-200'}`} role="status" aria-live="polite">
            {toast.type === 'warning' ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
