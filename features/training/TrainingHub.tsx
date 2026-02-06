
import React, { useState, useEffect } from 'react';
import PresentationStudio from './PresentationStudio'; // YENİ NESİL MODÜL
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
  
  // AI Generated Content State
  const [generatedSlides, setGeneratedSlides] = useState<TrainingSlide[]>([]);
  const [activePlan, setActivePlan] = useState<any | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/staff?action=list_all');
        if (res.ok) {
          const data = await res.json();
          setStaffStats(data);
        }
        
        const customRes = await fetch('/api/training?action=list');
        if (customRes.ok) {
           setCustomPlans(await customRes.json());
        }
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchStats();
  }, [activeView]);

  const handleLaunchGeneratedStudio = (slides: TrainingSlide[], plan: TrainingPlan) => {
     setGeneratedSlides(slides);
     setActivePlan({
        ...plan,
        slides: slides
     });
     setActiveView('generated_studio');
  };

  const MenuCard = ({ id, title, desc, icon, color }: any) => (
    <button 
      onClick={() => setActiveView(id)}
      className={`p-12 rounded-[4rem] bg-white border border-slate-200 text-left transition-all group hover:border-${color}-500 hover:shadow-3xl relative overflow-hidden h-full flex flex-col justify-between`}
    >
      <div className="relative z-10">
        <div className={`w-20 h-20 rounded-[2rem] bg-${color}-50 text-${color}-600 flex items-center justify-center text-4xl mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
           {icon}
        </div>
        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-6">{title}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase leading-relaxed tracking-widest">{desc}</p>
      </div>
      <div className={`absolute -right-10 -bottom-10 w-48 h-48 bg-${color}-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl`}></div>
    </button>
  );

  // VIEW ROUTING
  if (activeView === 'generated_studio' && activePlan) {
     return <PresentationStudio customPlan={activePlan} onClose={() => setActiveView('curriculum')} />;
  }

  if (activeView === 'multimodal_studio') {
      return <MultimodalStudio onClose={() => setActiveView('dashboard')} />;
  }

  if (activeView === 'curriculum') {
      return <CurriculumManager onLaunchStudio={handleLaunchGeneratedStudio} />;
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in h-[calc(100vh-6rem)] relative pb-10">
      
      {/* COMMAND HEADER */}
      <div className="bg-slate-950 p-12 rounded-[5rem] text-white shadow-3xl relative overflow-hidden border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12 shrink-0">
         <div className="relative z-10 flex items-center gap-10">
            <div className="w-28 h-28 bg-orange-600 rounded-[3.5rem] flex items-center justify-center font-black text-5xl shadow-[0_0_60px_rgba(234,88,12,0.4)] rotate-3">
               <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
               <div className="flex items-center gap-4">
                  <span className="text-[12px] font-black text-orange-500 uppercase tracking-[0.6em]">KOMUTA MERKEZİ</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mt-3">Nöral Akademi Hub</h2>
               <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-4">Kurumsal Liyakat ve Gelişim Yönetimi</p>
            </div>
         </div>
         
         <div className="relative z-10 flex gap-4">
            <button 
              onClick={() => setActiveView('multimodal_studio')}
              className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 hover:text-white transition-all flex items-center gap-4 active:scale-95"
            >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
               ÖZEL EĞİTİM TASARLA
            </button>
         </div>
         <div className="absolute -right-40 -bottom-80 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[180px]"></div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-12 pb-20">
         
         {activeView === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-slide-up">
               <MenuCard 
                  id="curriculum" 
                  title="Akademik Katalog" 
                  desc="80+ kurumsal eğitim rotası, oryantasyon planları ve branş bazlı akademik müfredatlar." 
                  icon="📚" color="blue" 
               />
               <MenuCard 
                  id="multimodal_studio" 
                  title="Multimodal Tasarım" 
                  desc="Görsel, sembol ve AI destekli interaktif hizmet içi eğitim üretim stüdyosu." 
                  icon="🎨" color="orange" 
               />
               <MenuCard 
                  id="analytics" 
                  title="Liyakat İzleme" 
                  desc="Personelin sınav başarıları, gelişim deltalari ve kurumsal yetkinlik ısı haritası." 
                  icon="📊" color="emerald" 
               />
            </div>
         )}

         {activeView === 'dashboard' && customPlans.length > 0 && (
            <div className="space-y-8">
               <div className="flex items-center gap-6 border-b border-slate-200 pb-6">
                  <div className="w-3 h-10 bg-orange-600 rounded-full shadow-lg"></div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Kurum Özel Müfredatlar</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {customPlans.map(plan => (
                     <div 
                        key={plan.id} 
                        onClick={() => { setActivePlan(plan); setActiveView('generated_studio'); }}
                        className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm hover:shadow-3xl transition-all group cursor-pointer relative overflow-hidden"
                     >
                        <div className="flex justify-between items-start mb-8">
                           <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">{plan.category}</span>
                           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 uppercase leading-tight mb-4 group-hover:text-orange-600 transition-colors">{plan.title}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase mb-10 line-clamp-2 leading-relaxed">{plan.description}</p>
                        <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-6">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{(plan.slides?.length || 0)} SLAYT</span>
                           <button className="text-[11px] font-black text-orange-600 group-hover:translate-x-2 transition-transform">İNCELE →</button>
                        </div>
                        <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-orange-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
