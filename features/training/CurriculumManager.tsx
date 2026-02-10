
import React, { useState, useMemo } from 'react';
import { GLOBAL_CURRICULA, TrainingPlan } from './curriculumData';
import { armsService } from '../../services/ai/armsService';
import { 
  TrainingSlide, CustomTrainingPlan, TrainingGenerationConfig, 
  PedagogicalSchool, CognitiveLoad, TrainingTheme, Branch 
} from '../../types';
import AssignmentModal from './AssignmentModal';
import PresentationStudio from './PresentationStudio';

const CurriculumManager: React.FC = () => {
  const [selectedKatalogPlan, setSelectedKatalogPlan] = useState<TrainingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ORIENTATION' | 'CLINICAL' | 'ETHICS' | 'MANAGEMENT'>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStudioPlan, setActiveStudioPlan] = useState<CustomTrainingPlan | null>(null);

  // Yapılandırma State
  const [config, setConfig] = useState<TrainingGenerationConfig>({
    pedagogicalBias: PedagogicalSchool.NeuralPedagogy,
    cognitiveLoad: CognitiveLoad.Pro,
    audience: 'KIDEMLI_UZMANLAR',
    theme: 'GOLDEN_ACADEMY',
    slideCount: 10,
    includeVisuals: true,
    hasEvaluation: true,
    tone: 'academic',
    temperature: 0.7,
    thinkingBudget: 15000,
    customDirectives: '',
    academicConfig: {
      institutionName: 'Yeni Gün Özel Eğitim Akademi',
      headerAntet: true,
      signatureTitles: ['Kurul Başkanı', 'Baş Eğitmen'],
      footerNote: 'Bu döküman Yeni Gün Akademi akademik yayın standartlarına uygun olarak üretilmiştir.',
      showWatermark: true,
      officialSeal: true
    }
  });

  const filteredPlans = useMemo(() => {
    return GLOBAL_CURRICULA.filter(p => {
      const matchesTab = activeTab === 'ALL' || p.category === activeTab;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleEnhancePrompt = async () => {
    if (!selectedKatalogPlan) return;
    setIsEnhancing(true);
    try {
      const enhanced = await armsService.enhancePresentationPrompt(selectedKatalogPlan.title, config.customDirectives || '');
      setConfig({ ...config, customDirectives: enhanced });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleLaunchProduction = async () => {
    if (!selectedKatalogPlan) return;
    setIsGenerating(true);
    try {
       const planPayload: CustomTrainingPlan = {
          id: `PUB-${Date.now()}`,
          title: selectedKatalogPlan.title,
          category: selectedKatalogPlan.category,
          level: selectedKatalogPlan.level === 'Beginner' ? 'Beginner' : selectedKatalogPlan.level === 'Intermediate' ? 'Intermediate' : 'Advanced',
          description: selectedKatalogPlan.description,
          targetBranches: selectedKatalogPlan.targetBranches as any,
          curriculum: [],
          createdBy: 'Akademik Kurul',
          createdAt: Date.now(),
          status: 'active'
       };

       const result = await armsService.generateUniversalCurriculum(planPayload, config);
       setActiveStudioPlan({
          ...planPayload,
          slides: result.slides,
          finalQuiz: result.quiz,
          aiConfig: config
       });
    } catch (e) {
       alert("AI Sentez Hatası. Lütfen direktifleri kısaltıp tekrar deneyiniz.");
    } finally {
       setIsGenerating(false);
    }
  };

  if (activeStudioPlan) {
     return <PresentationStudio customPlan={activeStudioPlan} onClose={() => setActiveStudioPlan(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] animate-fade-in overflow-hidden relative">
      
      {/* YAPILANDIRMA MODALI */}
      {selectedKatalogPlan && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
           <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[4rem] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Sunum Mimarı</h3>
                    <p className="text-[11px] font-bold text-orange-600 uppercase tracking-[0.4em] mt-2">{selectedKatalogPlan.title}</p>
                 </div>
                 <button onClick={() => setSelectedKatalogPlan(null)} className="p-5 hover:bg-rose-50 rounded-[2rem] text-slate-400 hover:text-rose-500 transition-all">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* SOL: TEMEL AYARLAR */}
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">PEDAGOJİK EKOL</label>
                          <select className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-2 border-transparent focus:border-orange-500 outline-none transition-all" value={config.pedagogicalBias} onChange={e => setConfig({...config, pedagogicalBias: e.target.value as PedagogicalSchool})}>
                             {Object.values(PedagogicalSchool).map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">SLAYT SAYISI: {config.slideCount}</label>
                             <input type="range" min="5" max="20" className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-orange-600" value={config.slideCount} onChange={e => setConfig({...config, slideCount: parseInt(e.target.value)})} />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">BİLİŞSEL YÜK</label>
                             <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-xs" value={config.cognitiveLoad} onChange={e => setConfig({...config, cognitiveLoad: e.target.value as CognitiveLoad})}>
                                {Object.values(CognitiveLoad).map(v => <option key={v} value={v}>{v}</option>)}
                             </select>
                          </div>
                       </div>
                    </div>

                    {/* SAĞ: NÖRAL DİREKTİFLER */}
                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6 relative overflow-hidden">
                       <div className="flex justify-between items-center relative z-10">
                          <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Nöral Direktifler</h5>
                          <button 
                            onClick={handleEnhancePrompt}
                            disabled={isEnhancing}
                            className="px-4 py-2 bg-white/10 hover:bg-orange-600 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-2"
                          >
                             {isEnhancing ? 'SENTEZLENİYOR...' : '✨ PROMPTÜ GENİŞLET'}
                          </button>
                       </div>
                       <textarea 
                          className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-sm font-bold text-slate-300 outline-none focus:border-orange-500 transition-all resize-none relative z-10"
                          placeholder="AI'ya özel talimatlar verin (Örn: Daha fazla vaka çalışması ekle, dili daha sert tut...)"
                          value={config.customDirectives}
                          onChange={e => setConfig({...config, customDirectives: e.target.value})}
                       />
                       <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]"></div>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end">
                 <button 
                    onClick={handleLaunchProduction}
                    disabled={isGenerating}
                    className="px-20 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
                 >
                    {isGenerating ? 'AI ÜRETİMİ DEVAM EDİYOR...' : 'ÖZELLEŞTİRİLMİŞ SUNUMU ÜRET'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* KATALOG HEADER */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 z-20 shadow-sm">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 shadow-xl border border-slate-800">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253" /></svg>
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Akademik Katalog</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{filteredPlans.length} Uzmanlık Rotası</p>
            </div>
         </div>

         <div className="flex items-center gap-4 flex-1 max-w-xl mx-8 no-print">
            <div className="relative w-full group">
               <input 
                  type="text" 
                  placeholder="Eğitim, branş veya anahtar kelime..." 
                  className="w-full bg-slate-100 focus:bg-white focus:border-orange-500 p-4 pl-12 rounded-2xl text-xs font-bold outline-none transition-all shadow-inner border border-transparent"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
               />
               <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
         </div>

         <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 no-print">
            {['ALL', 'ORIENTATION', 'CLINICAL', 'ETHICS', 'MANAGEMENT'].map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveTab(cat as any)}
                 className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}
               >
                  {cat === 'ALL' ? 'TÜMÜ' : cat}
               </button>
            ))}
         </div>
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#FDFDFD]">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPlans.map(plan => (
               <div 
                 key={plan.id}
                 onClick={() => setSelectedKatalogPlan(plan)}
                 className="bg-white border border-slate-200 rounded-[3rem] p-8 hover:border-orange-500 hover:shadow-3xl transition-all cursor-pointer group flex flex-col h-[300px] relative overflow-hidden"
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">{plan.category}</div>
                     <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{plan.badge}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">{plan.title}</h4>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed line-clamp-3 mb-auto italic">"{plan.description}"</p>
                  
                  <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seviye: {plan.level}</span>
                     <span className="text-[10px] font-black text-orange-600">YAPILANDIR →</span>
                  </div>

                  <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default CurriculumManager;
