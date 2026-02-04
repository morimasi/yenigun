
import React, { useState, useMemo, useEffect } from 'react';
import { MODULAR_BATTERIES } from './assessmentData';
import { AssessmentBattery, Branch, AssessmentQuestion } from '../../types';
import { TURKISH_UNIVERSITIES, TURKISH_DEPARTMENTS } from '../../constants';
import { SearchableSelect } from '../../shared/ui/SearchableSelect';

// Fisher-Yates Shuffle Implementation
const shuffleQuestions = (questions: AssessmentQuestion[]): AssessmentQuestion[] => {
  return questions.map(q => ({
    ...q,
    options: [...q.options].sort(() => Math.random() - 0.5)
  }));
};

const StaffAssessmentPortal: React.FC = () => {
  const [step, setStep] = useState<'auth' | 'onboarding' | 'dashboard' | 'exam'>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [staff, setStaff] = useState<any>(null);
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', email: '', password: '', branch: Branch.OzelEgitim, phone: '' 
  });

  const [completedBatteries, setCompletedBatteries] = useState<string[]>([]);
  
  // Test State
  const [activeModule, setActiveModule] = useState<AssessmentBattery | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<AssessmentQuestion[]>([]);

  // Profile State (Onboarding & Editing)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    branch: Branch.OzelEgitim,
    university: '',
    department: '',
    experienceYears: 0,
    allTrainings: [] as string[]
  });

  useEffect(() => {
    if (activeModule) {
      setShuffledQuestions(shuffleQuestions(activeModule.questions));
      window.scrollTo(0, 0);
    }
  }, [activeModule]);

  const isExamComplete = useMemo(() => {
    if (!activeModule) return false;
    return activeModule.questions.every(q => answers[q.id] !== undefined);
  }, [activeModule, answers]);

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
          experienceYears: data.staff.experience_years || 0,
          allTrainings: data.staff.all_trainings || []
        });
        
        setStep(data.staff.onboarding_complete ? 'dashboard' : 'onboarding');
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Sunucu bağlantı hatası.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/staff?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (data.success) {
        alert("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
        setAuthMode('login');
        setLoginForm({ email: registerForm.email, password: '' });
      } else {
        alert(data.message || "Kayıt başarısız.");
      }
    } catch (e) {
      alert("Sunucu hatası.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/staff?action=update_profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profileData, id: staff.id })
      });
      if (res.ok) {
        // Update local staff state with new info
        setStaff(prev => ({ ...prev, ...profileData }));
        
        if (step === 'onboarding') {
            setStep('dashboard');
        } else {
            setIsEditingProfile(false);
            alert("Profil başarıyla güncellendi.");
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswer = (qid: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleSubmitExam = async () => {
    if (!isExamComplete) { alert("Lütfen tüm soruları yanıtlayınız."); return; }
    if (!confirm("DİKKAT: Bu işlem sonrası cevaplarınız 'Klinik Veri' olarak mühürlenecek ve değiştirilemeyecektir. Onaylıyor musunuz?")) return;

    setIsSaving(true);
    const answerValues: number[] = Object.values(answers);
    const sum: number = answerValues.reduce((a: number, b: number): number => a + b, 0);
    const divisor: number = activeModule?.questions.length || 1;
    const totalScore: number = sum / divisor;
    
    try {
      const res = await fetch(`/api/staff?action=save_assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: staff.id,
          batteryId: activeModule!.id,
          answers: answers,
          score: Math.round(totalScore),
          aiTags: [] 
        })
      });

      const result = await res.json();
      
      if (result.success) {
        setCompletedBatteries(prev => [...prev, activeModule!.id]);
        setStep('dashboard');
        setActiveModule(null);
        setAnswers({});
        alert(`Analiz mühürlendi. Liyakat Skoru: %${Math.round(totalScore)}`);
      } else {
        alert(result.message || "Hata oluştu.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 1. AUTH SCREEN
  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
          
          <div className="mb-10 text-center">
             <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
               <span className="font-black text-2xl">YG</span>
             </div>
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Akademik Personel<br/>{authMode === 'login' ? 'Giriş Kapısı' : 'Kayıt Ünitesi'}</h3>
             
             <div className="flex justify-center gap-4 mt-6">
               <button 
                 onClick={() => setAuthMode('login')} 
                 className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${authMode === 'login' ? 'text-orange-600 border-orange-600' : 'text-slate-300 border-transparent'}`}
               >
                 GİRİŞ YAP
               </button>
               <button 
                 onClick={() => setAuthMode('register')} 
                 className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${authMode === 'register' ? 'text-orange-600 border-orange-600' : 'text-slate-300 border-transparent'}`}
               >
                 KAYIT OL
               </button>
             </div>
          </div>
          
          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">KURUMSAL E-POSTA</label>
                 <input 
                   type="email" 
                   className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all text-slate-900" 
                   value={loginForm.email}
                   onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">ŞİFRE</label>
                 <input 
                   type="password" 
                   className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all text-slate-900" 
                   value={loginForm.password}
                   onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                 />
               </div>
               <button type="submit" disabled={isSaving} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                 {isSaving ? 'DOĞRULANIYOR...' : 'SİSTEME ERİŞ'}
               </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">AD SOYAD</label>
                 <input type="text" className="w-full p-4 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">BRANŞ</label>
                 <select className="w-full p-4 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all" value={registerForm.branch} onChange={e => setRegisterForm({...registerForm, branch: e.target.value as Branch})}>
                    {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">E-POSTA</label>
                 <input type="email" className="w-full p-4 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-2">ŞİFRE BELİRLE</label>
                 <input type="password" className="w-full p-4 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-orange-600 outline-none transition-all" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} />
               </div>
               <button type="submit" disabled={isSaving} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl active:scale-95">
                 {isSaving ? 'KAYDEDİLİYOR...' : 'KAYDI OLUŞTUR'}
               </button>
            </form>
          )}
          <p className="text-[9px] font-bold text-slate-300 text-center mt-8 uppercase tracking-widest">Tekil Kimlik Protokolü v5.4</p>
        </div>
      </div>
    );
  }

  // 2. ONBOARDING & EDIT PROFILE FORM (REUSABLE)
  const ProfileForm = ({ isModal = false }) => (
    <div className={isModal ? "" : "max-w-4xl mx-auto mt-10 p-10 bg-white rounded-[3rem] shadow-2xl border border-slate-100"}>
       <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 border-b border-slate-100 pb-6">
          {isModal ? 'Profilini Güncelle' : 'Profil Aktivasyonu'}
       </h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase ml-2">İsim Soyisim</label>
             <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Branş</label>
             <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={profileData.branch} onChange={e => setProfileData({...profileData, branch: e.target.value as Branch})}>
                {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Deneyim (Yıl)</label>
             <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-200" value={profileData.experienceYears} onChange={e => setProfileData({...profileData, experienceYears: parseInt(e.target.value)})} />
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <SearchableSelect label="Üniversite" options={TURKISH_UNIVERSITIES} value={profileData.university} onChange={v => setProfileData({...profileData, university: v})} />
          <SearchableSelect label="Bölüm" options={TURKISH_DEPARTMENTS} value={profileData.department} onChange={v => setProfileData({...profileData, department: v})} />
       </div>
       <div className="flex gap-4">
          {isModal && (
              <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest">İPTAL</button>
          )}
          <button onClick={handleProfileSave} disabled={isSaving} className="flex-1 py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all">
              {isSaving ? 'KAYDEDİLİYOR...' : (isModal ? 'GÜNCELLE' : 'PROFİLİ MÜHÜRLE VE BAŞLA')}
          </button>
       </div>
    </div>
  );

  if (step === 'onboarding') return <ProfileForm />;

  // 3. DASHBOARD
  if (step === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
         {/* EDIT PROFILE MODAL */}
         {isEditingProfile && (
            <div className="fixed inset-0 z-[2000] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="w-full max-w-2xl bg-white rounded-[3rem] p-10 animate-scale-in">
                    <ProfileForm isModal={true} />
                </div>
            </div>
         )}

         {/* HEADER */}
         <div className="flex flex-col md:flex-row justify-between items-end bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-4">
                  <span className="px-4 py-1.5 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">PERSONEL ID: {staff.id.substring(0,8)}</span>
                  <span className="px-4 py-1.5 bg-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest">AKTİF</span>
               </div>
               <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">{staff.name}</h2>
               <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-4">{staff.branch} • {staff.experience_years} YIL DENEYİM</p>
            </div>
            <div className="relative z-10 flex gap-4">
                <button onClick={() => setIsEditingProfile(true)} className="px-8 py-4 bg-white/10 hover:bg-white hover:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                   PROFİLİ DÜZENLE
                </button>
                <button onClick={() => setStep('auth')} className="px-8 py-4 bg-white/5 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
                   GÜVENLİ ÇIKIŞ
                </button>
            </div>
            <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px]"></div>
         </div>

         {/* MODULES GRID */}
         <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
               <div className="w-2 h-8 bg-slate-900 rounded-full"></div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Zorunlu Yetkinlik Bataryaları</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {MODULAR_BATTERIES.map(module => {
                 const isCompleted = completedBatteries.includes(module.id);
                 return (
                   <button 
                     key={module.id} 
                     onClick={() => { if (!isCompleted) { setActiveModule(module); setStep('exam'); } }}
                     disabled={isCompleted}
                     className={`text-left p-10 rounded-[3rem] border-2 relative overflow-hidden transition-all group flex flex-col h-full ${
                       isCompleted 
                       ? 'bg-slate-50 border-slate-100 opacity-80 cursor-default' 
                       : 'bg-white border-slate-100 hover:border-orange-500 hover:shadow-2xl cursor-pointer'
                     }`}
                   >
                     <div className="flex justify-between items-start mb-10 relative z-10">
                        <span className="text-5xl">{module.icon}</span>
                        {isCompleted ? (
                           <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest">TAMAMLANDI</span>
                        ) : (
                           <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-orange-600 transition-colors">BAŞLA</span>
                        )}
                     </div>
                     <div className="relative z-10 mt-auto">
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">{module.title}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">{module.description}</p>
                     </div>
                     {isCompleted && (
                        <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[1px] flex items-center justify-center z-20">
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                           </div>
                        </div>
                     )}
                   </button>
                 );
               })}
            </div>
         </div>
      </div>
    );
  }

  // 4. EXAM MODE
  if (step === 'exam' && activeModule && shuffledQuestions.length > 0) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-50 overflow-y-auto custom-scrollbar">
         {/* STICKY EXAM HEADER */}
         <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-8 py-6 flex justify-between items-center">
            <div>
               <div className="flex items-center gap-3 mb-1">
                  <span className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">SINAV MODU AKTİF</span>
               </div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{activeModule.title}</h3>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">İLERLEME DURUMU</p>
               <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-slate-900 transition-all duration-500 ease-out" 
                    style={{ width: `${(Object.keys(answers).length / activeModule.questions.length) * 100}%` }}
                  ></div>
               </div>
            </div>
         </div>

         {/* QUESTION LIST */}
         <div className="max-w-4xl mx-auto py-16 px-6 space-y-20">
            {shuffledQuestions.map((q, idx) => (
               <div key={q.id} className="scroll-mt-32 group" id={`q-${q.id}`}>
                  <div className="flex items-start gap-6 mb-8">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 transition-all ${answers[q.id] !== undefined ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                        {idx + 1}
                     </div>
                     <h4 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight pt-1">
                        {q.text}
                     </h4>
                  </div>
                  <div className="pl-0 md:pl-18 grid grid-cols-1 gap-4">
                     {q.options.map((opt, optIdx) => {
                        const isSelected = answers[q.id] === opt.clinicalValue;
                        return (
                           <button 
                             key={optIdx}
                             onClick={() => handleAnswer(q.id, opt.clinicalValue)}
                             className={`text-left p-6 rounded-[2rem] border-2 transition-all relative flex items-center gap-6 group/opt ${
                               isSelected 
                               ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.01]' 
                               : 'bg-white border-slate-100 text-slate-600 hover:border-orange-400 hover:bg-orange-50/10'
                             }`}
                           >
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-slate-200 group-hover/opt:border-orange-400'}`}>
                                 {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                              </div>
                              <span className="text-[15px] font-bold uppercase tracking-tight leading-snug">{opt.label}</span>
                           </button>
                        );
                     })}
                  </div>
               </div>
            ))}
         </div>

         {/* FOOTER ACTION */}
         <div className="sticky bottom-0 z-50 p-8 bg-white border-t border-slate-200 flex justify-between items-center">
            <button 
              onClick={() => { if(confirm("Sınavdan çıkmak istiyor musunuz? İlerleme kaydedilmeyecek.")) { setStep('dashboard'); setActiveModule(null); setAnswers({}); } }}
              className="px-8 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-rose-500 transition-colors"
            >
               İPTAL ET VE ÇIK
            </button>
            <button 
               onClick={handleSubmitExam}
               disabled={!isExamComplete || isSaving}
               className={`px-16 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl transition-all ${
                  isExamComplete 
                  ? 'bg-orange-600 text-white hover:bg-slate-900 active:scale-95' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
               }`}
            >
               {isSaving ? 'MÜHÜRLENİYOR...' : (isExamComplete ? 'SINAVI BİTİR VE MÜHÜRLE' : 'TÜM SORULARI YANITLAYIN')}
            </button>
         </div>
      </div>
    );
  }

  return null;
};

export default StaffAssessmentPortal;
