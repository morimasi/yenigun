
import React, { useState, useEffect } from 'react';
import PresentationStudio from '../staff-mentor/PresentationStudio';
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
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);

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
     setActivePlan(plan);
     setActiveView('generated_studio');
  };

  const MenuCard = ({ id, title, desc, icon, color }: any) => (
    <button 
      onClick={() => setActiveView(id)}
      className={`p-10 rounded-[3rem] bg-white border border-slate-200 text-left transition-all group hover:border-${color}-500 hover:shadow-2xl relative overflow-hidden h-full flex flex-col justify-between`}
    >
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-[1.5rem] bg-${color}-50 text-${color}-600 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform`}>
           {icon}
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4">{title}</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed tracking-wide">{desc}</p>
      </div>
      <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-${color}-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl`}></div>
    </button>
  );

  if (activeView === 'studio') return <PresentationStudio onClose={() => setActiveView('dashboard')} />;
  
  if (activeView === 'multimodal_studio') return <MultimodalStudio onClose={() => setActiveView('dashboard')} />;

  if (activeView === 'generated_studio' && activePlan) {
     return (
        <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in relative">
           <PresentationStudio 
              initialSlides={generatedSlides} 
              onClose={() => { setActiveView('curriculum'); setGeneratedSlides([]); setActivePlan(null); }} 
           />
           <div className="absolute top-24 right-12 z-[1500] flex flex-col gap-4 no-print">
              <button onClick={() => alert("Personel atama ünitesi aktif edilecek.")} className="px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-slate-100 hover:bg-orange-600 hover:text-white transition-all">PERSONELE ATA</button>
              <button onClick={() => alert("Mühürlendi.")} className="px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-slate-100 hover:bg-emerald-600 hover:text-white transition-all">KÜTÜPHANEYE MÜHÜRLE</button>
           </div>
        </div>
     );
  }

  if (activeView === 'curriculum') return (
    <div className="h-[calc(100vh-6rem)] overflow-hidden">
       <CurriculumManager onLaunchStudio={handleLaunchGeneratedStudio} />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-6rem)] relative pb-10">
      
      {/* COMMAND HEADER */}
      <div className="bg-slate-950 p-10 rounded-[4rem] text-white shadow-3xl relative overflow-hidden border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 shrink-0">
         <div className="relative z-10 flex items-center gap-8">
            <div className="w-24 h-24 bg-orange-600 rounded-[3rem] flex items-center justify-center font-black text-4xl shadow-[0_0_50px_rgba(234,88,12,0.3)] rotate-3">
               <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
               <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em]">KOMUTA MERKEZİ</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mt-2">Nöral Akademi Hub</h2>
               <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Kurumsal Liyakat ve Gelişim Yönetimi</p>
            </div>
         </div>
         
         <div className="relative z-10 flex gap-4">
            <button 
              onClick={() => setActiveView('multimodal_studio')}
              className="px-8 py-4 bg-white text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 hover:text-white transition-all flex items-center gap-3"
            >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
               ÖZEL EĞİTİM TASARLA
            </button>
         </div>
         <div className="absolute -right-20 -bottom-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
         
         {activeView === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
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

         {/* Kurumsal Özel Eğitimler Bölümü */}
         {activeView === 'dashboard' && customPlans.length > 0 && (
            <div className="space-y-6">
               <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                  <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Kurum Özel Müfredatlar</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {customPlans.map(plan => (
                     <div key={plan.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                           <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest">{plan.category}</span>
                           <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 uppercase leading-tight mb-4">{plan.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-8 line-clamp-2">{plan.description}</p>
                        <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-4">
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{plan.slides.length} SLAYT</span>
                           <button className="text-[10px] font-black text-orange-600 hover:text-slate-900 transition-colors">İNCELE →</button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {activeView === 'analytics' && (
            <div className="bg-white p-12 rounded-[4.5rem] border border-slate-200 shadow-2xl overflow-hidden">
               <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-12 border-l-8 border-orange-600 pl-8">Kurumsal Yetkinlik Matrisi</h4>
               <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={staffStats.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} domain={[0, 100]} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', fontSize: '12px', fontWeight: 'bold' }} />
                        <Bar dataKey="last_score" radius={[15, 15, 0, 0]} barSize={40}>
                           {staffStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.last_score > 85 ? '#10b981' : entry.last_score > 65 ? '#ea580c' : '#ef4444'} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default TrainingHub;
