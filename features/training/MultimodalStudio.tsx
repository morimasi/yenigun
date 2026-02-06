
import React, { useState, useEffect } from 'react';
import { CustomTrainingPlan, TrainingModule, TrainingUnit, Branch, TrainingGenerationConfig, TrainingSlide } from '../../types';
import { armsService } from '../../services/ai/armsService';

interface MultimodalStudioProps {
  onClose: () => void;
  initialPlan?: CustomTrainingPlan | null;
}

const MultimodalStudio: React.FC<MultimodalStudioProps> = ({ onClose, initialPlan }) => {
  // --- STATE ---
  const [plan, setPlan] = useState<CustomTrainingPlan>(initialPlan || {
    id: `CUR-${Date.now()}`,
    title: 'Yeni Akademik Müfredat',
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

  // --- HANDLERS ---
  const handleLaunchDeepProduction = async () => {
    // Validasyon Kontrolleri
    if (!plan.title || !plan.description) {
      alert("Lütfen önce 'İçerik' sekmesinden müfredat başlığını ve vizyon açıklamasını giriniz.");
      setActiveTab('plan');
      return;
    }

    if (plan.curriculum.length === 0) {
      alert("Lütfen önce 'Yapı' sekmesinden en az bir modül taslağı oluşturun.");
      setActiveTab('structure');
      return;
    }
    
    setIsAiProcessing(true);
    try {
      console.log("MIA: Sentezleme başlatılıyor...", { plan, config });
      const result = await armsService.generateUniversalCurriculum(plan, config);
      
      if (!result || !result.slides) {
        throw new Error("AI yanıtı beklenen formatta değil.");
      }

      setPlan(prev => ({ 
        ...prev, 
        slides: result.slides, 
        finalQuiz: result.quiz,
        aiConfig: config 
      }));
      
      setActiveTab('preview');
      setActiveSlideIdx(0);
      console.log("MIA: Sentezleme tamamlandı.");
    } catch (e: any) {
      console.error("Production Error:", e);
      alert(`AI Üretim Hatası: ${e.message || 'Parametreler çok kısıtlayıcı olabilir.'}`);
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
        alert("Nöral Müfredat Kütüphaneye Mühürlendi.");
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
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
        {options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => setConfig({ ...config, [field]: opt })}
            className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${config[field as keyof TrainingGenerationConfig] === opt ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-50 flex flex-col animate-fade-in overflow-hidden font-sans">
      
      {/* GLOBAL PRODUCTION OVERLAY */}
      {isAiProcessing && (
        <div className="fixed inset-0 z-[5000] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center animate-fade-in">
           <div className="relative mb-12">
              <div className="w-56 h-56 border-[12px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] shadow-2xl flex items-center justify-center border border-white/10">
                    <svg className="w-12 h-12 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </div>
              </div>
           </div>
           <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Nöral Sentezleme Aktif</h3>
           <p className="text-orange-500 font-black text-xl uppercase tracking-[0.5em] animate-pulse">Akademik Müfredat İnşa Ediliyor...</p>
           <p className="mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-md">Lütfen pencereyi kapatmayın. Gemini 3 Flash motoru pedagojik yapıyı, sunum slaytlarını ve sınav sorularını mühürlüyor.</p>
        </div>
      )}

      {/* 1. TOP COMMAND BAR */}
      <div className="h-16 bg-slate-950 flex items-center justify-between px-8 shrink-0 shadow-2xl relative z-50">
         <div className="flex items-center gap-6">
            <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-all">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <div>
               <h2 className="text-white font-black text-sm uppercase tracking-widest leading-none">{plan.title || 'Müfredat Tasarımı'}</h2>
               <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] mt-1.5">v4.2 Universal Design Studio</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mr-4">
               {[
                 { id: 'config', l: '1. STRATEJİ' },
                 { id: 'plan', l: '2. İÇERİK' },
                 { id: 'structure', l: '3. YAPI' },
                 { id: 'preview', l: '4. ÖNİZLEME' }
               ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                  >
                     {t.l}
                  </button>
               ))}
            </div>
            
            {activeTab === 'preview' ? (
              <button 
                onClick={handleSaveToLMS}
                disabled={isSaving || !plan.slides}
                className="px-10 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                 {isSaving ? 'MÜHÜRLENİYOR...' : 'KÜTÜPHANEYE YAYINLA'}
              </button>
            ) : (
              <button 
                onClick={handleLaunchDeepProduction}
                disabled={isAiProcessing}
                className="px-10 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
              >
                 {isAiProcessing ? (
                   <>
                    <div className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>İŞLENİYOR...</span>
                   </>
                 ) : 'NÖRAL ÜRETİMİ BAŞLAT'}
              </button>
            )}
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* 2. MAIN WORKSPACE */}
         <div className="flex-1 bg-[#FAFAFA] overflow-y-auto custom-scrollbar flex flex-col items-center relative p-10">
            
            {/* TAB 1: STRATEGY CONFIG */}
            {activeTab === 'config' && (
               <div className="w-full max-w-4xl space-y-8 animate-scale-in">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200">
                     <div className="flex justify-between items-start mb-12">
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-orange-600 pl-8">AI Strateji Katmanı</h3>
                        <div className="text-right">
                           <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Adım 1 / 4</span>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-8">
                           <ConfigPill label="PEDAGOJİK ODAK (BIAS)" field="pedagogicalBias" options={['ABA', 'FLOORTIME', 'ECSE', 'NEURAL']} />
                           <ConfigPill label="BİLİŞSEL SEVİYE" field="cognitiveLoad" options={['JUNIOR', 'PRO', 'SUPERVISOR']} />
                           <ConfigPill label="İLETİŞİM ÜSLUBU" field="tone" options={['academic', 'inspirational', 'warning']} />
                        </div>
                        <div className="space-y-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">YARATICILIK (TEMPERATURE)</label>
                              <input type="range" min="0" max="1" step="0.1" value={config.temperature} onChange={e => setConfig({...config, temperature: parseFloat(e.target.value)})} className="w-full accent-orange-600" />
                              <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase"><span>Teknik</span><span>Esnek</span></div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MUHAKEME BÜTÇESİ (THINKING)</label>
                              <select className="w-full p-4 bg-slate-50 rounded-xl font-bold text-xs" value={config.thinkingBudget} onChange={e => setConfig({...config, thinkingBudget: parseInt(e.target.value)})}>
                                 <option value={0}>Muhakeme Kapalı</option>
                                 <option value={12000}>Standart (12k)</option>
                                 <option value={24576}>Derin (Max 24k)</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="mt-12 p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">Strateji tamamlandıysa içeriği planlayın.</p>
                        <button onClick={() => setActiveTab('plan')} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">İÇERİK PLANLAMAYA GEÇ →</button>
                     </div>
                  </div>
               </div>
            )}

            {/* TAB 2: IDENTITY & VISION */}
            {activeTab === 'plan' && (
               <div className="w-full max-w-4xl space-y-8 animate-slide-up">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200">
                     <div className="flex justify-between items-start mb-12">
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-orange-600 pl-8">Müfredat Kimliği</h3>
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Adım 2 / 4</span>
                     </div>
                     <div className="space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Eğitim Başlığı</label>
                           <input 
                              type="text" 
                              className="w-full p-6 bg-slate-50 rounded-3xl font-black text-2xl outline-none focus:border-orange-500 shadow-inner" 
                              placeholder="Örn: İleri Düzey Otizmde Kriz Yönetimi"
                              value={plan.title} 
                              onChange={e => setPlan({...plan, title: e.target.value})} 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Akademik Vizyon & Özet</label>
                           <textarea 
                              className="w-full p-8 bg-slate-50 rounded-[3rem] font-medium text-lg text-slate-600 min-h-[200px] outline-none shadow-inner" 
                              placeholder="Bu eğitimin personelde hangi klinik dönüşümü yapmasını hedefliyorsunuz?"
                              value={plan.description} 
                              onChange={e => setPlan({...plan, description: e.target.value})} 
                           />
                        </div>
                        <div className="flex justify-center pt-6">
                           <button onClick={() => setActiveTab('structure')} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">YAPIYI KURGULA →</button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* TAB 3: MODULAR STRUCTURE */}
            {activeTab === 'structure' && (
               <div className="w-full max-w-4xl space-y-8 animate-slide-up">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200">
                     <div className="flex justify-between items-center mb-12">
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-orange-600 pl-8">Modüler Yapı</h3>
                        <button onClick={addModule} className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">+ MODÜL EKLE</button>
                     </div>
                     
                     <div className="space-y-4">
                        {plan.curriculum.length === 0 ? (
                           <div className="py-20 text-center opacity-20 grayscale scale-75">
                              <svg className="w-20 h-20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                              <p className="text-xl font-black uppercase tracking-widest">Taslak Yapı Bulunmuyor</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">AI Sunumu üretmek için en az bir modül başlığı eklemelisiniz.</p>
                           </div>
                        ) : (
                           plan.curriculum.map((mod, mIdx) => (
                              <div key={mod.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-200 flex justify-between items-center group">
                                 <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">{mIdx + 1}</div>
                                    <input 
                                       type="text" 
                                       className="bg-transparent font-black text-xl text-slate-800 outline-none border-b-2 border-transparent focus:border-orange-500" 
                                       value={mod.title}
                                       placeholder="Modül Başlığı Girin..."
                                       onChange={e => {
                                          const newC = [...plan.curriculum];
                                          newC[mIdx].title = e.target.value;
                                          setPlan({...plan, curriculum: newC});
                                       }}
                                    />
                                 </div>
                                 <button onClick={() => {
                                    const newC = [...plan.curriculum];
                                    newC.splice(mIdx, 1);
                                    setPlan({...plan, curriculum: newC});
                                 }} className="p-3 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" /></svg></button>
                              </div>
                           ))
                        )}
                     </div>

                     <div className="mt-12 flex flex-col items-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-8">Tüm seçimler hazırsa nöral motoru ateşleyin</p>
                        <button 
                           onClick={handleLaunchDeepProduction}
                           disabled={isAiProcessing}
                           className="px-20 py-8 bg-slate-950 text-white rounded-[3rem] font-black text-lg uppercase tracking-[0.4em] shadow-3xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-20"
                        >
                           {isAiProcessing ? 'İŞLENİYOR...' : 'ÜRETİMİ BAŞLAT'}
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* TAB 4: DEEP PREVIEW */}
            {activeTab === 'preview' && (
               <div className="w-full max-w-6xl space-y-12 animate-fade-in pb-20">
                  {plan.slides ? (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Slide Selector */}
                        <div className="lg:col-span-3 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                           {plan.slides.map((s, idx) => (
                              <button 
                                 key={s.id} 
                                 onClick={() => setActiveSlideIdx(idx)}
                                 className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${activeSlideIdx === idx ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500 hover:border-orange-200'}`}
                              >
                                 <span className="text-[8px] font-black uppercase opacity-50 block mb-1">SLAYT {idx + 1}</span>
                                 <p className="text-[10px] font-bold truncate uppercase">{s.title}</p>
                              </button>
                           ))}
                        </div>

                        {/* Interactive Slide Viewer */}
                        <div className="lg:col-span-9 space-y-6">
                           <div className="bg-white rounded-[4rem] aspect-video shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
                              <div className="p-16 flex-1 overflow-y-auto custom-scrollbar">
                                 <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-10 border-l-[12px] border-orange-600 pl-8 leading-none">
                                    {plan.slides[activeSlideIdx].title}
                                 </h2>
                                 <ul className="space-y-6">
                                    {plan.slides[activeSlideIdx].content.map((c, i) => (
                                       <li key={i} className="flex gap-4 items-start">
                                          <div className="w-2.5 h-2.5 bg-orange-600 rounded-full mt-3 shrink-0 shadow-lg"></div>
                                          <p className="text-2xl font-bold text-slate-600 leading-snug">{c}</p>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">AKADEMİK SENTEZ MÜHÜRÜ</span>
                                 <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black">{activeSlideIdx + 1} / {plan.slides.length}</span>
                              </div>
                           </div>

                           {/* Educator Metadata */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-xl">
                                 <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">EĞİTMEN NOTLARI (KLİNİK DERİNLİK)</h5>
                                 <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{plan.slides[activeSlideIdx].speakerNotes}"</p>
                              </div>
                              <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-xl">
                                 <h5 className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-4">AI GÖRSEL BETİMLEME (GEN-PROMPT)</h5>
                                 <p className="text-sm font-black uppercase tracking-tight opacity-90">{plan.slides[activeSlideIdx].visualPrompt}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="bg-white p-32 rounded-[5rem] border-4 border-dashed border-slate-100 text-center opacity-30 flex flex-col items-center">
                        <svg className="w-32 h-32 mb-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 .517l-.318.158a6 6 0 01-3.86 .517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        <h3 className="text-4xl font-black text-slate-300 uppercase tracking-[0.5em]">Üretim Bekleniyor</h3>
                        <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lütfen bir önceki adıma dönüp Üretimi Başlat'a tıklayın.</p>
                     </div>
                  )}

                  {plan.finalQuiz && (
                     <div className="bg-slate-950 p-20 rounded-[5rem] text-white shadow-3xl relative overflow-hidden border border-white/5">
                        <div className="relative z-10">
                           <h4 className="text-2xl font-black uppercase tracking-[0.4em] mb-16 text-orange-500 border-b border-white/10 pb-8">Liyakat Mührü Sınavı</h4>
                           <div className="grid grid-cols-1 gap-12">
                              {plan.finalQuiz.questions.map((q, i) => (
                                 <div key={i} className="space-y-6">
                                    <p className="text-2xl font-black italic tracking-tight">Q{i+1}: {q.text}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                       {q.options.map((o, oi) => (
                                          <div key={oi} className={`p-6 rounded-[2rem] border-2 ${o.isCorrect ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'} text-[11px] font-bold uppercase`}>
                                             {o.label}
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px]"></div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
      
      {/* 4. PERSISTENT SYSTEM STATUS */}
      <div className="h-10 bg-white border-t border-slate-200 px-8 flex items-center justify-between shrink-0 relative z-50">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${isAiProcessing ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'}`}></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AI Engine: {isAiProcessing ? 'Synthesizing' : 'Online'}</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">MODEL: GEMINI-3-FLASH-PREVIEW</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">MIA-V4 CORE</span>
         </div>
      </div>
    </div>
  );
};

export default MultimodalStudio;
