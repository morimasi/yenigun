import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MODULAR_BATTERIES } from './assessmentData';
import { AssessmentBattery, Branch, AssessmentQuestion, StaffMember } from '../../types';
import { TURKISH_UNIVERSITIES, TURKISH_DEPARTMENTS } from '../../constants';
import { SearchableSelect } from '../../shared/ui/SearchableSelect';
import PresentationStudio from '../training/PresentationStudio';

const shuffleQuestions = (questions: AssessmentQuestion[]): AssessmentQuestion[] => {
  return questions.map(q => ({
    ...q,
    options: [...q.options].sort(() => Math.random() - 0.5)
  }));
};

const StaffAssessmentPortal: React.FC = () => {
  const [step, setStep] = useState<'auth' | 'onboarding' | 'dashboard' | 'exam' | 'training_player'>('auth');
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
        setStep(data.staff.onboarding_complete ? 'dashboard' : 'onboarding');
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
        setStep('dashboard');
        setIsEditingProfile(false);
      }
    } finally { setIsSaving(false); }
  };

  const handleSubmitExam = async () => {
    // @fix: Cast Object.values(answers) to number[] to ensure type safety during summation and avoid arithmetic errors on unknown types.
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
      setStep('dashboard');
    } finally { setIsSaving(false); }
  };

  if (step === 'training_player' && activeTraining) {
     return <PresentationStudio 
              assignmentId={activeTraining.id} 
              customPlan={activeTraining.plan_data} 
              onClose={() => { setStep('dashboard'); setActiveTraining(null); }} 
            />;
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
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
       <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-end">
          <div className="relative z-10">
             <h2 className="text-5xl font-black tracking-tighter uppercase">{staff?.name}</h2>
             <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-4">{staff?.branch}</p>
          </div>
          <button onClick={() => setStep('auth')} className="relative z-10 px-8 py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase">GÜVENLİ ÇIKIŞ</button>
       </div>

       {assignedTrainings.length > 0 && (
          <div className="space-y-6">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter border-l-4 border-orange-600 pl-4">Atanan Eğitimler</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedTrainings.map(t => (
                   <button 
                     key={t.id} 
                     onClick={() => { setActiveTraining(t); setStep('training_player'); }}
                     className="bg-white p-8 rounded-[2.5rem] border border-slate-200 text-left hover:border-orange-500 hover:shadow-xl transition-all flex flex-col justify-between h-full"
                   >
                      <div>
                         <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase mb-4 inline-block ${t.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>{t.status === 'completed' ? 'TAMAMLANDI' : 'DEVAM EDİYOR'}</span>
                         <h4 className="text-lg font-black text-slate-900 uppercase leading-tight mb-2">{t.plan_title}</h4>
                      </div>
                      <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-end">
                         <div>
                            <p className="text-[8px] font-black text-slate-300 uppercase">İLERLEME</p>
                            <p className="text-xl font-black text-slate-900">%{t.progress}</p>
                         </div>
                         <span className="text-[10px] font-black text-orange-600">BAŞLAT →</span>
                      </div>
                   </button>
                ))}
             </div>
          </div>
       )}

       <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter border-l-4 border-slate-900 pl-4">Yetkinlik Bataryaları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {MODULAR_BATTERIES.map(module => {
               const isCompleted = completedBatteries.includes(module.id);
               return (
                 <button key={module.id} onClick={() => { if(!isCompleted) { setActiveModule(module); setShuffledQuestions(shuffleQuestions(module.questions)); setStep('exam'); } }} className={`p-8 rounded-[3rem] border-2 text-left transition-all ${isCompleted ? 'bg-slate-50 opacity-50' : 'bg-white hover:border-orange-500'}`}>
                    <span className="text-4xl block mb-6">{module.icon}</span>
                    <h4 className="text-xl font-black text-slate-900 uppercase mb-2 leading-none">{module.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">{module.description}</p>
                 </button>
               );
             })}
          </div>
       </div>

       {step === 'exam' && activeModule && (
          <div className="fixed inset-0 z-[200] bg-white overflow-y-auto p-12">
             <div className="max-w-3xl mx-auto space-y-16">
                <h3 className="text-3xl font-black text-slate-900 uppercase text-center">{activeModule.title}</h3>
                {shuffledQuestions.map((q, idx) => (
                   <div key={q.id} className="space-y-6">
                      <p className="text-xl font-black text-slate-800">{idx + 1}. {q.text}</p>
                      <div className="space-y-3">
                         {q.options.map((opt, oIdx) => (
                            <button key={oIdx} onClick={() => setAnswers({...answers, [q.id]: opt.clinicalValue})} className={`w-full p-6 rounded-2xl border-2 text-left font-bold ${answers[q.id] === opt.clinicalValue ? 'bg-slate-900 text-white' : 'bg-slate-50'}`}>{opt.label}</button>
                         ))}
                      </div>
                   </div>
                ))}
                <button onClick={handleSubmitExam} className="w-full py-8 bg-orange-600 text-white rounded-[2rem] font-black uppercase">SINAVI MÜHÜRLE</button>
             </div>
          </div>
       )}
    </div>
  );
};

export default StaffAssessmentPortal;