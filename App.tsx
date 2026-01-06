
import React, { useState, useEffect, useCallback } from 'react';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import { Candidate } from './types';
import { generateCandidateAnalysis } from './geminiService';

const storage = {
  isLocalMode: true,
  async checkConnection() {
    try {
      const response = await fetch('/api/candidates', { method: 'HEAD' });
      this.isLocalMode = !response.ok;
      return response.ok;
    } catch {
      this.isLocalMode = true;
      return false;
    }
  },
  async getCandidates(): Promise<Candidate[]> {
    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        this.isLocalMode = false;
        return await response.json();
      }
    } catch (e) {
      console.warn("API Offline, using LocalStorage");
    }
    this.isLocalMode = true;
    const local = localStorage.getItem('yeni_gun_candidates');
    return local ? JSON.parse(local) : [];
  },
  async saveCandidate(candidate: Candidate) {
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    const newList = [candidate, ...current];
    localStorage.setItem('yeni_gun_candidates', JSON.stringify(newList));
    
    if (!this.isLocalMode) {
      await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
      }).catch(() => { this.isLocalMode = true; });
    }
  },
  async syncLocalToCloud(candidates: Candidate[]) {
    if (this.isLocalMode) return false;
    try {
      await fetch('/api/candidates/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidates)
      });
      return true;
    } catch {
      return false;
    }
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'offline'>('offline');

  const loadData = useCallback(async () => {
    const isOnline = await storage.checkConnection();
    setOnlineStatus(isOnline ? 'online' : 'offline');
    const data = await storage.getCandidates();
    setCandidates(data);
  }, []);

  useEffect(() => {
    loadData();
    // Her 30 saniyede bir bağlantıyı kontrol et
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleCandidateSubmit = async (data: any) => {
    setIsProcessing(true);
    const newCandidate: Candidate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'pending'
    };
    
    try {
      // 1. Yerel Kayıt
      await storage.saveCandidate(newCandidate);
      setCandidates(prev => [newCandidate, ...prev]);

      // 2. AI Analizi
      const report = await generateCandidateAnalysis(newCandidate);
      const finalCandidate = { ...newCandidate, report };
      
      // 3. Güncelleme
      const updatedList = candidates.map(c => c.id === newCandidate.id ? finalCandidate : c);
      setCandidates(updatedList);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(updatedList));

      alert(`Sayın ${newCandidate.name}, bilgileriniz güvenle kaydedildi.`);
      setView('admin');
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Bilgileriniz kaydedildi ancak yapay zeka analizi şu an yapılamıyor.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <nav className="bg-white/80 backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-[60] shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setView('candidate')}>
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-xl">YG</div>
            <div>
              <span className="text-xl font-black tracking-tighter uppercase block leading-none">YENİ GÜN</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${onlineStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`}></div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {onlineStatus === 'online' ? 'Bulut Bağlantısı Aktif' : 'Yerel Mod (Offline)'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button onClick={() => setView('candidate')} className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${view === 'candidate' ? 'bg-white shadow-lg text-orange-600' : 'text-slate-500'}`}>Aday Formu</button>
            <button onClick={() => setView('admin')} className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${view === 'admin' ? 'bg-white shadow-lg text-orange-600' : 'text-slate-500'}`}>Yönetici Paneli</button>
          </div>
        </div>
      </nav>

      <main className="py-12 px-8 max-w-7xl mx-auto">
        {view === 'candidate' ? (
          <CandidateForm onSubmit={handleCandidateSubmit} />
        ) : (
          <Dashboard 
            candidates={candidates} 
            onDelete={(id) => {
              const filtered = candidates.filter(c => c.id !== id);
              setCandidates(filtered);
              localStorage.setItem('yeni_gun_candidates', JSON.stringify(filtered));
            }}
          />
        )}
      </main>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[200] flex items-center justify-center p-8">
          <div className="bg-white p-16 rounded-[4rem] shadow-2xl text-center max-w-lg">
             <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
             <h3 className="text-2xl font-black text-slate-900">Profil Analiz Ediliyor</h3>
             <p className="text-slate-500 mt-4 font-medium">Lütfen bekleyiniz, yapay zeka uzmanlık verilerinizi işliyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
