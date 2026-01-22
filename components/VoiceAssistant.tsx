
import React, { useState, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, MicOff, X, Sparkles } from 'lucide-react';

// Helper functions for audio processing manually implemented per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const VoiceAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  // Track session as a promise to handle race conditions correctly
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const toggleAssistant = async () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // CRITICAL: Initiate live connection and use the promise to send data
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are Pawfect AI, a friendly and knowledgeable pet marketplace assistant. You help users understand pet breeds, explain how the adoption process works on Pawfect Match, and offer general pet care advice. Keep your responses concise and warm.',
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            if (!audioContextRef.current) return;

            const source = audioContextRef.current.createMediaStreamSource(stream);
            const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(audioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outAudioContextRef.current) {
              const ctx = outAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live AI Error:", e);
            stopSession();
          },
          onclose: () => stopSession()
        }
      });
      
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error("Failed to start AI session:", err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => session.close());
      sessionPromiseRef.current = null;
    }
    
    audioContextRef.current?.close();
    outAudioContextRef.current?.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] bg-orange-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 group overflow-hidden"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="font-bold pr-2">Ask AI Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4">
      <div className="bg-orange-500 p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <h3 className="font-bold">Pawfect AI</h3>
        </div>
        <button onClick={() => { stopSession(); setIsOpen(false); }} className="text-white/60 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-8 text-center space-y-6">
        <div className="relative">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-orange-100 scale-110' : 'bg-gray-100'}`}>
            {isActive ? (
              <div className="flex items-center gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-1.5 h-8 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            ) : (
              <Mic size={32} className="text-gray-300" />
            )}
          </div>
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-lg">
            {isActive ? 'Listening...' : 'Ready to help!'}
          </h4>
          <p className="text-sm text-gray-500 mt-2">
            {isActive ? "I'm listening to your questions about pets." : "Tap the button below and speak to ask about breeds or care."}
          </p>
        </div>

        <button 
          onClick={toggleAssistant}
          disabled={isConnecting}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isActive ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-100'}`}
        >
          {isActive ? <><MicOff size={20} /> Stop Assistant</> : <><Mic size={20} /> Start Voice Chat</>}
        </button>
      </div>
    </div>
  );
};
