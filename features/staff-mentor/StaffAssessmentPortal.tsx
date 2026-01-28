
import React, { useState, useMemo } from 'react';
import { MODULAR_BATTERIES } from './assessmentData';
import { AssessmentBattery } from '../../types';

const StaffAssessmentPortal: React.FC = () => {
  const [step, setStep] = useState<'auth' | 'select' | 'test' | 'complete'>('auth');
  const [activeModule, setActiveModule] = useState<AssessmentBattery | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const progress = useMemo(() => {
    if (!activeModule) return 0;
    return ((currentQuestionIndex + 1) / activeModule.questions.length) * 100;
  }, [activeModule, currentQuestionIndex]);

  const handleAnswer = (qid: string, value: number) => {
    setAnswers({ ...answers, [qid]: value });
    if (activeModule && currentQuestionIndex < activeModule.questions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 400);
    }
  };

  const handleModuleComplete = () => {
    if (activeModule) {
      setCompletedModules([...completedModules, activeModule.id]);
    }
    setStep('select');
    setCurrentQuestionIndex(0);
    setActiveModule(null);
  };

  const handleFinalSubmit = () => {
    setStep('complete');
    // Veriler Faz 2 (AI Analysis) motoruna sevk edilecek.
  };

  if (step === 'auth') {
    return (
      <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[3.5rem] shadow-4xl border border-slate-100 animate-scale-in text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-600 to-slate-900"></div>
        <div className="w-28 h-28 bg-slate-950 rounded-[3rem] flex items-center justify-center text-orange-600 mx-auto mb-10 shadow-3xl relative">
          <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">ARMS 2.0</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.6em] mb-12 italic">Klinik Zeka & Sadakat Portalı</p>
        <div className="space-y-6">
           <input type="password" placeholder="KURUMSAL SICIL / ANAHTAR" className="w-full p-7 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none font-black text-center tracking-[0.5em] transition-all" />
           <button onClick={() => setStep('select')} className="w-full py-7 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-2xl active:scale-95">PORTALI AC</button>
        </div>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <div className="max-w-7xl mx-auto mt-10 space-y-16 animate-fade-in px-8">
         <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b-4 border-slate-950 pb-12">
            <div>
               <h2 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Akademik Laboratuvar</h2>
               <p className="text-[14px] font-bold text-slate-400 uppercase tracking-[0.8em] mt-8">Zayıf halkalarınızı saptayın, uzmanlığınızı mühürleyin.</p>
            </div>
            <div className="flex flex-col items-end gap-4">
               <div className="px-10 py-5 bg-orange-600 text-white rounded-[2rem] shadow-2xl">
                  <span className="text-[12px] font-black uppercase tracking-widest">TAMAMLANAN MODÜL: {completedModules.length} / {MODULAR_BATTERIES.length}</span>
               </div>
               {completedModules.length > 0 && (
                 <button onClick={handleFinalSubmit} className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] hover:text-orange-600 underline underline-offset-8">Analizi Sonlandır ve Raporla</button>
               )}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {MODULAR_BATTERIES.map(module => {
              const isCompleted = completedModules.includes(module.id);
              return (
                <button 
                  key={module.id} 
                  disabled={isCompleted}
                  onClick={() => { setActiveModule(module); setStep('test'); setCurrentQuestionIndex(0); }}
                  className={`p-12 rounded-[5rem] border-4 transition-all text-left group relative overflow-hidden flex flex-col h-full ${
                    isCompleted 
                    ? 'bg-emerald-50 border-emerald-200 opacity-60 grayscale' 
                    : 'bg-white border-slate-100 shadow-xl hover:shadow-4xl hover:border-orange-500'
                  }`}
                >
                  <div className="text-7xl mb-12 group-hover:scale-110 transition-transform duration-700">{isCompleted ? '✅' : module.icon}</div>
                  <div className="flex-1">
                     <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6 italic">{module.title}</h4>
                     <p className="text-[13px] font-bold text-slate-400 uppercase leading-relaxed mb-10">{module.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-50">
                     <span className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em]">{module.questions.length} KRİTİK SORU</span>
                     {!isCompleted && (
                        <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </div>
                     )}
                  </div>
                  {isCompleted && <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px]"></div>}
                </button>
              );
            })}
         </div>
      </div>
    );
  }

  if (step === 'test' && activeModule) {
    const q = activeModule.questions[currentQuestionIndex];
    return (
      <div className="max-w-6xl mx-auto mt-10 animate-slide-up pb-32 px-8">
         <div className="bg-slate-950 p-16 rounded-t-[5rem] text-white relative overflow-hidden shadow-4xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
               <div className="space-y-4">
                  <span className="text-[12px] font-black text-orange-500 uppercase tracking-[0.6em] block">Sınama Protokolü Aktif</span>
                  <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">{activeModule.title}</h3>
               </div>
               <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl min-w-[200px] text-center">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Modül İlerleme</p>
                  <div className="flex items-center justify-center gap-6">
                     <span className="text-5xl font-black text-white">%{Math.round(progress)}</span>
                     <div className="w-2 h-16 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-full bg-orange-600 transition-all duration-1000" style={{ height: `${progress}%` }}></div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px]"></div>
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
                        : 'bg-slate-50/50 border-transparent text-slate-500 hover:border-orange-500/40 hover:bg-white hover:shadow-xl'
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
                   className="px-20 py-8 bg-orange-600 text-white rounded-[3rem] font-black uppercase tracking-[0.4em] shadow-4xl hover:bg-slate-950 transition-all active:scale-95"
                 >
                   MODÜLÜ MÜHÜRLE
                 </button>
               ) : (
                 <button 
                   onClick={() => setCurrentQuestionIndex(i => i + 1)}
                   className="px-16 py-7 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all"
                 >
                   Sonraki Soru →
                 </button>
               )}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 p-24 bg-white rounded-[6rem] text-center shadow-5xl animate-scale-in border border-emerald-100 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-4 bg-emerald-500 shadow-xl"></div>
       <div className="w-36 h-36 bg-emerald-500 rounded-[4rem] flex items-center justify-center text-white mx-auto mb-16 shadow-4xl">
          <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
       </div>
       <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase mb-8 leading-none italic">BÜTÜNCÜL ANALİZ TAMAM</h2>
       <p className="text-2xl font-bold text-slate-400 leading-relaxed italic uppercase tracking-tight mb-20 px-10">
         "Tüm klinik bataryalar Gemini-3 Nöral Mentor motoru tarafından çapraz sorgulanıyor. Gelişim yörüngeniz Akademik Kurul onayına sunuldu."
       </p>
       <button onClick={() => window.location.reload()} className="px-24 py-10 bg-slate-950 text-white rounded-[3rem] text-[14px] font-black uppercase tracking-[0.6em] hover:bg-orange-600 transition-all shadow-4xl active:scale-95">
         SİSTEMDEN ÇIK
       </button>
       <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default StaffAssessmentPortal;
