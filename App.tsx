
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

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
      alert("Hata oluştu.");
    }
  };

  const onCandidateSubmit = async (data: any) => {
    try {
      const res = await submitCandidate(data);
      if (res.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          setResetTrigger(prev => prev + 1);
          setView('candidate');
        }, 6000);
      } else {
        alert(`Hata: ${res.error}`);
      }
    } catch (err) {
      alert("Ağ hatası.");
    }
  };

  if (view === 'admin' && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-sm w-full p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 animate-scale-in">
           <div className="w-14 h-14 bg-slate-900 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-xl font-black">YG</div>
           <h3 className="text-xl font-black text-slate-900 mb-8 text-center uppercase tracking-widest">YÖNETİM KOMUTASI</h3>
           <form onSubmit={handleAdminLogin} className="space-y-4">
              <input type="text" className="w-full p-4 rounded-xl bg-slate-50 font-bold border-0 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" placeholder="Kullanıcı" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
              <input type="password" className="w-full p-4 rounded-xl bg-slate-50 font-bold border-0 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" placeholder="Şifre" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
              <button type="submit" disabled={isProcessing} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg disabled:opacity-50 text-xs">
                {isProcessing ? 'GİRİLİYOR...' : 'SİSTEMİ AÇ'}
              </button>
           </form>
           <button onClick={() => setView('candidate')} className="w-full mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600">Başvuru Sayfası</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {showSuccessModal && (
        <div className="fixed inset-0 z-[300] bg-slate-900/98 backdrop-blur-2xl flex items-center justify-center p-6 no-print animate-fade-in">
           <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-3xl border border-white/20 animate-scale-in">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-4">BAŞVURU MÜHÜRLENDİ</h2>
              <p className="text-sm font-bold text-slate-500 leading-relaxed italic mb-8">
                "Klinik verileriniz Gemini-3 Nöral Muhakeme motoru tarafından analize alınmıştır."
              </p>
              <div className="flex gap-1 justify-center">
                 <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-pulse"></div>
                 <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-pulse delay-75"></div>
                 <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-pulse delay-150"></div>
              </div>
           </div>
        </div>
      )}

      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] h-16 flex items-center no-print">
        <div className="w-full max-w-[98vw] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('candidate')}>
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: config.accentColor }}>YG</div>
            <div className="hidden sm:flex flex-col">
              <span className="text-base font-black tracking-tighter uppercase text-slate-900 leading-none">{config.institutionName}</span>
              <span className="text-[7px] font-black text-orange-600 uppercase tracking-widest mt-1">Akademik Takip v5</span>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setView('candidate')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'candidate' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}>Başvuru</button>
            <button onClick={() => setView('admin')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'admin' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}>Yönetim</button>
          </div>
          {isLoggedIn && view === 'admin' && (
            <button onClick={() => { logout(); setView('candidate'); }} className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-4">Çıkış</button>
          )}
        </div>
      </nav>

      <main className={`mx-auto transition-all duration-500 ${view === 'admin' ? 'max-w-full' : 'max-w-4xl py-4'}`}>
        {view === 'candidate' ? (
          <CandidateForm key={resetTrigger} onSubmit={onCandidateSubmit} />
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
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 z-[200] animate-slide-up">
          <div className="w-4 h-4 border-2 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="font-black text-slate-900 uppercase tracking-widest text-[9px]">Sistem İşleniyor...</p>
        </div>
      )}
    </div>
  );
};

export default App;
