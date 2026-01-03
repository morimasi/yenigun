
import React, { useState, useEffect } from 'react';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import { Candidate } from './types';
import { generateCandidateAnalysis } from './geminiService';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('yeni_gun_candidates');
    if (saved) setCandidates(JSON.parse(saved));
  }, []);

  const saveCandidates = (newList: Candidate[]) => {
    setCandidates(newList);
    localStorage.setItem('yeni_gun_candidates', JSON.stringify(newList));
  };

  const handleUpdateCandidate = (updated: Candidate) => {
    const newList = candidates.map(c => c.id === updated.id ? updated : c);
    saveCandidates(newList);
  };

  const handleAiChat = async () => {
    if (!chatMessage.trim()) return;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, {role: 'user', text: userMsg}]);
    setIsChatLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Sen Yeni Gün Özel Eğitim ve Rehabilitasyon Merkezi'nin kurumsal asistanısın. Adaylara kurumun vizyonu, mülakat süreci ve çalışma şartları (genel olarak) hakkında bilgi veriyorsun. Şefkatli, profesyonel ve davetkar ol."
        }
      });
      setChatHistory(prev => [...prev, {role: 'ai', text: response.text || 'Anlaşılamadı.'}]);
    } catch (e) {
      setChatHistory(prev => [...prev, {role: 'ai', text: 'Üzgünüm, şu an yanıt veremiyorum.'}]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCandidateSubmit = async (data: Omit<Candidate, 'id' | 'timestamp' | 'report' | 'status'>) => {
    setIsProcessing(true);
    const newCandidate: Candidate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'pending'
    };
    const updatedList = [newCandidate, ...candidates];
    saveCandidates(updatedList);
    try {
      const report = await generateCandidateAnalysis(newCandidate);
      const listWithReport = updatedList.map(c => c.id === newCandidate.id ? { ...c, report } : c);
      saveCandidates(listWithReport);
      setView('admin');
    } catch (error) {
      alert("AI Analiz sürecinde bir hata oluştu. Veriler kaydedildi ancak rapor henüz hazır değil.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[60] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setView('candidate')}>
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-transform hover:rotate-6">
              <span className="text-2xl font-black">YG</span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none">YENİ GÜN</span>
              <span className="text-[10px] font-bold text-orange-600 tracking-[0.2em] uppercase">Ecosystem</span>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
            {['candidate', 'admin'].map((v) => (
              <button key={v} onClick={() => setView(v as any)} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${view === v ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                {v === 'candidate' ? 'Aday Portalı' : 'Yönetici Paneli'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {view === 'candidate' ? (
            <CandidateForm onSubmit={handleCandidateSubmit} />
          ) : (
            <Dashboard 
              candidates={candidates} 
              onDelete={(id) => saveCandidates(candidates.filter(c => c.id !== id))}
              onUpdate={handleUpdateCandidate}
            />
          )}
        </div>
      </main>

      {/* AI Assistant Widget */}
      <div className="fixed bottom-8 right-8 z-[70]">
        {!isAiChatOpen ? (
          <button onClick={() => setIsAiChatOpen(true)} className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-bounce">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </button>
        ) : (
          <div className="w-80 md:w-96 h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scale-in">
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <span className="text-white font-black text-sm uppercase tracking-widest">YG Asistan</span>
              <button onClick={() => setIsAiChatOpen(false)} className="text-slate-400 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50">
              {chatHistory.length === 0 && <p className="text-xs text-slate-400 text-center mt-20">"Yeni Gün'de kariyer süreci nasıl işliyor?" gibi sorular sorabilirsiniz.</p>}
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-white border border-slate-100 text-slate-700 shadow-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isChatLoading && <div className="text-[10px] text-slate-400 animate-pulse font-bold">Analiz ediliyor...</div>}
            </div>
            <div className="p-4 bg-white border-t border-slate-50 flex gap-2">
              <input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAiChat()} placeholder="Sorunuzu yazın..." className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-orange-500" />
              <button onClick={handleAiChat} className="p-2 bg-slate-900 text-white rounded-xl"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
            </div>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center max-w-sm w-full text-center border border-white/20">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
              <svg className="w-10 h-10 text-orange-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Multimodal Analiz</h3>
            <p className="text-slate-500 mt-4 text-sm font-bold leading-relaxed">
              Gemini 3.0 Flash, cevaplarınızı ve CV'nizi kurumsal genomumuzla eşleştiriyor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
