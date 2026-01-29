
import React, { useState, useEffect } from 'react';
import CandidateForm from './features/candidate-intake/CandidateForm';
import DashboardLayout from './components/admin/DashboardLayout';
import StaffAssessmentPortal from './features/staff-mentor/StaffAssessmentPortal';
import { GlobalConfig, Candidate } from './types';
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
  const [view, setView] = useState<'candidate' | 'admin' | 'staff'>('candidate');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [staffRefreshKey, setStaffRefreshKey] = useState(Date.now());

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

  const handleCandidateUpdate = async (c: Candidate) => {
    const result = await storageService.updateCandidate(c);
    if (result.success) {
      if (c.archiveCategory === 'HIRED_CONTRACTED') {
        setStaffRefreshKey(Date.now());
      }
      loadData(false);
    }
    return result;
  };

  // ADMIN LOGIN SCREEN
  if (view === 'admin' && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-sm w-full p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
           <div className="w-12 h-12 bg-slate-900 rounded-lg mx-auto mb-6 flex items-center justify-center text-white text-lg font-black">YG</div>
           <h3 className="text-lg font-black text-slate-900 mb-6 text-center uppercase tracking-widest">YÖNETİM ERİŞİMİ</h3>
           <form onSubmit={handleAdminLogin} className="space-y-4">
              <input type="text" className="w-full p-3 rounded-lg bg-slate-50 font-bold border border-slate-200 focus:border-orange-500 outline-none text-xs" placeholder="Kullanıcı" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
              <input type="password" className="w-full p-3 rounded-lg bg-slate-50 font-bold border border-slate-200 focus:border-orange-500 outline-none text-xs" placeholder="Şifre" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
              <button type="submit" disabled={isProcessing} className="w-full py-3 bg-slate-900 text-white rounded-lg font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md disabled:opacity-50 text-[10px]">
                {isProcessing ? 'GİRİLİYOR...' : 'GÜVENLİ GİRİŞ'}
              </button>
           </form>
           <button onClick={() => setView('candidate')} className="w-full mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600">Başvuru Ekranına Dön</button>
        </div>
      </div>
    );
  }

  // PUBLIC/STAFF NAVIGATION (Simple Header)
  if (view !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F1F5F9]">
        {showSuccessModal && (
          <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
             <div className="max-w-md w-full bg-white rounded-2xl p-10 text-center shadow-2xl">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-2">KAYIT MÜHÜRLENDİ</h2>
                <p className="text-xs font-bold text-slate-500">Akademik analiz süreci başlatılmıştır.</p>
             </div>
          </div>
        )}

        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16 flex items-center">
          <div className="w-full max-w-5xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('candidate')}>
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs">YG</div>
              <span className="text-xs font-black tracking-widest uppercase text-slate-900">YENİ GÜN AKADEMİ</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button onClick={() => setView('candidate')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${view === 'candidate' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}>Başvuru</button>
              <button onClick={() => setView('staff')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${view === 'staff' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}>Personel</button>
              <button onClick={() => setView('admin')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${view === 'admin' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}>Yönetim</button>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl py-8">
          {view === 'candidate' ? (
            <CandidateForm key={resetTrigger} onSubmit={onCandidateSubmit} />
          ) : (
            <StaffAssessmentPortal />
          )}
        </main>
      </div>
    );
  }

  // ADMIN DASHBOARD MODE (Full Screen)
  return (
    <DashboardLayout 
      candidates={candidates} 
      config={config} 
      isProcessing={isProcessing}
      staffRefreshKey={staffRefreshKey}
      setStaffRefreshKey={setStaffRefreshKey}
      onUpdateCandidate={handleCandidateUpdate}
      onDeleteCandidate={async (id) => await storageService.deleteCandidate(id)}
      onUpdateConfig={async (conf) => await storageService.saveConfig(conf)}
      onRefresh={() => loadData(true)}
    />
  );
};

export default App;
