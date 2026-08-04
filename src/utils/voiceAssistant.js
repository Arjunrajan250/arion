// Web Speech API Voice Assistant & Speech Synthesis Engine for ARION Tactical Dashboard

export function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  
  // Stop existing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 0.95;

  // Try to pick a futuristic English voice
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Samantha')));
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function initSpeechRecognition(onCommand, onStatusChange) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn('SpeechRecognition API not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    if (onStatusChange) onStatusChange(true);
    speakText('ARION Voice Control Active. Listening for tactical commands.');
  };

  recognition.onend = () => {
    if (onStatusChange) onStatusChange(false);
  };

  recognition.onerror = (e) => {
    console.error('Speech recognition error:', e.error);
    if (onStatusChange) onStatusChange(false);
  };

  recognition.onresult = (event) => {
    const lastResultIndex = event.results.length - 1;
    const commandText = event.results[lastResultIndex][0].transcript.toLowerCase().trim();
    console.log('Recognized Voice Command:', commandText);

    if (onCommand) {
      onCommand(commandText);
    }
  };

  return recognition;
}
