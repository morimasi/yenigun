
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MODULAR_BATTERIES } from './assessmentData';
import { AssessmentBattery, Branch, AssessmentQuestion, StaffMember } from '../../types';
import { TURKISH_UNIVERSITIES, TURKISH_DEPARTMENTS } from '../../constants';
import { SearchableSelect } from '../../shared/ui/SearchableSelect';
import PresentationStudio from '../training/PresentationStudio';
import { SmartBackButton } from '../../components/shared/SmartBackButton';

type PortalStep = 'auth' | 'onboarding' | 'dashboard' | 'exam' | 'training_player';

const shuffleQuestions = (questions: AssessmentQuestion[]): AssessmentQuestion[] => {
  return questions.map(q => ({
    ...q,
    options: [...q.options].sort(() => Math.random() - 0.5)
  }));
};

const StaffAssessmentPortal: React.FC = () => {
  const [step, setStep] = useState<PortalStep>('auth');
  const [stepHistory, setStepHistory] = useState<PortalStep[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [staff, setStaff] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', branch: Branch.OzelEgitim, phone: '' });
  const [completedBatteries, setCompletedBatteries] = useState<string[]>([]);
  const [assignedTrainings, setAssignedTrainings] = useState<any[]>([]);
  const [activeTraining, setActiveTraining] = useState<any>(null);
  
  const [activeModule, setActiveModule] = useState<AssessmentBattery | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<AssessmentQuestion[]>([]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', branch: Branch.OzelEgitim, university: '', department: '', experienceYears: 0 });

  const navigateToStep = (nextStep: PortalStep) => {
    if (step !== nextStep) {
      setStepHistory(prev => [...prev, step]);
      setStep(nextStep);
    }
  };

  const handleBack = () => {
    if (step === 'exam') {
        if(!confirm("Sınavdan çıkmak istiyor musunuz? İlerlemeniz silinebilir.")) return;
    }
    if (stepHistory.length > 0) {
      const prevStep = stepHistory[stepHistory.length - 1];
      setStepHistory(prev => prev.slice(0, -1));
      setStep(prevStep);
      if (prevStep === 'dashboard') {
        setActiveModule(null);
        setActiveTraining(null);
      }
    }
  };

  const fetchAssignments = useCallback(async (sid: string) => {
    try {
      const res = await fetch(`/api/training?action=get_staff_assignments&staffId=${sid}`);
      if (res.ok) setAssignedTrainings(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (staff?.id) fetchAssignments(staff.id);
  }, [staff, fetchAssignments, step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/staff?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.success) {
        setStaff(data.staff);
        setCompletedBatteries(data.staff.completedBatteries || []);
        setProfileData({
          name: data.staff.name,
          branch: data.staff.branch,
          university: data.staff.university || '',
          department: data.staff.department || '',
          experienceYears: data.staff.experience_years || 0
        });
        navigateToStep(data.staff.onboarding_complete ? 'dashboard' : 'onboarding');
      } else alert(data.message);
    } catch (e) { alert("Hata."); }
    finally { setIsSaving(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/staff?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (data.success) { alert("Kayıt başarılı."); setAuthMode('login'); }
      else alert(data.message);
    } finally { setIsSaving(false); }
  };

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/staff?action=update_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profileData, id: staff.id })
      });
      if (res.ok) {
        setStaff(prev => ({ ...prev, ...profileData }));
        navigateToStep('dashboard');
        setIsEditingProfile(false);
      }
    } finally { setIsSaving(false); }
  };

  const handleSubmitExam = async () => {
    const sum: number = (Object.values(answers) as number[]).reduce((a, b) => a + b, 0);
    const score = Math.round(sum / (activeModule?.questions.length || 1));
    setIsSaving(true);
    try {
      await fetch(`/api/staff?action=save_assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: staff.id, batteryId: activeModule!.id, answers, score, aiTags: [] })
      });
      setCompletedBatteries(prev => [...prev, activeModule!.id]);
      navigateToStep('dashboard');
      setActiveModule(null);
    } finally { setIsSaving(false); }
  };

  if (step === 'training_player' && activeTraining) {
     return (
       <div className="h-screen flex flex-col">
         <div className="bg-slate-900 px-8 py-4 flex items-center justify-between no-print">
            <SmartBackButton onClick={handleBack} label="EĞİTİMİ KAPAT" className="bg-white/10 hover:bg-orange-600" />
            <span className="text-orange-500 font-black text-xs uppercase tracking-widest">{activeTraining.plan_title}</span>
         </div>
         <PresentationStudio 
              assignmentId={activeTraining.id} 
              customPlan={activeTraining.plan_data} 
              onClose={handleBack} 
            />
       </div>
     );
  }

  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
          <div className="mb-10 text-center">
             <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6">YG</div>
             <h3 className="text-2xl font-black text-slate-900 uppercase">Akademik Portal</h3>
             <div className="flex justify-center gap-4 mt-6">
               <button onClick={() => setAuthMode('login')} className={`text-[10px] font-black uppercase ${authMode === 'login' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-300'}`}>GİRİŞ</button>
               <button onClick={() => setAuthMode('register')} className={`text-[10px] font-black uppercase ${authMode === 'register' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-300'}`}>KAYIT</button>
             </div>
          </div>
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-6">
             {authMode === 'register' && <input type="text" placeholder="Ad Soyad" className="w-full p-4 bg-slate-50 rounded-xl font-bold" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} />}
             <input type="email" placeholder="E-Posta" className="w-full p-4 bg-slate-50 rounded-xl font-bold" value={authMode === 'login' ? loginForm.email : registerForm.email} onChange={e => authMode === 'login' ? setLoginForm({...loginForm, email: e.target.value}) : setRegisterForm({...registerForm, email: e.target.value})} />
             <input type="password" placeholder="Şifre" className="w-full p-4 bg-slate-50 rounded-xl font-bold" value={authMode === 'login' ? loginForm.password : registerForm.password} onChange={e => authMode === 'login' ? setLoginForm({...loginForm, password: e.target.value}) : setRegisterForm({...registerForm, password: e.target.value})} />
             <button type="submit" disabled={isSaving} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase">{isSaving ? 'İŞLENİYOR...' : 'SİSTEME ERİŞ'}</button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'onboarding') return (
    <div className="max-w-4xl mx-auto mt-10 p-10 bg-white rounded-[3rem] shadow-2xl border border-slate-100">
       <h3 className="text-3xl font-black text-slate-900 uppercase mb-8">Profil Aktivasyonu</h3>
       <div className="grid grid-cols-2 gap-6 mb-8">
          <SearchableSelect label="Üniversite" options={TURKISH_UNIVERSITIES} value={profileData.university} onChange={v => setProfileData({...profileData, university: v})} />
          <SearchableSelect label="Bölüm" options={TURKISH_DEPARTMENTS} value={profileData.department} onChange={v => setProfileData({...profileData, department: v})} />
       </div>
       <button onClick={handleProfileSave} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase">PROFİLİ MÜHÜRLE VE BAŞLA</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-4 space-y-12 h-full">
       <div className="flex justify-start">
         <SmartBackButton onClick={handleBack} isVisible={stepHistory.length > 0} label="Geri Dön" />
       </div>

       {/* DASHBOARD HEADER */}
       <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-end">
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistem Erişimi: Aktif</span>
             </div>
             <h2 className="text-5xl font-black tracking-tighter uppercase">{staff?.name}</h2>
             <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-4">{staff?.branch}</p>
          </div>
          <div className="flex gap-3 relative z-10 mt-6 md:mt-0">
             <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)} 
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all"
             >PROFİLİ GÜNCELLE</button>
             <button onClick={() => setStep('auth')} className="px-8 py-4 bg-rose-600/20 text-rose-500 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all">GÜVENLİ ÇIKIŞ</button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px]"></div>
       </div>

       {/* PROFILE EDIT SUB-VIEW */}
       {isEditingProfile && (
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-orange-500 shadow-xl animate-slide-up space-y-6">
             <div className="flex justify-between items-center">
                <h4 className="text-xl font-black text-slate-900 uppercase">Hızlı Profil Güncelleme</h4>
                <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-900">Kapat</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Branş</label>
                   <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" value={profileData.branch} onChange={e => setProfileData({...profileData, branch: e.target.value as Branch})}>
                      {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Saha Deneyimi (Yıl)</label>
                   <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" value={profileData.experienceYears} onChange={e => setProfileData({...profileData, experienceYears: parseInt(e.target.value)})} />
                </div>
                <div className="flex items-end">
                   <button onClick={handleProfileSave} className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600">DEĞİŞİKLİKLERİ KAYDET</button>
                </div>
             </div>
          </div>
       )}

       {assignedTrainings.length > 0 && (
          <div className="space-y-6">
             <div className="flex justify-between items-end border-b-2 border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter border-l-4 border-orange-600 pl-4">Atanan Eğitimler</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{assignedTrainings.length} AKTİF GÖREV</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedTrainings.map(t => (
                   <button 
                     key={t.id} 
                     onClick={() => { setActiveTraining(t); navigateToStep('training_player'); }}
                     className="bg-white p-8 rounded-[2.5rem] border border-slate-200 text-left hover:border-orange-500 hover:shadow-xl transition-all flex flex-col justify-between h-full group"
                   >
                      <div>
                         <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase mb-4 inline-block ${t.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>{t.status === 'completed' ? 'TAMAMLANDI' : 'DEVAM EDİYOR'}</span>
                         <h4 className="text-lg font-black text-slate-900 uppercase leading-tight mb-2 group-hover:text-orange-600 transition-colors">{t.plan_title}</h4>
                      </div>
                      <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-end">
                         <div>
                            <p className="text-[8px] font-black text-slate-300 uppercase">İLERLEME</p>
                            <p className="text-xl font-black text-slate-900">%{t.progress}</p>
                         </div>
                         <span className="text-[10px] font-black text-orange-600 opacity-0 group-hover:opacity-100 transition-all">BAŞLAT →</span>
                      </div>
                   </button>
                ))}
             </div>
          </div>
       )}

       <div className="space-y-6">
          <div className="flex justify-between items-end border-b-2 border-slate-100 pb-4">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter border-l-4 border-slate-900 pl-4">Yetkinlik Bataryaları</h3>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{MODULAR_BATTERIES.length} ÖLÇEK</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {MODULAR_BATTERIES.map(module => {
               const isCompleted = completedBatteries.includes(module.id);
               return (
                 <button key={module.id} onClick={() => { if(!isCompleted) { setActiveModule(module); setShuffledQuestions(shuffleQuestions(module.questions)); navigateToStep('exam'); } }} className={`p-8 rounded-[3rem] border-2 text-left transition-all group ${isCompleted ? 'bg-slate-50 opacity-50 cursor-default border-slate-100' : 'bg-white hover:border-orange-500 hover:shadow-xl hover:-translate-y-1'}`}>
                    <span className="text-4xl block mb-6 grayscale group-hover:grayscale-0 transition-all">{module.icon}</span>
                    <h4 className="text-xl font-black text-slate-900 uppercase mb-2 leading-none">{module.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">{module.description}</p>
                    {isCompleted && (
                       <div className="mt-6 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg></div>
                          <span className="text-[9px] font-black text-emerald-600 uppercase">Tamamlandı</span>
                       </div>
                    )}
                 </button>
               );
             })}
          </div>
       </div>

       {step === 'exam' && activeModule && (
          <div className="fixed inset-0 z-[2000] bg-white overflow-hidden flex flex-col">
             {/* Exam Nav */}
             <div className="bg-slate-950 px-10 py-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-6">
                   <SmartBackButton onClick={handleBack} label="SINAVDAN ÇIK" className="bg-white/10 hover:bg-rose-600" />
                   <div>
                      <h3 className="text-white font-black text-xl uppercase tracking-widest">{activeModule.title}</h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em]">Akademik Yetkinlik Bataryası</p>
                   </div>
                </div>
                <div className="flex gap-6 items-center">
                   <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">İlerleme</p>
                      <p className="text-xl font-black text-orange-500">%{Math.round((Object.keys(answers).length / shuffledQuestions.length) * 100)}</p>
                   </div>
                   <button onClick={handleSubmitExam} disabled={Object.keys(answers).length < shuffledQuestions.length} className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all disabled:opacity-20 shadow-xl">SINAVI BİTİR VE MÜHÜRLE</button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-slate-50">
                <div className="max-w-3xl mx-auto space-y-12">
                   {shuffledQuestions.map((q, idx) => (
                      <div key={q.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                         <div className="flex gap-6 items-start">
                            <span className="w-10 h-10 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black shrink-0">{idx + 1}</span>
                            <p className="text-xl font-black text-slate-800 leading-tight uppercase">{q.text}</p>
                         </div>
                         <div className="grid grid-cols-1 gap-3 pl-16">
                            {q.options.map((opt, oIdx) => (
                               <button 
                                 key={oIdx} 
                                 onClick={() => setAnswers({...answers, [q.id]: opt.clinicalValue})} 
                                 className={`w-full p-6 rounded-2xl border-2 text-left font-black text-sm uppercase transition-all flex items-center gap-4 ${answers[q.id] === opt.clinicalValue ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' : 'bg-slate-50 border-transparent text-slate-500 hover:border-orange-200'}`}
                               >
                                  <div className={`w-4 h-4 rounded-full border-2 ${answers[q.id] === opt.clinicalValue ? 'bg-orange-500 border-orange-500' : 'bg-white border-slate-300'}`}></div>
                                  {opt.label}
                               </button>
                            ))}
                         </div>
                      </div>
                   ))}
                   <div className="py-20 text-center">
                      <button onClick={handleSubmitExam} disabled={Object.keys(answers).length < shuffledQuestions.length} className="px-20 py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] shadow-2xl hover:bg-orange-600 transition-all disabled:opacity-20">SİSTEM ONAYINA GÖNDER</button>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default StaffAssessmentPortal;
