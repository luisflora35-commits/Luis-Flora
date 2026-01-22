
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, MapPin, Sparkles, BrainCircuit } from 'lucide-react';
import { getComplexPetAdvice, findNearbyPetServices } from '../services/geminiService';

interface Message {
  role: 'user' | 'bot';
  text: string;
  type?: 'thinking' | 'maps' | 'standard';
  sources?: any[];
}

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I am Pawfect Assistant. Need help choosing a breed or finding a vet?', type: 'standard' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setInput('');
    setIsLoading(true);

    try {
      // Determine if user is looking for location-based info
      const isLocationQuery = /near|nearby|where|find|clinic|vet|hospital|shop|store/i.test(userQuery);
      
      let response;
      if (isLocationQuery) {
        let coords;
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => 
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
          );
          coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        } catch (e) {
          console.warn("Location access denied or timed out");
        }
        
        const data = await findNearbyPetServices(userQuery, coords);
        response = { text: data.text, type: 'maps' as const, sources: data.sources };
      } else {
        // Use Thinking Mode for general queries
        const text = await getComplexPetAdvice(userQuery);
        response = { text: text || '', type: 'thinking' as const };
      }

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response.text, 
        type: response.type,
        sources: response.sources
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm experiencing a minor brain freeze. Please try again!", type: 'standard' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-[100] bg-white text-orange-500 p-4 rounded-full shadow-2xl hover:scale-110 transition-all border border-orange-100 flex items-center gap-2 group"
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-[100] w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 max-h-[600px]">
      <div className="bg-white p-6 border-b border-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Pawfect Support</h3>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-orange-500 text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {m.type === 'thinking' && <BrainCircuit size={14} className="text-orange-400" />}
                {m.type === 'maps' && <MapPin size={14} className="text-blue-400" />}
              </div>
              <p className="whitespace-pre-wrap">{m.text}</p>
              
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nearby Sources:</p>
                  {m.sources.map((src, idx) => (
                    src.maps && (
                      <a 
                        key={idx} 
                        href={src.maps.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-[11px] text-blue-500 hover:underline truncate"
                      >
                        📍 {src.maps.title || 'View on Maps'}
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2">
              <div className="w-2 h-2 bg-orange-200 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-50">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask me anything..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-orange-200 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
          <Sparkles size={10} /> Powered by Gemini 3 Pro Intelligence
        </p>
      </div>
    </div>
  );
};
