
import React, { useState, useEffect, useCallback } from 'react';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import { Candidate, GlobalConfig } from './types';
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
    const local = localStorage.getItem('yeni_gun_candidates');
    return local ? JSON.parse(local) : [];
  },
  async saveCandidate(candidate: Candidate) {
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    localStorage.setItem('yeni_gun_candidates', JSON.stringify([candidate, ...current]));
  },
  async updateCandidate(candidate: Candidate) {
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    const updated = current.map((c: Candidate) => c.id === candidate.id ? candidate : c);
    localStorage.setItem('yeni_gun_candidates', JSON.stringify(updated));
  },
  async deleteCandidate(id: string) {
    const current = JSON.parse(localStorage.getItem('yeni_gun_candidates') || '[]');
    const updated = current.filter((c: Candidate) => c.id !== id);
    localStorage.setItem('yeni_gun_candidates', JSON.stringify(updated));
  }
};

const DEFAULT_CONFIG: GlobalConfig = {
  institutionName: 'Yeni Gün Akademi',
  primaryColor: '#ea580c',
  aiTone: 'balanced',
  notificationEmail: 'info@yenigun.com',
  lastUpdated: Date.now()
};

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [config, setConfig] = useState<GlobalConfig>(DEFAULT_CONFIG);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'offline' | 'online'>('offline');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  useEffect(() => {
    const loader = document.getElementById('boot-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }
    
    const localConfig = localStorage.getItem('yeni_gun_config');
    if (localConfig) setConfig(JSON.parse(localConfig));
    
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    const isOnline = await storage.checkConnection();
    setConnectionStatus(isOnline ? 'online' : 'offline');
    const data = await storage.getCandidates();
    setCandidates(data);
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
      await storage.saveCandidate(newCandidate);
      setCandidates(prev => [newCandidate, ...prev]);
      
      // AI Analizi
      try {
        const report = await generateCandidateAnalysis(newCandidate);
        if (report) {
          const finalCandidate = { ...newCandidate, report };
          await storage.updateCandidate(finalCandidate);
          setCandidates(prev => prev.map(c => c.id === newCandidate.id ? finalCandidate : c));
        }
      } catch (e) { console.error("Analiz Hatası:", e); }
      
      alert("Başvurunuz başarıyla kaydedildi.");
      setView('candidate');
    } catch (error) {
      alert("Bir hata oluştu.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'yenigun2024') {
      setIsLoggedIn(true);
    } else { alert("Hatalı giriş."); }
  };

  const updateConfig = (newConf: GlobalConfig) => {
    setConfig(newConf);
    localStorage.setItem('yeni_gun_config', JSON.stringify(newConf));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-orange-100 selection:text-orange-900">
      <div className="fixed top-0 left-0 w-full h-2 bg-orange-600 z-[100]"></div>
      
      <nav className="bg-white/90 backdrop-blur-3xl border-b border-orange-50 sticky top-0 z-[60] shadow-sm h-28 flex items-center">
        <div className="max-w-7xl mx-auto px-10 w-full flex items-center justify-between">
          <div className="flex items-center space-x-6 cursor-pointer group" onClick={() => setView('candidate')}>
            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black shadow-2xl group-hover:bg-orange-600 transition-colors duration-500">YG</div>
            <div>
              <span className="text-3xl font-black tracking-tighter uppercase block leading-none text-slate-900">{config.institutionName.split(' ')[0]}</span>
              <div className="flex items-center gap-2 mt-2 uppercase font-black text-[10px] tracking-[0.2em] text-slate-400">
                <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                {connectionStatus === 'online' ? 'Senkronize' : 'Yerel Veri'}
              </div>
            </div>
          </div>
          <div className="flex bg-orange-50/50 p-2 rounded-[2rem] border border-orange-100 shadow-inner">
            <button onClick={() => setView('candidate')} className={`px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all ${view === 'candidate' ? 'bg-white shadow-xl text-orange-600' : 'text-slate-500'}`}>Form</button>
            <button onClick={() => setView('admin')} className={`px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all ${view === 'admin' ? 'bg-white shadow-xl text-orange-600' : 'text-slate-500'}`}>Panel</button>
          </div>
        </div>
      </nav>

      <main className="py-20 px-8 max-w-7xl mx-auto min-h-[calc(100vh-7rem)]">
        {view === 'candidate' ? (
          <CandidateForm onSubmit={handleCandidateSubmit} />
        ) : !isLoggedIn ? (
          <div className="max-w-lg mx-auto p-16 bg-white rounded-[4rem] shadow-2xl border border-orange-100 animate-scale-in">
             <h3 className="text-4xl font-black text-slate-900 mb-10 uppercase text-center tracking-tighter">Akademi Erişimi</h3>
             <form onSubmit={handleLogin} className="space-y-8">
                <input type="text" className="w-full p-7 rounded-3xl border-2 border-slate-50 outline-none font-bold focus:border-orange-500 transition-all" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} placeholder="Kullanıcı Adı" />
                <input type="password" className="w-full p-7 rounded-3xl border-2 border-slate-50 outline-none font-bold focus:border-orange-500 transition-all" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="••••••••" />
                <button type="submit" className="w-full py-7 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-orange-600 shadow-xl transition-all">Sistemi Başlat</button>
             </form>
          </div>
        ) : (
          <Dashboard 
            candidates={candidates} 
            config={config}
            onUpdateConfig={updateConfig}
            onDeleteCandidate={async (id) => {
              await storage.deleteCandidate(id);
              setCandidates(c => c.filter(x => x.id !== id));
            }}
            onUpdateCandidate={async (c) => {
              await storage.updateCandidate(c);
              setCandidates(prev => prev.map(x => x.id === c.id ? c : x));
            }}
          />
        )}
      </main>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl z-[200] flex items-center justify-center p-8">
          <div className="bg-white p-24 rounded-[5rem] text-center border border-orange-100 shadow-2xl max-w-lg animate-bounce-in">
             <div className="w-28 h-28 border-[12px] border-orange-100 border-t-orange-600 rounded-full animate-spin mx-auto mb-12"></div>
             <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">Veri Güvenli İşleniyor</h3>
             <p className="text-slate-500 text-xl font-medium italic">Gemini motoru nöronları ateşliyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
