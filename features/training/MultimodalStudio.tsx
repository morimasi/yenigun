
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
    curriculum: [], // Kesinlikle dizi olarak başlar
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
    if (!Array.isArray(plan.curriculum) || plan.curriculum.length === 0) {
      alert("En az bir modül ekleyin.");
      setActiveTab('structure');
      return;
    }
    
    setIsAiProcessing(true);
    try {
      const result = await armsService.generateUniversalCurriculum(plan, config);
      setPlan(prev => ({ 
        ...prev, 
        slides: Array.isArray(result.slides) ? result.slides : [], 
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
    const currentCurriculum = Array.isArray(plan.curriculum) ? plan.curriculum : [];
    setPlan({ ...plan, curriculum: [...currentCurriculum, newMod] });
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
      <div className="h-20 bg-slate-950 flex items-center justify-between px-10 shrink-0 shadow-3xl relative z-50 border-b border-white/5">
         <div className="flex items-center gap-10">
            <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-orange-600 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h2 className="text-white font-black text-lg uppercase tracking-[0.2em]">{plan.title || 'TASARIM STÜDYOSU'}</h2>
         </div>

         <div className="flex items-center gap-6">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
               {['config', 'plan', 'structure', 'preview'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveTab(t as any)}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-orange-600 text-white shadow-2xl' : 'text-slate-500 hover:text-white'}`}
                  >
                     {t.toUpperCase()}
                  </button>
               ))}
            </div>
            <button 
                onClick={activeTab === 'preview' ? handleSaveToLMS : handleLaunchDeepProduction}
                disabled={isAiProcessing || isSaving}
                className="px-12 py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 hover:text-white transition-all active:scale-95"
              >
                 {isAiProcessing ? 'İŞLENİYOR...' : activeTab === 'preview' ? 'MÜHÜRLE' : 'ATEŞLE'}
            </button>
         </div>
      </div>

      <div className="flex-1 bg-[#F1F5F9] overflow-y-auto p-12">
        {activeTab === 'config' && (
          <div className="w-full max-w-4xl mx-auto bg-white p-16 rounded-[4rem] shadow-3xl border border-slate-200">
             <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-l-[12px] border-orange-600 pl-10">AI Sentez Konfigürasyonu</h3>
             <div className="grid grid-cols-2 gap-12">
                <ConfigPill label="Pedagojik Ekol" field="pedagogicalBias" options={['ABA', 'FLOORTIME', 'NEURAL']} />
                <ConfigPill label="Bilişsel Yük" field="cognitiveLoad" options={['JUNIOR', 'PRO', 'SUPERVISOR']} />
             </div>
             <button onClick={() => setActiveTab('plan')} className="mt-16 w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em]">İÇERİK PLANLAMAYA GEÇ</button>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="w-full max-w-4xl mx-auto bg-white p-16 rounded-[4rem] shadow-3xl border border-slate-200">
             <div className="flex justify-between items-center mb-12">
                <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter border-l-[12px] border-orange-600 pl-10">Modüler İskelet</h3>
                <button onClick={addModule} className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-2xl">+ MODÜL EKLE</button>
             </div>
             <div className="space-y-4">
                {(Array.isArray(plan.curriculum) ? plan.curriculum : []).map((mod, idx) => (
                   <div key={mod.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-8">
                         <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl">{idx + 1}</div>
                         <input type="text" className="bg-transparent font-black text-2xl text-slate-800 outline-none border-b-4 border-transparent focus:border-orange-500 w-[400px]" value={mod.title} onChange={e => {
                            const newC = [...plan.curriculum];
                            newC[idx].title = e.target.value;
                            setPlan({...plan, curriculum: newC});
                         }} />
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="w-full max-w-7xl mx-auto animate-fade-in">
             <div className="grid grid-cols-12 gap-10">
                <div className="col-span-3 space-y-3 overflow-y-auto max-h-[700px] custom-scrollbar pr-3">
                   {(Array.isArray(plan.slides) ? plan.slides : []).map((s, i) => (
                      <button key={i} onClick={() => setActiveSlideIdx(i)} className={`w-full p-6 rounded-[2.5rem] border-2 text-left transition-all ${activeSlideIdx === i ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.05]' : 'bg-white border-slate-100 text-slate-500'}`}>
                         <span className="text-[9px] font-black uppercase opacity-50 block mb-2">SLAYT {i+1}</span>
                         <p className="text-[11px] font-bold truncate uppercase">{s.title}</p>
                      </button>
                   ))}
                </div>
                <div className="col-span-9 bg-white rounded-[5rem] shadow-3xl border border-slate-200 p-20 min-h-[600px] flex flex-col justify-center">
                   <h3 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-16 border-l-[20px] border-orange-600 pl-12 leading-none">{plan.slides?.[activeSlideIdx]?.title}</h3>
                   <div className="space-y-8">
                      {Array.isArray(plan.slides?.[activeSlideIdx]?.content) && plan.slides![activeSlideIdx].content.map((c, i) => (
                         <div key={i} className="flex gap-8 items-start p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                            <div className="w-5 h-5 bg-orange-600 rounded-full mt-3.5 shrink-0"></div>
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
  );
};

export default MultimodalStudio;
