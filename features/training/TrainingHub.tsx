
import React, { useState, useEffect } from 'react';
import PresentationStudio from './PresentationStudio';
import CurriculumManager from './CurriculumManager';
import MultimodalStudio from './MultimodalStudio';
import { StaffMember, IDP, TrainingSlide, CustomTrainingPlan } from '../../types';
import { TrainingPlan } from './curriculumData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type TrainingView = 'dashboard' | 'curriculum' | 'studio' | 'analytics' | 'generated_studio' | 'multimodal_studio';

const TrainingHub: React.FC = () => {
  const [activeView, setActiveView] = useState<TrainingView>('dashboard');
  const [staffStats, setStaffStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customPlans, setCustomPlans] = useState<CustomTrainingPlan[]>([]);
  const [generatedSlides, setGeneratedSlides] = useState<TrainingSlide[]>([]);
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/staff?action=list_all');
        if (res.ok) setStaffStats(await res.json());
        const customRes = await fetch('/api/training?action=list');
        if (customRes.ok) setCustomPlans(await customRes.json());
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchStats();
  }, [activeView]);

  const handleLaunchGeneratedStudio = (slides: TrainingSlide[], plan: TrainingPlan) => {
     setGeneratedSlides(slides);
     setActivePlan(plan);
     setActiveView('generated_studio');
  };

  const MenuCard = ({ id, title, desc, icon, color }: any) => (
    <button 
      onClick={() => setActiveView(id)}
      className={`p-10 rounded-[4rem] bg-white border border-slate-200 text-left transition-all group hover:border-${color}-500 hover:shadow-2xl relative overflow-hidden h-full flex flex-col justify-between`}
    >
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-[1.5rem] bg-${color}-50 text-${color}-600 flex items-center justify-center text-3xl mb-10 group-hover:scale-110 transition-transform`}>
           {icon}
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4">{title}</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed tracking-wide">{desc}</p>
      </div>
      <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-${color}-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl`}></div>
    </button>
  );

  if (activeView === 'multimodal_studio') return <MultimodalStudio onClose={() => setActiveView('dashboard')} />;

  if (activeView === 'generated_studio' && activePlan) {
     return <PresentationStudio 
              initialSlides={generatedSlides} 
              onClose={() => { setActiveView('curriculum'); setGeneratedSlides([]); setActivePlan(null); }} 
            />;
  }

  if (activeView === 'curriculum') return <CurriculumManager onLaunchStudio={handleLaunchGeneratedStudio} />;

  return (
    <div className="flex flex-col gap-8 animate-fade-in h-[calc(100vh-6rem)] relative pb-10">
      <div className="bg-slate-950 p-12 rounded-[5rem] text-white shadow-3xl relative overflow-hidden border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 shrink-0">
         <div className="relative z-10 flex items-center gap-10">
            <div className="w-28 h-28 bg-orange-600 rounded-[3.5rem] flex items-center justify-center font-black text-5xl shadow-[0_0_60px_rgba(234,88,12,0.4)] rotate-3">
               <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
               <div className="flex items-center gap-4">
                  <span className="text-[12px] font-black text-orange-500 uppercase tracking-[0.6em]">AKADEMİK KOMUTA</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mt-3">Müfredat Fabrikası</h2>
               <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-4">Kurumsal Liyakat ve Gelişim Kütüphanesi</p>
            </div>
         </div>
         
         <div className="relative z-10">
            <button 
              onClick={() => setActiveView('multimodal_studio')}
              className="px-12 py-6 bg-white text-slate-950 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-3xl hover:bg-orange-600 hover:text-white transition-all flex items-center gap-4"
            >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
               ÖZEL EĞİTİM TASARLA
            </button>
         </div>
         <div className="absolute -right-20 -bottom-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
         <MenuCard id="curriculum" title="Akademik Katalog" desc="80+ kurumsal eğitim rotası, oryantasyon planları ve branş bazlı akademik müfredatlar." icon="📚" color="blue" />
         <MenuCard id="multimodal_studio" title="Multimodal Studio" desc="Görsel, sembol ve AI destekli interaktif hizmet içi eğitim üretim stüdyosu." icon="🎨" color="orange" />
         <MenuCard id="analytics" title="Liyakat İzleme" desc="Personelin gelişim deltaları ve kurumsal yetkinlik ısı haritası." icon="📊" color="emerald" />
      </div>

      {customPlans.length > 0 && (
         <div className="space-y-8 mt-4">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-[12px] border-orange-600 pl-8">Kurumsal Özel Müfredatlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {customPlans.map(plan => (
                  <div key={plan.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between">
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                           <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest">{plan.category}</span>
                           <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 uppercase leading-tight mb-4 group-hover:text-orange-600 transition-colors">{plan.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-8 line-clamp-2 leading-relaxed">{plan.description}</p>
                     </div>
                     <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-50 relative z-10">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{plan.slides?.length || 0} ÜNİTE</span>
                        <button className="text-[11px] font-black text-orange-600 hover:text-slate-950 transition-colors">YÖNET →</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default TrainingHub;
