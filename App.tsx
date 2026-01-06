
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
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isKeyLoading, setIsKeyLoading] = useState(false);

  // API Key durumunu kontrol et
  const checkApiKeyStatus = useCallback(async () => {
    try {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
        return selected;
      }
    } catch (e) {
      console.warn("API Key status check failed", e);
    }
    return false;
  }, []);

  useEffect(() => {
    checkApiKeyStatus();
    // Boot loader temizliği
    const loader = document.getElementById('boot-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }
  }, [checkApiKeyStatus]);

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

  // Düğme tıklama işleyicisi (Geliştirilmiş)
  const handleOpenKeySelector = async () => {
    setIsKeyLoading(true);
    try {
      // window.aistudio nesnesinin hazır olup olmadığını kontrol et
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        // Talimat Gereği: Başarılı varsay ve devam et
        setHasApiKey(true);
        console.log("API Key selector opened successfully.");
      } else {
        alert("Sistem henüz hazır değil. Lütfen birkaç saniye sonra tekrar deneyin.");
        console.error("window.aistudio.openSelectKey is not available.");
      }
    } catch (err) {
      console.error("Error opening key selector:", err);
      alert("Seçim ekranı açılamadı. Tarayıcı ayarlarınızı kontrol edin.");
    } finally {
      setIsKeyLoading(false);
    }
  };

  const handleCandidateSubmit = async (data: any) => {
    setIsProcessing(true);
    
    // Form verilerini hemen kaydet (Analizden bağımsız)
    const newCandidate: Candidate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'pending'
    };

    try {
      await storage.saveCandidate(newCandidate);
      setCandidates(prev => [newCandidate, ...prev]);

      // API Key kontrolü ve analiz
      const keySelected = await checkApiKeyStatus();
      if (!keySelected) {
        // Anahtar yoksa analiz yapma ama kaydet
        setIsProcessing(false);
        alert("Başvurunuz alındı. Analiz, yönetici anahtarını bağladığında tamamlanacaktır.");
        setView('candidate');
        return;
      }

      const report = await generateCandidateAnalysis(newCandidate);
      
      if (report) {
        const finalCandidate = { ...newCandidate, report };
        const updatedList = [finalCandidate, ...candidates.filter(c => c.id !== newCandidate.id)];
        setCandidates(updatedList);
        localStorage.setItem('yeni_gun_candidates', JSON.stringify(updatedList));

        if (connectionStatus === 'online') {
          await fetch('/api/candidates', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: newCandidate.id, report, status: 'pending' })
          });
        }
      }
      
      alert("Başvurunuz ve yapay zeka analiziniz başarıyla kaydedildi.");
      setView('candidate');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Submit/Analysis Error:", error);
      if (error.message?.includes("API_KEY")) {
        setHasApiKey(false);
        alert("Analiz motoru hatası: API anahtarınız geçersiz veya eksik. Lütfen yöneticiye başvurun.");
      } else {
        alert("Bir hata oluştu, ancak başvurunuz kaydedildi.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'yenigun2024') {
      setIsLoggedIn(true);
    } else {
      alert("Hatalı giriş.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <div className="fixed top-0 left-0 w-full h-2 bg-orange-600 z-[100]"></div>
      
      <nav className="bg-white/90 backdrop-blur-3xl border-b border-orange-50 sticky top-0 z-[60] shadow-sm h-28 flex items-center">
        <div className="max-w-7xl mx-auto px-10 w-full flex items-center justify-between">
          <div className="flex items-center space-x-6 cursor-pointer group" onClick={() => setView('candidate')}>
            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black shadow-2xl group-hover:bg-orange-600 transition-colors duration-500">YG</div>
            <div>
              <span className="text-3xl font-black tracking-tighter uppercase block leading-none text-slate-900">YENİ GÜN</span>
              <div className="flex items-center gap-2 mt-2 uppercase font-black text-[10px] tracking-[0.2em] text-slate-400">
                <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                {connectionStatus === 'online' ? 'Sunucu Bağlı' : 'Yerel Mod'}
              </div>
            </div>
          </div>
          <div className="flex bg-orange-50/50 p-2 rounded-[2rem] border border-orange-100 shadow-inner">
            <button onClick={() => setView('candidate')} className={`px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all ${view === 'candidate' ? 'bg-white shadow-xl text-orange-600' : 'text-slate-500'}`}>Form</button>
            <button onClick={() => setView('admin')} className={`px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all ${view === 'admin' ? 'bg-white shadow-xl text-orange-600' : 'text-slate-500'}`}>Yönetim</button>
          </div>
        </div>
      </nav>

      <main className="py-20 px-8 max-w-7xl mx-auto min-h-[calc(100vh-7rem)]">
        {view === 'candidate' ? (
          <CandidateForm onSubmit={handleCandidateSubmit} />
        ) : !isLoggedIn ? (
          <div className="max-w-lg mx-auto p-16 bg-white rounded-[4rem] shadow-2xl border border-orange-100">
             <h3 className="text-4xl font-black text-slate-900 mb-10 uppercase text-center">Giriş</h3>
             <form onSubmit={handleLogin} className="space-y-8">
                <input type="text" className="w-full p-6 rounded-3xl border-2 border-orange-50 outline-none font-bold" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} placeholder="Kullanıcı Adı" />
                <input type="password" className="w-full p-6 rounded-3xl border-2 border-orange-50 outline-none font-bold" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="••••••••" />
                <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-orange-600 transition-all">Giriş</button>
             </form>
          </div>
        ) : (
          <div className="space-y-12">
            {!hasApiKey && (
              <div className="bg-orange-600 p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl animate-pulse-slow">
                <div className="mb-6 md:mb-0">
                  <h4 className="text-2xl font-black uppercase tracking-tighter">AI Motoru Bağlantısı Gerekli</h4>
                  <p className="opacity-80 font-bold mt-2">Analizlerin çalışması için ücretli projenize ait API anahtarını seçmelisiniz.</p>
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest underline mt-4 block opacity-60 hover:opacity-100">Faturalandırma Dökümantasyonu</a>
                </div>
                <button 
                  onClick={handleOpenKeySelector} 
                  disabled={isKeyLoading}
                  className={`px-12 py-6 bg-white text-orange-600 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all ${isKeyLoading ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {isKeyLoading ? 'Hazırlanıyor...' : 'API ANAHTARINI SEÇ'}
                </button>
              </div>
            )}
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
          </div>
        )}
      </main>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl z-[200] flex items-center justify-center">
          <div className="bg-white p-24 rounded-[5rem] text-center border border-orange-100 shadow-2xl max-w-lg">
             <div className="w-28 h-28 border-[12px] border-orange-100 border-t-orange-600 rounded-full animate-spin mx-auto mb-12"></div>
             <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Nöral Analiz</h3>
             <p className="text-slate-500 text-xl font-medium italic">Gemini 3 Flash Multimodal verileri işliyor. Lütfen sekmeyi kapatmayın...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
