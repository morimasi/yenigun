
import React, { useState, useEffect } from 'react';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import { Candidate } from './types';
import { generateCandidateAnalysis } from './geminiService';

const api = {
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const response = await fetch('/api/candidates');
      const text = await response.text();
      
      // Akışa sızmış olabilecek null veya whitespace karakterlerini temizle
      const cleanText = text.trim();
      
      try {
        const data = JSON.parse(cleanText);
        if (!response.ok) throw new Error(data.error || 'Sunucu hatası');
        return data;
      } catch (parseError) {
        console.error('Parse Error - Raw Response:', text);
        throw new Error('Veri formatı bozuk. Lütfen sayfayı yenileyiniz.');
      }
    } catch (e) {
      console.error('Fetch Error:', e);
      throw e;
    }
  },
  saveCandidate: async (candidate: Candidate) => {
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidate),
    });
    if (!response.ok) throw new Error('Kaydedilemedi');
    return response.json();
  },
  updateCandidate: async (updatedCandidate: Candidate) => {
    const response = await fetch('/api/candidates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCandidate),
    });
    if (!response.ok) throw new Error('Güncellenemedi');
    return response.json();
  },
  deleteCandidate: async (id: string) => {
    const response = await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Silinemedi');
    return response.json();
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setDbError(null);
      const data = await api.getCandidates();
      setCandidates(data);
    } catch (e: any) {
      setDbError(e.message);
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
      await api.saveCandidate(newCandidate);
      const report = await generateCandidateAnalysis(newCandidate);
      const updated = { ...newCandidate, report };
      await api.updateCandidate(updated);
      await loadData();
      alert("Başvurunuz başarıyla kaydedildi.");
      setView('admin');
    } catch (error: any) {
      alert("Hata: " + error.message);
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
            <button onClick={() => { setView('admin'); loadData(); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'admin' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}>Yönetici Paneli</button>
          </div>
        </div>
      </nav>

      {dbError && (
        <div className="max-w-7xl mx-auto mt-4 px-6">
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center justify-between text-rose-700 shadow-sm animate-fade-in">
            <p className="text-xs font-bold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Sistem Durumu: {dbError}
            </p>
            <button onClick={loadData} className="px-3 py-1 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-200 hover:bg-rose-50 transition-colors">Yenile</button>
          </div>
        </div>
      )}

      <main className="py-10 px-6 max-w-7xl mx-auto">
        {view === 'candidate' ? (
          <CandidateForm onSubmit={handleCandidateSubmit} />
        ) : (
          <Dashboard 
            candidates={candidates} 
            onDelete={async (id) => { await api.deleteCandidate(id); loadData(); }}
            onUpdate={async (c) => { await api.updateCandidate(c); loadData(); }}
          />
        )}
      </main>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 text-center">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl animate-scale-in">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
            <h3 className="text-xl font-black">Başvurunuz İşleniyor</h3>
            <p className="text-slate-500 mt-2 text-sm font-bold">Veritabanına kayıt ve AI analiz raporu hazırlanıyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
