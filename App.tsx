
import React, { useState, useEffect } from 'react';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import { Candidate } from './types';
import { generateCandidateAnalysis } from './geminiService';
import { GoogleGenAI } from "@google/genai";

const api = {
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const response = await fetch('/api/candidates');
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      return [];
    }
  },
  saveCandidate: async (candidate: Candidate) => {
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidate),
    });
    return api.getCandidates();
  },
  updateCandidate: async (updatedCandidate: Candidate) => {
    await fetch('/api/candidates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCandidate),
    });
    return api.getCandidates();
  },
  deleteCandidate: async (id: string) => {
    await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' });
    return api.getCandidates();
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    api.getCandidates().then(setCandidates);
  }, []);

  const handleAiChat = async () => {
    if (!chatMessage.trim()) return;
    
    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, {role: 'user', text: userMsg}]);
    setIsChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Sen Yeni Gün Özel Eğitim ve Rehabilitasyon Merkezi'nin kurumsal asistanısın. Adaylara mülakat süreci ve kurum vizyonu hakkında bilgi veriyorsun."
        }
      });
      setChatHistory(prev => [...prev, {role: 'ai', text: response.text || 'Anlaşılamadı.'}]);
    } catch (e) {
      setChatHistory(prev => [...prev, {role: 'ai', text: 'Sistem şu an meşgul, lütfen daha sonra tekrar deneyiniz.'}]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCandidateSubmit = async (data: any) => {
    setIsProcessing(true);
    const newCandidate: Candidate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'pending'
    };
    
    try {
      await api.saveCandidate(newCandidate);
      const report = await generateCandidateAnalysis(newCandidate);
      const updated = { ...newCandidate, report };
      const list = await api.updateCandidate(updated);
      setCandidates(list);
      alert("Başvurunuz başarıyla kaydedildi.");
      setView('admin');
    } catch (error) {
      alert("Bir hata oluştu, ancak başvurunuz kaydedilmiş olabilir.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setView('candidate')}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black shadow-lg">YG</div>
            <span className="text-lg font-black tracking-tight">YENİ GÜN</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setView('candidate')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'candidate' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}>Aday Portalı</button>
            <button onClick={() => setView('admin')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'admin' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}>Yönetici Paneli</button>
          </div>
        </div>
      </nav>

      <main className="py-10 px-6 max-w-7xl mx-auto">
        {view === 'candidate' ? (
          <CandidateForm onSubmit={handleCandidateSubmit} />
        ) : (
          <Dashboard 
            candidates={candidates} 
            onDelete={(id) => api.deleteCandidate(id).then(setCandidates)}
            onUpdate={(c) => api.updateCandidate(c).then(setCandidates)}
          />
        )}
      </main>

      {/* AI Asistan Butonu */}
      <div className="fixed bottom-6 right-6 z-[70]">
        {!isAiChatOpen ? (
          <button onClick={() => setIsAiChatOpen(true)} className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </button>
        ) : (
          <div className="w-80 h-[450px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scale-in">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <span className="text-xs font-black uppercase tracking-widest">YG Asistan</span>
              <button onClick={() => setIsAiChatOpen(false)}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] font-medium ${m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-white border border-slate-100'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isChatLoading && <div className="text-[9px] text-slate-400 animate-pulse font-bold">Düşünüyor...</div>}
            </div>
            <div className="p-3 bg-white border-t flex gap-2">
              <input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAiChat()} placeholder="Sorunuz..." className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-xs outline-none" />
              <button onClick={handleAiChat} className="p-2 bg-slate-900 text-white rounded-xl"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
            </div>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-black">Başvurunuz Analiz Ediliyor</h3>
            <p className="text-slate-500 mt-2 text-sm font-bold">Lütfen tarayıcıyı kapatmayınız.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
