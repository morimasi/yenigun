
import React, { useState, useEffect, useCallback } from 'react';
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
  aiWeights: {
    ethics: 40,
    clinical: 30,
    experience: 15,
    fit: 15
  },
  automation: {
    autoEmailOnSchedule: true,
    requireCvUpload: true,
    allowMultipleApplications: false
  },
  interviewSettings: {
    defaultDuration: 45,
    bufferTime: 15,
    autoStatusAfterInterview: false,
    defaultMeetingLink: 'https://meet.google.com/new'
  },
  notificationEmail: 'info@yenigun.com',
  lastUpdated: Date.now()
};

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'admin'>('candidate');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [config, setConfig] = useState<GlobalConfig>(DEFAULT_CONFIG);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const loadData = useCallback(async () => {
    const data = await storageService.getCandidates();
    setCandidates(data);
    
    const localConfig = localStorage.getItem('yeni_gun_config');
    if (localConfig) {
      const parsed = JSON.parse(localConfig);
      setConfig({ ...DEFAULT_CONFIG, ...parsed });
    }
  }, []);

  useEffect(() => {
    const loader = document.getElementById('boot-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }
    loadData();
  }, [loadData]);

  const handleCandidateSubmit = async (data: any) => {
    setIsProcessing(true);
    const newCandidate: Candidate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'pending'
    };

    await storageService.saveCandidate(newCandidate);
    setCandidates(prev => [newCandidate, ...prev]);

    // Güncel config ile analiz başlat
    generateCandidateAnalysis(newCandidate, config).then(async (report) => {
      if (report) {
        const final = { ...newCandidate, report };
        await storageService.updateCandidate(final);
        setCandidates(prev => prev.map(c => c.id === newCandidate.id ? final : c));
      }
    });

    setIsProcessing(false);
    alert("Başvurunuz kaydedildi.");
    setView('candidate');
  };

  const handleUpdateConfig = (newConfig: GlobalConfig) => {
    setConfig(newConfig);
    localStorage.setItem('yeni_gun_config', JSON.stringify(newConfig));
    document.documentElement.style.setProperty('--primary-color', newConfig.primaryColor);
  };

  if (view === 'admin' && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-8">
        <div className="max-w-md w-full p-16 bg-white rounded-[4rem] shadow-2xl border border-orange-100">
           <h3 className="text-3xl font-black text-slate-900 mb-10 text-center uppercase tracking-tighter">Akademi Paneli</h3>
           <form onSubmit={(e) => { e.preventDefault(); if(loginForm.password === 'yenigun2024') setIsLoggedIn(true); }} className="space-y-6">
              <input type="text" className="w-full p-6 rounded-3xl bg-slate-50 font-bold" placeholder="Kullanıcı" onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
              <input type="password" className="w-full p-6 rounded-3xl bg-slate-50 font-bold" placeholder="Şifre" onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
              <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest">Giriş</button>
           </form>
           <button onClick={() => setView('candidate')} className="w-full mt-4 text-[10px] font-black text-slate-400 uppercase">Geri Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <nav className="bg-white/90 backdrop-blur-3xl border-b border-orange-50 sticky top-0 z-[60] h-28 flex items-center no-print">
        <div className="max-w-7xl mx-auto px-10 w-full flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setView('candidate')}>
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black" style={{ backgroundColor: config.accentColor }}>YG</div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">{config.institutionName}</span>
          </div>
          <div className="flex bg-orange-50 p-2 rounded-full border border-orange-100">
            <button onClick={() => setView('candidate')} className={`px-8 py-3 rounded-full text-[11px] font-black uppercase ${view === 'candidate' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400'}`}>Başvuru</button>
            <button onClick={() => setView('admin')} className={`px-8 py-3 rounded-full text-[11px] font-black uppercase ${view === 'admin' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400'}`}>Yönetim</button>
          </div>
        </div>
      </nav>

      <main className="py-20 px-8 max-w-7xl mx-auto">
        {view === 'candidate' ? <CandidateForm onSubmit={handleCandidateSubmit} /> : 
        <DashboardLayout 
          candidates={candidates} config={config} 
          onUpdateCandidate={c => { storageService.updateCandidate(c); setCandidates(prev => prev.map(x => x.id === c.id ? c : x)); }}
          onDeleteCandidate={id => { storageService.deleteCandidate(id); setCandidates(prev => prev.filter(x => x.id !== id)); }}
          onUpdateConfig={handleUpdateConfig}
        />}
      </main>

      {isProcessing && <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center font-black text-white">İŞLENİYOR...</div>}
    </div>
  );
};

export default App;
