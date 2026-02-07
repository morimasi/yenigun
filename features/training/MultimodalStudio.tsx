
import React, { useState, useEffect } from 'react';
import { 
  CustomTrainingPlan, 
  TrainingGenerationConfig, 
  TrainingSlide, 
  TrainingQuiz, 
  TargetAudience, 
  TrainingTheme,
  PedagogicalSchool,
  CognitiveLoad
} from '../../types';
import { armsService } from '../../services/ai/armsService';
import PresentationStudio from './PresentationStudio';

const MultimodalStudio: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);

  const PHASES = [
    "Kurumsal Vizyon Senkronize Ediliyor...",
    "Akademik Literatür Taraması Yapılıyor...",
    "Klinik Vaka Senaryoları Kurgulanıyor...",
    "Bilişsel Yük Analizi Tamamlanıyor...",
    "Multimodal Elementler Mühürleniyor...",
    "Yayın Formatı Optimize Ediliyor..."
  ];

  useEffect(() => {
    let interval: any;
    if (isAiProcessing) {
      interval = setInterval(() => {
        setCurrentPhase(prev => (prev + 1) % PHASES.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAiProcessing]);

  const [plan, setPlan] = useState<CustomTrainingPlan>({
    id: `CUR-${Date.now()}`,
    title: '',
    category: 'CLINICAL',
    level: 'Intermediate',
    description: '',
    targetBranches: 'ALL',
    curriculum: [],
    createdBy: 'Sistem Yöneticisi',
    createdAt: Date.now(),
    status: 'active'
  });

  const [config, setConfig] = useState<TrainingGenerationConfig>({
    pedagogicalBias: PedagogicalSchool.ABA,
    cognitiveLoad: CognitiveLoad.Pro,
    audience: 'KIDEMLI_UZMANLAR',
    theme: 'GOLDEN_ACADEMY',
    slideCount: 10,
    includeVisuals: true,
    hasEvaluation: true,
    tone: 'academic',
    temperature: 0.7,
    thinkingBudget: 15000,
    academicConfig: {
      institutionName: 'Yeni Gün Özel Eğitim Akademi',
      headerAntet: true,
      signatureTitles: ['Klinik Direktör', 'Eğitmen'],
      footerNote: 'Bu belge dijital mühür ile korunmaktadır.',
      showWatermark: true,
      officialSeal: true
    }
  });

  const handleFinalSeal = async (slides: TrainingSlide[], quiz?: TrainingQuiz) => {
    setStatusMsg('Kurumsal Arşive Mühürleniyor...');
    const finalPayload: CustomTrainingPlan = {
      ...plan,
      slides: Array.isArray(slides) ? slides : [],
      finalQuiz: quiz,
      aiConfig: config,
      status: 'published',
      updatedAt: Date.now()
    };

    try {
      await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });
      setPlan(finalPayload);
      setActiveStep(4);
    } catch (e) {
      setPlan(finalPayload);
      setActiveStep(4);
    }
  };

  const handleLaunchProduction = async () => {
    if (!plan.title || !plan.description) {
        setActiveStep(1);
        return alert("HATA: Eğitim başlığı ve klinik kapsam eksik.");
    }
    
    setIsAiProcessing(true);
    setCurrentPhase(0);
    
    try {
      const result = await armsService.generateUniversalCurriculum(plan, config);
      if (result && result.slides) {
        await handleFinalSeal(result.slides, result.quiz);
      } else {
          throw new Error("Invalid AI Result");
      }
    } catch (e) {
      console.error(e);
      alert("Nöral Sentez Hatası: AI motoru yanıt vermedi veya zaman aşımına uğradı. Lütfen daha kısa bir başlık ve kapsam ile tekrar deneyiniz.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const STEPS = [
    { id: 'strategy', label: '1. EKOL & STRATEJİ', icon: '🎯' },
    { id: 'content', label: '2. KLİNİK İÇERİK', icon: '📝' },
    { id: 'design', label: '3. TEMA & GÖRSEL', icon: '🎨' },
    { id: 'official', label: '4. RESMİ MÜHÜR', icon: '🏛️' }
  ];

  const enumValues = (obj: any): any[] => {
    if (!obj) return [];
    return Object.keys(obj).filter(key => isNaN(Number(key))).map(key => obj[key]);
  };

  if (activeStep === 4 && plan.slides) {
    return <PresentationStudio customPlan={plan} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[3000] bg-[#0A0F1C] flex flex-col animate-fade-in overflow-hidden text-slate-300">
      {/* HEADER */}
      <div className="h-20 bg-slate-900/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-8">
          <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-rose-600 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" /></svg>
          </button>
          <div className="h-10 w-px bg-white/10"></div>
          <h2 className="text-white font-black text-xl uppercase tracking-[0.3em]">MIA Studio <span className="text-orange-500">v6.0</span></h2>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] border border-white/10 shadow-inner">
           {STEPS.map((s, idx) => (
             <button 
               key={s.id} 
               onClick={() => !isAiProcessing && setActiveStep(idx)}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeStep === idx ? 'bg-orange-600 text-white shadow-2xl' : 'hover:text-white hover:bg-white/5'}`}
             >
               <span className="text-lg">{s.icon}</span>
               <span className="hidden lg:inline">{s.label.split('. ')[1]}</span>
             </button>
           ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar bg-[radial-gradient(circle_at_top,_#1e293b,_#0a0f1c)] relative">
        <div className="w-full max-w-5xl space-y-12 animate-scale-in">
          
          {activeStep === 0 && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="bg-slate-900/60 p-10 rounded-[4rem] border border-white/5 shadow-3xl space-y-8">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter border-l-[10px] border-orange-600 pl-8">Metodolojik Tercih</h4>
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Öğretim Ekolü</label>
                            <select className="w-full bg-black/60 border border-white/10 p-5 rounded-[2rem] font-bold text-white outline-none" value={config.pedagogicalBias} onChange={e => setConfig({...config, pedagogicalBias: e.target.value as PedagogicalSchool})}>
                               {enumValues(PedagogicalSchool).map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Bilişsel Zorluk</label>
                            <div className="grid grid-cols-1 gap-2">
                               {enumValues(CognitiveLoad).map(l => (
                                  <button key={l} onClick={() => setConfig({...config, cognitiveLoad: l as CognitiveLoad})} className={`p-4 rounded-[1.5rem] text-[10px] font-black uppercase text-left border-2 transition-all ${config.cognitiveLoad === l ? 'bg-orange-600 border-orange-600 text-white' : 'border-white/5 bg-white/5 text-slate-500'}`}>
                                     {l}
                                  </button>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="bg-slate-900/60 p-10 rounded-[4rem] border border-white/5 shadow-3xl space-y-8">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter border-l-[10px] border-blue-600 pl-8">Hitap & Üslup</h4>
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Hedef Kitle</label>
                            <select className="w-full bg-black/60 border border-white/10 p-5 rounded-[2rem] font-bold text-white outline-none" value={config.audience} onChange={e => setConfig({...config, audience: e.target.value as TargetAudience})}>
                               <option value="YENI_EGITMENLER">Oryantasyon Modeli</option>
                               <option value="KIDEMLI_UZMANLAR">Ustalık / Klinik Derinlik</option>
                               <option value="VELILER">Veli Bilgilendirme</option>
                               <option value="AKADEMIK_KURUL">Yönetim Sunumu</option>
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                            {['academic', 'inspirational', 'warning', 'analytical'].map(o => (
                               <button key={o} onClick={() => setConfig({...config, tone: o as any})} className={`p-4 rounded-xl text-[9px] font-black uppercase border-2 ${config.tone === o ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/5 bg-white/5 text-slate-600'}`}>{o}</button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
                <div className="flex justify-end"><button onClick={() => setActiveStep(1)} className="px-12 py-4 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">İLERİ →</button></div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-8 animate-slide-up">
                <div className="bg-slate-900/60 p-16 rounded-[5rem] border border-white/5 space-y-12 shadow-3xl">
                   <h4 className="text-4xl font-black text-white uppercase tracking-tighter">İçerik Kapsamı</h4>
                   <div className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">EĞİTİMİN ADI</label>
                         <input type="text" className="w-full bg-black/60 border border-white/10 p-8 rounded-[2.5rem] text-3xl font-black text-white outline-none focus:border-orange-500" value={plan.title} onChange={e => setPlan({...plan, title: e.target.value})} placeholder="Örn: Otizmde Duyusal Regülasyon" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">KLİNİK DETAY VE ÖZET</label>
                         <textarea className="w-full bg-black/60 border border-white/10 p-10 rounded-[3.5rem] text-xl font-medium text-slate-400 outline-none focus:border-orange-500 min-h-[200px] leading-relaxed" value={plan.description} onChange={e => setPlan({...plan, description: e.target.value})} placeholder="AI bu özet üzerinden akademik derinlik oluşturacaktır..." />
                      </div>
                   </div>
                </div>
                <div className="flex justify-between">
                   <button onClick={() => setActiveStep(0)} className="px-10 py-4 bg-white/5 text-slate-400 rounded-xl font-black text-[10px] uppercase">GERİ</button>
                   <button onClick={() => setActiveStep(2)} className="px-12 py-4 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em]">İLERİ →</button>
                </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-8 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="bg-slate-900/60 p-12 rounded-[4rem] border border-white/5 space-y-10">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter border-l-8 border-orange-600 pl-6">Yapılandırma</h4>
                      <div className="space-y-6">
                         <div className="space-y-4">
                            <div className="flex justify-between"><label className="text-[10px] font-black text-slate-500 uppercase">Slayt Sayısı</label><span className="text-xl font-black text-orange-500">{config.slideCount}</span></div>
                            <input type="range" min="5" max="30" className="w-full h-1 bg-slate-800 rounded-full appearance-none accent-orange-600" value={config.slideCount} onChange={e => setConfig({...config, slideCount: parseInt(e.target.value)})} />
                         </div>
                         <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5 cursor-pointer" onClick={() => setConfig({...config, hasEvaluation: !config.hasEvaluation})}>
                            <span className="text-[11px] font-black uppercase">Eğitim Sonu Quiz</span>
                            <div className={`w-12 h-6 rounded-full relative transition-all ${config.hasEvaluation ? 'bg-emerald-500' : 'bg-slate-700'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.hasEvaluation ? 'right-1' : 'left-1'}`}></div></div>
                         </div>
                      </div>
                   </div>
                   <div className="bg-slate-900/60 p-12 rounded-[4rem] border border-white/5 space-y-10">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter border-l-8 border-emerald-500 pl-6">Görsel Tema</h4>
                      <div className="grid grid-cols-1 gap-2">
                         {['ACADEMIC_COLD', 'GOLDEN_ACADEMY', 'CREATIVE_WARM', 'MINIMAL_TECH', 'OFFICIAL_MEB'].map(t => (
                            <button key={t} onClick={() => setConfig({...config, theme: t as TrainingTheme})} className={`p-4 rounded-xl text-left text-[10px] font-black uppercase border-2 ${config.theme === t ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}>{t.replace('_', ' ')}</button>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="flex justify-between">
                   <button onClick={() => setActiveStep(1)} className="px-10 py-4 bg-white/5 text-slate-400 rounded-xl font-black text-[10px] uppercase">GERİ</button>
                   <button onClick={() => setActiveStep(3)} className="px-12 py-4 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em]">İLERİ →</button>
                </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-8 animate-slide-up">
                <div className="bg-slate-900/60 p-16 rounded-[5rem] border border-white/5 text-center space-y-12 shadow-3xl">
                   <div className="w-32 h-32 bg-orange-600 rounded-[3rem] mx-auto flex items-center justify-center text-white shadow-3xl"><svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
                   <div>
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Üretime Hazır</h4>
                      <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">Tüm parametreler mühürlendi. Üretimi başlattığınızda MIA AI motoru yaklaşık 60 saniye içinde akademik sunumu teslim edecektir.</p>
                   </div>
                </div>
                <div className="flex justify-between items-center">
                   <button onClick={() => setActiveStep(2)} className="px-10 py-4 bg-white/5 text-slate-400 rounded-xl font-black text-[10px] uppercase">GERİ</button>
                   <button onClick={handleLaunchProduction} className="px-20 py-6 bg-white text-slate-950 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-3xl hover:bg-orange-600 hover:text-white transition-all">SENTEZLE VE YAYINLA</button>
                </div>
            </div>
          )}

        </div>
      </div>

      {/* OVERLAY LOADING */}
      {isAiProcessing && (
        <div className="fixed inset-0 z-[5000] bg-[#0A0F1C]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center animate-fade-in">
           <div className="relative mb-16">
              <div className="w-64 h-64 border-[4px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-28 h-28 bg-slate-900 rounded-[3rem] shadow-[0_0_100px_rgba(234,88,12,0.6)] flex items-center justify-center border border-white/10">
                    <span className="text-orange-500 font-black text-3xl tracking-[0.2em] animate-pulse">MIA</span>
                 </div>
              </div>
           </div>
           <div className="space-y-6">
              <p className="text-orange-500 font-black text-2xl uppercase tracking-[0.4em] animate-bounce">{PHASES[currentPhase]}</p>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.5em]">Bu işlem yaklaşık 1 dakika sürebilir. Lütfen pencereyi kapatmayın.</p>
              
              {/* PROGRESS BAR */}
              <div className="w-96 h-1 bg-white/5 rounded-full overflow-hidden mx-auto mt-10">
                 <div className="h-full bg-orange-600 transition-all duration-[4000ms] ease-linear" style={{ width: `${((currentPhase + 1) / PHASES.length) * 100}%` }}></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MultimodalStudio;
