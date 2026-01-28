
import React, { useState, useMemo, useEffect } from 'react';
import { MODULAR_BATTERIES } from './assessmentData';
import { AssessmentBattery, Branch } from '../../types';
import { CERTIFICATIONS, TURKISH_UNIVERSITIES, TURKISH_DEPARTMENTS } from '../../constants';
import { SearchableSelect } from '../../shared/ui/SearchableSelect';

const StaffAssessmentPortal: React.FC = () => {
  const [step, setStep] = useState<'auth' | 'onboarding' | 'select' | 'test' | 'complete'>('auth');
  const [staff, setStaff] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  
  // Test State
  const [activeModule, setActiveModule] = useState<AssessmentBattery | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  // Profile State (Onboarding)
  const [profileData, setProfileData] = useState({
    name: '',
    branch: Branch.OzelEgitim,
    university: '',
    department: '',
    experienceYears: 0,
    allTrainings: [] as string[]
  });

  const progress = useMemo(() => {
    if (!activeModule) return 0;
    return ((currentQuestionIndex + 1) / activeModule.questions.length) * 100;
  }, [activeModule, currentQuestionIndex]);

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
        setProfileData({
          name: data.staff.name,
          branch: data.staff.branch,
          university: data.staff.university || '',
          department: data.staff.department || '',
          experienceYears: data.staff.experience_years || 0,
          allTrainings: data.staff.all_trainings || []
        });
        setStep(data.staff.onboarding_complete ? 'select' : 'onboarding');
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Sistem hatası.");
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
        setStep('select');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswer = (qid: string, value: number) => {
    setAnswers({ ...answers, [qid]: value });
    if (activeModule && currentQuestionIndex < activeModule.questions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300);
    }
  };

  const handleModuleComplete = async () => {
    setIsSaving(true);
    const answerValues: number[] = Object.values(answers);
    const sum: number = answerValues.reduce((a: number, b: number): number => a + b, 0);
    const divisor: number = activeModule?.questions.length || 1;
    const totalScore: number = sum / divisor;
    
    try {
      await fetch(`/api/staff?action=save_assessment`, {
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
      setStep('select');
      setActiveModule(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
      alert("Analiz verileriniz nöral sisteme mühürlendi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (step === 'auth') {
    return (
      <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[3.5rem] shadow-4xl border border-slate-100 animate-scale-in text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-600 to-slate-900"></div>
        <div className="w-28 h-28 bg-slate-950 rounded-[3rem] flex items-center justify-center text-orange-600 mx-auto mb-10 shadow-3xl">
          <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c0-1.121-.23-2.188-.63-3.158M12 11V3m0 8l7.105-2.132M12 11l-7.105-2.132M19.105 8.868A9.954 9.954 0 0112 3c-2.612 0-4.987 1.003-6.753 2.645M12 11L12 11z" /></svg>
        </div>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2 italic">ARMS LOGIN</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mb-12">Yönetim & Gelişim Paneli</p>
        <form onSubmit={handleLogin} className="space-y-5">
           <input 
             type="email" 
             placeholder="E-POSTA" 
             className="w-full p-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-center tracking-widest transition-all" 
             value={loginForm.email}
             onChange={e => setLoginForm({...loginForm, email: e.target.value})}
           />
           <input 
             type="password" 
             placeholder="ŞİFRE" 
             className="w-full p-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-center tracking-widest transition-all" 
             value={loginForm.password}
             onChange={e => setLoginForm({...loginForm, password: e.target.value})}
           />
           <button type="submit" disabled={isSaving} className="w-full py-6 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl active:scale-95">
             {isSaving ? 'BAĞLANILIYOR...' : 'SİSTEMİ AÇ'}
           </button>
        </form>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <div className="max-w-7xl mx-auto mt-10 space-y-16 animate-fade-in px-8 pb-32">
         <div className="flex flex-col md:flex-row justify-between items-end border-b-4 border-slate-950 pb-10 gap-8">
            <div>
               <div className="flex items-center gap-4 mb-4">
                  <span className="px-4 py-1.5 bg-orange-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">AKADEMİK PROTOKOL</span>
                  <div className="h-px w-20 bg-slate-200"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SÜRÜM V4.0</span>
               </div>
               <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] italic">Klinik Tahkim<br/>Merkezi</h2>
            </div>
            <div className="flex flex-col items-end gap-3">
               <div className="px-8 py-4 bg-slate-950 text-white rounded-2xl shadow-xl flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] font-black uppercase tracking-widest">{staff.name.toUpperCase()}</span>
               </div>
               <button onClick={() => setStep('auth')} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">OTURUMU KAPAT</button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MODULAR_BATTERIES.map(module => (
              <button 
                key={module.id} 
                onClick={() => { setActiveModule(module); setStep('test'); setStartTime(Date.now()); }}
                className="p-10 bg-white rounded-[4rem] border-4 border-slate-100 shadow-xl hover:shadow-4xl hover:border-orange-500 transition-all text-left group relative overflow-hidden flex flex-col h-full"
              >
                <div className="text-6xl mb-10 group-hover:scale-110 transition-transform duration-700">{module.icon}</div>
                <div className="flex-1">
                   <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4 italic">{module.title}</h4>
                   <p className="text-[12px] font-bold text-slate-400 uppercase leading-relaxed mb-10">{module.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-50">
                   <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest">10 DERİN SORU</span>
                   <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                   </div>
                </div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
              </button>
            ))}
         </div>
      </div>
    );
  }

  if (step === 'test' && activeModule) {
    const q = activeModule.questions[currentQuestionIndex];
    return (
      <div className="max-w-5xl mx-auto mt-10 animate-scale-in pb-32 px-8">
         <div className="bg-slate-950 p-12 md:p-16 rounded-t-[4.5rem] text-white relative overflow-hidden shadow-4xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></span>
                     <span className="text-[12px] font-black text-orange-500 uppercase tracking-[0.6em]">SINAV MODU AKTİF</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{activeModule.title}</h3>
               </div>
               <div className="flex gap-6">
                  <div className="text-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-xl min-w-[140px]">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">İlerleme</span>
                     <p className="text-3xl font-black text-white">%{Math.round(progress)}</p>
                  </div>
               </div>
            </div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]"></div>
         </div>

         <div className="bg-white p-12 md:p-24 rounded-b-[4.5rem] shadow-4xl border border-slate-100 relative">
            <div className="space-y-16">
               <div className="flex gap-10 items-start group">
                  <span className="w-16 h-16 rounded-[2rem] bg-slate-950 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-3xl group-hover:bg-orange-600 transition-colors">
                    {currentQuestionIndex + 1}
                  </span>
                  <h4 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight uppercase tracking-tight italic pt-1">
                    "{q.text}"
                  </h4>
               </div>

               <div className="grid grid-cols-1 gap-4 pl-0 md:pl-24">
                  {q.options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(q.id, opt.clinicalValue)}
                      className={`p-8 rounded-[2.5rem] border-2 text-left transition-all relative group/opt flex items-center gap-6 ${
                        answers[q.id] === opt.clinicalValue 
                        ? 'bg-slate-950 border-slate-950 text-white shadow-3xl translate-x-4 scale-[1.02]' 
                        : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:border-orange-500/40 hover:bg-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center shrink-0 transition-all ${
                        answers[q.id] === opt.clinicalValue ? 'bg-orange-600 border-orange-600' : 'border-slate-200 group-hover/opt:border-orange-300'
                      }`}>
                         {answers[q.id] === opt.clinicalValue && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                      </div>
                      <span className="text-[16px] font-bold uppercase tracking-tight leading-snug">{opt.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="mt-20 pt-12 border-t-2 border-slate-50 flex justify-between items-center">
               <button 
                 disabled={currentQuestionIndex === 0}
                 onClick={() => setCurrentQuestionIndex(i => i - 1)}
                 className="px-8 py-4 text-slate-300 text-[11px] font-black uppercase tracking-[0.4em] hover:text-slate-900 transition-all"
               >
                 ← GERİ
               </button>
               {currentQuestionIndex === activeModule.questions.length - 1 ? (
                 <button 
                   onClick={handleModuleComplete} 
                   disabled={isSaving}
                   className="px-16 py-7 bg-orange-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-4xl hover:bg-slate-950 transition-all active:scale-95 disabled:opacity-30"
                 >
                   {isSaving ? 'MÜHÜRLENİYOR...' : 'ANALİZİ BİTİR'}
                 </button>
               ) : (
                 <button 
                   onClick={() => setCurrentQuestionIndex(i => i + 1)}
                   className="px-12 py-6 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all"
                 >
                   SONRAKİ →
                 </button>
               )}
            </div>
         </div>
      </div>
    );
  }

  return null;
};

export default StaffAssessmentPortal;
