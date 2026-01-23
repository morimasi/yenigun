
import React, { useState, useRef, useEffect } from 'react';
import { Candidate } from '../../types';
import { GoogleGenAI } from "@google/genai";

interface DecisionAdvisorChatProps {
  candidates: Candidate[];
  onClose: () => void;
}

const DecisionAdvisorChat: React.FC<DecisionAdvisorChatProps> = ({ candidates, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: `Merhaba. Seçtiğiniz ${candidates.length} aday (${candidates.map(c => c.name).join(', ')}) üzerinde liyakat bazlı derinlemesine karşılaştırma yapmak için hazırım. Hangi klinik yetkinliği veya senaryoyu sorgulamak istersiniz?` }
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const systemInstruction = `
        ROL: Yeni Gün Akademi Stratejik İK Danışmanı.
        GÖREV: Aşağıdaki adayları yan yana karşılaştır ve yöneticinin sorusuna liyakat odaklı cevap ver.
        ADAYLAR: ${JSON.stringify(candidates.map(c => ({
          name: c.name,
          branch: c.branch,
          score: c.report?.score,
          summary: c.report?.summary,
          answers: c.answers,
          swot: c.report?.swot
        })))}
        
        ANALİZ KURALLARI:
        1. Politik cevaplardan kaçın, adaylar arasındaki klinik farkları net bir şekilde ortaya koy.
        2. "Bu aday daha iyi" demek yerine "Bu aday X senaryosunda daha başarılıdır çünkü..." de.
        3. Adayların gerçek cevaplarını referans göster.
        4. Kısa, öz ve profesyonel bir ton kullan.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Kullanıcı Sorusu: ${userText}`,
        config: { systemInstruction, thinkingConfig: { thinkingBudget: 15000 } }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Üzgünüm, şu an analiz yapamıyorum." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Ağ bağlantısı hatası oluştu." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-md flex items-center justify-end p-8 animate-fade-in no-print">
      <div className="w-full max-w-2xl bg-white h-full rounded-[4rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-slide-right">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">AI Karar Danışmanı</h3>
                <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mt-1">Canlı Liyakat Sorgulama</p>
              </div>
           </div>
           <button onClick={onClose} className="p-4 hover:bg-rose-50 rounded-2xl text-rose-400 transition-all">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-sm ${
                 m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-slate-50 border border-slate-100 text-slate-800'
               }`}>
                  <p className="text-xs font-bold leading-relaxed whitespace-pre-wrap">{m.text}</p>
               </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-slate-50 p-6 rounded-3xl animate-pulse flex gap-2">
                 <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
               </div>
            </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="p-8 border-t border-slate-50 bg-white">
           <div className="flex gap-4">
              <input 
                autoFocus
                type="text" 
                className="flex-1 bg-slate-100 rounded-3xl p-5 text-sm font-bold outline-none border-2 border-transparent focus:border-orange-600 transition-all"
                placeholder="Örn: Hangi aday otizm sınıfında daha soğukkanlı davranır?"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button 
                type="submit"
                className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"/></svg>
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default DecisionAdvisorChat;
