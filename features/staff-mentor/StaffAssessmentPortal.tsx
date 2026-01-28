
import React, { useState, useMemo, useEffect } from 'react';
import { MODULAR_BATTERIES } from './assessmentData';
import { AssessmentBattery, Branch, Gender, MaritalStatus } from '../../types';
import { CERTIFICATIONS, CERTIFICATION_CATEGORIES, TURKISH_UNIVERSITIES, TURKISH_DEPARTMENTS } from '../../constants';
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

  // AUTH HANDLER
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

  // PROFILE SAVE HANDLER
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

  // TEST HANDLER
  const handleAnswer = (qid: string, value: number) => {
    setAnswers({ ...answers, [qid]: value });
    if (activeModule && currentQuestionIndex < activeModule.questions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 400);
    }
  };

  const handleModuleComplete = async () => {
    setIsSaving(true);
    
    // Fix: Aritmetik işlem öncesi tipleri açıkça belirleyerek 'unknown' çıkarım hatasını gideriyoruz.
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
          aiTags: [] // Opsiyonel: cevaplardaki aiTag'ler buraya toplanabilir
        })
      });
      setStep('select');
      setActiveModule(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
      alert("Analiz verileriniz başarıyla bulut sistemine mühürlendi.");
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
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2 italic">ARMS STAFF</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mb-12">Akademik Personel Girişi</p>
        <form onSubmit={handleLogin} className="space-y-5">
           <input 
             type="email" 
             placeholder="KURUMSAL E-POSTA" 
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
             {isSaving ? 'DOĞRULANIYOR...' : 'SİSTEMİ AÇ'}
           </button>
        </form>
      </div>
    );
  }

  if (step === 'onboarding') {
    return (
      <div className="max-w-5xl mx-auto mt-10 p-16 bg-white rounded-[4rem] shadow-4xl border border-slate-100 animate-slide-up space-y-12">
        <div className="border-b border-slate-100 pb-8">
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Akademik Kimlik Tanımı</h2>
           <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.5em] mt-4">İlk girişinize özel profesyonel profilinizi mühürleyin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-6">
              <SearchableSelect label="Mezuniyet Üniversitesi" options={TURKISH_UNIVERSITIES} value={profileData.university} onChange={v => setProfileData({...profileData, university: v})} />
              <SearchableSelect label="Bölüm" options={TURKISH_DEPARTMENTS} value={profileData.department} onChange={v => setProfileData({...profileData, department: v})} />
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Saha Deneyimi (Yıl)</label>
                 <input type="number" className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-orange-500 outline-none" value={profileData.experienceYears} onChange={e => setProfileData({...profileData, experienceYears: parseInt(e.target.value)})} />
              </div>
           </div>

           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Akreditasyonlar</h4>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {CERTIFICATIONS.map(cert => {
                    const isSelected = profileData.allTrainings.includes(cert.label);
                    return (
                       <button 
                         key={cert.id} 
                         onClick={() => {
                            const next = isSelected ? profileData.allTrainings.filter(t => t !== cert.label) : [...profileData.allTrainings, cert.label];
                            setProfileData({...profileData, allTrainings: next});
                         }}
                         className={`p-4 rounded-xl text-left text-[11px] font-bold uppercase transition-all border-2 ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-orange-300'}`}
                       >
                          {cert.label}
                       </button>
                    );
                 })}
              </div>
           </div>
        </div>

        <button onClick={handleProfileSave} disabled={isSaving} className="w-full py-8 bg-orange-600 text-white rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.5em] shadow-2xl hover:bg-slate-950 transition-all active:scale-95">
           AKADEMİK PROFİLİ MÜHÜRLE VE DEVAM ET
        </button>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <div className="max-w-7xl mx-auto mt-10 space-y-16 animate-fade-in px-8 pb-32">
         <div className="flex justify-between items-end border-b-4 border-slate-950 pb-10">
            <div>
               <h2 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Klinik Tanı<br/>Laboratuvarı</h2>
               <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.8em] mt-8">Hocam, kendinizi sınamak istediğiniz modülü seçin.</p>
            </div>
            <div className="flex flex-col items-end gap-3">
               <div className="px-8 py-4 bg-slate-950 text-white rounded-2xl shadow-xl">
                  <span className="text-[11px] font-black uppercase tracking-widest">{staff.name.toUpperCase()}</span>
               </div>
               <button onClick={() => setStep('auth')} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">SİSTEMDEN ÇIK</button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {MODULAR_BATTERIES.map(module => (
              <button 
                key={module.id} 
                onClick={() => { setActiveModule(module); setStep('test'); }}
                className="p-12 bg-white rounded-[5rem] border-4 border-slate-100 shadow-xl hover:shadow-4xl hover:border-orange-500 transition-all text-left group relative overflow-hidden flex flex-col h-full"
              >
                <div className="text-7xl mb-12 group-hover:scale-110 transition-transform duration-700">{module.icon}</div>
                <div className="flex-1">
                   <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6 italic">{module.title}</h4>
                   <p className="text-[13px] font-bold text-slate-400 uppercase leading-relaxed mb-10">{module.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-50">
                   <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest">{module.questions.length} KRİTİK SORU</span>
                   <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                   </div>
                </div>
              </button>
            ))}
         </div>
      </div>
    );
  }

  if (step === 'test' && activeModule) {
    const q = activeModule.questions[currentQuestionIndex];
    return (
      <div className="max-w-6xl mx-auto mt-10 animate-slide-up pb-32 px-8">
         <div className="bg-slate-950 p-16 rounded-t-[5rem] text-white relative overflow-hidden shadow-4xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
               <div className="space-y-4">
                  <span className="text-[12px] font-black text-orange-500 uppercase tracking-[0.6em] block">Sınama Protokolü Aktif</span>
                  <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">{activeModule.title}</h3>
               </div>
               <div className="text-center bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl min-w-[220px]">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Modül İlerleme</span>
                  <div className="flex items-center justify-center gap-6">
                     <span className="text-5xl font-black text-white">%{Math.round(progress)}</span>
                     <div className="w-2 h-16 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-full bg-orange-600 transition-all duration-1000" style={{ height: `${progress}%` }}></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-16 md:p-24 rounded-b-[5rem] shadow-4xl border border-slate-100 space-y-20 relative">
            <div className="space-y-16">
               <div className="flex gap-12 items-start group">
                  <span className="w-20 h-20 rounded-[2.5rem] bg-slate-950 text-white flex items-center justify-center font-black text-3xl shrink-0 shadow-3xl group-hover:bg-orange-600 transition-colors">
                    {currentQuestionIndex + 1}
                  </span>
                  <h4 className="text-4xl md:text-5xl font-black text-slate-800 leading-[1] uppercase tracking-tighter italic pt-2">
                    "{q.text}"
                  </h4>
               </div>

               <div className="grid grid-cols-1 gap-6 pl-0 md:pl-32">
                  {q.options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(q.id, opt.clinicalValue)}
                      className={`p-10 rounded-[3rem] border-4 text-left transition-all relative group/opt flex items-center gap-8 ${
                        answers[q.id] === opt.clinicalValue 
                        ? 'bg-slate-950 border-slate-950 text-white shadow-4xl translate-x-6' 
                        : 'bg-slate-50/50 border-transparent text-slate-600 hover:border-orange-500/40 hover:bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0 transition-all ${
                        answers[q.id] === opt.clinicalValue ? 'bg-orange-600 border-orange-600 scale-125' : 'border-slate-200 group-hover/opt:border-orange-400'
                      }`}>
                         {answers[q.id] === opt.clinicalValue && <div className="w-3 h-3 bg-white rounded-full"></div>}
                      </div>
                      <span className="text-[18px] font-black uppercase tracking-tight leading-tight">{opt.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="pt-20 border-t-2 border-slate-50 flex justify-between items-center">
               <button 
                 disabled={currentQuestionIndex === 0}
                 onClick={() => setCurrentQuestionIndex(i => i - 1)}
                 className="px-12 py-6 text-slate-400 text-[13px] font-black uppercase tracking-[0.4em] hover:text-slate-900 transition-all"
               >
                 ← Geri Dön
               </button>
               {currentQuestionIndex === activeModule.questions.length - 1 ? (
                 <button 
                   onClick={handleModuleComplete} 
                   disabled={isSaving}
                   className="px-20 py-8 bg-orange-600 text-white rounded-[3rem] font-black uppercase tracking-[0.4em] shadow-4xl hover:bg-slate-950 transition-all active:scale-95 disabled:opacity-30"
                 >
                   {isSaving ? 'MÜHÜRLENİYOR...' : 'ANALİZİ KAYDET VE BİTİR'}
                 </button>
               ) : (
                 <button 
                   onClick={() => setCurrentQuestionIndex(i => i + 1)}
                   className="px-16 py-7 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all"
                 >
                   Sonraki Soru →
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
