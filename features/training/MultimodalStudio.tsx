
import React, { useState, useEffect, useMemo } from 'react';
import { CustomTrainingPlan, TrainingModule, TrainingUnit, MultimodalElement, Branch, TrainingGenerationConfig } from '../../types';
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
    description: 'Eğitim vizyonu ve metodolojik derinlik özeti.',
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
  const [activeModuleIdx, setActiveModuleIdx] = useState<number | null>(null);
  const [activeUnitIdx, setActiveUnitIdx] = useState<number | null>(null);
  
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- DERIVED DATA ---
  const activeModule = activeModuleIdx !== null ? plan.curriculum[activeModuleIdx] : null;

  // --- HANDLERS: AI PRODUCTION ---
  const handleLaunchDeepProduction = async () => {
    if (plan.curriculum.length === 0) {
      alert("Lütfen önce en az bir modül/ünite taslağı oluşturun.");
      return;
    }
    setIsAiProcessing(true);
    try {
      const result = await armsService.generateUniversalCurriculum(plan, config);
      setPlan({ 
        ...plan, 
        slides: result.slides, 
        finalQuiz: result.quiz,
        aiConfig: config 
      });
      setActiveTab('preview');
      alert("Nöral Müfredat Başarıyla Sentezlendi.");
    } catch (e) {
      alert("AI Üretim Hatası: Müfredat karmaşıklığı limitleri aştı.");
    } finally {
      setIsAiProcessing(false);
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
    setActiveModuleIdx(plan.curriculum.length);
  };

  const addUnit = (mIdx: number) => {
    const newUnit: TrainingUnit = {
      id: `UNT-${Date.now()}`,
      title: 'Yeni Eğitim Ünitesi',
      type: 'reading',
      content: 'Taslak içerik...',
      durationMinutes: 45,
      isCompleted: false,
      status: 'pending'
    };
    const newC = [...plan.curriculum];
    newC[mIdx].units.push(newUnit);
    setPlan({ ...plan, curriculum: newC });
    setActiveUnitIdx(newC[mIdx].units.length - 1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, updatedAt: Date.now() })
      });
      if (res.ok) alert("Müfredat Kütüphaneye Mühürlendi.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- UI COMPONENTS ---
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
      
      {/* 1. TOP COMMAND BAR */}
      <div className="h-16 bg-slate-950 flex items-center justify-between px-8 shrink-0 shadow-2xl relative z-50">
         <div className="flex items-center gap-6">
            <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-all">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <div>
               <h2 className="text-white font-black text-sm uppercase tracking-widest leading-none">{plan.title}</h2>
               <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] mt-1.5">v4.0 Universal Design Studio</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mr-4">
               {[
                 { id: 'config', l: 'STRATEJİ' },
                 { id: 'plan', l: 'İÇERİK' },
                 { id: 'structure', l: 'YAPI' },
                 { id: 'preview', l: 'ÖNİZLEME' }
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
            <button 
               onClick={handleLaunchDeepProduction}
               disabled={isAiProcessing}
               className="px-10 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50"
            >
               {isAiProcessing ? 'NÖRAL SENTEZ...' : 'MÜFREDATI ÜRET'}
            </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* 2. LEFT SIDEBAR: HIYERARŞİ KONTROLÜ */}
         <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 no-scrollbar">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">TASLAK HİYERARŞİSİ</h4>
               <button onClick={addModule} className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg font-black">+</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {plan.curriculum.map((mod, mIdx) => (
                  <div key={mod.id} className="space-y-1">
                     <div 
                        onClick={() => { setActiveModuleIdx(mIdx); setActiveTab('structure'); }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${activeModuleIdx === mIdx ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-50 text-slate-600 hover:border-orange-200'}`}
                     >
                        <span className="text-[11px] font-black uppercase truncate block">{mod.title}</span>
                        <p className={`text-[8px] font-bold mt-1 uppercase ${activeModuleIdx === mIdx ? 'text-slate-400' : 'text-slate-300'}`}>{mod.units.length} Ünite Taslağı</p>
                     </div>
                     <div className="pl-6 space-y-1 border-l-2 border-slate-100 ml-4">
                        {mod.units.map((unit, uIdx) => (
                           <div key={unit.id} className="p-2.5 rounded-lg border text-[9px] font-bold text-slate-400 uppercase truncate bg-white">
                              {uIdx + 1}. {unit.title}
                           </div>
                        ))}
                        <button onClick={() => addUnit(mIdx)} className="w-full p-2 text-[9px] font-black text-slate-300 hover:text-orange-600 uppercase transition-all">+ Ünite Ekle</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* 3. MAIN WORKSPACE */}
         <div className="flex-1 bg-[#FAFAFA] p-10 overflow-y-auto custom-scrollbar flex flex-col items-center relative">
            
            {/* TAB 1: AI STRATEGIC CONFIG */}
            {activeTab === 'config' && (
               <div className="w-full max-w-4xl space-y-8 animate-scale-in">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200">
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-l-8 border-orange-600 pl-8">AI Strateji Katmanı</h3>
                     <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-8">
                           <ConfigPill label="PEDAGOJİK EKOL (BIAS)" field="pedagogicalBias" options={['ABA', 'FLOORTIME', 'ECSE', 'NEURAL', 'TRADITIONAL']} />
                           <ConfigPill label="BİLİŞSEL YETERLİLİK" field="cognitiveLoad" options={['JUNIOR', 'PRO', 'SUPERVISOR']} />
                           <ConfigPill label="İLETİŞİM TONU" field="tone" options={['academic', 'inspirational', 'warning']} />
                        </div>
                        <div className="space-y-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">AI CREATIVITY (TEMP)</label>
                              <input type="range" min="0" max="1" step="0.1" value={config.temperature} onChange={e => setConfig({...config, temperature: parseFloat(e.target.value)})} className="w-full accent-orange-600" />
                              <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase"><span>Hatasız / Teknik</span><span>Yaratıcı / Esnek</span></div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">THINKING BUDGET (TOKENS)</label>
                              <select className="w-full p-4 bg-slate-50 rounded-xl font-bold text-xs" value={config.thinkingBudget} onChange={e => setConfig({...config, thinkingBudget: parseInt(e.target.value)})}>
                                 <option value={0}>Muhakeme Kapalı (Hızlı)</option>
                                 <option value={12000}>Standart Muhakeme (12k)</option>
                                 <option value={24576}>Derin Muhakeme (Max 24k)</option>
                              </select>
                           </div>
                        </div>
                     </div>
                     <div className="mt-12 p-8 bg-slate-950 rounded-[3rem] text-white">
                        <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">CUSTOM SYSTEM PROMPT (OVERRIDE)</label>
                        <textarea 
                           className="w-full bg-transparent border-none outline-none font-mono text-xs text-slate-300 leading-relaxed min-h-[150px]"
                           placeholder="MIA varsayılan talimatlarını ezmek için kendi sistem promptunuzu buraya girin..."
                           value={config.customSystemPrompt}
                           onChange={e => setConfig({...config, customSystemPrompt: e.target.value})}
                        />
                     </div>
                  </div>
               </div>
            )}

            {/* TAB 2: CONTENT EDITOR */}
            {activeTab === 'plan' && (
               <div className="w-full max-w-4xl space-y-8 animate-slide-up">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200">
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 border-l-8 border-orange-600 pl-8">Müfredat Kimliği</h3>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Müfredat Başlığı</label>
                           <input type="text" className="w-full p-6 bg-slate-50 rounded-3xl font-black text-2xl outline-none focus:border-orange-500 transition-all shadow-inner" value={plan.title} onChange={e => setPlan({...plan, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Akademik Vizyon & Detaylar</label>
                           <textarea className="w-full p-8 bg-slate-50 rounded-[3rem] font-medium text-lg text-slate-600 min-h-[250px] outline-none shadow-inner" value={plan.description} onChange={e => setPlan({...plan, description: e.target.value})} placeholder="Bu eğitim sonunda personelin hangi klinik bariyerleri aşmasını hedefliyorsunuz?" />
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* TAB 4: PREVIEW & PUBLISH */}
            {activeTab === 'preview' && (
               <div className="w-full max-w-6xl space-y-12 animate-fade-in pb-20">
                  {plan.slides ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {plan.slides.map((s, idx) => (
                           <div key={idx} className="bg-white rounded-[3rem] aspect-video shadow-xl border border-slate-100 overflow-hidden flex flex-col group relative">
                              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                                 <h5 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6 border-l-4 border-orange-600 pl-4">{s.title}</h5>
                                 <ul className="space-y-4">
                                    {s.content.map((c, i) => <li key={i} className="text-sm font-bold text-slate-500 leading-relaxed">• {c}</li>)}
                                 </ul>
                              </div>
                              <div className="p-4 bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.4em] text-center opacity-0 group-hover:opacity-100 transition-opacity">SLAYT {idx + 1}</div>
                              
                              {/* Hover Tooltip: Speaker Notes */}
                              <div className="absolute inset-0 bg-orange-600/95 p-10 opacity-0 group-hover:opacity-100 transition-all translate-y-10 group-hover:translate-y-0 flex flex-col justify-center">
                                 <span className="text-[10px] font-black text-white/50 uppercase mb-4">Eğitmen Notları</span>
                                 <p className="text-white text-sm font-bold italic leading-relaxed">"{s.speakerNotes}"</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="bg-white p-32 rounded-[5rem] border-4 border-dashed border-slate-100 text-center opacity-40">
                        <h3 className="text-4xl font-black text-slate-300 uppercase tracking-[0.5em]">Görüntülenecek Veri Yok</h3>
                     </div>
                  )}

                  {plan.finalQuiz && (
                     <div className="bg-slate-900 p-16 rounded-[5rem] text-white shadow-3xl">
                        <h4 className="text-2xl font-black uppercase tracking-[0.4em] mb-12 text-orange-500">Kazanım Ölçme Sınavı (AI-Gen)</h4>
                        <div className="space-y-10">
                           {plan.finalQuiz.questions.map((q, i) => (
                              <div key={i} className="space-y-4">
                                 <p className="text-lg font-black italic">Q{i+1}: {q.text}</p>
                                 <div className="grid grid-cols-2 gap-4">
                                    {q.options.map((o, oi) => (
                                       <div key={oi} className={`p-4 rounded-2xl border-2 ${o.isCorrect ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5'} text-[10px] font-bold uppercase`}>
                                          {o.label}
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                     <div className="space-y-2">
                        <h4 className="text-2xl font-black text-slate-900 uppercase">Müfredat Yayına Hazır</h4>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Kütüphaneye ekle ve personeline ata.</p>
                     </div>
                     <button onClick={handleSave} className="px-16 py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-emerald-600 transition-all">PUBLISH TO LMS HUB</button>
                  </div>
               </div>
            )}
         </div>
      </div>
      
      {/* 4. PERSISTENT SYSTEM STATUS */}
      <div className="h-10 bg-white border-t border-slate-200 px-8 flex items-center justify-between shrink-0 relative z-50">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AI Engine: Online</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">MODEL: GEMINI-3-PRO (DEEP THINKING)</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">PLAN ID: {plan.id}</span>
         </div>
      </div>
    </div>
  );
};

export default MultimodalStudio;
