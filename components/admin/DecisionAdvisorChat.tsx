
import React, { useState, useRef, useEffect } from 'react';
import { Candidate } from '../../types';
import { GoogleGenAI } from "@google/genai";

interface DecisionAdvisorChatProps {
  candidates: Candidate[];
  onClose: () => void;
}

const DecisionAdvisorChat: React.FC<DecisionAdvisorChatProps> = ({ candidates, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: `Yeni Gün Akademi Stratejik Danışmanlık. Adaylar üzerinde derin muhakeme (Gemini-3 Thinking Mode) aktif. Seçtiğiniz ${candidates.length} aday arasındaki klinik ve kültürel farkları analiz edebilirim.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        ROL: Yeni Gün Akademi Stratejik Karar Danışmanı.
        MODEL: Gemini-3-Flash.
        MOD: Deep Thinking (24k Budget).
        GÖREV: Adaylar arasındaki kritik liyakat ayrışmalarını tespit et ve adil bir karar tavsiyesi üret.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `ADAYLAR: ${JSON.stringify(candidates.map(c => ({ name: c.name, branch: c.branch, score: c.report?.score })))} | SORU: ${userText}`,
        config: { 
          systemInstruction, 
          thinkingConfig: { thinkingBudget: 24576 } 
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Muhakeme motoru yanıt üretemedi." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Stratejik bağlantı hatası: Sunucu yoğunluğu." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-3xl flex items-center justify-end p-8 animate-fade-in no-print">
      <div className="w-full max-w-3xl bg-white h-full rounded-[4.5rem] shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-slide-right relative">
        <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center relative">
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-slate-900 rounded-[2rem] flex items-center justify-center text-orange-600 shadow-2xl">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Muhakeme Ünitesi</h3>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">Gemini-3 Flash Thinking Mode</p>
              </div>
           </div>
           <button onClick={onClose} className="p-5 hover:bg-rose-50 rounded-[2rem] text-rose-400 transition-all z-10">
             <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar bg-[#FAFAFA]" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-8 rounded-[3rem] shadow-sm relative ${
                 m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-white border border-slate-100 text-slate-800'
               }`}>
                  <p className="text-[13px] font-bold leading-relaxed whitespace-pre-wrap">{m.text}</p>
               </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-slate-900/5 p-8 rounded-[2.5rem] flex items-center gap-4">
                 <div className="flex gap-2">
                   <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce delay-100"></div>
                   <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce delay-200"></div>
                 </div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nöral Muhakeme Devrede...</span>
               </div>
            </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="p-10 border-t border-slate-50 bg-white">
           <div className="flex gap-5">
              <input 
                autoFocus
                type="text" 
                className="flex-1 bg-slate-50 rounded-[2.5rem] p-6 text-base font-bold outline-none border-2 border-transparent focus:border-orange-600 shadow-inner"
                placeholder="Karar destek için analiz talebinizi yazın..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button 
                type="submit"
                className="w-20 h-20 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center hover:bg-orange-600 transition-all shadow-2xl active:scale-95"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"/></svg>
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default DecisionAdvisorChat;
