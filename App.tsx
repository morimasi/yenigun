
import React, { useState, useEffect, useCallback } from 'react';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import { Candidate } from './types';
import { generateCandidateAnalysis } from './geminiService';

const storage = {
  isLocalMode: true,
  isSimulated: false,
  
  async checkConnection() {
    try {
      // 404 hatasını sessizce yakala
      const response = await fetch('/api/candidates', { 
        method: 'HEAD',
        cache: 'no-store' 
      }).catch(() => null);
      
      this.isLocalMode = !response || !response.ok;
      return !!(response && response.ok);
    } catch {
      this.isLocalMode = true;
      return false;
    }
  },
  
  async getCandidates(): Promise<Candidate[]> {
    if (!this.isLocalMode) {
      try {
        const response = await fetch('/api/candidates');
        if (response.ok) return await response.json();
      } catch (e) {
        console.log("Cloud unavailable, switching to local state management.");
      }
    }
    
    const local = localStorage.getItem('yeni_gun_candidates');
    return local ? JSON.parse(local) : [];
  },

  async saveCandidate(candidate: Candidate) {
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    const newList = [candidate, ...current];
    localStorage.setItem('yeni_gun_candidates', JSON.stringify(newList));
    
    if (!this.isLocalMode) {
      try {
        await fetch('/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(candidate)
        });
      } catch (e) {
        this.isLocalMode = true;
      }
    }
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionState, setConnectionState] = useState<'offline' | 'online' | 'simulated'>('offline');

  const loadData = useCallback(async () => {
    const isOnline = await storage.checkConnection();
    setConnectionState(isOnline ? 'online' : 'offline');
    const data = await storage.getCandidates();
    setCandidates(data);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
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
      await storage.saveCandidate(newCandidate);
      setCandidates(prev => [newCandidate, ...prev]);

      const report = await generateCandidateAnalysis(newCandidate);
      const finalCandidate = { ...newCandidate, report };
      
      const updatedList = [finalCandidate, ...candidates.filter(c => c.id !== newCandidate.id)];
      setCandidates(updatedList);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(updatedList));

      alert(`Başvurunuz Başarıyla Kaydedildi.\nMod: ${connectionState.toUpperCase()}`);
      setView('admin');
    } catch (error) {
      console.warn("Analysis delayed, candidate saved locally.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateCandidate = (updated: Candidate) => {
    const newList = candidates.map(c => c.id === updated.id ? updated : c);
    setCandidates(newList);
    localStorage.setItem('yeni_gun_candidates', JSON.stringify(newList));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-orange-100">
      <nav className="bg-white/90 backdrop-blur-3xl border-b border-slate-100 sticky top-0 z-[60] shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-5 cursor-pointer" onClick={() => setView('candidate')}>
            <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 text-xl">YG</span>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter uppercase block leading-none text-slate-900">YENİ GÜN</span>
              <div className="flex items-center gap-2 mt-1.5">
                <div className={`w-2 h-2 rounded-full ${
                  connectionState === 'online' ? 'bg-emerald-500 animate-pulse' : 
                  connectionState === 'simulated' ? 'bg-blue-500 animate-pulse' : 'bg-orange-500'
                }`}></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  {connectionState === 'online' ? 'Bulut Bağlantısı Aktif' : 
                   connectionState === 'simulated' ? 'Simüle Bulut Modu' : 'Yerel Depolama (Offline)'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-[1.8rem] border border-slate-200/50">
            <button onClick={() => setView('candidate')} className={`px-8 py-3.5 rounded-[1.4rem] text-[11px] font-black uppercase tracking-widest transition-all ${view === 'candidate' ? 'bg-white shadow-xl text-orange-600 scale-105' : 'text-slate-500 hover:text-slate-800'}`}>Aday Formu</button>
            <button onClick={() => setView('admin')} className={`px-8 py-3.5 rounded-[1.4rem] text-[11px] font-black uppercase tracking-widest transition-all ${view === 'admin' ? 'bg-white shadow-xl text-orange-600 scale-105' : 'text-slate-500 hover:text-slate-800'}`}>Yönetici Paneli</button>
          </div>
        </div>
      </nav>

      <main className="py-12 px-8 max-w-7xl mx-auto min-h-[calc(100vh-6rem)]">
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
            onUpdate={handleUpdateCandidate}
          />
        )}
      </main>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl z-[200] flex items-center justify-center p-8">
          <div className="bg-white p-20 rounded-[4rem] shadow-2xl text-center max-w-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
               <div className="h-full bg-orange-600 animate-[loading_2s_infinite]"></div>
             </div>
             <div className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-10 shadow-2xl shadow-orange-100"></div>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Profil Analiz Ediliyor</h3>
             <p className="text-slate-500 mt-6 text-xl font-medium leading-relaxed">Yapay zeka katmanları, mesleki yetkinliklerinizi kurum kültürümüzle eşleştiriyor...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { width: 0%; left: 0%; }
          50% { width: 100%; left: 0%; }
          100% { width: 0%; left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default App;
