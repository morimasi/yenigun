
import React, { useState, useEffect } from 'react';
import PresentationStudio from './PresentationStudio';
import CurriculumManager from './CurriculumManager';
import MultimodalStudio from './MultimodalStudio';
import { CustomTrainingPlan, TrainingSlide } from '../../types';
import { TrainingPlan } from './curriculumData';
import { SmartBackButton } from '../../components/shared/SmartBackButton';

type TrainingView = 'dashboard' | 'curriculum' | 'studio' | 'analytics' | 'generated_studio' | 'multimodal_studio';

const TrainingHub: React.FC = () => {
  const [activeView, setActiveView] = useState<TrainingView>('dashboard');
  const [viewHistory, setViewHistory] = useState<TrainingView[]>([]);
  const [customPlans, setCustomPlans] = useState<CustomTrainingPlan[]>([]);
  const [activePlan, setActivePlan] = useState<CustomTrainingPlan | null>(null);

  const navigateToView = (nextView: TrainingView) => {
    if (activeView !== nextView) {
      setViewHistory(prev => [...prev, activeView]);
      setActiveView(nextView);
    }
  };

  const handleBack = () => {
    if (viewHistory.length > 0) {
      const prevView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setActiveView(prevView);
      if (prevView === 'dashboard') setActivePlan(null);
    }
  };

  useEffect(() => {
    const fetchCustomPlans = async () => {
      try {
        const res = await fetch('/api/training?action=list');
        if (res.ok) setCustomPlans(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchCustomPlans();
  }, [activeView]);

  const MenuCard = ({ id, title, desc, icon, color }: any) => (
    <button 
      onClick={() => navigateToView(id)}
      className={`p-12 rounded-[4rem] bg-white border border-slate-200 text-left transition-all group hover:border-${color}-500 hover:shadow-3xl relative overflow-hidden h-full flex flex-col justify-between`}
    >
      <div className="relative z-10">
        <div className={`w-20 h-20 rounded-[2rem] bg-${color}-50 text-${color}-600 flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition-transform`}>{icon}</div>
        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-6">{title}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase leading-relaxed tracking-widest">{desc}</p>
      </div>
      <div className={`absolute -right-10 -bottom-10 w-48 h-48 bg-${color}-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl`}></div>
    </button>
  );

  const SubNav = () => (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3 flex items-center justify-between shrink-0 sticky top-0 z-[100] no-print">
       <div className="flex items-center gap-4">
         <SmartBackButton onClick={handleBack} label="HUB PANOYA DÖN" />
         <div className="h-4 w-px bg-slate-200"></div>
         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AKTİF MODÜL: {activeView.replace('_', ' ')}</span>
       </div>
       <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Link v4</span>
       </div>
    </div>
  );

  if (activeView === 'generated_studio' && activePlan) {
     return (
       <div className="h-full flex flex-col overflow-hidden">
         <SubNav />
         <PresentationStudio customPlan={activePlan} onClose={handleBack} />
       </div>
     );
  }

  if (activeView === 'multimodal_studio') {
      return (
        <div className="h-full flex flex-col overflow-hidden">
          <SubNav />
          <MultimodalStudio onClose={handleBack} />
        </div>
      );
  }

  if (activeView === 'curriculum') {
      return (
        <div className="h-full flex flex-col overflow-hidden">
          <SubNav />
          <CurriculumManager onLaunchStudio={(slides, plan) => {
             const studioPlan: CustomTrainingPlan = {
                id: plan.id, title: plan.title, category: plan.category, level: plan.level as any, 
                description: plan.description, targetBranches: plan.targetBranches as any, 
                curriculum: [], slides: slides, createdBy: 'Sistem', createdAt: Date.now(), status: 'published'
             };
             setActivePlan(studioPlan);
             navigateToView('generated_studio');
          }} />
        </div>
      );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in h-[calc(100vh-6rem)] relative pb-10">
      {/* HUB HEADER */}
      <div className="bg-slate-950 p-12 rounded-[5rem] text-white shadow-3xl relative overflow-hidden border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12 shrink-0">
         <div className="relative z-10 flex items-center gap-10">
            <div className="w-28 h-28 bg-orange-600 rounded-[3.5rem] flex items-center justify-center font-black text-5xl shadow-2xl rotate-3">YG</div>
            <div>
               <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mt-3">Akademi HUB</h2>
               <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-4">Klinik Gelişim ve Müfredat Fabrikası</p>
            </div>
         </div>
         <button 
           onClick={() => navigateToView('multimodal_studio')}
           className="relative z-10 px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white transition-all shadow-2xl"
         >+ ÖZEL EĞİTİM TASARLA</button>
         <div className="absolute -right-40 -bottom-80 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[180px]"></div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-12 pb-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <MenuCard id="curriculum" title="Akademik Katalog" desc="80+ kurumsal eğitim rotası ve branş bazlı akademik müfredatlar." icon="📚" color="blue" />
            <MenuCard id="multimodal_studio" title="Multimodal Stüdyo" desc="AI destekli görsel ve interaktif hizmet içi eğitim üretimi." icon="🎨" color="orange" />
            <MenuCard id="analytics" title="Gelişim İzi" desc="Personel sınav başarıları ve kurumsal yetkinlik ısı haritası." icon="📊" color="emerald" />
         </div>

         {customPlans.length > 0 && (
            <div className="space-y-8 animate-slide-up">
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-4 border-orange-600 pl-4">Yayınlanan Özel Müfredatlar</h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {customPlans.map(plan => (
                     <div 
                        key={plan.id} 
                        onClick={() => { setActivePlan(plan); navigateToView('generated_studio'); }}
                        className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
                     >
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase mb-4 inline-block">{plan.category}</span>
                        <h4 className="text-xl font-black text-slate-900 uppercase leading-tight mb-4 group-hover:text-orange-600 transition-colors">{plan.title}</h4>
                        <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                           <span className="text-[9px] font-black text-slate-300 uppercase">{(plan.slides?.length || 0)} SAYFA</span>
                           <span className="text-[10px] font-black text-orange-600">AÇ →</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default TrainingHub;
