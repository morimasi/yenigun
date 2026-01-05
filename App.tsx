
import React, { useState, useEffect } from 'react';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import { Candidate } from './types';
import { generateCandidateAnalysis } from './geminiService';

// Akıllı Veri Yönetim Katmanı
const storage = {
  isLocalMode: false,
  
  async request(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network fail');
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) throw new Error('Not JSON');
      return await response.json();
    } catch (e) {
      console.warn("API Error, falling back to LocalStorage:", e);
      this.isLocalMode = true;
      return null;
    }
  },

  async getCandidates(): Promise<Candidate[]> {
    const data = await this.request('/api/candidates');
    if (data && Array.isArray(data)) return data;
    
    // Fallback: LocalStorage
    const local = localStorage.getItem('yeni_gun_candidates');
    return local ? JSON.parse(local) : [];
  },

  async saveCandidates(candidates: Candidate[]) {
    // Önce LocalStorage'a yaz (Güvenlik için)
    localStorage.setItem('yeni_gun_candidates', JSON.stringify(candidates));
    
    // Eğer local mode'da değilsek API'ye de yazmayı dene
    if (!this.isLocalMode) {
      const latest = candidates[0]; // Genelde tekil işlem yapılır ama basitlik için
      await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(latest)
      }).catch(() => { this.isLocalMode = true; });
    }
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{type: 'info'|'error', text: string} | null>(null);

  const loadData = async () => {
    const data = await storage.getCandidates();
    setCandidates(data);
    if (storage.isLocalMode) {
      setStatusMsg({ type: 'info', text: 'Sistem şu an Çevrimdışı/Yerel Modda çalışıyor. Verileriniz bu tarayıcıda saklanmaktadır.' });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCandidateSubmit = async (data: any) => {
    setIsProcessing(true);
    const newCandidate: Candidate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'pending'
    };
    
    try {
      const updatedList = [newCandidate, ...candidates];
      setCandidates(updatedList);
      await storage.saveCandidates(updatedList);

      // AI Analizini Başlat
      const report = await generateCandidateAnalysis(newCandidate);
      const finalCandidate = { ...newCandidate, report };
      
      const finalData = updatedList.map(c => c.id === newCandidate.id ? finalCandidate : c);
      setCandidates(finalData);
      await storage.saveCandidates(finalData);
      
      alert("Başvurunuz başarıyla alındı ve AI analizi tamamlandı.");
      setView('admin');
    } catch (error: any) {
      alert("İşlem sırasında bir sorun oluştu, ancak verileriniz yerel olarak kaydedildi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    const filtered = candidates.filter(c => c.id !== id);
    setCandidates(filtered);
    await storage.saveCandidates(filtered);
    // API entegrasyonu (Opsiyonel: Silme isteği gönderilebilir)
    await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleUpdate = async (updated: Candidate) => {
    const list = candidates.map(c => c.id === updated.id ? updated : c);
    setCandidates(list);
    await storage.saveCandidates(list);
    // API entegrasyonu
    await fetch('/api/candidates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setView('candidate')}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black shadow-lg">YG</div>
            <span className="text-lg font-black tracking-tight uppercase">YENİ GÜN</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setView('candidate')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'candidate' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}>Aday Portalı</button>
            <button onClick={() => { setView('admin'); loadData(); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'admin' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}>Yönetici Paneli</button>
          </div>
        </div>
      </nav>

      {statusMsg && (
        <div className="max-w-7xl mx-auto mt-4 px-6 animate-fade-in">
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border ${statusMsg.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {statusMsg.text}
          </div>
        </div>
      )}

      <main className="py-10 px-6 max-w-7xl mx-auto">
        {view === 'candidate' ? (
          <CandidateForm onSubmit={handleCandidateSubmit} />
        ) : (
          <Dashboard 
            candidates={candidates} 
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </main>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 text-center">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl animate-scale-in">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
            <h3 className="text-xl font-black">AI Analiz Laboratuvarı</h3>
            <p className="text-slate-500 mt-2 text-sm font-bold">Yapay zeka verileri titizlikle işliyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
