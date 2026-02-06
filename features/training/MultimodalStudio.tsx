
import React, { useState, useEffect } from 'react';
import { CustomTrainingPlan, TrainingModule, TrainingUnit, Branch, TrainingGenerationConfig, TrainingSlide, MultimodalElement } from '../../types';
import { armsService } from '../../services/ai/armsService';

interface MultimodalStudioProps {
  onClose: () => void;
  initialPlan?: CustomTrainingPlan | null;
}

const MultimodalStudio: React.FC<MultimodalStudioProps> = ({ onClose, initialPlan }) => {
  const [plan, setPlan] = useState<CustomTrainingPlan>(initialPlan || {
    id: `CUR-${Date.now()}`,
    title: '',
    category: 'CLINICAL',
    level: 'Intermediate',
    description: '',
    targetBranches: 'ALL',
    curriculum: [],
    createdBy: 'Sistem Yöneticisi',
    createdAt: Date.now()
  });

  const [config, setConfig] = useState<TrainingGenerationConfig>({
    pedagogicalBias: 'ABA',
    cognitiveLoad: 'PRO',
    tone: 'academic',
    temperature: 0.7,
    thinkingBudget: 24576,
    customSystemPrompt: ''
  });

  const [activeTab, setActiveTab] = useState<'config' | 'plan' | 'structure' | 'preview'>('config');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const handleLaunchDeepProduction = async () => {
    if (!plan.title || !plan.description) {
      alert("Müfredat kimliğini tanımlayın.");
      setActiveTab('plan');
      return;
    }
    if (plan.curriculum.length === 0) {
      alert("En az bir modül ekleyin.");
      setActiveTab('structure');
      return;
    }
    
    setIsAiProcessing(true);
    try {
      const result = await armsService.generateUniversalCurriculum(plan, config);
      setPlan(prev => ({ 
        ...prev, 
        slides: result.slides, 
        finalQuiz: result.quiz,
        aiConfig: config 
      }));
      setActiveTab('preview');
      setActiveSlideIdx(0);
    } catch (e: any) {
      alert(`Üretim Hatası: ${e.message}`);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSaveToLMS = async () => {
    if (!plan.slides) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, updatedAt: Date.now() })
      });
      if (res.ok) {
        alert("Müfredat Kütüphaneye Mühürlendi.");
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const addModule = () => {
    const newMod: TrainingModule = {
      id: `MOD-${Date.now()}`,
      title: 'Yeni Eğitim Modülü',
      focusArea: 'Klinik Yetkinlik',
      difficulty: 'intermediate',
      status: 'active',
      units: []
    };
    setPlan({ ...plan, curriculum: [...plan.curriculum, newMod] });
  };

  const ConfigPill = ({ label, field, options }: any) => (
    <div className="space-y-3">
      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">{label}</label>
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1.5 shadow-inner">
        {options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => setConfig({ ...config, [field]: opt })}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${config[field as keyof TrainingGenerationConfig] === opt ? 'bg-slate-950 text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-50 flex flex-col animate-fade-in overflow-hidden font-sans">
      
      {/* TOP COMMAND BAR */}
      <div className="h-20 bg-slate-950 flex items-center justify-between px-10 shrink-0 shadow-3xl relative z-50 border-b border-white/5">
         <div className="flex items-center gap-10">
            <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-orange-600 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
               <h2 className="text-white font-black text-lg uppercase tracking-[0.2em] leading-none">{plan.title || 'MULTIMODAL TASARIM STÜDYOSU'}</h2>
               <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-3">Gemini 3 Flash • Production Line v4.5</p>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
               {[
                 { id: 'config', l: 'STRATEJİ' },
                 { id: 'plan', l: 'İÇERİK' },
                 { id: 'structure', l: 'YAPI' },
                 { id: 'preview', l: 'SENTEZ' }
               ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-orange-600 text-white shadow-2xl' : 'text-slate-500 hover:text-white'}`}
                  >
                     {t.l}
                  </button>
               ))}
            </div>
            
            {activeTab === 'preview' ? (
              <button 
                onClick={handleSaveToLMS}
                disabled={isSaving || !plan.slides}
                className="px-12 py-4 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-30"
              >
                 KÜTÜPHANEYE MÜHÜRLE
              </button>
            ) : (
              <button 
                onClick={handleLaunchDeepProduction}
                disabled={isAiProcessing}
                className="px-12 py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 hover:text-white transition-all flex items-center gap-3 active:scale-95"
              >
                 {isAiProcessing ? 'SENTEZLENİYOR...' : 'NÖRAL MOTORU ATEŞLE'}
              </button>
            )}
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* MAIN WORKSPACE */}
         <div className="flex-1 bg-[#F1F5F9] overflow-y-auto custom-scrollbar flex flex-col items-center relative p-12">
            
            {activeTab === 'config' && (
               <div className="w-full max-w-4xl space-y-10 animate-scale-in">
                  <div className="bg-white p-16 rounded-[4rem] shadow-3xl border border-slate-200 relative overflow-hidden">
                     <div className="relative z-10">
                        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-l-[12px] border-orange-600 pl-10 leading-none">AI Sentez Konfigürasyonu</h3>
                        <div className="grid grid-cols-2 gap-12">
                           <div className="space-y-10">
                              <ConfigPill label="Pedagojik Ekol (Bias)" field="pedagogicalBias" options={['ABA', 'FLOORTIME', 'ECSE', 'NEURAL']} />
                              <ConfigPill label="Bilişsel Yük" field="cognitiveLoad" options={['JUNIOR', 'PRO', 'SUPERVISOR']} />
                           </div>
                           <div className="space-y-10">
                              <ConfigPill label="İletişim Dokusu" field="tone" options={['academic', 'inspirational', 'warning']} />
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Yaratıcılık Vektörü</label>
                                 <input type="range" min="0" max="1" step="0.1" value={config.temperature} onChange={e => setConfig({...config, temperature: parseFloat(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-orange-600" />
                                 <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest"><span>Teknik</span><span>Vizyoner</span></div>
                              </div>
                           </div>
                        </div>
                        <button onClick={() => setActiveTab('plan')} className="mt-16 w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:bg-orange-600 transition-all">İÇERİK PLANLAMAYA GEÇ →</button>
                     </div>
                     <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-500/5 rounded-full blur-[120px]"></div>
                  </div>
               </div>
            )}

            {activeTab === 'plan' && (
               <div className="w-full max-w-4xl space-y-10 animate-slide-up">
                  <div className="bg-white p-16 rounded-[4rem] shadow-3xl border border-slate-200">
                     <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-l-[12px] border-orange-600 pl-10 leading-none">Müfredat Vizyonu</h3>
                     <div className="space-y-10">
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-4">Eğitim Başlığı</label>
                           <input type="text" className="w-full p-8 bg-slate-50 rounded-[2.5rem] font-black text-3xl outline-none focus:border-orange-500 shadow-inner" placeholder="Örn: Otizmde İleri Sosyal Beceri Protokolü" value={plan.title} onChange={e => setPlan({...plan, title: e.target.value})} />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-4">Akademik Özet & Hedefler</label>
                           <textarea className="w-full p-10 bg-slate-50 rounded-[3.5rem] font-medium text-xl text-slate-600 min-h-[300px] outline-none shadow-inner leading-relaxed" placeholder="Bu eğitimin personelde hangi kognitif ve klinik dönüşümü yapmasını planlıyorsunuz?" value={plan.description} onChange={e => setPlan({...plan, description: e.target.value})} />
                        </div>
                        <button onClick={() => setActiveTab('structure')} className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:bg-orange-600 transition-all">YAPI TASARIMINA GEÇ →</button>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'structure' && (
               <div className="w-full max-w-4xl space-y-10 animate-slide-up">
                  <div className="bg-white p-16 rounded-[4rem] shadow-3xl border border-slate-200">
                     <div className="flex justify-between items-center mb-12">
                        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter border-l-[12px] border-orange-600 pl-10 leading-none">Modüler İskelet</h3>
                        <button onClick={addModule} className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-2xl hover:scale-105 transition-transform">+ MODÜL EKLE</button>
                     </div>
                     <div className="space-y-4">
                        {plan.curriculum.map((mod, idx) => (
                           <div key={mod.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-orange-200 transition-all shadow-sm hover:shadow-xl">
                              <div className="flex items-center gap-8">
                                 <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl">{idx + 1}</div>
                                 <input type="text" className="bg-transparent font-black text-2xl text-slate-800 outline-none border-b-4 border-transparent focus:border-orange-500 w-[500px]" value={mod.title} placeholder="Modül Başlığı..." onChange={e => {
                                    const newC = [...plan.curriculum];
                                    newC[idx].title = e.target.value;
                                    setPlan({...plan, curriculum: newC});
                                 }} />
                              </div>
                              <button onClick={() => {
                                 const newC = [...plan.curriculum];
                                 newC.splice(idx, 1);
                                 setPlan({...plan, curriculum: newC});
                              }} className="p-4 text-rose-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 rounded-2xl transition-all"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" /></svg></button>
                           </div>
                        ))}
                     </div>
                     <div className="mt-16 flex flex-col items-center">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] mb-10">Tüm birimler hazırsa sentezlemeyi başlatın</p>
                        <button onClick={handleLaunchDeepProduction} disabled={isAiProcessing} className="px-24 py-10 bg-slate-950 text-white rounded-[4rem] font-black text-xl uppercase tracking-[0.5em] shadow-[0_40px_100px_rgba(0,0,0,0.4)] hover:bg-orange-600 transition-all active:scale-95">SENTEZLEMEYİ BAŞLAT</button>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'preview' && (
               <div className="w-full max-w-7xl space-y-12 animate-fade-in pb-32">
                  <div className="bg-orange-600 p-12 rounded-[4rem] text-white flex justify-between items-center shadow-3xl">
                     <div>
                        <h4 className="text-4xl font-black uppercase tracking-tighter">Sentez Tamamlandı</h4>
                        <p className="text-orange-100 font-bold uppercase text-[11px] tracking-[0.4em] mt-3">Müfredat Kütüphaneye Atanmaya Hazır</p>
                     </div>
                     <div className="flex gap-4">
                        <div className="px-8 py-4 bg-white/10 rounded-2xl text-[11px] font-black uppercase">{(plan.slides?.length || 0)} SLAYT</div>
                        <div className="px-8 py-4 bg-white/10 rounded-2xl text-[11px] font-black uppercase">{(plan.finalQuiz?.questions.length || 0)} SORU</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-12 gap-10">
                     <div className="col-span-3 space-y-3 overflow-y-auto max-h-[800px] custom-scrollbar pr-3">
                        {plan.slides?.map((s, i) => (
                           <button key={i} onClick={() => setActiveSlideIdx(i)} className={`w-full p-6 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden ${activeSlideIdx === i ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.05]' : 'bg-white border-slate-100 text-slate-500 hover:border-orange-300'}`}>
                              <span className="text-[9px] font-black uppercase opacity-50 block mb-2">SLAYT {i+1}</span>
                              <p className="text-[11px] font-bold truncate uppercase">{s.title}</p>
                           </button>
                        ))}
                     </div>
                     <div className="col-span-9 bg-white rounded-[5rem] shadow-3xl border border-slate-200 p-20 min-h-[600px] flex flex-col justify-center">
                        <h3 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-16 border-l-[20px] border-orange-600 pl-12 leading-none">{plan.slides?.[activeSlideIdx].title}</h3>
                        <div className="space-y-8">
                           {plan.slides?.[activeSlideIdx].content.map((c, i) => (
                              <div key={i} className="flex gap-8 items-start p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                                 <div className="w-5 h-5 bg-orange-600 rounded-full mt-3.5 shrink-0 shadow-xl"></div>
                                 <p className="text-3xl font-bold text-slate-700 leading-tight">{c}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
      
      {/* PERSISTENT STATUS */}
      {isAiProcessing && (
         <div className="fixed bottom-10 left-10 z-[6000] bg-slate-900 text-white p-6 rounded-[2rem] shadow-3xl border border-white/10 animate-slide-up flex items-center gap-6">
            <div className="w-3 h-3 bg-orange-600 rounded-full animate-ping"></div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest">Nöral Sentez Devam Ediyor</p>
               <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Lütfen Bekleyin...</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default MultimodalStudio;
