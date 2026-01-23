
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CandidateForm from './components/CandidateForm';
import DashboardLayout from './components/admin/DashboardLayout';
import { Candidate, GlobalConfig } from './types';
import { storageService } from './services/storageService';
import { generateCandidateAnalysis } from './geminiService';

const DEFAULT_CONFIG: GlobalConfig = {
  institutionName: 'Yeni Gün Akademi',
  primaryColor: '#ea580c',
  accentColor: '#0f172a',
  aiTone: 'balanced',
  aiPersona: { skepticism: 50, empathy: 50, formality: 70 },
  aiWeights: { ethics: 40, clinical: 30, experience: 15, fit: 15 },
  automation: { autoEmailOnSchedule: true, requireCvUpload: true, allowMultipleApplications: false },
  interviewSettings: { defaultDuration: 45, bufferTime: 15, autoStatusAfterInterview: false, defaultMeetingLink: 'https://meet.google.com/new' },
  notificationEmail: 'info@yenigun.com',
  lastUpdated: Date.now()
};

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [config, setConfig] = useState<GlobalConfig>(DEFAULT_CONFIG);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  const pollInterval = useRef<number | null>(null);

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setIsProcessing(true);
    if (!isManual && candidates.length === 0) setIsLoading(true);

    try {
      const data = await storageService.getCandidates(isManual);
      setCandidates(data);
      
      const remoteConfig = await storageService.getConfig();
      if (remoteConfig) {
        setConfig(prev => ({ ...prev, ...remoteConfig }));
        document.documentElement.style.setProperty('--primary-color', remoteConfig.primaryColor);
      }
    } catch (e) {
      console.error("Yükleme hatası:", e);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, [candidates.length]);

  useEffect(() => {
    if (view === 'admin' && isLoggedIn) {
      pollInterval.current = window.setInterval(() => {
        loadData(false);
      }, 30000);
    } else {
      if (pollInterval.current) clearInterval(pollInterval.current);
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [view, isLoggedIn, loadData]);

  useEffect(() => {
    loadData();
    const loader = document.getElementById('boot-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }
  }, []);

  const handleCandidateSubmit = async (data: any) => {
    setIsProcessing(true);
    const candidateId = Math.random().toString(36).substr(2, 9);
    const newCandidate: Candidate = {
      ...data,
      id: candidateId,
      timestamp: Date.now(),
      status: 'pending'
    };

    // DOĞRUDAN BULUTA KAYDET
    const result = await storageService.saveCandidate(newCandidate);
    
    if (result.success) {
      setCandidates(prev => [newCandidate, ...prev]);
      
      // Arka planda AI Analizini başlat
      generateCandidateAnalysis(newCandidate, config).then(async (report) => {
        if (report) {
          const finalCandidate = { ...newCandidate, report, timestamp: Date.now() };
          await storageService.updateCandidate(finalCandidate);
          setCandidates(prev => prev.map(c => c.id === candidateId ? finalCandidate : c));
        }
      }).catch(err => console.error("AI Analiz Hatası:", err));
      
      alert("Başvurunuz başarıyla Yeni Gün Akademi bulut sistemine aktarıldı. Teşekkür ederiz.");
    } else {
      // Hata mesajını detaylandır
      alert(`BAŞVURU KAYDEDİLEMEDİ:\n${result.error}\n\nNot: Verileriniz tarayıcıda yedeklendi, bağlantı düzelince tekrar deneyebilirsiniz.`);
    }

    setIsProcessing(false);
    setView('candidate');
  };

  const handleUpdateConfig = async (newConfig: GlobalConfig) => {
    setConfig(newConfig);
    document.documentElement.style.setProperty('--primary-color', newConfig.primaryColor);
    await storageService.saveConfig(newConfig);
  };

  if (view === 'admin' && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-8">
        <div className="max-w-md w-full p-16 bg-white rounded-[4rem] shadow-2xl border border-orange-100 animate-scale-in">
           <div className="w-20 h-20 bg-slate-900 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white text-3xl font-black">YG</div>
           <h3 className="text-3xl font-black text-slate-900 mb-10 text-center uppercase tracking-tighter">Akademi Paneli</h3>
           <form onSubmit={(e) => { e.preventDefault(); if(loginForm.password === 'yenigun2024') setIsLoggedIn(true); else alert("Hatalı Şifre"); }} className="space-y-6">
              <input type="text" className="w-full p-6 rounded-3xl bg-slate-50 font-bold outline-none border-2 border-transparent focus:border-orange-600 transition-all" placeholder="Yönetici Kimliği" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
              <input type="password" className="w-full p-6 rounded-3xl bg-slate-50 font-bold outline-none border-2 border-transparent focus:border-orange-600 transition-all" placeholder="Giriş Anahtarı" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
              <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">Sistemi Aç</button>
           </form>
           <button onClick={() => setView('candidate')} className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-colors">Aday Sayfasına Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <nav className="bg-white/90 backdrop-blur-3xl border-b border-orange-50 sticky top-0 z-[60] h-28 flex items-center no-print shadow-sm">
        <div className="max-w-7xl mx-auto px-10 w-full flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setView('candidate')}>
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black transition-transform group-hover:scale-105" style={{ backgroundColor: config.accentColor }}>YG</div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">{config.institutionName}</span>
              <span className="text-[8px] font-black text-orange-600 uppercase tracking-[0.3em] opacity-60">Bulut Tabanlı Akademik Takip</span>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-full border border-slate-200">
            <button onClick={() => setView('candidate')} className={`px-10 py-3 rounded-full text-[11px] font-black uppercase transition-all ${view === 'candidate' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}>Başvuru</button>
            <button onClick={() => setView('admin')} className={`px-10 py-3 rounded-full text-[11px] font-black uppercase transition-all ${view === 'admin' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}>Yönetim</button>
          </div>
        </div>
      </nav>

      <main className="py-20 px-8 max-w-7xl mx-auto min-h-[calc(100vh-112px)] relative">
        {isLoading && candidates.length === 0 && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[4rem]">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Bulut Verileri Alınıyor...</p>
             </div>
          </div>
        )}
        
        {view === 'candidate' ? (
          <CandidateForm onSubmit={handleCandidateSubmit} />
        ) : (
          <DashboardLayout 
            candidates={candidates} 
            config={config} 
            onUpdateCandidate={async (c) => { 
              const res = await storageService.updateCandidate(c); 
              if(res.success) setCandidates(prev => prev.map(x => x.id === c.id ? c : x)); 
            }}
            onDeleteCandidate={async (id) => { 
              const ok = await storageService.deleteCandidate(id);
              if(ok) setCandidates(prev => prev.filter(x => x.id !== id)); 
            }}
            onUpdateConfig={handleUpdateConfig}
            onRefresh={() => loadData(true)}
            isProcessing={isProcessing}
          />
        )}
      </main>

      {isProcessing && view === 'candidate' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="bg-white p-16 rounded-[4rem] shadow-2xl flex flex-col items-center gap-8 animate-scale-in">
            <div className="w-16 h-16 border-8 border-slate-100 border-t-orange-600 rounded-full animate-spin shadow-lg"></div>
            <div className="text-center">
              <p className="font-black text-slate-900 uppercase tracking-[0.3em] text-sm">Bulut Senkronizasyonu</p>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest animate-pulse">Aday Dosyası Mühürleniyor...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
