
import React, { useState, useEffect } from 'react';
import CandidateForm from './features/candidate-intake/CandidateForm';
import DashboardLayout from './components/admin/DashboardLayout';
import { GlobalConfig } from './types';
import { useAcademicEngine } from './hooks/useAcademicEngine';
import { storageService } from './services/storageService';

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
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const {
    candidates, config, isProcessing, isLoading, isLoggedIn,
    setIsLoggedIn, loadData, submitCandidate, analyzeCandidate, logout
  } = useAcademicEngine(DEFAULT_CONFIG);

  useEffect(() => {
    if (view === 'admin' && isLoggedIn) {
      loadData();
      const interval = setInterval(() => loadData(false), 45000);
      return () => clearInterval(interval);
    }
  }, [view, isLoggedIn, loadData]);

  useEffect(() => {
    const loader = document.getElementById('boot-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await storageService.login(loginForm.username, loginForm.password);
      if (result.success) {
        setIsLoggedIn(true);
        loadData();
      } else alert(result.error || "Giriş başarısız.");
    } catch (err) {
      alert("Kimlik doğrulama sunucusu şu an meşgul.");
    }
  };

  const onCandidateSubmit = async (data: any) => {
    try {
      const res = await submitCandidate(data);
      if (res.success) alert("Başvurunuz Akademi sistemine kaydedildi.");
      else alert(`Hata: ${res.error}`);
    } catch (err) {
      alert("Başvuru gönderilirken bir ağ hatası oluştu.");
    }
  };

  if (view === 'admin' && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-8">
        <div className="max-w-md w-full p-16 bg-white rounded-[4rem] shadow-2xl border border-orange-100 animate-scale-in">
           <div className="w-20 h-20 bg-slate-900 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white text-3xl font-black">YG</div>
           <h3 className="text-3xl font-black text-slate-900 mb-10 text-center uppercase tracking-tighter">Akademi Paneli</h3>
           <form onSubmit={handleAdminLogin} className="space-y-6">
              <input type="text" className="w-full p-6 rounded-3xl bg-slate-50 font-bold outline-none border-2 border-transparent focus:border-orange-600 transition-all" placeholder="Yönetici Kimliği" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
              <input type="password" className="w-full p-6 rounded-3xl bg-slate-50 font-bold outline-none border-2 border-transparent focus:border-orange-600 transition-all" placeholder="Giriş Anahtarı" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
              <button type="submit" disabled={isProcessing} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-black shadow-xl disabled:opacity-50">
                {isProcessing ? 'SİSTEM AÇILIYOR...' : 'SİSTEMİ AÇ'}
              </button>
           </form>
           <button onClick={() => setView('candidate')} className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-colors">Aday Sayfasına Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <nav className="bg-white/90 backdrop-blur-3xl border-b border-orange-50 sticky top-0 z-[100] h-20 md:h-24 flex items-center no-print shadow-sm">
        <div className="w-full max-w-[98vw] mx-auto px-4 md:px-10 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setView('candidate')}>
            <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black" style={{ backgroundColor: config.accentColor }}>YG</div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-slate-900 leading-none">{config.institutionName}</span>
              <span className="text-[7px] md:text-[8px] font-black text-orange-600 uppercase tracking-[0.3em] opacity-60 mt-1">Bulut Tabanlı Akademik Takip</span>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
            <button onClick={() => setView('candidate')} className={`px-6 md:px-10 py-2 md:py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase transition-all ${view === 'candidate' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}>Başvuru</button>
            <button onClick={() => setView('admin')} className={`px-6 md:px-10 py-2 md:py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase transition-all ${view === 'admin' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}>Yönetim</button>
          </div>
          {isLoggedIn && view === 'admin' && (
            <button onClick={() => { logout(); setView('candidate'); }} className="text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-700 ml-2 md:ml-4">Çıkış</button>
          )}
        </div>
      </nav>

      <main className={`mx-auto relative transition-all duration-700 ${view === 'admin' ? 'max-w-full px-2 md:px-4' : 'max-w-7xl px-8 py-12'}`}>
        {view === 'candidate' ? (
          <CandidateForm onSubmit={onCandidateSubmit} />
        ) : (
          <DashboardLayout 
            candidates={candidates} config={config} isProcessing={isProcessing}
            onUpdateCandidate={async (c) => await storageService.updateCandidate(c)}
            onDeleteCandidate={async (id) => await storageService.deleteCandidate(id)}
            onUpdateConfig={async (conf) => await storageService.saveConfig(conf)}
            onRefresh={() => loadData(true)}
          />
        )}
      </main>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center" aria-live="assertive">
          <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl flex flex-col items-center gap-8 animate-scale-in">
            <div className="w-16 h-16 border-8 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
            <p className="font-black text-slate-900 uppercase tracking-[0.3em] text-sm text-center">Veri Bütünlüğü Doğrulanıyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
