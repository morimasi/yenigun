
import React, { useState } from 'react';
import { CustomTrainingPlan, TrainingModule, TrainingGenerationConfig, TrainingSlide, TrainingQuiz } from '../../types';
import { armsService } from '../../services/ai/armsService';
import PresentationStudio from './PresentationStudio';

interface MultimodalStudioProps {
  onClose: () => void;
}

const MultimodalStudio: React.FC<MultimodalStudioProps> = ({ onClose }) => {
  const [plan, setPlan] = useState<CustomTrainingPlan>({
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
    thinkingBudget: 24576
  });

  const [activeTab, setActiveTab] = useState<'config' | 'plan' | 'structure' | 'preview'>('config');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ slides: TrainingSlide[], quiz: TrainingQuiz } | null>(null);

  const handleLaunchProduction = async () => {
    if (!plan.title || !plan.description) return alert("Başlık ve açıklama zorunludur.");
    setIsAiProcessing(true);
    try {
      const result = await armsService.generateUniversalCurriculum(plan, config);
      setGeneratedResult(result);
      setPlan({ ...plan, slides: result.slides, finalQuiz: result.quiz, aiConfig: config });
      setActiveTab('preview');
    } catch (e) {
      alert("Nöral Sentez Hatası.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const addModule = () => {
    const newMod: TrainingModule = {
      id: `MOD-${Date.now()}`,
      title: 'Yeni Modül',
      focusArea: 'Genel Gelişim',
      difficulty: 'intermediate',
      status: 'active',
      units: []
    };
    setPlan({ ...plan, curriculum: [...plan.curriculum, newMod] });
  };

  if (activeTab === 'preview' && plan.slides) {
     return <PresentationStudio customPlan={plan} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-50 flex flex-col animate-fade-in overflow-hidden">
      <div className="h-20 bg-slate-950 flex items-center justify-between px-10 shrink-0 border-b border-white/5">
         <div className="flex items-center gap-8">
            <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-rose-600 rounded-xl flex items-center justify-center text-white transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
            <h2 className="text-white font-black text-lg uppercase tracking-[0.2em]">MULTIMODAL TASARIM STÜDYOSU</h2>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex bg-white/5 p-1 rounded-xl">
               {['config', 'plan', 'structure'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{t}</button>
               ))}
            </div>
            <button onClick={handleLaunchProduction} disabled={isAiProcessing} className="px-10 py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 hover:text-white transition-all">
               {isAiProcessing ? 'SENTEZLENİYOR...' : 'MOTORU ATEŞLE'}
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 bg-[#F1F5F9] flex justify-center">
         <div className="w-full max-w-4xl space-y-10 animate-scale-in">
            
            {activeTab === 'config' && (
               <div className="bg-white p-12 rounded-[4rem] shadow-3xl border border-slate-200">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-10 border-l-8 border-orange-600 pl-8">Stratejik Kalibrasyon</h3>
                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pedagojik Bias</label>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={config.pedagogicalBias} onChange={e => setConfig({...config, pedagogicalBias: e.target.value as any})}>
                           {['ABA', 'FLOORTIME', 'ECSE', 'NEURAL'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                     </div>
                     <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">İletişim Tonu</label>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={config.tone} onChange={e => setConfig({...config, tone: e.target.value as any})}>
                           {['academic', 'inspirational', 'warning'].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                        </select>
                     </div>
                  </div>
                  <button onClick={() => setActiveTab('plan')} className="mt-12 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase">İÇERİK PLANLAMAYA GEÇ</button>
               </div>
            )}

            {activeTab === 'plan' && (
               <div className="bg-white p-12 rounded-[4rem] shadow-3xl border border-slate-200 space-y-8">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-orange-600 pl-8">Müfredat Vizyonu</h3>
                  <input type="text" className="w-full p-6 bg-slate-50 rounded-2xl font-black text-2xl outline-none focus:border-orange-500 shadow-inner" placeholder="Eğitim Başlığı..." value={plan.title} onChange={e => setPlan({...plan, title: e.target.value})} />
                  <textarea className="w-full p-8 bg-slate-50 rounded-[2.5rem] font-medium text-lg text-slate-600 min-h-[200px] outline-none shadow-inner" placeholder="Eğitim Amaçları ve Kapsamı..." value={plan.description} onChange={e => setPlan({...plan, description: e.target.value})} />
                  <button onClick={() => setActiveTab('structure')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase">YAPI TASARIMINA GEÇ</button>
               </div>
            )}

            {activeTab === 'structure' && (
               <div className="bg-white p-12 rounded-[4rem] shadow-3xl border border-slate-200 space-y-8">
                  <div className="flex justify-between items-center">
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-orange-600 pl-8">Modüler İskelet</h3>
                     <button onClick={addModule} className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">+ MODÜL EKLE</button>
                  </div>
                  <div className="space-y-4">
                     {plan.curriculum.map((mod, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center group">
                           <div className="flex items-center gap-6">
                              <span className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black">{idx + 1}</span>
                              <input type="text" className="bg-transparent font-black text-xl text-slate-800 outline-none border-b-2 border-transparent focus:border-orange-500" value={mod.title} onChange={e => {
                                 const newC = [...plan.curriculum];
                                 newC[idx].title = e.target.value;
                                 setPlan({...plan, curriculum: newC});
                              }} />
                           </div>
                           <button onClick={() => {
                              const newC = [...plan.curriculum];
                              newC.splice(idx, 1);
                              setPlan({...plan, curriculum: newC});
                           }} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">SİL</button>
                        </div>
                     ))}
                  </div>
                  <button onClick={handleLaunchProduction} disabled={isAiProcessing} className="w-full py-8 bg-slate-950 text-white rounded-[3rem] font-black text-lg uppercase tracking-[0.4em] shadow-3xl hover:bg-orange-600 transition-all">SENTEZLEMEYİ BAŞLAT</button>
               </div>
            )}

         </div>
      </div>
      
      {isAiProcessing && (
         <div className="fixed bottom-10 right-10 bg-slate-900 text-white p-6 rounded-2xl shadow-3xl border border-white/10 animate-slide-up flex items-center gap-6">
            <div className="w-3 h-3 bg-orange-600 rounded-full animate-ping"></div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest">Nöral İnşa Devam Ediyor</p>
               <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Sınıf içi senaryolar kurgulanıyor...</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default MultimodalStudio;
