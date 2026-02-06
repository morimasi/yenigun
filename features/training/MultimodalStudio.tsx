
import React, { useState, useEffect } from 'react';
import { CustomTrainingPlan, TrainingModule, TrainingUnit, Branch, TrainingGenerationConfig, TrainingSlide } from '../../types';
import { armsService } from '../../services/ai/armsService';
import AssignmentModal from './AssignmentModal';

interface MultimodalStudioProps {
  onClose: () => void;
  initialPlan?: CustomTrainingPlan | null;
}

const MultimodalStudio: React.FC<MultimodalStudioProps> = ({ onClose, initialPlan }) => {
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
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const handleLaunchDeepProduction = async () => {
    if (!plan.title || !plan.description || plan.curriculum.length === 0) {
      alert("Lütfen önce içerik ve yapı planlamasını tamamlayın.");
      return;
    }
    
    setIsAiProcessing(true);
    try {
      const result = await armsService.generateUniversalCurriculum(plan, config);
      if (result) {
        setPlan(prev => ({ 
          ...prev, 
          slides: result.slides, 
          finalQuiz: result.quiz,
          aiConfig: config 
        }));
        setActiveTab('preview');
        setActiveSlideIdx(0);
      }
    } catch (e) {
      alert("AI Sentez Hatası. Lütfen tekrar deneyin.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!plan.slides) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/training?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, status: 'active', updatedAt: Date.now() })
      });
      if (res.ok) {
        alert("Eğitim başarıyla kurumsal arşive mühürlendi.");
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

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-50 flex flex-col animate-fade-in overflow-hidden">
      
      {/* 1. TOP BAR */}
      <div className="h-20 bg-slate-950 flex items-center justify-between px-8 shrink-0 shadow-2xl relative z-50">
         <div className="flex items-center gap-6">
            <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
               <h2 className="text-white font-black text-base uppercase tracking-widest leading-none">{plan.title || 'Müfredat Tasarım Modu'}</h2>
               <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-2">MIA Multimodal Production Suite</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mr-4">
               {['config', 'plan', 'structure', 'preview'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveTab(t as any)}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                  >
                     {t === 'config' ? 'STRATEJİ' : t === 'plan' ? 'İÇERİK' : t === 'structure' ? 'YAPI' : 'ÖNİZLEME'}
                  </button>
               ))}
            </div>
            
            {activeTab === 'preview' && plan.slides && (
              <div className="flex gap-3">
                 <button 
                   onClick={() => setIsAssignModalOpen(true)}
                   className="px-8 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-600 hover:text-white transition-all"
                 >PERSONELE ATA</button>
                 <button 
                   onClick={handleSaveToLibrary}
                   disabled={isSaving}
                   className="px-10 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all"
                 >{isSaving ? '...' : 'ARŞİVE MÜHÜRLE'}</button>
              </div>
            )}
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* MAIN CONTENT AREA */}
         <div className="flex-1 bg-[#FAFAFA] overflow-y-auto custom-scrollbar p-10 flex flex-col items-center relative">
            
            {activeTab === 'config' && (
               <div className="w-full max-w-4xl space-y-8 animate-scale-in">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200">
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-orange-600 pl-8 mb-12">AI Strateji Katmanı</h3>
                     <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-10">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedagojik Odak</label>
                              <div className="grid grid-cols-2 gap-2">
                                 {['ABA', 'FLOORTIME', 'ECSE', 'NEURAL'].map(b => (
                                    <button key={b} onClick={() => setConfig({...config, pedagogicalBias: b as any})} className={`p-4 rounded-2xl border-2 font-black text-[11px] transition-all ${config.pedagogicalBias === b ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-400'}`}>{b}</button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bilişsel Seviye</label>
                              <div className="grid grid-cols-3 gap-2">
                                 {['JUNIOR', 'PRO', 'SUPERVISOR'].map(l => (
                                    <button key={l} onClick={() => setConfig({...config, cognitiveLoad: l as any})} className={`p-4 rounded-xl border-2 font-black text-[9px] transition-all ${config.cognitiveLoad === l ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-400'}`}>{l}</button>
                                 ))}
                              </div>
                           </div>
                        </div>
                        <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-center text-center space-y-6">
                           <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest">Muhakeme Modu: {config.thinkingBudget > 0 ? 'AKTİF' : 'KAPALI'}</p>
                           <p className="text-sm font-medium italic opacity-70">"Bu seçim, AI'nın müfredat slaytlarını üretirken pedagojik çatışmaları çözmek için kullanacağı bilişsel derinliği belirler."</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'plan' && (
               <div className="w-full max-w-4xl space-y-8 animate-slide-up">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200">
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-orange-600 pl-8 mb-12">Müfredat Kimliği</h3>
                     <div className="space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Müfredat Başlığı</label>
                           <input type="text" className="w-full p-6 bg-slate-50 rounded-3xl font-black text-2xl border-2 border-transparent focus:border-orange-500 outline-none transition-all shadow-inner" value={plan.title} onChange={e => setPlan({...plan, title: e.target.value})} placeholder="Örn: Otizmde Sönme Patlaması Yönetimi" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Akademik Vizyon & Özet</label>
                           <textarea className="w-full p-8 bg-slate-50 rounded-[3rem] font-medium text-lg text-slate-600 min-h-[200px] outline-none shadow-inner border-2 border-transparent focus:border-orange-500 transition-all" value={plan.description} onChange={e => setPlan({...plan, description: e.target.value})} placeholder="Bu eğitim sonunda personelin kazanacağı klinik yetkinlikleri özetleyin..." />
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'structure' && (
               <div className="w-full max-w-4xl space-y-8 animate-slide-up">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200">
                     <div className="flex justify-between items-center mb-12">
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-orange-600 pl-8">Modüler Yapı</h3>
                        <button onClick={addModule} className="px-8 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-slate-900 transition-all">+ MODÜL EKLE</button>
                     </div>
                     <div className="space-y-4">
                        {plan.curriculum.map((mod, mIdx) => (
                           <div key={mod.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-200 flex justify-between items-center group hover:bg-white hover:border-orange-200 transition-all">
                              <div className="flex items-center gap-8">
                                 <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">{mIdx + 1}</div>
                                 <input type="text" className="bg-transparent font-black text-2xl text-slate-800 outline-none border-b-2 border-transparent focus:border-orange-500" value={mod.title} onChange={e => {
                                    const newC = [...plan.curriculum];
                                    newC[mIdx].title = e.target.value;
                                    setPlan({...plan, curriculum: newC});
                                 }} />
                              </div>
                              <button onClick={() => {
                                 const newC = [...plan.curriculum];
                                 newC.splice(mIdx, 1);
                                 setPlan({...plan, curriculum: newC});
                              }} className="p-4 text-rose-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 rounded-2xl transition-all"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" /></svg></button>
                           </div>
                        ))}
                     </div>
                     <div className="mt-16 flex flex-col items-center">
                        <button onClick={handleLaunchDeepProduction} className="px-20 py-8 bg-slate-950 text-white rounded-[3rem] font-black text-xl uppercase tracking-[0.4em] shadow-3xl hover:bg-orange-600 transition-all active:scale-95">MULTIMODAL ÜRETİMİ BAŞLAT</button>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'preview' && plan.slides && (
               <div className="w-full max-w-6xl space-y-12 animate-fade-in pb-32">
                  <div className="grid grid-cols-12 gap-8 items-start">
                     <div className="col-span-3 space-y-2 max-h-[700px] overflow-y-auto custom-scrollbar pr-3">
                        {plan.slides.map((s, idx) => (
                           <button key={s.id} onClick={() => setActiveSlideIdx(idx)} className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${activeSlideIdx === idx ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-500 hover:border-orange-200'}`}>
                              <span className="text-[9px] font-black uppercase opacity-50 block mb-1">SLAYT {idx + 1}</span>
                              <p className="text-[11px] font-bold truncate uppercase">{s.title}</p>
                           </button>
                        ))}
                     </div>
                     <div className="col-span-9 bg-white rounded-[5rem] aspect-video shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
                        <div className="p-16 md:p-24 flex-1 overflow-y-auto custom-scrollbar">
                           <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-l-[16px] border-orange-600 pl-10 leading-none">{plan.slides[activeSlideIdx].title}</h2>
                           <div className="grid grid-cols-1 gap-6">
                              {plan.slides[activeSlideIdx].elements?.map((el: any) => (
                                 <div key={el.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest block mb-2">{el.type}</span>
                                    <p className="text-lg font-bold text-slate-700 italic">"{el.content.toString()}"</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>

      {isAssignModalOpen && (
         <AssignmentModal plan={plan} onClose={() => setIsAssignModalOpen(false)} />
      )}

      {isAiProcessing && (
        <div className="fixed inset-0 z-[6000] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center">
           <div className="relative mb-12">
              <div className="w-56 h-56 border-[14px] border-white/5 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-28 h-28 bg-slate-900 rounded-[3.5rem] shadow-2xl flex items-center justify-center border border-white/10">
                    <svg className="w-14 h-14 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
              </div>
           </div>
           <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">Nöral Müfredat İnşası</h3>
           <p className="text-orange-500 font-black text-xl uppercase tracking-[0.5em] animate-pulse">Multimodal Slaytlar Sentezleniyor...</p>
        </div>
      )}
    </div>
  );
};

export default MultimodalStudio;
