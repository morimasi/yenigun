
import React, { useState, useEffect, useCallback } from 'react';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import { Candidate } from './types';
import { generateCandidateAnalysis } from './geminiService';

const storage = {
  isLocalMode: true,
  async checkConnection() {
    try {
      const response = await fetch('/api/candidates', { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
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
      } catch (e) {}
    }
    const local = localStorage.getItem('yeni_gun_candidates');
    return local ? JSON.parse(local) : [];
  },
  async saveCandidate(candidate: Candidate) {
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidate, ...current]));
    if (!this.isLocalMode) {
      try {
        await fetch('/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(candidate)
        });
      } catch (e) {}
    }
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'offline' | 'online'>('offline');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  useEffect(() => {
    const loader = document.getElementById('boot-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }
  }, []);

  const loadData = useCallback(async () => {
    const isOnline = await storage.checkConnection();
    setConnectionStatus(isOnline ? 'online' : 'offline');
    const data = await storage.getCandidates();
    setCandidates(data);
  }, []);

  useEffect(() => {
    loadData();
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
      await storage.saveCandidate(newCandidate);
      setCandidates(prev => [newCandidate, ...prev]);
      const report = await generateCandidateAnalysis(newCandidate);
      const finalCandidate = { ...newCandidate, report };
      if (connectionStatus === 'online') {
        await fetch('/api/candidates', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newCandidate.id, report, status: 'pending' })
        });
      }
      const updatedList = [finalCandidate, ...candidates.filter(c => c.id !== newCandidate.id)];
      setCandidates(updatedList);
      localStorage.setItem('yeni_gun_candidates', JSON.stringify(updatedList));
      alert("Başvurunuz başarıyla kaydedildi. Akademi kurulumuz değerlendirmeye alacaktır.");
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'yenigun2024') {
      setIsLoggedIn(true);
    } else {
      alert("Geçersiz kullanıcı adı veya şifre.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <nav className="bg-white/95 backdrop-blur-3xl border-b border-slate-100 sticky top-0 z-[60] shadow-sm h-24 flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between">
          <div className="flex items-center space-x-5 cursor-pointer" onClick={() => setView('candidate')}>
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-xl">YG</div>
            <div>
              <span className="text-2xl font-black tracking-tighter uppercase block leading-none text-slate-900">YENİ GÜN</span>
              <div className="flex items-center gap-2 mt-1.5 uppercase font-black text-[9px] tracking-widest text-slate-400">
                <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`}></div>
                {connectionStatus}
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
            <button onClick={() => setView('candidate')} className={`px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'candidate' ? 'bg-white shadow-xl text-orange-600' : 'text-slate-500'}`}>Aday Formu</button>
            <button onClick={() => setView('admin')} className={`px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'admin' ? 'bg-white shadow-xl text-orange-600' : 'text-slate-500'}`}>
              {isLoggedIn ? 'Yönetici Paneli' : 'Giriş Yap'}
            </button>
          </div>
        </div>
      </nav>

      <main className="py-12 px-8 max-w-7xl mx-auto min-h-[calc(100vh-6rem)]">
        {view === 'candidate' ? (
          <CandidateForm onSubmit={handleCandidateSubmit} />
        ) : !isLoggedIn ? (
          <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 animate-scale-in">
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-8 uppercase text-center">Giriş Yap</h3>
             <form onSubmit={handleLogin} className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kullanıcı Adı</label>
                   <input type="text" className="w-full p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 font-bold" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Şifre</label>
                   <input type="password" className="w-full p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 font-bold" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all">Sisteme Giriş</button>
             </form>
          </div>
        ) : (
          <Dashboard 
            candidates={candidates} 
            onDelete={async (id) => {
              if (connectionStatus === 'online') await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' });
              setCandidates(c => c.filter(x => x.id !== id));
            }}
            onUpdate={async (c) => {
              if (connectionStatus === 'online') await fetch('/api/candidates', { method: 'PATCH', body: JSON.stringify(c) });
              setCandidates(prev => prev.map(x => x.id === c.id ? c : x));
            }}
          />
        )}
      </main>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-8">
          <div className="bg-white p-20 rounded-[4rem] text-center max-w-xl animate-scale-in">
             <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-10"></div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">İşleniyor</h3>
             <p className="text-slate-500 mt-4 text-lg font-medium italic">Veriler mühürleniyor ve akademi kriterleri analiz ediliyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
